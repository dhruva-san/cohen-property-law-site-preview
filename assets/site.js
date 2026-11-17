const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// header: solid after scroll, mobile sheet
const header = $('#header'), menuBtn = $('#menuBtn');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, {passive: true}); onScroll();
const setMenu = open => { header.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.textContent = open ? 'Close' : 'Menu'; };
menuBtn.onclick = () => setMenu(!header.classList.contains('open'));
$('#nav').onclick = e => e.target.closest('a') && setMenu(false);

// heading reveals
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), {rootMargin: '0px 0px -12% 0px'});
$$('.rv').forEach(el => io.observe(el));

// hero: count the two figures up once, as part of the load sequence
if (still) $('.hero video')?.pause();
else setTimeout(() => $$('[data-count]').forEach(el => {
  const end = +el.dataset.count, t0 = performance.now(), dur = 1600;
  const tick = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - (1 - p) ** 3)) + el.dataset.suffix; p < 1 && requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), 1700);

// testimonials
const quotes = $$('#quotes figure'); let q = 0;
const show = n => { quotes[q].classList.remove('on'); q = (n + quotes.length) % quotes.length; quotes[q].classList.add('on'); $('#count').textContent = `${q + 1} of ${quotes.length}`; };
if (quotes.length) { $('#prev').onclick = () => show(q - 1); $('#next').onclick = () => show(q + 1); }

// video loads from YouTube only when asked for
if ($('#yt')) $('#yt').onclick = e => { const b = e.currentTarget; b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1" title="Cohen Law Firm video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; };

// preview forms are not connected: say so instead of sending anything
$$('form[data-preview]').forEach(f => f.onsubmit = e => { e.preventDefault(); f.querySelector('output').textContent = 'This preview form is not connected yet. Please call (305) 250-2418.'; });

// article contents: mark the section being read
const toc = $$('.toc a');
if (toc.length) {
  const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && toc.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id))), {rootMargin: '-12% 0px -78% 0px'});
  $$('.prose h2[id]').forEach(h => spy.observe(h));
}
