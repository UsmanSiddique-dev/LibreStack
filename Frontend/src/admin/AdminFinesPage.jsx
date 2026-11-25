import React from "react";
import { adminFinesPageStyles as s } from "../assets/Styles";
import { useState } from "react";
import { useLibrary } from "../shared/LibraryContext";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Pencil } from "lucide-react";

const fineIntervals = [
  { value: "day", label: "Per Day" },
  { value: "week", label: "Per Week" },
  { value: "month", label: "Per Month" },
  { value: "year", label: "Per Year" },
];

function AdminFinesPage() {
  const { fineSettings, saveFineSettings } = useLibrary();
  const [form, setForm] = useState(fineSettings);
  const [toast, setToast] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(fineSettings);
  }, [fineSettings]);
  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setToast("");
    }, 2200);
    return () => clearTimeout(timer);
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    saveFineSettings(form);
    setIsEditing(false);
    setToast("Fine settings saved successfully.");
  };
  return (
    <div className={s.pageContainer}>
      {toast && (
        <div className={s.toastWrapper}>
          <div className={s.toastContent}>
            <CheckCircle2 size={16} />
            {toast}
          </div>
        </div>
      )}
      <section className={s.mainSection}>
        <div className={s.headerFlex}>
          <div>
            <h1 className={s.title}>Fine Settings</h1>
            <p className={s.subtitle}>
              Save the overdue fine rule here, After saving, use the edit icon
              to update it again.
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setForm(fineSettings);
                setIsEditing(true);
              }}
              className={s.editButton}
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className={s.formContainer}>
          <label htmlFor="" className={s.label}>
            <span className={s.labelSpan}>Fine Amount</span>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  amount: event.target.value,
                }));
              }}
              disabled={!isEditing}
              className={s.input}
            />
          </label>
          <label htmlFor="" className={s.label}>
            <span className={s.labelSpan}>Fine Interval</span>
            <select
              value={from.interval}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  interval: event.target.value,
                }));
              }}
              disabled={!isEditing}
              className={s.select}
            >
              {fineIntervals.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>
      </section>
    </div>
  );
}

export default AdminFinesPage;
