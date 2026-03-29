import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type SignupPageProps = {
  loading: boolean;
  onSignup: (payload: { name: string; email: string; password: string }) => Promise<void>;
};

export function SignupPage({ loading, onSignup }: SignupPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSignup(form);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="page auth-page">
      <section className="card auth-card">
        <h1>Create Account</h1>
        <p className="muted">Register a new account to use the booking platform.</p>
        <form className="form-grid column" onSubmit={handleSubmit}>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Full name"
            required
            minLength={3}
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="Password"
            required
            minLength={8}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Create account"}
          </button>
        </form>
        <div className="auth-switch">
          <button type="button" className="linkish" onClick={() => navigate("/login")}>
            Already registered? Go to login
          </button>
        </div>
      </section>
    </div>
  );
}
