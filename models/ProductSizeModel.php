<?php
require_once __DIR__ . '/BaseModel.php';

class ProductSizeModel extends BaseModel
{
    protected string $table = 'product_sizes';
    protected array $fields = ['product_id','size_label','target_quantity','actual_quantity'];
}
