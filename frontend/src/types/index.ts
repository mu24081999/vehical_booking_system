export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Role = "admin" | "manager" | "unknown";

export type Notice = {
  type: "success" | "error";
  text: string;
};

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
};

export type Vehicle = {
  _id: string;
  name: string;
  model: string;
  registrationNumber: string;
  rentPerDay: number;
  status: string;
  isActive: boolean;
};

export type Booking = {
  _id: string;
  customer: Customer | string;
  vehicle: Vehicle | string;
  pickupDate: string;
  returnDate: string;
  totalAmount?: number;
  status: string;
  paymentStatus: string;
  notes?: string;
};
