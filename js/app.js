/* ==========================================================================
   NETFLIX WORLD — application
   ========================================================================== */
(() => {
'use strict';
const D = window.NW;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const uni = s => D.universes.find(u => u.slug === s);
const attr = s => D.attractions.find(a => a.slug === s);
const euro = n => n.toLocaleString('fr-FR') + ' €';
const pic = (n, alt = '', x = '') => `<img src="img/${n}.webp" alt="${alt}" loading="lazy" decoding="async" ${x}>`;
const icon = (id, c = '') => `<svg class="ic ${c}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const hLabel = h => h ? `${(h / 100).toFixed(2).replace('.', ',')} m min.` : 'Sans taille minimale';
const NLOGO = '<img class="tile__n" src="img/logo-n.png" alt="">';
const thrill = n => `<span class="thrill" title="Intensité ${n}/5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;

/* ------------------------------------------------------------ Calendrier */
const HOL = ['1-1', '5-1', '5-8', '7-14', '8-15', '11-1', '11-11', '12-25', '4-5', '4-6', '5-14', '5-25'];
function dayStatus(d) {
  const m = d.getMonth() + 1, day = d.getDate(), dow = d.getDay(), k = m * 100 + day;
  const we = dow === 0 || dow === 6, hol = HOL.includes(`${m}-${day}`);
  const S = (type, hours, label) => ({ open: type !== 'closed', type, hours, label });
  if (k >= 105 && k <= 326) return S('closed', 'Fermé', 'Fermeture hivernale, réouverture le 27 mars');
  if (k >= 327 && k <= 630) return S('open', we || hol ? '10 h – 20 h' : '10 h – 19 h', 'Saison de printemps');
  if (k >= 701 && k <= 831) return S('late', '10 h – 23 h', "Nocturnes d'été");
  if (k >= 901 && k <= 1002) return S('open', we || hol ? '10 h – 19 h' : '10 h – 18 h', "Saison d'automne");
  if (k >= 1003 && k <= 1102) return S('late', '10 h – 21 h', "Halloween : le Monde à l'envers");
  if (k >= 1103 && k <= 1127) return we || hol ? S('open', '11 h – 19 h', 'Week-ends et jours fériés') : S('closed', 'Fermé', 'Ouvert les week-ends et jours fériés');
  return S('late', '11 h – 21 h', 'Noël à Netflix World');
}
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const longDate = d => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const nextOpen = (f = TODAY) => { const d = new Date(f); for (let i = 0; i < 400; i++) { if (dayStatus(d).open) return d; d.setDate(d.getDate() + 1); } return f; };

/* ------------------------------------------------------------- Composants */
const uniTile = u => `<a class="tile" href="#univers-${u.slug}" data-link>${pic(u.img, u.name)}${NLOGO}<span class="tile__b"><span class="tile__t">${u.name}</span><span class="tile__s">${u.place}</span></span></a>`;
const topCard = a => `<button class="topcard" data-attraction="${a.slug}" aria-label="N°${a.rank} ${a.name}, ${a.sub}"><span class="topcard__num" aria-hidden="true">${a.rank}</span>
  <span class="topcard__poster">${pic(a.img, '')}${NLOGO}<b>${a.name}<small>${a.sub}</small></b></span></button>`;
const soonTile = s => `<button class="tile tile--soon" data-soon="${s.id}">${pic(s.img, s.name)}<span class="tile__badge tile__badge--soon">${s.when}</span><span class="tile__b"><span class="tile__t">${s.name}</span><span class="tile__s">Voir sur le plan</span></span></button>`;
const foodCard = r => `<div class="fcard reveal">${pic(r.img, r.name)}<small>${r.kind}</small><h3>${r.name}</h3><p>${r.desc}</p></div>`;
function attractionCard(a) {
  const u = uni(a.universe);
  return `<article class="acard"><div class="acard__img">${pic(a.img, `${a.name} – ${a.sub}`)}<span class="acard__type">${a.type}</span><span class="acard__rank top10">TOP<b>${a.rank}</b></span></div>
  <div class="acard__body"><h3>${a.name}</h3><p class="acard__sub">${a.sub}</p><p>${a.desc}</p>
  <div class="meta"><span class="${a.height >= 120 ? 'warn' : ''}">${icon('ruler', 'ic--sm')} ${a.age}</span><span>${icon('clock', 'ic--sm')} ${a.duration}</span><span>${thrill(a.thrill)}</span></div>
  <div class="btns"><button class="btn btn--white btn--sm" data-attraction="${a.slug}">${icon('info')} Détails</button><button class="btn btn--gray btn--sm" data-onmap="${a.slug}">${icon('map')} Sur le plan</button></div></div></article>`;
}
function offerCard(o, i) {
  return `<article class="ocard reveal ${i === 0 ? 'ocard--hl' : ''}" style="--d:${i * .06}s"><div class="ocard__img">${pic(o.img, '')}<span class="ocard__badge">${o.badge}</span></div>
  <div class="ocard__body"><h3>${o.name}</h3><ul>${o.perks.map(p => `<li>${icon('check')}${p}</li>`).join('')}</ul>
  <div class="price"><small>À partir de</small><strong>${o.price} €</strong><span>${o.unit}</span><em>Prix fictif</em></div>
  <button class="btn btn--red btn--block" data-book="${o.id}">Réserver</button></div></article>`;
}

/* ------------------------------------------------------------- Billboard */
const SLIDES = [
  { img: 'aerial', tag: 'LE PARC', title: 'Netflix World', sub: 'Le parc des séries', desc: "Sept univers, neuf attractions et un grand spectacle chaque soir. Entrez dans vos séries préférées.", rating: 'Tous publics', a: null },
  { img: 'stranger', tag: 'ATTRACTION', title: 'Stranger Things', sub: 'La maison hantée', desc: attr('stranger-things').long, rating: 'Dès 10 ans', a: 'stranger-things' },
  { img: 'witcher', tag: 'ATTRACTION', title: 'The Witcher', sub: 'Les montagnes russes', desc: attr('the-witcher').long, rating: '1,30 m min.', a: 'the-witcher' },
  { img: 'onepiece', tag: 'ATTRACTION', title: 'One Piece', sub: 'La chasse au trésor de Luffy', desc: attr('one-piece').long, rating: '1,10 m min.', a: 'one-piece' },
  { img: 'squid', tag: 'ATTRACTION', title: 'Squid Game', sub: '1, 2, 3 Soleil & le pont de verre', desc: "Deux épreuves cultes : avancez sans être repéré par les capteurs, puis traversez le pont de verre… en choisissant les bonnes plaques.", rating: 'Tous âges · 1,20 m pour le pont', a: 'squid-game-pont' }
];
let bbIdx = 0, bbTimer = null; const BB_T = 8000;
function renderBillboard() {
  $('#bbSlides').innerHTML = SLIDES.map((s, i) => `<div class="bb-slide${i === 0 ? ' on' : ''}"><img src="img/${s.img}.webp" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`).join('');
  $('#bbDots').innerHTML = SLIDES.map((s, i) => `<button role="tab" aria-label="${s.title}" data-bb="${i}" style="--t:${BB_T}ms"><i></i></button>`).join('');
  showSlide(0, false);
}
function showSlide(i, user) {
  bbIdx = (i + SLIDES.length) % SLIDES.length; const s = SLIDES[bbIdx];
  $$('.bb-slide').forEach((el, k) => el.classList.toggle('on', k === bbIdx));
  $$('#bbDots button').forEach((b, k) => { b.classList.toggle('on', k === bbIdx); b.classList.toggle('done', k < bbIdx); b.setAttribute('aria-selected', k === bbIdx); const ii = b.firstElementChild; ii.style.animation = 'none'; ii.offsetWidth; ii.style.animation = ''; });
  $('#bbContent').innerHTML = `<div class="bb-anim"><p class="bb-tag"><img src="img/logo-n.png" alt="">${s.tag}</p><h1 class="bb-title">${s.title}</h1><p class="bb-sub">${s.sub}</p><p class="bb-desc">${s.desc}</p>
    <div class="btns">${s.a ? `<button class="btn btn--white btn--lg" data-attraction="${s.a}">${icon('play')} Découvrir</button>` : `<a class="btn btn--white btn--lg" href="#decouvrir" data-link>${icon('play')} Découvrir le parc</a>`}
    <a class="btn btn--gray btn--lg" href="#billets" data-link>${icon('ticket')} Acheter mes billets</a></div></div>`;
  let r = $('.bb-rating'); if (!r) { $('#billboard').insertAdjacentHTML('beforeend', '<span class="bb-rating"></span>'); r = $('.bb-rating'); }
  r.textContent = s.rating;
  clearTimeout(bbTimer);
  if (!RM && !document.body.classList.contains('intro-on')) bbTimer = setTimeout(() => showSlide(bbIdx + 1), BB_T);
  if (user) $$('#bbDots button i').forEach(x => x.style.animationPlayState = 'running');
}
function startBillboard() { showSlide(bbIdx); }

/* ----------------------------------------------------------------- Rendu */
function renderStatic() {
  $('#megaUniverses').innerHTML = D.universes.map(u => `<a class="mega__card" href="#univers-${u.slug}" data-link>${pic(u.img, '')}<span>${u.name}</span></a>`).join('');
  renderBillboard();
  $('#homeUniverses').innerHTML = D.universes.map(uniTile).join('');
  $('#homeTop').innerHTML = [...D.attractions].sort((a, b) => a.rank - b.rank).map(topCard).join('');
  $('#homeSoon').innerHTML = D.soon.map(soonTile).join('');
  $('#homeOffers').innerHTML = D.offers.map(offerCard).join('');
  $('#homeFood').innerHTML = D.restaurants.map(r => `<div class="fcard">${pic(r.img, r.name)}<small>${r.kind}</small><h3>${r.name}</h3><p>${r.desc}</p></div>`).join('');
  $('#teaserPins').innerHTML = D.attractions.map(a => `<i style="left:${a.x / 16.99}%;top:${a.y / 9.26}%;animation-delay:${(a.rank * .23) % 2}s"></i>`).join('');
  $('#foodGrid').innerHTML = D.restaurants.map(foodCard).join('');

  // Univers
  $('#universeJump').innerHTML = D.universes.map(u => `<a class="pill" href="#univers-${u.slug}" data-link>${u.name}</a>`).join('');
  $('#universeSections').innerHTML = D.universes.map(u => {
    const list = D.attractions.filter(a => a.universe === u.slug), food = D.restaurants.filter(r => r.universe === u.slug);
    return `<section class="usec" id="univers-${u.slug}" style="--c:${u.accent}"><div class="usec__bg">${pic(u.img, '')}</div>
      <div class="wrap"><div class="usec__in"><span class="usec__place reveal">${u.place}</span><h2 class="reveal">${u.name}</h2><p class="lead reveal">${u.desc}</p>
      <div class="ulist reveal">${list.map(a => `<button data-attraction="${a.slug}">${pic(a.img, '')}<span><strong>${a.name} – ${a.sub}</strong><small>${a.type} · ${a.age}</small></span>${icon('chevr')}</button>`).join('')}
      ${food.map(r => `<div>${pic(r.img, '')}<span><strong>${r.name}</strong><small>Restaurant · ${r.kind}</small></span></div>`).join('')}</div>
      <div class="btns reveal"><button class="btn btn--red" data-onmap="${list[0].slug}">${icon('map')} Voir sur le plan</button><a class="btn btn--gray" href="#billets" data-link>Réserver</a></div></div></div></section>`;
  }).join('');
  $('#fUniverse').insertAdjacentHTML('beforeend', D.universes.map(u => `<option value="${u.slug}">${u.name}</option>`).join(''));

  // Spectacles
  const EVENTS = [
    { name: 'Le Grand Spectacle du Soir', kind: 'Tous les soirs', img: 'aerial', fx: true, when: 'À la fermeture du parc', where: 'Place centrale', dur: '25 min', desc: "Un spectacle son et lumière sur la place centrale : projections, musique et feux d'artifice réunissent tous les univers du parc pour le final de la journée." },
    { name: "Halloween : le Monde à l'envers", kind: 'Événement saisonnier', img: 'stranger-door', when: 'Du 3 octobre au 2 novembre', where: 'Tout le parc', dur: "Jusqu'à 21 h", desc: "Le Monde à l'envers s'échappe de la zone Stranger Things : brume, lumières rouges, créatures dans les allées et maison hantée dans le noir complet.", book: 'special' },
    { name: 'Noël à Netflix World', kind: 'Événement saisonnier', img: 'hotel', when: 'Du 28 novembre au 4 janvier', where: "Hôtel Netflix & place centrale", dur: "Jusqu'à 21 h", desc: "Illuminations sur la façade de l'Hôtel Netflix, marché de Noël et spectacle du soir aux couleurs de l'hiver." },
    { name: 'Rencontre avec la mascotte', kind: 'Tous les jours', img: 'arch', when: '10 h 30 · 13 h 30 · 16 h', where: 'Entrée du parc', dur: '20 min', desc: "Notre N rouge à casquette vient saluer les visiteurs et poser pour les photos à l'entrée du parc." }
  ];
  $('#eventsList').innerHTML = EVENTS.map(e => `<article class="event reveal"><div class="event__media">${pic(e.img, e.name)}${e.fx ? '<canvas data-fx="fireworks" aria-hidden="true"></canvas>' : ''}</div>
    <div class="event__body"><p class="kicker">${e.kind}</p><h3>${e.name}</h3><p class="lead">${e.desc}</p>
    <div class="facts"><span>${icon('cal')} ${e.when}</span><span>${icon('pin')} ${e.where}</span><span>${icon('clock')} ${e.dur}</span></div>
    <div class="btns"><button class="btn btn--red" data-book="${e.book || '1jour'}">Réserver ma date</button></div></div></article>`).join('');

  // Billets
  $('#pageOffers').innerHTML = D.offers.map(offerCard).join('');
  $('#bkFormulas').innerHTML = D.offers.map(o => `<label class="bf"><input type="radio" name="formula" value="${o.id}"><span><strong>${o.name}</strong><small>dès ${o.price} €</small></span></label>`).join('');

  // Hôtel
  $('#floors').innerHTML = D.hotelFloors.map((f, i) => `<article class="floor reveal" style="--d:${i * .08}s"><div class="floor__imgs">${f.imgs.map(n => pic(n, '')).join('')}</div>
    <span class="floor__n">${f.n}</span><small>Étage ${f.n} · ${f.mix}</small><h3>${f.name}</h3></article>`).join('');

  // Infos
  const SV = [['locker', 'Consignes', "Près de l'entrée"], ['stroller', 'Poussettes', 'Location à la journée'], ['access', 'Accès PMR', 'Pass accès facilité'], ['first', 'Premiers secours', 'Près de la place centrale'], ['baby', 'Espace bébé', 'Change et allaitement'], ['food', '5 restaurants', 'Un par univers ou presque'], ['shop', 'Boutique', 'Produits dérivés'], ['wifi', 'Wi-Fi', 'Gratuit dans le parc'], ['atm', 'Distributeurs', "À l'entrée"], ['bed', 'Hôtel Netflix', 'Dans le parc']];
  $('#services').innerHTML = SV.map(([i, t, s]) => `<div class="svc">${icon(i, 'ic--lg')}<strong>${t}</strong><span>${s}</span></div>`).join('');
  $('#faq').innerHTML = D.faq.map(([q, a], i) => `<div class="faq__i"><button class="faq__q" aria-expanded="false" aria-controls="fa${i}">${q}${icon('plus')}</button><div class="faq__a" id="fa${i}" role="region"><div><p>${a}</p></div></div></div>`).join('');

  $$('[data-bg]').forEach(el => el.insertAdjacentHTML('afterbegin', `<div class="phero__bg"><img src="${el.dataset.bg}" alt=""></div>`));
}

function renderToday() {
  const s = dayStatus(TODAY);
  $('#todayDot').classList.toggle('is-closed', !s.open);
  $('#todayText').textContent = s.open ? `Ouvert aujourd'hui · ${s.hours}` : 'Fermé aujourd’hui';
  $('#homeHours').textContent = s.open ? `Aujourd'hui : ${s.hours}` : 'Fermé aujourd’hui';
}

/* ------------------------------------------------------------ Calendrier UI */
let calMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), calSel = new Date(TODAY);
const CAL_MIN = +calMonth, CAL_MAX = +new Date(TODAY.getFullYear() + 1, 11, 1);
function renderCalendar() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  let c = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(d => `<div class="cal__dow">${d}</div>`).join('') + '<div></div>'.repeat(first);
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d), s = dayStatus(dt);
    c += `<button class="cal__d ${s.type} ${+dt === +calSel ? 'sel' : ''}" data-day="${iso(dt)}" aria-label="${longDate(dt)} : ${s.hours}" ${dt < TODAY ? 'disabled' : ''}>${d}<small>${s.open ? s.hours.split(' – ')[0].replace(' ', '') : '—'}</small></button>`;
  }
  $('#calendar').innerHTML = `<div class="cal__h"><button data-cal="-1" aria-label="Mois précédent" ${+calMonth <= CAL_MIN ? 'disabled style="opacity:.3"' : ''}>${icon('chevl')}</button><h3>${calMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3><button data-cal="1" aria-label="Mois suivant" ${+calMonth >= CAL_MAX ? 'disabled style="opacity:.3"' : ''}>${icon('chevr')}</button></div><div class="cal__g">${c}</div>`;
  const s = dayStatus(calSel);
  $('#dayInfo').innerHTML = `<strong>${longDate(calSel)}</strong><span>${s.open ? s.hours : 'Parc fermé'}</span><p>${s.label}</p>${s.open ? `<p style="margin-top:14px"><button class="btn btn--red btn--sm" data-book-date="${iso(calSel)}">Réserver ce jour</button></p>` : ''}`;
}
function renderSchedule() {
  const now = new Date(), s = dayStatus(TODAY), mins = now.getHours() * 60 + now.getMinutes();
  $('#nowLine').textContent = s.open ? `Aujourd'hui ${s.hours}` : "Parc fermé aujourd'hui : voici le programme type d'une journée d'ouverture.";
  const SCH = [['Rencontre', 'La mascotte', "Entrée du parc", ['10:30', '13:30', '16:00']], ['Épreuve spéciale', '1, 2, 3 Soleil géant', 'Squid Game', ['12:00', '16:30']], ['Grand spectacle', 'Le Grand Spectacle du Soir', 'Place centrale', ['Fermeture']]];
  $('#schedule').innerHTML = SCH.map(([k, n, w, t]) => { let nx = false; return `<div class="slot"><small>${k}</small><h3>${n}</h3><p>${w}</p><div class="slot__t">${t.map(x => {
    if (!s.open || !x.includes(':')) return `<span>${x}</span>`; const [h, mm] = x.split(':').map(Number), tm = h * 60 + mm;
    if (tm < mins) return `<span class="past">${x.replace(':', 'h')}</span>`; if (!nx) { nx = true; return `<span class="next">${x.replace(':', 'h')}</span>`; } return `<span>${x.replace(':', 'h')}</span>`; }).join('')}</div></div>`; }).join('');
}
function renderAttractions() {
  const q = $('#fSearch').value.trim().toLowerCase(), u = $('#fUniverse').value, c = $('#fCat').value, h = +$('#fHeight').value;
  const list = D.attractions.filter(a => (u === 'all' || a.universe === u) && (c === 'all' || a.cat === c) && a.height < h && (!q || (a.name + a.sub + a.type + a.desc).toLowerCase().includes(q))).sort((a, b) => a.rank - b.rank);
  $('#fCount').textContent = `${list.length} attraction${list.length > 1 ? 's' : ''}`;
  $('#attractionGrid').innerHTML = list.length ? list.map(attractionCard).join('') : `<div class="empty"><h3 class="h3">Aucune attraction</h3><button class="btn btn--gray" id="fReset">Réinitialiser les filtres</button></div>`;
}

