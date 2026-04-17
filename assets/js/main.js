/* ============================================================
   دليل فعاليات الجامعة الافتراضية – main.js
   يحتوي على: Slider + Filter + Form Validation + Share/Calendar
   ============================================================ */

/* ──────────────────────────────────────────────
   SLIDER – الصفحة الرئيسية
   ────────────────────────────────────────────── */
let currentSlide = 0;
let autoSlideTimer = null;

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  goToSlide(0);
  // Auto advance every 5 seconds
  autoSlideTimer = setInterval(() => changeSlide(1), 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  // Reset auto timer on manual interaction
  clearInterval(autoSlideTimer);
  goToSlide(currentSlide + dir);
  autoSlideTimer = setInterval(() => changeSlide(1), 5000);
}

/* ──────────────────────────────────────────────
   FILTER – صفحة events.html
   ────────────────────────────────────────────── */
function filterEvents() {
  const search   = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat      = document.getElementById('catFilter')?.value || 'all';
  const month    = document.getElementById('monthFilter')?.value || 'all';

  const items    = document.querySelectorAll('.event-item');
  let visible    = 0;

  items.forEach(item => {
    const itemCat   = item.dataset.cat || '';
    const itemDate  = item.dataset.date || '';
    const itemText  = item.textContent.toLowerCase();
    const itemMonth = itemDate.slice(5, 7); // "MM" from "YYYY-MM-DD"

    const matchCat    = (cat === 'all')   || (itemCat === cat);
    const matchMonth  = (month === 'all') || (itemMonth === month);
    const matchSearch = !search           || itemText.includes(search);

    const show = matchCat && matchMonth && matchSearch;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Update results count
  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = `عدد النتائج: ${visible} فعالية`;

  // No results message
  const noResults = document.getElementById('noResults');
  if (noResults) noResults.classList.toggle('d-none', visible > 0);
}

function resetFilters() {
  const s = document.getElementById('searchInput');
  const c = document.getElementById('catFilter');
  const m = document.getElementById('monthFilter');
  if (s) s.value = '';
  if (c) c.value = 'all';
  if (m) m.value = 'all';
  filterEvents();
}

// Run filter on page load to set count
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eventsGrid')) filterEvents();
});

/* ──────────────────────────────────────────────
   CONTACT FORM VALIDATION – contact.html
   ────────────────────────────────────────────── */
function submitContactForm() {
  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const message = document.getElementById('contactMessage');

  let valid = true;

  // Name
  const nameErr = document.getElementById('nameErr');
  if (!name.value.trim()) {
    nameErr.style.display = 'block';
    name.classList.add('is-invalid');
    valid = false;
  } else {
    nameErr.style.display = 'none';
    name.classList.remove('is-invalid');
    name.classList.add('is-valid');
  }

  // Email – simple regex
  const emailErr = document.getElementById('emailErr');
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email.value.trim())) {
    emailErr.style.display = 'block';
    email.classList.add('is-invalid');
    valid = false;
  } else {
    emailErr.style.display = 'none';
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
  }

  // Message
  const msgErr = document.getElementById('msgErr');
  if (message.value.trim().length < 10) {
    msgErr.style.display = 'block';
    message.classList.add('is-invalid');
    valid = false;
  } else {
    msgErr.style.display = 'none';
    message.classList.remove('is-invalid');
    message.classList.add('is-valid');
  }

  const alertEl = document.getElementById('formAlert');
  if (!alertEl) return;

  if (valid) {
    alertEl.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" style="font-family:'Cairo',sans-serif;">
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>تم الإرسال بنجاح!</strong> سنتواصل معك في أقرب وقت ممكن.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    // Reset form
    name.value = '';
    email.value = '';
    message.value = '';
    document.getElementById('contactSubject').value = '';
    [name, email, message].forEach(el => { el.classList.remove('is-valid'); });
  } else {
    alertEl.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" style="font-family:'Cairo',sans-serif;">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        يرجى تصحيح الأخطاء المذكورة أعلاه قبل الإرسال.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
  }

  // Scroll to alert
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ──────────────────────────────────────────────
   RESERVE MODAL – event.html
   ────────────────────────────────────────────── */
function confirmReserve() {
  const nameEl = document.getElementById('reserveName');
  const idEl   = document.getElementById('reserveId');
  const alertEl = document.getElementById('reserveAlert');
  if (!nameEl || !alertEl) return;

  if (!nameEl.value.trim() || !idEl.value.trim()) {
    alertEl.innerHTML = `<div class="alert alert-danger py-2" style="font-family:'Cairo',sans-serif;font-size:.88rem">
      <i class="bi bi-exclamation-triangle me-1"></i> يرجى ملء جميع الحقول المطلوبة.
    </div>`;
    return;
  }

  alertEl.innerHTML = `<div class="alert alert-success py-2" style="font-family:'Cairo',sans-serif;font-size:.88rem">
    <i class="bi bi-check-circle me-1"></i> تم الحجز بنجاح! سيصلك تأكيد على بريدك.
  </div>`;

  setTimeout(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('reserveModal'));
    if (modal) modal.hide();
    nameEl.value = '';
    idEl.value = '';
    alertEl.innerHTML = '';
  }, 2000);
}

/* ──────────────────────────────────────────────
   ADD TO CALENDAR – event.html (Google Calendar)
   ────────────────────────────────────────────── */
function addToCalendar() {
  const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('معرض الفنون التشكيلية الجامعي') +
    '&dates=20260420T090000/20260420T180000' +
    '&details=' + encodeURIComponent('فعالية جامعية – دليل فعاليات الجامعة الافتراضية') +
    '&location=' + encodeURIComponent('قاعة المعارض، الجامعة الافتراضية السورية');
  window.open(url, '_blank');
}

/* ──────────────────────────────────────────────
   SHARE – event.html (Web Share API)
   ────────────────────────────────────────────── */
function shareEvent() {
  const shareData = {
    title: 'معرض الفنون التشكيلية الجامعي',
    text: 'لا تفوّت معرض الفنون التشكيلية في الجامعة الافتراضية – 20 أبريل 2026',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => fallbackShare());
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      const el = document.getElementById('eventAlert');
      if (!el) return;
      el.innerHTML = `<div class="alert alert-info alert-dismissible fade show" role="alert" style="font-family:'Cairo',sans-serif;">
        <i class="bi bi-clipboard-check me-2"></i> تم نسخ رابط الفعالية!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    });
}

/* ──────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
});
