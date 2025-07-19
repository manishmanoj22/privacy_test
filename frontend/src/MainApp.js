// src/MainApp.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MyPrivacyApp from './App'; // Your main page
import PrivacyNotice from './PrivacyNotice';
import ContactPage from './Contact';
import LoginPage from './Login';
import { CookieBanner, FloatingButton } from './PreferenceCenter';
import ContactMessagesPage from './ContactMessagesPage';

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


function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

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

useEffect(() => {
  if (consent === 'accept') {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-E2LTRKNXKE';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });

    gtag('js', new Date());

    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });

    gtag('config', 'G-E2LTRKNXKE');
  }
}, [consent]);


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
          <Link to="/privacy-notice" style={{ marginRight: '10px' }}>Privacy Notice</Link>
          <Link to="/contact-me" style={{ marginRight: '10px' }}>Contact Me</Link>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/contact-messages">Contact Messages</Link>
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
                selectedOption={selectedOption}
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
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            }
          />
          <Route
            path="/contact-me"
            element={
              <ContactPage
                consent={consent}
                bannerstate={bannerstate}
                handleConsent={handleConsent}
                handleBanner={handleBanner}
                loaded={loaded}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            }
          />
         <Route
                    path="/login"
                    element={
                      <LoginPage
                        consent={consent}
                        bannerstate={bannerstate}
                        handleConsent={handleConsent}
                        handleBanner={handleBanner}
                        loaded={loaded}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                      />
                    }
                  />

          <Route
                              path="/contact-messages"
                              element={ isAuthenticated() ? (
                                <ContactMessagesPage
                                  consent={consent}
                                  bannerstate={bannerstate}
                                  handleConsent={handleConsent}
                                  handleBanner={handleBanner}
                                  loaded={loaded}
                                  selectedOption={selectedOption}
                                  setSelectedOption={setSelectedOption}
                                />) : (
                                        <Navigate to="/login" replace />
                                      )
                              }
                            />
        </Routes>
      </div>
    </Router>
  );
}
