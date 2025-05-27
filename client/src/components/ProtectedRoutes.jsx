import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
  // agar tum authenticated nhi hoto tum protected routes nhi access kar sakte
  const {isAuthenticated} = useSelector((store) => store.auth);

  if(!isAuthenticated) {
    return <Navigate to="/login"/>
  }
  return children;
}
export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  // agar tum authenticated ho par login ko vapas access karoge to nhi karne denge
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // student hoto instructor ke pages access nhi kr skte
  if (user?.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};