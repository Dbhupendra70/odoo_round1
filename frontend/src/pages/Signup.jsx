import "./Signup.css";

export default function Signup() {
  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
