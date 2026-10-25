import initialJobs from "../data/jobs.json";
import "./storageCleanup";

const API_BASE = "/api/jobs";

// In-memory fallback if the backend API is temporarily unreachable
let memoryJobs = [...initialJobs];

export const jobService = {
  // READ ALL (GET /api/jobs)
  async getJobs() {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not reachable, fallback to memory
    }
    return [...memoryJobs];
  },

  // READ ONE (GET /api/jobs/:id)
  async getJobById(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API not reachable, fallback to memory
    }
    return memoryJobs.find((j) => String(j.id) === String(id)) || null;
  },

  // GET JOBS FOR A SPECIFIC CLIENT
  async getJobsByClient(clientId, clientEmail, clientName) {
    const all = await this.getJobs();
    return all.filter((j) => {
      if (clientId && String(j.clientId) === String(clientId)) return true;
      if (
        clientEmail &&
        j.clientEmail &&
        j.clientEmail.toLowerCase() === clientEmail.toLowerCase()
      )
        return true;
      if (
        clientName &&
        j.client &&
        j.client.toLowerCase() === clientName.toLowerCase()
      )
        return true;
      return false;
    });
  },

  // CREATE (POST /api/jobs)
  async createJob(jobData) {
    const payload = {
      ...jobData,
      title: jobData.title?.trim() || "Untitled Job",
      category: jobData.category?.trim() || "Web Development",
      description: jobData.description?.trim() || "",
      budget: jobData.budget ? String(jobData.budget).trim() : "0",
      skills: Array.isArray(jobData.skills)
        ? jobData.skills
        : typeof jobData.skills === "string"
        ? jobData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      status: jobData.status || "Active",
      clientId: jobData.clientId || "",
      clientEmail: jobData.clientEmail || "",
      client: jobData.client?.trim() || "Client",
      clientAvatar: jobData.clientAvatar || "",
      image: jobData.image || "",
      location: jobData.location || "Remote",
      proposals: Number(jobData.proposals) || 0,
      posted: "Just now",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        memoryJobs = [created, ...memoryJobs];
        return created;
      }
    } catch {
      // API not reachable, fallback to memory
    }

    // Fallback implementation
    const newJob = {
      id: Date.now().toString(),
      ...payload,
    };
    memoryJobs = [newJob, ...memoryJobs];
    return newJob;
  },

  // UPDATE (PUT /api/jobs/:id)
  async updateJob(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const updated = await res.json();
        memoryJobs = memoryJobs.map((j) =>
          String(j.id) === String(id) ? { ...j, ...updated } : j
        );
        return updated;
      }
    } catch {
      // API not reachable, fallback to memory
    }

    // Fallback implementation
    let updatedJob = null;
    memoryJobs = memoryJobs.map((j) => {
      if (String(j.id) === String(id)) {
        updatedJob = {
          ...j,
          ...updatedFields,
          id: j.id,
          skills: Array.isArray(updatedFields.skills)
            ? updatedFields.skills
            : typeof updatedFields.skills === "string"
            ? updatedFields.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : j.skills,
          updatedAt: new Date().toISOString(),
        };
        return updatedJob;
      }
      return j;
    });
    return updatedJob;
  },

  // INCREMENT PROPOSAL COUNT
  async incrementProposalCount(jobId) {
    const job = await this.getJobById(jobId);
    if (job) {
      const nextCount = (Number(job.proposals) || 0) + 1;
      return await this.updateJob(jobId, { proposals: nextCount });
    }
  },

  // DELETE (DELETE /api/jobs/:id)
  async deleteJob(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        memoryJobs = memoryJobs.filter((j) => String(j.id) !== String(id));
        return true;
      }
    } catch {
      // API not reachable, fallback to memory
    }

    memoryJobs = memoryJobs.filter((j) => String(j.id) !== String(id));
    return true;
  },
};
