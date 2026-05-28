import React, { useContext, useState } from 'react'
import { FiHeadphones, FiMail, FiShare2 } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }


    const handleSubmit = async(e) =>{
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.signIn.url,{
            method : SummaryApi.signIn.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if(dataApi.success){
            toast.success(dataApi.message)
            navigate('/')
            fetchUserDetails()
            fetchUserAddToCart()
        }

        if(dataApi.error){
            toast.error(dataApi.message)
        }

    }
  return (
    <section id='login' className='auth-page'>
        <div className='auth-shell'>
            <header className='auth-topbar'>
                <Link to='/' className='auth-brand'>
                    <span className='auth-brand__icon'><FiHeadphones /></span>
                    <span>TECHPULSE</span>
                </Link>
                <a href='/' className='auth-topbar__link'>Support</a>
            </header>

            <div className='auth-panel auth-panel--login'>
                    <div className='auth-avatar auth-avatar--login'>
                        <HiOutlineUserCircle />
                    </div>

                    <div className='auth-copy auth-copy--center'>
                        <h1 className='auth-title'>Welcome Back</h1>
                        <p className='auth-subtitle'>Enter your credentials to access your audio ecosystem.</p>
                    </div>

                    <form className='auth-card' onSubmit={handleSubmit}>
                        <div className='auth-field-group'>
                            <label className='auth-label'>Email Address</label>
                            <div className='auth-input'>
                                <span className='auth-input__icon'><FiMail /></span>
                                <input 
                                    type='email' 
                                    placeholder='name@company.com' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    className='auth-input__control'/>
                            </div>
                        </div>

                        <div className='auth-field-group'>
                            <div className='auth-label-row'>
                                <label className='auth-label'>Password</label>
                                <Link to={'/forgot-password'} className='auth-inline-link'>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className='auth-input'>
                                <span className='auth-input__icon'><FiLock /></span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='........'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    className='auth-input__control'/>
                                <div className='auth-input__toggle' onClick={()=>setShowPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash/>
                                            )
                                            :
                                            (
                                                <FaEye/>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button className='auth-submit-button'>Login</button>

                    </form>

                    <div className='auth-divider'>
                        <span>or continue with</span>
                    </div>

                    <div className='auth-socials'>
                        <button type='button' className='auth-social-button'>
                            <FcGoogle />
                            <span>Google</span>
                        </button>
                        <button type='button' className='auth-social-button'>
                            <FaApple />
                            <span>Apple</span>
                        </button>
                    </div>

                    <p className='auth-bottom-link'>
                        Don&apos;t have an account? <Link to={"/sign-up"}>Sign up</Link>
                    </p>
            </div>

            <footer className='auth-footer auth-footer--login'>
                <p className='auth-footer__brand'>TECHPULSE</p>
                <p className='auth-footer__meta'>&copy; 2024 TECHPULSE. PRECISION AUDIO &amp; GEAR.</p>
                <nav className='auth-footer__links'>
                    <a href='/'>Privacy Policy</a>
                    <a href='/'>Terms of Service</a>
                    <a href='/'>Support</a>
                    <a href='/'>Warranty</a>
                </nav>
                <a href='/' className='auth-footer__share' aria-label='Share'>
                    <FiShare2 />
                </a>
            </footer>
        </div>
    </section>
  )
}

export default Login
