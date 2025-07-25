import { Link } from 'react-router-dom';
export default function PrivacyNotice({ consent, selectedOption }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Privacy Notice</h2>
      <p>
        We value your privacy. This website collects limited data like IP address, location,
        and device info only if you consent. The data is used solely for improving user experience.
      </p>
      <p>
        Current consent: <strong style={{ color: consent === "accept" ? selectedOption || "black" : "black" }}>{consent || "Not provided"}</strong>
      </p>
      <p>
        For more information, you can reach me via the <Link to="/contact-me" style={{ color: 'blue', textDecoration: 'underline' }}>Contact Form</Link>.
      </p>
    </div>
  );
}
