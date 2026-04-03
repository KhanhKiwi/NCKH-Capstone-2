import { useState } from 'react';
import LeftPanel from './LeftPanel';
import AuthPanel from './AuthPanel';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { activeTab, email, password, name });
    // TODO: Implement login/register logic here
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
        />
      </div>
    </div>
  );
}
