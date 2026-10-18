import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads dashboard information when the page opens
  useEffect(() => {
    async function loadDashboard() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/vehicles", {
            credentials: "include",
          }),

          fetch("http://localhost:8080/api/drivers", {
            credentials: "include",
          }),

          fetch("http://localhost:8080/api/assignments", {
            credentials: "include",
          }),

          fetch("http://localhost:8080/api/maintenance", {
            credentials: "include",
          }),
        ]);

        // Sends the user back to login if the session expired
        if (responses.some((response) => response.status === 401)) {
          navigate("/");
          return;
        }

        if (responses.some((response) => !response.ok)) {
          throw new Error("Dashboard information could not be loaded.");
        }

        const [
          vehicleData,
          driverData,
          assignmentData,
          maintenanceData,
        ] = await Promise.all(
          responses.map((response) => response.json())
        );

        setVehicles(vehicleData);
        setDrivers(driverData);
        setAssignments(assignmentData);
        setMaintenance(maintenanceData);
      } catch {
        setError("Dashboard information could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  const activeDrivers = drivers.filter(
    (driver) =>
      driver.status?.toLowerCase() !== "inactive"
  ).length;

  const activeAssignments = assignments.filter(
    (assignment) =>
      assignment.status?.toLowerCase() === "active" ||
      assignment.status?.toLowerCase() === "assigned"
  ).length;

  const serviceDue = maintenance.filter(
    (record) =>
      record.status?.toLowerCase() !== "completed"
  ).length;

  const availableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "available"
  ).length;

  const assignedVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "assigned"
  ).length;

  const unavailableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() !== "available" &&
      vehicle.status?.toLowerCase() !== "assigned"
  ).length;

  const upcomingMaintenance = maintenance
    .filter(
      (record) =>
        record.status?.toLowerCase() !== "completed"
    )
    .slice(0, 3);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <main className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>FleetForge Dashboard</h1>
          <p>Monitor your fleet and upcoming service.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/drivers")}
        >
          Add Driver
        </button>
      </header>

      {error && (
        <p className="page-error">{error}</p>
      )}

      <section className="summary-grid">
        <article className="summary-card">
          <Truck size={22} />

          <div>
            <span>Total Vehicles</span>
            <strong>{vehicles.length}</strong>
          </div>
        </article>

        <article className="summary-card">
          <Users size={22} />

          <div>
            <span>Active Drivers</span>
            <strong>{activeDrivers}</strong>
          </div>
        </article>

        <article className="summary-card">
          <ClipboardList size={22} />

          <div>
            <span>Active Assignments</span>
            <strong>{activeAssignments}</strong>
          </div>
        </article>

        <article className="summary-card">
          <Wrench size={22} />

          <div>
            <span>Service Due</span>
            <strong>{serviceDue}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-sections">
        <article className="dashboard-panel">
          <h2>Vehicle Status</h2>

          <div className="status-row">
            <span>Available</span>
            <strong>{availableVehicles}</strong>
          </div>

          <div className="status-row">
            <span>Assigned</span>
            <strong>{assignedVehicles}</strong>
          </div>

          <div className="status-row">
            <span>Unavailable</span>
            <strong>{unavailableVehicles}</strong>
          </div>
        </article>

        <article className="dashboard-panel">
          <h2>Maintenance Coming Up</h2>

          {upcomingMaintenance.length === 0 ? (
            <p className="empty-message">
              No upcoming maintenance.
            </p>
          ) : (
            upcomingMaintenance.map((record) => (
              <div
                className="maintenance-preview"
                key={record.id}
              >
                <div>
                  <strong>
                    {record.vehicle?.regNum}
                  </strong>

                  <span>
                    {record.maintenanceType?.name}
                  </span>
                </div>

                <span>
                  {record.dueDate || "Mileage based"}
                </span>
              </div>
            ))
          )}
        </article>
      </section>
    </main>
  );
}

export default DashboardPage;