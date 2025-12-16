import { useState } from "react";

import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import VotePage from "./pages/VotePage";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [token, setToken] = useState("");

  const goToWelcome = () => setCurrentPage("welcome");
  const goToRegister = () => setCurrentPage("register");
  const goToVote = () => setCurrentPage("vote");

  const API_URL = "http://127.0.0.1:5000";

  return (
    <div className="app">
      {currentPage === "welcome" && (
        <WelcomePage
          token={token}
          setToken={setToken}
          onTokenValidated={(validatedToken) => {
            setToken(validatedToken);
            goToVote();
          }}
          onGoToRegister={goToRegister}
          apiUrl={API_URL}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage onBackToWelcome={goToWelcome} apiUrl={API_URL}/>
      )}

      {currentPage === "vote" && (
        <VotePage
          token={token}
          onBackToWelcome={goToWelcome}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
}

export default App;