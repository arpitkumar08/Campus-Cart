import React from 'react'
import ReportProducts from '../../Components/Admin/ReportProducts'
import ReportUsers from '../../Components/Admin/ReportUsers'

const Reports = () => {
  return (
    <div className='text-white'>
      <h1 className='text-3xl font-bold'>Reports Dashboard</h1>
      <ReportProducts />
      <ReportUsers />
    </div>
  )
}

export default Reports