/* ================================================================ PLAN */
const CATS = {
  attr: { label: 'Attractions', c: '#e50914' }, food: { label: 'Restaurants', c: '#f5a623' }, show: { label: 'Spectacle', c: '#9b59ff' },
  shop: { label: 'Boutique', c: '#e5b80b' }, hotel: { label: 'Hôtel', c: '#c9a227' }, service: { label: 'Services', c: '#6d6d6e' }, soon: { label: 'Bientôt', c: '#ffffff' }
};
const SV_ICON = { entree: 'pin', secours: 'first', wc1: 'baby', wc2: 'baby', consignes: 'locker' };
const POIS = [
  ...D.attractions.map(a => ({ id: a.slug, cat: 'attr', name: a.name, sub: a.sub, x: a.x, y: a.y, img: a.img, desc: a.long, a, kicker: a.type, height: a.height })),
  ...D.restaurants.map(r => ({ id: 'r-' + r.id, cat: 'food', name: r.name, sub: r.kind, x: r.x, y: r.y, img: r.img, desc: r.desc, kicker: 'Restaurant' })),
  ...D.pois.map(p => ({ id: p.id, cat: p.cat, name: p.name, sub: CATS[p.cat].label, x: p.x, y: p.y, img: p.img, desc: p.desc, kicker: CATS[p.cat].label })),
  ...D.soon.map(s => ({ id: 's-' + s.id, cat: 'soon', name: s.name, sub: s.when, x: s.x, y: s.y, img: s.img, desc: s.desc, kicker: s.when, r: s.r }))
];
const poi = id => POIS.find(p => p.id === id);
const LABELS = [
  [110, 38, 298, 84, 'Stranger Things', 'Univers'], [466, 24, 608, 70, 'The Witcher', 'Univers'], [722, 8, 972, 54, 'Zone Racing', 'Bientôt', 1],
  [1382, 46, 1518, 96, 'Squid Game', 'Univers'], [1004, 128, 1218, 176, 'Outer Banks & Lupin', 'Univers'], [62, 372, 172, 420, 'One Piece', 'Univers'],
  [152, 568, 322, 634, 'Bridgerton', 'Univers'], [1026, 602, 1162, 672, 'Kids Zone', '2027', 1], [1160, 724, 1268, 790, 'Boutique', 'Shopping'],
  [1524, 578, 1668, 622, 'Hôtel Netflix', 'Hôtel'], [1316, 724, 1505, 880, '4 étages thématiques', 'Hôtel Netflix']
];
const ENTRY = { x: 850, y: 760 }, M_PER_PX = .65, WALK = 75; // m/min
const MAP = { z: 1, x: 0, y: 0, min: .3, max: 4, ready: false, sel: null, cats: new Set(Object.keys(CATS)), h: 999, route: store.get('nwRoute', []).filter(id => POIS.some(p => p.id === id)) };
const W = 1699, H = 926;

