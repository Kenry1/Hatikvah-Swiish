
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (user.role === 'technician') {
      navigate('/technician');
    } else if (user.role === 'warehouse') {
      navigate('/warehouse');
    } else if (user.role === 'logistics') {
      navigate('/logistics');
    }
  }, [user, navigate]);

  return null;
};

export default Home;
