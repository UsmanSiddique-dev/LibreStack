import React, { useEffect, useState } from "react";
import { signupStyles as s } from "../assets/Styles";
import { useAuth } from "../shared/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { studentSemesters, studentYears } from "../data/libraryData";
const stepList = [
  { id: 1, title: "Account" },
  { id: 2, title: "OTP" },
  { id: 3, title: "Profile" },
];

const signupHighlights = [
  "Step 1 collects student account details and checks immediately if the email already exists.",
  "Step 2 verifies the OTP before moving forward.",
  "Step 3 saves department, stream, semester, year, and roll number.",
];

const demoOtp = "2468";
const SignUp = () => {
  const { registerStudent, verifyOtpCode, completeProfileData, logout } =
    useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    role: "user",
    department: "",
    stream: "",
    semester: "Semester 1",
    academicYear: "1st Year",
    rollNumber: "",
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({
        ...current,
        phone: digitsOnly,
      }));
      return;
    }
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };
  // fields must be filled by the user
  const validateStepOne = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      setError("Please fill name, email, mobile number, and password first.");
      return false;
    }
    if (form.phone.trim().replace(/\D/g, "").length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const validateStepThree = () => {
    if (
      !form.department.trim() ||
      !form.stream.trim() ||
      !form.semester.trim() ||
      !form.academicYear.trim() ||
      !form.rollNumber.trim()
    ) {
      setError(
        "Please complete department, stream, semester, year, and roll number.",
      );
      return false;
    }
    return true;
  };

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const goNext = async () => {
    setError("");

    if (step === 1) {
      if (!validateStepOne()) return;
      setLoading(true);
      const res = await registerStudent({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setLoading(false);
      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }
      showToast("OTP sent successfully!");
    }

    if (step === 2) {
      if (!form.otp.trim()) {
        setError("Please enter the 6-digit OTP code sent to your email.");
        return;
      }
      setLoading(true);
      const res = await verifyOtpCode({
        email: form.email,
        otp: form.otp,
      });
      setLoading(false);
      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }
      showToast("OTP verified successfully!");
    }

    setStep((current) => Math.min(3, current + 1));
  };
  // go back to previous step
  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!validateStepOne() || !form.otp.trim() || !validateStepThree()) {
      setError("Please com[plete all Steps First");
      return;
    }
    setLoading(true);
    const result = await completeProfileData({
      email: form.email,
      department: form.department,
      stream: form.stream,
      semester: form.semester,
      academicYear: form.academicYear,
      rollNumber: form.rollNumber,
    });
    setLoading(false);
    if (!result.ok) {
      showToast(result.error, "error");
      setError(result.error);
      return;
    }
    showToast("Student profile Completed. redirecting to Login...");
    setTimeout(() => {
      logout();
      navigate("/login", {
        replace: true,
        state: {
          signupEmail: form.email,
          signPassword: form.password,
        },
      });
    }, 1000);
  };

  return (
    <div className={s.pageContainer}>
      {toast && (
        <div
          className={`${s.toastBase} ${toast.tone === "error" ? s.toastError : s.toastSuccess}`}
        >
          <div className={s.toastContent}>
            <CheckCircle2 size={18} />
            {toast.message}
          </div>
        </div>
      )}
      <div className={s.mainCard}>
        <section className={s.formPanel}>
          <div className={s.formInner}>
            <Link to="/" className={s.backLink}>
              Back To Home
            </Link>
            <h1 className={s.panelTitle}>
              Create Ypur Student Library Account.
            </h1>
            <p className={s.panelSubtitle}>
              Complete the student signup steps: account,OTP,and Profile details
            </p>
            <div className={s.stepGrid}>
              {stepList.map((item) => (
                <div
                  className={`${s.stepCard} ${step >= item.id ? s.stepCardCompleted : s.stepCardPending}`}
                >
                  <p className={s.stepLabel}>Step {item.id}</p>
                  <p className={s.stepTitle}>{item.title}</p>
                </div>
              ))}
            </div>
            <form action="" className={s.form} onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <label htmlFor="" className="block">
                    <span className={s.fieldLabel}>
                      <UserRound size={16} />
                      Full Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your Full name"
                      className={s.input}
                    />
                  </label>
                  <label htmlFor="" className="block">
                    <span className={s.fieldLabel}>
                      <Mail size={16} />
                      Email Address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your Email Address"
                      className={s.input}
                    />
                  </label>
                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Phone size={16} />
                      Phone Number
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter your 10-digit phone number"
                      className={s.input}
                    />
                  </label>
                  <label htmlFor="" className="block">
                    <span className={s.fieldLabel}>
                      <LockKeyhole size={16} />
                      Password
                    </span>
                    <div className={s.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create Your password"
                        className={s.passwordInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className={s.toggleButton}
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </label>
                </>
              )}
              {/* Step 2 */}

              {step === 2 && (
                <>
                  <div className={s.otpInfoBox}>
                    <p className={s.otpInfoLabel}>Verification Sent</p>
                    <p className={s.otpInfoText}>
                      We have sent a 6-digit OTP verification code to{" "}
                      <span className={s.emailHighlight}>{form.email}</span>.
                      Please check your inbox and enter the code below to verify
                      your account.
                    </p>
                  </div>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <KeyRound size={15} />
                      OTP Verification
                    </span>
                    <input
                      name="otp"
                      type="text"
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      className={s.input}
                    />
                  </label>
                </>
              )}
              {/* Step 3 */}
              {step === 3 && (
                <>
                  <label className="block">
                    <span className={s.fieldLabelBlock}>Department</span>
                    <input
                      name="department"
                      type="text"
                      value={form.department}
                      onChange={handleChange}
                      placeholder="Write your department"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabelBlock}>Stream</span>
                    <input
                      name="stream"
                      type="text"
                      value={form.stream}
                      onChange={handleChange}
                      placeholder="Write your stream"
                      className={s.input}
                    />
                  </label>

                  <div className={s.twoColumnGrid}>
                    <label className="block">
                      <span className={s.fieldLabelBlock}>Semester</span>
                      <select
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        className={s.select}
                      >
                        {studentSemesters.map((semester) => (
                          <option key={semester} value={semester}>
                            {semester}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className={s.fieldLabelBlock}>Year</span>
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className={s.select}
                      >
                        {studentYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className={s.fieldLabelBlock}>Roll Number</span>
                    <input
                      name="rollNumber"
                      type="text"
                      value={form.rollNumber}
                      onChange={handleChange}
                      placeholder="Write your roll number"
                      className={s.input}
                    />
                  </label>
                </>
              )}
              {error && <div className={s.errorMessage}>{error}</div>}
              <div className={s.buttonGroup}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className={s.backButton}
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={loading}
                    className={s.nextButton}
                  >
                    {loading
                      ? step === 1
                        ? "Sending OTP..."
                        : "Verifying OTP..."
                      : "Continue"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={s.submitButton}
                  >
                    {loading ? "Completing profile" : "Complete profile"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
        <section className={s.infoPanel}>
          <span className={s.infoBadge}>
            <Sparkles size={14} />
            Step wise Signup
          </span>
          <h2 className={s.infoTitle}>
            Create the Student account,verify OTP, and finish the profile in
            three Steps.
          </h2>
          <div className={s.infoList}>
            {signupHighlights.map((item) => (
              <div key={item} className={s.infoListItem}>
                <BadgeCheck size={18} className={s.infoIcon} />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
