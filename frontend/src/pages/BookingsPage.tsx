import type { FormEvent } from "react";
import type { Booking, Customer, Vehicle } from "../types";

type BookingForm = {
  customer: string;
  vehicle: string;
  pickupDate: string;
  returnDate: string;
  status: string;
  paymentStatus: string;
  notes: string;
};

type BookingsPageProps = {
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  bookingForm: BookingForm;
  editingBookingId: string;
  loadingKey: string;
  dataLoading: boolean;
  onBookingFormChange: (form: BookingForm) => void;
  onBookingSubmit: (event: FormEvent) => Promise<void>;
  onBookingEdit: (booking: Booking) => void;
  onBookingDelete: (bookingId: string) => Promise<void>;
  onBookingFormReset: () => void;
};

export function BookingsPage({
  customers,
  vehicles,
  bookings,
  bookingForm,
  editingBookingId,
  loadingKey,
  dataLoading,
  onBookingFormChange,
  onBookingSubmit,
  onBookingEdit,
  onBookingDelete,
  onBookingFormReset,
}: BookingsPageProps) {
  return (
    <section className="page grid">
      <div className="card">
        <h2>{editingBookingId ? "Edit Booking" : "Create Booking"}</h2>
        <p className="muted">
          Manage customers from the Customers screen, then create bookings here.
        </p>
        <form className="form-grid column" onSubmit={(event) => void onBookingSubmit(event)}>
          <select
            value={bookingForm.customer}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, customer: event.target.value })
            }
            required
          >
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.phone})
              </option>
            ))}
          </select>
          <select
            value={bookingForm.vehicle}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, vehicle: event.target.value })
            }
            required
          >
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.name} {vehicle.model} ({vehicle.registrationNumber})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={bookingForm.pickupDate}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, pickupDate: event.target.value })
            }
            required
          />
          <input
            type="date"
            value={bookingForm.returnDate}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, returnDate: event.target.value })
            }
            required
          />
          <select
            value={bookingForm.status}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, status: event.target.value })
            }
          >
            <option value="booked">Booked</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={bookingForm.paymentStatus}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, paymentStatus: event.target.value })
            }
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <input
            value={bookingForm.notes}
            onChange={(event) =>
              onBookingFormChange({ ...bookingForm, notes: event.target.value })
            }
            placeholder="Notes (optional)"
          />
          <div className="actions">
            <button type="submit" disabled={loadingKey === "booking"}>
              {loadingKey === "booking"
                ? "Saving..."
                : editingBookingId
                  ? "Update booking"
                  : "Create booking"}
            </button>
            {editingBookingId ? (
              <button type="button" className="secondary" onClick={onBookingFormReset}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card card-wide">
        <h2>Booking List</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Pickup</th>
              <th>Return</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr key={item._id}>
                <td>{typeof item.customer === "string" ? item.customer : item.customer.name}</td>
                <td>
                  {typeof item.vehicle === "string"
                    ? item.vehicle
                    : `${item.vehicle.name} ${item.vehicle.model}`}
                </td>
                <td>{new Date(item.pickupDate).toLocaleDateString()}</td>
                <td>{new Date(item.returnDate).toLocaleDateString()}</td>
                <td>{item.status}</td>
                <td>{item.paymentStatus}</td>
                <td>PKR {Number(item.totalAmount || 0).toLocaleString()}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onBookingEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={loadingKey === `booking-delete-${item._id}`}
                      onClick={() => void onBookingDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8}>{dataLoading ? "Loading..." : "No bookings found."}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
