import { useState } from "react";

export default function RegisterPage({ onBackToWelcome, apiUrl }) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGeneratedToken("");
    setIsSubmitting(true);

    try {

      const result = await fetch(apiUrl + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim() + " " + lastName.trim(),
          dob: dob.trim(),
          address: address.trim(),
        }),
      });

      const data = await result.json();

      if (result.ok) {
        setGeneratedToken(data.token);
      } else {
        setError(data.message || "An unknown error occurred.");
      }

    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="page">
          <h1>Register for a Voting Token</h1>

          <form onSubmit={handleSubmit}>
              <label>
                  First name
                  <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                  />
              </label>

              <label>
                  Last name
                  <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                  />
              </label>

              <label>
                  Date of birth
                  <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                  />
              </label>

              <label>
                  Address
                  <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                  />
              </label>

              <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Generating token..." : "Register"}
              </button>
              <hr />
          </form>

          {error && <p className="error">{error}</p>}

          {generatedToken && (
              <div className="token-box" style={{ textAlign: "center" }}>
                  <h2>Your Unique token:</h2>
                  <p>{generatedToken}</p>
                  <p>Save this token somewhere safe. You'll need it to vote.</p>
              </div>
          )}

          <button type="button" onClick={onBackToWelcome}>
              Back to welcome
          </button>
      </div>
  );
}
