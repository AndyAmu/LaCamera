<?php
/**
 * Estudio La Cámera - API de Reseñas Dinámicas de Google
 * Compatible con hosting Ferozo / cPanel (PHP 7.4 - 8.3)
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=1800'); // 30 minutos de caché
header('X-Content-Type-Options: nosniff');

date_default_timezone_set('America/Argentina/Buenos_Aires');

$cacheFile = __DIR__ . '/data/reviews-cache.json';

// Valores de respaldo por defecto
$defaultData = [
    'rating' => 5.0,
    'count' => 293,
    'place_id' => getenv('GOOGLE_PLACES_ID') ?: 'ChIJW_IlRDSwv5URDx1I2MWnAbY',
    'last_updated' => time(),
    'last_check' => time(),
];

// 1. Cargar caché existente
$data = $defaultData;
if (file_exists($cacheFile)) {
    $content = @file_get_contents($cacheFile);
    $decoded = json_decode($content, true);
    if (is_array($decoded)) {
        $data = array_merge($defaultData, $decoded);
    }
}

// 2. Soporte para sincronización manual o vía webhook / cron
// Ejemplo: /api/reviews.php?secret=elc_sync_reviews_2026&count=298
$secretKey = getenv('REVIEWS_SYNC_SECRET') ?: 'elc_sync_reviews_2026';
if (isset($_GET['secret']) && $_GET['secret'] === $secretKey && isset($_GET['count'])) {
    $newCount = intval($_GET['count']);
    if ($newCount > 0) {
        $data['count'] = $newCount;
        if (isset($_GET['rating'])) {
            $data['rating'] = floatval($_GET['rating']);
        }
        $data['last_updated'] = time();
        $data['last_check'] = time();
        @file_put_contents($cacheFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

// 3. Si se configuró una API Key oficial de Google Places en el entorno / hosting
$googleApiKey = getenv('GOOGLE_PLACES_API_KEY');
$cacheTtl = 43200; // 12 horas entre consultas a Google

if (!empty($googleApiKey) && !empty($data['place_id'])) {
    $now = time();
    if (($now - intval($data['last_check'] ?? 0)) > $cacheTtl) {
        $data['last_check'] = $now;
        
        $placeUrl = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" . urlencode($data['place_id']) . "&fields=rating,user_ratings_total&key=" . urlencode($googleApiKey);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $placeUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            $googleData = json_decode($response, true);
            if (isset($googleData['status']) && $googleData['status'] === 'OK' && isset($googleData['result'])) {
                $result = $googleData['result'];
                if (isset($result['user_ratings_total']) && intval($result['user_ratings_total']) > 0) {
                    $data['count'] = intval($result['user_ratings_total']);
                }
                if (isset($result['rating']) && floatval($result['rating']) > 0) {
                    $data['rating'] = floatval($result['rating']);
                }
                $data['last_updated'] = $now;
            }
        }
        
        @file_put_contents($cacheFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

$count = intval($data['count'] ?? 293);
$rating = number_format(floatval($data['rating'] ?? 5.0), 1, ',', '.');

echo json_encode([
    'success' => true,
    'rating' => $rating,
    'count' => $count,
    'display' => "★ {$rating} · {$count} reseñas en Google",
    'trust_subtitle' => "{$count} personas nos calificaron",
    'last_updated' => $data['last_updated'] ?? time(),
], JSON_UNESCAPED_UNICODE);
