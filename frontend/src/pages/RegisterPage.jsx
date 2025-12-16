import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, UserCheck, Copy, Check, Sparkles } from "lucide-react";

export default function RegisterPage({ onBackToWelcome, apiUrl }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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
          date_of_birth: dob.trim(),
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

  const copyToken = async () => {
    await navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-fade-up">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBackToWelcome}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Voter Registration
            </h1>
            <p className="text-muted-foreground">
              Complete the form below to receive your unique voting token
            </p>
          </div>

          {/* Success State */}
          {generatedToken ? (
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 animate-scale-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-6 pulse-glow">
                  <Sparkles className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Registration Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your unique voting token has been generated
                </p>

                <div className="bg-muted rounded-xl p-6 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Your Voting Token
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold text-primary tracking-widest">
                      {generatedToken}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToken}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-success" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20 mb-6">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Save this token in a safe place. You will need it to cast your vote.
                  </p>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  onClick={onBackToWelcome}
                  className="w-full"
                >
                  Continue to Vote
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, City, Province"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}