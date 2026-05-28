import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import getImageUrl from '../helpers/getImageUrl'

const HorizontalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)
    const scrollElement = useRef()


    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        setData(categoryProduct?.data)
    }

    useEffect(()=>{
        fetchData()
    },[])

    const scrollRight = () =>{
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{
        scrollElement.current.scrollLeft -= 300
    }


  return (
    <section className='product-section product-section--feature'>

            <div className='section-heading-row'>
                <div>
                    <h2 className='section-heading'>{heading}</h2>
                    <p className='section-subtext'>Limited time offers on elite hardware.</p>
                </div>
                <div className='product-slider-controls'>
                    <button  className='slider-control slider-control--desktop' onClick={scrollLeft}><FaAngleLeft/></button>
                    <button  className='slider-control slider-control--desktop' onClick={scrollRight}><FaAngleRight/></button> 
                </div>
            </div>

                
           <div className='product-row' ref={scrollElement}>

           {   loading ? (
                loadingList.map((product,index)=>{
                    return(
                        <div className='product-card-horizontal product-card-horizontal--loading' key={`horizontal-loading-${index}`}>
                            <div className='product-card-horizontal__media product-card-skeleton'>

                            </div>
                            <div className='product-card-horizontal__content'>
                                <h2 className='product-card-skeleton product-card-skeleton--line'></h2>
                                <p className='product-card-skeleton product-card-skeleton--line'></p>
                                <div className='product-price-row'>
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
                    <Link to={"product/"+product?._id} className='product-card-horizontal' key={product?._id}>
                        <div className='product-card-horizontal__media'>
                            {imageUrl ? <img src={imageUrl} className='product-card-horizontal__image'/> : <span className='image-placeholder-text'>No image</span>}
                        </div>
                        <div className='product-card-horizontal__content'>
                            <p className='product-card-kicker'>{product?.category}</p>
                            <h2 className='product-card-title'>{product?.productName}</h2>
                            <div className='product-price-row'>
                                <p className='product-price'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                <p className='product-price product-price--muted'>{ displayINRCurrency(product?.price)  }</p>
                            </div>
                            <button className='card-button card-button--light' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                        </div>
                    </Link>
                )
            })
           )
               
            }
           </div>
            

    </section>
  )
}

export default HorizontalCardProduct
