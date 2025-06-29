import React, { useState, useEffect } from 'react';
import './App.css';

export default function ContactPage({ consent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isValid, setIsValid] = useState(false);

  // Validate email whenever formData.email changes
  useEffect(() => {
    const email = formData.email;
    const valid = email.length > 6 && email.includes('@');
    setIsValid(valid);
  }, [formData.email]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting me!');
    setFormData({ name: '', email: '', message: '' });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contact Me</h2>
      <p>
        Let’s get in touch. Whether you’re interested in working together, have a privacy-related query, or simply want to leave feedback — use the form below.
      </p>
      <p>
        Current cookie consent status: <strong style={{ color: "black" }}>{consent || "Not provided"}</strong>
      </p>
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", display: "inline-block",minWidth: "410px", borderRadius: "6px"  }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style = {{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <label style={{ marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', marginLeft: '20px' }}
            />
          </div>

          <div style = {{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', marginLeft: '20px' }}

            />
          </div>

          <div style = {{ display: 'flex', alignItems: 'top', gap: '10px', marginBottom: '10px' }}>
            <label style={{ alignItems: 'top', marginBottom: '5px', marginTop: '5px'  }}>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={{ marginTop: '10px' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
