<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

switch ($_SERVER['REQUEST_METHOD']) {
    case "OPTIONS": 
        header("Access-Control-Allow-Origin: https://join.gloriacodes.de");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        exit;

    case "POST":
        header("Access-Control-Allow-Origin: https://join.gloriacodes.de");
        header("Content-Type: application/json");

        // Eingaben validieren
        $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

        if (!$email) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid email address. Please provide a valid email."
            ]);
            exit;
        }

        // E-Mail-Text erstellen
        $message = "Hello JOIN-User,\n\n";
        $message .= "We're sorry to hear that you've forgotten your JOIN password for your account: $email.\n";
        $message .= "But don't worry, we can help you reset it quickly and easily.\n\n";
        $message .= "To reset your password, simply click on the following link:\n";
        $message .= "https://join.gloriacodes.de/reset_password.html?email=" . urlencode($email) . "\n\n";
        $message .= "You'll be asked to create a new password. Please enter your new password twice to confirm.\n";
        $message .= "Once you've created your new password, you'll be able to log in to your account immediately.\n\n";
        $message .= "If you have any issues or questions, please feel free to contact us. We're always here to help.\n\n";
        $message .= "Best regards,\nYour JOIN-TEAM";

        // E-Mail-Header
        $headers = [];
        $headers[] = "From: noreply@join-reset-password.com";
        $headers[] = "Reply-To: noreply@join-reset-password.com";
        $headers[] = "X-Mailer: PHP/" . phpversion();

        // E-Mail senden
        if (mail($email, "Reset your password for JOIN App", $message, implode("\r\n", $headers))) {
            echo json_encode([
                "success" => true,
                "message" => "Password reset email sent successfully."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to send email. Please check server settings."
            ]);
        }
        exit;

    default:
        header("Allow: POST", true, 405);
        exit;
}
