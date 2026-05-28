import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const updateUserRole = async() =>{
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                userId : userId,
                role : userRole
            })
        })

        const responseData = await fetchResponse.json()

        if(responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log("role updated",responseData)

    }

  return (
    <div className='admin-modal'>
       <div className='admin-form-modal admin-form-modal--compact'>

            <button className='admin-form-modal__close-button' onClick={onClose}>
                <IoMdClose/>
            </button>

            <h1 className='admin-form-modal__title admin-form-modal__title--compact'>Change User Role</h1>

             <p className='admin-form-modal__meta'><strong>Name:</strong> {name}</p>   
             <p className='admin-form-modal__meta'><strong>Email:</strong> {email}</p> 

            <div className='admin-form__inline'>
                <p className='admin-form__label admin-form__label--inline'>Role</p>  
                <select className='admin-form__control admin-form__control--inline' value={userRole} onChange={handleOnChangeSelect}>
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>


            <button className='admin-form__submit admin-form__submit--compact' onClick={updateUserRole}>Change Role</button>
       </div>
    </div>
  )
}

export default ChangeUserRole
