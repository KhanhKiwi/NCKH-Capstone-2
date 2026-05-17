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

  // Clear error/message when switching tabs or forgot-password state
  useEffect(() => {
    setError('');
    setMessage('');
  }, [activeTab, isForgotPassword]);

  // Controlled setters that also clear errors when user types
  const handleSetEmail = (v: string) => { setEmail(v); setError(''); setMessage(''); };
  const handleSetUsername = (v: string) => { setUsername(v); setError(''); setMessage(''); };
  const handleSetPassword = (v: string) => { setPassword(v); setError(''); setMessage(''); };
  const handleSetConfirmPassword = (v: string) => { setConfirmPassword(v); setError(''); setMessage(''); };
  const handleSetName = (v: string) => { setName(v); setError(''); setMessage(''); };

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

    if (activeTab === 'register') {
      if (!name.trim() || !email.trim() || !username.trim() || !password || !confirmPassword) {
        setError('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      const beforeAt = email.split('@')[0];
      const afterAt = email.split('@')[1];
      if (!email.includes('@') || !beforeAt || !/^[a-zA-Z0-9._]+$/.test(beforeAt) || !afterAt || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(afterAt)) {
        setError('Email không đúng định dạng.');
        return;
      }

      if (password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Mật khẩu phải có ít nhất 1 chữ hoa (A-Z).');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('Mật khẩu phải có ít nhất 1 chữ số (0-9).');
        return;
      }
      if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        setError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Mật khẩu nhập lại không khớp.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await authService.login(email, password);
        authService.saveToken(response.access_token);
        console.log('Login successful');
        setError('');
        setMessage('');
        // Force full navigation to clear any modal state owned by other pages
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        } else {
          navigate('/');
        }
      } else {
        await authService.register(email, password, name, username);
        console.log('Registration successful');
        setError('');
        setMessage('Đăng ký thành công! Chào mừng bạn.');
        setActiveTab('login');
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
          setEmail={handleSetEmail}
          username={username}
          setUsername={handleSetUsername}
          password={password}
          setPassword={handleSetPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={handleSetConfirmPassword}
          name={name}
          setName={handleSetName}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          message={message}
        />
      </div>
    </div>
  );
}
