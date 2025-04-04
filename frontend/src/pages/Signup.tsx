import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:8000/user/register', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const result = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', result);
  
      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert('Registration failed: ' + (result.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Network error: Unable to connect to the server.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">FileStore</h2>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
          </h2>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full px-3 py-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full px-3 py-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-3 py-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
          <div className="text-center">
            <button onClick={() => navigate('/login')} type="button" className="text-gray-500 hover:text-blue-600 transition">
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
