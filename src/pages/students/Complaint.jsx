import React from 'react'
import ComplaintForm from '../../components/ComplaintForm'
const Complaint = () => {
  return (
    <div className="p-4 min-h-screen max-w-4xl mx-auto m-5">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
        <h1 className='text-center p-4 font-semibold  text-gray-50 text-lg'>
          Complaint Form
        </h1>
        <ComplaintForm />
      </div>
    </div>
  );
}

export default Complaint