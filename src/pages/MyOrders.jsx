import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'

const MyOrders = () => {
  const [orders,setOrders] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchOrders = async() => {
    setLoading(true)
    try{
      const response = await fetch(SummaryApi.myOrders.url,{
        method : SummaryApi.myOrders.method,
        credentials : 'include'
      })
      const data = await response.json()

      if(data.success){
        setOrders(data.data || [])
      }else{
        toast.error(data.message || 'Unable to load orders')
      }
    }catch(error){
      toast.error(error.message || 'Unable to load orders')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchOrders()
  },[])

  return (
    <section className='orders-page'>
      <div className='orders-page__hero'>
        <p className='orders-page__eyebrow'>Account</p>
        <h1 className='orders-page__title'>My Orders</h1>
        <p className='orders-page__subtitle'>Track every Stripe purchase and fulfillment status in one place.</p>
      </div>

      {loading ? (
        <div className='orders-empty'>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className='orders-empty'>No orders yet. Complete a Stripe checkout to see them here.</div>
      ) : (
        <div className='orders-list'>
          {orders.map((order)=>(
            <article key={order._id} className='order-card'>
              <div className='order-card__header'>
                <div>
                  <p className='order-card__label'>Order ID</p>
                  <h2 className='order-card__id'>{order._id}</h2>
                </div>
                <div className='order-card__status-wrap'>
                  <span className='order-badge'>{order.paymentStatus}</span>
                  <span className='order-badge order-badge--alt'>{order.orderStatus}</span>
                </div>
              </div>

              <div className='order-card__meta'>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Total items: {order.totalQty}</p>
                <p>Grand total: {displayINRCurrency(order.grandTotal || 0)}</p>
              </div>

              <div className='order-card__items'>
                {(order.items || []).map((item,index)=>(
                  <div className='order-line' key={`${order._id}-${index}`}>
                    <div>
                      <p className='order-line__title'>{item.productName}</p>
                      <p className='order-line__meta'>{item.brandName || 'TechPulse'} / Qty {item.quantity}</p>
                    </div>
                    <p className='order-line__price'>{displayINRCurrency(item.lineTotal || 0)}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyOrders
