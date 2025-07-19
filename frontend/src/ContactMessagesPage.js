import React, { useEffect, useState } from 'react';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/contact`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Contact Messages</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={index}>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}