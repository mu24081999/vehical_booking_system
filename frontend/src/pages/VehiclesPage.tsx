import type { FormEvent } from "react";
import type { Vehicle } from "../types";

type VehiclesPageProps = {
  vehicles: Vehicle[];
  vehicleForm: {
    name: string;
    model: string;
    registrationNumber: string;
    rentPerDay: string;
    status: string;
  };
  editingVehicleId: string;
  loadingKey: string;
  dataLoading: boolean;
  onVehicleFormChange: (form: {
    name: string;
    model: string;
    registrationNumber: string;
    rentPerDay: string;
    status: string;
  }) => void;
  onVehicleSubmit: (event: FormEvent) => Promise<void>;
  onVehicleEdit: (vehicle: Vehicle) => void;
  onVehicleDelete: (vehicleId: string) => Promise<void>;
  onVehicleFormReset: () => void;
};

export function VehiclesPage({
  vehicles,
  vehicleForm,
  editingVehicleId,
  loadingKey,
  dataLoading,
  onVehicleFormChange,
  onVehicleSubmit,
  onVehicleEdit,
  onVehicleDelete,
  onVehicleFormReset,
}: VehiclesPageProps) {
  return (
    <section className="page grid">
      <div className="card">
        <h2>{editingVehicleId ? "Edit Vehicle" : "Create Vehicle"}</h2>
        <form className="form-grid column" onSubmit={(event) => void onVehicleSubmit(event)}>
          <input
            value={vehicleForm.name}
            onChange={(event) =>
              onVehicleFormChange({ ...vehicleForm, name: event.target.value })
            }
            placeholder="Vehicle name"
            required
          />
          <input
            value={vehicleForm.model}
            onChange={(event) =>
              onVehicleFormChange({ ...vehicleForm, model: event.target.value })
            }
            placeholder="Model"
            required
          />
          <input
            value={vehicleForm.registrationNumber}
            onChange={(event) =>
              onVehicleFormChange({
                ...vehicleForm,
                registrationNumber: event.target.value,
              })
            }
            placeholder="Registration number"
            required
          />
          <input
            type="number"
            min={1}
            value={vehicleForm.rentPerDay}
            onChange={(event) =>
              onVehicleFormChange({ ...vehicleForm, rentPerDay: event.target.value })
            }
            placeholder="Rent per day"
            required
          />
          <select
            value={vehicleForm.status}
            onChange={(event) =>
              onVehicleFormChange({ ...vehicleForm, status: event.target.value })
            }
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <div className="actions">
            <button type="submit" disabled={loadingKey === "vehicle"}>
              {loadingKey === "vehicle"
                ? "Saving..."
                : editingVehicleId
                  ? "Update vehicle"
                  : "Create vehicle"}
            </button>
            {editingVehicleId ? (
              <button type="button" className="secondary" onClick={onVehicleFormReset}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Vehicles List</h2>
        <p className="muted">Browse available and active vehicles.</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Model</th>
              <th>Registration</th>
              <th>Status</th>
              <th>Rent / Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.model}</td>
                <td>{item.registrationNumber}</td>
                <td>{item.status}</td>
                <td>PKR {Number(item.rentPerDay || 0).toLocaleString()}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onVehicleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={loadingKey === `vehicle-delete-${item._id}`}
                      onClick={() => void onVehicleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={6}>{dataLoading ? "Loading..." : "No vehicles found."}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
