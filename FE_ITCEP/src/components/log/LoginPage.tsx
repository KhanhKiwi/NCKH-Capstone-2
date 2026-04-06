import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftPanel from './LeftPanel';
import AuthPanel from './AuthPanel';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await authService.login(email, password);
        authService.saveToken(response.access_token);
        console.log('Login successful');
        navigate('/');
      } else {
        await authService.register(email, password, name);
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
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
