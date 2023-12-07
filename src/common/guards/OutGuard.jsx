import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function OutGuard({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.user) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return children;
}