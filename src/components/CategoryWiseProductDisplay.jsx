import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'
import getImageUrl from '../helpers/getImageUrl'

const CategroyWiseProductDisplay = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }




    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data",categoryProduct.data)
        setData(categoryProduct?.data)
    }

    useEffect(()=>{
        fetchData()
    },[])




  return (
    <div className='container mx-auto px-4 my-6 relative'>

            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                
           <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all'>
           {

                loading ? (
                    loadingList.map((product,index)=>{
                        return(
                            <div className='product-card-vertical product-card-vertical--loading'>
                                <div className='product-card-vertical__media product-card-skeleton'>
                                </div>
                                <div className='product-card-vertical__content'>
                                    <h2 className='product-card-skeleton product-card-skeleton--line'></h2>
                                    <p className='product-card-skeleton product-card-skeleton--line'></p>
                                    <div className='flex gap-3'>
                                        <p className='product-card-skeleton product-card-skeleton--line'></p>
                                        <p className='product-card-skeleton product-card-skeleton--line'></p>
                                    </div>
                                    <button className='product-card-skeleton product-card-skeleton--button'></button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    data.map((product,index)=>{
                        const imageUrl = getImageUrl(product?.productImage)
                        return(
                            <Link to={"/product/"+product?._id} className='product-card-vertical' onClick={scrollTop} key={product?._id}>
                                <div className='product-card-vertical__media'>
                                    {imageUrl ? <img src={imageUrl} className='product-card-vertical__image'/> : <span className='image-placeholder-text'>No image</span>}
                                </div>
                                <div className='product-card-vertical__content'>
                                    <h2 className='product-card-title'>{product?.productName}</h2>
                                    <p className='product-card-kicker'>{product?.category}</p>
                                    <div className='product-price-row'>
                                        <p className='product-price'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                        <p className='product-price product-price--muted'>{ displayINRCurrency(product?.price)  }</p>
                                    </div>
                                    <button className='card-button' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                                </div>
                            </Link>
                        )
                    })
                )
                
            }
           </div>
            

    </div>
  )
}

export default CategroyWiseProductDisplay
