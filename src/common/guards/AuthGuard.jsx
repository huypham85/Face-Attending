import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { getDatabase, ref, child, get } from 'firebase/database';
import { toast } from 'react-toastify';

export function PrivateRoute({ children }) {
  const { currentUser, logout, login } = useAuth();
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('email');
  const storedPassword = localStorage.getItem('password');
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (currentUser && storedEmail && storedPassword) {
        const dbRef = ref(getDatabase());
        try {
          const personalInfoSnapshot = await get(child(dbRef, `Users/${currentUser.user.uid}`));
          const personalInfo = personalInfoSnapshot.val();
          if (personalInfo.role !== 'admin') {
            toast.warn('Email hoặc mật khẩu không chính xác!');
            await logout();
          } else {
            login(storedEmail, storedPassword)
          }
        } catch (error) {
          navigate('/login');
        }
      }
    };

    fetchPersonalInfo().then((r) => {});
  }, []);

  return currentUser ? children : navigate('/login');
}
