const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('mobile');
  menu.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav nav a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('mobile');
    menu?.setAttribute('aria-expanded', 'false');
  })
);

const projects = {
  analyzer: {
    index: '01',
    title: 'AI Business Website Analyzer',
    desc: 'A portfolio-ready automation that collects website data, processes it with AI and returns structured business insights for faster lead research.',
    workflow: 'Website → Scrape → AI analysis → Structured output',
    output: 'Business insights + lead score',
    features: ['Website data collection', 'AI business analysis', 'Structured lead insights', 'Scoring-ready output'],
    tech: ['n8n', 'Gemini', 'Apify', 'Google Sheets'],
    links: []
  },
  'cold-email': {
    index: '02',
    title: 'AI Cold Email Generator',
    desc: 'A personalization workflow that turns company information and lead context into relevant, human-sounding outreach drafts.',
    workflow: 'Lead data → Research → Pain point → Personalized email',
    output: 'Ready-to-review cold email',
    features: ['Lead context processing', 'Personalization', 'Offer matching', 'Email draft generation'],
    tech: ['n8n', 'Gemini', 'Gmail'],
    links: []
  },
  leadgen: {
    index: '03',
    title: 'AI Lead Generation Pipeline',
    desc: 'A lead-generation workflow designed to collect, enrich, qualify and organize business data before outreach.',
    workflow: 'Collect → Enrich → Score → CRM → Outreach',
    output: 'Qualified outreach-ready leads',
    features: ['Lead collection', 'Data enrichment', 'AI qualification', 'CRM-ready records'],
    tech: ['n8n', 'Apify', 'Google Sheets'],
    links: []
  }
};

const modal = document.getElementById('modal');
const title = document.getElementById('modalTitle');
const desc = document.getElementById('modalDesc');
const index = document.getElementById('modalIndex');
const workflow = document.getElementById('modalWorkflow');
const output = document.getElementById('modalOutput');
const features = document.getElementById('modalFeatures');
const tech = document.getElementById('modalTech');
const actions = document.getElementById('modalActions');

function openProject(key) {
  const p = projects[key];
  if (!p || !modal) return;

  index.textContent = p.index;
  title.textContent = p.title;
  desc.textContent = p.desc;
  workflow.textContent = p.workflow;
  output.textContent = p.output;

  features.innerHTML = p.features.map(item => `<span>✓ ${item}</span>`).join('');
  tech.innerHTML = p.tech.map(item => `<span>${item}</span>`).join('');

  // Add links later by editing the "links" array in this file.
  actions.innerHTML = p.links.length
    ? p.links.map(link => `<a class="btn ${link.primary ? 'primary' : 'ghost'}" href="${link.url}" target="_blank" rel="noopener">${link.label} ↗</a>`).join('')
    : `<span class="modal-note">Demo, workflow and repository links can be added here when you are ready.</span>`;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.details').forEach(btn => {
  btn.addEventListener('click', () => openProject(btn.dataset.project));
});

function closeModal() {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
document.querySelector('.close')?.addEventListener('click', closeModal);
document.querySelector('.close2')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(el => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (!glow || window.innerWidth < 900) return;
  glow.style.transform = `translate(${e.clientX - 180}px, ${e.clientY - 180}px)`;
}, { passive: true });
