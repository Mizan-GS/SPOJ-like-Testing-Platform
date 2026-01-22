import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>

      <p className="text-gray-700 text-center mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        to="/login"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default Unauthorized;
