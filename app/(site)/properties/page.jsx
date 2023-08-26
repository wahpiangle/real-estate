'use client'

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import PropertyCard from "./components/PropertyCard"
import PropertyFilter from "./components/PropertyFilter"
import { useSession } from "next-auth/react"
import { IoOptionsOutline } from 'react-icons/io5'
import useSWR from "swr"
import axios from "axios"

const page = () => {
  const searchParams = useSearchParams();
  const [dates, setDates] = useState([]);
  const [location, setLocation] = useState('Anywhere');
  const defaultMaxPrice = 10000000;
  const [price, setPrice] = useState([0, defaultMaxPrice]);
  const [propertyType, setPropertyType] = useState('Any Type');
  const [facilities, setFacilities] = useState([]);
  const [userWishList, setUserWishList] = useState([1, 2])
  let type = searchParams.get('type');
  if (type !== 'purchase' && type !== 'rent') {
    type = 'rent';
  }

  const propertiesFetcher = async(url) =>{
    const response = await axios.get(url).then(res => res.data)
    return response
  }
  const {data, isLoading, error} = useSWR(`/api/properties/${type}`, propertiesFetcher);

  const test = [
    {
      id: 1,
      title: 'Test',
      type: 'Landed',
      address: 'Test',
      listingType: 'Rent',
      rentalPrice: 123,
      bedroom: 3,
      bathroom: 2,
      size: 1233,
      rating: 0,
      images: [
        'https://dummyimage.com/200x100'
      ],
      facilities: [
        'Wifi',
        'Parking'
      ],
      booked: false,
      purchased: false,
      country: 'United Arab Emirates'
    },
    {
      id: 2,
      title: 'Test',
      type: 'Landed',
      address: 'Test',
      listingType: 'Rent',
      rentalPrice: 123,
      bedroom: 3,
      bathroom: 2,
      size: 1233,
      rating: 0,
      images: [
        'https://dummyimage.com/200x100'
      ],
      facilities: [
        'Wifi',
        'Parking'
      ],
      booked: false,
      purchased: false,
      country: 'United Arab Emirates'
    },
    {
      id: 3,
      title: 'Test',
      type: 'Landed',
      address: 'Test',
      listingType: 'Rent',
      rentalPrice: 123,
      bedroom: 3,
      bathroom: 2,
      size: 1233,
      rating: 0,
      images: [
        'https://dummyimage.com/200x100'
      ],
      facilities: [
        'Wifi',
        'Parking'
      ],
      booked: false,
      purchased: false,
      country: 'United Arab Emirates'
    }
  ]


  const handleSearch = () => {
    //TODO setup api endpoint to search for properties
    console.log({
      type,
      dates,
      location,
      price,
      propertyType,
    });
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="lg:px-32 md:px-24 sm:px-12 px-10 py-8">
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-primaryText text-4xl font-display font-medium">Search Properties to {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
          <PropertyFilter
            location={location}
            setLocation={setLocation}
            setDates={setDates}
            defaultMaxPrice={defaultMaxPrice}
            price={price}
            facilities={facilities}
            setFacilities={setFacilities}
            setPrice={setPrice}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            handleSearch={handleSearch}
          />
        </div>

        <div className="mt-6 text-white grid gap-8 justify-start 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2">
          {test.map((property) => (
            <PropertyCard key={property.id} property={property} setUserWishList={setUserWishList} userWishList={userWishList} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page