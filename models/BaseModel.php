<?php
require_once __DIR__ . '/../core/Database.php';

abstract class BaseModel
{
    protected string $table;
    protected array $fields = [];
    protected \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll(?int $id = null, ?string $updatedSince = null): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE deleted_at IS NULL";
        $params = [];
        if ($id !== null) {
            $sql .= " AND id = ?";
            $params[] = $id;
        }
        if ($updatedSince !== null) {
            $sql .= " AND updated_at >= ?";
            $params[] = $updatedSince;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $filtered = array_intersect_key($data, array_flip($this->fields));
        $columns = array_keys($filtered);
        $placeholders = implode(',', array_fill(0, count($columns), '?'));
        $sql = "INSERT INTO {$this->table} (" . implode(',', $columns) . ", created_at, updated_at) VALUES ($placeholders, NOW(), NOW())";
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
        $sql = "UPDATE {$this->table} SET " . implode(',', $sets) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $values = array_values($filtered);
        $values[] = $id;
        return $stmt->execute($values);
    }

    public function softDelete(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET deleted_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
