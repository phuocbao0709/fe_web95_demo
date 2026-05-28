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
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
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
                    categoryProduct.map((product,index)=>{
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