function mapInit() {
  if (MAP.ready) { mapFit(false); return; }
  MAP.ready = true;
  $('#mapLabels').innerHTML = LABELS.map(([x1, y1, x2, y2, t, s, soon]) => `<div class="mlabel${soon ? ' mlabel--soon' : ''}" style="left:${x1}px;top:${y1}px;width:${x2 - x1}px;height:${y2 - y1}px"><span><small>${s}</small>${t}</span></div>`).join('');
  $('#mCats').innerHTML = Object.entries(CATS).map(([k, c]) => `<button class="mcat on" data-cat="${k}" style="--c:${c.c}" aria-pressed="true"><i></i>${c.label} <b>${POIS.filter(p => p.cat === k).length}</b></button>`).join('');
  renderPins(); renderMapList(); renderRoute();
  const st = $('#mapstage');
  // Glisser / pincer
  const pts = new Map(); let start = null, moved = 0;
  st.addEventListener('pointerdown', e => {
    if (e.target.closest('.mapctl,.mapcard')) return;
    st.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0; start = { x: MAP.x, y: MAP.y, z: MAP.z, pts: new Map(pts) }; st.classList.add('drag');
  });
  st.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const r = st.getBoundingClientRect();
    if (pts.size === 1 && start.pts.size === 1) {
      const p0 = [...start.pts.values()][0], p = [...pts.values()][0];
      moved = Math.max(moved, Math.hypot(p.x - p0.x, p.y - p0.y));
      MAP.x = start.x + p.x - p0.x; MAP.y = start.y + p.y - p0.y; applyMap();
    } else if (pts.size === 2) {
      if (start.pts.size !== 2) start = { x: MAP.x, y: MAP.y, z: MAP.z, pts: new Map(pts) };
      const [a0, b0] = [...start.pts.values()], [a, b] = [...pts.values()];
      const d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y), d = Math.hypot(a.x - b.x, a.y - b.y);
      const c0 = { x: (a0.x + b0.x) / 2 - r.left, y: (a0.y + b0.y) / 2 - r.top }, c = { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top };
      const z = clampZ(start.z * d / d0), wx = (c0.x - start.x) / start.z, wy = (c0.y - start.y) / start.z;
      MAP.z = z; MAP.x = c.x - wx * z; MAP.y = c.y - wy * z; moved = 99; applyMap();
    }
  });
  const up = e => { pts.delete(e.pointerId); if (!pts.size) st.classList.remove('drag'); start = { x: MAP.x, y: MAP.y, z: MAP.z, pts: new Map(pts) }; };
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  st.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  st.addEventListener('wheel', e => { e.preventDefault(); const r = st.getBoundingClientRect(); zoomAt(MAP.z * Math.pow(1.0015, -e.deltaY), e.clientX - r.left, e.clientY - r.top); hideHint(); }, { passive: false });
  st.addEventListener('keydown', e => {
    const k = e.key, step = 80;
    if (k === 'ArrowLeft') MAP.x += step; else if (k === 'ArrowRight') MAP.x -= step; else if (k === 'ArrowUp') MAP.y += step; else if (k === 'ArrowDown') MAP.y -= step;
    else if (k === '+' || k === '=') { zoomCenter(1.3); return; } else if (k === '-') { zoomCenter(1 / 1.3); return; } else return;
    e.preventDefault(); applyMap(true);
  });
  addEventListener('resize', () => { if (current === 'plan') mapFit(false); });
  $('#mapFull').addEventListener('click', () => { const el = $('#mapapp'); try { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } catch (e) {} });
  document.addEventListener('fullscreenchange', () => setTimeout(() => mapFit(false), 120));
  mapFit(false);
}
const clampZ = z => Math.min(MAP.max, Math.max(MAP.min, z));
function mapFit(anim) {
  const st = $('#mapstage'), r = st.getBoundingClientRect(); if (!r.width) return;
  MAP.min = Math.min(r.width / W, r.height / H);
  const cover = Math.max(r.width / W, r.height / H);
  const z0 = r.width < 700 ? cover : Math.min(cover, MAP.min * 1.08); MAP.z = z0; MAP.x = (r.width - W * z0) / 2; MAP.y = (r.height - H * z0) / 2; applyMap(anim);
}
function applyMap(anim) {
  const st = $('#mapstage'), r = st.getBoundingClientRect(), w = W * MAP.z, h = H * MAP.z;
  MAP.x = w <= r.width ? (r.width - w) / 2 : Math.min(0, Math.max(r.width - w, MAP.x));
  MAP.y = h <= r.height ? (r.height - h) / 2 : Math.min(0, Math.max(r.height - h, MAP.y));
  const wd = $('#mapworld');
  wd.style.transition = anim && !RM ? 'transform .6s cubic-bezier(.2,.8,.2,1)' : 'none';
  wd.style.transform = `translate(${MAP.x}px,${MAP.y}px) scale(${MAP.z})`;
  wd.style.setProperty('--ps', (1 / MAP.z * Math.min(1.15, Math.max(.75, MAP.z))).toFixed(3));
  st.classList.toggle('zoomed', MAP.z > 1.6);
}
function zoomAt(z, cx, cy, anim) { z = clampZ(z); const wx = (cx - MAP.x) / MAP.z, wy = (cy - MAP.y) / MAP.z; MAP.z = z; MAP.x = cx - wx * z; MAP.y = cy - wy * z; applyMap(anim); }
function zoomCenter(f) { const r = $('#mapstage').getBoundingClientRect(); zoomAt(MAP.z * f, r.width / 2, r.height / 2, true); }
function flyTo(x, y, z) { const r = $('#mapstage').getBoundingClientRect(); MAP.z = clampZ(z || Math.max(MAP.z, 1.6)); MAP.x = r.width / 2 - x * MAP.z; MAP.y = r.height / 2 - y * MAP.z; applyMap(true); }
function hideHint() { const h = $('.maphint'); if (h) h.style.opacity = 0; }

