import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex mb-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white rounded-l-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-green-600 text-white rounded-r-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Registrarse
          </button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
