import React from "react";
import { adminDashboardStyles as s } from "../assets/Styles";
import { UserRound } from "lucide-react";
import { Activity } from "lucide-react";
import { ShieldEllipsis } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { useLibrary } from "../shared/LibraryContext";
const icons = [UserRound, Activity, ShieldEllipsis, AlertTriangle];
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function AdminDashboardPage() {
  const { adminStats, studentSummaries } = useLibrary();
  const overdueStudents = studentSummaries.filter(
    (student) => student.status === "Overdue",
  );
  const attentionrecords = overdueStudents
    .map((student) => {
      const topOverdueRecord = student.activeBooks
        .filter((record) => record.liveStatus === "Overdue")
        .sort((first, second) => second.liveFine - first.liveFine)[0];
      if (!topOverdueRecord) {
        return null;
      }
      return {
        studentName: student.name,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        totalFine: student.totalFine,
        borrowedCount: student.borrowedCount,
        ...topOverdueRecord,
      };
    })
    .filter(Boolean)
    .sort((first, second) => second.totalFine - first.totalFine)
    .slice(0, 10);

  return (
    <div className={s.container}>
      <section className={s.heroSection}>
        <div className={s.heroInner}>
          <div>
            <span className={s.badge}>College Administration Workspace</span>
            <h1 className={s.heading}>
              Manage issued books, student records, returns, overdue status and
              fines.{" "}
            </h1>
            <p className={s.heroParagraph}>
              The admin area now focuses on visual trend graphs while keeping
              the existing admin workflow unchange.
            </p>
          </div>
        </div>
      </section>
      <section className={s.statsGrid}>
        {adminStats.map((item, index) => {
          const Icon = icons[index];
          return (
            <article key={item.label} className={s.statCard}>
              <span className={s.statIcon}>
                <Icon size={20} />
              </span>
              <p className={s.statLabel}>{item.label}</p>
              <p className={s.statValue}>{item.value}</p>
              <p className={s.statNote}>{item.note}</p>
            </article>
          );
        })}
      </section>
      <section className={s.overdueSection}>
        <div className={s.overdueHeader}>
          <div>
            <h2 className={s.overdueTitle}>Overdue Attention List</h2>
            <p className={s.overdueSubtitle}>
              Top 4 overdue students ranked bytotal imposed fine, with the
              highest fine shown first
            </p>
          </div>
          <span className={s.alertIcon}>
            <AlertTriangle size={20} />
          </span>
        </div>
        <div className={s.overdueGrid}>
          {attentionrecords.length ? (
            attentionrecords.map((record, index) => (
              <div
                className={s.overdueCard}
                key={`${record.email}- ${record.id}`}
              >
                {index === 0 ? (
                  <span className={s.mostFineBadge}>Most fine Imposed</span>
                ) : null}
                <div className={s.overdueCardInner}>
                  <div>
                    <p className={s.studentName}>{record.studentName}</p>
                    <p className={s.studentDetails}>
                      {record.studentId ?? "Not Assigned"} | {record.email}
                    </p>
                    <p className={s.studentFine}>Rs. {record.totalFine}</p>
                  </div>
                  <div className={s.highestFineBookContainer}>
                    <p className={s.highestFineLabel}>Highest fine Book</p>
                    <p className={s.highestFineTitle}>{record.title}</p>
                  </div>
                </div>
                <div className={s.detailsGrid}>
                  <div className={s.detailItem}>
                    Department: {record.department ?? "General"}
                  </div>
                  <div className={s.detailItem}>
                    Book Code: {record.bookCode}
                  </div>
                  <div className={s.detailItem}>
                    Highest Book fine: Rs. {record.liveFine}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={s.emptyState}>
              No Overdue book need urgent Attention right now
            </div>
          )}
        </div>
        {attentionrecords.length ? (
          <div className={s.viewMoreContainer}>
            <Link
              to="/admin/users?status=Overdue&sort=high-to-low"
              className={s.viewMoreLink}
            >
              View More
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
