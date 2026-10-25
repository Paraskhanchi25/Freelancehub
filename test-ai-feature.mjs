import { aiBlueprintService } from "./src/services/aiBlueprintService.js";
import { pdfExportService } from "./src/services/pdfExportService.js";
import fs from "fs";

console.log("=== Testing FreelanceHub AI Feature ===");

// 1. Verify .env and .env.example
console.log("\n[Test 1] Checking .env and .env.example files...");
if (fs.existsSync(".env")) {
  console.log("✔ .env file exists");
} else {
  throw new Error("Missing .env file");
}

if (fs.existsSync(".env.example")) {
  console.log("✔ .env.example file exists");
} else {
  throw new Error("Missing .env.example file");
}

// 2. Test Blueprint Generation from Custom Idea
console.log("\n[Test 2] Generating blueprint from custom idea...");
const testIdea = {
  title: "AI-Powered Real Estate Escrow & 3D Tour Engine",
  category: "Web Development",
  description: "Virtual 3D property walkthroughs with automated blockchain-escrow smart contracts, instant KYC verification, and agent video chat.",
  platform: "Full-Stack Web & Mobile",
  architectureStyle: "Modular Decoupled Tier Architecture",
  budget: "85,000",
};

const blueprint = await aiBlueprintService.generateBlueprint(testIdea);
console.log("✔ Blueprint generated successfully!");
console.log("  - Title:", blueprint.title);
console.log("  - Category:", blueprint.category);
console.log("  - Engine:", blueprint.engine);
console.log("  - Tech Stack:", Object.keys(blueprint.techStack || {}));
console.log("  - Architecture Tiers:", blueprint.systemArchitecture?.tiers?.length || 0);
console.log("  - User Flow Steps:", blueprint.userFlow?.length || 0);
console.log("  - Data Flow Steps:", blueprint.dataFlow?.length || 0);
console.log("  - Directory Files:", blueprint.directoryStructure?.length || 0);
console.log("  - DB Tables:", blueprint.databaseSchema?.map(t => t.tableName) || []);
console.log("  - API Endpoints:", blueprint.apiEndpoints?.length || 0);
console.log("  - Milestones:", blueprint.milestones?.length || 0);
console.log("  - Team Roles:", blueprint.teamRecommendations?.map(r => r.role) || []);

// 3. Test PDF Generation
console.log("\n[Test 3] Testing PDF Blueprint Generation...");
const filename = pdfExportService.exportBlueprintToPdf(blueprint);
console.log("✔ PDF generated successfully! Filename:", filename);

// 4. Test Blueprint Generation from Existing Job
console.log("\n[Test 4] Testing blueprint from existing job object...");
const sampleJob = {
  id: "job-101",
  title: "Cloud Native Microservices Platform",
  category: "Cloud Architecture & DevOps",
  description: "High-scale Kubernetes cluster deployment with Istio service mesh and Prometheus monitoring.",
  skills: ["Kubernetes", "Docker", "Go", "AWS", "Terraform"],
  budget: "95,000",
};

const jobBlueprint = await aiBlueprintService.generateBlueprintFromJob(sampleJob);
console.log("✔ Job Blueprint generated successfully!");
console.log("  - Title:", jobBlueprint.title);
console.log("  - Category:", jobBlueprint.category);
console.log("  - Duration:", jobBlueprint.estimatedDuration);

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
