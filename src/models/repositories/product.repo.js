const knex = require("../../database/database");
const slugify = require('slugify')
const { sortProduct } = require("../../utils/filter");
const firebase = require("../../configs/firebase.config");
function getFilterProducts(query, { sortBy, filter, price, categoryId, active, search }) {
    if (categoryId) {
        query.where('products.category_id', categoryId)
    }
    if (active == 1 || active == 0 || active == 2) {
        query.where('products.is_active', active)
    } else {
        query.where('products.is_active', "!=", 0)
    }
    if (search) {
        query.where('products.name', 'like', `%${search}%`)
    }
    if (filter && filter.length > 0) {
        query.leftJoin('product_attribute_values as pav', 'products.id', 'pav.product_id')
        if (Array.isArray(attr)) {
            query.whereIn('pav.value', filter)
        }
        else {
            query.where('pav.value', filter)
        }
    }
    if (price) {
        const min = price.min || 0
        const max = price.max || 999999999
        query.whereBetween('products.price', [min, max])
    }
    // sort by , createdAtAsc, nameDesc, nameAsc, priceDesc, priceAsc
    const sortBy2 = sortBy || 'createdAtDesc';
    const sort = sortProduct(sortBy2)
    query.orderBy(sort.nameSort, sort.valueSort)
    return query
}
class ProductRepository {
    static getProducts() {
        const products = knex
            .select([
                "products.id",
                "products.name",
                "products.rating",
                "products.slug",
                "products.sold",
                "products.price",
                "products.shop_id",
                "products.is_active",
                "products.created_at",
                "products.type",
                "products.thumbnail",
                "products.quantity",
                "promotions.price_sale",
                "promotions.type_price",
                "promotions.end_date",
                "favourite_items.id as isFav",
                knex.raw("GROUP_CONCAT(product_images.image_path) as imageUrls"),

            ])
            .from("products")
            .leftJoin("product_images", "products.id", "product_images.product_id")
            .leftJoin("promotions", "products.id", "promotions.product_id")
            .leftJoin("favourite_items", "products.id", "favourite_items.product_id")
            .groupBy("products.id", "promotions.price_sale", "promotions.type_price", "promotions.end_date", "isFav")
        return products
    }
    // user
    static async getDailyDiscoverProducts() {
        const response = await ProductRepository.getProducts().where('products.is_active', 2).orderBy('products.sold', 'desc').where("products.is_delete", 0).limit(12);
        return response
    }
    static async getHotSaleProducts() {
        const response = await ProductRepository.getProducts().where('products.is_active', 2)
            .whereNotNull("promotions.price_sale")
            .where("promotions.start_date", "<=", knex.fn.now())
            .where("promotions.end_date", ">=", knex.fn.now())
            .orderBy('products.created_at', 'desc').limit(12);
        return response
    }
    // shop

