import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
import getImageUrl from '../helpers/getImageUrl'

const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

  return (
    <div className='product-grid'>
    {

         loading ? (
             loadingList.map((product,index)=>{
                 return(
                     <div className='product-card-vertical product-card-vertical--loading' key={`vertical-loading-${index}`}>
                         <div className='product-card-vertical__media product-card-skeleton'>
                         </div>
                         <div className='product-card-vertical__content'>
                             <h2 className='product-card-skeleton product-card-skeleton--line'></h2>
                             <p className='product-card-skeleton product-card-skeleton--line'></p>
                             <div className='product-price-row'>
                                 <p className='product-card-skeleton product-card-skeleton--line'></p>
                                 <p className='product-card-skeleton product-card-skeleton--line'></p>
                             </div>
                             <button className='card-button product-card-skeleton product-card-skeleton--button'></button>
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
  )
}

export default VerticalCard
