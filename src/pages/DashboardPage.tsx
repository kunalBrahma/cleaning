import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Type definitions
interface Booking {
  order_id: string;
  order_number: string;
  created_at: string;
  status: string;
  items: string;
  total: string;
}

// Component
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setBookingsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<{ bookings: Booking[] }>(
          "http://localhost:5000/api/user/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.bookings) {
          setBookings(response.data.bookings);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setBookingsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="container mx-auto mt-[130px] pt-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto mt-[130px] pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-gray-600">{user?.email || "user@example.com"}</p>
              {user?.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

            {bookingsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You don't have any active bookings.</p>
                <Link
                  to="/booking"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Book a Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bookings.map((booking) => (
                  <div
                    key={booking.order_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.order_number}</h3>
                        <p className="text-sm text-gray-600">{formatDate(booking.created_at)}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm mt-2">{booking.items}</p>
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-medium">
                        Total: ₹{parseFloat(booking.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
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
