import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Shield, Vote, Lock, ArrowRight, UserPlus } from "lucide-react";

export default function WelcomePage({
  token,
  setToken,
  onTokenValidated,
  onGoToRegister,
  apiUrl,
}) {
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
      setError("Error validating the token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-fade-up">
          {/* Logo & Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-primary mb-6 shadow-xl">
              <Vote className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
              SecureVote
            </h1>
            <p className="text-lg text-muted-foreground">
              Blockchain-Powered Voting Platform
            </p>
          </div>

          {/* Token Entry Card */}
          <div className="bg-card rounded-xl shadow-xl border p-8">
            <div className="flex items-center justify-center gap-3 mb-6 pb-6 border-b">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Access Your Ballot
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your unique voting token
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-[16px] font-medium text-center block">
                  Voting Token
                </Label>
                <Input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your token (e.g. ABC123)"
                  className="text-center font-mono text-lg tracking-wider"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !token.trim()}
              >
                {isSubmitting ? (
                  "Verifying..."
                ) : (
                  <>
                    Continue to Ballot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Register Section */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
              <div className="h-px w-12 bg-border" />
              <span className="text-sm">Don't have a token?</span>
              <div className="h-px w-12 bg-border" />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={onGoToRegister}
              className="w-full max-w-xs"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register to Vote
            </Button>
          </div>
        </div>
      </div>

      {/* Features Footer */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Secure & Private</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Your vote is encrypted and anonymous
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Blockchain Verified</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Immutable record of all votes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Vote className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">One Vote Per Token</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ensures fair and accurate results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}