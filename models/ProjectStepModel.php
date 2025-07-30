<?php
require_once __DIR__ . '/BaseModel.php';

class ProjectStepModel extends BaseModel
{
    protected string $table = 'project_steps';
    protected array $fields = ['step_id','project_id','motif_id','custom_sort_order'];
}
