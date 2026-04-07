import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftPanel from './LeftPanel';
import AuthPanel from './AuthPanel';
import { authService } from '../../api/services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      authService.saveToken(token);
      navigate('/');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isForgotPassword) {
      setIsLoading(true);
      try {
        await authService.forgotPassword(email);
        setMessage('Liên kết đặt lại mật khẩu đã được gửi vào email của bạn');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await authService.login(email, password);
        authService.saveToken(response.access_token);
        console.log('Login successful');
        navigate('/');
      } else {
        await authService.register(email, password, name, username);
        console.log('Registration successful');
        const loginResponse = await authService.login(email, password);
        authService.saveToken(loginResponse.access_token);
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Auth error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50">
      {/* Journey Line Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0 200 Q 300 100 600 300 T 1200 400 Q 1500 300 1800 500"
          stroke="#92400e"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10 5"
        />
        <path
          d="M 100 500 Q 400 350 700 600 T 1400 700"
          stroke="#065f46"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
        />
      </svg>

      <div className="relative flex h-full">
        <LeftPanel />
        <AuthPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isForgotPassword={isForgotPassword}
          setIsForgotPassword={setIsForgotPassword}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          message={message}
        />
      </div>
    </div>
  );
}
