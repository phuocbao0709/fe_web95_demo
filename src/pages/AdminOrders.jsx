import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'

const statusOptions = ['paid','processing','shipped','delivered','cancelled']

const AdminOrders = () => {
  const [orders,setOrders] = useState([])
  const [loading,setLoading] = useState(true)
  const [savingId,setSavingId] = useState('')

  const fetchOrders = async() => {
    setLoading(true)
    try{
      const response = await fetch(SummaryApi.adminOrders.url,{
        method : SummaryApi.adminOrders.method,
        credentials : 'include'
      })
      const data = await response.json()

      if(data.success){
        setOrders(data.data || [])
      }else{
        toast.error(data.message || 'Unable to load admin orders')
      }
    }catch(error){
      toast.error(error.message || 'Unable to load admin orders')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchOrders()
  },[])

  const handleStatusChange = async(orderId, orderStatus) => {
    setSavingId(orderId)
    try{
      const response = await fetch(SummaryApi.updateOrderStatus.url,{
        method : SummaryApi.updateOrderStatus.method,
        credentials : 'include',
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          orderId,
          orderStatus
        })
      })
      const data = await response.json()

      if(data.success){
        toast.success(data.message)
        setOrders((prev)=> prev.map((order)=> order._id === orderId ? data.data : order))
      }else{
        toast.error(data.message || 'Unable to update order')
      }
    }catch(error){
      toast.error(error.message || 'Unable to update order')
    }finally{
      setSavingId('')
    }
  }

  return (
    <div className='admin-page'>
      <div className='admin-page__header admin-page__header--compact'>
        <div>
          <p className='admin-page__breadcrumb'>Admin <span>&gt;</span> Order Operations</p>
          <h2 className='admin-page__title'>Orders</h2>
          <p className='admin-page__subtitle'>Review paid orders and update fulfillment status manually.</p>
        </div>
      </div>

      {loading ? (
        <div className='orders-empty'>Loading orders...</div>
      ) : (
        <div className='admin-order-grid'>
          {orders.map((order)=>(
            <article key={order._id} className='admin-order-card'>
              <div className='admin-order-card__top'>
                <div>
                  <p className='order-card__label'>Order ID</p>
                  <p className='admin-order-card__id'>{order._id}</p>
                </div>
                <div className='admin-order-card__badges'>
                  <span className='order-badge'>{order.paymentStatus}</span>
                  <span className='order-badge order-badge--alt'>{order.orderStatus}</span>
                </div>
              </div>

              <div className='admin-order-card__meta'>
                <p>User: {order.userId}</p>
                <p>Total: {displayINRCurrency(order.grandTotal || 0)}</p>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className='admin-order-card__items'>
                {(order.items || []).map((item,index)=>(
                  <div key={`${order._id}-item-${index}`} className='order-line'>
                    <div>
                      <p className='order-line__title'>{item.productName}</p>
                      <p className='order-line__meta'>Qty {item.quantity}</p>
                    </div>
                    <p className='order-line__price'>{displayINRCurrency(item.lineTotal || 0)}</p>
                  </div>
                ))}
              </div>

              <select
                className='admin-form__control'
                value={order.orderStatus}
                onChange={(e)=>handleStatusChange(order._id,e.target.value)}
                disabled={savingId === order._id}
              >
                {statusOptions.map((status)=>(
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders
