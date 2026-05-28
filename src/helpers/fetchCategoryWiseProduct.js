import SummaryApi from "../common"

const fetchCategoryWiseProduct = async(category)=>{
    const isCategoryGroup = Array.isArray(category)
    const requestConfig = isCategoryGroup ? SummaryApi.filterProduct : SummaryApi.categoryWiseProduct
    const requestBody = isCategoryGroup ? { category } : { category }

    const response = await fetch(requestConfig.url,{
        method : requestConfig.method,
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify(requestBody)
    })

    const dataResponse = await response.json()

    return dataResponse
}

export default fetchCategoryWiseProduct
