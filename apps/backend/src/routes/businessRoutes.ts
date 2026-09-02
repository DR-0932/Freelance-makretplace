import { Router } from "express";
import { authMiddleware } from "../controllers/middleware/authMiddleware.js";
import { createProject, getProjects, getProjectProposals, acceptProposal } from "../controllers/businessControllers.js";

const business_router: Router = Router();

business_router.post('/projects', authMiddleware, createProject);
business_router.get('/projects', getProjects);
business_router.get('/projects/:projectId/proposals', authMiddleware, getProjectProposals);
business_router.post('/proposals/:proposalId/accept', authMiddleware, acceptProposal);

export default business_router;