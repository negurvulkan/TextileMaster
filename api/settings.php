<?php
require_once __DIR__ . '/../core/response.php';
require_once __DIR__ . '/../models/SettingModel.php';

$model = new SettingModel();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        $updated = $_GET['updated_since'] ?? null;
        $data = $model->getAll($id, $updated);
        jsonResponse($data);
        break;
    case 'POST':
        $payload = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $id = $model->create($payload);
            jsonResponse(['id' => $id], 201);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;
    case 'PUT':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if (!$id) {
            jsonResponse(['error' => 'ID required'], 400);
        }
        $payload = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $model->update($id, $payload);
            jsonResponse(['success' => true]);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;
    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if (!$id) {
            jsonResponse(['error' => 'ID required'], 400);
        }
        $model->softDelete($id);
        jsonResponse(['success' => true]);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

/* Example:
GET /api/settings.php
*/
