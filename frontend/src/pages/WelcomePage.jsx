import { useState } from "react";

export default function WelcomePage({ token, setToken, onTokenValidated, onGoToRegister, apiUrl }) {
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {

            const result = await fetch(apiUrl + "/validate-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token.trim() }),
            });

            const data = await result.json();

            if (result.ok) {
                onTokenValidated(token.trim());
            } else {
                setError(data.message || "Invalid token. Please try again.");
            }

        } catch (err) {
            console.error(err);
            setError("Something went wrong validating the token.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <h1>Blockchain Voting App</h1>
            <p>Please enter your token to access the ballot</p>

            <form onSubmit={handleSubmit} className="welcome-form">
            <label>
                Voting token
                <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. ABC123"
                />
            </label>
            <div className="welcome-submit-row">
                <button type="submit" disabled={isSubmitting || !token.trim()}>
                {isSubmitting ? "Checking..." : "Continue"}
                </button>
            </div>
            </form>

            {error && <p className="error">{error}</p>}

            <hr />

            <div className="welcome-footer">
                <p>Don't have a token?</p>
                <button type="button" onClick={onGoToRegister}>
                    Register here
                </button>
            </div>
        </div>
    );
}
