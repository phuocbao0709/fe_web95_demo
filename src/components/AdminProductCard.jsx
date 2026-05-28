import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import getImageUrl from '../helpers/getImageUrl';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)
    const imageUrl = getImageUrl(data?.productImage)
    const quantity = Number(data?.quantity || 0)
    const stockPercent = Math.min(Math.max(quantity / 500, 0.08), 1)
    const stockStatus = quantity < 50 ? "Low stock" : "Active"

    const handleDeleteProduct = async() => {
      const confirmDelete = window.confirm(`Delete "${data?.productName}"?`)

      if(!confirmDelete){
        return
      }

      const response = await fetch(SummaryApi.deleteProduct.url,{
        method : SummaryApi.deleteProduct.method,
        credentials : 'include',
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          _id : data?._id
        })
      })

      const responseData = await response.json()

      if(responseData.success){
        toast.success(responseData?.message)
        fetchdata()
      }

      if(responseData.error){
        toast.error(responseData?.message)
      }
    }

  return (
    <div className='admin-product-card'>
       <div className='admin-product-card__entity'>
            <div className='admin-product-card__thumb'>
              {imageUrl ? <img src={imageUrl}  className='admin-product-card__image'/> : <span className='image-placeholder-text image-placeholder-text--dark'>No image</span>}   
            </div> 
            <div className='admin-product-card__copy'>
              <h1 className='admin-product-card__title'>{data.productName}</h1>
              <p className='admin-product-card__sku'>SKU: {data?._id?.slice(-8)?.toUpperCase() || "N/A"}</p>
            </div>
       </div>

       <div className='admin-product-card__category'>
          <span>{data?.category || "Uncategorized"}</span>
       </div>

       <div className='admin-product-card__stock'>
          <p className='admin-product-card__stock-value'>{quantity} Units</p>
          <div className='admin-product-card__stock-bar'>
            <span style={{ width: `${stockPercent * 100}%` }} />
          </div>
       </div>

       <p className='admin-product-card__price'>{displayINRCurrency(data.sellingPrice)}</p>

       <p className={`admin-product-card__status ${quantity < 50 ? 'admin-product-card__status--warning' : ''}`}>
          {stockStatus}
       </p>

       <div className='admin-product-card__actions'>
          <button className='admin-product-card__edit' onClick={()=>setEditProduct(true)}>
            <MdModeEditOutline/>
            <span>Edit</span>
          </button>
          <button className='admin-product-card__delete' onClick={handleDeleteProduct}>
            <MdDeleteOutline/>
            <span>Delete</span>
          </button>
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminProductCard
