import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory, { getCategoryFilters } from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data,setData] = useState([])
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = productCategory.reduce((acc, category) => {
      acc[category.value] = urlCategoryListinArray.includes(category.value) || category.filters.some((filterValue) => urlCategoryListinArray.includes(filterValue))
      return acc
    }, {})

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState([])

    const [sortBy,setSortBy] = useState("")

    const heroContentMap = {
      mobile : {
        eyebrow : "New Release",
        title : "Precision Mobile Engineering",
        subtitle : "Experience the next generation of handheld technology with zero-latency interfaces and high-key metallic finishes.",
        cta : "Explore Series X"
      },
      laptop : {
        eyebrow : "Performance Class",
        title : "Laptop Systems For Serious Work",
        subtitle : "High-performance portable machines tuned for creative workloads, office flow and all-day battery confidence.",
        cta : "Browse Laptop Range"
      },
      audio : {
        eyebrow : "Studio Audio",
        title : "Immersive Sound Hardware",
        subtitle : "Browse focused audio gear from earbuds to speakers with cleaner tuning, sharper detail and premium finish.",
        cta : "Explore Audio Line"
      }
    }

    const primaryCategory = filterCategoryList[0] || productCategory.find((category) => selectCategory[category.value])?.value || "mobile"
    const heroContent = heroContentMap[primaryCategory] || {
      eyebrow : "Category Focus",
      title : "Browse Product Categories",
      subtitle : "Refine your product discovery with focused filters, cleaner sorting, and a sharper storefront browsing flow.",
      cta : "Explore Collection"
    }

    const fetchData = async()=>{
      setLoading(true)
      const response = await fetch(SummaryApi.filterProduct.url,{
        method : SummaryApi.filterProduct.method,
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          category : [...new Set(filterCategoryList.flatMap((categoryValue) => getCategoryFilters(categoryValue)))]
        })
      })

      const dataResponse = await response.json()
      setData(dataResponse?.data || [])
      setLoading(false)
    }

    const handleSelectCategory = (e) =>{
      const { value, checked} =  e.target

      setSelectCategory((preve)=>{
        return{
          ...preve,
          [value] : checked
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[filterCategoryList])

    useEffect(()=>{
      setSelectCategory(
        productCategory.reduce((acc, category) => {
          acc[category.value] = urlCategoryListinArray.includes(category.value) || category.filters.some((filterValue) => urlCategoryListinArray.includes(filterValue))
          return acc
        }, {})
      )
    },[location.search])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
        if(selectCategory[categoryKeyName]){
          return categoryKeyName
        }
        return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      const params = new URLSearchParams()
      arrayOfCategory.forEach((categoryValue) => {
        params.append("category", categoryValue)
      })

      navigate(`/product-category?${params.toString()}`,{ replace : true })
    },[selectCategory, navigate])


    const handleOnChangeSortBy = (e)=>{
      const { value } = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => preve.sort((a,b)=>a.sellingPrice - b.sellingPrice))
      }

      if(value === 'dsc'){
        setData(preve => preve.sort((a,b)=>b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=>{

    },[sortBy])
    
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
                        <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"}/>
                        <span>Price - Low to High</span>
                      </label>

                      <label className='category-filter-option'>
                        <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"}/>
                        <span>Price - High to Low</span>
                      </label>
                  </form>
              </div>

              <div className='category-filter-group'>
                  <h4 className='category-filter-group__heading'>Category</h4>

                  <form className='category-filter-options'>
                      {
                        productCategory.map((categoryName,index)=>{
                          return(
                            <label className='category-filter-option' key={categoryName?.value + index}>
                               <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                               <span>{categoryName?.label}</span>
                            </label>
                          )
                        })
                      }
                  </form>
              </div>

              <button className='category-filter-panel__apply'>Apply Filters</button>
          </aside>

          <div className='category-results'>
            <div className='category-results__header'>
              <div>
                <h2 className='category-results__title'>Browse Categories</h2>
                <div className='category-results__underline' />
              </div>
              <p className='category-results__count'>Showing {data.length} {data.length === 1 ? "Category" : "Categories"}</p>
            </div>

            <div className='category-results__body'>
              {
                  data.length !== 0 ? (
                    <VerticalCard data={data} loading={loading}/>
                  ) : !loading ? (
                    <div className='category-results__empty'>
                      <p className='category-results__empty-title'>No products found</p>
                      <p className='category-results__empty-text'>Try another filter combination to surface a better hardware match.</p>
                    </div>
                  ) : (
                    <VerticalCard data={[]} loading={loading}/>
                  )
              }
            </div>
          </div>
       </section>
    </div>
  )
}

export default CategoryProduct
