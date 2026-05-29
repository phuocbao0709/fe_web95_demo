import SummaryApi from "../common"

const fetchCategoryWiseProduct = async(category)=>{
    const isCategoryGroup = Array.isArray(category)
    const requestConfig = isCategoryGroup ? SummaryApi.filterProduct : SummaryApi.categoryWiseProduct
    const requestBody = { category }

    try {
        const response = await fetch(requestConfig.url,{
            method : requestConfig.method,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(requestBody)
        })

        const dataResponse = await response.json()

        return {
            ...dataResponse,
            data : Array.isArray(dataResponse?.data) ? dataResponse.data : []
        }
    } catch (error) {
        return {
            success : false,
            error : true,
            message : error.message || "Unable to load category products",
            data : []
        }
    }
}

export default fetchCategoryWiseProduct