function pinIcon(p) {
  if (p.cat === 'attr') return `<b>${p.a.rank}</b>`;
  return icon({ food: 'food', show: 'spark', shop: 'shop', hotel: 'bed', soon: 'clock', service: SV_ICON[p.id] || 'info' }[p.cat]);
}
function renderPins() {
  const soonZones = POIS.filter(p => p.cat === 'soon').map(p => `<button class="zone-soon" data-poi="${p.id}" style="left:${p.x}px;top:${p.y}px;width:${p.r * 2}px;height:${p.r * 2}px" aria-label="${p.name}, ${p.sub}"><span>Bientôt</span></button>`).join('');
  $('#mapLayer').innerHTML = soonZones + `<span class="youarehere" style="left:${ENTRY.x}px;top:${ENTRY.y + 40}px" title="Vous êtes ici"></span>` +
    POIS.filter(p => p.cat !== 'soon').map(p => `<button class="pin" data-poi="${p.id}" data-cat="${p.cat}" style="left:${p.x}px;top:${p.y}px;--c:${CATS[p.cat].c}" aria-label="${p.name}${p.sub ? ', ' + p.sub : ''}"><span class="pin__b">${pinIcon(p)}</span><span class="pin__l">${p.name}</span></button>`).join('');
  updatePins();
}
function poiVisible(p) {
  const q = ($('#mSearch')?.value || '').trim().toLowerCase();
  return MAP.cats.has(p.cat) && (!q || (p.name + ' ' + (p.sub || '')).toLowerCase().includes(q));
}
const tooTall = p => p.cat === 'attr' && p.height > MAP.h;
function updatePins() {
  $$('#mapLayer [data-poi]').forEach(el => {
    const p = poi(el.dataset.poi);
    el.classList.toggle('hide', !poiVisible(p)); el.classList.toggle('off', tooTall(p)); el.classList.toggle('on', MAP.sel === p.id);
    const step = MAP.route.indexOf(p.id); el.querySelector('.pin__step')?.remove();
    if (step > -1 && el.classList.contains('pin')) el.insertAdjacentHTML('beforeend', `<span class="pin__step">${step + 1}</span>`);
  });
}
function renderMapList() {
  const order = Object.keys(CATS);
  const list = POIS.filter(poiVisible).sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat) || (a.a?.rank || 0) - (b.a?.rank || 0));
  $('#mList').innerHTML = list.length ? list.map(p => `<li><button data-poi="${p.id}" class="${MAP.sel === p.id ? 'on' : ''}" style="--c:${CATS[p.cat].c}">${p.img ? pic(p.img, '') : `<span class="mi">${icon(SV_ICON[p.id] || 'info')}</span>`}
    <span class="${tooTall(p) ? 'off' : ''}"><strong>${p.name}${p.cat === 'soon' ? '<span class="soon">BIENTÔT</span>' : ''}</strong><small>${p.cat === 'attr' ? p.sub + ' · ' + p.a.age : p.sub}</small></span></button></li>`).join('')
    : '<li class="route-empty">Aucun lieu ne correspond.</li>';
}
function selectPoi(id, fly = true) {
  const p = poi(id); if (!p) return;
  MAP.sel = id; updatePins(); renderMapList();
  if (fly) flyTo(p.x, p.y, Math.max(MAP.z, 1.5));
  const inRoute = MAP.route.includes(id), canRoute = p.cat !== 'soon' && p.cat !== 'service';
  const card = $('#mapCard'); card.hidden = false; card.style.setProperty('--c', CATS[p.cat].c === '#ffffff' ? '#e50914' : CATS[p.cat].c);
  card.innerHTML = `${p.img ? `<div class="mapcard__img">${pic(p.img, p.name)}<button class="mapcard__x" data-mapclose aria-label="Fermer">${icon('close')}</button></div>` : `<button class="mapcard__x" data-mapclose aria-label="Fermer" style="position:absolute">${icon('close')}</button>`}
    <div class="mapcard__b"><span class="mapcard__k">${p.kicker}</span><h3>${p.name}${p.cat === 'attr' ? `<br><span style="font-size:.6em;color:#bbb">${p.sub}</span>` : ''}</h3><p>${p.desc}</p>
    ${p.cat === 'attr' ? `<div class="meta"><span class="${tooTall(p) ? 'warn' : ''}">${icon('ruler', 'ic--sm')} ${p.a.age}</span><span>${icon('clock', 'ic--sm')} ${p.a.duration}</span><span>${thrill(p.a.thrill)}</span></div>` : ''}
    ${tooTall(p) ? '<p style="color:#ff7b82;font-weight:600;font-size:13.5px">Taille minimale non atteinte pour votre enfant.</p>' : ''}
    <div class="btns">${canRoute ? `<button class="btn ${inRoute ? 'btn--gray' : 'btn--red'} btn--sm" data-route="${id}">${inRoute ? icon('check') + ' Dans le parcours' : icon('plus') + ' Parcours'}</button>` : ''}
    ${p.cat === 'attr' ? `<button class="btn btn--white btn--sm" data-attraction="${p.a.slug}">Fiche</button>` : ''}${p.cat === 'hotel' ? '<a class="btn btn--white btn--sm" href="#hotel" data-link>Voir l’hôtel</a>' : ''}</div></div>`;
}
function closeCard() { $('#mapCard').hidden = true; MAP.sel = null; updatePins(); renderMapList(); }
function toggleRoute(id) {
  const i = MAP.route.indexOf(id); i > -1 ? MAP.route.splice(i, 1) : MAP.route.push(id);
  store.set('nwRoute', MAP.route); renderRoute(); if (MAP.sel === id) selectPoi(id, false);
}
function routeStats() {
  let d = 0, prev = ENTRY;
  MAP.route.forEach(id => { const p = poi(id); d += Math.hypot(p.x - prev.x, p.y - prev.y); prev = p; });
  if (MAP.route.length) d += Math.hypot(prev.x - ENTRY.x, prev.y - ENTRY.y);
  const m = Math.round(d * M_PER_PX / 10) * 10;
  return { m, min: Math.max(1, Math.round(m / WALK)) };
}
function renderRoute() {
  $('#routeCount').textContent = MAP.route.length;
  $('#routeList').innerHTML = MAP.route.length ? MAP.route.map((id, i) => { const p = poi(id); return `<li><span>${p.name}${p.cat === 'attr' ? ' – ' + p.sub : ''}</span>
    <button data-rmove="${i}" data-dir="-1" aria-label="Monter" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button><button data-rmove="${i}" data-dir="1" aria-label="Descendre" ${i === MAP.route.length - 1 ? 'disabled' : ''}>${icon('down')}</button><button data-route="${id}" aria-label="Retirer">${icon('trash')}</button></li>`; }).join('')
    : '<li class="route-empty">Votre parcours est vide. Cliquez sur un lieu du plan puis sur « + Parcours ».</li>';
  const s = routeStats();
  $('#routeSum').innerHTML = MAP.route.length ? `<span>${icon('walk')} ${s.min} min de marche</span><span>${icon('pin')} ${s.m >= 1000 ? (s.m / 1000).toFixed(1).replace('.', ',') + ' km' : s.m + ' m'}</span><span>${MAP.route.length} étape${MAP.route.length > 1 ? 's' : ''}</span>` : '';
  const pts = [ENTRY, ...MAP.route.map(poi), ...(MAP.route.length ? [ENTRY] : [])];
  $('#mapRoute').innerHTML = MAP.route.length ? `<polyline points="${pts.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${pts.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#e50914" stroke-width="5" stroke-dasharray="14 10" stroke-linejoin="round" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="48" to="0" dur="1.2s" repeatCount="indefinite"/></polyline>` : '';
  if (MAP.ready) updatePins();
}
function optimizeRoute() {
  const left = [...MAP.route], out = []; let cur = ENTRY;
  while (left.length) { left.sort((a, b) => { const A = poi(a), B = poi(b); return Math.hypot(A.x - cur.x, A.y - cur.y) - Math.hypot(B.x - cur.x, B.y - cur.y); }); const n = left.shift(); out.push(n); cur = poi(n); }
  MAP.route = out; store.set('nwRoute', out); renderRoute();
}

