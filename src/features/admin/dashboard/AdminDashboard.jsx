import React, { useEffect, useState } from 'react'
import axiosClient from '../../../services/axiosClient'
import { getAdminOverviewAnalytics } from '../../../services/admin.api'
import { toast } from 'react-toastify'



function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-purple-600">
        {value}
      </p>
    </div>
  );
}


function AdminDashboard() {
  const [stats,setStats] = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)

  useEffect(()=>{
    const fetchOverview = async()=>{
      try {
        const res = await getAdminOverviewAnalytics();
        console.log(res.data.data);
        setStats(res.data.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to load dashboard analytics"
        )
      } finally{
        setLoading(false)
      }
    }
    fetchOverview()
  },[]);


  if (loading) {
    return(
      <div className='text-gray-500'>
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return(
      <div className='text-red-500'>
        Unable to load dashboard data.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Dashboard Overview
        </h1>
        <p className='text-md text-gray-500'>
          System-wide analytics summary
        </p>
      </div>

      {/* //* Stats grid */}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          label='Total Users'
          value={stats.totalUsers}
        />
        <StatCard
          label='Total Tests'
          value={stats.totalTests}
        />
        <StatCard
          label='Total Attempts'
          value={stats.totalAttempts}
        />
        <StatCard
          label='Submitted Attempts'
          value={stats.submittedAttempts}
        />
        <StatCard
          label='Average Score'
          value={stats.averageScore}
        />
      </div>
    </div>
  )
}



export default AdminDashboard
