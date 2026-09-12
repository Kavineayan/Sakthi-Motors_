/**
 * SAKTHI MOTORS — Main Interactive JavaScript
 * Authorized Bajaj Motorcycle Dealership | Chinnamanur, Theni, Tamil Nadu
 * Color Identity: Cobalt Blue (#004DA8) & Cloud Burst Dark Navy (#1E2B56)
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initActiveNavLink();
  initProductDetailsPage();
  initContactForm();
  initFeaturedProducts();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  const closeBtn = document.querySelector(".mobile-nav-close");
  if (!mobileDrawer) return;

  const openDrawer = () => {
    mobileDrawer.classList.add("open");
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute("aria-expanded", "true");
      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      }
    }
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove("open");
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
    document.body.style.overflow = "";
  };

  const toggleDrawer = () => {
    if (mobileDrawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  // Close when clicking any nav link & restore normal page scroll
  const links = mobileDrawer.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAV LINK INDICATOR
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* --------------------------------------------------------------------------
   4. PRODUCT DETAILS PAGE (DYNAMIC DATA BINDING)
   -------------------------------------------------------------------------- */
function initProductDetailsPage() {
  const detailContainer = document.getElementById("product-detail-view");
  if (!detailContainer || typeof PRODUCTS === "undefined") return;

  // Extract ?id= or ?model= from URL
  const params = new URLSearchParams(window.location.search);
  const modelId = params.get("id") || params.get("model") || "pulsar-ns200";

  // Find product in catalog
  const product = PRODUCTS.find(p => p.id === modelId) || PRODUCTS[0];
  if (!product) return;

  // Update Page Meta/Title
  document.title = `${product.name} | Sakthi Motors Bajaj Chinnamanur`;

  // Main Image & Gallery
  const mainImage = document.getElementById("detail-main-img");
  const thumbsContainer = document.getElementById("detail-thumbs");
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = `${product.name} - Sakthi Motors Bajaj Dealership`;
  }

  if (thumbsContainer && product.gallery && product.gallery.length > 0) {
    thumbsContainer.innerHTML = product.gallery.map((imgSrc, idx) => `
      <button class="thumb-item ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}" aria-label="View Image ${idx + 1}">
        <img src="${imgSrc}" alt="${product.name} Angle ${idx + 1}" loading="lazy" />
      </button>
    `).join("");

    const thumbs = thumbsContainer.querySelectorAll(".thumb-item");
    thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        if (mainImage) {
          mainImage.src = thumb.getAttribute("data-src");
        }
      });
    });
  }

  // Info fields
  const elBadge = document.getElementById("detail-badge");
  const elTitle = document.getElementById("detail-title");
  const elTagline = document.getElementById("detail-tagline");
  const elDesc = document.getElementById("detail-description");
  const elHighlights = document.getElementById("detail-highlights");

  if (elBadge) elBadge.textContent = product.category;
  if (elTitle) elTitle.textContent = product.name;
  if (elTagline) elTagline.textContent = product.tagline;
  if (elDesc) elDesc.textContent = product.description;

  if (elHighlights && product.features) {
    elHighlights.innerHTML = product.features.slice(0, 4).map(f => `
      <li>
        <i class="fa-solid fa-circle-check"></i>
        <span>${f}</span>
      </li>
    `).join("");
  }

  // Specs Table Grid
  const specsContainer = document.getElementById("detail-specs-grid");
  if (specsContainer && product.specs) {
    const specEntries = [
      { key: "Engine", val: product.specs.engine },
      { key: "Max Power", val: product.specs.power },
      { key: "Max Torque", val: product.specs.torque },
      { key: "Transmission", val: product.specs.transmission },
      { key: "Fuel Type", val: product.specs.fuelType },
      { key: "Brakes", val: product.specs.brakes },
      { key: "Tyres", val: product.specs.tyres },
      { key: "Kerb Weight", val: product.specs.weight },
      { key: "Fuel Tank", val: product.specs.fuelTank }
    ].filter(s => s.val);

    specsContainer.innerHTML = specEntries.map(s => `
      <div class="spec-item">
        <span class="spec-key">${s.key}</span>
        <span class="spec-value">${s.val}</span>
      </div>
    `).join("");
  }

  // Features List Grid
  const featuresContainer = document.getElementById("detail-features-grid");
  if (featuresContainer && product.features) {
    featuresContainer.innerHTML = product.features.map(f => `
      <div class="feature-card">
        <i class="fa-solid fa-shield-halved"></i>
        <span>${f}</span>
      </div>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   5. FEATURED / CATALOG PRODUCTS GRID RENDERER
   -------------------------------------------------------------------------- */
function initFeaturedProducts() {
  const container = document.getElementById("products-catalog-grid");
  if (!container || typeof PRODUCTS === "undefined") return;

  container.innerHTML = PRODUCTS.map(product => `
    <article class="product-card">
      <div class="product-card-media">
        <span class="product-card-badge">${product.category}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-series">${product.series}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-specs-compact">
          <div class="spec-chip">
            <span class="spec-chip-label">Engine</span>
            <span class="spec-chip-val">${product.specs.engine.split(" ")[0]} cc</span>
          </div>
          <div class="spec-chip">
            <span class="spec-chip-label">Power</span>
            <span class="spec-chip-val">${product.specs.power.split(" ")[0]} PS</span>
          </div>
          <div class="spec-chip">
            <span class="spec-chip-label">Gearbox</span>
            <span class="spec-chip-val">${product.specs.transmission.split(" ")[0]}</span>
          </div>
        </div>
        <div class="product-card-footer">
          <a href="product-details.html?id=${product.id}" class="btn btn-outline btn-sm" style="width: 100%;">
            VIEW DETAILS <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & GOOGLE SHEETS SUBMISSION
   -------------------------------------------------------------------------- */
// GOOGLE SHEETS CONFIGURATION:
// Paste your Google Apps Script Web App Deployment URL here to save inquiries to your Google Sheet:
const GOOGLE_SHEETS_WEBAPP_URL = "";

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successAlert = document.getElementById("form-success-alert");
  const errorAlert = document.getElementById("form-error-alert");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset alert states
    if (successAlert) successAlert.style.display = "none";
    if (errorAlert) errorAlert.style.display = "none";

    const name = form.querySelector("[name='name']").value.trim();
    const phone = form.querySelector("[name='phone']").value.trim();
    const email = form.querySelector("[name='email']").value.trim();
    const motorcycle = form.querySelector("[name='motorcycle']").value;
    const message = form.querySelector("[name='message']").value.trim();

    // Basic Validation
    if (!name || !phone || !message) {
      if (errorAlert) {
        errorAlert.textContent = "Please fill in all required fields (Name, Phone, and Message).";
        errorAlert.style.display = "flex";
      }
      return;
    }

    // Phone format check (10 digits)
    const phoneClean = phone.replace(/[^0-9]/g, "");
    if (phoneClean.length < 10) {
      if (errorAlert) {
        errorAlert.textContent = "Please enter a valid 10-digit phone number.";
        errorAlert.style.display = "flex";
      }
      return;
    }

    // Loading State
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "SEND MESSAGE";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SENDING...`;
    }

    const payload = {
      name,
      phone,
      email: email || "Not provided",
      motorcycle,
      message,
      submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    try {
      if (GOOGLE_SHEETS_WEBAPP_URL && GOOGLE_SHEETS_WEBAPP_URL.startsWith("https://script.google.com")) {
        // Send payload directly to Google Apps Script endpoint
        await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Frontend demo mode simulation when URL is not configured yet
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      if (successAlert) {
        successAlert.textContent = "Thank you for contacting Sakthi Motors. Our team will get in touch with you shortly.";
        successAlert.style.display = "flex";
      }
      form.reset();
    } catch (err) {
      if (errorAlert) {
        errorAlert.textContent = "Something went wrong. Please try again or contact us directly.";
        errorAlert.style.display = "flex";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}
