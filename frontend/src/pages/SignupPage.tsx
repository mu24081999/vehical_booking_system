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
        <form className="form-grid column auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-name" className="auth-label">
              Full Name
            </label>
            <input
              id="signup-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your full name"
              required
              minLength={3}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-label">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
          </div>
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
