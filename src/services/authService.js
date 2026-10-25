import initialUsers from "../data/users.json";
import "./storageCleanup";

const API_BASE = "/api/users";
const SESSION_KEY = "freelancehub_current_user";

// In-memory fallback if the backend API is temporarily unreachable
let memoryUsers = [...initialUsers];
let memorySession = null;

// Safe session setter that handles storage gracefully
function safeSetSession(sessionData) {
  memorySession = sessionData;

  // Trim excessively large base64 avatars if present to keep storage compact
  let toStore = sessionData;
  if (sessionData && sessionData.avatar && sessionData.avatar.length > 150000) {
    toStore = { ...sessionData, avatar: "" };
  }

  const serialized = JSON.stringify(toStore);

  try {
    localStorage.setItem(SESSION_KEY, serialized);
  } catch (err) {
    console.warn("Storage quota warning on session set, attempting fallback:", err);
    try {
      sessionStorage.setItem(SESSION_KEY, serialized);
    } catch {
      console.warn("Web storage exhausted. Active session retained in memory.");
    }
  }
}

function safeGetSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return memorySession;
}

function safeRemoveSession() {
  memorySession = null;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}

export const authService = {
  // Get all registered users
  async getUsers() {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...memoryUsers];
  },

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find((u) => String(u.id) === String(id)) || null;
  },

  // Log in with email and password
  async login(email, password) {
    const users = await this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password.");
    }

    if (found.status === "Suspended") {
      throw new Error("Your account has been suspended by an administrator.");
    }

    // Save complete active session
    const sessionData = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role || "client",
      title:
        found.title ||
        (found.role === "admin"
          ? "Platform Administrator"
          : found.role === "client"
          ? "Client Account"
          : "Freelancer"),
      avatar: found.avatar || "",
      company:
        found.company || (found.role === "client" ? "Independent Client" : "Freelance"),
      bio: found.bio || "",
      skills: Array.isArray(found.skills) ? found.skills : [],
      hourlyRate: found.hourlyRate || "",
      location: found.location || "",
      phone: found.phone || "",
      website: found.website || "",
      experience: found.experience || "",
      availability: found.availability || "Available now",
      profileCompleted: Boolean(found.profileCompleted),
      status: found.status || "Active",
      createdAt: found.createdAt || new Date().toISOString(),
    };

    safeSetSession(sessionData);
    return sessionData;
  },

  // Register a new user and save to data/users.json
  // ONLY Client and Freelancer accounts can be created via registration
  async signup(userData) {
    const users = await this.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error("An account with this email already exists. Please log in.");
    }

    if (userData.role === "admin") {
      throw new Error(
        "Administrator accounts cannot be registered publicly. Please sign in with existing administrator credentials."
      );
    }

    // Role must strictly be either 'client' or 'freelancer'
    const finalRole = userData.role === "freelancer" ? "freelancer" : "client";

    const newUser = {
      id: "usr-" + Date.now().toString(),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: finalRole,
      title:
        userData.title?.trim() ||
        (finalRole === "client" ? "Client Account" : "Freelancer"),
      avatar: userData.avatar || "",
      company:
        userData.company?.trim() ||
        (finalRole === "client" ? "Independent Client" : "Freelance"),
      bio: userData.bio || "",
      skills: Array.isArray(userData.skills)
        ? userData.skills
        : typeof userData.skills === "string"
        ? userData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      hourlyRate: userData.hourlyRate || "",
      location: userData.location || "",
      phone: userData.phone || "",
      website: userData.website || "",
      experience: userData.experience || "",
      availability: "Available now",
      profileCompleted: false, // Default to false so onboarding triggers!
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const created = await res.json();
        memoryUsers = [created, ...memoryUsers];
      } else {
        memoryUsers = [newUser, ...memoryUsers];
      }
    } catch {
      memoryUsers = [newUser, ...memoryUsers];
    }

    // Automatically establish session
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      avatar: newUser.avatar,
      company: newUser.company,
      bio: newUser.bio,
      skills: newUser.skills,
      hourlyRate: newUser.hourlyRate,
      location: newUser.location,
      phone: newUser.phone,
      website: newUser.website,
      experience: newUser.experience,
      availability: newUser.availability,
      profileCompleted: newUser.profileCompleted,
      status: newUser.status,
      createdAt: newUser.createdAt,
    };
    safeSetSession(sessionData);
    return sessionData;
  },

  // Update existing user profile
  async updateUser(id, updatedFields) {
    // Role is immutable: a user cannot acquire or change their role through profile update
    const sanitizedFields = { ...updatedFields };
    delete sanitizedFields.role;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedFields),
      });

      if (res.ok) {
        const updated = await res.json();
        memoryUsers = memoryUsers.map((u) =>
          String(u.id) === String(id) ? { ...u, ...updated } : u
        );

        // Update active session if updating self
        const currentSession = this.getCurrentUser();
        if (currentSession && String(currentSession.id) === String(id)) {
          const newSession = { ...currentSession, ...updated };
          safeSetSession(newSession);
        }

        return updated;
      }
    } catch {
      // Fallback
    }

    let updatedUser = null;
    memoryUsers = memoryUsers.map((u) => {
      if (String(u.id) === String(id)) {
        updatedUser = {
          ...u,
          ...updatedFields,
          id: u.id,
          updatedAt: new Date().toISOString(),
        };
        return updatedUser;
      }
      return u;
    });

    const currentSession = this.getCurrentUser();
    if (currentSession && String(currentSession.id) === String(id)) {
      const newSession = { ...currentSession, ...updatedFields };
      safeSetSession(newSession);
    }

    return updatedUser;
  },

  // Delete user (Admin only)
  async deleteUser(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        memoryUsers = memoryUsers.filter((u) => String(u.id) !== String(id));
        return true;
      }
    } catch {
      // Fallback
    }

    memoryUsers = memoryUsers.filter((u) => String(u.id) !== String(id));
    return true;
  },

  // Get currently logged-in user from session
  getCurrentUser() {
    return safeGetSession();
  },

  // Logout
  logout() {
    safeRemoveSession();
  },
};
