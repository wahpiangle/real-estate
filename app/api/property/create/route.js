import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function POST(request){
    try{
        const body = await request.json();
        const { title, description, type, price, facilities, address, bathroom, bedroom, listingType, images, country, size, userEmail, startDate, endDate } = body;
        if(!title || !description || !type || !price || !facilities || !address || !bathroom || !bedroom || !listingType || !country || !size){
            return new NextResponse('Missing property data', {status: 400});
        }
        if(!userEmail){
            return new NextResponse('Unauthorized', {status: 401})
        }
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        if(!user){
            return new NextResponse('Unauthorized', {status: 401});
        }

        const geocode = await fetch('https://maps.googleapis.com/maps/api/geocode/json?place_id='+address.place_id+'&key='+process.env.GOOGLE_MAPS);
        const geocodeData = await geocode.json();
        const geocodeLocation = geocodeData.results[0] || null;

        if(listingType === 'Rent' && listingType !== 'Sale'){
            const property = await prisma.property.create({
                data: {
                    title,
                    description,
                    type,
                    rentalPrice: parseFloat(price),
                    salePrice: 0,
                    facilities,
                    address,
                    bathroom: parseInt(bathroom),
                    bedroom: parseInt(bedroom),
                    listingType,
                    startDate,
                    endDate,
                    images,
                    geocode: geocodeLocation,
                    country,
                    size: parseInt(size),
                    owner: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            });
            const updatedUser = await prisma.user.update({
                where:{
                    email: userEmail,
                },
                data: {
                    propertyIds:{
                        push: property.id
                    }
                }
            })

            if(!property || !updatedUser){
                return new NextResponse('Property creation error', {status: 500});
            }
            return new NextResponse(JSON.stringify(property), {status: 201});
        }
        else if(listingType === 'Sale' && listingType !== 'Rent'){
            const property = await prisma.property.create({
                data: {
                    title,
                    description,
                    type,
                    rentalPrice: 0,
                    salePrice: parseFloat(price),
                    facilities,
                    address,
                    geocode: geocodeLocation,
                    bathroom: parseInt(bathroom),
                    bedroom: parseInt(bedroom),
                    listingType,
                    images,
                    country,
                    size: parseInt(size),
                    owner: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            });

            const updatedUser = await prisma.user.update({
                where:{
                    email: userEmail,
                },
                data: {
                    propertyIds:{
                        push: property.id
                    }
                }
            })

            if(!property || !updatedUser){
                return new NextResponse('Property creation error', {status: 500});
            }
            return new NextResponse(JSON.stringify(property), {status: 201});
        }

        return new NextResponse(JSON.stringify(body), {status: 201});
    }catch(error){
        console.log(error, 'Property creation error');
        return new NextResponse('Internal Server Error', {status: 500});
    }
}