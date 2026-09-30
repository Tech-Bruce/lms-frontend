import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const InstructorRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'instructor') {
      navigate('/');
    }
  }, [user, navigate]);

  return user?.role === 'instructor' ? children : null;
};

export default InstructorRoute;