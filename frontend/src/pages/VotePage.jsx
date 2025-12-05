import { useEffect, useState } from "react";

export default function VotePage({ token, onBackToWelcome, apiUrl }) {

    console.log("VotePage received token:", token);
    
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(""); // no default
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        async function loadCandidates() {

            try {

                const response = await fetch(apiUrl + "/candidates", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const list = await response.json();
                setCandidates(list.candidates);

            } catch (err) {
                console.error(err);
                setMessage("Failed to load candidates.");
            }
        }

        loadCandidates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {

            const payload = { token: token, selected_candidate: selectedCandidate };
            console.log("Sending payload:", payload); // Add this line

            const result = await fetch(apiUrl + "/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token, selected_candidate: selectedCandidate }),
            });

            console.log("Response status:", result.status); // Add this line
        const resultData = await result.json();
        console.log("Response data:", resultData); // Add this line

            setMessage(resultData.message || "");

        } catch (err) {
            console.error(err);
            setMessage("Something went wrong while casting your vote.");
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <h1>Official Ballot</h1>
            <p>
                Voting token: <strong>{token}</strong>
            </p>

            <form onSubmit={handleSubmit}>
                <div className="ballot">
                    <div className="ballot-header">
                        <span className="ballot-header-text">Select a candidate</span>
                        <span className="ballot-header-choice">Your choice</span>
                    </div>

                    <div className="ballot-body">
                        {candidates.map((c) => (
                            <label
                                key={c}
                                className={
                                    "ballot-row" +
                                    (selectedCandidate === c ? " ballot-row-selected" : "")
                                }
                            >
                                <div className="ballot-candidate">
                                    <div className="ballot-candidate-name">{c}</div>
                                    <div className="ballot-candidate-party">Party</div>
                                </div>
                                <div className="ballot-choice">
                                    <input
                                        type="radio"
                                        name="candidate"
                                        value={c}
                                        checked={selectedCandidate === c}
                                        onChange={() => setSelectedCandidate(c)}
                                    />
                                </div>
                            </label>
                        ))}

                        {candidates.length === 0 && (
                            <div className="ballot-empty">No candidates available.</div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !selectedCandidate} // stays greyed out until one is picked
                >
                    {isSubmitting ? "Submitting ballot..." : "Submit Vote"}
                </button>
            </form>

            {message && <p className="vote-message">{message}</p>}

            <hr />

            <button type="button" onClick={onBackToWelcome}>
                Back to Home
            </button>
        </div>
    );
}
