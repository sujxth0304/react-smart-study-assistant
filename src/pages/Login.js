import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:5000/api/login', {username : email, password : password,});

        console.log(response.data);
        navigate('/');
    } catch (err){
        setError('Inva;id email or password')
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style ={{ color: 'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
            <label>Email:</label>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>

        <div>
            <label>Password:</label>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
       
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;