import type { FormEvent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { BookingsPage } from "../pages/BookingsPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { VehiclesPage } from "../pages/VehiclesPage";
import type { Booking, Customer, Role, Vehicle } from "../types";

type BookingForm = {
  customer: string;
  vehicle: string;
  pickupDate: string;
  returnDate: string;
  status: string;
  paymentStatus: string;
  notes: string;
};

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
};

type VehicleForm = {
  name: string;
  model: string;
  registrationNumber: string;
  rentPerDay: string;
  status: string;
};

type AppRoutesProps = {
  token: string;
  role: Role;
  loadingKey: string;
  dataLoading: boolean;
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  customerForm: CustomerForm;
  vehicleForm: VehicleForm;
  bookingForm: BookingForm;
  editingCustomerId: string;
  editingVehicleId: string;
  editingBookingId: string;
  totalRevenue: number;
  onLogout: () => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onSignup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  onCustomerFormChange: (form: CustomerForm) => void;
  onVehicleFormChange: (form: VehicleForm) => void;
  onBookingFormChange: (form: BookingForm) => void;
  onCustomerSubmit: (event: FormEvent) => Promise<void>;
  onVehicleSubmit: (event: FormEvent) => Promise<void>;
  onCustomerEdit: (customer: Customer) => void;
  onVehicleEdit: (vehicle: Vehicle) => void;
  onCustomerDelete: (customerId: string) => Promise<void>;
  onVehicleDelete: (vehicleId: string) => Promise<void>;
  onCustomerFormReset: () => void;
  onVehicleFormReset: () => void;
  onBookingSubmit: (event: FormEvent) => Promise<void>;
  onBookingEdit: (booking: Booking) => void;
  onBookingDelete: (bookingId: string) => Promise<void>;
  onBookingFormReset: () => void;
};

export function AppRoutes({
  token,
  role,
  loadingKey,
  dataLoading,
  customers,
  vehicles,
  bookings,
  customerForm,
  vehicleForm,
  bookingForm,
  editingCustomerId,
  editingVehicleId,
  editingBookingId,
  totalRevenue,
  onLogout,
  onLogin,
  onSignup,
  onCustomerFormChange,
  onVehicleFormChange,
  onBookingFormChange,
  onCustomerSubmit,
  onVehicleSubmit,
  onCustomerEdit,
  onVehicleEdit,
  onCustomerDelete,
  onVehicleDelete,
  onCustomerFormReset,
  onVehicleFormReset,
  onBookingSubmit,
  onBookingEdit,
  onBookingDelete,
  onBookingFormReset,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to={role === "admin" ? "/dashboard" : "/vehicles"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to={role === "admin" ? "/dashboard" : "/vehicles"} replace />
          ) : (
            <LoginPage loading={loadingKey === "login"} onLogin={onLogin} />
          )
        }
      />

      <Route
        path="/signup"
        element={
          token ? (
            <Navigate to={role === "admin" ? "/dashboard" : "/vehicles"} replace />
          ) : (
            <SignupPage loading={loadingKey === "signup"} onSignup={onSignup} />
          )
        }
      />

      <Route element={<ProtectedRoute token={token} />}>
        <Route element={<AppLayout role={role} onLogout={onLogout} />}>
          <Route
            path="/vehicles"
            element={
              <VehiclesPage
                vehicles={vehicles}
                vehicleForm={vehicleForm}
                editingVehicleId={editingVehicleId}
                loadingKey={loadingKey}
                dataLoading={dataLoading}
                onVehicleFormChange={onVehicleFormChange}
                onVehicleSubmit={onVehicleSubmit}
                onVehicleEdit={onVehicleEdit}
                onVehicleDelete={onVehicleDelete}
                onVehicleFormReset={onVehicleFormReset}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <CustomersPage
                customers={customers}
                customerForm={customerForm}
                editingCustomerId={editingCustomerId}
                loadingKey={loadingKey}
                dataLoading={dataLoading}
                onCustomerFormChange={onCustomerFormChange}
                onCustomerSubmit={onCustomerSubmit}
                onCustomerEdit={onCustomerEdit}
                onCustomerDelete={onCustomerDelete}
                onCustomerFormReset={onCustomerFormReset}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <BookingsPage
                customers={customers}
                vehicles={vehicles}
                bookings={bookings}
                bookingForm={bookingForm}
                editingBookingId={editingBookingId}
                loadingKey={loadingKey}
                dataLoading={dataLoading}
                onBookingFormChange={onBookingFormChange}
                onBookingSubmit={onBookingSubmit}
                onBookingEdit={onBookingEdit}
                onBookingDelete={onBookingDelete}
                onBookingFormReset={onBookingFormReset}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              role === "admin" ? (
                <DashboardPage
                  customers={customers}
                  vehicles={vehicles}
                  bookings={bookings}
                  totalRevenue={totalRevenue}
                />
              ) : (
                <Navigate to="/vehicles" replace />
              )
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
