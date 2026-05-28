const cloudName = import.meta.env.VITE_CLOUD_NAME_CLOUDINARY
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

const uploadImage  = async(image) => {
    if(!cloudName){
        throw new Error("Cloudinary cloud name is missing")
    }

    if(!uploadPreset){
        throw new Error("Cloudinary upload preset is missing")
    }

    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset", uploadPreset)
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    const data = await dataResponse.json()

    if(!dataResponse.ok){
        const cloudinaryMessage = data?.error?.message || ""
        if(cloudinaryMessage.toLowerCase().includes("upload preset")){
            throw new Error(`Cloudinary upload preset is invalid or not found: ${uploadPreset}. Make sure the preset exists in Cloudinary and is set to unsigned.`)
        }
        throw new Error(cloudinaryMessage || "Image upload failed")
    }

    const imageUrl = data?.secure_url || data?.url || ""

    if(!imageUrl){
        throw new Error("Cloudinary did not return an image URL")
    }

    return {
        ...data,
        imageUrl
    }

}

export default uploadImage 
