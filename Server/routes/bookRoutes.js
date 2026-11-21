import express from "express"
import { authenticationToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { applyFine, clearFine, getFineSettings, getIssues, getStudentIssues, issueManualBooks, returnBook, updateFineSettings } from "../controllers/bookController.js";

const bookRouter= express.Router()

bookRouter.get('/fine-settings',authenticationToken,getFineSettings)
bookRouter.get('/issue/student',authenticationToken,authorizeRoles("user"),getStudentIssues)


//admin
bookRouter.get('/issues',authenticationToken,authorizeRoles("admin"),getIssues)
bookRouter.post('/issue-manual',authenticationToken,authorizeRoles("admin"),issueManualBooks)

bookRouter.put('/issues/:id/return',authenticationToken,authorizeRoles("admin"),returnBook)
bookRouter.put('/issues/:id/fine',authenticationToken,authorizeRoles("admin"),applyFine)
bookRouter.put('/issues/:id/clear-fine',authenticationToken,authorizeRoles("admin"),clearFine)
bookRouter.put('/fine-settings',authenticationToken,authorizeRoles("admin"),updateFineSettings)

export default bookRouter


