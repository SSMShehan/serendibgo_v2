import React from 'react'
import { useParams } from 'react-router-dom'

const Payment = () => {
  const { bookingId } = useParams()
  
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Payment - {bookingId}
          </h1>
          <p className="text-xl text-base-content/70">
            Complete your payment securely
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payment
