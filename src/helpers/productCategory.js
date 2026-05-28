const productCategory = [
    { id : 1, label : "Mobile", value : "mobile", filters : ["mobile", "mobiles"] },
    { id : 2, label : "Laptop", value : "laptop", filters : ["laptop"] },
    { id : 3, label : "Audio", value : "audio", filters : ["audio", "airpodes", "earphones", "speakers"] },
]

export const getCategoryFilters = (categoryValue) => {
    const matchedCategory = productCategory.find((category) => category.value === categoryValue)

    return matchedCategory?.filters || [categoryValue]
}

export const createCategoryQuery = (categoryValue) => {
    return `category=${encodeURIComponent(categoryValue)}`
}

export default productCategory
