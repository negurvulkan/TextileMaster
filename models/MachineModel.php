<?php
require_once __DIR__ . '/BaseModel.php';

class MachineModel extends BaseModel
{
    protected string $table = 'machines';
    protected array $fields = ['name','machine_type','location','notes','last_used_at','updated_by','active'];
}
