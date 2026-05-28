import React from 'react'
import { FiInstagram, FiShare2 } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='site-footer'>
      <div className='site-footer__inner'>
        <div>
          <p className='site-footer__brand'>TECHPULSE</p>
          <p className='site-footer__meta'>&copy; 2024 TECHPULSE. PRECISION AUDIO &amp; GEAR.</p>
        </div>
        <nav className='site-footer__links'>
          <a href='/'>Privacy Policy</a>
          <a href='/'>Terms of Service</a>
          <a href='/'>Support</a>
          <a href='/'>Warranty</a>
        </nav>
        <div className='site-footer__socials'>
          <a href='/' aria-label='Instagram'><FiInstagram /></a>
          <a href='/' aria-label='Share'><FiShare2 /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
