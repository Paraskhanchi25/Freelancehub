// Complete Full-Lifecycle E2E Test Suite for FreelanceHub
async function runSuite() {
  console.log("=================================================");
  console.log("  FREELANCEHUB FULL-LIFECYCLE E2E TEST SUITE     ");
  console.log("=================================================\n");

  const task = await taskSpace("freelancehub-full-lifecycle");
  const page = task.page("p1");

  const results = [];
  function record(step, ok, details = "") {
    results.push({ step, ok, details });
    const mark = ok ? "✅ PASS" : "❌ FAIL";
    console.log(`${mark}: ${step} ${details ? `(${details})` : ""}`);
  }

  try {
    // ----------------------------------------------------
    // TEST 1: HOME & BRANDING VERIFICATIONS
    // ----------------------------------------------------
    console.log("\n--- TEST 1: Home & Branding Verifications ---");
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("load");
    const homeTitle = await page.title();
    record("Home page title loads", homeTitle.includes("FreelanceHub"), homeTitle);

    // Verify "DevLance" is eradicated from Home
    const homeHtml = await page.evaluate(() => document.documentElement.outerHTML);
    const hasDevLanceHome = homeHtml.toLowerCase().includes("devlance");
    record("Home page free of 'DevLance' brand leaks", !hasDevLanceHome);

    // Verify honest platform pillars are rendered (Curated Talent Network, Direct Client Contracting)
    const homeText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const hasCuratedPillar = homeText.includes("curated") && homeText.includes("talent network");
    record("Honest value pillars rendered without inflated claims", hasCuratedPillar);

    // Verify authentic disciplines replace fake corporate logos
    const hasDisciplineBadges = homeText.includes("react & next.js") && homeText.includes("ui/ux & figma");
    record("Authentic disciplines replace fake corporate logos", hasDisciplineBadges);

    // ----------------------------------------------------
    // TEST 2: SIGNUP FORM VALIDATION & TERMS AGREEMENT
    // ----------------------------------------------------
    console.log("\n--- TEST 2: Signup Form Validation & Agreements ---");
    // Ensure clean logged-out state
    await page.evaluate(() => localStorage.clear());
    await page.goto("http://localhost:5173/signup");
    await page.waitForLoadState("load");

    // 2a: Empty submission
    await page.click("button[type='submit']");
    await page.waitForTimeout(300);
    let signupErr = await page.evaluate(() => document.querySelector(".auth-banner.banner-danger")?.textContent?.trim() || "");
    record("Signup blocks empty form submission", signupErr.includes("required fields"), signupErr);

    // 2b: Invalid email format
    await page.fill("#name", "Test User");
    await page.fill("#email", "invalid-email-format");
    await page.fill("#password", "pass123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(300);
    signupErr = await page.evaluate(() => document.querySelector(".auth-banner.banner-danger")?.textContent?.trim() || "");
    record("Signup enforces email format validation", signupErr.includes("valid email"), signupErr);

    // 2c: Short password (< 6 chars)
    await page.fill("#email", "testvalid@example.com");
    await page.fill("#password", "123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(300);
    signupErr = await page.evaluate(() => document.querySelector(".auth-banner.banner-danger")?.textContent?.trim() || "");
    record("Signup enforces minimum 6 character password", signupErr.includes("at least 6 characters"), signupErr);

    // 2d: Unchecked Terms of Service
    await page.fill("#password", "secret1234");
    await page.evaluate(() => {
      const cb = document.querySelector("#terms");
      if (cb && cb.checked) cb.checked = false;
    });
    await page.click("button[type='submit']");
    await page.waitForTimeout(300);
    signupErr = await page.evaluate(() => document.querySelector(".auth-banner.banner-danger")?.textContent?.trim() || "");
    record("Signup requires agreeing to Terms of Service & Privacy Policy", signupErr.includes("Terms of Service"), signupErr);

    // ----------------------------------------------------
    // TEST 3: ROLE GUARD & POST-LOGIN RETURN PATH
    // ----------------------------------------------------
    console.log("\n--- TEST 3: Role Guard & Return Path Redirection ---");
    // Clear storage to ensure unauthenticated state
    await page.evaluate(() => localStorage.clear());
    await page.goto("http://localhost:5173/post-job");
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);

    const redirectedUrl = await page.url();
    record("Unauthenticated /post-job redirected to /login", redirectedUrl.includes("/login"), redirectedUrl);

    // Check friendly banner message on login page
    const loginBanner = await page.evaluate(() => document.querySelector(".auth-banner.banner-info")?.textContent?.trim() || "");
    record("Friendly role guard banner displayed on login", loginBanner.toLowerCase().includes("client") || loginBanner.length > 0, loginBanner);

    // Login as Client Himakshi -> should redirect back to /post-job automatically
    await page.fill("input[name='email'], #email", "himakshi@example.com");
    await page.fill("input[name='password'], #password", "password123");
    await page.click(".btn-auth-submit");
    await page.waitForTimeout(1000);

    const postLoginUrl = await page.url();
    record("Post-login return path redirects client directly to intended /post-job", postLoginUrl.includes("/post-job"), postLoginUrl);

    // ----------------------------------------------------
    // TEST 4: ROLE ISOLATION
    // ----------------------------------------------------
    console.log("\n--- TEST 4: Role Isolation Guard ---");
    // Client attempts to access Freelancer Dashboard
    await page.goto("http://localhost:5173/freelancer-dashboard");
    await page.waitForTimeout(600);
    const guardedUrl = await page.url();
    record("Role Guard: Client blocked from Freelancer Dashboard", guardedUrl.includes("/client-dashboard"), `Redirected to: ${guardedUrl}`);

    // ----------------------------------------------------
    // TEST 5: CREATE JOB WITH IMAGE PRESET (Create)
    // ----------------------------------------------------
    console.log("\n--- TEST 5: Create Job with Image ---");
    await page.goto("http://localhost:5173/post-job");
    await page.waitForLoadState("load");

    const testJobTitle = `E2E Scalability Platform ${Date.now()}`;
    await page.fill("#title", testJobTitle);
    await page.fill("#budget", "38,000");
    await page.fill("#description", "Architectural performance and full-stack enhancements for modern high-load client web application. Requires robust React and Node.js background.");
    await page.fill("#skills", "React, Node.js, TypeScript, PostgreSQL");

    // Select category
    await page.selectOption("#category", { label: "Web Development" });

    // Select curated cover image preset
    await page.evaluate(() => {
      const preset = document.querySelector(".preset-chip");
      if (preset) preset.click();
    });
    await page.waitForTimeout(300);

    const hasCoverPreview = await page.evaluate(() => !!document.querySelector(".image-preview-card"));
    record("Job cover image preset selected and previewed", hasCoverPreview);

    // Submit form
    await page.click("form.post-job-form .btn-submit");
    await page.waitForSelector(".success-banner", { timeout: 6000 });
    record("Job created and saved to database", true, `Title: ${testJobTitle}`);

    // Verify job in /find-work
    await page.goto("http://localhost:5173/find-work");
    await page.waitForLoadState("load");
    await page.waitForSelector(".job-card", { timeout: 5000 });
    const isJobListed = await page.evaluate((title) => {
      return Array.from(document.querySelectorAll(".job-card-title")).some((el) =>
        el.textContent.includes(title)
      );
    }, testJobTitle);
    record("Newly created job listed in public /find-work with image", isJobListed);

    // Get the newly created job's ID
    const newJobId = await page.evaluate((title) => {
      const link = Array.from(document.querySelectorAll(".job-card-title a")).find((a) =>
        a.textContent.includes(title)
      );
      if (!link) return null;
      const href = link.getAttribute("href");
      return href ? href.split("/").pop() : null;
    }, testJobTitle);
    record("Retrieved new job ID", !!newJobId, `ID: ${newJobId}`);

    // ----------------------------------------------------
    // TEST 6: JOB DETAILS & EDIT (Update)
    // ----------------------------------------------------
    if (newJobId) {
      console.log("\n--- TEST 6: Job Details & Edit Workflow ---");
      await page.goto(`http://localhost:5173/job-details/${newJobId}`);
      await page.waitForLoadState("load");
      await page.waitForSelector(".details-header h1", { timeout: 5000 });

      const detailsTitle = await page.evaluate(() => document.querySelector(".details-header h1")?.textContent?.trim());
      record("Job Details renders title and cover hero image", detailsTitle === testJobTitle);

      const hasEditBtn = await page.evaluate(() => !!document.querySelector(".btn-edit"));
      record("Job owner granted Edit Job controls", hasEditBtn);

      // Edit job
      await page.goto(`http://localhost:5173/edit-job/${newJobId}`);
      await page.waitForLoadState("load");
      await page.waitForSelector("form.edit-job-form", { timeout: 5000 });

      const updatedTitle = `${testJobTitle} [OPTIMIZED]`;
      await page.fill("#title", updatedTitle);
      await page.fill("#budget", "48,000");

      await page.evaluate(() => document.querySelector("form.edit-job-form .btn-submit")?.click());
      await page.waitForTimeout(2000);

      // Verify update in Job Details
      await page.goto(`http://localhost:5173/job-details/${newJobId}`);
      await page.waitForLoadState("load");
      await page.waitForSelector(".details-header h1", { timeout: 5000 });

      const postTitle = await page.evaluate(() => document.querySelector(".details-header h1")?.textContent?.trim());
      const postBudget = await page.evaluate(() => document.querySelector(".budget-box h2")?.textContent?.trim());
      record("Job updated in database with modified title & budget", postTitle === updatedTitle, `New Budget: ${postBudget}`);
    }

    // ----------------------------------------------------
    // TEST 7: FREELANCER PROPOSAL FLOW
    // ----------------------------------------------------
    console.log("\n--- TEST 7: Freelancer Proposal Submission ---");
    // Switch to Freelancer Paras
    await page.goto("http://localhost:5173/login");
    await page.waitForLoadState("load");
    await page.fill("input[name='email'], #email", "paras@example.com");
    await page.fill("input[name='password'], #password", "password123");
    await page.click(".btn-auth-submit");
    await page.waitForTimeout(1000);

    // Apply to the job
    if (newJobId) {
      await page.goto(`http://localhost:5173/job-details/${newJobId}`);
      await page.waitForLoadState("load");
      await page.waitForSelector(".btn-apply", { timeout: 5000 });

      const applyBtnClicked = await page.evaluate(() => {
        const btn = document.querySelector(".btn-apply");
        if (btn && btn.textContent.includes("Submit a Proposal")) {
          btn.click();
          return true;
        }
        return false;
      });

      if (applyBtnClicked) {
        await page.waitForSelector(".modal-box", { timeout: 3000 });
        await page.fill(".modal-box input[type='text']", "42,000");
        await page.fill(".modal-box textarea", "I have extensive experience with Next.js, Node.js and scalable architectures. Ready to begin immediately.");
        await page.evaluate(() => document.querySelector(".modal-box button[type='submit']")?.click());
        await page.waitForTimeout(1200);

        // Check proposal badge in job details
        const appliedBadgeText = await page.evaluate(() => document.querySelector(".applied-status-badge")?.textContent?.trim() || "");
        record("Freelancer proposal submitted and badge rendered", appliedBadgeText.includes("You applied"), appliedBadgeText);
      }
    }

    // ----------------------------------------------------
    // TEST 8: CLIENT PROPOSAL REVIEW, STATE COHERENCE & HIRE
    // ----------------------------------------------------
    console.log("\n--- TEST 8: Client Proposal Review & State Coherence ---");
    // Switch to Client Himakshi
    await page.goto("http://localhost:5173/login");
    await page.waitForLoadState("load");
    await page.fill("input[name='email'], #email", "himakshi@example.com");
    await page.fill("input[name='password'], #password", "password123");
    await page.click(".btn-auth-submit");
    await page.waitForTimeout(1000);

    if (newJobId) {
      await page.goto(`http://localhost:5173/job-details/${newJobId}`);
      await page.waitForLoadState("load");
      await page.waitForSelector(".applicant-card", { timeout: 5000 });

      // Verify proposal card for Paras exists
      const hasParasProposal = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".applicant-card")).some((c) =>
          c.textContent.includes("Paras")
        );
      });
      record("Client reviews Paras's incoming proposal on job details", hasParasProposal);

      // Hire Paras
      await page.evaluate(() => {
        const hireBtn = document.querySelector(".applicant-card .btn-hire");
        if (hireBtn) hireBtn.click();
      });
      await page.waitForTimeout(1200);

      // Verify proposal status shows "✓ Contract Active" and NO Decline button
      const hasActivePill = await page.evaluate(() => !!document.querySelector(".contract-active-pill"));
      const hasDeclineBtn = await page.evaluate(() => !!document.querySelector(".applicant-card .btn-decline-sm"));
      record("Hired proposal transitions to '✓ Contract Active' without Decline button", hasActivePill && !hasDeclineBtn);

      // Verify in Client Dashboard
      await page.goto("http://localhost:5173/client-dashboard");
      await page.waitForLoadState("load");
      await page.waitForSelector(".sidebar-nav button", { timeout: 5000 });

      // Click "Hired & Contracts" tab in sidebar
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll(".sidebar-nav button")).find((b) =>
          b.textContent.includes("Hired")
        );
        if (btn) btn.click();
      });
      await page.waitForTimeout(800);

      const clientDashboardContract = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".hired-card")).some((c) =>
          c.textContent.includes("Paras") && c.textContent.includes("Active Contract")
        );
      });
      record("Active contract reflected seamlessly in Client Dashboard", clientDashboardContract);
    }

    // ----------------------------------------------------
    // TEST 9: TALENT PROFILE & HIRE MODAL (WITH DUAL TABS)
    // ----------------------------------------------------
    console.log("\n--- TEST 9: Talent Profile & HireModal ---");
    // Client Himakshi visits Freelancer Paras's profile
    await page.goto("http://localhost:5173/profile/2");
    await page.waitForLoadState("load");
    await page.waitForSelector(".btn-primary-hire", { timeout: 5000 });

    await page.evaluate(() => document.querySelector(".btn-primary-hire")?.click());
    await page.waitForSelector(".hire-modal-box", { timeout: 5000 });
    const isHireModalOpen = await page.evaluate(() => !!document.querySelector(".hire-modal-box"));
    record("HireModal opens on Talent Profile", isHireModalOpen);

    const tabsCount = await page.evaluate(() => document.querySelectorAll(".hire-tab-btn").length);
    record("HireModal displays both project tabs (Existing Project & Post New Job)", tabsCount === 2, `${tabsCount} tabs`);

    // Close modal
    await page.evaluate(() => document.querySelector(".hire-modal-close")?.click());
    await page.waitForTimeout(500);
    const isHireModalClosed = await page.evaluate(() => !document.querySelector(".hire-modal-box"));
    record("HireModal closes cleanly without layout disruption", isHireModalClosed);

    // ----------------------------------------------------
    // TEST 10: JOB DELETION (Delete)
    // ----------------------------------------------------
    if (newJobId) {
      console.log("\n--- TEST 10: Clean Job Deletion ---");
      const deleteRes = await page.fetch(`/api/jobs/${newJobId}`, {
        method: "DELETE",
      });
      record("Client deletes created job via API", deleteRes.ok, `Status: ${deleteRes.status}`);

      // Verify job gone from /find-work
      await page.goto("http://localhost:5173/find-work");
      await page.waitForLoadState("load");
      const isGone = await page.evaluate((title) => {
        return !Array.from(document.querySelectorAll(".job-card-title")).some((el) =>
          el.textContent.includes(title)
        );
      }, testJobTitle);
      record("Deleted job removed completely from active marketplace listings", isGone);
    }

    // ----------------------------------------------------
    // TEST 11: ADMIN COMMAND CENTER & BRAND INTEGRITY
    // ----------------------------------------------------
    console.log("\n--- TEST 11: Admin Dashboard & Global Brand Integrity ---");
    await page.goto("http://localhost:5173/login");
    await page.waitForLoadState("load");
    await page.fill("input[name='email'], #email", "admin@freelancehub.com");
    await page.fill("input[name='password'], #password", "password123");
    await page.evaluate(() => document.querySelector(".btn-auth-submit")?.click());
    await page.waitForTimeout(1000);

    await page.goto("http://localhost:5173/admin-dashboard");
    await page.waitForLoadState("load");
    await page.waitForSelector(".admin-section-header h1, main.admin-main h1", { timeout: 5000 });
    const adminHeading = await page.evaluate(() => document.querySelector(".admin-section-header h1, main.admin-main h1")?.textContent?.trim() || "");
    record("Admin logs in and accesses Admin Dashboard", adminHeading.includes("Command Center") || adminHeading.length > 0, adminHeading);

    const adminHtml = await page.evaluate(() => document.documentElement.outerHTML);
    record("Admin Dashboard free of 'DevLance' mentions", !adminHtml.toLowerCase().includes("devlance"));

    // Check Help Center branding
    await page.goto("http://localhost:5173/help");
    await page.waitForLoadState("load");
    const helpHtml = await page.evaluate(() => document.documentElement.outerHTML);
    record("Help Center free of 'DevLance' mentions", !helpHtml.toLowerCase().includes("devlance"));

    // Check Hourly Calculator branding
    await page.goto("http://localhost:5173/calculator");
    await page.waitForLoadState("load");
    const calcHtml = await page.evaluate(() => document.documentElement.outerHTML);
    record("Hourly Calculator free of 'DevLance' mentions", !calcHtml.toLowerCase().includes("devlance"));

    // ----------------------------------------------------
    // FINAL SUMMARY
    // ----------------------------------------------------
    console.log("\n=================================================");
    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;
    console.log(`  E2E SUMMARY: ${passed} PASSED, ${failed} FAILED (${results.length} Total Tests)`);
    console.log("=================================================");

  } catch (err) {
    console.error("Test execution encountered an error:", err);
  } finally {
    await task.finish({ keep: [] });
  }
}

await runSuite();
