const sortProduct = (sortBy) => {
    let nameSort = 'products.created_at';
    let valueSort = 'desc';
    if (sortBy === 'createdAtAsc') {
        nameSort = 'products.created_at';
        valueSort = 'asc';
    } else if (sortBy === 'nameDesc') {
        nameSort = 'products.name';
        valueSort = 'desc';
    } else if (sortBy === 'nameAsc') {
        nameSort = 'products.name';
        valueSort = 'asc';
    } else if (sortBy === 'priceDesc') {
        nameSort = 'products.price';
        valueSort = 'desc';
    } else if (sortBy === 'priceAsc') {
        nameSort = 'products.price';
        valueSort = 'asc';
    } else {
        nameSort = 'products.created_at';
        valueSort = 'desc';
    }
    return {
        nameSort,
        valueSort
    }
}
const sortCategory = (sortBy) => {
    let nameSort = 'categories.created_at';
    let valueSort = 'desc';
    if (sortBy === 'createdAtAsc') {
        nameSort = 'categories.created_at';
        valueSort = 'asc';
    } else if (sortBy === 'nameDesc') {
        nameSort = 'categories.name';
        valueSort = 'desc';
    } else if (sortBy === 'nameAsc') {
        nameSort = 'categories.name';
        valueSort = 'asc';
    } else {
        nameSort = 'categories.created_at';
        valueSort = 'desc';
    }
    return {
        nameSort,
        valueSort
    }
}
const sortDiscount = (sortBy) => {
    let nameSort = 'discounts.created_at';
    let valueSort = 'desc';
    if (sortBy === 'createdAtAsc') {
        nameSort = 'discounts.created_at';
        valueSort = 'asc';
    } else if (sortBy === 'nameDesc') {
        nameSort = 'discounts.name';
        valueSort = 'desc';
    } else if (sortBy === 'nameAsc') {
        nameSort = 'discounts.name';
        valueSort = 'asc';
    } else {
        nameSort = 'discounts.created_at';
        valueSort = 'desc';
    }
    return {
        nameSort,
        valueSort
    }
}
const sortPromotion = (sortBy) => {
    let nameSort = 'promotions.created_at';
    let valueSort = 'desc';
    if (sortBy === 'createdAtAsc') {
        nameSort = 'promotions.created_at';
        valueSort = 'asc';
    } else if (sortBy === 'nameDesc') {
        nameSort = 'promotions.name';
        valueSort = 'desc';
    } else if (sortBy === 'nameAsc') {
        nameSort = 'promotions.name';
        valueSort = 'asc';
    } else {
        nameSort = 'promotions.created_at';
        valueSort = 'desc';
    }
    return {
        nameSort,
        valueSort
    }
}
function getFilterCategory(query, { sortBy, filter, price, categoryId, active, search }) {
    
    if (active == 1 || active == 0 || active == 2) {
        console.log(active,"active");
        query.where('categories.is_active',"=", active)
    } else {
        query.where('categories.is_active', "!=", 0)
    }
    if (search) {
        query.where('categories.name', 'like', `%${search}%`)
    }
    // sort by , createdAtAsc, nameDesc, nameAsc
    const sortBy2 = sortBy || 'createdAtDesc';
    const sort = sortCategory(sortBy2)
    query.orderBy(sort.nameSort, sort.valueSort)
    return query
}
module.exports = {
    sortProduct,
    sortDiscount,
    sortPromotion,
    getFilterCategory
}