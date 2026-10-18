import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const loginData = new URLSearchParams();
    loginData.append("email", email);
    loginData.append("password", password);

    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: loginData,
      }
    );

    if (response.ok) {
      navigate("/dashboard");
    } else {
      setMessage("Invalid email or password.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>
            Fleet<span>Forge</span>
          </h1>
          <p>Fleet Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="manager@fleetforge.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        {message && (
          <p className="login-message">{message}</p>
        )}

        <p className="login-footer">
          Authorized NorthStar personnel only
        </p>
      </section>
    </main>
  );
}

export default LoginPage;