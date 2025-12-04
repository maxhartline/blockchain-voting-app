import { useState } from "react";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [token, setToken] = useState("");

  const goToWelcome = () => setCurrentPage("welcome");
  const goToRegister = () => setCurrentPage("register");
  const goToVote = () => setCurrentPage("vote");
  const goToResults = () => setCurrentPage("results");

  return (
    <div className="app">
      {currentPage === "welcome" && (
        <WelcomePage
          onTokenValidated={(validatedToken) => {
            setToken(validatedToken);
            goToVote();
          }}
          onGoToRegister={goToRegister}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage onBackToWelcome={goToWelcome} />
      )}

      {currentPage === "vote" && (
        <VotePage
          token={token}
          onGoToResults={goToResults}
          onBackToWelcome={goToWelcome}
        />
      )}

      {currentPage === "results" && (
        <ResultsPage onBackToWelcome={goToWelcome} />
      )}
    </div>
  );
}

export default App;
