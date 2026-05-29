import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
import { FiPackage, FiUsers, FiClipboard } from "react-icons/fi";

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()


    useEffect(()=>{
        if(user?.role !== ROLE.ADMIN){
            navigate("/")
        }
    },[user])

  return (
    <div className='admin-shell'>

        <aside className='admin-sidebar'>
                <div className='admin-sidebar__profile'>
                    <div className='admin-sidebar__avatar'>
                        {
                        user?.profilePic ? (
                            <img src={user?.profilePic} className='admin-sidebar__avatar-image' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser/>
                        )
                        }
                    </div>
                    <p className='admin-sidebar__name'>{user?.name}</p>
                    <p className='admin-sidebar__role'>{user?.role}</p>
                </div>

                 {/***navigation */}       
                <div className='admin-sidebar__nav-wrap'>   
                    <nav className='admin-sidebar__nav'>
                        <Link to={"all-users"} className='admin-sidebar__link'>
                            <FiUsers />
                            <span>All Users</span>
                        </Link>
                        <Link to={"all-products"} className='admin-sidebar__link'>
                            <FiPackage />
                            <span>All Product</span>
                        </Link>
                        <Link to={"orders"} className='admin-sidebar__link'>
                            <FiClipboard />
                            <span>Orders</span>
                        </Link>
                    </nav>
                </div>  
        </aside>

        <main className='admin-content'>
            <Outlet/>
        </main>
    </div>
  )
}

export default AdminPanel
