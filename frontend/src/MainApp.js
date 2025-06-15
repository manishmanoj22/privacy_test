// src/MainApp.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MyPrivacyApp from './App'; // Your main page
import PrivacyNotice from './PrivacyNotice';
import { CookieBanner, FloatingButton } from './PreferenceCenter';

function getCookieValue(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export default function MainApp() {
  const [consent, setConsent] = useState(null);
  const [bannerstate, setBannerstate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const savedConsent = getCookieValue("consentState");
    const savedBannerState = getCookieValue("bannerState");
    const savedSelectedOption = getCookieValue("backgroundColor");


    if (savedConsent) setConsent(savedConsent);
  // If consent is accept and savedSelectedOption exists, set it; else set default
  if (savedConsent === 'accept' && savedSelectedOption) {
    setSelectedOption(savedSelectedOption);
  } else if (savedConsent === 'accept' && !savedSelectedOption) {
    setSelectedOption(savedSelectedOption);  // or your preferred default color
  } else {
    setSelectedOption(''); // No color or clear selection if consent rejected or null
  }

  if (savedBannerState === "true") setBannerstate(true);
  else setBannerstate(false);

    setLoaded(true);
  }, []);

  function handleConsent(choice) {
    setConsent(choice);
    document.cookie = `consentState=${choice}; path=/; max-age=31536000`;
    document.cookie = `bannerState=true; path=/; max-age=31536000`;
    setBannerstate(true);
  }

  function handleBanner(status) {
    setBannerstate(status);
    document.cookie = `bannerState=${status ? "true" : "false"}; path=/; max-age=31536000`;
  }

  return (
    <Router>
      <div>
        <nav style={{ marginBottom: '15px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/privacy-notice">Privacy Notice</Link>
        </nav>

        <CookieBanner
          consent={consent}
          bannerstate={bannerstate}
          handleConsent={handleConsent}
          handleBanner={handleBanner}
          loaded={loaded}
        />
        <FloatingButton handleBanner={handleBanner} />

        <Routes>
          <Route
            path="/"
            element={
              <MyPrivacyApp
                consent={consent}
                bannerstate={bannerstate}
                handleConsent={handleConsent}
                handleBanner={handleBanner}
                loaded={loaded}
                selectedOption={selectedOption}         // pass down
                setSelectedOption={setSelectedOption}
              />
            }
          />
          <Route
            path="/privacy-notice"
            element={
              <PrivacyNotice
                consent={consent}
                bannerstate={bannerstate}
                handleConsent={handleConsent}
                handleBanner={handleBanner}
                loaded={loaded}
                selectedOption={selectedOption}         // pass down
                setSelectedOption={setSelectedOption}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
