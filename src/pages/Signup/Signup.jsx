import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const handleSignup = (e) => {
    e.preventDefault();
    alert("Account created!");
  };

  return (
    <div className="auth">

      <h1>Join WorkHub</h1>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Full Name"
          required
        />

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
          Create Account
        </button>

      </form>

      <p>
        Already have an account?
        <Link to="/login"> Log In</Link>
      </p>

    </div>
  );
}

export default Signup;