import React, { useEffect, useState } from "react";
import { loginStyles as s } from "../assets/Styles";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
const roleChoises = [
  {
    value: "user",
    label: "Student",
    icon: UserRound,
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
  },
];
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.signupEmail || location.state?.signupPassword) {
      setForm((current) => ({
        ...current,
        email: location.state?.signupEmail ?? "",
        password: location.state?.signupPassword ?? "",
      }));
    }
  }, [location.state]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };
  // to submit data to server and get the user/admin login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Attempting login with", {
        email: form.email,
        role: form.role,
      });
      const result = await login(form);
      if (!result.ok) {
        setLoading(false);
        setError(result.error || "Login Failed");
        console.error("Login failed", result.error);
        return;
      }

      console.log("Login successful, navigating to dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);

      const fallbackPath =
        form.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      let target = location.state?.from || fallbackPath;

      if (
        form.role === "user" &&
        typeof target === "string" &&
        target.startsWith("/admin")
      ) {
        console.warn(
          "Login: preventing navigation to admin route for student; using fallback",
        );
        target = fallbackPath;
      } else if (
        form.role === "admin" &&
        typeof target === "string" &&
        target.startsWith("/user")
      ) {
        console.warn(
          "Login: preventing navigation to user route for admin; using fallback",
        );
        target = fallbackPath;
      }

      console.log("Navigating to:", target);
      navigate(target, { replace: true });
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError("An unexcepted error occured");
    }
  };
  return (
    <div className={s.pageContainer}>
      <div className={s.mainCard}>
        <section className={s.infoPanel}>
          <span className={s.roleBadge}> College Role Login</span>
          <h1 className={s.infoTitle}>
            Choose admin or student first, then open the correct library panel.
          </h1>
          <p className={s.infoDescription}>
            Select the Role you wnat to enter, then login with matching account.
          </p>
          <div className={s.infoBoxesContainer}>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <UserRound size={16} />
                Student Sign In
              </p>
              <p className={s.infoBoxText}>
                Register a new Student Account using the "Create Account" Link
                to text student functionality with real data.
              </p>
            </div>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <ShieldCheck size={16} />
                Admin Accesss
              </p>
              <p className={s.infoBoxText}>
                Log in using your registered admin account to access the
                administrative dashboard and catalog features.
              </p>
            </div>
          </div>
        </section>
        <section className={s.formPanel}>
          <div className={s.formInner}>
            <Link to="/" className={s.backLink}>
              Back to home
            </Link>
            <h2 className={s.formTitle}>Login Account</h2>
            <p className={s.formSubtitle}>
              Select your role and use your college library account credentails
            </p>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.roleContainer}>
                <p className={s.roleLabel}>Choose login role</p>
                <div className={s.roleGrid}>
                  {roleChoises.map((choice) => {
                    const Icon = choice.icon;
                    return (
                      <label
                        key={choice.value}
                        className={`${s.roleOption} ${form.role === choice.value ? s.roleOptionSelected : s.roleOptionUnselected}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={choice.value}
                          checked={form.role === choice.value}
                          onChange={handleChange}
                          className={s.roleRadio}
                        />
                        <span className={s.roleIconLabel}>
                          <Icon size={14} />
                          {choice.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <label htmlFor="" className="block">
                <span className={s.fieldLabel}>
                  <Mail size={15} />
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@mail.com"
                  className={s.input}
                />
              </label>
              <label htmlFor="" className="block">
                <span className={s.fieldLabel}>
                  <LockKeyhole size={15} />
                  Password
                </span>
                <div className={s.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter the password"
                    className={s.passwordInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className={s.togglePasswordButton}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
              {error && <div className={s.errorMessage}>{error}</div>}
              <div className={s.footerFlex}>
                <span className={s.footerText}>
                  {form.role === "admin"
                    ? "Admin Accounts use existing credentials"
                    : "Student Signup is available below"}
                </span>
                {form.role === "user" && (
                  <Link to="/signup" className={s.signupLink}>
                    Create Account
                  </Link>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={s.submitButton}
              >
                {loading ? "Logging In ..." : "Login Now"}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
