import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import VehiclesPage from "./pages/VehiclesPage";
import DriversPage from "./pages/DriversPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import MaintenancePage from "./pages/MaintenancePage";
import ReportsPage from "./pages/ReportsPage";

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

          <Route path="vehicles" element={<VehiclesPage />} />

          <Route path="drivers" element={<DriversPage />} />

          <Route path="assignments" element={<AssignmentsPage />} />

          <Route path="maintenance" element={<MaintenancePage />} />

          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;