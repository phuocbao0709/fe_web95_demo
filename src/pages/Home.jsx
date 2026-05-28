import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import productCategory from '../helpers/productCategory'

const Home = () => {
  return (
    <div className='home-page'>
      <section className='hero-shell'>
        <div className='hero-copy'>
          <p className='eyebrow'>Curated electronics</p>
          <h1 className='hero-title'>
            Dark commerce
            <br />
            with a <span>heat-orange pulse.</span>
          </h1>
          <p className='hero-text'>
            Uncompromising precision meets high-performance aesthetics. Elevate your auditory
            experience with the next generation of gear.
          </p>
          <div className='hero-actions'>
            <a href='#flash-sale' className='button-primary'>Shop Now</a>
            <a href='#collections' className='button-secondary'>View Gallery</a>
          </div>
        </div>
        <BannerProduct/>
      </section>

      <section className='category-strip-shell'>
        <CategoryList/>
      </section>

      {
        productCategory.map((category) => {
          return (
            <VerticalCardProduct
              key={category.value}
              category={category.filters}
              heading={category.label}
            />
          )
        })
      }
    </div>
  )
}

export default Home
