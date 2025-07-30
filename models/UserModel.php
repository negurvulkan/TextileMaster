<?php
require_once __DIR__ . '/BaseModel.php';

class UserModel extends BaseModel
{
    protected string $table = 'users';
    protected array $fields = ['username','role','password_hash','active'];
}
