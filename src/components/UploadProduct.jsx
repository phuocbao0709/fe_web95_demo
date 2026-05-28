import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'
import getImageUrl from '../helpers/getImageUrl';

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : ""
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")


  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    if(!file){
      return
    }

    try{
      const uploadImageCloudinary = await uploadImage(file)

      setData((preve)=>{
        return{
          ...preve,
          productImage : [ ...preve.productImage, uploadImageCloudinary.imageUrl]
        }
      })
    }catch(err){
      toast.error(err.message || "Image upload failed")
    }finally{
      e.target.value = ""
    }
  }

  const handleDeleteProductImage = async(index)=>{
    console.log("image index",index)
    
    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
    
  }


  {/**upload product */}
  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    const response = await fetch(SummaryApi.uploadProduct.url,{
      method : SummaryApi.uploadProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchData()
    }


    if(responseData.error){
      toast.error(responseData?.message)
    }
  

  }

  return (
    <div className='admin-modal'>
       <div className='admin-form-modal admin-form-modal--wide'>

            <div className='admin-form-modal__header'>
                <h2 className='admin-form-modal__title'>Upload Product</h2>
                <div className='admin-form-modal__close' onClick={onClose}>
                    <CgClose/>
                </div>
            </div>

          <form className='admin-form' onSubmit={handleSubmit}>
            <label className='admin-form__label' htmlFor='productName'>Product Name</label>
            <input 
              type='text' 
              id='productName' 
              placeholder='enter product name' 
              name='productName'
              value={data.productName} 
              onChange={handleOnChange}
              className='admin-form__control'
              required
            />


            <label className='admin-form__label' htmlFor='brandName'>Brand Name</label>
            <input 
              type='text' 
              id='brandName' 
              placeholder='enter brand name' 
              value={data.brandName} 
              name='brandName'
              onChange={handleOnChange}
              className='admin-form__control'
              required
            />

              <label className='admin-form__label' htmlFor='category'>Category</label>
              <select required value={data.category} name='category' onChange={handleOnChange} className='admin-form__control'>
                  <option value={""}>Select Category</option>
                  {
                    productCategory.map((el,index)=>{
                      return(
                        <option value={el.value} key={el.value+index}>{el.label}</option>
                      )
                    })
                  }
              </select>

              <label className='admin-form__label' htmlFor='productImage'>Product Image</label>
              <label htmlFor='uploadImageInput'>
              <div className='admin-upload-dropzone'>
                        <div className='admin-upload-dropzone__inner'>
                          <span className='text-4xl'><FaCloudUploadAlt/></span>
                          <p className='text-sm'>Upload Product Image</p>
                          <input type='file' id='uploadImageInput'  className='hidden' onChange={handleUploadProduct}/>
                        </div>
              </div>
              </label> 
              <div>
                  {
                    getImageUrl(data?.productImage) ? (
                        <div className='admin-upload-preview-list'>
                            {
                              data.productImage.map((el,index)=>{
                                const imageUrl = getImageUrl(el)
                                if(!imageUrl){
                                  return null
                                }
                                return(
                                  <div className='admin-upload-preview group' key={imageUrl + index}>
                                      <img 
                                        src={imageUrl} 
                                        alt={imageUrl} 
                                        width={80} 
                                        height={80}  
                                        className='admin-upload-preview__image'  
                                        onClick={()=>{
                                          setOpenFullScreenImage(true)
                                          setFullScreenImage(imageUrl)
                                        }}/>

                                        <div className='admin-upload-preview__delete hidden group-hover:block' onClick={()=>handleDeleteProductImage(index)}>
                                          <MdDelete/>  
                                        </div>
                                  </div>
                                  
                                )
                              })
                            }
                        </div>
                    ) : (
                      <p className='admin-form__help'>*Please upload product image</p>
                    )
                  }
                  
              </div>

              <label className='admin-form__label' htmlFor='price'>Price</label>
              <input 
                type='number' 
                id='price' 
                placeholder='enter price' 
                value={data.price} 
                name='price'
                onChange={handleOnChange}
                className='admin-form__control'
                required
              />


              <label className='admin-form__label' htmlFor='sellingPrice'>Selling Price</label>
              <input 
                type='number' 
                id='sellingPrice' 
                placeholder='enter selling price' 
                value={data.sellingPrice} 
                name='sellingPrice'
                onChange={handleOnChange}
                className='admin-form__control'
                required
              />

              <label className='admin-form__label' htmlFor='description'>Description</label>
              <textarea 
                className='admin-form__control admin-form__control--textarea' 
                placeholder='enter product description' 
                rows={3} 
                onChange={handleOnChange} 
                name='description'
                value={data.description}
              >
              </textarea>





              <button className='admin-form__submit'>Upload Product</button>
          </form> 



      
       </div>



       {/***display image full screen */}
       {
        openFullScreenImage && (
          <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
        )
       }
        

    </div>
  )
}

export default UploadProduct
