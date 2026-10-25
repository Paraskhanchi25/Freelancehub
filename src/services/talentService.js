import initialFreelancers from "../data/freelancers.json";
import { authService } from "./authService";
import "./storageCleanup";

const API_BASE = "/api/freelancers";

// In-memory fallback if the backend API is temporarily unreachable
let memoryFreelancers = [...initialFreelancers];

export const talentService = {
  async getFreelancers() {
    let list = [];
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        list = await res.json();
      } else {
        list = [...memoryFreelancers];
      }
    } catch {
      list = [...memoryFreelancers];
    }

    // Also include registered users who signed up as freelancers
    try {
      const users = await authService.getUsers();
      const registeredFreelancers = users.filter((u) => u.role === "freelancer");

      for (const rf of registeredFreelancers) {
        const alreadyExists = list.some(
          (f) => String(f.id) === String(rf.id) || f.name.toLowerCase() === rf.name.toLowerCase()
        );
        if (!alreadyExists) {
          list.push({
            id: rf.id,
            name: rf.name,
            role: rf.title || "Freelancer",
            primarySkill: rf.skills?.[0] || "Web Development",
            description: rf.bio || "Experienced freelance professional available for hire.",
            rating: rf.rating || "5.0",
            earned: rf.earned || "₹0",
            rate: rf.hourlyRate || "800",
            skills: Array.isArray(rf.skills) && rf.skills.length ? rf.skills : ["Web Development"],
            completedProjects: rf.completedProjects || 0,
            experience: rf.experience || "2 yrs",
            distanceKm: 5,
            availability: rf.availability || "Available now",
            image: rf.avatar || "/assets/Myself.jpeg",
          });
        }
      }
    } catch {
      // Ignore user blend error
    }

    return list;
  },

  async getFreelancerById(id) {
    const all = await this.getFreelancers();
    const cleanId = String(id).replace(/^usr-/, "");
    return (
      all.find(
        (p) =>
          String(p.id) === String(id) ||
          String(p.id).replace(/^usr-/, "") === cleanId
      ) || null
    );
  },

  async createFreelancer(talentData) {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(talentData),
      });
      if (res.ok) {
        const created = await res.json();
        memoryFreelancers = [created, ...memoryFreelancers];
        return created;
      }
    } catch {
      // Fallback
    }

    const newPerson = {
      id: Date.now().toString(),
      ...talentData,
      rating: talentData.rating || "5.0",
      earned: talentData.earned || "₹0",
      completedProjects: 0,
      availability: talentData.availability || "Available now",
    };
    memoryFreelancers = [newPerson, ...memoryFreelancers];
    return newPerson;
  },

  async updateFreelancer(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        const updated = await res.json();
        memoryFreelancers = memoryFreelancers.map((p) =>
          String(p.id) === String(id) ? { ...p, ...updated } : p
        );
        return updated;
      }
    } catch {
      // Fallback
    }

    let updatedPerson = null;
    memoryFreelancers = memoryFreelancers.map((p) => {
      if (String(p.id) === String(id)) {
        updatedPerson = { ...p, ...updatedFields };
        return updatedPerson;
      }
      return p;
    });
    return updatedPerson;
  },

  async deleteFreelancer(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        memoryFreelancers = memoryFreelancers.filter((p) => String(p.id) !== String(id));
        return true;
      }
    } catch {
      // Fallback
    }

    memoryFreelancers = memoryFreelancers.filter((p) => String(p.id) !== String(id));
    return true;
  },
};
