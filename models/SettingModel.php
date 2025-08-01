<?php
require_once __DIR__ . '/BaseModel.php';

class SettingModel extends BaseModel
{
    protected string $table = 'settings';
    protected array $fields = ['setting_key','setting_value'];

    public function create(array $data): int
    {
        $filtered = array_intersect_key($data, array_flip($this->fields));
        $columns = array_keys($filtered);
        if (!$columns) {
            throw new Exception('No data');
        }
        $placeholders = implode(',', array_fill(0, count($columns), '?'));
        $sql = "INSERT INTO {$this->table} (" . implode(',', $columns) . ", updated_at) VALUES ($placeholders, NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($filtered));
        return (int)$this->db->lastInsertId();
    }
}
