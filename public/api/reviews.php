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
    'count' => 296,
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

// 3. Cargar clave de API de Google Places
// Prioridad: 1) variable de entorno, 2) archivo de configuración local config.php (ignorado por git)
$configFile = __DIR__ . '/config.php';
$localConfig = file_exists($configFile) ? @include($configFile) : [];
$googleApiKey = getenv('GOOGLE_PLACES_API_KEY') ?: (is_array($localConfig) && isset($localConfig['GOOGLE_PLACES_API_KEY']) ? $localConfig['GOOGLE_PLACES_API_KEY'] : '');
$cacheTtl = 43200; // 12 horas entre consultas a Google

if (!empty($googleApiKey) && !empty($data['place_id'])) {
    $now = time();
    if (($now - intval($data['last_check'] ?? 0)) > $cacheTtl) {
        $data['last_check'] = $now;
        $placeId = urlencode($data['place_id']);
        $updated = false;

        // 3.1. Intentar primero con Places API (New v1)
        $placeNewEndpoint = "https://places.googleapis.com/v1/places/{$placeId}?fields=rating,userRatingCount,displayName";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $placeNewEndpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "X-Goog-Api-Key: {$googleApiKey}",
            "X-Goog-FieldMask: rating,userRatingCount,displayName"
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $response) {
            $googleData = json_decode($response, true);
            if (isset($googleData['userRatingCount']) && intval($googleData['userRatingCount']) > 0) {
                $data['count'] = intval($googleData['userRatingCount']);
                $updated = true;
            }
            if (isset($googleData['rating']) && floatval($googleData['rating']) > 0) {
                $data['rating'] = floatval($googleData['rating']);
                $updated = true;
            }
        }

        // 3.2. Fallback a endpoint legacy en caso de ser necesario
        if (!$updated) {
            $placeLegacyUrl = "https://maps.googleapis.com/maps/api/place/details/json?place_id={$placeId}&fields=rating,user_ratings_total&key=" . urlencode($googleApiKey);
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $placeLegacyUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            $responseLegacy = curl_exec($ch);
            curl_close($ch);

            if ($responseLegacy) {
                $googleDataLegacy = json_decode($responseLegacy, true);
                if (isset($googleDataLegacy['status']) && $googleDataLegacy['status'] === 'OK' && isset($googleDataLegacy['result'])) {
                    $result = $googleDataLegacy['result'];
                    if (isset($result['user_ratings_total']) && intval($result['user_ratings_total']) > 0) {
                        $data['count'] = intval($result['user_ratings_total']);
                        $updated = true;
                    }
                    if (isset($result['rating']) && floatval($result['rating']) > 0) {
                        $data['rating'] = floatval($result['rating']);
                        $updated = true;
                    }
                }
            }
        }

        if ($updated) {
            $data['last_updated'] = $now;
        }

        $dataDir = __DIR__ . '/data';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }
        @file_put_contents($cacheFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

$count = intval($data['count'] ?? 296);
$rating = number_format(floatval($data['rating'] ?? 5.0), 1, ',', '.');

echo json_encode([
    'success' => true,
    'rating' => $rating,
    'count' => $count,
    'display' => "★ {$rating} · {$count} reseñas en Google",
    'trust_subtitle' => "{$count} personas nos calificaron",
    'last_updated' => $data['last_updated'] ?? time(),
], JSON_UNESCAPED_UNICODE);
