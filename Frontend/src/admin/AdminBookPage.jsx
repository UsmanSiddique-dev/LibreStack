import React from "react";
import { adminBooksPageStyles as s } from "../assets/Styles";
import { useLibrary } from "../shared/LibraryContext";
import { useState, useRef } from "react";
import { useEffect } from "react";

const getTodayIso = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const createBookDraft = () => ({
  id: `draft-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  title: "",
  bookCode: "",
  issuedOn: getTodayIso(),
  dueDate: "",
});
const createInitialForm = () => ({
  studentName: "",
  userEmail: "",
  department: "",
  stream: "",
  academicYear: "",
  semester: "",
  rollNumber: "",
  books: [createBookDraft()],
});

function AdminBookPage() {
  const { issueManualBooksToStudent, fineSettings } = useLibrary();
  const [issueForm, setIssueForm] = useState(createInitialForm);
  const [formMessage, setFormMessage] = useState("");
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchError, setSearchError] = useState("");
  const searchTimeoutRef = useRef(null);
  // can select or unselect a student also we can search the student by roll no
  const isStudentSelected = Boolean(selectedStudent);
  const canSearchRoll =
    issueForm.rollNumber.trim().length > 0 && !isStudentSelected;

  useEffect(() => {
    if (!canSearchRoll) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        setSearchError("");
        const response = await fetch(
          `http://localhost:5000/api/students/search-by-roll?roll=${encodeURIComponent(
            issueForm.rollNumber.trim(),
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("library-auth-token")}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setMatchingStudents(data.students || []);
        } else {
          setMatchingStudents([]);
          setSearchError(
            data.message || "Unable to search students by roll number.",
          );
        }
      } catch (error) {
        console.error("Student roll search error:", error);
        setMatchingStudents([]);
        setSearchError("Unable to fetch matching students.");
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [issueForm.rollNumber, canSearchRoll]);

  //   to unselect a student
  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setMatchingStudents([]);
    setSearchError("");
    setIssueForm((current) => ({
      ...current,
      studentName: "",
      userEmail: "",
      department: "",
      stream: "",
      academicYear: "",
      semester: "",
      rollNumber: "",
    }));
  };
  //   to select a student
  const selectStudent = (student) => {
    setFormMessage("");
    setSearchError("");
    setMatchingStudents([]);
    setSelectedStudent(student);
    setIssueForm((current) => ({
      ...current,
      studentName: student.name,
      userEmail: student.email,
      department: student.department || "",
      stream: student.stream || "",
      academicYear: student.academicYear || "",
      semester: student.semester || "",
      rollNumber: student.rollNumber || "",
    }));
  };

  const handleIssueChange = (event) => {
    const { name, value } = event.target;
    setFormMessage("");
    if (name == "rollNumber") {
      setSelectedStudent(null);
      setMatchingStudents([]);
      setSearchError("");
      setIsSearching(Boolean(value.trim()));
      setIssueForm((current) => ({
        ...current,
        [name]: value,
      }));
    }
  };
  const handleBookChange = (bookId, field, value) => {
    setFormMessage("");
    setIssueForm((current) => ({
      ...current,
      books: current.books.map((book) =>
        book.id === bookId ? { ...book, [field]: value } : book,
      ),
    }));
  };
  const addBookDraft = () => {
    setIssueForm((current) => ({
      ...current,
      books: [...current, createBookDraft()],
    }));
  };
  const removeBookDraft = (bookId) => {
    setIssueForm((current) => ({
      ...current,
      books:
        current.books.length > 1
          ? current.books.filter((book) => book.id !== bookId)
          : current.books,
    }));
  };
  const handleIssueSubmit = async (event) => {
    event.preventDefault();
    if (!issueForm.userEmail) {
      setFormMessage(
        "Search and select a student by role Number before issuing books",
      );
      return
    }
    const result=await issueManualBooksToStudent({
        userEmail:issueForm.userEmail,
        studentDetails:issueForm,
        books:issueForm.books
    })
    if(!result.ok){
        setFormMessage(result.error ?? "Unable to issue books right now");
        return;
    }
    setFormMessage(`${result.count} manual book records(s) issued successfully`);
    setIssueForm(createInitialForm());
    setSelectedStudent(null);
    setMatchingStudents([])
    setSearchError("")
  };

  return (
    <div className={s.pageContainer}>
      <section className={s.mainSection}>
        <div className={s.innerContainer}>
          <div className={s.headerFlex}>
            <div>
              <h2 className={s.title}>Issue Book to Student</h2>
              <p className={s.subtitle}>
                Select a Student, add manual book entries with book code, and
                the active overdue fine rule will be used automatically after
                the due date.
              </p>
            </div>
            <div className={s.fineRuleBadge}></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminBookPage;
