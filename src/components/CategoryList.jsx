import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'
import getImageUrl from '../helpers/getImageUrl'

const CategoryList = () => {
    const [categoryProduct,setCategoryProduct] = useState([])
    const [loading,setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async() =>{
        setLoading(true)

        try {
            const response = await fetch(SummaryApi.categoryProduct.url)
            const dataResponse = await response.json()
            const nextCategoryProducts = Array.isArray(dataResponse?.data)
                ? dataResponse.data
                : []

            setCategoryProduct(nextCategoryProducts)
        } catch (_error) {
            setCategoryProduct([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategoryProduct()
    },[])

  return (
    <div className='category-strip'>
           <div className='category-strip__track'>
            {

                loading ? (
                    categoryLoading.map((el,index)=>{
                            return(
                                <div className='category-pill category-pill--loading' key={"categoryLoading"+index}>
                                </div>
                            )
                    })  
                ) :
                (
                    categoryProduct.map((product)=>{
                        const imageUrl = getImageUrl(product?.productImage)
                        return(
                            <Link to={"/product-category?category="+product?.category} className='category-pill' key={product?.category}>
                                <div className='category-pill__media'>
                                    {imageUrl ? <img src={imageUrl} alt={product?.category} className='category-pill__image'/> : <span className='image-placeholder-text'>No image</span>}
                                </div>
                                <p className='category-pill__label'>{product?.category}</p>
                            </Link>
                        )
                    })
                )
            }
           </div>
    </div>
  )
}

export default CategoryList
