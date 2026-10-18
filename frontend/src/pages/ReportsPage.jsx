import { useEffect, useState } from "react";
import { ArrowUpDown, Download } from "lucide-react";

const VEHICLE_REPORT_URL =
  "/api/reports/vehicles";

const DRIVER_REPORT_URL =
  "/api/reports/drivers";

const MAINTENANCE_CSV_URL =
  "/api/reports/maintenance/csv";

function ReportsPage() {
  const [vehicleReport, setVehicleReport] = useState(null);
  const [driverReport, setDriverReport] = useState(null);
  const [message, setMessage] = useState("");

  const [vehicleSort, setVehicleSort] = useState({
    field: "id",
    direction: "asc",
  });

  const [driverSort, setDriverSort] = useState({
    field: "id",
    direction: "asc",
  });

  useEffect(() => {
  // Loads the vehicle and driver reports
  async function loadReports() {
    try {
      const [vehicleResponse, driverResponse] = await Promise.all([
        fetch(VEHICLE_REPORT_URL, {
          credentials: "include",
        }),
        fetch(DRIVER_REPORT_URL, {
          credentials: "include",
        }),
      ]);

      if (!vehicleResponse.ok || !driverResponse.ok) {
        throw new Error("Unable to load report information.");
      }

      setVehicleReport(await vehicleResponse.json());
      setDriverReport(await driverResponse.json());
    } catch (error) {
      setMessage(error.message);
    }
  }

  loadReports();
}, []);

  // Sorts report rows without changing the original array
  function sortRows(rows, sort) {
    return [...rows].sort((firstRow, secondRow) => {
      const firstValue = firstRow[sort.field] ?? "";
      const secondValue = secondRow[sort.field] ?? "";

      const comparison = String(firstValue).localeCompare(
        String(secondValue),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        }
      );

      return sort.direction === "asc"
        ? comparison
        : -comparison;
    });
  }

  // Changes the vehicle report sorting
  function changeVehicleSort(field) {
    setVehicleSort((currentSort) => ({
      field,
      direction:
        currentSort.field === field &&
        currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  // Changes the driver report sorting
  function changeDriverSort(field) {
    setDriverSort((currentSort) => ({
      field,
      direction:
        currentSort.field === field &&
        currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  const vehicleRows = vehicleReport
    ? sortRows(vehicleReport.rows, vehicleSort)
    : [];

  const driverRows = driverReport
    ? sortRows(driverReport.rows, driverSort)
    : [];

  // Creates and downloads a CSV file
  function downloadCsvFile(filename, headers, rows) {
    const csvRows = [headers, ...rows];

    const csvText = csvRows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");
            return `"${text.replaceAll('"', '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const csvFile = new Blob([csvText], {
      type: "text/csv;charset=utf-8",
    });

    const downloadUrl = window.URL.createObjectURL(csvFile);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  }

  // Downloads the vehicle report
  function downloadVehicleCsv() {
    const headers = [
      "ID",
      "Registration Number",
      "VIN",
      "Year",
      "Make",
      "Model",
      "Mileage",
      "Status",
    ];

    const rows = vehicleRows.map((vehicle) => [
      vehicle.id,
      vehicle.regNum,
      vehicle.vin,
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.mileage,
      vehicle.status,
    ]);

    downloadCsvFile(
      "fleetforge-vehicle-report.csv",
      headers,
      rows
    );
  }

  // Downloads the driver report
  function downloadDriverCsv() {
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Status",
    ];

    const rows = driverRows.map((driver) => [
      driver.id,
      driver.firstName,
      driver.lastName,
      driver.email,
      driver.phoneNum,
      driver.status,
    ]);

    downloadCsvFile(
      "fleetforge-driver-report.csv",
      headers,
      rows
    );
  }

  // Downloads the maintenance report from Spring Boot
  async function downloadMaintenanceCsv() {
    setMessage("");

    try {
      const response = await fetch(MAINTENANCE_CSV_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to download maintenance report.");
      }

      const csvFile = await response.blob();
      const downloadUrl = window.URL.createObjectURL(csvFile);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "maintenance-report.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="reports-page">
      <header className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Review and export NorthStar fleet information.</p>
        </div>
      </header>

      {message && <p className="page-error">{message}</p>}

      {/* Vehicle report */}
      <article className="report-card">
        <div className="report-heading">
          <div>
            <h2>
              {vehicleReport?.title ||
                "FleetForge Vehicle Report"}
            </h2>

            <p>
              {vehicleReport
                ? `Generated ${new Date(
                    vehicleReport.generatedAt
                  ).toLocaleString()}`
                : "Loading report..."}
            </p>
          </div>

          <div className="report-heading-actions">
            <span>{vehicleRows.length} vehicles</span>

            <button
              className="secondary-button"
              onClick={downloadVehicleCsv}
              disabled={!vehicleReport}
            >
              <Download size={17} />
              Export Vehicles
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeading
                  label="ID"
                  field="id"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Registration"
                  field="regNum"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="VIN"
                  field="vin"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Year"
                  field="year"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Make"
                  field="make"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Model"
                  field="model"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Mileage"
                  field="mileage"
                  onSort={changeVehicleSort}
                />

                <SortableHeading
                  label="Status"
                  field="status"
                  onSort={changeVehicleSort}
                />
              </tr>
            </thead>

            <tbody>
              {vehicleRows.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>

                  <td>
                    <strong>{vehicle.regNum}</strong>
                  </td>

                  <td>{vehicle.vin}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>

                  <td>
                    {vehicle.mileage != null
                      ? `${vehicle.mileage.toLocaleString()} mi`
                      : "—"}
                  </td>

                  <td>
                    <span className="status-badge">
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}

              {vehicleRows.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-table">
                    No vehicle information available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      {/* Driver report */}
      <article className="report-card">
        <div className="report-heading">
          <div>
            <h2>
              {driverReport?.title ||
                "FleetForge Driver Report"}
            </h2>

            <p>
              {driverReport
                ? `Generated ${new Date(
                    driverReport.generatedAt
                  ).toLocaleString()}`
                : "Loading report..."}
            </p>
          </div>

          <div className="report-heading-actions">
            <span>{driverRows.length} drivers</span>

            <button
              className="secondary-button"
              onClick={downloadDriverCsv}
              disabled={!driverReport}
            >
              <Download size={17} />
              Export Drivers
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeading
                  label="ID"
                  field="id"
                  onSort={changeDriverSort}
                />

                <SortableHeading
                  label="First Name"
                  field="firstName"
                  onSort={changeDriverSort}
                />

                <SortableHeading
                  label="Last Name"
                  field="lastName"
                  onSort={changeDriverSort}
                />

                <SortableHeading
                  label="Email"
                  field="email"
                  onSort={changeDriverSort}
                />

                <SortableHeading
                  label="Phone"
                  field="phoneNum"
                  onSort={changeDriverSort}
                />

                <SortableHeading
                  label="Status"
                  field="status"
                  onSort={changeDriverSort}
                />
              </tr>
            </thead>

            <tbody>
              {driverRows.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.id}</td>

                  <td>
                    <strong>{driver.firstName}</strong>
                  </td>

                  <td>
                    <strong>{driver.lastName}</strong>
                  </td>

                  <td>{driver.email}</td>
                  <td>{driver.phoneNum}</td>

                  <td>
                    <span className="status-badge">
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}

              {driverRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No driver information available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      {/* Maintenance export */}
      <article className="maintenance-export-card">
        <div>
          <h2>FleetForge Maintenance Report</h2>

          <p>
            Export scheduled and completed maintenance records,
            vehicle information, costs, statuses, and notes.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={downloadMaintenanceCsv}
        >
          <Download size={17} />
          Export Maintenance
        </button>
      </article>
    </section>
  );
}

// Reusable sortable column heading
function SortableHeading({ label, field, onSort }) {
  return (
    <th>
      <button
        className="sort-button"
        onClick={() => onSort(field)}
      >
        {label}
        <ArrowUpDown size={14} />
      </button>
    </th>
  );
}

export default ReportsPage;