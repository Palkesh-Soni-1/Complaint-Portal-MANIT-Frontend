import React from 'react'
import ComplaintForm from '../../components/Student/ComplaintForm';
const Complaint = () => {
  return (
    <div className="py-4 px-2 min-h-screen max-w-[1100px] mx-auto m-5">
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