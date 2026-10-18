import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const API_URL = "http://localhost:8080/api/vehicles";

const emptyVehicle = {
  vin: "",
  regNum: "",
  year: "",
  make: "",
  model: "",
  mileage: "",
  status: "Available",
};

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(emptyVehicle);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  // Loads every vehicle from the backend
  async function loadVehicles() {
    try {
      const response = await fetch(API_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load vehicles.");
      }

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Updates the form whenever the user types
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Opens an empty form for a new vehicle
  function openAddForm() {
    setFormData(emptyVehicle);
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  // Opens the form with an existing vehicle's information
  function openEditForm(vehicle) {
    setFormData({
      vin: vehicle.vin,
      regNum: vehicle.regNum,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      mileage: vehicle.mileage,
      status: vehicle.status,
    });

    setEditingId(vehicle.id);
    setMessage("");
    setShowForm(true);
  }

  // Closes and clears the vehicle form
  function closeForm() {
    setFormData(emptyVehicle);
    setEditingId(null);
    setShowForm(false);
  }

  // Creates a new vehicle or updates an existing vehicle
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const vehicleData = {
      ...formData,
      year: Number(formData.year),
      mileage: Number(formData.mileage),
    };

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error("Unable to save vehicle.");
      }

      closeForm();
      await loadVehicles();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Deletes a vehicle after the user confirms
  async function deleteVehicle(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to delete vehicle.");
      }

      await loadVehicles();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Filters the displayed vehicles as the user types
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchableText =
      `${vehicle.regNum} ${vehicle.vin} ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.status}`.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <section className="vehicles-page">
      <header className="page-header">
        <div>
          <h1>Vehicles</h1>
          <p>Manage NorthStar&apos;s delivery fleet.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Vehicle
        </button>
      </header>

      {message && <p className="page-error">{message}</p>}

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <span>{filteredVehicles.length} vehicles</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Registration</th>
                <th>Vehicle</th>
                <th>VIN</th>
                <th>Mileage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>
                    <strong>{vehicle.regNum}</strong>
                  </td>
                  <td>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </td>
                  <td>{vehicle.vin}</td>
                  <td>{vehicle.mileage.toLocaleString()} mi</td>
                  <td>
                    <span className="status-badge">{vehicle.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button"
                        onClick={() => openEditForm(vehicle)}
                        aria-label="Edit vehicle"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteVehicle(vehicle.id)}
                        aria-label="Delete vehicle"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No vehicles found.
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
                <h2>{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
                <p>Enter the vehicle&apos;s fleet information.</p>
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
                <label htmlFor="regNum">Registration Number</label>
                <input
                  id="regNum"
                  name="regNum"
                  value={formData.regNum}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vin">VIN</label>
                <input
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Mileage</label>
                <input
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage}
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
                  <option value="In Service">In Service</option>
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
                {editingId ? "Save Changes" : "Create Vehicle"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default VehiclesPage;