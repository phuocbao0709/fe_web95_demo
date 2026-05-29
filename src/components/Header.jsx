import React, { useContext, useEffect, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import productCategory, { createCategoryQuery, getCategoryFilters } from '../helpers/productCategory';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  const urlSearch = new URLSearchParams(location?.search)
  const searchQuery = urlSearch.get("q") || ""
  const [search,setSearch] = useState(searchQuery)
  const activeCategories = urlSearch.getAll("category")

  useEffect(() => {
    setSearch(searchQuery)
    setMenuDisplay(false)
  }, [searchQuery, location.pathname])

  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url,{
      method : SummaryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if(data.error){
      toast.error(data.message)
    }

  }

  const handleSearch = (e)=>{
    const { value } = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${encodeURIComponent(value)}`)
    }else{
      navigate("/search")
    }
  }
  return (
    <header className='site-header'>
      <div className='site-header__inner'>
            <div className='site-header__topline'>
                <Link to={"/"}>
                    <Logo w={90} h={50}/>
                </Link>
                <div className='site-header__mobile-actions'>
                  {
                    user?._id && (
                      <Link to={"/cart"} className='header-icon-link'>
                          <span><FaShoppingCart/></span>
                          <div className='header-cart-badge'>
                              <p>{context?.cartProductCount}</p>
                          </div>
                      </Link>
                    )
                  }
                  {
                    user?._id ? (
                      <button onClick={handleLogout} className='header-auth-button'>Logout</button>
                    ) : (
                      <Link to={"/login"} className='header-auth-button'>Login</Link>
                    )
                  }
                </div>
            </div>

            <nav className='site-header__nav'>
              {
                productCategory.map((category) => {
                  const isActive = location.pathname === "/product-category" && (
                    activeCategories.includes(category.value) ||
                    getCategoryFilters(category.value).some((filterValue) => activeCategories.includes(filterValue))
                  )

                  return (
                    <Link
                      key={category.value}
                      to={`/product-category?${createCategoryQuery(category.value)}`}
                      className={`site-header__nav-link ${isActive ? 'site-header__nav-link--active' : ''}`}
                    >
                      {category.label}
                    </Link>
                  )
                })
              }
            </nav>

            <div className='header-search'>
                <input type='text' placeholder='Search modern gear...' className='header-search__input' onChange={handleSearch} value={search}/>
                <div className='header-search__icon'>
                  <GrSearch />
                </div>
            </div>


            <div className='site-header__actions'>
                
                <div className='header-user-menu'>

                  {
                    user?._id && (
                      <div className='header-user-trigger' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='header-user-avatar' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }
                  
                  
                  {
                    menuDisplay && (
                      <div className='header-user-dropdown' >
                        <nav>
                          {
                            user?.role === ROLE.ADMIN && (
                              <Link to={"/admin-panel/all-products"} className='header-user-dropdown-link' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                          <Link to={"/my-orders"} className='header-user-dropdown-link' onClick={()=>setMenuDisplay(preve => !preve)}>My Orders</Link>
                         
                        </nav>
                      </div>
                    )
                  }
                 
                </div>

                  {
                     user?._id && (
                      <Link to={"/cart"} className='header-icon-link'>
                          <span><FaShoppingCart/></span>
      
                          <div className='header-cart-badge'>
                              <p>{context?.cartProductCount}</p>
                          </div>
                      </Link>
                      )
                  }
              


                <div>
                  {
                    user?._id  ? (
                      <button onClick={handleLogout} className='header-auth-button'>Logout</button>
                    )
                    : (
                    <Link to={"/login"} className='header-auth-button'>Login</Link>
                    )
                  }
                    
                </div>

            </div>

      </div>
    </header>
  )
}

export default Header
