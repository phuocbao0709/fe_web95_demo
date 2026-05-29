import React, { useContext, useEffect, useState } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import getImageUrl from '../helpers/getImageUrl';

const initialProductState = {
  productName : "",
  brandName : "",
  category : "",
  productImage : [],
  description : "",
  price : "",
  sellingPrice : ""
}

const ProductDetails = () => {
  const [data,setData] = useState(initialProductState)
  const params = useParams()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage,setActiveImage] = useState("")

  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = async()=>{
    if (!params?.id) {
      setData(initialProductState)
      setActiveImage("")
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(SummaryApi.productDetails.url,{
        method : SummaryApi.productDetails.method,
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          productId : params?.id
        })
      })

      const dataReponse = await response.json()
      const productData = dataReponse?.data && typeof dataReponse.data === "object"
        ? {
            ...initialProductState,
            ...dataReponse.data,
            productImage : Array.isArray(dataReponse.data?.productImage)
              ? dataReponse.data.productImage
              : dataReponse.data?.productImage
                  ? [dataReponse.data.productImage]
                  : []
          }
        : initialProductState

      setData(productData)
      setActiveImage(getImageUrl(productData.productImage))

      if (!response.ok || dataReponse?.error) {
        toast.error(dataReponse?.message || "Unable to load product details")
      }
    } catch (error) {
      setData(initialProductState)
      setActiveImage("")
      toast.error(error.message || "Unable to load product details")
    } finally {
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchProductDetails()
  },[params?.id])

  const handleMouseEnterProduct = (imageURL)=>{
    setActiveImage(imageURL)
  }

  const handleAddToCart = async(e,id) =>{
    if (!id) {
      return
    }
    await addToCart(e,id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async(e,id)=>{
    if (!id) {
      return
    }
    await addToCart(e,id)
    fetchUserAddToCart()
    navigate("/cart")

  }

  return (
    <div className='container mx-auto p-4 product-details'>

      <div className='product-details__layout'>
          {/***product Image */}
          <div className='product-details__gallery'>
              <div className='product-details__media-panel'>
                  <div className='legacy-media-frame product-details__preview'>
                    {activeImage ? (
                      <img src={activeImage} className='product-details__preview-image' />
                    ) : (
                      <div className='image-placeholder-text image-placeholder-text--dark image-placeholder-text--large'>No image</div>
                    )}
                  </div>

                  <div className='product-details__thumb-rail'>
                  {
                    loading ? (
                      <div className='product-details__thumb-list'>
                        {
                          productImageListLoading.map((el,index) =>{
                            return(
                              <div className='legacy-media-frame legacy-media-frame--thumb product-details__thumb product-card-skeleton' key={"loadingImage"+index}>
                              </div>
                            )
                          })
                        }
                      </div>
                      
                    ) : (
                      <div className='product-details__thumb-list'>
                        {
                          data?.productImage?.map((imgURL,index) =>{
                            const imageUrl = getImageUrl(imgURL)
                            if(!imageUrl){
                              return null
                            }
                            const isActive = activeImage === imageUrl
                            return(
                              <div className={`legacy-media-frame legacy-media-frame--thumb product-details__thumb ${isActive ? 'product-details__thumb--active' : ''}`} key={`${imageUrl}-${index}`}>
                                <img src={imageUrl} className='legacy-media-frame__image legacy-media-frame__image--detail' onMouseEnter={()=>handleMouseEnterProduct(imageUrl)}  onClick={()=>handleMouseEnterProduct(imageUrl)}/>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  }
                  </div>
              </div>
          </div>

           {/***product details */}
           {
            loading ? (
              <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full'></h2>
                <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

                <div className='text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'>
    
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                  <p className='text-red-600 bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
                  <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
                </div>
              </div>
            ) : 
            (
              <div className='flex flex-col gap-1'>
                <p className='product-details__brand'>{data?.brandName}</p>
                <h2 className='product-details__title'>{data?.productName}</h2>
                <p className='product-details__category'>{data?.category}</p>

                <div className='text-red-600 flex items-center gap-1'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                </div>

                <div className='product-details__actions my-2'>
                  <button className='button-outline' onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy</button>
                  <button className='card-button' onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>
                </div>

                <div>
                  <p className='product-details__description-label'>Description</p>
                  <p className='product-details__description-text'>{data?.description}</p>
                </div>
              </div>
            )
           }

      </div>



      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      }
     



    </div>
  )
}

export default ProductDetails
