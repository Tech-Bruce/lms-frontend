import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user && user.role === 'super-admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default SuperAdminRoute;