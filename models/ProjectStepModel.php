<?php
require_once __DIR__ . '/BaseModel.php';

class ProjectStepModel extends BaseModel
{
    protected string $table = 'project_steps';
    protected array $fields = ['step_id','project_id','motif_id','custom_sort_order'];

    public function create(array $data): int
    {
        $filtered = array_intersect_key($data, array_flip($this->fields));
        $columns = array_keys($filtered);
        if (!$columns) {
            throw new Exception('No data');
        }
        $placeholders = implode(',', array_fill(0, count($columns), '?'));
        $sql = "INSERT INTO {$this->table} (" . implode(',', $columns) . ") VALUES ($placeholders)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($filtered));
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $filtered = array_intersect_key($data, array_flip($this->fields));
        if (!$filtered) {
            return false;
        }
        $sets = [];
        foreach ($filtered as $column => $value) {
            $sets[] = "$column = ?";
        }
        $sql = "UPDATE {$this->table} SET " . implode(',', $sets) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $values = array_values($filtered);
        $values[] = $id;
        return $stmt->execute($values);
    }
}
