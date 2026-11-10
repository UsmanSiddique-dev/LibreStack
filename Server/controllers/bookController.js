import Issue from "../models/Issue.js";
import User from "../models/User.js";
import FineSetting from "../models/fineSettings";
import {
  getLocalIsoDate,
  calculateFine,
  getDiffInDays,
  getOverdueUnits,
  getStartOfDay,
} from "../Utils/book.util.js";

// Issue A manual Book
export async function issueManualBooks(req, res) {
  try {
    const { studentDetails, books } = req.body;
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        message: "No Books were Found",
      });
    }
    const student = await User.findOne({
      rollNo: studentDetails.rollNumber,
    });
    if (!student) {
      res.status(400).json({
        success: false,
        message: "Student not Found",
      });
    }
    const todayIso = getLocalIsoDate();
    const validbooks = books.filter((b) => b.title && b.bookCode && b.dueDate);
    if (validbooks.length === 0) {
      return res.status(400).json({
        message:
          "Please add at least one valid manual book entry with book code and a due Date",
      });
    }
    const createdIssues = await Promise.all(
      validBooks.map((book) =>
        Issue.create({
          source: "manual",
          bookCode: book.bookCode.trim(),
          title: book.title.trim(),
          userEmail: student.email,
          userName: student.name,
          issuedOn: todayIso,
          dueDate: book.dueDate,
          returnedOn: null,
          fineRate: Number(book.fineRate ?? req.body.fineRate ?? 10),
          fineInterval: book.fineInterval ?? req.body.fineInterval ?? "day",
          manualFine: 0,
          fineCleared: false,
          clearedFineAmount: 0,
          department:
            studentDetails.department?.trim() ||
            student.department ||
            "General",
          stream: studentDetails.stream?.trim() || student.stream || "General",
          year:
            studentDetails.academicYear?.trim() || student.year || "1st Year",
          semester:
            studentDetails.semester?.trim() || student.semester || "Semester 1",
          rollNumber:
            studentDetails.rollNumber?.trim() ||
            student.rollNo ||
            "Not assigned",
          studentId: student.rollNo || `ST-${student._id.toString().slice(-4)}`,
        }),
      ),
    );
    res.status(201).json({
      success: true,
      message: `${createdIssues.length} manual books issued succesfully`,
      count: createdIssues.length,
      issues: createdIssues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Issueing manual Books",
    });
  }
}
export async function getIssues(req, res) {
  try {
    const issues = await Issue.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Fetching Issues",
    });
  }
}

export async function getStudentIssues(req, res) {
  try {
    const issues = await Issue.find({
      userEmail: req.user.email.toLowerCase().trim(),
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching student issues",
    });
  }
}

export async function returnBook(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(400).json({
        message: "Issue Record not found",
      });
    }
    if (issue.returnedOn) {
      return res.status(400).json({
        message: "Book already Returned",
      });
    }
    issue.returnedOn = getLocalIsoDate();
    await issue.save();
    res.status(200).json({
      success: true,
      message: "book returned successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error returning manual Books",
    });
  }
}
export async function applyFine(req, res) {
  try {
    const fineAmount= Number(req.body.amount)
    if(Number.isNaN((fineAmount))){
      return res.status(400).json({
        message:"Invalid fine amound"
      })

    }
     const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(400).json({
        message: "Issue Record not found",
      });
    }
    issue.manualfine= fineAmount
    if(fineAmount > 0){
      issue.fineCleared=false

    }
    res.status(200).json({
      success:true,
      message:"Manual fine applied successfully",
      issue
    })
  } catch (error) {
   console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Applying Fine",
    });
  }
}

// Clear the Manual fine
export async function clearFine(req,res){
    try {
      const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(400).json({
        message: "Issue Record not found",
      });
    }
     Object.assign(issue,{
        manualfine:0,
        fineCleared:true,
        clearedFineAmount:calculateFine(issue,issue.fineRate,issue.fineInterval)

      })
      await issue.save()
      res.status(200).json({
        succcess:true,
        message:"Fine Cleared Successfully",
        issue
      })
    } catch (error) {
      console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Clearing Fine",
    });
    }
}

// Get Active fine Settings
export async function getFineSettings(req,res) {
  try {
    const settings= (await FineSetting.findOne({}) || (await FineSetting.create({
      amount:10,
      interval:"day"
    })))
    res.status(200).json({
      succcess:true,
      settings
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Fetching fine Settings",
    });
  }
  
}
