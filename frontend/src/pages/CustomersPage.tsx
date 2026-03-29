import type { FormEvent } from "react";
import type { Customer } from "../types";

type CustomerForm = {
  name: string;
  phone: string;
  email: string;
};

type CustomersPageProps = {
  customers: Customer[];
  customerForm: CustomerForm;
  editingCustomerId: string;
  loadingKey: string;
  dataLoading: boolean;
  onCustomerFormChange: (form: CustomerForm) => void;
  onCustomerSubmit: (event: FormEvent) => Promise<void>;
  onCustomerEdit: (customer: Customer) => void;
  onCustomerDelete: (customerId: string) => Promise<void>;
  onCustomerFormReset: () => void;
};

export function CustomersPage({
  customers,
  customerForm,
  editingCustomerId,
  loadingKey,
  dataLoading,
  onCustomerFormChange,
  onCustomerSubmit,
  onCustomerEdit,
  onCustomerDelete,
  onCustomerFormReset,
}: CustomersPageProps) {
  return (
    <section className="page grid">
      <div className="card">
        <h2>{editingCustomerId ? "Edit Customer" : "Create Customer"}</h2>
        <form className="form-grid column" onSubmit={(event) => void onCustomerSubmit(event)}>
          <input
            value={customerForm.name}
            onChange={(event) =>
              onCustomerFormChange({ ...customerForm, name: event.target.value })
            }
            placeholder="Customer name"
            required
          />
          <input
            value={customerForm.phone}
            onChange={(event) =>
              onCustomerFormChange({ ...customerForm, phone: event.target.value })
            }
            placeholder="Phone"
            required
          />
          <input
            type="email"
            value={customerForm.email}
            onChange={(event) =>
              onCustomerFormChange({ ...customerForm, email: event.target.value })
            }
            placeholder="Email (optional)"
          />
          <div className="actions">
            <button type="submit" disabled={loadingKey === "customer"}>
              {loadingKey === "customer"
                ? "Saving..."
                : editingCustomerId
                  ? "Update customer"
                  : "Create customer"}
            </button>
            {editingCustomerId ? (
              <button type="button" className="secondary" onClick={onCustomerFormReset}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card card-wide">
        <h2>Customers List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.email || "-"}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onCustomerEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={loadingKey === `customer-delete-${item._id}`}
                      onClick={() => void onCustomerDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4}>{dataLoading ? "Loading..." : "No customers found."}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
