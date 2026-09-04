import { createProjectSchema, getProjectSchema, proposalSchema } from "@repo/validation"
import type {Request ,Response} from "express"
import { prisma } from "@repo/db";
import { AuthRequest } from "./middleware/authMiddleware.js";

export async function createProject(req:AuthRequest,res:Response):Promise<void> {
    const project = createProjectSchema.safeParse(req.body);

    if(!project.success){
        res.status(400).json({error:"incorrect input"});
        return;
    }
    const {title,description,budgetMin,budgetMax,deadline,category} =project.data

    if(!req.userId){
        res.status(401).json({error:"not authorized"});
        return
    }

    try {
    const user = await prisma.user.findUnique({
        where: { 
            id: req.userId 
        }
    });

    if(!user){
        res.status(400).json({ error: "user not found" });
        return
    }

    if (user.role !== "client") {
      res.status(403).json({ error: "only clients can create projects" });
      return;
    }

        const project_data = await prisma.project.create({
            data:{
                title,
                description,
                category,
                budgetMin,
                budgetMax,
                deadline,
                clientId:req.userId
            }
        })
        res.status(201).json({project_data});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"internal server error"})
    }
}


export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  const project = getProjectSchema.safeParse(req.query);
  if (!project.success) {
    res.status(400).json({ error: "invalid input"});
    return;
  }

  const { category, minBudget, maxBudget } = project.data;

  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "open",
        category,
        ...(minBudget !== undefined && { budgetMax: { gte: minBudget } }),
        ...(maxBudget !== undefined && { budgetMin: { lte: maxBudget } }),
      },
      include:{
        _count:{
          select:{proposals:true}
        }
      }
    });
    
    const result = projects.map((data) => ({
      id:           data.id,
      title:        data.title,
      description:  data.description,
      category:     data.category,
      budgetMin:    data.budgetMin,
      budgetMax:    data.budgetMax,
      deadline:     data.deadline,
      status:       data.status,
    }));

    res.status(200).json({ projects: result});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
}


export async function createProposal(req:AuthRequest,res:Response):Promise<void>{
  const {projectId} = req.params;

  if(typeof projectId !=="string"){
    res.status(400).json({error:"invalid prpoject id"});
    return
  }
  const proposal = proposalSchema.safeParse(req.body);
  if(!proposal.success){
    res.status(400).json({error:"invalid input"})
    return;
  }
  const {coverLetter,proposedPrice,estimatedDuration} =proposal.data;
  if(!req.userId){
    res.status(401).json({error:"not authorazied"})
    return
  }
  try{
    const user = await prisma.user.findUnique({
      where:{id:req.userId}
    })
    
    if(!user){
      res.status(400).json({error:"user not found"})
      return
    }

    if (user.role !== "freelancer") {
      res.status(403).json({ error: "only freelancers can submit proposals" });
      return;
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({ error: "project not found" });
      return;
    }

    if (project.status !== "open") {
      res.status(400).json({ error: "this project is not open for proposals" });
      return;
    }
        const proposal_data = await prisma.proposal.create({
      data: {
        coverLetter,
        proposedPrice,
        estimatedDuration:String(estimatedDuration),
        freelancerId: req.userId,
        projectId,
      },
    });
    res.status(201).json({ proposal_data });

  }catch(err){
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }

}



export async function getProjectProposals(req: AuthRequest, res: Response): Promise<void> {
  const { projectId } = req.params;
    
  if (typeof projectId !== "string") {
    res.status(400).json({ error: "invalid project id" });
    return;
    }

  if (!req.userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId 
        } 
    });

    if (!project) {
      res.status(404).json({ error: "project not found" });
      return;
    }

    if (project.clientId !== req.userId) {
      res.status(403).json({ error: "you do not own this project" });
      return;
    }

    const proposals = await prisma.proposal.findMany({
      where: { id:projectId },
      include: {
        freelancer: { 
            select: { name: true } 
        },
      },
    });

    const result = proposals.map((data) => ({
      proposalId:        data.id,
      freelancerId:      data.freelancerId,
      freelancerName:    data.freelancer.name,
      coverLetter:       data.coverLetter,
      proposedPrice:     data.proposedPrice,
      estimatedDuration: data.estimatedDuration,
      status:            data.status,
      createdAt:         data.createdAt,
    }));

    res.status(200).json({ proposals: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
}


export async function acceptProposal(req: AuthRequest, res: Response): Promise<void> {
  const { proposalId } = req.params;

  if (!req.userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  if (typeof proposalId !== "string") {
    res.status(400).json({ error: "invalid proposal id" });
    return;
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { 
        id: proposalId
      },
      include: {
        project: true 
      },
    });

    if (!proposal) {
      res.status(404).json({ error: "proposal not found" });
      return;
    }

    if (proposal.project.clientId !== req.userId) {
      res.status(403).json({ error: "you do not own this project" });
      return;
    }

    const result = await prisma.$transaction(async (db) => {
      const acceptedProposal = await db.proposal.update({
        where: { 
            id: proposalId
        },
        data: { 
            status: "accepted"
        },
      });

      await db.proposal.updateMany({
        where: {
          projectId: proposal.projectId,
          
          id: { 
            not: proposalId
            },
        },
        data: { 
            status: "rejected"
        },
      });

      await db.project.update({
        where: { 
            id: proposal.projectId
        },
        data: { 
            status: "in_progress"
        },
      });

      const contract = await db.contract.create({
        data: {
          projectId:    proposal.projectId,
          clientId:     proposal.project.clientId,
          freelancerId: proposal.freelancerId,
          proposalId:   acceptedProposal.id,
          
          status: "active",
        },
      });

      return { acceptedProposal, contract };
    });

    res.status(200).json({
      message: "proposal accepted, contract created",
      proposal: result.acceptedProposal,
      contract: result.contract,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
}