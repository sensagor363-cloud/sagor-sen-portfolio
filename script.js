const nav=document.querySelector('.nav');
document.querySelector('.menu')?.addEventListener('click',()=>nav.classList.toggle('mobile'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('mobile')));

const modal=document.getElementById('modal');
const title=document.getElementById('modalTitle');
const desc=document.getElementById('modalDesc');
document.querySelectorAll('.details').forEach(btn=>{
  btn.addEventListener('click',()=>{
    title.textContent=btn.dataset.title;
    desc.textContent=btn.dataset.desc;
    modal.classList.add('open');
  });
});
document.querySelector('.close')?.addEventListener('click',()=>modal.classList.remove('open'));
document.querySelector('.close2')?.addEventListener('click',()=>modal.classList.remove('open'));
modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});
