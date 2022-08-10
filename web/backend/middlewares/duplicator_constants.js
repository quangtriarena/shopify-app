export const ValidResources = ['product', 'custom_collection', 'smart_collection']

export const ProductFields = [
  'id',
  'handle',
  'title',
  'body_html',
  'vendor',
  'product_type',
  'published_at',
  'template_suffix',
  'status',
  'published_scope',
  'tags',
  'option1_name',
  'option1_values',
  'option2_name',
  'option2_values',
  'option3_name',
  'option3_values',
]

export const MetafieldFields = [
  'id',
  'namespace',
  'key',
  'value',
  'description',
  'owner_id',
  'owner_resource',
  'type',
]

export const VariantFields = [
  'id',
  'title',
  'price',
  'sku',
  'position',
  'inventory_policy',
  'compare_at_price',
  'fulfillment_service',
  'inventory_management',
  'option1',
  'option2',
  'option3',
  'taxable',
  'barcode',
  'grams',
  'image_id',
  'weight',
  'weight_unit',
  'inventory_item_id',
  'inventory_quantity',
  'old_inventory_quantity',
  'requires_shipping',
]

export const ImageFields = ['id', 'position', 'alt', 'width', 'height', 'src', 'variant_ids']

export const CollectionImageFields = ['alt', 'src', 'width', 'height']

export const CustomCollectionFields = [
  'id',
  'handle',
  'title',
  'body_html',
  'published_at',
  'sort_order',
  'template_suffix',
  'published_scope',
]

export const SmartCollectionRuleFields = ['column', 'relation', 'condition']

export const SmartCollectionFields = [
  'id',
  'handle',
  'title',
  'body_html',
  'published_at',
  'sort_order',
  'template_suffix',
  'disjunctive',
  'published_scope',
]
