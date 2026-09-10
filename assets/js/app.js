/* ============================================================
   ОБОРОТ — логика витрины
   Всё состояние живёт в localStorage: корзина и «полка» переживают
   перезагрузку. Данных с сервера нет — это витрина-прототип.
   ============================================================ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const INDEX = Object.fromEntries([...CATALOG, ...GEAR].map(i => [i.id, i]));
const nameOf  = i => i.title || i.name;
const artistOf = i => i.artist || i.kind;
const fmt = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};
const gradeClass = g => 'pill--' + { 'M': 'm', 'NM': 'nm', 'VG+': 'vgp', 'VG': 'vg', 'G': 'g' }[g];

/* ---------- Хранилище ---------- */
const store = {
  read(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem('oborot.' + key)); return v ?? fallback; }
    catch { return fallback; }
  },
  write(key, val) { try { localStorage.setItem('oborot.' + key, JSON.stringify(val)); } catch { /* приватный режим */ } }
};
let cart  = store.read('cart', {});     // { id: qty }
let shelf = store.read('shelf', []);    // [id]

/* ---------- Уведомление ---------- */
let toastTimer;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ============================================================
   ФИЛЬТРЫ И КАТАЛОГ
   ============================================================ */
const FEATURES = {
  'Новое, запечатано': r => r.grade.media === 'M',
  'Б/у':               r => r.grade.media !== 'M',
  'Цветной винил':     r => r.color !== 'Чёрный',
  '180 г':             r => r.weight >= 180,
  'Двойник (2LP)':     r => r.discs > 1,
  'Аудиофильское':     r => !!r.audiophile,
  'Раритет':           r => r.tags.includes('Раритет'),
  'Последний экземпляр': r => r.stock === 1,
  'Новичкам':          r => !!r.entry
};

const state = { q: '', genres: new Set(), grades: new Set(), feats: new Set(), price: 15000, sort: 'pop' };

function matches(r) {
  if (state.q) {
    const hay = (r.artist + ' ' + r.title + ' ' + r.genre + ' ' + r.label).toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).every(w => hay.includes(w))) return false;
  }
  if (state.genres.size && !state.genres.has(r.genre)) return false;
  if (state.grades.size && !state.grades.has(r.grade.media)) return false;
  if (r.price > state.price) return false;
  for (const f of state.feats) if (!FEATURES[f](r)) return false;
  return true;
}

const popRank = r =>
  (r.tags.includes('№1 в продажах') ? 3 : 0) +
  (r.tags.includes('Хит продаж') ? 2 : 0) +
  (r.entry ? 1 : 0);

const SORTS = {
  pop:  (a, b) => popRank(b) - popRank(a) || b.stock - a.stock,
  cheap:(a, b) => a.price - b.price,
  rich: (a, b) => b.price - a.price,
  new:  (a, b) => b.press - a.press,
  az:   (a, b) => (a.artist + a.title).localeCompare(b.artist + b.title, 'ru')
};

function visible() { return CATALOG.filter(matches).sort(SORTS[state.sort]); }

/* ---------- Карточка в сетке ---------- */
function flagsFor(r) {
  const f = [];
  if (r.tags.includes('№1 в продажах')) f.push(['hit', '№1 в продажах']);
  else if (r.tags.includes('Хит продаж')) f.push(['hit', 'Хит продаж']);
  if (r.tags.includes('Раритет')) f.push(['rare', 'Раритет']);
  if (r.stock === 1) f.push(['last', 'Последний']);
  if (r.color !== 'Чёрный') f.push(['color', r.color]);
  return f.slice(0, 3);
}

