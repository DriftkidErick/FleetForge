import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/vehicles"
            element={<h1>Vehicles</h1>}
          />

          <Route
            path="/drivers"
            element={<h1>Drivers</h1>}
          />

          <Route
            path="/assignments"
            element={<h1>Assignments</h1>}
          />

          <Route
            path="/maintenance"
            element={<h1>Maintenance</h1>}
          />

          <Route
            path="/reports"
            element={<h1>Reports</h1>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;