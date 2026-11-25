import React from "react";
import { userDashboardPageStyles as s } from "../assets/Styles";
import { Sparkles } from "lucide-react";
import { useAuth } from "../shared/AuthContext";
import { useLibrary } from "../shared/LibraryContext";
import { BookCopy } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { ReceiptText } from "lucide-react";
import { IdCard } from "lucide-react";

function UserDashboardPage() {
  const { currentUser } = useAuth();
  const { currentUserHistory, currentUserSummary } = useLibrary();

  const activeCount = currentUserHistory.filter(
    (item) => item.liveStatus === "Borrowed",
  ).length;
  const overdueCount = currentUserHistory.filter(
    (item) => item.liveStatus === "Overdue",
  ).length;
  const pendingFine = currentUserSummary?.totalFine ?? 0;
  const clearedFine = currentUserSummary?.totalClearedFine ?? 0;

  const overviewStats = [
    {
      key: "issues",
      label: "Total Issues",
      value: `${currentUserHistory.length}`,
      note: "All library records attached to your student account",
      icon: BookCopy,
    },
    {
      key: "borrowed",
      label: "Active Books",
      value: `${activeCount}`,
      note: "Books currently mapped to your profile",
      icon: GraduationCap,
    },
    {
      key: "overdue",
      label: "Overdue Books",
      value: `${overdueCount}`,
      note: "Needs follow-up before more penalties are added",
      icon: AlertTriangle,
    },
    {
      key: "pending-fine",
      label: "Pending Fine",
      value: `Rs. ${pendingFine}`,
      note: "Fine amount still pending on active records",
      icon: ReceiptText,
    },
    {
      key: "cleared-fine",
      label: "Fine Cleared",
      value: `Rs. ${clearedFine}`,
      note: "Total fine amount already cleared on your account",
      icon: ReceiptText,
    },
  ];

  const recentBooks = currentUserHistory.slice(0, 3);

  return (
    <div className={s.pageContainer}>
      <section className={s.heroSection}>
        <div className={s.heroGrid}>
          <div className={s.heroLeft}>
            <span className={s.heroBadge}>
              <Sparkles size={12} />
              Student Dashboard
            </span>
            <h1 className={s.heroTitle}>
              {currentUser?.name ?? "Reader"} profile, semester status, and your
              latest library books.
            </h1>
            <p className={s.heroText}>
              Your dashboard now keeps the important account summary at the top
              and shows the most recent issued books directly below for faster
              access.
            </p>
          </div>
          <div className={s.rightColumnGrid}>
            <article className={s.profileCard}>
              <div className={s.profileHeader}>
                <div className="min-w-0">
                  <p className={s.profileLabel}>Student profile</p>
                  <p className={s.profileName}>
                    {currentUser?.name ?? "Campus Reader"}
                  </p>
                </div>
                <span className={s.profileIconWrapper}>
                  <IdCard size={18} />
                </span>
              </div>
              <div className={s.profileDetails}>
                <div className={s.profileDetailItem}>
                  Student ID: {currentUserSummary?.studentid ?? "Not Assigned"}
                </div>
                <div className={s.profileDetailItem}>
                  Roll No: {currentUserSummary?.rollNumber ?? "Not Assigned"}
                </div>
                <div className={s.profileDetailItem}>
                  Department: {currentUserSummary?.department ?? "General"}
                </div>
              </div>
            </article>
            <article className={s.semesterCard}>
              <div className={s.semesterHeader}>
                <p className={s.semesterLabel}>Semester Details</p>
                <p className={s.semesterValue}>
                  {currentUserSummary?.semester ?? "Semester 1"}
                </p>
              </div>
              <span className={s.semesterIconWrapper}>
                <GraduationCap size={18} />
              </span>
              <div className={s.semesterDetails}>
                <div className={s.semesterDetailItem}>
                  Stream: {currentUserSummary?.stream ?? "General"}
                </div>
                <div className={s.semesterDetailItem}>
                  Acadmic Year: {currentUserSummary?.academicYear ?? "1st Year"}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className={s.statsGrid}>
        {overviewStats.map((item) => {
          const Icon = item.icon;
          return (
            <article className={s.statCard} key={item.key}>
              <div className={s.statHeader}>
                <span className={s.statIconWrapper}>
                  <Icon size={18} />
                </span>
                <span className={s.statLiveBadge}>Live</span>
              </div>
              <p className={s.statLabel}>{item.label}</p>
              <p className={s.statValue}>{item.value}</p>
              <p className={s.statNote}>{item.note}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default UserDashboardPage;
