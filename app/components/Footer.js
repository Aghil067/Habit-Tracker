import React from 'react'

const Footer = () => {
  return (
    <div className='mt-10'>
      <footer>
        <div className="bg-green-600 text-white text-center p-4 bottom-0 w-full">
          <p className="text-sm">© 2023 GrowDaily. All rights reserved.</p>
          <p className="text-xs mt-2">Made with ❤️ by GrowDaily Team</p>
        </div>
        <div className="bg-gray-200 text-gray-700 text-center p-2">
          <p className="text-xs">Follow us on
            <a href="https://twitter.com" className="text-blue-500 hover:underline ml-1">Twitter</a>,
            <a href="https://facebook.com" className="text-blue-500 hover:underline ml-1">Facebook</a>,
            <a href="https://instagram.com" className="text-blue-500 hover:underline ml-1">Instagram</a>
          </p>
        </div>
        <div className="bg-gray-100 text-gray-600 text-center p-2">
          <p className="text-xs">Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
