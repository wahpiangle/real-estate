'use client'
import { useForm, Controller } from "react-hook-form"
import SelectFacility from "./components/SelectFacility"
import { CldUploadButton } from "next-cloudinary"
import { useState } from "react"
import { RxCross1 } from "react-icons/rx"
import axios from "axios"
import SelectCountries from "./components/SelectCountries"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"
import Link from "next/link"
import SelectAddress from "./components/SelectAddress"
import GoogleMaps from "./components/GoogleMaps"
import SelectDate from "./components/SelectDate"
import { HiArrowLongRight } from "react-icons/hi2"
import moment from "moment"

const Page = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm()
  const [uploaded, setUploaded] = useState([])
  const [images, setImages] = useState([])
  const handleUpload = (result) => {
    setUploaded(prev => [...prev, result.info.original_filename])
    setImages(prev => [...prev, result.info.secure_url])
  }
  const session = useSession();

  const onSubmit = (data) => {
    if (!data.title || !data.description || !data.address || !data.type || !data.listingType || !data.price || !data.bedroom || !data.bathroom || !data.size || !data.country || !data.address || (data.listingType == "Rent" && (!data.startDate || !data.endDate))) {
      toast.error('Please fill in all the fields!')
      return
    }
    console.log(data)
    axios.post('/api/property/create', {
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price,
      address: data.address,
      facilities: data.facilities.map(item => item.value),
      listingType: data.listingType,
      bedroom: data.bedroom,
      bathroom: data.bathroom,
      size: data.size,
      startDate: data.listingType == "Rent" ? moment(data.startDate).toDate() : "",
      endDate: data.listingType == "Rent" ? moment(data.endDate).toDate() : "",
      images: images,
      country: data.country.label,
      userEmail: session.data.user.email,
      address: data.address
    }).then(res => {
      toast.success('Property Added!')
    }).catch(err => {
      toast.error('Something went wrong!')
    })
  }
  const onError = (errors) => console.log(errors)

  return (
    <div>
      <Link className='text-primaryText text-xl font-semibold cursor-pointer flex items-center' href="/dashboard/properties">
        <span className="font-bold text-2xl mr-1">{'<'}</span>
        <p className="underline">Details</p>
      </Link>
      <h1 className='text-primaryText text-2xl font-semibold whitespace-nowrap mt-3'>Add a Property</h1>
      <div className="bg-primary rounded-xl p-4 mx-2 mt-3">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-lg">Property Title</label>
            <input type="text" id="title" {...register("title", { required: true })} className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" placeholder="Title" />
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <label htmlFor="description" className="text-lg">Enter Description</label>
            <textarea id="description" {...register("description", { required: true })} className="px-2 py-3 h-[100px] resize-none focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" placeholder="Description" />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Controller
              render={({ field: { onChange, value } }) => (
                <GoogleMaps onChange={onChange} _value={value} />
              )}
              name="address"
              control={control} />
          </div>
          <div className="flex mt-3 gap-6 items-center">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="type" className="text-lg">Select Property Type</label>
              <select id="type" {...register("type", { required: true })} className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText">
                <option value="Landed">Landed</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="listingType" className="text-lg">To Rent/Sale</label>
              <select id="listingType" {...register("listingType", { required: true })} className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText">
                <option value="Rent">Rent</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="price" className="text-lg">Enter Price $</label>
              <input type="number" id="price" {...register("price", { required: true })} placeholder="Price" className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" />
            </div>
          </div>
          <div className="flex mt-3 justify-between gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="bedroom" className="text-lg">Number of Bedrooms</label>
              <input type="number" id="bedroom" {...register("bedroom", { required: true })} placeholder="Bedrooms" className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="bathroom" className="text-lg">Number of Bathrooms</label>
              <input type="number" id="bathroom" {...register("bathroom", { required: true })} placeholder="Bathrooms" className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="size" className="text-lg">Size (sqft)</label>
              <input type="number" id="size" {...register("size", { required: true })} placeholder="Size" className="px-2 py-3 focus:outline-none rounded-lg bg-primary border-[1px] border-secondaryText" />
            </div>
          </div>
          <div className="mt-3 flex gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="facilities" className="text-lg">Select Facilities</label>
              <Controller
                name="facilities"
                control={control}
                render={({ field }) => (
                  <SelectFacility {...field} ref={null} />
                )}
                rules={{ required: true }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="date" className="text-lg">Select Date (For Rentals)</label>
              <div className="flex items-center">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <SelectDate {...field} label={"Start Date"} />
                  )}
                />
                <HiArrowLongRight className="text-2xl mx-2" />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <SelectDate {...field} label={"End Date"} />
                  )}
                />

              </div>
            </div>
          </div>
          <div className="flex mt-3 gap-2">
            <div className="flex flex-col gap-1 flex-1 items-start">
              <label htmlFor="images" className="text-lg">Upload Images</label>
              <div className="flex gap-2 items-center">
                <CldUploadButton
                  uploadPreset="ygimkesr"
                  className="flex justify-start bg-primary border-[1px] rounded-lg border-secondaryText px-3 py-2"
                  onUpload={(result) => handleUpload(result)}
                >
                  Upload
                </CldUploadButton>
                <p>{uploaded.map((item, index) => {
                  if (index === uploaded.length - 1) {
                    return <span key={item} className="mr-1">{item}</span>
                  } else {
                    return <span key={item} className="mr-1">{item},</span>
                  }
                })}</p>
                {images.length > 0 &&
                  <RxCross1 onClick={() => {
                    setImages([]);
                    setUploaded([]);
                  }}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                }
              </div>
            </div>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectCountries {...field} ref={null} />
              )}
              rules={{ required: true }}
            />
          </div>

          <button type="submit" className="cursor-pointer px-3 py-2 bg-blueText rounded-lg mt-3 hover:brightness-75">Add Property</button>
        </form>
      </div>
    </div>
  )
}

export default Page