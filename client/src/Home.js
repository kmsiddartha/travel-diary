import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file

function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState(''); // Added state for Name
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isSignUp
      ? 'http://localhost:5000/api/signup'
      : 'http://localhost:5000/api/signin';
    const body = isSignUp
      ? { name, username, password }
      : { username, password };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/diary');
    } else if (isSignUp) {
      alert('Signup successful! Please log in.');
      setIsSignUp(false); // Switch to login after successful signup
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1 className='home-header'>Travel Diary</h1>
      <div className='home-around'>
        <div className='home-container'>
          <h2 className='home-header-sign'>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <form className='auth-form' onSubmit={handleAuth}>
            {isSignUp && (
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input
                id='username'
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className='button-color-signin' type='submit'>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className='switch-link'>
            <button
              className='button-color'
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'New user? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
