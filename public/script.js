// script.js - Dynamic content & theme toggling

// --------- Content Arrays ---------
const CONTENT = {
  articles: [],
  projects: []
};

// --------- Helper functions ---------
function addArticle({id, title, excerpt, img, tags=[]}){
  CONTENT.articles.push({id, title, excerpt, img, tags});
}
function addProject({id, title, excerpt, img, tags=[]}){
  CONTENT.projects.push({id, title, excerpt, img, tags});
}

// --------- Sample content ---------
addArticle({id:'arduino-ultrasonic', title:'Arduino Ultrasonic', excerpt:'Belajar membuat sensor jarak otomatis dengan HC-SR04.', img:'img/thumbnail1.jpg', tags:['Arduino','Sensor']});
addArticle({id:'rfid-mfrc522', title:'RFID MFRC522', excerpt:'Tutorial cloning, dump, dan write sektor.', img:'img/thumbnail2.jpg', tags:['RFID','Security']});
addArticle({id:'pencacah-arduino', title:'pencacah berbasis arduino', excerpt:'IoT penyiraman otomatis & pemupukan.', img:'img/thumbnaix3.jpg'});

addProject({id:'auto-water', title:'Automatic Watering System', excerpt:'IoT penyiraman otomatis & pemupukan.', img:'img/thumbnail3.jpg'});


// --------- Create Card Element ---------
function createCard(item){
  const a = document.createElement('a');
  a.href = `article.html?id=${item.id}`;
  a.className = 'card fade-in block';
  a.setAttribute('data-title', item.title.toLowerCase());
  a.innerHTML = `
    <img src="${item.img}" alt="${item.title}" />
    <div class="p-4">
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <div>${(item.tags||[]).map(t=>`<span class='tag'>#${t}</span>`).join(' ')}</div>
    </div>
  `;
  return a;
}

// --------- Render Content ---------
function renderContent(){
  const cardsEl = document.getElementById('cards');
  const projectsEl = document.getElementById('projectsGrid');
  cardsEl.innerHTML = '';
  projectsEl.innerHTML = '';

  CONTENT.articles.forEach(a=>cardsEl.appendChild(createCard(a)));
  CONTENT.projects.forEach(p=>projectsEl.appendChild(createCard(p)));

  observeFadeIns();
}

renderContent();

// --------- Search Functionality ---------
const search = document.getElementById('search');
search?.addEventListener('input', e=>{
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#cards .card').forEach(card=>{
    const title = card.getAttribute('data-title');
    card.style.display = !q || title.includes(q) ? '' : 'none';
  });
});

// --------- Dark Mode Toggle ---------
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  document.body.classList.toggle('dark', theme==='dark');
  themeToggle.textContent = theme==='dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}
const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
applyTheme(storedTheme);
themeToggle.addEventListener('click', ()=>applyTheme(document.body.classList.contains('dark') ? 'light':'dark'));

// --------- Fade-in on scroll ---------
function observeFadeIns(){
  document.querySelectorAll('.fade-in').forEach(el=>{
    new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('is-visible'); });
    }, {threshold:0.1}).observe(el);
  });
}
