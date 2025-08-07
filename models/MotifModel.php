<?php
require_once __DIR__ . '/BaseModel.php';

class MotifModel extends BaseModel
{
    protected string $table = 'motifs';
    protected array $fields = ['project_id','name','description','sort_order'];
}
