import React from "react";
import { userEditProfilePageStyles as s } from "../assets/Styles";
import { studentSemesters, studentYears } from "../data/libraryData";
import { useState } from "react";
import { useAuth } from "../shared/AuthContext";
import { useEffect } from "react";
const UserEditProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    stream: "",
    semester: "",
    academicYear: "",
    rollNumber: "",
  });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setForm({
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      phone: currentUser.phone ?? "",
      department: currentUser.department ?? "",
      stream: currentUser.stream ?? "",
      semester: currentUser.semester ?? "",
      academicYear: currentUser.academicYear ?? "",
      rollNumber: currentUser.rollNumber ?? "",
    });
    setIsEditing(false);
    setError("");
  }, [currentUser]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, [name]: digitsOnly }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.phone.trim().replace(/\D/g, "").length !== 10) {
      setError("Mobile Number must be exactly 10 digits.");
      return;
    }
    setLoading(true);
    try {
      const result = await updateProfile(form);
      setLoading(false);
      if (result.ok) {
        setToast("Profile updated successfully");
        setIsEditing(false);
      } else {
        setError(
          result.error || "Profile updated failed. please try again later",
        );
      }
    } catch (error) {
      setLoading(false);
      setError("An unexpected connection error occured");
    }
  };
  return <div className={s.pageContainer}></div>;
};

export default UserEditProfilePage;