/* ------------------------------------------------------------- Réservation */
const BK = { formula: '1jour', date: null, nights: 1, adults: 2, kids: 2, babies: 0, parking: false, pass: false, meal: false };
const days = () => BK.formula === '2jours' ? 2 : BK.formula === 'sejour' ? BK.nights + 1 : 1;
const outsideHalloween = s => { const d = fromIso(s), k = (d.getMonth() + 1) * 100 + d.getDate(); return k < 1003 || k > 1102; };
function checkDates() {
  if (!BK.date) return 'Choisissez une date.';
  const d = fromIso(BK.date); if (d < TODAY) return 'Cette date est passée.';
  for (let i = 0; i < days(); i++) { const x = new Date(d); x.setDate(d.getDate() + i); if (!dayStatus(x).open) return `Le parc est fermé le ${x.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}.`; }
  if (BK.formula === 'special' && outsideHalloween(BK.date)) return "La soirée Monde à l'envers n'est valable que du 3 octobre au 2 novembre.";
  return '';
}
function compute() {
  const o = D.offers.find(x => x.id === BK.formula), n = days(), ppl = BK.adults + BK.kids, L = [];
  if (BK.formula === 'famille') { L.push(['Pass Famille (2 adultes + 2 enfants)', 199]); if (BK.adults > 2) L.push([`${BK.adults - 2} adulte(s) en plus`, (BK.adults - 2) * 59]); if (BK.kids > 2) L.push([`${BK.kids - 2} enfant(s) en plus`, (BK.kids - 2) * 52]); }
  else if (BK.formula === 'sejour') { if (BK.adults) L.push([`${BK.adults} adulte(s) × ${BK.nights} nuit(s)`, BK.adults * 189 * BK.nights]); if (BK.kids) L.push([`${BK.kids} enfant(s) × ${BK.nights} nuit(s)`, BK.kids * 119 * BK.nights]); }
  else { if (BK.adults) L.push([`${BK.adults} adulte(s) × ${o.price} €`, BK.adults * o.price]); if (BK.kids) L.push([`${BK.kids} enfant(s) × ${o.child} €`, BK.kids * o.child]); }
  if (BK.babies) L.push([`${BK.babies} bébé(s)`, 0]);
  if (BK.parking) L.push([BK.formula === 'sejour' ? 'Parking (inclus)' : `Parking × ${n} j`, BK.formula === 'sejour' ? 0 : 15 * n]);
  if (BK.pass) L.push([`Coupe-file × ${ppl} × ${n} j`, 35 * ppl * n]);
  if (BK.meal) L.push([`Déjeuner × ${ppl} × ${n} j`, 18 * ppl * n]);
  return { o, L, total: L.reduce((s, l) => s + l[1], 0), n };
}
function renderBooking() {
  $$('input[name=formula]').forEach(r => r.checked = r.value === BK.formula);
  $('#bkNightsWrap').hidden = BK.formula !== 'sejour'; $('#bkNights').value = BK.nights;
  $('#bkDate').value = BK.date || '';
  $('#qAdults').textContent = BK.adults; $('#qKids').textContent = BK.kids; $('#qBabies').textContent = BK.babies;
  $$('.qty').forEach(q => { const k = q.dataset.qty; q.querySelector('[data-d="-1"]').disabled = BK[k] <= 0; q.querySelector('[data-d="1"]').disabled = BK[k] >= 10; });
  $('#oParking').checked = BK.parking; $('#oPass').checked = BK.pass; $('#oMeal').checked = BK.meal;
  const err = checkDates(), info = $('#bkDateInfo');
  info.className = 'bdate ' + (BK.date ? (err ? 'ko' : 'ok') : ''); info.textContent = BK.date ? (err || `Ouvert ${dayStatus(fromIso(BK.date)).hours}`) : '';
  const { o, L, total, n } = compute();
  $('#sumImg').style.backgroundImage = `url(img/${o.img}.webp)`; $('#sumTitle').textContent = o.name;
  if (BK.date) { const d = fromIso(BK.date), e = new Date(d); e.setDate(d.getDate() + n - 1); $('#sumDate').textContent = n > 1 ? `Du ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${longDate(e)}` : longDate(d); } else $('#sumDate').textContent = 'Date à choisir';
  $('#sumLines').innerHTML = L.length ? L.map(([t, v]) => `<li><span>${t}</span><span>${v ? euro(v) : 'Gratuit'}</span></li>`).join('') : '<li><span>Ajoutez un visiteur</span></li>';
  $('#sumTotal').textContent = euro(total); $('#sumErr').textContent = '';
}
function goBook(p = {}) {
  Object.assign(BK, p);
  if (!BK.date) BK.date = iso(nextOpen());
  if (BK.formula === 'special' && outsideHalloween(BK.date)) { let y = TODAY.getFullYear(); if (TODAY > new Date(y, 10, 2)) y++; BK.date = iso(new Date(y, 9, 3)); }
  navigate('billets', () => { renderBooking(); scrollToEl($('#configurator')); });
}

