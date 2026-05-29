import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount,setCartProductCount] = useState(0)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/sign-up'

  const fetchUserDetails = async()=>{
      try{
        const dataResponse = await fetch(SummaryApi.current_user.url,{
          method : SummaryApi.current_user.method,
          credentials : 'include'
        })

        const dataApi = await dataResponse.json()

        if(dataApi.success){
          dispatch(setUserDetails(dataApi.data))
        }
      }catch(_error){
        dispatch(setUserDetails(null))
      }
  }

  const fetchUserAddToCart = async()=>{
    try{
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
        method : SummaryApi.addToCartProductCount.method,
        credentials : 'include'
      })

      const dataApi = await dataResponse.json()

      setCartProductCount(dataApi?.data?.count || 0)
    }catch(_error){
      setCartProductCount(0)
    }
  }

  useEffect(()=>{
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()

  },[])
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart
      }}>
        <ToastContainer 
          position='top-center'
        />
        <div className='app-shell'>
          {!isAuthPage && <Header/>}
          <main className={isAuthPage ? 'app-main app-main--auth' : 'app-main'}>
            <Outlet/>
          </main>
          {!isAuthPage && <Footer/>}
        </div>
      </Context.Provider>
    </>
  );
}

export default App;
