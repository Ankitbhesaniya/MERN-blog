import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.data.token, data.data.user);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.errors || [err.response?.data?.message || "Login failed."];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="card">
          <div className="card-body">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Login to your account</p>

            {errors.length > 0 && (
              <div className="alert alert-error">
                <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" className="form-control"
                  placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" className="form-control"
                  placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="auth-footer">
              No account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
