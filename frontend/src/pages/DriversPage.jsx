import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const DRIVERS_URL = "/api/drivers";
const ASSIGNMENTS_URL = "/api/assignments";

const emptyDriver = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNum: "",
  status: "Available",
};

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState(emptyDriver);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  // Loads drivers and assignments from the backend
  async function loadPageData() {
    try {
      const [driversResponse, assignmentsResponse] = await Promise.all([
        fetch(DRIVERS_URL, {
          credentials: "include",
        }),
        fetch(ASSIGNMENTS_URL, {
          credentials: "include",
        }),
      ]);

      if (!driversResponse.ok || !assignmentsResponse.ok) {
        throw new Error("Unable to load driver information.");
      }

      const driversData = await driversResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      setDrivers(driversData);
      setAssignments(assignmentsData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Updates the form when the user types
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Opens an empty form for a new driver
  function openAddForm() {
    setFormData(emptyDriver);
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  // Opens the form with an existing driver's information
  function openEditForm(driver) {
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phoneNum: driver.phoneNum,
      status: driver.status,
    });

    setEditingId(driver.id);
    setMessage("");
    setShowForm(true);
  }

  // Closes and resets the form
  function closeForm() {
    setFormData(emptyDriver);
    setEditingId(null);
    setShowForm(false);
  }

  // Creates a driver or updates an existing driver
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const url = editingId
      ? `${DRIVERS_URL}/${editingId}`
      : DRIVERS_URL;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to save driver.");
      }

      closeForm();
      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Deletes a driver after receiving confirmation
  async function deleteDriver(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${DRIVERS_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          "Unable to delete driver. Make sure the driver has no assignments."
        );
      }

      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Finds the active vehicle assigned to a driver
  function getAssignedVehicle(driverId) {
    const activeAssignment = assignments.find(
      (assignment) =>
        assignment.driver?.id === driverId &&
        assignment.status !== "Completed"
    );

    if (!activeAssignment) {
      return "Not assigned";
    }

    return activeAssignment.vehicle?.regNum || "Assigned vehicle";
  }

  // Filters drivers using the search field
  const filteredDrivers = drivers.filter((driver) => {
    const vehicle = getAssignedVehicle(driver.id);

    const searchableText =
      `${driver.firstName} ${driver.lastName} ${driver.email} ${driver.phoneNum} ${driver.status} ${vehicle}`.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <section className="drivers-page">
      <header className="page-header">
        <div>
          <h1>Drivers</h1>
          <p>Manage NorthStar&apos;s delivery drivers.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Driver
        </button>
      </header>

      {message && <p className="page-error">{message}</p>}

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <span>{filteredDrivers.length} drivers</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Driver</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Vehicle</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.id}</td>

                  <td>
                    <strong>
                      {driver.firstName} {driver.lastName}
                    </strong>
                  </td>

                  <td>{driver.email}</td>
                  <td>{driver.phoneNum}</td>

                  <td>
                    <span className="status-badge">{driver.status}</span>
                  </td>

                  <td>{getAssignedVehicle(driver.id)}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button"
                        onClick={() => openEditForm(driver)}
                        aria-label="Edit driver"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteDriver(driver.id)}
                        aria-label="Delete driver"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No drivers found.
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
                <h2>{editingId ? "Edit Driver" : "Add Driver"}</h2>
                <p>Enter the driver&apos;s contact information.</p>
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
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNum">Phone Number</label>
                <input
                  id="phoneNum"
                  name="phoneNum"
                  type="tel"
                  value={formData.phoneNum}
                  onChange={handleInputChange}
                  required
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
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Unavailable">Unavailable</option>
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
                {editingId ? "Save Changes" : "Create Driver"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default DriversPage;