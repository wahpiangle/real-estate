'use client'

import { SessionProvider } from 'next-auth/react'

const AuthContext = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default AuthContext