/* ----------------------------------------------------------------- Modale */
let lastFocus = null;
function openModal(html) { lastFocus = document.activeElement; $('#modalBody').innerHTML = html; $('#modal').hidden = false; document.body.style.overflow = 'hidden'; setTimeout(() => $('.modal__x').focus(), 30); }
function closeModal() { if ($('#modal').hidden) return; $('#modal').hidden = true; document.body.style.overflow = document.body.classList.contains('intro-on') ? 'hidden' : ''; lastFocus?.focus?.(); }
function attractionModal(slug) {
  const a = attr(slug); if (!a) return; const u = uni(a.universe);
  openModal(`<div class="md__hero">${pic(a.img, a.name)}<div class="md__ht"><h2 id="modalTitle">${a.name}</h2><p>${a.sub}</p>
    <div class="btns"><button class="btn btn--white" data-book="1jour">${icon('ticket')} Réserver</button><button class="btn btn--gray" data-onmap="${a.slug}">${icon('map')} Voir sur le plan</button></div></div></div>
    <div class="md__body"><div><div class="meta"><span class="${a.height >= 120 ? 'warn' : ''}">${a.age}</span><span>${a.duration}</span><span>${thrill(a.thrill)}</span></div><p>${a.long}</p></div>
    <div class="md__side"><span>Univers : <b>${u.name}</b></span><span>Type : <b>${a.type}</b></span><span>Taille : <b>${hLabel(a.height)}</b></span><span>À vivre : <b>${a.features.join(', ')}</b></span></div></div>`);
}

/* ------------------------------------------------------------------ Routeur */
const PAGES = $$('.page').map(p => p.dataset.page);
let current = null, pendingAfter = null;
function resolve(h) {
  h = (h || '').replace('#', '') || 'accueil';
  if (PAGES.includes(h)) return { page: h };
  const el = document.getElementById(h), pg = el && el.closest('.page');
  return pg ? { page: pg.dataset.page, anchor: el } : { page: 'accueil' };
}
function scrollToEl(el) { if (!el) return; scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: RM ? 'auto' : 'smooth' }); }
function showPage(r, after) {
  const swap = () => {
    $$('.page').forEach(p => p.hidden = p.dataset.page !== r.page);
    const pg = $(`.page[data-page="${r.page}"]`); document.title = pg.dataset.title; document.body.dataset.page = r.page;
    $$('.nav__link[href]').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + r.page));
    current = r.page;
    if (r.page === 'attractions') renderAttractions();
    if (r.page === 'spectacles') renderSchedule();
    if (r.page === 'billets') renderBooking();
    if (r.page === 'infos') renderCalendar();
    observeReveals(pg);
    if (r.anchor) setTimeout(() => scrollToEl(r.anchor), 60); else scrollTo(0, 0);
    if (r.page === 'plan') requestAnimationFrame(mapInit);
    if (r.page === 'accueil') startBillboard(); else clearTimeout(bbTimer);
    onScroll(); startFx();
    after && setTimeout(after, 90);
  };
  if (current === r.page) { if (r.anchor) scrollToEl(r.anchor); after && after(); return; }
  if (current === null || RM) return swap();
  const c = $('#curtain'); c.classList.add('in');
  setTimeout(() => { swap(); setTimeout(() => c.classList.remove('in'), 120); }, 320);
}
function navigate(hash, after) { closeMenus(); closeModal(); if (location.hash === '#' + hash) showPage(resolve('#' + hash), after); else { pendingAfter = after; location.hash = hash; } }
addEventListener('hashchange', () => { const a = pendingAfter; pendingAfter = null; closeModal(); showPage(resolve(location.hash), a); });
function showOnMap(id) { navigate('plan', () => { mapInit(); setTimeout(() => selectPoi(id), 120); }); }

/* ---------------------------------------------------------- Animations */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); if (e.target.querySelector('[data-count]')) countUp(e.target); } }), { threshold: .12 }) : null;
function observeReveals(root) { $$('.reveal:not(.is-in)', root).forEach(el => io ? io.observe(el) : el.classList.add('is-in')); }
function countUp(root) { $$('[data-count]', root).forEach(el => { const to = +el.dataset.count, t0 = performance.now(); const st = t => { const p = Math.min(1, (t - t0) / (RM ? 1 : 1200)); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }); }
let ticking = false;
function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { document.body.classList.toggle('scrolled', scrollY > 30); ticking = false; }); }
addEventListener('scroll', onScroll, { passive: true });

