import React from 'react'

interface SkeletonLoaderProps {
  title?: string
}

const SkeletonLoader = ({ title }: SkeletonLoaderProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 py-5">
        {title && <h2 className="text-2xl font-semibold">{title}</h2>}

        <div className="flex items-center gap-2">
          <div className="w-[200px] bg-gray-300 h-6 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <table className="w-full border-collapse text-sm">
        <thead className="border-b">
          <tr>
            {/* Repeating Skeleton Headers */}
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-2/12">
              <div className="w-36 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-2/12">
              <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-20 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-2/12">
              <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
            <th className="p-2 bg-gray-100 text-left text-gray-500 font-medium w-1/12">
              <div className="w-20 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Skeleton Rows */}
          {[...Array(3)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-36 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Skeleton */}
      <div className="mt-4 flex justify-between items-center">
        <div className="w-1/3 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoader
