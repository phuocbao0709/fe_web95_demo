import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutCancel = () => {
  return (
    <section className='checkout-status'>
      <div className='checkout-status__card'>
        <p className='checkout-status__eyebrow'>Stripe Checkout</p>
        <h1 className='checkout-status__title'>Payment canceled</h1>
        <p className='checkout-status__text'>
          No charge was completed. You can return to the cart and start checkout again whenever ready.
        </p>
        <div className='checkout-status__actions'>
          <Link to='/cart' className='button-primary'>Return To Cart</Link>
          <Link to='/' className='button-secondary'>Back Home</Link>
        </div>
      </div>
    </section>
  )
}

export default CheckoutCancel
