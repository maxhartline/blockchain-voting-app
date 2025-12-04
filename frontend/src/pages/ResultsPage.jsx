import { useEffect, useState } from "react";
import { fetchResults } from "../api/apiClient";

export default function ResultsPage({ onBackToWelcome }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchResults();
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load results.");
      } finally {
        setIsLoading(false);
      }
    }

    loadResults();
  }, []);

  const maxVotes = results.reduce((max, r) => Math.max(max, r.votes), 0);

  return (
    <div className="page">
      <h1>Voting Results</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <div>
          {results.map((r) => (
            <div key={r.candidate} style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{r.candidate}</span>
                <span>
                  {r.votes} vote{r.votes === 1 ? "" : "s"}
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "#ddd",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: maxVotes ? `${(r.votes / maxVotes) * 100}%` : "0%",
                    background: "#2563eb",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onBackToWelcome}
        style={{ marginTop: "1.5rem" }}
      >
        Back to welcome
      </button>
    </div>
  );
}