class Fireworks {
  constructor(cv) { this.cv = cv; this.c = cv.getContext('2d'); this.p = []; this.on = false; this.t = 0; }
  size() { const r = this.cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); this.w = r.width; this.h = r.height; this.cv.width = r.width * d; this.cv.height = r.height * d; this.c.setTransform(d, 0, 0, d, 0, 0); }
  burst() { const x = this.w * (.15 + Math.random() * .7), y = this.h * (.1 + Math.random() * .35), col = ['#e50914', '#ff4d55', '#ffffff', '#f5c518', '#ff8a8f'][Math.random() * 5 | 0]; for (let i = 0; i < 70; i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 3.2; this.p.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, col }); } }
  frame() { if (!this.on) return; const c = this.c; c.globalCompositeOperation = 'destination-out'; c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, 0, this.w, this.h); c.globalCompositeOperation = 'lighter'; if (++this.t % 40 === 0) this.burst(); this.p = this.p.filter(q => q.l > 0); for (const q of this.p) { q.vx *= .985; q.vy = q.vy * .985 + .035; q.x += q.vx; q.y += q.vy; q.l -= .011; c.globalAlpha = Math.max(q.l, 0); c.fillStyle = q.col; c.beginPath(); c.arc(q.x, q.y, 1.8, 0, 6.3); c.fill(); } c.globalAlpha = 1; requestAnimationFrame(() => this.frame()); }
  start() { if (this.on) return; this.on = true; this.size(); this.burst(); this.frame(); } stop() { this.on = false; }
}
class Embers {
  constructor(cv) { this.cv = cv; this.c = cv.getContext('2d'); this.on = false; this.p = []; }
  size() { const r = this.cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); this.w = r.width; this.h = r.height; this.cv.width = r.width * d; this.cv.height = r.height * d; this.c.setTransform(d, 0, 0, d, 0, 0); if (!this.p.length) this.p = Array.from({ length: 60 }, () => this.mk(true)); }
  mk(i) { return { x: Math.random() * this.w, y: i ? Math.random() * this.h : this.h + 10, r: .6 + Math.random() * 1.8, s: .2 + Math.random() * .7, ph: Math.random() * 6 }; }
  frame() { if (!this.on) return; const c = this.c; c.clearRect(0, 0, this.w, this.h); for (const q of this.p) { q.y -= q.s; q.x += Math.sin(q.ph += .02) * .3; if (q.y < -10) Object.assign(q, this.mk()); c.globalAlpha = .3 + .5 * Math.sin(q.ph * 2) ** 2; c.fillStyle = '#ff3b3b'; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 6.3); c.fill(); } requestAnimationFrame(() => this.frame()); }
  start() { if (this.on) return; this.on = true; this.size(); this.frame(); } stop() { this.on = false; }
}
const fxIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { const f = e.target._fx; if (f) e.isIntersecting ? f.start() : f.stop(); })) : null;
function startFx() {
  if (RM || !fxIO) return;
  $$('canvas[data-fx="fireworks"]').forEach(cv => { if (!cv._fx) { cv._fx = new Fireworks(cv); fxIO.observe(cv); } });
  const h = $('#heroSparks'); if (h && !h._fx) { h._fx = new Embers(h); fxIO.observe(h); }
}
addEventListener('resize', () => $$('canvas').forEach(cv => cv._fx?.on && cv._fx.size()));

/* ------------------------------------------------------------------ Menus */
function closeMenus() {
  $$('.has-mega').forEach(m => { m.classList.remove('open'); m.querySelector('.nav__link').setAttribute('aria-expanded', 'false'); });
  const mm = $('#mobileMenu'); if (mm.classList.contains('open')) { mm.classList.remove('open'); mm.setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  $('#buddyPanel').hidden = true; $('#buddyBtn').setAttribute('aria-expanded', 'false');
}
$$('.has-mega').forEach(m => {
  const b = m.querySelector('.nav__link'); let t; const open = v => { m.classList.toggle('open', v); b.setAttribute('aria-expanded', v); };
  b.addEventListener('click', e => { e.stopPropagation(); open(!m.classList.contains('open')); });
  m.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) { clearTimeout(t); open(true); } });
  m.addEventListener('mouseleave', () => { t = setTimeout(() => open(false), 180); });
});
$('#burger').addEventListener('click', () => { const mm = $('#mobileMenu'); mm.classList.add('open'); mm.setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; $$('.mmenu__nav a').forEach((a, i) => a.style.transitionDelay = (.05 + i * .035) + 's'); setTimeout(() => $('#mclose').focus(), 50); });
$('#mclose').addEventListener('click', closeMenus);
$('#buddyBtn').addEventListener('click', e => { e.stopPropagation(); const p = $('#buddyPanel'); p.hidden = !p.hidden; $('#buddyBtn').setAttribute('aria-expanded', !p.hidden); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); else if (current === 'plan' && !$('#mapCard').hidden) closeCard(); else closeMenus(); } });

/* -------------------------------------------------------------- Clics */
document.addEventListener('click', e => {
  const t = e.target;
  if (!t.closest('.has-mega')) $$('.has-mega').forEach(m => { m.classList.remove('open'); m.querySelector('.nav__link').setAttribute('aria-expanded', 'false'); });
  if (!t.closest('.buddy')) { $('#buddyPanel').hidden = true; }
  const link = t.closest('a[href^="#"]');
  if (link && link.getAttribute('href').length > 1) { closeMenus(); closeModal(); if (link.getAttribute('href') === location.hash) { e.preventDefault(); showPage(resolve(location.hash)); } return; }
  let el;
  if ((el = t.closest('[data-attraction]'))) return attractionModal(el.dataset.attraction);
  if ((el = t.closest('[data-onmap]'))) { closeModal(); return showOnMap(el.dataset.onmap); }
  if ((el = t.closest('[data-soon]'))) return showOnMap('s-' + el.dataset.soon);
  if ((el = t.closest('[data-book]'))) { closeModal(); return goBook({ formula: el.dataset.book }); }
  if ((el = t.closest('[data-book-date]'))) return goBook({ date: el.dataset.bookDate, formula: BK.formula === 'special' ? '1jour' : BK.formula });
  if (t.closest('[data-close]')) return closeModal();
  if ((el = t.closest('[data-bb]'))) return showSlide(+el.dataset.bb, true);
  if ((el = t.closest('[data-slide]'))) { const tr = el.parentElement.querySelector('.slider__track'); return tr.scrollBy({ left: +el.dataset.slide * tr.clientWidth * .85, behavior: 'smooth' }); }
  if ((el = t.closest('.faq__q'))) { const it = el.parentElement, o = !it.classList.contains('open'); it.classList.toggle('open', o); return el.setAttribute('aria-expanded', o); }
  if ((el = t.closest('[data-cal]'))) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + +el.dataset.cal, 1); return renderCalendar(); }
  if ((el = t.closest('[data-day]'))) { calSel = fromIso(el.dataset.day); return renderCalendar(); }
  if (t.id === 'fReset') { ['fSearch'].forEach(i => $('#' + i).value = ''); ['fUniverse', 'fCat'].forEach(i => $('#' + i).value = 'all'); $('#fHeight').value = '999'; return renderAttractions(); }
  // Plan
  if ((el = t.closest('[data-mapclose]'))) return closeCard();
  if ((el = t.closest('[data-route]'))) return toggleRoute(el.dataset.route);
  if ((el = t.closest('[data-rmove]'))) { const i = +el.dataset.rmove, j = i + +el.dataset.dir; [MAP.route[i], MAP.route[j]] = [MAP.route[j], MAP.route[i]]; store.set('nwRoute', MAP.route); return renderRoute(); }
  if ((el = t.closest('[data-poi]'))) { hideHint(); return selectPoi(el.dataset.poi, !!el.closest('.mlist')); }
  if ((el = t.closest('.mcat'))) { const k = el.dataset.cat; MAP.cats.has(k) ? MAP.cats.delete(k) : MAP.cats.add(k); el.classList.toggle('on'); el.setAttribute('aria-pressed', MAP.cats.has(k)); updatePins(); return renderMapList(); }
  if ((el = t.closest('[data-z]'))) { const z = +el.dataset.z; return z ? zoomCenter(z > 0 ? 1.4 : 1 / 1.4) : mapFit(true); }
  if ((el = t.closest('.tab'))) { $$('.tab').forEach(b => { b.classList.toggle('is-on', b === el); b.setAttribute('aria-selected', b === el); }); $$('[data-pane]').forEach(p => p.hidden = p.dataset.pane !== el.dataset.tab); return; }
  if (t.id === 'routeOpt') return optimizeRoute();
  if (t.id === 'routeClear') { MAP.route = []; store.set('nwRoute', []); renderRoute(); if (MAP.sel) selectPoi(MAP.sel, false); return; }
  if (t.closest('#mapstage') && !t.closest('.mapcard,.mapctl') && !$('#mapCard').hidden) closeCard();
});
$('#mSearch').addEventListener('input', () => { updatePins(); renderMapList(); });
$('#mHeight').addEventListener('change', e => { MAP.h = +e.target.value; updatePins(); renderMapList(); if (MAP.sel) selectPoi(MAP.sel, false); });
$('#mapLayer').addEventListener('keydown', e => { const p = e.target.closest('[data-poi]'); if (p && e.key === 'Enter') selectPoi(p.dataset.poi); });

