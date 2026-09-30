import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StudentRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  return user?.role === 'student' ? children : null;
};

export default StudentRoute;