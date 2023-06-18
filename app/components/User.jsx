'use client'
import Image from 'next/image'
import React from 'react'

const User = ({ currentUser, handleUserModal }) => {
    return (
        <div className='hover:opacity-75 cursor-pointer flex-1 justify-end hidden lg:flex' onClick={handleUserModal} >
            <div className="flex items-center gap-2">
                <Image
                    src={currentUser?.image || '/assets/placeholder.png'}
                    width={40}
                    height={40}
                    className='rounded-full'
                    alt='user_image'
                />
                <h1 className='text-primaryText flex items-center'>{currentUser?.name}</h1>
            </div>
        </div>
    )
}

export default User