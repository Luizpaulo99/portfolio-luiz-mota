
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24));

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuBtn.textContent = navLinks.classList.contains('open') ? '×' : '☰';
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.textContent = '☰';
}));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));


// Premium app carousel
const carousels = document.querySelectorAll('[data-carousel]');
carousels.forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const prevBtn = carousel.querySelector('.carousel-nav.prev');
  const nextBtn = carousel.querySelector('.carousel-nav.next');
  const title = carousel.querySelector('.carousel-title');
  const subtitle = carousel.querySelector('.carousel-subtitle');
  let index = 0;

  const updateCarousel = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
      dot.setAttribute('aria-selected', dotIndex === index ? 'true' : 'false');
    });
    const activeSlide = slides[index];
    if (title) title.textContent = activeSlide.dataset.title || '';
    if (subtitle) subtitle.textContent = activeSlide.dataset.subtitle || '';
  };

  prevBtn?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextBtn?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      index = dotIndex;
      updateCarousel();
    });
  });

  let autoRotate = setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4500);

  carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carousel.addEventListener('mouseleave', () => {
    clearInterval(autoRotate);
    autoRotate = setInterval(() => {
      index = (index + 1) % slides.length;
      updateCarousel();
    }, 4500);
  });

  updateCarousel();
});


// Apple-like 3D tilt interaction for the iPhone mockup
const phoneStages = document.querySelectorAll('.iphone-stage');
phoneStages.forEach((stage) => {
  const frame = stage.querySelector('.iphone-frame');
  if (!frame) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced || window.innerWidth <= 560) return;

  let rafId = null;
  const applyTilt = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const rotateY = -12 + (px - 0.5) * 12;
    const rotateX = 10 - (py - 0.5) * 10;
    rafId = requestAnimationFrame(() => {
      frame.style.animation = 'none';
      frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      rafId = null;
    });
  };

  stage.addEventListener('mousemove', (event) => {
    if (rafId) cancelAnimationFrame(rafId);
    applyTilt(event.clientX, event.clientY);
  });

  stage.addEventListener('mouseleave', () => {
    frame.style.transform = '';
    frame.style.animation = '';
  });
});
