<?php
// api/contact.php

// CORS Headers für Development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Nur POST-Requests erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// JSON-Daten empfangen
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Logging für Debugging (optional)
// error_log("Received data: " . print_r($data, true));

// Validierung
$errors = [];

if (empty($data['name'])) {
    $errors[] = 'Name ist erforderlich';
}

if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Gültige E-Mail ist erforderlich';
}

if (empty($data['subject'])) {
    $errors[] = 'Betreff ist erforderlich';
}

if (empty($data['message'])) {
    $errors[] = 'Nachricht ist erforderlich';
}

if (!isset($data['privacy']) || $data['privacy'] !== 'on') {
    $errors[] = 'Datenschutzerklärung muss akzeptiert werden';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Daten bereinigen
$name = htmlspecialchars(strip_tags($data['name']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars(strip_tags($data['phone'])) : 'Nicht angegeben';
$subject = htmlspecialchars(strip_tags($data['subject']));
$message = htmlspecialchars(strip_tags($data['message']));

// Betreff-Mapping für bessere Lesbarkeit
$subject_labels = [
    'bautraeger' => 'Bauträger',
    'baubetreuung' => 'Baubetreuung',
    'baubetreuung-plus' => 'Baubetreuung Plus',
    'gruendach' => 'Gründach',
    'sonstiges' => 'Sonstiges'
];
$subject_display = isset($subject_labels[$subject]) ? $subject_labels[$subject] : $subject;

// E-Mail-Einstellungen
$to = 'info@casago.de';
$email_subject = 'Kontaktanfrage: ' . $subject_display;

// E-Mail-Body erstellen (HTML)
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Neue Kontaktanfrage - CASAGO GmbH</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>E-Mail:</div>
                <div class='value'>$email</div>
            </div>
            <div class='field'>
                <div class='label'>Telefon:</div>
                <div class='value'>$phone</div>
            </div>
            <div class='field'>
                <div class='label'>Betreff:</div>
                <div class='value'>$subject_display</div>
            </div>
            <div class='field'>
                <div class='label'>Nachricht:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            Gesendet über das Kontaktformular von casago.de
        </div>
    </div>
</body>
</html>
";

// E-Mail-Headers für HTML
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: CASAGO Kontaktformular <noreply@casago.de>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// E-Mail senden
$mail_sent = mail($to, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Optional: Bestätigungsmail an Kunden senden
    $customer_subject = 'Vielen Dank für Ihre Anfrage - CASAGO GmbH';
    $customer_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; }
            .content { padding: 20px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>CASAGO GmbH</h2>
            </div>
            <div class='content'>
                <p>Sehr geehrte(r) $name,</p>
                <p>vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
                <p><strong>Ihre Nachricht:</strong><br>" . nl2br($message) . "</p>
                <p>Mit freundlichen Grüßen<br>Ihr CASAGO Team</p>
                <hr>
                <p style='font-size: 12px; color: #999;'>
                    CASAGO GmbH<br>
                    Am Queracker 6<br>
                    83134 Prutting<br>
                    Tel: +49 803 690869-86<br>
                    E-Mail: info@casago.de
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $customer_headers = "MIME-Version: 1.0\r\n";
    $customer_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $customer_headers .= "From: CASAGO GmbH <info@casago.de>\r\n";
    
    mail($email, $customer_subject, $customer_body, $customer_headers);
    
    // Erfolg
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Nachricht erfolgreich gesendet'
    ]);
} else {
    // Fehler
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Fehler beim Senden der E-Mail'
    ]);
}
?>