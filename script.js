
const intro       = document.querySelector('.intro');
const closeIntro  = document.querySelector('.close-intro');
const overlay     = document.getElementById('overlay');

const itemsNode   = document.querySelectorAll('.wall .wall-item'); // 좌/우 벽 전부
const items       = Array.from(itemsNode);
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modal-title');
const modalDesc   = document.getElementById('modal-desc');
const modalImg    = document.getElementById('modal-img');
const closeBtn    = document.querySelector('#modal .close-btn');
const prevBtn     = document.querySelector('#modal .nav.prev');
const nextBtn     = document.querySelector('#modal .nav.next');

let currentIndex = -1;


function overlayOn() {
  if (!overlay) return;
  overlay.style.display = 'block';
  overlay.classList.add('is-on'); 
}
function overlayOff() {
  if (!overlay) return;
  overlay.classList.remove('is-on');
  overlay.style.display = 'none';
}
function modalIsOpen() {
  return modal && getComputedStyle(modal).display !== 'none';
}
function setModalFromItem(item) {
  const title  = item.getAttribute('data-title') || '';
  const desc   = item.getAttribute('data-desc')  || '';
  const imgEl  = item.querySelector('img');
  const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
  const imgAlt = imgEl ? (imgEl.getAttribute('alt') || title) : '';

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc)  modalDesc.textContent  = desc;

  if (modalImg) {
    if (imgSrc) {
      modalImg.src = imgSrc;
      modalImg.alt = imgAlt || title || 'image';
      modalImg.style.display = 'block';
    } else {
      modalImg.removeAttribute('src');
      modalImg.alt = '';
      modalImg.style.display = 'none';
    }
  }
}
function updateArrows() {
  if (!prevBtn || !nextBtn) return;
  
  prevBtn.classList.toggle('hidden', currentIndex <= 0);
  nextBtn.classList.toggle('hidden', currentIndex >= items.length - 1);
}
function showModalAt(index) {
  if (!modal || index < 0 || index >= items.length) return;
  currentIndex = index;
  setModalFromItem(items[currentIndex]);
  overlayOn();
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateArrows();
}
function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  overlayOff();
  document.body.style.overflow = '';
  currentIndex = -1;
  updateArrows();
}


if (intro) {
  intro.style.display = 'flex';
  overlayOn();
}
if (closeIntro && intro) {
  closeIntro.addEventListener('click', () => {
    intro.classList.add('hide'); 
    setTimeout(() => {
      intro.style.display = 'none';
      overlayOff();             
    }, 600);
  });
}


items.forEach((item, i) => {
  item.addEventListener('click', () => showModalAt(i));
});


if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modal) {
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) showModalAt(currentIndex - 1);
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  if (currentIndex < items.length - 1) showModalAt(currentIndex + 1);
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); return; }
  if (!modalIsOpen()) return;
  if (e.key === 'ArrowLeft'  && currentIndex > 0)                 showModalAt(currentIndex - 1);
  if (e.key === 'ArrowRight' && currentIndex < items.length - 1)  showModalAt(currentIndex + 1);
});