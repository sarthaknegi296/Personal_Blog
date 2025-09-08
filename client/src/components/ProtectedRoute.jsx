import { Navigate } from "react-router-dom";

// It accepts a single prop, 'children', which will be the component(s)
// that this route is protecting (e.g., the <AdminDashboard />).
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

    if(!token) {
      // Redirect the user to the login page.
      // Rendering the <Navigate> component will cause react-router to change
      // the URL and render the component for the '/admin/login' route instead.
      // The 'replace' prop is a crucial piece of UX: it replaces the current
      // entry in the browser's history stack instead of pushing a new one.
      // This prevents the user from being able to click the "back" button
      // and re-access the protected route after being redirected.
      return <Navigate to="/admin/login" replace />;
    }
  
    return children;
};

export default ProtectedRoute;
