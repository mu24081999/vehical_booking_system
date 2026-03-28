import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  cnic?: string;
  address?: string;
  isActive: boolean;
};

type Vehicle = {
  _id: string;
  name: string;
  model: string;
  registrationNumber: string;
  rentPerDay: number;
  status: string;
  isActive: boolean;
};

type Booking = {
  _id: string;
  customer: Customer | string;
  vehicle: Vehicle | string;
  pickupDate: string;
  returnDate: string;
  totalDays?: number;
  rentPerDay?: number;
  totalAmount?: number;
  status: string;
  paymentStatus: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const API_BASE_URL = "http://localhost:9000/api/v1";

function App() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Password123");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const totalRevenue = useMemo(() => {
    return bookings.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
    );
  }, [bookings]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json: ApiResponse<{ accessToken: string }> = await res.json();
      if (!res.ok || !json?.data?.accessToken) {
        throw new Error(json?.message || "Login failed");
      }
      setToken(json.data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!token) {
      setError("Please login first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [customersRes, vehiclesRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customers`, { headers }),
        fetch(`${API_BASE_URL}/vehicles`, { headers }),
        fetch(`${API_BASE_URL}/bookings`, { headers }),
      ]);

      const customersJson: ApiResponse<{ customers: Customer[] }> =
        await customersRes.json();
      const vehiclesJson: ApiResponse<{ vehicles: Vehicle[] }> =
        await vehiclesRes.json();
      const bookingsJson: ApiResponse<{ bookings: Booking[] }> =
        await bookingsRes.json();

      if (!customersRes.ok) throw new Error(customersJson.message);
      if (!vehiclesRes.ok) throw new Error(vehiclesJson.message);
      if (!bookingsRes.ok) throw new Error(bookingsJson.message);

      setCustomers(customersJson.data?.customers || []);
      setVehicles(vehiclesJson.data?.vehicles || []);
      setBookings(bookingsJson.data?.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customer: Booking["customer"]) => {
    if (!customer) return "-";
    if (typeof customer === "string") return customer;
    return customer.name;
  };

  const getVehicleName = (vehicle: Booking["vehicle"]) => {
    if (!vehicle) return "-";
    if (typeof vehicle === "string") return vehicle;
    return `${vehicle.name} ${vehicle.model}`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Vehicle Booking Dashboard</h1>
        <p>Customers, vehicles, bookings and revenue in one place</p>
      </header>

      <section className="card">
        <h2>Login</h2>
        <form className="login-form" onSubmit={login}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong>PKR {totalRevenue.toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Total Customers</span>
          <strong>{customers.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Vehicles</span>
          <strong>{vehicles.length}</strong>
        </div>
      </section>

      <section className="toolbar">
        <button onClick={loadDashboard} disabled={loading || !token}>
          {loading ? "Loading..." : "Refresh Dashboard"}
        </button>
        {token ? (
          <span className="token-state token-ok">Authenticated</span>
        ) : (
          <span className="token-state token-bad">Not Authenticated</span>
        )}
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section className="grid">
        <div className="card">
          <h2>Customers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email || "-"}</td>
                </tr>
              ))}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={3}>No customers found</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Vehicles</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg #</th>
                <th>Rent/Day</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((item) => (
                <tr key={item._id}>
                  <td>{`${item.name} ${item.model}`}</td>
                  <td>{item.registrationNumber}</td>
                  <td>PKR {Number(item.rentPerDay || 0).toLocaleString()}</td>
                </tr>
              ))}
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={3}>No vehicles found</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="card card-wide">
          <h2>Bookings</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Pickup</th>
                <th>Return</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item) => (
                <tr key={item._id}>
                  <td>{getCustomerName(item.customer)}</td>
                  <td>{getVehicleName(item.vehicle)}</td>
                  <td>{new Date(item.pickupDate).toLocaleDateString()}</td>
                  <td>{new Date(item.returnDate).toLocaleDateString()}</td>
                  <td>{item.status}</td>
                  <td>PKR {Number(item.totalAmount || 0).toLocaleString()}</td>
                </tr>
              ))}
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6}>No bookings found</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
