import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement your authentication logic here
    // For simplicity, let's assume login is successful if both email and password are non-empty
    if (email && password) {
      // Redirect to DocumentViewer component upon successful login
      navigate('/document-viewer');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-96 bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Text-Copilot</h1>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
          />
        </div>
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;