import type { Booking, Customer, Vehicle } from "../types";

type DashboardPageProps = {
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  totalRevenue: number;
};

export function DashboardPage({
  customers,
  vehicles,
  bookings,
  totalRevenue,
}: DashboardPageProps) {
  return (
    <section className="page grid">
      <div className="stat-card">
        <span>Total Customers</span>
        <strong>{customers.length}</strong>
      </div>
      <div className="stat-card">
        <span>Total Vehicles</span>
        <strong>{vehicles.length}</strong>
      </div>
      <div className="stat-card">
        <span>Total Bookings</span>
        <strong>{bookings.length}</strong>
      </div>
      <div className="stat-card">
        <span>Total Revenue</span>
        <strong>PKR {totalRevenue.toLocaleString()}</strong>
      </div>
      <div className="card card-wide">
        <h2>Admin Dashboard</h2>
        <p className="muted">
          Dashboard access is restricted to admin. Use this page for monitoring.
        </p>
        <div className="stats-grid">
          <div>
            <h3>Customers</h3>
            <ul>
              {customers.slice(0, 5).map((customer) => (
                <li key={customer._id}>
                  {customer.name} - {customer.phone}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Recent Bookings</h3>
            <ul>
              {bookings.slice(0, 5).map((booking) => (
                <li key={booking._id}>
                  {new Date(booking.pickupDate).toLocaleDateString()} to{" "}
                  {new Date(booking.returnDate).toLocaleDateString()} ({booking.status})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
