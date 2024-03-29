'use client'
import Header from './components/Header'
import About from './components/About'

const page = () => {
  return (
    <div className='bg-black sm:px-16 px-12 py-10 sm:py-10 min-h-screen'>
      <Header/>
      <About/>
    </div>
  )
}

export default page