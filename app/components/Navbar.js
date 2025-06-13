import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
      <nav className='bg-green-600 text-white flex justify-between items-center p-4 h-16'>
        <div className="logo">
          <h1 className='font-bold text-2xl'>GrowDaily</h1>
        </div>
        <ul className='flex space-x-4'>
          <Link href={"/"}>
            <li className='cursor-pointer hover:text-black'>Home</li>
          </Link>
          <li className='cursor-pointer hover:text-black'>About</li>
          <li className='cursor-pointer hover:text-black'>Contact</li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