    static async getCountStatusProduct(user) {
        const user_id = user.id;
        const response = await knex('products')
            .select(
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM products
                WHERE is_active != 0 and is_delete = 0 AND shop_id = ? 
            ) AS countTotal`, [user_id]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM products
                WHERE is_active = 2 AND is_delete = 0 AND shop_id = ? 
            ) AS countActive`, [user_id]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM products
                WHERE is_active = 1 AND is_delete = 0 AND shop_id = ? 
            ) AS countUnActive`, [user_id]
                ),
                knex.raw(
                    `(
                SELECT COUNT(id)
                FROM products
                WHERE is_active = 0 AND is_delete = 0 AND shop_id = ? 
            ) AS countTrash`, [user_id]
                )
            )
            .where('is_delete', 0)
            .andWhere('shop_id', user_id)
            .first();
        return response
    }
    static async editProductByShop(id, product) {
        const data = {
            name: product.name,
            slug: slugify(product.name, { lower: true, strict: true, trim: true }),
            description: product.description,
            thumbnail: product.thumbnail || null,
            category_id: product.categoryId,
            brand_id: product.brandId,
            price: product.price,
            details: product.details,
            meta_title: product.metaTitle,
            meta_description: product.metaDesc,
            meta_keyword: product.metaKey,
            weight: product.weight,
            is_active: product.is_active,
            type: product.type,
            updated_at: new Date(),
        }
        return await knex("products").where("id", id).update(data)
    }
    static async createProduct(product, user) {
        try {
            const data = {
                name: product.name,
                slug: slugify(product.name, { lower: true, strict: true, trim: true }),
                description: product.description,
                thumbnail: product.thumbnail || null,
                category_id: product.categoryId,
                brand_id: product.brandId,
                price: product.price,
                details: product.details,
                meta_title: product.metaTitle,
                meta_description: product.metaDesc,
                meta_keyword: product.metaKey,
                weight: product.weight,
                sold: product.sold,
                is_active: product.is_active,
                type: product.type,
                created_by: user.id,
                shop_id: user.id,
                created_at: new Date(),
            }
            return await knex("products").insert(data)
        } catch (error) {
            console.log(error);
            return null;
        }

    }
    static async deleteProduct(id, user) {
        return await knex("products").where("id", id).where("shop_id", user.id).del()
    }
    static async getAllProductsByShop({ limit, offset, categoryId, sortBy, filter, price, active, search }, user) {
        // Construct the query to retrieve the products
        const query = ProductRepository.getProducts().where('products.is_delete', 0).where('products.shop_id', user.id);

        // Apply the filters and pagination to the query
        const products = await getFilterProducts(query, { categoryId, sortBy, filter, price, active, search })
            .limit(limit)
            .offset(offset);

        // Get the total count of products that match the filters
        const countProduct = await getFilterProducts(knex.from('products').where('products.is_delete', 0).where('products.shop_id', user.id), { categoryId, sortBy, filter, price, active, search })
            .count("products.id as total")
            .where('products.is_delete', 0);

        // Return the paginated list of products along with the total count
        return {
            total: countProduct[0].total,
            data: products
        };
    }
    static async getProductsTrashByShop({ limit, offset, categoryId, sortBy, search }, user) {
        const query = ProductRepository.getProducts({ limit, offset }).where('products.is_active', 0).where('products.created_by', user.id).limit(limit).offset(offset);
        const products = await getFilterProducts(query, { categoryId, sortBy, search });
        // Get the total count of products that match the filters
        const countProduct = await getFilterProducts(knex.from('products'), { categoryId, sortBy, search })
            .count("products.id as total")
            .where('products.is_active', 0);

        return {
            total: countProduct[0].total,
            data: products
        }
    }
    static findProductById(id) {
        const product = knex
            .select([
                "products.id",
                "products.name",
                "products.slug",
                "products.description",
                "products.thumbnail",
                "products.category_id",
                "products.brand_id",
                "categories.name as category",
                "brands.name as brand",
                "products.price",
                "products.shop_id",
                "products.details",
                "products.rating",
                "products.meta_title",
                "products.meta_description",
                "products.meta_keyword",
                "products.weight",
                "products.sold",
                "products.type",
                "products.quantity",
                "products.is_active",
                knex.raw("GROUP_CONCAT(product_images.image_path) as imageUrls"),
                knex.raw("(SELECT COUNT(id) FROM reviews WHERE product_id = products.id) AS reviewCount"),
                knex.raw("(SELECT promotions.price_sale FROM promotions WHERE end_date > now() and start_date < now() LIMIT 1) AS price_sale"),
            ])
            .from("products")
            .leftJoin("categories", "products.category_id", "categories.id")
            .leftJoin("brands", "products.brand_id", "brands.id")
            .leftJoin("product_images", "products.id", "product_images.product_id")
            .where("products.id", id)
            .groupBy("products.id", "price_sale")
            .first();

        return product
    }
    static getSimpleProduct(id) {
        return knex("products").where("id", id).first()
    }
    static async changeStatusProduct(listId, value, user) {
        return await knex('products').whereIn('id', listId).update({ is_active: value }).where('shop_id', user.id)
    }
    static patchProductQuantity(id, quantity) {
        return knex("products").where("id", id).update({ quantity: quantity })
    }
    static patchProductUnActive(id) {
        return knex("products").where("id", id).update({ is_active: 1 })
    }
    static patchProductActive(id) {
        return knex("products").where("id", id).update({ is_active: 2 })
    }
    static patchProductToDelete(listId, user) {
        return knex("products").whereIn("id", listId).where("shop_id", user.id).update({ is_delete: 1 })
    }
    static patchProductRestore(id) {
        return knex("products").where("id", id).update({ is_active: 1 })
    }
    // get product and variant
    static async getAllProductAndVariant({ shopId, search }) {
        const query1 = this.getProducts()
            .where('products.is_active', 2)
            .where('products.is_delete', 0)
            .andWhere('products.shop_id', shopId)
            .andWhere('type', 'single');
        const query2 = firebase.collection("variant").where("shopId", "==", shopId);
        const [products, variantsSnapshot] = await Promise.all([query1, query2.get()]);
        const variants = variantsSnapshot.docs.map(doc => doc.data());
        const pro = []
        variants.map(item => (
            item.productVariants.map(item2 => {
                if (item2.isActive) {
                    pro.push({
                        "id": item.productId,
                        "name": item.productName,
                        "thumbnail": item.thumbnail,
                        "slug": slugify(item.productName, { lower: true, strict: true, trim: true }),
                        "code": item2.code,
                        "price": item2.price,
                        "quantity": item2.stock
                    })
                }
                return {}
            })
        ))
        return [...products, ...pro]
    }
    // get products
    static async getProductsByListId(listId) {
        return await knex("products")
            .select("promotions.price_sale", "products.price", "promotions.type_price")
            .leftJoin("promotions", "promotions.product_id", "products.id")
            .whereIn("id", listId)
            .where("is_delete", 0)
            .where("is_active", 2)
            .andWhere(builder => {
                builder
                    .where(function () {
                        this.where("promotions.start_date", "<=", knex.fn.now())
                            .andWhere("promotions.end_date", ">=", knex.fn.now())
                    })
                    .orWhere("promotions.id", null);
            });

    }
}
module.exports = ProductRepository