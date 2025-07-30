<?php
require_once __DIR__ . '/../core/response.php';
require_once __DIR__ . '/../models/UserModel.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$username = $payload['username'] ?? '';
$password = $payload['password'] ?? '';

if (!$username || !$password) {
    jsonResponse(['error' => 'Username and password required'], 400);
}

$model = new UserModel();
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare('SELECT * FROM users WHERE username = ? AND deleted_at IS NULL AND active = 1');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

$stored = $user['password_hash'] ?? '';
$valid = false;
if (strlen($stored) === 64) {
    $valid = hash('sha256', $password) === $stored;
} else {
    $valid = $password === $stored;
}

if (!$valid) {
    jsonResponse(['error' => 'Invalid credentials'], 401);
}

unset($user['password_hash']);
jsonResponse($user);
