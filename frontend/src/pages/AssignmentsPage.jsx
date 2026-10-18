import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const ASSIGNMENTS_URL = "http://localhost:8080/api/assignments";
const VEHICLES_URL = "http://localhost:8080/api/vehicles";
const DRIVERS_URL = "http://localhost:8080/api/drivers";

const emptyAssignment = {
  vehicleId: "",
  driverId: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState(emptyAssignment);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  // Loads all information needed by the assignments page
  async function loadPageData() {
    try {
      const [assignmentsResponse, vehiclesResponse, driversResponse] =
        await Promise.all([
          fetch(ASSIGNMENTS_URL, {
            credentials: "include",
          }),
          fetch(VEHICLES_URL, {
            credentials: "include",
          }),
          fetch(DRIVERS_URL, {
            credentials: "include",
          }),
        ]);

      if (
        !assignmentsResponse.ok ||
        !vehiclesResponse.ok ||
        !driversResponse.ok
      ) {
        throw new Error("Unable to load assignment information.");
      }

      setAssignments(await assignmentsResponse.json());
      setVehicles(await vehiclesResponse.json());
      setDrivers(await driversResponse.json());
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Updates the form whenever a value changes
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Opens an empty form for a new assignment
  function openAddForm() {
    setFormData(emptyAssignment);
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  // Opens the form with an existing assignment
  function openEditForm(assignment) {
    setFormData({
      vehicleId: assignment.vehicle.id.toString(),
      driverId: assignment.driver.id.toString(),
      startDate: assignment.startDate,
      endDate: assignment.endDate || "",
      status: assignment.status,
    });

    setEditingId(assignment.id);
    setMessage("");
    setShowForm(true);
  }

  // Closes and resets the form
  function closeForm() {
    setFormData(emptyAssignment);
    setEditingId(null);
    setShowForm(false);
  }

  // Creates or updates an assignment
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const assignmentData = {
      vehicle: {
        id: Number(formData.vehicleId),
      },
      driver: {
        id: Number(formData.driverId),
      },
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
    };

    const url = editingId
      ? `${ASSIGNMENTS_URL}/${editingId}`
      : ASSIGNMENTS_URL;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        throw new Error("Unable to save assignment.");
      }

      closeForm();
      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Deletes an assignment after confirmation
  async function deleteAssignment(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${ASSIGNMENTS_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to delete assignment.");
      }

      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Filters assignments using the search field
  const filteredAssignments = assignments.filter((assignment) => {
    const driverName =
      `${assignment.driver.firstName} ${assignment.driver.lastName}`;

    const vehicleName =
      `${assignment.vehicle.regNum} ${assignment.vehicle.year} ${assignment.vehicle.make} ${assignment.vehicle.model}`;

    const searchableText =
      `${driverName} ${vehicleName} ${assignment.status} ${assignment.startDate}`.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <section className="assignments-page">
      <header className="page-header">
        <div>
          <h1>Assignments</h1>
          <p>Assign drivers to NorthStar fleet vehicles.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          New Assignment
        </button>
      </header>

      {message && <p className="page-error">{message}</p>}

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <span>{filteredAssignments.length} assignments</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.id}</td>

                  <td>
                    <strong>
                      {assignment.driver.firstName}{" "}
                      {assignment.driver.lastName}
                    </strong>
                  </td>

                  <td>
                    <strong>{assignment.vehicle.regNum}</strong>
                    <br />
                    {assignment.vehicle.year} {assignment.vehicle.make}{" "}
                    {assignment.vehicle.model}
                  </td>

                  <td>{assignment.startDate}</td>
                  <td>{assignment.endDate || "—"}</td>

                  <td>
                    <span className="status-badge">
                      {assignment.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button"
                        onClick={() => openEditForm(assignment)}
                        aria-label="Edit assignment"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteAssignment(assignment.id)}
                        aria-label="Delete assignment"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div>
                <h2>
                  {editingId ? "Edit Assignment" : "New Assignment"}
                </h2>

                <p>Select a driver and vehicle.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vehicleId">Vehicle</label>

                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.regNum} — {vehicle.year} {vehicle.make}{" "}
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="driverId">Driver</label>

                <select
                  id="driverId"
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a driver</option>

                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingId ? "Save Changes" : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AssignmentsPage;