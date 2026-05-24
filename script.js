// ===== CURSOR GLOW =====
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ===== TYPED TEXT =====
const roles = ['ECE Student', 'Embedded Systems Enthusiast', 'Future VLSI Engineer', 'AI-Integrated Engineering'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeEffect() {
  const current = roles[ri];
  typedEl.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
  let speed = deleting ? 40 : 80;
  if (!deleting && ci > current.length) { speed = 1500; deleting = true; }
  if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; speed = 400; }
  setTimeout(typeEffect, speed);
}
typeEffect();

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--blue)' : '';
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');

  // Get form values
  const name     = e.target[0].value;
  const email    = e.target[1].value;
  const subject  = e.target[2].value;
  const message  = e.target[3].value;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  emailjs.send("service_cau139g", "template_hjd4ise", {
    from_name:    name,
    from_email:   email,
    subject:      subject,
    message:      message,
    to_name:      "Hemant Raj",
  })
  .then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00ffcc, #00a88e)';
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    btn.innerHTML = '<i class="fas fa-times"></i> Failed. Try Again';
    btn.style.background = 'linear-gradient(135deg, #ff4444, #cc2222)';
    btn.disabled = false;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
    }, 3000);
  });
});

// ===== SMOOTH CLOSE NAV ON LINK CLICK =====
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});
