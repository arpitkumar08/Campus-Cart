import React from 'react'

const SidebarSkeleton = () => {
  return (
    <div className="w-80 bg-gray-900 text-white h-full border-r border-gray-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Chat List Skeleton */}
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col p-4 border-b border-gray-700 space-y-2"
          >
            {/* Product Title Skeleton */}
            <div className="h-4 w-2/3 bg-gray-700 rounded animate-pulse"></div>

            {/* User Name Skeleton */}
            <div className="h-3 w-1/3 bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SidebarSkeleton
