const SUPABASE_URL = "https://imvdzjnarigcaajpugqp.supabase.co";
const SUPABASE_KEY = "sb_publishable_k9QL3s2JmKmXAEBLpilGhg_0dGKR9xj";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const nav = document.querySelector(".nav");
document.querySelector(".menu")?.addEventListener("click", () => nav?.classList.toggle("mobile"));
document.querySelectorAll(".nav nav a").forEach(a => a.addEventListener("click", () => nav?.classList.remove("mobile")));

/* LOAD PROFILE */
async function loadProfile() {
  const { data } = await supabaseClient.from("profile").select("*").single();
  if (!data) return;

  if (document.getElementById("profile-name")) document.getElementById("profile-name").textContent = data.name;
  if (document.getElementById("profile-title")) document.getElementById("profile-title").textContent = data.title;
  if (document.getElementById("profile-bio")) document.getElementById("profile-bio").textContent = data.bio;
  if (document.getElementById("profile-photo") && data.photo_url) document.getElementById("profile-photo").src = data.photo_url;

 const { data: social } = await supabaseClient.from("social_links").select("*").single();
  if (social) {
    const targetEmail = social.email || 'sensagor363@gmail.com';
    if (document.getElementById("email-link")) {
      document.getElementById("email-link").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}`;
    }
    if (document.getElementById("whatsapp-link")) document.getElementById("whatsapp-link").href = social.whatsapp;
    if (document.getElementById("linkedin-link")) document.getElementById("linkedin-link").href = social.linkedin;
    if (document.getElementById("github-link")) document.getElementById("github-link").href = social.github;
  }
}

/* LOAD PROJECTS */
async function loadProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return;

  container.innerHTML = "";

  data.forEach((project) => {
    const title = project.title || "Untitled Project";
    const category = project.category || "AI AUTOMATION";
    const description = project.short_description || "";
    const techStack = project.tech_stack || "n8n";

    const coverImage = project.thumbnail_url || (project.image_urls && project.image_urls[0]);

    let visual = coverImage ? `
      <div class="project-art project-custom-image" style="padding:0; overflow:hidden;">
        <img src="${coverImage}" alt="${title}" style="width:100%; height:100%; object-fit:cover; display:block;">
      </div>
    ` : `
      <div class="project-art lead-art">
        <div class="pipeline"><div>LEAD</div><b>→</b><div>AI</div><b>→</b><div>CRM</div></div>
      </div>
    `;

    const card = document.createElement("article");
    card.className = "project";
    card.id = `project-${project.id}`;
    card.innerHTML = `
      ${visual}
      <div class="project-body">
        <span>${category}</span>
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="chips">
          ${techStack.split(",").map(t => `<b>${t.trim()}</b>`).join("")}
        </div>
        <button class="details" data-id="${project.id}">View Details ↗</button>
      </div>
    `;

    card.querySelector(".details").projectData = project;
    container.appendChild(card);
  });

  // Check URL Hash for Direct Shareable Project Link
  checkUrlHashForProject(data);
}

function checkUrlHashForProject(projects) {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#project-')) {
    const projId = hash.replace('#project-', '');
    const foundProject = projects.find(p => String(p.id) === projId);
    if (foundProject) {
      openProjectModal(foundProject);
    }
  }
}

/* MODAL CAROUSEL & MULTIPLE WORKFLOW HANDLER */
let currentSlideIndex = 0;
let modalImages = [];

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".details");
  if (!btn) return;
  openProjectModal(btn.projectData);
});

function openProjectModal(project) {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  document.getElementById("modal-category").textContent = project.category || "CASE STUDY";
  document.getElementById("modal-title").textContent = project.title;
  
  let modalBody = "";

  // Dynamic Bullet Points ROI Results Card (Green Box UI)
  if (project.results) {
    const rawResults = project.results;
    let bulletItems = [];
    
    if (rawResults.includes('•')) {
      bulletItems = rawResults.split('•').filter(i => i.trim());
    } else if (rawResults.includes('|')) {
      bulletItems = rawResults.split('|').filter(i => i.trim());
    } else {
      bulletItems = [rawResults];
    }

    modalBody += `
      <div class="roi-container" style="background: rgba(34, 197, 94, 0.08); border: 1px solid #22c55e; border-radius: 14px; padding: 18px 20px; margin-bottom: 22px;">
        <div style="display: flex; align-items: center; gap: 8px; color: #22c55e; font-weight: 800; font-size: 15px; margin-bottom: 12px;">
          🚀 <span>Results: Key Results & ROI</span>
        </div>
        <ul style="margin: 0; padding-left: 20px; display: grid; gap: 8px; color: #22c55e; font-weight: 600; font-size: 14px; line-height: 1.5;">
          ${bulletItems.map(item => `<li>${item.trim()}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (project.problem_statement) {
    modalBody += `
      <div style="margin-bottom: 18px; background: rgba(255, 143, 143, 0.05); border-left: 4px solid #ff8f8f; padding: 12px 16px; border-radius: 6px;">
        <strong style="color: #ff8f8f; font-size: 15px;">Problem:</strong>
        <p style="margin-top: 6px; color: #e2e8f0; line-height: 1.6;">${project.problem_statement}</p>
      </div>
    `;
  }

  if (project.solution_statement) {
    modalBody += `
      <div style="margin-bottom: 18px; background: rgba(34, 197, 94, 0.05); border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 6px;">
        <strong style="color: #22c55e; font-size: 15px;">Solution:</strong>
        <p style="margin-top: 6px; color: #e2e8f0; line-height: 1.6;">${project.solution_statement}</p>
      </div>
    `;
  }

  if (project.full_description) {
    modalBody += `
      <div style="margin-top: 15px;">
        <strong style="color: #fff;">Overview:</strong>
        <p style="margin-top: 6px; color: #a3b3c2; line-height: 1.6;">${project.full_description}</p>
      </div>
    `;
  }

  document.getElementById("modal-description").innerHTML = modalBody;

  const modalTech = document.getElementById("modal-tech");
  modalTech.innerHTML = "";
  if (project.tech_stack) {
    project.tech_stack.split(",").forEach(t => {
      const b = document.createElement("b");
      b.textContent = t.trim();
      modalTech.appendChild(b);
    });
  }

  const modalLinks = document.getElementById("modal-links");
  modalLinks.innerHTML = "";

  const createBtn = (label, url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.className = "btn primary";
    a.style.cssText = "padding:8px 14px; font-size:12px; margin-right:8px; margin-bottom:8px; display:inline-block;";
    a.textContent = label;
    return a;
  };

  // Share Project Direct Link Button
  const shareBtn = document.createElement("button");
  shareBtn.className = "btn ghost";
  shareBtn.style.cssText = "padding:8px 14px; font-size:12px; margin-right:8px; margin-bottom:8px; cursor:pointer;";
  shareBtn.innerHTML = "🔗 Share Project Link";
  shareBtn.onclick = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#project-${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    shareBtn.innerHTML = "✅ Link Copied!";
    setTimeout(() => { shareBtn.innerHTML = "🔗 Share Project Link"; }, 2500);
  };
  modalLinks.appendChild(shareBtn);

  if (project.live_url) modalLinks.appendChild(createBtn("Live Demo ↗", project.live_url));
  if (project.video_url) modalLinks.appendChild(createBtn("Video Walkthrough ↗", project.video_url));
  if (project.github_url) modalLinks.appendChild(createBtn("GitHub Repo ↗", project.github_url));

  if (project.workflow_files && project.workflow_files.length > 0) {
    project.workflow_files.forEach((fileObj, idx) => {
      const name = typeof fileObj === 'object' ? (fileObj.name || `Workflow File ${idx + 1}`) : `Workflow File ${idx + 1}`;
      const url = typeof fileObj === 'object' ? fileObj.url : fileObj;
      modalLinks.appendChild(createBtn(`📥 Download ${name}`, url));
    });
  }

  if (project.workflow_url) {
    const links = project.workflow_url.split(",");
    links.forEach((link, idx) => {
      if (link.trim()) {
        modalLinks.appendChild(createBtn(`Workflow Link ${links.length > 1 ? idx + 1 : ''} ↗`, link.trim()));
      }
    });
  }

  modalImages = project.image_urls || (project.thumbnail_url ? [project.thumbnail_url] : []);
  currentSlideIndex = 0;
  renderSlider();

  modal.classList.add("show");
}

function renderSlider() {
  const container = document.getElementById("modal-image-slider");
  if (!container) return;

  if (modalImages.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  container.innerHTML = `
    <div class="slider-wrapper" style="position:relative; width:100%; border-radius:12px; overflow:hidden; border:1px solid #252a32; background:#0d1014;">
      <img id="slider-active-img" src="${modalImages[currentSlideIndex]}" style="width:100%; height:320px; object-fit:contain; display:block;">
      ${modalImages.length > 1 ? `
        <button onclick="changeSlide(-1)" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.7); color:#fff; border:0; padding:8px 12px; border-radius:50%; cursor:pointer;">❮</button>
        <button onclick="changeSlide(1)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.7); color:#fff; border:0; padding:8px 12px; border-radius:50%; cursor:pointer;">❯</button>
        <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.7); padding:4px 10px; border-radius:12px; font-size:11px; color:#fff;">${currentSlideIndex + 1} / ${modalImages.length}</div>
      ` : ''}
    </div>
  `;
}

window.changeSlide = function(direction) {
  currentSlideIndex += direction;
  if (currentSlideIndex < 0) currentSlideIndex = modalImages.length - 1;
  if (currentSlideIndex >= modalImages.length) currentSlideIndex = 0;
  renderSlider();
};

document.getElementById("project-modal-close")?.addEventListener("click", () => {
  document.getElementById("project-modal")?.classList.remove("show");
});

window.addEventListener("DOMContentLoaded", () => {
  if (typeof Typed !== "undefined" && document.getElementById("typed-text")) {
    new Typed("#typed-text", {
      strings: ["Sagor Sen 👋", "an AI Automation Freelancer 🤖", "a Workflow Developer ⚡"],
      typeSpeed: 60, backSpeed: 40, backDelay: 2000, loop: true
    });
  }
});

loadProfile();
loadProjects();
// ==========================================
// Dynamic Fullscreen Photo Viewer (Lightbox)
// ==========================================
const lightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

// পেজের যেকোনো ইমেজে ক্লিক করলে লাইটবক্স খুলবে
document.addEventListener('click', function (e) {
  // ক্লিক করা বস্তু যদি ইমেজ হয় এবং তা লাইটবক্সের ভেতরের ইমেজ না হয়
  if (e.target.tagName === 'IMG' && !e.target.closest('#photo-lightbox')) {
    if (lightbox && lightboxImg) {
      lightbox.style.display = 'flex';
      lightboxImg.src = e.target.src;
    }
  }
});

// ক্লোজ বাটন বা বাইরে ব্যাকগ্রাউন্ডে ক্লিক করলে বন্ধ হবে
if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.style.display = 'none';
    }
  });
}