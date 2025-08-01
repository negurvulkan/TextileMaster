<?php
require_once __DIR__ . '/BaseModel.php';

class ProjectModel extends BaseModel
{
    protected string $table = 'projects';
    protected array $fields = ['name','description','start_date','end_date'];
}
