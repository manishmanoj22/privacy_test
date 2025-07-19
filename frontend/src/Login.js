import React, { useState, useEffect } from 'react';
import './App.css';

export default function LoginPage({ consent }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });

  const [isValid, setIsValid] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Validate email whenever formData.email changes
useEffect(() => {
  const email = formData.email;
  const password = formData.password;
  const confirm_password = formData.confirm_password;
 let valid = false;

   if (isLogin) {
     // Login: just check email and password
     valid = email.length > 6 && email.includes('@') && password.length > 6;
   } else {
     // Signup: check email, password, and confirm_password match
     valid =
       email.length > 6 &&
       email.includes('@') &&
       password.length > 6 &&
       password === confirm_password;
   }

   setIsValid(valid);
 }, [formData.email, formData.password, formData.confirm_password, isLogin]);


  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(`API base URL: ${process.env.REACT_APP_API_BASE_URL}`);

    const endpoint = isLogin ? '/api/login/authenticate' : '/api/login';

    fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(async response => {
        if (response.ok) {
          if (isLogin) {
            alert('Login successful!');
          } else {
            alert('Signup successful!');
          }
          setFormData({ name: '', email: '', password: '', confirm_password: '' });
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
          <br />
          <br />
          <label>Password: </label>
          <input name="password" value={formData.password} onChange={handleChange} required />
          <br />
          <br />

          {!isLogin && (
            <div>
            <label>Confirm Password: </label>
            <input
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <br />
                      <br />
            </div>
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
