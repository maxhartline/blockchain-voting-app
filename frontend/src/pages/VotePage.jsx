import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Vote, CheckCircle2, User, Building2 } from "lucide-react";

export default function VotePage({ token, onBackToWelcome, apiUrl }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const response = await fetch(apiUrl + "/candidates", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const list = await response.json();
        setCandidates(list.candidates || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load candidates.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCandidates();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await fetch(apiUrl + "/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, selected_candidate: selectedCandidate }),
      });

      const resultData = await result.json();
      setMessage(resultData.message || "");
      
      if (result.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while casting your vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-8 pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Vote Submitted!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {message || "Your vote has been securely recorded on the blockchain."}
          </p>
          <Button variant="outline" size="lg" onClick={onBackToWelcome}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBackToWelcome} className="-ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Ballot
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Token:</span>
            <span className="font-mono font-medium text-primary">{token}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-fade-up">
          {/* Ballot Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <Vote className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Official Ballot
            </h1>
            <p className="text-muted-foreground">
              Select your candidate and submit your vote
            </p>
          </div>

          {/* Ballot Card */}
          <div className="bg-card rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
            {/* Ballot Banner */}
            <div className="bg-primary px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary-foreground">
                  Select One Candidate
                </h2>
                <span className="text-sm text-primary-foreground/80">
                  {candidates.length} candidates
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Candidates List */}
              <div className="divide-y divide-border">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-pulse text-muted-foreground">
                      Loading candidates...
                    </div>
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No candidates available.</p>
                  </div>
                ) : (
                  candidates.map((candidate, index) => (
                    <label
                      key={candidate}
                      className={`flex items-center gap-4 p-5 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                        selectedCandidate === candidate ? "bg-accent/10 hover:bg-accent/15" : ""
                      }`.trim()}
                    >
                      {/* Candidate Info */}
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-lg">
                          {candidate}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>Candidate #{index + 1}</span>
                        </div>
                      </div>
                      {/* Selection Circle */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedCandidate === candidate
                            ? "border-accent bg-accent"
                            : "border-muted-foreground/30"
                        }`.trim()}
                      >
                        {selectedCandidate === candidate && (
                          <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate}
                        checked={selectedCandidate === candidate}
                        onChange={() => setSelectedCandidate(candidate)}
                        className="sr-only"
                      />
                    </label>
                  ))
                )}
              </div>

              {/* Submit Section */}
              <div className="p-6 bg-muted/30 border-t border-border">
                <Button
                  type="submit"
                  variant="accent"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting || !selectedCandidate}
                >
                  {isSubmitting ? (
                    "Submitting Vote..."
                  ) : (
                    <>
                      <Vote className="w-5 h-5 mr-2" />
                      Cast Your Vote
                    </>
                  )}
                </Button>

                {!selectedCandidate && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    Please select a candidate to continue
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Error Message */}
          {message && !isSuccess && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium text-center">{message}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Your vote is encrypted and will be recorded on the blockchain.</p>
            <p>This process is secure and your choice remains anonymous.</p>
          </div>
        </div>
      </main>
    </div>
  );
}