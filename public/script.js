// --------- Content Arrays ---------
const CONTENT = { articles: [], projects: [] };

// --------- Helper functions ---------
function addArticle({id, title, excerpt, img, tags=[]}) {
  CONTENT.articles.push({id, title, excerpt, img, tags});
}
function addProject({id, title, excerpt, img, tags=[]}) {
  CONTENT.projects.push({id, title, excerpt, img, tags});
}

// --------- Sample content ---------
addArticle({
  id:'arduino-ultrasonic',
  title:'Arduino Ultrasonic',
  excerpt:'Belajar membuat sensor jarak otomatis dengan HC-SR04.',
  img:'img/thumbnail1.jpg',
  tags:['Arduino','Sensor']
});


addArticle({
  id:'pencacah-arduino',
  title:'pencacah-arduino',
  excerpt:'Belajar membuat sensor jarak otomatis dengan HC-SR04.',
  img:'img/thumbnail1.jpg',
  tags:['Arduino','Sensor']
});

// --------- Create Card ---------
function createCard(item){
  const a = document.createElement('a');
  a.href = `article.html?id=${item.id}`;
  a.className = 'neon-card fade-slide block rounded-lg overflow-hidden';
  a.setAttribute('data-title', item.title.toLowerCase());
  a.innerHTML = `
    <img src="${item.img}" alt="${item.title}" class="w-full h-40 object-cover"/>
    <div class="p-4">
      <h3 class="font-semibold text-lg mb-1">${item.title}</h3>
      <p class="text-gray-400 text-sm mb-2">${item.excerpt}</p>
      <div>${(item.tags||[]).map(t=>`<span class='text-indigo-400 text-xs mr-1'>#${t}</span>`).join('')}</div>
    </div>
  `;
  return a;
}

// --------- Render Content ---------
function renderContent(){
  const cardsEl = document.getElementById('cards');
  cardsEl.innerHTML = '';
  CONTENT.articles.forEach(a=>cardsEl.appendChild(createCard(a)));
}
renderContent();

// --------- Search ---------
const search = document.getElementById('search');
search?.addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#cards .neon-card').forEach(card=>{
    const title = card.getAttribute('data-title');
    card.style.display = !q || title.includes(q) ? '' : 'none';
  });
});

// --------- Dark Mode Toggle ---------
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  document.documentElement.classList.toggle('dark', theme==='dark');
  themeToggle.textContent = theme==='dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme') || 'light');
themeToggle.addEventListener('click', ()=>{
  applyTheme(document.body.classList.contains('dark') ? 'light':'dark');
});

// --------- Fade-slide ---------
function observeFadeSlides(){
  document.querySelectorAll('.fade-slide').forEach((el,index)=>{
    el.style.transitionDelay = `${index*0.1}s`;
    new IntersectionObserver((entries,observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.1}).observe(el);
  });
}
observeFadeSlides();

