import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory, { getCategoryFilters } from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const createSelectedCategoryState = (activeCategories) => {
  return productCategory.reduce((acc, category) => {
    acc[category.value] = activeCategories.includes(category.value) ||
      category.filters.some((filterValue) => activeCategories.includes(filterValue))
    return acc
  }, {})
}

const sortProducts = (products, sortBy) => {
  const nextProducts = [...products]

  if (sortBy === 'asc') {
    nextProducts.sort((a, b) => (a?.sellingPrice || 0) - (b?.sellingPrice || 0))
  }

  if (sortBy === 'dsc') {
    nextProducts.sort((a, b) => (b?.sellingPrice || 0) - (a?.sellingPrice || 0))
  }

  return nextProducts
}

const CategoryProduct = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  const activeCategories = useMemo(() => {
    const urlSearch = new URLSearchParams(location.search)
    return urlSearch.getAll("category")
  }, [location.search])

  const selectCategory = useMemo(() => {
    return createSelectedCategoryState(activeCategories)
  }, [activeCategories])

  const selectedCategoryList = useMemo(() => {
    return Object.keys(selectCategory).filter((categoryValue) => selectCategory[categoryValue])
  }, [selectCategory])

  const resolvedCategoryFilters = useMemo(() => {
    return [...new Set(selectedCategoryList.flatMap((categoryValue) => getCategoryFilters(categoryValue)))]
  }, [selectedCategoryList])

  const heroContentMap = {
    mobile: {
      eyebrow: "New Release",
      title: "Precision Mobile Engineering",
      subtitle: "Experience the next generation of handheld technology with zero-latency interfaces and high-key metallic finishes.",
      cta: "Explore Series X"
    },
    laptop: {
      eyebrow: "Performance Class",
      title: "Laptop Systems For Serious Work",
      subtitle: "High-performance portable machines tuned for creative workloads, office flow and all-day battery confidence.",
      cta: "Browse Laptop Range"
    },
    audio: {
      eyebrow: "Studio Audio",
      title: "Immersive Sound Hardware",
      subtitle: "Browse focused audio gear from earbuds to speakers with cleaner tuning, sharper detail and premium finish.",
      cta: "Explore Audio Line"
    }
  }

  const primaryCategory = selectedCategoryList[0] || "mobile"
  const heroContent = heroContentMap[primaryCategory] || {
    eyebrow: "Category Focus",
    title: "Browse Product Categories",
    subtitle: "Refine your product discovery with focused filters, cleaner sorting, and a sharper storefront browsing flow.",
    cta: "Explore Collection"
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            category: resolvedCategoryFilters
          })
        })

        const dataResponse = await response.json()
        const products = Array.isArray(dataResponse?.data) ? dataResponse.data : []
        setData(sortProducts(products, sortBy))
      } catch (error) {
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedCategoryFilters, sortBy])

  const handleSelectCategory = (event) => {
    const { value, checked } = event.target
    const nextSelectedCategories = checked
      ? [...selectedCategoryList, value]
      : selectedCategoryList.filter((categoryValue) => categoryValue !== value)
    const params = new URLSearchParams(location.search)

    params.delete("category")
    nextSelectedCategories.forEach((categoryValue) => {
      params.append("category", categoryValue)
    })

    const nextSearch = params.toString()
    navigate(nextSearch ? `/product-category?${nextSearch}` : "/product-category", { replace: true })
  }

  const handleOnChangeSortBy = (event) => {
    setSortBy(event.target.value)
  }

  return (
    <div className='category-page'>
      <section className='category-hero'>
        <div className='category-hero__copy'>
          <p className='category-hero__eyebrow'>{heroContent.eyebrow}</p>
          <h1 className='category-hero__title'>{heroContent.title}</h1>
          <p className='category-hero__subtitle'>{heroContent.subtitle}</p>
          <button className='category-hero__cta'>{heroContent.cta}</button>
        </div>
        <div className='category-hero__visual'>
          <div className='category-hero__orbital' />
          <div className='category-hero__device category-hero__device--primary' />
          <div className='category-hero__device category-hero__device--secondary' />
          <div className='category-hero__device category-hero__device--tertiary' />
        </div>
      </section>

      <section className='category-browser'>
        <aside className='category-filter-panel'>
          <div className='category-filter-panel__header'>
            <h3 className='category-filter-panel__title'>Filters</h3>
            <p className='category-filter-panel__subtitle'>Refine Selection</p>
          </div>

          <div className='category-filter-group'>
            <h4 className='category-filter-group__heading'>Sort by</h4>

            <form className='category-filter-options'>
              <label className='category-filter-option'>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value='asc' />
                <span>Price - Low to High</span>
              </label>

              <label className='category-filter-option'>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value='dsc' />
                <span>Price - High to Low</span>
              </label>
            </form>
          </div>

          <div className='category-filter-group'>
            <h4 className='category-filter-group__heading'>Category</h4>

            <form className='category-filter-options'>
              {productCategory.map((categoryItem) => {
                return (
                  <label className='category-filter-option' key={categoryItem.value}>
                    <input
                      type='checkbox'
                      name='category'
                      checked={Boolean(selectCategory[categoryItem.value])}
                      value={categoryItem.value}
                      id={categoryItem.value}
                      onChange={handleSelectCategory}
                    />
                    <span>{categoryItem.label}</span>
                  </label>
                )
              })}
            </form>
          </div>

          <button className='category-filter-panel__apply' type='button'>Apply Filters</button>
        </aside>

        <div className='category-results'>
          <div className='category-results__header'>
            <div>
              <h2 className='category-results__title'>Browse Products</h2>
              <div className='category-results__underline' />
            </div>
            <p className='category-results__count'>Showing {data.length} {data.length === 1 ? "Product" : "Products"}</p>
          </div>

          <div className='category-results__body'>
            {data.length !== 0 ? (
              <VerticalCard data={data} loading={loading} />
            ) : !loading ? (
              <div className='category-results__empty'>
                <p className='category-results__empty-title'>No products found</p>
                <p className='category-results__empty-text'>Try another filter combination to surface a better hardware match.</p>
              </div>
            ) : (
              <VerticalCard data={[]} loading={loading} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CategoryProduct