/* ------------------------------------------------------------ Formulaires */
const qbDate = $('#qbDate'); qbDate.min = iso(TODAY); qbDate.value = iso(nextOpen());
const qbCheck = () => { const s = dayStatus(fromIso(qbDate.value || iso(TODAY))), el = $('#qbStatus'); el.className = 'qb__status ' + (s.open ? 'ok' : 'ko'); el.textContent = s.open ? `Ouvert · ${s.hours}` : 'Parc fermé ce jour-là'; };
qbDate.addEventListener('change', qbCheck); qbCheck();
$('#quickbook').addEventListener('submit', e => { e.preventDefault(); if (!qbDate.value) return qbDate.focus(); goBook({ date: qbDate.value, adults: +$('#qbAdults').value, kids: +$('#qbKids').value, formula: BK.formula === 'special' ? '1jour' : BK.formula }); });
$('#bkDate').min = iso(TODAY);
$('#bookingForm').addEventListener('change', e => { const t = e.target;
  if (t.name === 'formula') BK.formula = t.value; if (t.id === 'bkDate') BK.date = t.value || null; if (t.id === 'bkNights') BK.nights = +t.value;
  if (t.id === 'oParking') BK.parking = t.checked; if (t.id === 'oPass') BK.pass = t.checked; if (t.id === 'oMeal') BK.meal = t.checked; renderBooking(); });
$('#bookingForm').addEventListener('click', e => { const b = e.target.closest('.qty__c button'); if (!b) return; const k = b.closest('.qty').dataset.qty; BK[k] = Math.max(0, Math.min(10, BK[k] + +b.dataset.d)); renderBooking(); });
$('#bookingForm').addEventListener('submit', e => { e.preventDefault();
  const err = checkDates() || (BK.adults + BK.kids === 0 ? 'Ajoutez au moins un visiteur.' : '') || (BK.formula === 'sejour' && !BK.adults ? 'Un séjour nécessite un adulte.' : '');
  if (err) { $('#sumErr').textContent = err; return; }
  const { o, total } = compute();
  openModal(`<div class="md-ok"><div class="md-ok__i">${icon('check')}</div><h2 id="modalTitle">Récapitulatif validé</h2><p class="lead">${o.name} · ${longDate(fromIso(BK.date))}<br>${BK.adults} adulte(s), ${BK.kids} enfant(s) · total indicatif <strong>${euro(total)}</strong></p>
    <span class="ref">NW-${Math.random().toString(36).slice(2, 8).toUpperCase()}</span><p class="muted">Projet conceptuel : aucune réservation ni aucun paiement n'est effectué, et aucune donnée n'est envoyée.</p><button class="btn btn--red" data-close>Fermer</button></div>`);
});
$('#contactForm').addEventListener('submit', e => { e.preventDefault(); const f = e.target; let ok = true;
  $$('.field', f).forEach(fl => { const i = fl.querySelector('input,select,textarea'), m = fl.querySelector('em'); let msg = '';
    if (!i.value.trim()) msg = 'Champ obligatoire.'; else if (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)) msg = 'E-mail invalide.'; else if (i.minLength > 0 && i.value.trim().length < i.minLength) msg = `Au moins ${i.minLength} caractères.`;
    fl.classList.toggle('err', !!msg); m.textContent = msg; if (msg && ok) { i.focus(); ok = false; } });
  $('#contactOk').textContent = ok ? `Merci ${f.first.value.trim()} ! Message complet. (Projet conceptuel : il n'est pas envoyé.)` : ''; if (ok) f.reset(); });
$('#newsForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#newsEmail').value.trim(); $('#newsMsg').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Adresse valide ✓ (démonstration : aucune inscription enregistrée)' : 'Adresse e-mail invalide.'; });
['fSearch', 'fUniverse', 'fCat', 'fHeight'].forEach(id => $('#' + id).addEventListener('input', renderAttractions));

/* ------------------------------------------------------------------- Intro */
const intro = $('#intro'), vid = $('#introVideo');
function setSoundBtn() { $('#introSound').innerHTML = `${icon(vid.muted ? 'sound-off' : 'sound-on')}<span>${vid.muted ? 'Activer le son' : 'Couper le son'}</span>`; }
function endIntro() {
  if (intro.classList.contains('done')) return;
  intro.classList.add('done'); document.body.classList.remove('intro-on'); document.body.style.overflow = '';
  try { sessionStorage.setItem('nwIntro', '1'); } catch (e) {}
  setTimeout(() => vid.pause(), 900);
  if (current === 'accueil') startBillboard();
}
function playIntro() {
  intro.classList.remove('done'); document.body.classList.add('intro-on'); clearTimeout(bbTimer);
  vid.currentTime = 0; vid.muted = false;
  vid.play().then(setSoundBtn).catch(() => { vid.muted = true; setSoundBtn(); vid.play().catch(endIntro); });
  clearTimeout(playIntro.t); playIntro.t = setTimeout(endIntro, 12000);
}
vid.addEventListener('ended', () => setTimeout(endIntro, 250));
vid.addEventListener('error', endIntro);
$('#introSkip').addEventListener('click', endIntro);
$('#introSound').addEventListener('click', () => { vid.muted = !vid.muted; setSoundBtn(); });
$('#replayIntro').addEventListener('click', () => { scrollTo(0, 0); playIntro(); });

/* -------------------------------------------------------------------- Init */
renderStatic(); renderToday();
BK.date = iso(nextOpen());
let seen = false; try { seen = !!sessionStorage.getItem('nwIntro'); } catch (e) {}
showPage(resolve(location.hash));
if (seen || RM) { intro.classList.add('done'); document.body.classList.remove('intro-on'); startBillboard(); } else playIntro();
})();
