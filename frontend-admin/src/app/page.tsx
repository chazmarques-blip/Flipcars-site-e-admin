export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-heading font-bold text-primary">
          FlipCars 2.0
        </h1>
        <p className="text-2xl text-secondary">
          Auto Body Shop Management Platform
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/auth/login"
            className="btn-primary inline-block px-8 py-3 text-lg"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="btn-outline inline-block px-8 py-3 text-lg"
          >
            Learn More
          </a>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="card text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold mb-2">Lead Management</h3>
            <p className="text-gray-600">
              Manage customer leads with AI-powered qualification
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">AI Chat Support</h3>
            <p className="text-gray-600">
              24/7 automated customer support with intelligent escalation
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Claims Tracking</h3>
            <p className="text-gray-600">
              Complete claim workflow management and tracking
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
