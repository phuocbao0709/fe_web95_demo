import React, { useContext, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Context from '../context'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const context = useContext(Context)

  useEffect(()=>{
    const syncCheckout = async() => {
      if (!sessionId) {
        context?.fetchUserAddToCart?.()
        return
      }

      try{
        const response = await fetch(`${SummaryApi.confirmCheckoutSession.url}?session_id=${encodeURIComponent(sessionId)}`,{
          method : SummaryApi.confirmCheckoutSession.method,
          credentials : 'include'
        })
        const data = await response.json()

        if(!response.ok || data.error){
          toast.error(data.message || 'Unable to refresh checkout status')
        }
      }catch(error){
        toast.error(error.message || 'Unable to refresh checkout status')
      }finally{
        context?.fetchUserAddToCart?.()
      }
    }

    syncCheckout()
  },[context, sessionId])

  return (
    <section className='checkout-status'>
      <div className='checkout-status__card'>
        <p className='checkout-status__eyebrow'>Stripe Checkout</p>
        <h1 className='checkout-status__title'>Payment completed</h1>
        <p className='checkout-status__text'>
          Your test payment has been accepted by Stripe and the checkout flow returned successfully.
        </p>
        {sessionId ? (
          <p className='checkout-status__meta'>Session: {sessionId}</p>
        ) : null}
        <div className='checkout-status__actions'>
          <Link to='/my-orders' className='button-primary'>Track My Order</Link>
          <Link to='/cart' className='button-secondary'>View Cart</Link>
          <Link to='/' className='button-primary'>Back Home</Link>
        </div>
      </div>
    </section>
  )
}

export default CheckoutSuccess
