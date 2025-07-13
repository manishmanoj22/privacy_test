// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// DropDown component
function DropDown({ selectedOption, handleChange }) {
  return (
    <div className="dropdown-container">
      <label htmlFor="dropdown">Choose an option:</label>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="lightblue">Blue</option>
        <option value="lightgreen">Green</option>
        <option value="orange">Orange</option>
      </select>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}

// MyHeading component
function MyHeading() {
  useEffect(() => {
    document.title = "My Website"; // ✅ Sets page title
  }, []);

  return (
    <div>
      <h1 className="content">Manish's Website</h1>
    </div>
  );
}

// MyApp component
function MyApp({ consent, selectedOption }) {
  if (consent === 'reject') {
    return (
      <div>
        <MyHeading />
        <p style={{
                   backgroundColor: consent === 'accept' ? (selectedOption || 'white') : 'white',
                   padding: "10px"
                 }}>
          This is my page and you have rejected consent to processing personal data
        </p>
      </div>
    );
  } else if (consent === 'accept') {
    return (
      <div>
        <MyHeading />
        <p style={{ backgroundColor: selectedOption, padding: "10px" }}>
          This is my page and you have consented to processing data
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <MyHeading />
        <p className="avatar">You have not consented yet</p>
      </div>
    );
  }
}

// Main Privacy App component
function MyPrivacyApp({ consent, bannerstate, handleConsent, handleBanner, loaded, selectedOption, setSelectedOption }) {


  const [geoData, setGeoData] = useState(null);
  const [cookieInfo, setCookieInfo] = useState(null);

  const deviceDetails = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`, // ✅ Fixed
  };

  function handleChange(event) {
    const selectedValue = event.target.value;
      setSelectedOption(selectedValue);

      // ✅ Track manually with GA4
      if (consent === 'accept' && window.gtag) {
        window.gtag('event', 'dropdown_selection', {
          event_category: 'User Interaction',
          event_label: selectedValue,
          value: selectedValue
        });
      }
  }

  function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Handle consent changes
  useEffect(() => {
    if (consent === 'accept') {
      fetch('https://ipinfo.io/json')
        .then((res) => res.json())
        .then((data) => {
          setGeoData(data);

          const allInfo = {
            device: deviceDetails,
            geo: {
              ip: data.ip,
              city: data.city,
              country: data.country_name,
            },
          };

          document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(allInfo))}; path=/; max-age=31536000`;
          document.cookie = `consentState=${consent}; path=/; max-age=31536000`;
          document.cookie = `bannerState=${bannerstate ? "true" : "false"}; path=/; max-age=31536000`;
          document.cookie = `backgroundColor=${selectedOption}; path=/; max-age=31536000`;
          setCookieInfo(allInfo);
        });
    } else if (consent === 'reject') {
      document.cookie = "userInfo=; path=/; max-age=0";
      document.cookie = "backgroundColor=; path=/; max-age=0";
      document.cookie = `consentState=${consent}; path=/; max-age=31536000`;
      document.cookie = `bannerState=${bannerstate ? "true" : "false"}; path=/; max-age=31536000`;
      setCookieInfo(null);
    } else {
      setCookieInfo(null);
    }
  }, [consent, bannerstate]);

useEffect(() => {
  if (consent === 'accept' && selectedOption) {
    document.cookie = `backgroundColor=${selectedOption}; path=/; max-age=31536000`;
  }
}, [consent, selectedOption]);

useEffect(() => {
  if (consent === 'reject') {
    document.cookie = "backgroundColor=; path=/; max-age=0";
  }
}, [consent]);


  let ipdetail = null;
  if (consent === null) {
    ipdetail = (
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f9f9f9", color: "#555" }}>
        <p>Consent not provided yet.</p>
      </div>
    );
  } else if (consent === 'reject') {
    ipdetail = (
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#ffe6e6", color: "#cc0000" }}>
        <p><strong>You have rejected consent, so cookies have been deleted and no personal info is fetched.</strong></p>
      </div>
    );
  } else if (cookieInfo) {
    ipdetail = (
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <p><strong>🔐 PI Fetched from Cookie:</strong></p>
        <p>📍 IP: {cookieInfo.geo?.ip}</p>
        <p>🏙️ Location: {cookieInfo.geo?.city}, {cookieInfo.geo?.country}</p>
        <p>🖥️ User Agent: {cookieInfo.device?.userAgent}</p>
        <p>💻 Platform: {cookieInfo.device?.platform}</p>
        <p>🌐 Language: {cookieInfo.device?.language}</p>
        <p>📏 Resolution: {cookieInfo.device?.screenResolution}</p>
      </div>
    );
  }

  return (
    <div>
      <MyApp consent={consent} selectedOption={selectedOption} />
      <iframe title="vimeo-player" src="https://player.vimeo.com/video/1087658066?h=43195079d7" width="640" height="360" frameborder="0"    allowfullscreen></iframe>
      <DropDown selectedOption={selectedOption} handleChange={handleChange} />
      {ipdetail}
    </div>
  );
}

export default MyPrivacyApp;
