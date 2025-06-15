import React from 'react';
import './App.css';

export function FloatingButton({ handleBanner }) {
  return (
    <button className="floating-button" onClick={() => handleBanner(false)}>
      Preference Center
    </button>
  );
}

export function CookieBanner({ consent, bannerstate, handleConsent, handleBanner, loaded }) {
  if (!loaded || bannerstate === true) return null;

  return (
    <div className="cookieContainer">
      <div className="content">
        <p>Do you consent to this website processing your data?</p>
        <div className="cookie">
          <button onClick={() => { handleConsent('accept'); handleBanner(true); }}>Accept</button>
          <button onClick={() => { handleConsent('reject'); handleBanner(true); }}>Reject</button>
        </div>
      </div>
    </div>
  );
}