import { Link } from "react-router-dom";

function NotFound() {
  // const homePath =
  //   auth?.role === "admin"
  //     ? "/admin"
  //     : auth?.role === "student"
  //     ? "/student"
  //     : "/login";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404
      </h1>

      <p className="text-gray-600 text-center mb-6">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/admin"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
