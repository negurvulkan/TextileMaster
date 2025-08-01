<?php
require_once __DIR__ . '/BaseModel.php';

class ProductModel extends BaseModel
{
    protected string $table = 'products';
    protected array $fields = ['motif_id','product_type','color','gender','article_number'];
}
