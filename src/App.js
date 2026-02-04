import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./components/LoginPage.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "./components/Profile.jsx";
import CosmicBroadcast from "./components/CosmicBroadcast.jsx";
import CosmicMessenger from "./components/CosmicMessenger.jsx";
import CosmicMoodyFry from "./components/CosmicMoodyFry.jsx";
import CosmicMedia from "./components/CosmicMedia.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmicbroadcast"
          element={
            <ProtectedRoute>
              <CosmicBroadcast />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cosmicmessenger"
          element={
            <ProtectedRoute>
              <CosmicMessenger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cosmicmoodyfry"
          element={
            <ProtectedRoute>
              <CosmicMoodyFry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmicmedia"
          element={
            <ProtectedRoute>
              <CosmicMedia />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
