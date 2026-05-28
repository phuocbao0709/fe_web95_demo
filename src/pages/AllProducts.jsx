import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
import { FiDownload, FiPlus, FiAlertTriangle, FiBox, FiClock, FiTrendingUp } from "react-icons/fi";

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])

  const fetchAllProduct = async() =>{
    const response = await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()

    console.log("product data",dataResponse)

    setAllProduct(dataResponse?.data || [])
  }

  useEffect(()=>{
    fetchAllProduct()
  },[])
  
  const lowStockCount = allProduct.filter((product)=> Number(product?.quantity || 0) < 50).length
  const totalInventory = allProduct.reduce((sum, product)=> sum + Number(product?.quantity || 0),0)
  const totalValue = allProduct.reduce((sum, product)=> sum + (Number(product?.sellingPrice || 0) * Number(product?.quantity || 0)),0)

  return (
    <div className='admin-page'>
        <div className='admin-page__header'>
            <div>
              <p className='admin-page__breadcrumb'>Admin <span>&gt;</span> Inventory Management</p>
              <h2 className='admin-page__title'>Product Catalog</h2>
              <p className='admin-page__subtitle'>Precision control for ORANGE TECH hardware assets.</p>
            </div>

            <div className='admin-page__actions'>
              <button className='admin-action-button admin-action-button--secondary'>
                <FiDownload />
                <span>Export CSV</span>
              </button>
              <button className='admin-action-button admin-action-button--primary' onClick={()=>setOpenUploadProduct(true)}>
                <FiPlus />
                <span>New Product</span>
              </button>
            </div>
        </div>

        <div className='admin-stats'>
          <div className='admin-stat-card'>
            <div>
              <p className='admin-stat-card__label'>Total Inventory</p>
              <p className='admin-stat-card__value'>{totalInventory.toLocaleString()}</p>
              <p className='admin-stat-card__meta admin-stat-card__meta--success'>+12% from last month</p>
            </div>
            <FiBox className='admin-stat-card__icon' />
          </div>
          <div className='admin-stat-card'>
            <div>
              <p className='admin-stat-card__label'>Low Stock Units</p>
              <p className='admin-stat-card__value admin-stat-card__value--warning'>{lowStockCount}</p>
              <p className='admin-stat-card__meta'>Requires immediate action</p>
            </div>
            <FiAlertTriangle className='admin-stat-card__icon' />
          </div>
          <div className='admin-stat-card'>
            <div>
              <p className='admin-stat-card__label'>Pending Orders</p>
              <p className='admin-stat-card__value'>{Math.max(allProduct.length * 3, 0)}</p>
              <p className='admin-stat-card__meta'>Average fulfillment: 4h</p>
            </div>
            <FiClock className='admin-stat-card__icon' />
          </div>
          <div className='admin-stat-card'>
            <div>
              <p className='admin-stat-card__label'>Revenue Forecast</p>
              <p className='admin-stat-card__value admin-stat-card__value--accent'>${(totalValue / 1000000).toFixed(1)}M</p>
              <p className='admin-stat-card__meta'>Q4 projections updated</p>
            </div>
            <FiTrendingUp className='admin-stat-card__icon' />
          </div>
        </div>

        {/**all product */}
        <div className='admin-catalog'>
          <div className='admin-catalog__toolbar'>
            <div className='admin-catalog__search'>Search by name, SKU, or category...</div>
            <div className='admin-catalog__summary'>Showing 1-{allProduct.length} of {allProduct.length} products</div>
          </div>

          <div className='admin-product-grid'>
          {
            allProduct.map((product,index)=>{
              return(
                <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
                
              )
            })
          }
          </div>

          <div className='admin-catalog__footer'>
            <div className='admin-catalog__legend'>
              <span>Active inventory</span>
              <span>Low stock alert (&lt; 50)</span>
              <span>Discontinued / legacy</span>
            </div>
            <p className='admin-catalog__sync'>Last auto-sync performed 2 minutes ago.</p>
          </div>
        </div>





        {/**upload prouct component */}
        {
          openUploadProduct && (
            <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
          )
        }
      

    </div>
  )
}

export default AllProducts
