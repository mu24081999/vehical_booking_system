import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type LoginPageProps = {
  loading: boolean;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
};

export function LoginPage({ loading, onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onLogin(form);
  };

  return (
    <div className="page auth-page">
      <section className="card auth-card">
        <h1>Login</h1>
        <p className="muted">
          Sign in to view vehicles, create bookings and access dashboard.
        </p>
        <form className="form-grid column" onSubmit={handleSubmit}>
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
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
        <div className="auth-switch">
          <button type="button" className="linkish" onClick={() => navigate("/signup")}>
            Need an account? Go to signup
          </button>
        </div>
      </section>
    </div>
  );
}
