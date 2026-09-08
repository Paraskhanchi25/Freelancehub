import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login successful!");
  };

  
  
  return (
    <div className="auth">

      <h1>WorkHub</h1>

      <h2>Welcome Back</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">
          Log In
        </button>

      </form>

      <p>
        Don't have an account?
        <Link to="/signup"> Sign Up</Link>
      </p>

    </div>
  );
}

export default Login;