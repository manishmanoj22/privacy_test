import React, { useState, useEffect } from 'react';
import './App.css';

export default function LoginPage({ consent }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isValid, setIsValid] = useState(false);

  // Validate email whenever formData.email changes
useEffect(() => {
  const email = formData.email;
  const password = formData.password;
  const valid = email.length > 6 && email.includes('@') && password.length > 6;
  setIsValid(valid);
}, [formData.email, formData.password]);


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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          alert('Thank you for contacting me!');
          setFormData({ email: '', password: '' });
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
    <div style={{ padding: "20px" }}>
      <h2>Login Page</h2>

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", display: "inline-block",minWidth: "410px", borderRadius: "6px"  }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, textAlign: 'center' }}>

          <div style = {{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <label style={{ width: '89px', textAlign: 'right' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', marginLeft: '20px' }}

            />
          </div>

          <div style = {{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', marginTop: '5px'  }}>Password:</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', marginLeft: '20px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={{ marginTop: '10px' }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
