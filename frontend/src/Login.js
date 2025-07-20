import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ consent, setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });

  const [isValid, setIsValid] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { email, password, confirm_password } = formData;
    let valid = false;

    if (isLogin) {
      valid = email.length > 6 && email.includes('@') && password.length > 6;
    } else {
      valid =
        email.length > 6 &&
        email.includes('@') &&
        password.length > 6 &&
        password === confirm_password;
    }

    setIsValid(valid);
  }, [formData, isLogin]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const endpoint = isLogin ? '/api/login/authenticate' : '/api/login';

    fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ IMPORTANT: Allows cookie to be stored
      body: JSON.stringify(formData)
    })
      .then(async response => {
        if (response.ok) {
          if (isLogin) {
            alert('Login successful!');
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/contact-messages');
          } else {
            alert('Signup successful!');
          }

          setFormData({ email: '', password: '', confirm_password: '' });
        } else if (response.status === 409 && !isLogin) {
          alert('Email already registered. Please log in.');
        } else if (response.status === 401 && isLogin) {
          alert('Invalid email or password.');
        } else {
          alert('Something went wrong.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Server error.');
      });

    if (consent === 'accept' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'User Interaction',
        event_label: 'User Email',
        value: formData.email
      });
    }
  }

  return (
    <>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email: </label>
        <input name="email" value={formData.email} onChange={handleChange} required />
        <br /><br />
        <label>Password: </label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <br /><br />
        {!isLogin && (
          <>
            <label>Confirm Password: </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <br /><br />
          </>
        )}
        <button type="submit" disabled={!isValid}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '10px' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
    </>
  );
}
