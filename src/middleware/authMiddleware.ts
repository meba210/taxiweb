import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PUBLIC_ROUTES = ['/', '/auth/login'];

const useAuthCheck = (): void => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    if (!token && !isPublicRoute) {
      navigate('/auth/login', { replace: true });
    }

    if (token && location.pathname === '/auth/login') {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);
};

export default useAuthCheck;
