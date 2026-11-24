import React, { useEffect, useState } from "react";
import { adminUsersPageStyles as s } from "../assets/Styles";
import { useSearchParams } from "react-router-dom";
import { useLibrary } from "../shared/LibraryContext";
const roleStyles = {
  user: "bg-emerald-100 text-emerald-900",
  admin: "bg-amber-100 text-amber-900",
};

const roleLabels = {
  user: "Student",
  admin: "Admin",
};

const statusStyles = {
  Clear: "bg-emerald-100 text-emerald-900",
  Overdue: "bg-rose-100 text-rose-900",
  Borrowing: "bg-amber-100 text-amber-900",
};

const recordStatusStyles = {
  Borrowed: "bg-amber-100 text-amber-900",
  Overdue: "bg-rose-100 text-rose-900",
  Returned: "bg-slate-200 text-slate-800",
};

const studentFilterOptions = [
  { value: "All", label: "All Students" },
  { value: "Overdue", label: "Overdue Students" },
  { value: "Borrowing", label: "Borrowing Students" },
  { value: "Clear", label: "Clear Students" },
];

const overdueSortOptions = [
  { value: "high-to-low", label: "Fine High to Low" },
  { value: "low-to-high", label: "Fine Low to High" },
];

function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { studentSummaries, clearFineForRecord, returnIssuedRecord } =
    useLibrary();
  const [expandedStudent, setExpandedStudent] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(() => {
    const initialFilter = searchParams.get("status");
    return studentFilterOptions.some((option) => option.value === initialFilter)
      ? initialFilter
      : "All";
  });
  const [overdueSortOrder, setOverdueSortOrder] = useState(() => {
    const initialSort = searchParams.get("sort");
    return overdueSortOptions.some((option) => option.value === initialSort)
      ? initialSort
      : "high-to-low";
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    const visibleStudents = studentSummaries.filter((member) => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        (member.rollNumber ?? "").toLowerCase().includes(term) ||
        member.history.some(
          (record) =>
            record.title.toLowerCase().includes(term) ||
            record.bookCode.toLowerCase().includes(term),
        );

      const matchesFilter =
        statusFilter === "All" ||
        (statusFilter === "Borrowing" &&
          member.activeBooks.some(
            (record) => record.liveStatus === "Borrowed",
          )) ||
        (statusFilter === "Overdue" && member.status === "Overdue") ||
        (statusFilter === "Clear" && member.status === "Clear");

      return matchesSearch && matchesFilter;
    });

    // Sort by creation date (newest first) by default
    const sorted = [...visibleStudents].sort((first, second) => {
      const firstCreated = new Date(first.createdAt ?? 0).getTime();
      const secondCreated = new Date(second.createdAt ?? 0).getTime();
      return secondCreated - firstCreated;
    });

    // Apply additional sorting for overdue filter
    if (statusFilter === "Overdue") {
      return sorted.sort((first, second) => {
        if (overdueSortOrder === "low-to-high") {
          return first.totalFine - second.totalFine;
        }
        return second.totalFine - first.totalFine;
      });
    }

    return sorted;
  }, [overdueSortOrder, search, statusFilter, studentSummaries]);

  useEffect(() => {
    const nextParams = {};
    if (statusFilter !== "All") {
      nextParams.status = statusFilter;
    }
    if (statusFilter === "Overdue") {
      nextParams.sort = overdueSortOrder;
    }
    setSearchParams(nextParams, { replace: true });
  }, [overdueSortOrder, setSearchParams, statusFilter]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const triggerToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const buildCsv = () => {
    const rows = [
      [
        "S.No",
        "Student Name",
        "Email",
        "Student ID",
        "Department",
        "Stream",
        "Year",
        "Semester",
        "Roll Number",
        "Student Status",
        "Total Fine",
        "Book Title",
        "Book Code",
        "Record Type",
        "Issue Date",
        "Due Date",
        "Fine Cleared",
        "Return Status",
        "Return Date",
      ],
    ];

    let serial = 1;

    filteredStudents.forEach((member) => {
      if (!member.history.length) {
        rows.push([
          String(serial++),
          member.name,
          member.email,
          member.studentId ?? "",
          member.department ?? "",
          member.stream ?? "",
          member.academicYear ?? "",
          member.semester ?? "",
          member.rollNumber ?? "",
          member.status,
          String(member.totalFine),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        return;
      }

      member.history.forEach((record) => {
        rows.push([
          String(serial++),
          member.name,
          member.email,
          member.studentId ?? "",
          member.department ?? "",
          member.stream ?? "",
          member.academicYear ?? "",
          member.semester ?? "",
          member.rollNumber ?? "",
          member.status,
          String(member.totalFine),
          record.title,
          record.bookCode,
          record.recordType,
          record.issueLabel,
          record.dueLabel,
          record.fineCleared ? "Yes" : "No",
          record.returnedOn ? "Returned" : "Pending",
          record.returnedOnLabel ?? "",
        ]);
      });
    });

    return rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
  };

  const exportCsv = () => {
    const csvContent = buildCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link=document.createElement("a")
    const url=URL.createObjectURL(blob)
    link.href=url;
    link.download=`student-${statusFilter.toLowerCase()}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url) 
  };
  const handleConfirm=async ()=>{
    if(!confirmAction) return;
    if(confirmAction.type === "clear-fine"){
      const result=await clearFineForRecord(confirmAction.payload);
      if(result?.ok){
        triggerToast("Fine cleared Successfully")
      }else{
        triggerToast("Failed to clear the fine ,please try later","error")
      }
    }
    if(confirmAction.type === "return-book"){
      const result=await returnIssuedRecord(confirmAction.payload);
      if(result?.ok){
        triggerToast("Book returned successfully")
      }else{
        triggerToast("Failed to return the book please try later","error")
      }
    }
    setConfirmAction(null)
  }
  return (
    
  );
}

export default AdminUsersPage;
