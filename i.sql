
Table "api_keys" {
  "id" bigint [pk, not null]
  "_key" varchar(255) [not null]
  "status" tinyint [not null, default: "1"]
  "permission" varchar(255) [not null]
}

Table "brands" {
  "id" bigint [pk, not null]
  "name" varchar(255) [not null]
  "category_id" bigint [not null]
  "thumbnail" varchar(255) [not null]
  "description" varchar(255) [default: NULL]
  "created_at" timestamp [default: NULL]
  "updated_at" timestamp [default: NULL]
  "created_by" bigint [default: NULL]
  "updated_by" bigint [default: NULL]
}

Table "carts" {
  "id" bigint [pk, not null]
  "user_id" bigint [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "updated_at" timestamp [default: NULL]
}

Table "cart_items" {
  "id" bigint [pk, not null]
  "product_id" bigint [not null]
  "quantity" int [not null]
  "discount_id" bigint [default: NULL]
  "cart_id" bigint [not null]
  "code" varchar(100) [default: NULL]
  "is_check" int [not null, default: "0"]
}

Table "categories" {
  "id" bigint [pk, not null]
  "name" varchar(255) [default: NULL]
  "slug" varchar(255) [default: NULL]
  "user_id" bigint [not null]
  "thumbnail" varchar(255) [default: NULL]
  "description" varchar(255) [default: NULL]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "updated_at" timestamp [default: NULL]
  "is_active" tinyint [not null, default: "1"]
  "is_delete" tinyint [not null, default: "0"]
  "parent_id" bigint [not null]
  "role" varchar(255) [not null, default: "SHOP"]
}

Table "delivery_methods" {
  "id" int [pk, not null]
  "name" varchar(255) [not null]
  "description" varchar(255) [default: NULL]
  "estimated_time" varchar(255) [default: NULL]
  "cost" decimal(10,2) [default: NULL]
  "is_active" int [default: "2"]
}

Table "discounts" {
  "id" bigint [pk, not null]
  "name" varchar(255) [not null]
  "description" varchar(255) [not null]
  "type_price" varchar(50) [not null, default: "fixed_amount"]
  "type" varchar(100) [not null, default: "products"]
  "value" float [not null]
  "code" varchar(10) [not null]
  "start_date" timestamp [not null]
  "end_date" timestamp [not null]
  "max_uses" int [not null]
  "uses_count" int [not null, default: "0"]
  "max_uses_per_user" int [not null]
  "history" json [default: NULL]
  "min_order_value" int [not null]
  "shop_id" int [not null]
  "is_active" tinyint [not null]
  "applies_to" varchar(50) [not null, default: "all"]
  "created_at" timestamp [not null, default: `CURRENT_TIMESTAMP`]
  "is_delete" tinyint [not null, default: "0"]
  "status" varchar(250) [not null, default: "active"]
}

Table "discount_products" {
  "id" int [pk, not null]
  "product_id" bigint [not null]
  "discount_id" bigint [not null]
}

Table "favourites" {
  "id" bigint [pk, not null]
  "user_id" bigint [not null]
  "created_at" timestamp [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" timestamp [default: NULL]
}

Table "favourite_items" {
  "id" bigint [pk, not null]
  "favourite_id" bigint [not null]
  "product_id" int [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
}

Table "follows" {
  "id" bigint [pk, not null]
  "user_id" bigint [not null]
  "shop_id" bigint [not null]
  "created_at" timestamp [not null, default: `CURRENT_TIMESTAMP`]
}

Table "inventory_log" {
  "id" int [pk, not null]
  "quantity" int [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "note" varchar(255) [default: NULL]
  "total" float [not null]
  "shop_id" int [not null]
  "type" varchar(100) [not null, default: "IN"]
}

Table "key_tokens" {
  "id" bigint [pk, not null]
  "user_id" bigint [not null]
  "public_key" varchar(255) [not null]
  "private_key" varchar(255) [not null]
  "refresh_token" varchar(255) [not null]
}

Table "nations" {
  "id" int [pk, not null]
  "name" varchar(255) [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
}

Table "orders" {
  "id" int [pk, not null]
  "user_id" bigint [default: NULL]
  "shop_id" int [not null]
  "order_date" timestamp [not null, default: `CURRENT_TIMESTAMP`]
  "discount_id" int [default: NULL]
  "delivery_method_id" int [default: NULL]
  "address_id" int [default: NULL]
  "payment_method" varchar(250) [default: NULL]
  "status" varchar(50) [default: NULL]
  "amount" decimal(10,0) [not null]
  "total_amount" decimal(10,2) [default: NULL]
  "payment_status" varchar(100) [default: "unpaid"]
  "request_id" varchar(255) [not null]
}

Table "order_details" {
  "id" int [pk, not null]
  "order_id" int [default: NULL]
  "product_id" int [default: NULL]
  "code" varchar(100) [default: NULL]
  "quantity" int [not null]
  "product_price" decimal(10,0) [not null]
}

Table "products" {
  "id" bigint [pk, not null]
  "category_id" bigint [default: NULL]
  "brand_id" bigint [default: NULL]
  "shop_id" bigint [not null]
  "slug" varchar(255) [not null]
  "name" varchar(255) [not null]
  "description" varchar(255) [not null]
  "details" mediumtext [not null]
  "thumbnail" varchar(255) [default: NULL]
  "type" varchar(100) [not null, default: "single"]
  "quantity" int [not null, default: "0"]
  "rating" float [default: "4.5"]
  "price" float [not null]
  "price_sale" float [default: NULL]
  "meta_title" varchar(255) [default: NULL]
  "meta_keyword" varchar(255) [default: NULL]
  "meta_description" varchar(255) [default: NULL]
  "weight" float [default: NULL]
  "sold" int [default: "0"]
  "is_hot" tinyint [default: "0"]
  "is_sale" bit(1) [not null, default: "b'0'"]
  "is_feature" tinyint [default: "0"]
  "is_delete" tinyint [default: "0"]
  "is_active" tinyint [default: "1"]
  "created_at" timestamp [default: NULL]
  "updated_at" timestamp [default: NULL]
  "created_by" bigint [default: NULL]
  "updated_by" bigint [default: NULL]
}

Table "product_images" {
  "id" bigint [pk, not null]
  "product_id" bigint [default: NULL]
  "image_path" varchar(255) [not null]
  "created_at" timestamp [default: NULL]
  "name" varchar(255) [not null]
}

Table "product_inventory" {
  "id" int [pk, not null]
  "inventory_id" int [not null]
  "product_id" int [not null]
  "quantity" int [not null]
  "import_price" decimal(10,0) [not null]
  "code" varchar(255) [default: NULL]
  "amount" float [not null]
}

Table "product_spec" {
  "id" bigint [pk, not null]
  "product_id" bigint [not null]
  "name" varchar(255) [not null]
  "value" varchar(255) [not null]
}

Table "promotions" {
  "id" bigint [pk, not null]
  "name" varchar(255) [not null]
  "start_date" timestamp [not null]
  "end_date" timestamp [not null]
  "price_sale" float [not null]
  "type_price" varchar(255) [not null, default: "fixed_amount"]
  "product_id" bigint [not null]
  "shop_id" int [not null]
  "created_at" timestamp [not null, default: `CURRENT_TIMESTAMP`]
  "is_active" int [not null, default: "2"]
  "status" varchar(255) [not null, default: "active"]
}

Table "provinces" {
  "id" int [pk, not null]
  "nation_id" int [not null]
  "name" varchar(255) [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
}

Table "reviews" {
  "id" bigint [pk, not null]
  "user_id" bigint [not null]
  "product_id" bigint [not null]
  "start" tinyint [not null]
  "review" varchar(1000) [not null]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "parent_id" bigint [default: NULL]
}

Table "roles" {
  "id" bigint [pk, not null]
  "name" varchar(255) [not null]
  "permissions" varchar(255) [not null]
  "description" varchar(255) [not null]
  "created_at" timestamp [default: NULL]
  "updated_at" timestamp [default: NULL]
  "created_by" bigint [default: NULL]
  "updated_by" bigint [default: NULL]
}

Table "shops" {
  "id" bigint [pk, not null]
  "name" varchar(255) [not null]
  "username" varchar(255) [not null]
  "phone" varchar(12) [default: NULL]
  "email" varchar(255) [default: NULL]
  "CCCD" varchar(12) [not null]
  "logo" varchar(255) [default: NULL]
  "status" varchar(255) [not null, default: "pending"]
  "rating" float [not null, default: "4.5"]
  "nation_id" int [default: NULL]
  "province_id" int [default: NULL]
  "address" varchar(255) [default: NULL]
  "response_time" varchar(255) [default: NULL]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "is_active" int [not null, default: "1"]
  "follower" int [not null, default: "0"]
  "user_id" bigint [not null]
  "website" varchar(255) [default: NULL]
  "description" varchar(1000) [default: NULL]
  "image_cover" varchar(255) [default: NULL]
}

Table "shop_categories" {
  "id" int [pk, not null]
  "shop_id" int [not null]
  "category_id" int [not null]
}

Table "users" {
  "id" bigint [pk, not null]
  "role_id" bigint [not null]
  "image" varchar(255) [default: NULL]
  "firstName" varchar(255) [not null]
  "lastName" varchar(255) [not null]
  "phone" varchar(255) [default: NULL]
  "email" varchar(255) [default: NULL]
  "password" varchar(255) [default: NULL]
  "created_at" timestamp [default: `CURRENT_TIMESTAMP`]
  "is_active" tinyint [not null, default: "0"]
  "type_login" varchar(100) [not null, default: "signup"]
  "email_verified" tinyint(1) [not null]
  "birthday" varchar(50) [default: NULL]
  "gender" int [default: "2"]
}

Table "user_address_orders" {
  "id" bigint [pk, not null]
  "province_id" int [not null]
  "nation_id" int [not null]
  "address_detail" varchar(1000) [not null]
  "user_id" bigint [not null]
  "first_name" varchar(255) [not null]
  "last_name" varchar(255) [not null]
  "phone" varchar(15) [not null]
  "is_default" tinyint(1) [not null, default: "0"]
}

Ref "brands_ibfk_1":"categories"."id" < "brands"."category_id"

Ref "pk_discount":"discounts"."id" < "discount_products"."discount_id" [update: restrict, delete: cascade]

Ref "product_discount":"products"."id" < "discount_products"."product_id" [update: restrict, delete: cascade]

Ref "orders_ibfk_1":"delivery_methods"."id" < "orders"."delivery_method_id"

Ref "order_details_ibfk_1":"orders"."id" < "order_details"."order_id"

Ref "products_ibfk_1":"categories"."id" < "products"."category_id"

Ref "products_ibfk_2":"brands"."id" < "products"."brand_id"

Ref "product_images_ibfk_1":"products"."id" < "product_images"."product_id" [update: cascade, delete: cascade]

Ref "product_spec_ibfk_1":"products"."id" < "product_spec"."product_id" [update: cascade, delete: cascade]

Ref "product_promotion":"products"."id" < "promotions"."product_id" [update: cascade, delete: cascade]

Ref "review_product":"products"."id" < "reviews"."product_id" [update: cascade, delete: cascade]

Ref "review_user":"users"."id" < "reviews"."user_id" [update: cascade, delete: cascade]

Ref "users_ibfk_1":"roles"."id" < "users"."role_id"
