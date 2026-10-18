import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const MAINTENANCE_URL = "/api/maintenance";
const VEHICLES_URL = "/api/vehicles";
const TYPES_URL = "/api/maintenance-types";

const emptyMaintenance = {
  vehicleId: "",
  maintenanceTypeId: "",
  dueDate: "",
  dueMileage: "",
  completionDate: "",
  completionMileage: "",
  cost: "",
  status: "Scheduled",
  notes: "",
};

function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [formData, setFormData] = useState(emptyMaintenance);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  // Loads maintenance, vehicles, and maintenance types
  async function loadPageData() {
    try {
      const [maintenanceResponse, vehiclesResponse, typesResponse] =
        await Promise.all([
          fetch(MAINTENANCE_URL, {
            credentials: "include",
          }),
          fetch(VEHICLES_URL, {
            credentials: "include",
          }),
          fetch(TYPES_URL, {
            credentials: "include",
          }),
        ]);

      if (
        !maintenanceResponse.ok ||
        !vehiclesResponse.ok ||
        !typesResponse.ok
      ) {
        throw new Error("Unable to load maintenance information.");
      }

      setMaintenanceRecords(await maintenanceResponse.json());
      setVehicles(await vehiclesResponse.json());
      setMaintenanceTypes(await typesResponse.json());
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Updates the form when the user enters information
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Opens an empty maintenance form
  function openAddForm() {
    setFormData(emptyMaintenance);
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  // Opens a maintenance record for editing
  function openEditForm(record) {
    setFormData({
      vehicleId: record.vehicle.id.toString(),
      maintenanceTypeId: record.maintenanceType.id.toString(),
      dueDate: record.dueDate || "",
      dueMileage: record.dueMileage ?? "",
      completionDate: record.completionDate || "",
      completionMileage: record.completionMileage ?? "",
      cost: record.cost ?? "",
      status: record.status,
      notes: record.notes || "",
    });

    setEditingId(record.id);
    setMessage("");
    setShowForm(true);
  }

  // Closes and resets the form
  function closeForm() {
    setFormData(emptyMaintenance);
    setEditingId(null);
    setShowForm(false);
  }

  // Creates or updates a maintenance record
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const maintenanceData = {
      vehicle: {
        id: Number(formData.vehicleId),
      },
      maintenanceType: {
        id: Number(formData.maintenanceTypeId),
      },
      dueDate: formData.dueDate || null,
      dueMileage:
        formData.dueMileage === ""
          ? null
          : Number(formData.dueMileage),
      completionDate: formData.completionDate || null,
      completionMileage:
        formData.completionMileage === ""
          ? null
          : Number(formData.completionMileage),
      cost: formData.cost === "" ? null : Number(formData.cost),
      status: formData.status,
      notes: formData.notes,
    };

    const url = editingId
      ? `${MAINTENANCE_URL}/${editingId}`
      : MAINTENANCE_URL;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(maintenanceData),
      });

      if (!response.ok) {
        throw new Error("Unable to save maintenance record.");
      }

      closeForm();
      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Deletes a maintenance record
  async function deleteMaintenance(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${MAINTENANCE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to delete maintenance record.");
      }

      await loadPageData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Filters maintenance records using the search field
  const filteredRecords = maintenanceRecords.filter((record) => {
    const vehicleName =
      `${record.vehicle.regNum} ${record.vehicle.make} ${record.vehicle.model}`;

    const searchableText =
      `${vehicleName} ${record.maintenanceType.name} ${record.status} ${record.notes || ""}`.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <section className="maintenance-page">
      <header className="page-header">
        <div>
          <h1>Maintenance</h1>
          <p>Schedule and record maintenance for fleet vehicles.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add Maintenance
        </button>
      </header>

      {message && <p className="page-error">{message}</p>}

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search maintenance..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <span>{filteredRecords.length} records</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Maintenance Type</th>
                <th>Due</th>
                <th>Completed</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>

                  <td>
                    <strong>{record.vehicle.regNum}</strong>
                    <br />
                    {record.vehicle.make} {record.vehicle.model}
                  </td>

                  <td>{record.maintenanceType.name}</td>

                  <td>
                    {record.dueDate || "—"}
                    <br />
                    {record.dueMileage != null
                      ? `${record.dueMileage.toLocaleString()} mi`
                      : "—"}
                  </td>

                  <td>
                    {record.completionDate || "—"}
                    <br />
                    {record.completionMileage != null
                      ? `${record.completionMileage.toLocaleString()} mi`
                      : "—"}
                  </td>

                  <td>
                    {record.cost != null
                      ? `$${Number(record.cost).toFixed(2)}`
                      : "—"}
                  </td>

                  <td>
                    <span className="status-badge">
                        {record.status}
                    </span>
                    </td>

                    <td className="notes-cell">
                    {record.notes || "—"}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button"
                        onClick={() => openEditForm(record)}
                        aria-label="Edit maintenance record"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteMaintenance(record.id)}
                        aria-label="Delete maintenance record"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-table">
                    No maintenance records found.
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
                  {editingId
                    ? "Edit Maintenance"
                    : "Add Maintenance"}
                </h2>

                <p>Enter the vehicle&apos;s maintenance details.</p>
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
              <div className="form-group full-width">
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

              <div className="form-group full-width">
                <label>Maintenance Type</label>

                <div className="maintenance-type-buttons">
                  {maintenanceTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={
                        Number(formData.maintenanceTypeId) === type.id
                          ? "maintenance-type-button selected"
                          : "maintenance-type-button"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          maintenanceTypeId: type.id.toString(),
                        })
                      }
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                {!formData.maintenanceTypeId && (
                  <span className="field-note">
                    Select a maintenance type.
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueMileage">Due Mileage</label>
                <input
                  id="dueMileage"
                  name="dueMileage"
                  type="number"
                  min="0"
                  value={formData.dueMileage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="completionDate">
                  Completion Date
                </label>
                <input
                  id="completionDate"
                  name="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="completionMileage">
                  Completion Mileage
                </label>
                <input
                  id="completionMileage"
                  name="completionMileage"
                  type="number"
                  min="0"
                  value={formData.completionMileage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cost">Cost</label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  maxLength="1000"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
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

              <button
                type="submit"
                className="primary-button"
                disabled={!formData.maintenanceTypeId}
              >
                {editingId ? "Save Changes" : "Create Maintenance"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default MaintenancePage;