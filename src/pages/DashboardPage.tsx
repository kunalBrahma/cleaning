import { useAuth } from '@/contexts/AuthContext';

import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto mt-[130px] pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700">Account Status: <span className="text-green-600 font-medium">Active</span></p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
            <div className="text-center py-8 text-gray-500">
              <p>You don't have any active bookings.</p>
              <Link to="/booking" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                Book a Service
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                to="/booking" 
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center font-medium transition-colors"
              >
                Book New Service
              </Link>
              <Link 
                to="/contact" 
                className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-center font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;