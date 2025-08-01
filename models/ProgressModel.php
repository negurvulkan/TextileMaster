<?php
require_once __DIR__ . '/BaseModel.php';

class ProgressModel extends BaseModel
{
    protected string $table = 'progress';
    protected array $fields = [
        'user_id','project_id','motif_id','product_id','product_size_id',
        'step_id','machine_id','quantity','timestamp'
    ];
}
