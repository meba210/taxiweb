import { useNavigate } from 'react-router-dom';

const FallbackPage = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Required
          </h1>

          <p className="text-gray-600 mb-8">
            You need to be logged in to access the dashboard. Please click the
            button below to continue.
          </p>
        </div>

        <button
          onClick={handleGoToDashboard}
          className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Go to Dashboard
        </button>

        <p className="mt-6 text-sm text-gray-500">
          This is a fallback page for unauthorized access.
        </p>
      </div>
    </div>
  );
};

export default FallbackPage;
