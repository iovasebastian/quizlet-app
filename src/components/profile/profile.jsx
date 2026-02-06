import "./profile.css";
import axios from "axios";
import RequireAuth from '../RequireAuth/RequireAuth';
import { useState, useEffect } from "react";

const Profile = () => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [onboarded, setOnboarded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stripeId, setStripeId] = useState("");
    const [stripeDashLink, setStripeDashLink] = useState("");

    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.split("?")[1]);
    const token = localStorage.getItem('token');
    const [country, setCountry] = useState("");
    const expired = searchParams.get("expired");

    const onboardingStatus = new URLSearchParams(window.location.search).get("onboarding");

    const STRIPE_SUPPORTED_COUNTRIES = {
    US: "United States",
    CA: "Canada",

    AT: "Austria",
    BE: "Belgium",
    BG: "Bulgaria",
    HR: "Croatia",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    EE: "Estonia",
    FI: "Finland",
    FR: "France",
    DE: "Germany",
    GR: "Greece",
    HU: "Hungary",
    IE: "Ireland",
    IT: "Italy",
    LV: "Latvia",
    LT: "Lithuania",
    LU: "Luxembourg",
    MT: "Malta",
    NL: "Netherlands",
    NO: "Norway",
    PL: "Poland",
    PT: "Portugal",
    RO: "Romania",
    SK: "Slovakia",
    SI: "Slovenia",
    ES: "Spain",
    SE: "Sweden",
    CH: "Switzerland",
    GB: "United Kingdom",

    AU: "Australia",
    NZ: "New Zealand",
    JP: "Japan",
    SG: "Singapore",
    HK: "Hong Kong",

    BR: "Brazil",
    MX: "Mexico",
    };


    const fetchOnboarding = async () => {
        console.log('entered');
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/checkStripeOnboarding`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOnboarded(Boolean(response.data.value[0].onboardedStripe));
        } catch (err) {
            console.error(err);
            setError("Failed to load Stripe onboarding status.");
        } finally {
            setLoading(false);
        }
    };

    const navigateStripeDashboard = async () => {
        try {
            const response = await axios.get(`${baseURL}/getStripeId`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            const stripeId = response.data[0]?.stripeId;

            if (!stripeId) {
            console.error("No stripeId found for user");
            alert("No Stripe account connected to this user.");
            return;
            }

            const linkRes = await axios.post(
            `${baseURL}/createDashboardLink`,
            { stripeId },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            const url = linkRes.data?.url;

            if (!url) {
            console.error("No dashboard URL returned from backend");
            alert("Could not create Stripe dashboard link.");
            return;
            }
            window.location.href = url;
        } catch (error) {
            console.error("Error navigating to Stripe dashboard:", error);
            alert("Something went wrong while opening the Stripe dashboard.");
        }
    };

    const handleStartOnboarding = async () => {
        try {
            const response = await axios.post(
            `${baseURL}/startStripeOnboarding`,
            { country },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data.url) {
            alert("Could not get Stripe onboarding link.");
            return;
            }

            window.location.href = response.data.url; // redirect to Stripe
        } catch (error) {
            console.error("Error starting Stripe onboarding:", error);
            alert("Something went wrong starting Stripe onboarding.");
        }
    };


    useEffect(() => {
        fetchOnboarding();
    }, []);

    useEffect(() => {
        if (onboardingStatus === "return") {
            fetchOnboarding();
        }
    }, [onboardingStatus]);

    return (
        <>
            <RequireAuth />
            <div className="containerProfile">

                {expired && (
                    <div className="errorBox">
                        Session expired. Please log in again.
                    </div>
                )}

                <h1 className="profileHeader">Profile</h1>

                <div className="stripeDiv">
                    <h1 className="stripeDivHeader">Stripe onboarding</h1>

                    {loading && <p>Loading Stripe status...</p>}
                    {error && <div className="errorBox">{error}</div>}

                    {!loading && !error && (
                        <>
                            {onboarded === false && (
                                <div className="onboardDiv">
                                    <h2>You are not onboarded yet.</h2>
                                    <div className="countrySelectorWrapper">
                                        <label className="countryLabel">Select your country</label>

                                        <select
                                            className="countryDropdown"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option value="" disabled>
                                            -- Select a country --
                                            </option>

                                            {Object.entries(STRIPE_SUPPORTED_COUNTRIES).map(([code, name]) => (
                                            <option key={code} value={code}>
                                                {name}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        className="buttonOnboard"
                                        onClick={handleStartOnboarding}
                                        disabled={!country}
                                    >
                                        Connect with Stripe
                                    </button>
                                </div>
                            )}

                            {onboarded === true && (
                                <div className="onboardDiv">
                                    <h2>You are onboarded!</h2>
                                    <button onClick = {navigateStripeDashboard} className="buttonRemove">
                                        Open Stripe Dashboard
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
