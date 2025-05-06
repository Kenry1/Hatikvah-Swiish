
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Redirect based on user role
    switch (user.role) {
      case 'technician':
        navigate('/technician');
        break;
      case 'warehouse':
        navigate('/warehouse');
        break;
      case 'logistics':
        navigate('/logistics');
        break;
      case 'hr':
        navigate('/hr');
        break;
      case 'implementation_manager':
        navigate('/implementation-manager');
        break;
      case 'project_manager':
        navigate('/project-manager');
        break;
      case 'planning':
        navigate('/planning');
        break;
      case 'it':
        navigate('/it');
        break;
      case 'finance':
        navigate('/finance');
        break;
      case 'management':
        navigate('/management');
        break;
      case 'ehs':
        navigate('/ehs');
        break;
      case 'procurement':
        navigate('/procurement');
        break;
      default:
        navigate('/');
        break;
    }
  }, [user, navigate]);

  return null;
};

export default Home;
