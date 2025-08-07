<?php
require_once __DIR__ . '/BaseModel.php';

class StepModel extends BaseModel
{
    protected string $table = 'steps';
    protected array $fields = ['name','description','sort_order','created_by','updated_by'];
}