function cardHTML(r) {
  const fav = shelf.includes(r.id);
  return `<article class="card" data-id="${r.id}">
    <div class="card__art" data-open="${r.id}">
      <div class="card__disc">${renderDisc(r.cover.c2, r.cover.c3)}</div>
      <div class="card__cover">${renderCover(r)}</div>
      <button class="card__deck" data-deck="${r.id}">▶ На вертушку</button>
    </div>
    <button class="card__fav" data-fav="${r.id}" aria-pressed="${fav}" aria-label="${fav ? 'Убрать с полки' : 'Отложить на полку'}" title="${fav ? 'Убрать с полки' : 'Отложить на полку'}">
      <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.3A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.7C19 15.6 12 20 12 20z"/></svg>
    </button>
    <div class="card__body">
      <div class="card__flags">${flagsFor(r).map(([k, t]) => `<span class="flag flag--${k}">${t}</span>`).join('')}</div>
      <p class="card__artist">${r.artist}</p>
      <h3 class="card__title"><button data-open="${r.id}" aria-label="Открыть карточку: ${r.artist} — ${r.title}">${r.title}</button></h3>
      <p class="card__meta"><i>${r.year}</i><span class="dot"></span><i>${r.genre}</i>${r.discs > 1 ? '<span class="dot"></span><i>' + r.discs + 'LP</i>' : ''}</p>
      <p class="card__grades">Диск <span class="pill ${gradeClass(r.grade.media)}">${r.grade.media}</span> конверт <span class="pill ${gradeClass(r.grade.sleeve)}">${r.grade.sleeve}</span></p>
      <div class="card__foot">
        <span class="price">${fmt(r.price)}</span>
        <button class="card__buy" data-add="${r.id}" aria-label="Добавить в корзину" title="В корзину">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function renderGrid() {
  const list = visible();
  $('#grid').innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  $('#filtersCount').innerHTML = `Показано <b>${list.length}</b> из ${CATALOG.length} ${plural(CATALOG.length, 'пластинки', 'пластинок', 'пластинок')}`;
  renderActiveFilters();
}

/* ---------- Панель фильтров ---------- */
function buildFilters() {
  const genres = [...new Set(CATALOG.map(r => r.genre))]
    .map(g => [g, CATALOG.filter(r => r.genre === g).length])
    .sort((a, b) => b[1] - a[1]);
  $('#fGenre').innerHTML = genres.map(([g, n]) =>
    `<button class="chip" data-genre="${g}" aria-pressed="false">${g}<small>${n}</small></button>`).join('');

  const grades = ['M', 'NM', 'VG+', 'VG', 'G'].filter(g => CATALOG.some(r => r.grade.media === g));
  $('#fGrade').innerHTML = grades.map(g =>
    `<button class="chip" data-grade="${g}" aria-pressed="false" title="${GRADES[g].full}">${g}<small>${CATALOG.filter(r => r.grade.media === g).length}</small></button>`).join('');

  $('#fFeat').innerHTML = Object.keys(FEATURES).map(f =>
    `<button class="chip" data-feat="${f}" aria-pressed="false">${f}<small>${CATALOG.filter(FEATURES[f]).length}</small></button>`).join('');

  $('#mysteryGenre').innerHTML = '<option value="">любой жанр</option>' +
    genres.map(([g]) => `<option value="${g}">${g}</option>`).join('');
}

function renderActiveFilters() {
  const items = [];
  if (state.q) items.push(['q', '«' + state.q + '»']);
  state.genres.forEach(g => items.push(['genre:' + g, g]));
  state.grades.forEach(g => items.push(['grade:' + g, 'Состояние ' + g]));
  state.feats.forEach(f => items.push(['feat:' + f, f]));
  if (state.price < 15000) items.push(['price', 'до ' + fmt(state.price)]);
  $('#activeFilters').innerHTML = items.map(([k, t]) =>
    `<span class="af">${t}<button data-clear="${k}" aria-label="Убрать фильтр ${t}">×</button></span>`).join('');
  const badge = $('#filtersBadge');
  badge.textContent = items.length;
  badge.hidden = !items.length;
}

function syncChips() {
  $$('#fGenre .chip').forEach(c => c.setAttribute('aria-pressed', state.genres.has(c.dataset.genre)));
  $$('#fGrade .chip').forEach(c => c.setAttribute('aria-pressed', state.grades.has(c.dataset.grade)));
  $$('#fFeat .chip').forEach(c => c.setAttribute('aria-pressed', state.feats.has(c.dataset.feat)));
  $('#fPrice').value = state.price;
  $('#priceOut').textContent = state.price >= 15000 ? 'любая' : 'до ' + fmt(state.price);
}

function toggleSet(set, val) { set.has(val) ? set.delete(val) : set.add(val); }

function refresh() { syncChips(); renderGrid(); }

function scrollToCatalog() {
  $('#catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   КОРЗИНА И ПОЛКА
   ============================================================ */
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() { return Object.entries(cart).reduce((s, [id, q]) => s + (INDEX[id] ? INDEX[id].price * q : 0), 0); }

function bump(el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

function syncCounters() {
  const c = $('#cartCount'), s = $('#shelfCount');
  const n = cartCount();
  c.textContent = n; c.dataset.empty = n ? '0' : '1';
  s.textContent = shelf.length; s.dataset.empty = shelf.length ? '0' : '1';
}

function addToCart(id, qty = 1) {
  const item = INDEX[id];
  if (!item) return;
  const max = item.stock || 99;
  const next = Math.min((cart[id] || 0) + qty, max);
  if (next === cart[id]) { toast(`Это <b>последний экземпляр</b> — больше добавить нельзя`); return; }
  cart[id] = next;
  store.write('cart', cart);
  syncCounters(); bump($('#cartCount')); renderCart();
  toast(`<b>${nameOf(item)}</b> — в корзине`);
}

function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = Math.min(qty, INDEX[id].stock || 99);
  store.write('cart', cart); syncCounters(); renderCart();
}

function toggleShelf(id) {
  const i = shelf.indexOf(id);
  if (i >= 0) { shelf.splice(i, 1); toast('Убрали с полки'); }
  else { shelf.push(id); toast(`<b>${nameOf(INDEX[id])}</b> — на полке`); bump($('#shelfCount')); }
  store.write('shelf', shelf);
  syncCounters(); renderShelf();
  $$(`[data-fav="${id}"]`).forEach(b => {
    const on = shelf.includes(id);
    b.setAttribute('aria-pressed', on);
    b.setAttribute('title', on ? 'Убрать с полки' : 'Отложить на полку');
  });
}

function cartRow(id, qty) {
  const it = INDEX[id];
  return `<div class="ci">
    <div class="ci__art">${renderCover(it)}</div>
    <div class="ci__main">
      <p class="ci__artist">${artistOf(it)}</p>
      <p class="ci__title">${nameOf(it)}</p>
      <div class="ci__row">
        <div class="qty">
          <button data-qty="${id}" data-d="-1" aria-label="Меньше">−</button>
          <span>${qty}</span>
          <button data-qty="${id}" data-d="1" aria-label="Больше">+</button>
        </div>
        <span class="ci__price">${fmt(it.price * qty)}</span>
      </div>
      <button class="ci__del" data-del="${id}">убрать</button>
    </div>
  </div>`;
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id]) => INDEX[id]);
  const body = $('#cartBody'), foot = $('#cartFoot'), bar = $('#shipBar');

  if (!entries.length) {
    body.innerHTML = `<p class="drawer__empty">Пока пусто.<br>Начните с <a class="link-btn" href="#catalog" data-close-drawer>каталога</a> или с <a class="link-btn" href="#mood" data-close-drawer>подбора по настроению</a>.</p>`;
    foot.innerHTML = ''; bar.innerHTML = ''; return;
  }

  body.innerHTML = entries.map(([id, q]) => cartRow(id, q)).join('');
  const total = cartTotal();
  const left = DELIVERY_FREE_FROM - total;
  bar.className = 'ship-bar' + (left <= 0 ? ' done' : '');
  bar.innerHTML = left > 0
    ? `До бесплатной доставки <b>${fmt(left)}</b><div class="ship-bar__track"><div class="ship-bar__fill" style="width:${Math.min(100, total / DELIVERY_FREE_FROM * 100)}%"></div></div>`
    : `Доставка <b>бесплатно</b> — порог ${fmt(DELIVERY_FREE_FROM)} пройден<div class="ship-bar__track"><div class="ship-bar__fill" style="width:100%"></div></div>`;

  const n = cartCount();
  foot.innerHTML = `
    <div class="total"><span>${n} ${plural(n, 'позиция', 'позиции', 'позиций')}</span><b>${fmt(total)}</b></div>
    <button class="btn btn--primary btn--block" id="checkout">Оформить заказ</button>
    <p class="drawer__note">Витрина-прототип: оплата не подключена</p>`;
}

function renderShelf() {
  const body = $('#shelfBody'), foot = $('#shelfFoot');
  if (!shelf.length) {
    body.innerHTML = `<p class="drawer__empty">Полка пустая.<br>Жмите на сердечко в карточке — сюда попадёт то,<br>что хочется, но не сегодня.</p>`;
    foot.innerHTML = ''; return;
  }
  body.innerHTML = shelf.filter(id => INDEX[id]).map(id => {
    const it = INDEX[id];
    return `<div class="ci">
      <div class="ci__art">${renderCover(it)}</div>
      <div class="ci__main">
        <p class="ci__artist">${artistOf(it)}</p>
        <p class="ci__title">${nameOf(it)}</p>
        <div class="ci__row">
          <span class="ci__price">${fmt(it.price)}</span>
          <button class="btn btn--ghost btn--sm" data-add="${id}">В корзину</button>
        </div>
        <button class="ci__del" data-fav="${id}">убрать с полки</button>
      </div>
    </div>`;
  }).join('');
  const sum = shelf.reduce((s, id) => s + (INDEX[id] ? INDEX[id].price : 0), 0);
  const minutes = shelf.filter(id => INDEX[id] && INDEX[id].tracks).length * 22;
  foot.innerHTML = `<div class="total"><span>${shelf.length} ${plural(shelf.length, 'позиция', 'позиции', 'позиций')} · примерно ${minutes} мин музыки</span><b>${fmt(sum)}</b></div>
    <button class="btn btn--primary btn--block" id="shelfAll">Переложить всё в корзину</button>`;
}

/* ---------- Шторки ---------- */
function openDrawer(which) {
  closeDrawers();
  $('#' + which).classList.add('open');
  $('#' + which).setAttribute('aria-hidden', 'false');
  $('#scrim').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeDrawers() {
  $$('.drawer').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
  if ($('#modal').hidden) { $('#scrim').hidden = true; document.body.style.overflow = ''; }
}

/* ============================================================
   КАРТОЧКА ТОВАРА
   ============================================================ */
function openModal(id) {
  const r = INDEX[id];
  if (!r) return;
  const gm = GRADES[r.grade.media], gs = GRADES[r.grade.sleeve];
  const specs = [
    ['Лейбл', r.label], ['Год записи', r.year], ['Год издания', r.press],
    ['Страна пресса', r.country], ['Пластинок', r.discs + ' × LP'],
    ['Вес', r.weight + ' г'], ['Винил', r.color], ['Жанр', r.genre],
    ...(r.mastering ? [['Мастеринг', r.mastering]] : []),
    ['Артикул', r.id]
  ];
  $('#modalBox').innerHTML = `
    <button class="md__close" data-modal-close aria-label="Закрыть">×</button>
    <div class="md">
      <div class="md__art">
        <div class="md__cover">${renderCover(r)}</div>
        <div class="md__discwrap">
          ${renderDisc(r.cover.c2, r.cover.c3)}
          <p>Винил: <b>${r.color}</b>, ${r.weight} г.<br>${r.discs > 1 ? r.discs + ' пластинки в развороте' : 'Одна пластинка'}</p>
        </div>
      </div>
      <div class="md__body">
        <div>
          <p class="md__artist">${r.artist}</p>
          <h2 class="md__title">${r.title}</h2>
        </div>
        <p class="md__about">${r.about}</p>

        <div class="md__grades">
          <div class="mg">
            <p class="mg__label">Состояние диска</p>
            <p class="mg__val"><span class="pill ${gradeClass(r.grade.media)}">${r.grade.media}</span> ${gm.full.split('—')[1] ? gm.full.split('—')[1].trim() : gm.full}</p>
            <div class="mg__bar"><div class="mg__fill" style="width:${gm.pct}%"></div></div>
          </div>
          <div class="mg">
            <p class="mg__label">Состояние конверта</p>
            <p class="mg__val"><span class="pill ${gradeClass(r.grade.sleeve)}">${r.grade.sleeve}</span> ${gs.full.split('—')[1] ? gs.full.split('—')[1].trim() : gs.full}</p>
            <div class="mg__bar"><div class="mg__fill" style="width:${gs.pct}%"></div></div>
          </div>
        </div>
        <p class="md__stock" style="margin-top:-6px">${gm.note}</p>

        <dl class="md__specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>

        <div class="md__tracks">
          <h4>Что на пластинке</h4>
          <ol>${r.tracks.map(t => `<li>${t}</li>`).join('')}</ol>
        </div>

        <div class="md__buy">
          <span class="md__price">${fmt(r.price)}</span>
          <button class="btn btn--primary" data-add="${r.id}">В корзину</button>
          <button class="btn btn--ghost" data-deck="${r.id}">▶ На вертушку</button>
          <span class="md__stock ${r.stock <= 2 ? 'low' : ''}">${r.stock === 1 ? 'Последний экземпляр' : 'В наличии: ' + r.stock + ' шт.'}</span>
        </div>
      </div>
    </div>`;
  $('#modal').hidden = false;
  $('#scrim').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modalBox').scrollTop = 0;
  $('.md__close').focus();
}
function closeModal() {
  $('#modal').hidden = true;
  if (!$$('.drawer.open').length) { $('#scrim').hidden = true; document.body.style.overflow = ''; }
}

/* ============================================================
   ВЕРТУШКА
   ============================================================ */
let deckRecord = null;
function setDeck(id) {
  const r = INDEX[id] || CATALOG[0];
  deckRecord = r;
  $('#deckDisc').innerHTML = renderDisc(r.cover.c2, r.cover.c3);
  $('#deckSleeve').innerHTML = renderCover(r);
  $('#deckTitle').textContent = `${artistOf(r)} — ${nameOf(r)}`;
  $('#deck').classList.remove('paused');
  $('#deckPlayTxt').textContent = 'Стоп';
  $('#deckPlay').setAttribute('aria-pressed', 'true');
}
function playFromCard(id) {
  setDeck(id);
  const hero = $('.hero');
  const top = hero.getBoundingClientRect().top + scrollY;
  if (scrollY > top + 200) scrollTo({ top, behavior: 'smooth' });
  toast(`<b>${nameOf(INDEX[id])}</b> — на вертушке`);
}

/* ============================================================
   ГИД ПО СОСТОЯНИЮ
   ============================================================ */
const GRADE_WHO = {
  M:     'Кому: если это первая пластинка или подарок — берите только M. Никаких сюрпризов.',
  NM:    'Кому: почти всем. Разница с запечатанной слышна только на очень хорошем тракте, а цена ниже.',
  'VG+': 'Кому: если вы уже слушаете винил и понимаете, что лёгкий шелест между треками — это нормально. Лучшее соотношение цены и звука.',
  VG:   'Кому: коллекционерам, которым нужна конкретная позиция, и тем, кто ловит атмосферу, а не стерильность.',
  G:    'Кому: только если пластинка редкая и другого экземпляра просто нет. Мы такие почти не берём.'
};

/* Визуализация поверхности: чем ниже грейд, тем больше царапин и пыли. */
function gradeVisual(g) {
  const wear = { M: 0, NM: 1, 'VG+': 2, VG: 3, G: 4 }[g];
  const rand = rng(9151 + wear * 77);
  let grooves = '';
  for (let i = 0; i < 26; i++) grooves += `<circle cx="150" cy="150" r="${34 + i * 4.4}" fill="none" stroke="rgba(255,255,255,${i % 4 === 0 ? .12 : .05})" stroke-width="1"/>`;
  let marks = '';
  for (let i = 0; i < wear * 7; i++) {
    const a = rand() * Math.PI * 2, r0 = 46 + rand() * 96, len = 8 + rand() * 40 * wear / 2;
    const x1 = 150 + Math.cos(a) * r0, y1 = 150 + Math.sin(a) * r0;
    const x2 = x1 + Math.cos(a + 1.3) * len, y2 = y1 + Math.sin(a + 1.3) * len;
    marks += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="rgba(255,255,255,${(.1 + rand() * .3).toFixed(2)})" stroke-width="${(.6 + rand()).toFixed(1)}" stroke-linecap="round"/>`;
  }
  let dust = '';
  for (let i = 0; i < wear * 16; i++) dust += `<circle cx="${(rand() * 300).toFixed(1)}" cy="${(rand() * 300).toFixed(1)}" r="${(rand() * 1.3 + .3).toFixed(1)}" fill="rgba(255,255,255,${(.12 + rand() * .3).toFixed(2)})"/>`;
  const seal = wear === 0
    ? `<rect x="6" y="6" width="288" height="288" rx="6" fill="rgba(255,255,255,.05)"/>
       <path d="M6 250 L294 96" stroke="rgba(255,255,255,.16)" stroke-width="26" opacity=".5"/>
       <text x="150" y="286" text-anchor="middle" font-family="Manrope,Arial" font-size="13" font-weight="800" letter-spacing="3" fill="rgba(255,255,255,.5)">ЗАПЕЧАТАНО</text>` : '';
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-label="Поверхность пластинки в состоянии ${g}">
    <rect width="300" height="300" fill="#08080a"/>
    <circle cx="150" cy="150" r="150" fill="url(#gv)"/>
    <defs><radialGradient id="gv" cx="36%" cy="28%"><stop offset="0%" stop-color="#33333c"/><stop offset="55%" stop-color="#111114"/><stop offset="100%" stop-color="#0a0a0d"/></radialGradient></defs>
    ${grooves}<g>${marks}</g><g>${dust}</g>
    <circle cx="150" cy="150" r="32" fill="#c9a227"/><circle cx="150" cy="150" r="4" fill="#08080a"/>
    ${seal}</svg>`;
}

function selectGrade(g) {
  $$('#gradeScale .gbtn').forEach(b => b.setAttribute('aria-selected', b.dataset.grade === g));
  $('#gradeVis').innerHTML = gradeVisual(g);
  $('#gradeTitle').textContent = GRADES[g].full;
  $('#gradeNote').textContent = GRADES[g].note;
  $('#gradeWho').textContent = GRADE_WHO[g];
  const n = CATALOG.filter(r => r.grade.media === g).length;
  const btn = $('#gradeApply');
  btn.dataset.grade = g;
  btn.textContent = n ? `Показать пластинки в состоянии ${g} (${n})` : `Таких сейчас нет в наличии`;
  btn.disabled = !n;
  btn.style.opacity = n ? 1 : .45;
}

/* ============================================================
   ПОДБОР ПО НАСТРОЕНИЮ
   ============================================================ */
const QUIZ = [
  { key: 'mood', q: 'Под что вечер?', opts: [
      { t: 'Тихо, для себя', e: '🕯', moods: ['cozy', 'melanch'] },
      { t: 'Разогнать кровь', e: '⚡', moods: ['drive'] },
      { t: 'Работать или думать', e: '📐', moods: ['focus'] },
      { t: 'Гости и танцы', e: '🪩', moods: ['dance', 'epic'] }
  ]},
  { key: 'level', q: 'Насколько вы в теме?', opts: [
      { t: 'Первая пластинка', e: '🐣', level: 'entry' },
      { t: 'Полка уже есть', e: '📚', level: 'mid' },
      { t: 'Собираю прицельно', e: '🔍', level: 'deep' }
  ]},
  { key: 'budget', q: 'Сколько готовы отдать?', opts: [
      { t: 'До 4 000 ₽', e: '🪙', max: 4000 },
      { t: 'До 6 000 ₽', e: '💳', max: 6000 },
      { t: 'Не в деньгах дело', e: '💎', max: 99000 }
  ]}
];
const answers = {};

function renderQuiz() {
  $('#quizSteps').innerHTML = QUIZ.map((step, i) => `
    <div class="qstep">
      <h3><b>${i + 1}</b>${step.q}</h3>
      <div class="qopts">${step.opts.map((o, j) =>
        `<button class="qopt" data-step="${i}" data-opt="${j}" aria-pressed="${answers[step.key] === j}"><span class="emoji">${o.e}</span>${o.t}</button>`
      ).join('')}</div>
    </div>`).join('');
}

function quizResult() {
  if (Object.keys(answers).length < 3) return;
  const mood = QUIZ[0].opts[answers.mood];
  const level = QUIZ[1].opts[answers.level].level;
  const max = QUIZ[2].opts[answers.budget].max;

  const scored = CATALOG
    .filter(r => r.price <= max)
    .map(r => {
      let s = r.moods.filter(m => mood.moods.includes(m)).length * 5;
      if (level === 'entry') s += (r.entry ? 4 : 0) + (r.grade.media === 'M' ? 2 : -1);
      if (level === 'mid')   s += popRank(r);
      if (level === 'deep')  s += (r.audiophile ? 3 : 0) + (r.tags.includes('Раритет') ? 3 : 0) + (r.stock === 1 ? 2 : 0);
      return { r, s };
    })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || a.r.price - b.r.price)
    .slice(0, 4)
    .map(x => x.r);

  const why = level === 'entry'
    ? 'Отобрали запечатанные издания — первая пластинка должна звучать так, как задумано.'
    : level === 'deep'
      ? 'Подняли наверх аудиофильские нарезки, раритеты и единственные экземпляры.'
      : 'Смешали проверенные хиты и то, что редко попадает в подборки.';

  const box = $('#quizResult');
  box.hidden = false;
  box.innerHTML = scored.length ? `
    <div class="quiz__resulthead">
      <div>
        <h3>${mood.t.toLowerCase()} · ${plural(scored.length, 'вариант', 'варианта', 'вариантов')} ${scored.length}</h3>
        <p>${why}</p>
      </div>
      <button class="btn btn--ghost btn--sm" id="quizReset">Собрать заново</button>
    </div>
    <div class="grid">${scored.map(cardHTML).join('')}</div>`
    : `<p class="drawer__empty">Под такие условия ничего не подобралось — попробуйте поднять бюджет.</p>`;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================================
   КОТ В МЕШКЕ
   ============================================================ */
function mysteryPick() {
  const g = $('#mysteryGenre').value;
  const max = +$('#mysteryBudget').value;
  const pool = CATALOG.filter(r => (!g || r.genre === g) && r.price <= max);
  const box = $('#mysteryBox');
  if (!pool.length) {
    box.innerHTML = `<div class="mystery__placeholder"><span class="mystery__q">∅</span><p>В этих рамках пусто. Поднимите бюджет или снимите жанр.</p></div>`;
    return;
  }
  const r = pool[Math.floor(Math.random() * pool.length)];
  const off = Math.round(r.price * 0.85 / 10) * 10;
  box.innerHTML = cardHTML(r);
  const priceEl = box.querySelector('.price');
  if (priceEl) priceEl.innerHTML = `${fmt(off)}<small>${fmt(r.price)}</small>`;
  const flags = box.querySelector('.card__flags');
  if (flags) flags.insertAdjacentHTML('afterbegin', '<span class="flag flag--last">−15% кот в мешке</span>');
  toast(`Вам выпало: <b>${r.artist} — ${r.title}</b>`);
}

/* ============================================================
   СТАТИЧЕСКИЕ БЛОКИ
   ============================================================ */
function renderBundles() {
  $('#bundleGrid').innerHTML = BUNDLES.map(b => `
    <article class="bundle" style="--acc:${b.accent}">
      <h3>${b.title}</h3>
      <p class="bundle__tag">${b.tagline}</p>
      <ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>
      <div class="bundle__foot">
        <span class="price">${fmt(b.price)}<small>${fmt(b.old)}</small></span>
        <button class="btn btn--ghost btn--sm" data-bundle="${b.id}">Собрать набор</button>
      </div>
    </article>`).join('');
}

function renderGear() {
  $('#gearGrid').innerHTML = GEAR.map(g => `
    <article class="gcard">
      <div class="gcard__art">${renderGearArt(g)}</div>
      <div class="gcard__body">
        <p class="gcard__kind">${g.kind}</p>
        <h3>${g.name}</h3>
        <p>${g.note}</p>
        <div class="gcard__foot">
          <span class="price">${fmt(g.price)}</span>
          <button class="btn btn--ghost btn--sm" data-add="${g.id}">В корзину</button>
        </div>
      </div>
    </article>`).join('');
}

/* ============================================================
   СОБЫТИЯ
   ============================================================ */
function bindEvents() {
  /* Делегирование по всему документу — сетка перерисовывается часто */
  document.addEventListener('click', e => {
    const t = e.target;
    const hit = sel => t.closest(sel);

    const add = hit('[data-add]');
    if (add) {
      addToCart(add.dataset.add);
      if (add.classList.contains('card__buy')) {
        add.classList.add('done');
        setTimeout(() => add.classList.remove('done'), 900);
      }
      return;
    }

    const fav = hit('[data-fav]');
    if (fav) { toggleShelf(fav.dataset.fav); return; }

    const deck = hit('[data-deck]');
    if (deck) { playFromCard(deck.dataset.deck); return; }

    const open = hit('[data-open]');
    if (open) { openModal(open.dataset.open); return; }

    const qty = hit('[data-qty]');
    if (qty) { setQty(qty.dataset.qty, (cart[qty.dataset.qty] || 0) + (+qty.dataset.d)); return; }

    const del = hit('[data-del]');
    if (del) { setQty(del.dataset.del, 0); return; }

    const genre = hit('[data-genre]');
    if (genre) { toggleSet(state.genres, genre.dataset.genre); refresh(); return; }

    const grade = hit('[data-grade]:not(#gradeApply)');
    if (grade && grade.classList.contains('chip')) { toggleSet(state.grades, grade.dataset.grade); refresh(); return; }

    const feat = hit('[data-feat]');
    if (feat) { toggleSet(state.feats, feat.dataset.feat); refresh(); return; }

    const clear = hit('[data-clear]');
    if (clear) {
      const [kind, val] = clear.dataset.clear.split(/:(.+)/);
      if (kind === 'q') { state.q = ''; $('#q').value = ''; }
      if (kind === 'genre') state.genres.delete(val);
      if (kind === 'grade') state.grades.delete(val);
      if (kind === 'feat')  state.feats.delete(val);
      if (kind === 'price') state.price = 15000;
      refresh(); return;
    }

    const entry = hit('[data-filter-entry]');
    if (entry) {
      state.feats.clear(); state.feats.add('Новичкам');
      state.genres.clear(); state.grades.clear();
      refresh(); scrollToCatalog(); return;
    }

    const bundle = hit('[data-bundle]');
    if (bundle) {
      const b = BUNDLES.find(x => x.id === bundle.dataset.bundle);
      toast(`<b>${b.title}</b> — собираем: напишите нам, какую пластинку положить`);
      openDrawer('cart'); return;
    }

    if (hit('#gradeApply') && !hit('#gradeApply').disabled) {
      state.grades.clear(); state.grades.add($('#gradeApply').dataset.grade);
      refresh(); scrollToCatalog(); return;
    }

    const gbtn = hit('.gbtn');
    if (gbtn) { selectGrade(gbtn.dataset.grade); return; }

    const qopt = hit('.qopt');
    if (qopt) {
      answers[QUIZ[+qopt.dataset.step].key] = +qopt.dataset.opt;
      renderQuiz(); quizResult(); return;
    }
    if (hit('#quizReset')) {
      Object.keys(answers).forEach(k => delete answers[k]);
      renderQuiz(); $('#quizResult').hidden = true; return;
    }

    if (hit('#mysteryGo')) { mysteryPick(); return; }
    if (hit('#cartBtn'))   { openDrawer('cart'); return; }
    if (hit('#shelfBtn'))  { openDrawer('shelf'); return; }
    if (hit('#cartClose') || hit('#shelfClose') || hit('#scrim') || hit('[data-close-drawer]')) {
      closeDrawers(); if (!$('#modal').hidden) closeModal(); return;
    }
    if (hit('[data-modal-close]') || (t.id === 'modal')) { closeModal(); return; }
    if (hit('#filtersToggle')) {
      const f = $('#filters'), open = !f.classList.contains('open');
      f.classList.toggle('open', open);
      $('#filtersToggle').setAttribute('aria-expanded', String(open));
      return;
    }
    if (hit('#resetFilters')) {
      state.genres.clear(); state.grades.clear(); state.feats.clear();
      state.price = 15000; state.q = ''; $('#q').value = '';
      refresh(); return;
    }
    if (hit('#checkout')) {
      toast('Это витрина-прототип: оплата не подключена');
      return;
    }
    if (hit('#shelfAll')) {
      shelf.slice().forEach(id => addToCart(id));
      openDrawer('cart'); return;
    }
    if (hit('#deckPlay')) {
      const d = $('#deck'), paused = d.classList.toggle('paused');
      $('#deckPlayTxt').textContent = paused ? 'Играть' : 'Стоп';
      $('#deckPlay').setAttribute('aria-pressed', String(!paused));
      return;
    }
    if (hit('#burger')) {
      const b = $('#burger'), open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      $('.nav').classList.toggle('open', open);
      return;
    }
    if (hit('.nav a')) { $('.nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); }
    if (hit('[data-goto]')) { $(hit('[data-goto]').dataset.goto).scrollIntoView({ behavior: 'smooth' }); }
  });

  /* Enter/Space на псевдокнопках карточки */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDrawers(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.open) {
      e.preventDefault(); openModal(e.target.dataset.open);
    }
  });

  let qTimer;
  $('#q').addEventListener('input', e => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { state.q = e.target.value.trim(); refresh(); }, 180);
  });
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); scrollToCatalog(); } });

  $('#fPrice').addEventListener('input', e => { state.price = +e.target.value; syncChips(); });
  $('#fPrice').addEventListener('change', () => refresh());
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
}

/* ============================================================
   СТАРТ
   ============================================================ */
function init() {
  buildFilters();
  renderBundles();
  renderGear();
  renderQuiz();
  $('#gradeScale').innerHTML = ['M', 'NM', 'VG+', 'VG', 'G'].map(g =>
    `<button class="gbtn" data-grade="${g}" role="tab" aria-selected="false"><b>${g}</b><span>${GRADES[g].full.split('—')[0].trim()}</span></button>`).join('');
  selectGrade('VG+');
  setDeck('kino-zvezda');
  $('#factCount').textContent = CATALOG.length;
  syncCounters();
  renderCart();
  renderShelf();
  refresh();
  bindEvents();
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
