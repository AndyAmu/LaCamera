<?php
/**
 * Estudio La Cámera - API de Contacto
 * Compatible con hosting Ferozo / cPanel (PHP 7.4 - 8.3)
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Set timezone to Buenos Aires
date_default_timezone_set('America/Argentina/Buenos_Aires');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// Receive payload (JSON or POST form-data)
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!is_array($input)) {
    $input = $_POST;
}

// 1. Anti-spam Honeypot Check
$honeypot = isset($input['website']) ? trim($input['website']) : (isset($input['honeypot']) ? trim($input['honeypot']) : '');
if (!empty($honeypot)) {
    // Silently succeed for bots
    echo json_encode(['success' => true, 'message' => 'OK']);
    exit;
}

// 2. Sanitize and Extract Fields
$nombre = isset($input['nombre']) ? trim(strip_tags($input['nombre'])) : '';
$telefono = isset($input['telefono']) ? trim(strip_tags($input['telefono'])) : '';
$email = isset($input['email']) ? trim(strip_tags($input['email'])) : '';
$tipoAccidente = isset($input['tipo_accidente']) ? trim(strip_tags($input['tipo_accidente'])) : '';
$huboLesionados = isset($input['hubo_lesionados']) ? trim(strip_tags($input['hubo_lesionados'])) : 'No especificado';
$mensaje = isset($input['mensaje']) ? trim(strip_tags($input['mensaje'])) : '';
$origenFormulario = isset($input['origen_formulario']) ? trim(strip_tags($input['origen_formulario'])) : 'desconocido';
$origenVisita = isset($input['origen_visita']) ? trim(strip_tags($input['origen_visita'])) : 'Directo';
$politicaPrivacidad = isset($input['politica_privacidad']) ? (bool)$input['politica_privacidad'] : false;

// 3. Validation
$errors = [];

if (empty($nombre)) {
    $errors['nombre'] = 'Escribí tu nombre para que sepamos cómo llamarte.';
}

// Clean phone: remove spaces, dashes, parentheses
$phoneClean = preg_replace('/[^\d]/', '', $telefono);
if (strlen($phoneClean) < 10) {
    $errors['telefono'] = 'Revisá el número: tiene que tener 10 dígitos con el código de área (ej.: 11 1234-5678).';
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Revisá el email, parece que falta algo.';
}

if (empty($tipoAccidente) || $tipoAccidente === 'Elegí una opción') {
    $errors['tipo_accidente'] = 'Elegí el tipo de accidente.';
}

if (!$politicaPrivacidad) {
    $errors['politica_privacidad'] = 'Para enviar la consulta, aceptá la política de privacidad.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

$now = date('Y-m-d H:i:s');
$fechaLegible = date('d/m/Y H:i:s');

// 4. Save local backup to secure CSV / JSON
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$backupRecord = [
    'fecha' => $now,
    'nombre' => $nombre,
    'telefono' => $telefono,
    'email' => $email,
    'tipo_accidente' => $tipoAccidente,
    'hubo_lesionados' => $huboLesionados,
    'mensaje' => $mensaje,
    'origen_formulario' => $origenFormulario,
    'origen_visita' => $origenVisita,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido',
];

$csvFile = $dataDir . '/consultas.csv';
$csvExists = file_exists($csvFile);
if ($handle = @fopen($csvFile, 'a')) {
    if (!$csvExists) {
        fputcsv($handle, array_keys($backupRecord));
    }
    fputcsv($handle, array_values($backupRecord));
    fclose($handle);
}

// 5. Send notification email to the firm (info@estudiolacamera.com.ar)
$toFirm = 'info@estudiolacamera.com.ar';

$isLesionados = (stripos($huboLesionados, 'sí') !== false || stripos($huboLesionados, 'si') !== false);
if ($isLesionados) {
    $firmSubject = "Nueva consulta web – {$tipoAccidente} – CON LESIONADOS – {$nombre}";
} else {
    $firmSubject = "Nueva consulta web – {$tipoAccidente} – {$nombre}";
}

// Encode subject for UTF-8 compatibility
$firmSubjectEncoded = '=?UTF-8?B?' . base64_encode($firmSubject) . '?=';

$firmReplyTo = (!empty($email)) ? $email : 'info@estudiolacamera.com.ar';

$headersFirm = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Estudio La Cámera <info@estudiolacamera.com.ar>',
    "Reply-To: {$firmReplyTo}",
    'X-Mailer: PHP/' . phpversion()
];

$firmHtml = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>{$firmSubject}</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 20px;'>
  <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;'>
    <div style='background: #0f2338; color: #ffffff; padding: 24px; text-align: center;'>
      <h2 style='margin: 0; font-size: 20px;'>Nueva Consulta desde el Sitio Web</h2>
      <p style='margin: 6px 0 0 0; color: #e2e8f0; font-size: 14px;'>{$fechaLegible} hs</p>
    </div>
    <div style='padding: 24px;'>
      " . ($isLesionados ? "<div style='background: #fef2f2; border: 1px solid #f87171; color: #b91c1c; padding: 12px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;'>⚠️ CASO CON PERSONAS LESIONADAS</div>" : "") . "
      <table style='width: 100%; border-collapse: collapse;'>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 160px;'>Nombre:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>{$nombre}</td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Teléfono:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'><a href='tel:{$phoneClean}' style='color: #0f2338; font-weight: bold;'>{$telefono}</a></td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>WhatsApp directo:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'><a href='https://wa.me/549{$phoneClean}' style='color: #25d366; font-weight: bold;' target='_blank'>Abrir chat de WhatsApp</a></td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Email:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>" . (!empty($email) ? "<a href='mailto:{$email}'>{$email}</a>" : "No informado") . "</td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Tipo de accidente:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'><strong>{$tipoAccidente}</strong></td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>¿Hubo lesionados?:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>{$huboLesionados}</td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Formulario origen:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>{$origenFormulario}</td></tr>
        <tr><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Origen de visita:</td><td style='padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>{$origenVisita}</td></tr>
      </table>
      <div style='margin-top: 20px;'>
        <p style='font-weight: bold; margin-bottom: 6px;'>Detalle / Mensaje:</p>
        <div style='background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;'>" . (!empty($mensaje) ? $mensaje : "Sin mensaje adicional") . "</div>
      </div>
    </div>
  </div>
</body>
</html>
";

@mail($toFirm, $firmSubjectEncoded, $firmHtml, implode("\r\n", $headersFirm));

// 6. Send automatic confirmation email to the user (if email was provided)
if (!empty($email)) {
    $userSubject = 'Recibimos tu consulta – Estudio La Cámera';
    $userSubjectEncoded = '=?UTF-8?B?' . base64_encode($userSubject) . '?=';

    $headersUser = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: Estudio La Cámera <info@estudiolacamera.com.ar>',
        'Reply-To: info@estudiolacamera.com.ar',
        'X-Mailer: PHP/' . phpversion()
    ];

    $userBody = "Hola, {$nombre}:\n\n"
              . "Recibimos tu consulta sobre {$tipoAccidente}. Un abogado del estudio la va a revisar y te va a contactar al {$telefono} a la brevedad.\n\n"
              . "Si tu caso es urgente, escribinos por WhatsApp al 11 5879-4246.\n\n"
              . "Mientras tanto, te recomendamos no firmar nada ni aceptar ofertas del seguro sin asesorarte.\n\n"
              . "Estudio La Cámera\n"
              . "Martín y Omar 129, Piso 2, Of. 211, San Isidro\n"
              . "11 5879-4246 · info@estudiolacamera.com.ar\n";

    @mail($email, $userSubjectEncoded, $userBody, implode("\r\n", $headersUser));
}

// 7. Response
echo json_encode([
    'success' => true,
    'message' => 'Consulta recibida correctamente',
    'nombre' => $nombre,
    'telefono' => $telefono
]);
