import initialProposals from "../data/proposals.json";
import { jobService } from "./jobService";
import "./storageCleanup";

const API_BASE = "/api/proposals";

// In-memory fallback if the backend API is temporarily unreachable
let memoryProposals = [...initialProposals];

export const proposalService = {
  async getProposals() {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...memoryProposals];
  },

  async getProposalById(id) {
    const all = await this.getProposals();
    return all.find((p) => String(p.id) === String(id)) || null;
  },

  async getProposalsByJobId(jobId) {
    const all = await this.getProposals();
    return all.filter((p) => String(p.jobId) === String(jobId));
  },

  async getProposalsByFreelancer(freelancerId, freelancerEmail) {
    const all = await this.getProposals();
    return all.filter((p) => {
      if (freelancerId && String(p.freelancerId) === String(freelancerId)) return true;
      if (
        freelancerEmail &&
        p.freelancerEmail &&
        p.freelancerEmail.toLowerCase() === freelancerEmail.toLowerCase()
      )
        return true;
      return false;
    });
  },

  async getProposalsForClient(clientId, clientEmail, clientJobIds = []) {
    const all = await this.getProposals();
    return all.filter((p) => {
      if (clientId && String(p.clientId) === String(clientId)) return true;
      if (
        clientEmail &&
        p.clientEmail &&
        p.clientEmail.toLowerCase() === clientEmail.toLowerCase()
      )
        return true;
      if (clientJobIds && clientJobIds.includes(String(p.jobId))) return true;
      return false;
    });
  },

  async createProposal(proposalData) {
    const payload = {
      ...proposalData,
      id: "prop-" + Date.now().toString(),
      status: proposalData.status || "Under Review",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        memoryProposals = [created, ...memoryProposals];
        if (payload.jobId) {
          jobService.incrementProposalCount(payload.jobId).catch(() => {});
        }
        return created;
      }
    } catch {
      // Fallback
    }

    memoryProposals = [payload, ...memoryProposals];
    if (payload.jobId) {
      jobService.incrementProposalCount(payload.jobId).catch(() => {});
    }
    return payload;
  },

  async updateProposalStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        memoryProposals = memoryProposals.map((p) =>
          String(p.id) === String(id) ? { ...p, ...updated } : p
        );
        return updated;
      }
    } catch {
      // Fallback
    }

    let updated = null;
    memoryProposals = memoryProposals.map((p) => {
      if (String(p.id) === String(id)) {
        updated = { ...p, status };
        return updated;
      }
      return p;
    });
    return updated;
  },

  async deleteProposal(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        memoryProposals = memoryProposals.filter((p) => String(p.id) !== String(id));
        return true;
      }
    } catch {
      // Fallback
    }

    memoryProposals = memoryProposals.filter((p) => String(p.id) !== String(id));
    return true;
  },
};
