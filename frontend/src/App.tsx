import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { NoticeBanner } from "./components/NoticeBanner";
import { AppRoutes } from "./routes/AppRoutes";
import { TOKEN_KEY, apiRequest } from "./services/api";
import type { Booking, Customer, Notice, Vehicle } from "./types";
import { decodeRoleFromToken } from "./utils/auth";
import { getEntityId, toDateInput } from "./utils/booking";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loadingKey, setLoadingKey] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [editingCustomerId, setEditingCustomerId] = useState("");

  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    model: "",
    registrationNumber: "",
    rentPerDay: "",
    status: "available",
  });
  const [editingVehicleId, setEditingVehicleId] = useState("");

  const [editingBookingId, setEditingBookingId] = useState("");
  const [bookingForm, setBookingForm] = useState({
    customer: "",
    vehicle: "",
    pickupDate: "",
    returnDate: "",
    status: "booked",
    paymentStatus: "pending",
    notes: "",
  });

  const role = useMemo(() => decodeRoleFromToken(token), [token]);
  const totalRevenue = useMemo(
    () => bookings.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0),
    [bookings],
  );

  const clearBookingForm = () => {
    setEditingBookingId("");
    setBookingForm({
      customer: "",
      vehicle: "",
      pickupDate: "",
      returnDate: "",
      status: "booked",
      paymentStatus: "pending",
      notes: "",
    });
  };

  const clearCustomerForm = () => {
    setEditingCustomerId("");
    setCustomerForm({
      name: "",
      phone: "",
      email: "",
    });
  };

  const clearVehicleForm = () => {
    setEditingVehicleId("");
    setVehicleForm({
      name: "",
      model: "",
      registrationNumber: "",
      rentPerDay: "",
      status: "available",
    });
  };

  const request = useCallback(
    async <T,>(path: string, options: RequestInit = {}, requireAuth = false) => {
      return apiRequest<T>(path, token, options, requireAuth);
    },
    [token],
  );

  const loadAllData = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);
    try {
      const [customerRes, vehicleRes, bookingRes] = await Promise.all([
        request<{ customers: Customer[] }>("/customers", {}, true),
        request<{ vehicles: Vehicle[] }>("/vehicles", {}, true),
        request<{ bookings: Booking[] }>("/bookings", {}, true),
      ]);
      setCustomers(customerRes.data?.customers ?? []);
      setVehicles(vehicleRes.data?.vehicles ?? []);
      setBookings(bookingRes.data?.bookings ?? []);
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load data.",
      });
    } finally {
      setDataLoading(false);
    }
  }, [request, token]);

  useEffect(() => {
    if (!token) {
      setCustomers([]);
      setVehicles([]);
      setBookings([]);
      clearCustomerForm();
      clearVehicleForm();
      clearBookingForm();
      return;
    }
    void loadAllData();
  }, [token, loadAllData]);

  const handleLogin = async (payload: { email: string; password: string }) => {
    setLoadingKey("login");
    setNotice(null);
    try {
      const result = await request<{ accessToken: string }>("/sign-in", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!result.data?.accessToken) throw new Error("Access token not received.");
      localStorage.setItem(TOKEN_KEY, result.data.accessToken);
      setToken(result.data.accessToken);
      setNotice({ type: "success", text: "Login successful." });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Login failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleSignup = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoadingKey("signup");
    setNotice(null);
    try {
      await request("/sign-up", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setNotice({
        type: "success",
        text: "Signup successful. Now login with your account.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Signup failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setNotice({ type: "success", text: "Logged out." });
  };

  const handleCustomerSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingKey("customer");
    setNotice(null);
    try {
      const payload = {
        name: customerForm.name,
        phone: customerForm.phone,
        email: customerForm.email || undefined,
      };

      if (editingCustomerId) {
        await request(
          `/customers/${editingCustomerId}`,
          { method: "PUT", body: JSON.stringify(payload) },
          true,
        );
      } else {
        await request("/customers", { method: "POST", body: JSON.stringify(payload) }, true);
      }

      const wasEditing = Boolean(editingCustomerId);
      clearCustomerForm();
      setNotice({
        type: "success",
        text: wasEditing ? "Customer updated successfully." : "Customer created successfully.",
      });
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Customer request failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomerId(customer._id);
    setCustomerForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
    });
  };

  const handleCustomerDelete = async (customerId: string) => {
    setLoadingKey(`customer-delete-${customerId}`);
    setNotice(null);
    try {
      await request(`/customers/${customerId}`, { method: "DELETE" }, true);
      if (editingCustomerId === customerId) clearCustomerForm();
      setNotice({ type: "success", text: "Customer deleted successfully." });
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Customer delete failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleVehicleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingKey("vehicle");
    setNotice(null);
    try {
      const payload = {
        name: vehicleForm.name,
        model: vehicleForm.model,
        registrationNumber: vehicleForm.registrationNumber,
        rentPerDay: Number(vehicleForm.rentPerDay),
        status: vehicleForm.status,
      };

      if (editingVehicleId) {
        await request(
          `/vehicles/${editingVehicleId}`,
          { method: "PUT", body: JSON.stringify(payload) },
          true,
        );
      } else {
        await request("/vehicles", { method: "POST", body: JSON.stringify(payload) }, true);
      }

      const wasEditing = Boolean(editingVehicleId);
      clearVehicleForm();
      setNotice({
        type: "success",
        text: wasEditing ? "Vehicle updated successfully." : "Vehicle created successfully.",
      });
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Vehicle request failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle._id);
    setVehicleForm({
      name: vehicle.name,
      model: vehicle.model,
      registrationNumber: vehicle.registrationNumber,
      rentPerDay: String(vehicle.rentPerDay),
      status: vehicle.status,
    });
  };

  const handleVehicleDelete = async (vehicleId: string) => {
    setLoadingKey(`vehicle-delete-${vehicleId}`);
    setNotice(null);
    try {
      await request(`/vehicles/${vehicleId}`, { method: "DELETE" }, true);
      if (editingVehicleId === vehicleId) clearVehicleForm();
      setNotice({ type: "success", text: "Vehicle deleted successfully." });
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Vehicle delete failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleBookingSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingKey("booking");
    setNotice(null);
    try {
      const payload = {
        customer: bookingForm.customer,
        vehicle: bookingForm.vehicle,
        pickupDate: bookingForm.pickupDate,
        returnDate: bookingForm.returnDate,
        status: bookingForm.status,
        paymentStatus: bookingForm.paymentStatus,
        notes: bookingForm.notes || undefined,
      };

      if (editingBookingId) {
        await request(
          `/bookings/${editingBookingId}`,
          { method: "PUT", body: JSON.stringify(payload) },
          true,
        );
      } else {
        await request("/bookings", { method: "POST", body: JSON.stringify(payload) }, true);
      }

      const wasEditing = Boolean(editingBookingId);
      clearBookingForm();
      setNotice({
        type: "success",
        text: wasEditing ? "Booking updated successfully." : "Booking created successfully.",
      });
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Booking request failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  const handleBookingEdit = (booking: Booking) => {
    setEditingBookingId(booking._id);
    setBookingForm({
      customer: getEntityId(booking.customer),
      vehicle: getEntityId(booking.vehicle),
      pickupDate: toDateInput(booking.pickupDate),
      returnDate: toDateInput(booking.returnDate),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes || "",
    });
  };

  const handleBookingDelete = async (bookingId: string) => {
    setLoadingKey(`booking-delete-${bookingId}`);
    setNotice(null);
    try {
      await request(`/bookings/${bookingId}`, { method: "DELETE" }, true);
      setNotice({ type: "success", text: "Booking deleted successfully." });
      if (editingBookingId === bookingId) clearBookingForm();
      await loadAllData();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Booking delete failed.",
      });
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <div className="app">
      <NoticeBanner notice={notice} />
      <AppRoutes
        token={token}
        role={role}
        loadingKey={loadingKey}
        dataLoading={dataLoading}
        customers={customers}
        vehicles={vehicles}
        bookings={bookings}
        customerForm={customerForm}
        vehicleForm={vehicleForm}
        bookingForm={bookingForm}
        editingCustomerId={editingCustomerId}
        editingVehicleId={editingVehicleId}
        editingBookingId={editingBookingId}
        totalRevenue={totalRevenue}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onCustomerFormChange={setCustomerForm}
        onVehicleFormChange={setVehicleForm}
        onBookingFormChange={setBookingForm}
        onCustomerSubmit={handleCustomerSubmit}
        onVehicleSubmit={handleVehicleSubmit}
        onCustomerEdit={handleCustomerEdit}
        onVehicleEdit={handleVehicleEdit}
        onCustomerDelete={handleCustomerDelete}
        onVehicleDelete={handleVehicleDelete}
        onCustomerFormReset={clearCustomerForm}
        onVehicleFormReset={clearVehicleForm}
        onBookingSubmit={handleBookingSubmit}
        onBookingEdit={handleBookingEdit}
        onBookingDelete={handleBookingDelete}
        onBookingFormReset={clearBookingForm}
      />
    </div>
  );
}

export default App;
