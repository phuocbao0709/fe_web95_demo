import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiArrowRight, FiLock, FiMail, FiShoppingBag, FiUser } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [data,setData] = useState({
      email : "",
      password : "",
      name : "",
      confirmPassword : "",
      profilePic : "",
  })
  const navigate = useNavigate()

  const handleOnChange = (e) =>{
      const { name , value } = e.target

      setData((preve)=>{
          return{
              ...preve,
              [name] : value
          }
      })
  }

  const handleUploadPic = async(e) =>{
    const file = e.target.files[0]
    
    const imagePic = await imageTobase64(file)
    
    setData((preve)=>{
      return{
        ...preve,
        profilePic : imagePic
      }
    })

  }


  const handleSubmit = async(e) =>{
      e.preventDefault()

      if(data.password === data.confirmPassword){

        const dataResponse = await fetch(SummaryApi.signUP.url,{
            method : SummaryApi.signUP.method,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })
    
          const dataApi = await dataResponse.json()

          if(dataApi.success){
            toast.success(dataApi.message)
            navigate("/login")
          }

          if(dataApi.error){
            toast.error(dataApi.message)
          }
    
      }else{
        toast.error("Please check password and confirm password")
      }

  }

  return (
    <section id='signup' className='auth-page auth-page--signup'>
        <div className='auth-shell auth-shell--signup'>
            <header className='auth-topbar auth-topbar--signup'>
                <Link to='/' className='auth-brand auth-brand--signup'>
                    <span className='auth-brand__icon'><HiOutlineMenuAlt3 /></span>
                    <span>TechPulse</span>
                </Link>
                <a href='/' className='auth-topbar__icon-link' aria-label='Bag'>
                    <FiShoppingBag />
                </a>
            </header>

            <div className='auth-panel auth-panel--signup'>
                    <div className='auth-copy'>
                        <h1 className='auth-title auth-title--signup'>Create Account</h1>
                        <p className='auth-subtitle'>Join the TechPulse audio community.</p>
                    </div>

                    <div className='auth-avatar-upload'>
                        <div className='auth-avatar auth-avatar--signup'>
                            {data.profilePic ? <img src={data.profilePic} alt='profile preview' className='auth-avatar__image' /> : <FiUser />}
                        </div>
                        <form>
                          <label className='auth-avatar-upload__label'>
                            Upload photo
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                          </label>
                        </form>
                    </div>

                    <form className='auth-card auth-card--signup' onSubmit={handleSubmit}>
                      <div className='auth-field-group'>
                              <label className='auth-label'>Full Name</label>
                              <div className='auth-input'>
                                  <span className='auth-input__icon'><FiUser /></span>
                                  <input 
                                      type='text' 
                                      placeholder='John Doe' 
                                      name='name'
                                      value={data.name}
                                      onChange={handleOnChange}
                                      required
                                      className='auth-input__control'/>
                              </div>
                          </div>
                        <div className='auth-field-group'>
                            <label className='auth-label'>Email Address</label>
                            <div className='auth-input'>
                                <span className='auth-input__icon'><FiMail /></span>
                                <input 
                                    type='email' 
                                    placeholder='name@email.com' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    required
                                    className='auth-input__control'/>
                            </div>
                        </div>

                        <div className='auth-field-group'>
                            <label className='auth-label'>Password</label>
                            <div className='auth-input'>
                                <span className='auth-input__icon'><FiLock /></span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='........'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    required
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

                        <div className='auth-field-group'>
                            <label className='auth-label'>Confirm</label>
                            <div className='auth-input'>
                                <span className='auth-input__icon'><FiLock /></span>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder='........'
                                    value={data.confirmPassword}
                                    name='confirmPassword' 
                                    onChange={handleOnChange}
                                    required
                                    className='auth-input__control'/>

                                <div className='auth-input__toggle' onClick={()=>setShowConfirmPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showConfirmPassword ? (
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

                        <button className='auth-submit-button auth-submit-button--with-icon'>
                          <span>Sign Up</span>
                          <FiArrowRight />
                        </button>

                    </form>

                    <div className='auth-divider'>
                        <span>or sign up with</span>
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

                    <p className='auth-bottom-link auth-bottom-link--signup'>
                        Already have an account? <Link to={"/login"}>Log In</Link>
                    </p>
            </div>
        </div>
    </section>
  )
}

export default SignUp
