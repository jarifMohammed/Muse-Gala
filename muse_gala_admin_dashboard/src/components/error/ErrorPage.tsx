import { XCircle } from 'lucide-react'

interface ErrorPageProps {
  errorMessage: string
}

const ErrorPage = ({ errorMessage }: ErrorPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-[300px] bg-gradient-to-r from-red-200 via-red-300 to-red-400 rounded-lg p-6 shadow-md">
      <div className="text-center max-w-lg w-full">
        <div className="mb-4">
          <XCircle className="mx-auto text-red-600 w-16 h-16" />
        </div>
        <p className="text-red-700 text-xl font-semibold mb-4">
          Oops! Something went wrong.
        </p>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()} // Reload the page
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Retry
          </button>
          <button
            onClick={() => window.history.back()} // Go back to the previous page
            className="px-6 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
