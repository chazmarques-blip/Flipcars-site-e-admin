export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div
          className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p className="mt-4 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
}
