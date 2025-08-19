import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <GameProvider>
          <Routes />
        </GameProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
