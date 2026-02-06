import "./popup.css";

export default function Popup({ show, onClose }) {
  if (!show) return null;

  const goToProfile = () => {
    window.location.href = "/#/profile";
  };

  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <h2 className="popupTitle">Stripe Setup Required</h2>
        <p className="popupMessage">
          You need to set up your Stripe account before you can continue.
          Please go to your Profile page to complete the onboarding.
        </p>

        <div className="popupButtons">
          <button className="popupButtonPrimary" onClick={goToProfile}>
            Go to Profile
          </button>
          <button className="popupButtonSecondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
