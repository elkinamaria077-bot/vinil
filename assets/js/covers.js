/* Процедурный генератор обложек.
   Каждая обложка — оригинальная векторная графика, построенная по стилю
   и палитре из data.js. Никаких заимствованных издательских артов:
   графика детерминированно выводится из id товара, поэтому одна и та же
   пластинка всегда выглядит одинаково. */

/* Детерминированный PRNG: одинаковый id -> одинаковая обложка. */
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let s = seed || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Перенос строк по словам, с дроблением слишком длинных слов. */
function wrap(text, maxChars) {
  const out = [];
  String(text).split(/\s+/).forEach(word => {
    if (word.length > maxChars) {
      for (let i = 0; i < word.length; i += maxChars) out.push(word.slice(i, i + maxChars));
      return;
    }
    const last = out[out.length - 1];
    if (last && (last + ' ' + word).length <= maxChars) out[out.length - 1] = last + ' ' + word;
    else out.push(word);
  });
  return out;
}

/* Относительная яркость фона — по ней выбирается цвет текста,
   чтобы подпись оставалась читаемой и на светлых обложках. */
function luma(hex) {
  const h = String(hex).replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16) / 255, g = parseInt(n.slice(2, 4), 16) / 255, b = parseInt(n.slice(4, 6), 16) / 255;
  const lin = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/* Типографика поверх графики. Кегль ужимается под ширину обложки,
   цвет — под яркость фона. */
function coverType(artist, title, opts, bg) {
  const o = Object.assign({ align: 'bottom', max: 17 }, opts);
  const light = luma(bg) > 0.42;
  const ink = o.ink || (light ? '#0e0e12' : '#ffffff');
  const halo = light ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.38)';

  const lines = wrap(title, o.max).slice(0, 3);
  const avail = 512;                       // ширина текстового блока внутри 600
  const longest = Math.max(...lines.map(l => l.length), 1);
  let size = lines.length >= 3 ? 42 : lines.length === 2 ? 50 : 58;
  size = Math.max(24, Math.min(size, avail / (longest * 0.545)));

  const lh = size * 1.08;
  const blockH = lines.length * lh;
  let baseY;
  if (o.align === 'top') baseY = 92;
  else if (o.align === 'center') baseY = 300 - blockH / 2 + size * 0.75;
  else baseY = 540 - blockH + size * 0.82;

  const aText = String(artist).toUpperCase();
  const aSize = Math.max(13, Math.min(24, avail / (aText.length * 0.79)));
  const artistY = o.align === 'top' ? baseY - 36 : baseY - size * 0.92 - 24;
  const sh = ` style="paint-order:stroke;stroke:${halo};stroke-width:${(size * 0.1).toFixed(1)}px;stroke-linejoin:round"`;

  return `<g font-family="Manrope, Inter, Arial, sans-serif" fill="${ink}"${sh}>
    <text x="46" y="${artistY.toFixed(1)}" font-size="${aSize.toFixed(1)}" font-weight="800" letter-spacing="${(aSize * 0.21).toFixed(1)}" opacity=".85">${esc(aText)}</text>
    ${lines.map((l, i) => `<text x="44" y="${(baseY + i * lh).toFixed(1)}" font-size="${size.toFixed(1)}" font-weight="800" letter-spacing="-1.5">${esc(l)}</text>`).join('')}
  </g>`;
}

/* ---- Стили ---- */
const STYLES = {
  prism(c, r) {
    return `<rect width="600" height="600" fill="${c.c1}"/>
      <path d="M60 300 L300 300" stroke="${c.c2}" stroke-width="7"/>
      <path d="M300 160 L440 400 L160 400 Z" fill="none" stroke="${c.c2}" stroke-width="6"/>
      <g opacity=".95">
        ${['#ff2e63', '#ff9f1c', '#ffe066', '#4ade80', '#38bdf8', '#a78bfa'].map((col, i) =>
          `<path d="M370 330 L600 ${338 + i * 30} L600 ${368 + i * 30} L370 ${348} Z" fill="${col}" opacity=".92"/>`).join('')}
      </g>
      <circle cx="300" cy="300" r="250" fill="none" stroke="${c.c3}" stroke-width="1.5" opacity=".25"/>`;
  },
  sun(c, r) {
    let rays = '';
    for (let i = 0; i < 9; i++) {
      const y = 600 - i * 34 - 20, w = 600 - i * 22;
      rays += `<rect x="${(600 - w) / 2}" y="${y}" width="${w}" height="${16 + i * 1.5}" rx="8" fill="${c.c2}" opacity="${0.95 - i * 0.085}"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>
      <circle cx="300" cy="250" r="${130 + r() * 20}" fill="${c.c3}"/>
      <circle cx="300" cy="250" r="176" fill="none" stroke="${c.c2}" stroke-width="2" opacity=".5"/>
      ${rays}`;
  },
  wave(c, r) {
    let paths = '';
    for (let i = 0; i < 7; i++) {
      const base = 170 + i * 58, amp = 34 + r() * 30, ph = r() * 6;
      let d = `M0 ${base}`;
      for (let x = 0; x <= 600; x += 30) d += ` L${x} ${(base + Math.sin(x / 78 + ph) * amp).toFixed(1)}`;
      paths += `<path d="${d}" fill="none" stroke="${i % 2 ? c.c3 : c.c2}" stroke-width="${3 + (i % 3)}" opacity="${0.9 - i * 0.07}" stroke-linecap="round"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${paths}`;
  },
  orbit(c, r) {
    let rings = '';
    for (let i = 0; i < 11; i++) {
      rings += `<circle cx="${290 + (r() - .5) * 26}" cy="${268 + (r() - .5) * 26}" r="${26 + i * 24}" fill="none" stroke="${i % 3 === 0 ? c.c2 : c.c3}" stroke-width="${i % 3 === 0 ? 4 : 1.6}" opacity="${0.9 - i * 0.055}"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${rings}
      <circle cx="290" cy="268" r="17" fill="${c.c2}"/>`;
  },
  grid(c, r) {
    let cells = '';
    const cols = 5, cell = 104, ox = 40, oy = 40;
    for (let x = 0; x < cols; x++) for (let y = 0; y < cols; y++) {
      const v = r();
      if (v < 0.42) continue;
      const px = ox + x * cell, py = oy + y * cell, s = cell - 12;
      if (v > 0.86) cells += `<circle cx="${px + s / 2}" cy="${py + s / 2}" r="${s / 2}" fill="${c.c2}"/>`;
      else if (v > 0.68) cells += `<path d="M${px} ${py + s} L${px + s} ${py + s} L${px + s} ${py} Z" fill="${c.c3}"/>`;
      else cells += `<rect x="${px}" y="${py}" width="${s}" height="${s}" fill="${v > 0.55 ? c.c2 : c.c3}" opacity=".9"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${cells}`;
  },
  split(c, r) {
    return `<rect width="600" height="600" fill="${c.c1}"/>
      <path d="M0 600 L600 0 L600 600 Z" fill="${c.c2}"/>
      <circle cx="${210 + r() * 40}" cy="${210 + r() * 40}" r="118" fill="${c.c3}"/>
      <path d="M0 600 L600 0" stroke="${c.c3}" stroke-width="3" opacity=".8"/>`;
  },
  moon(c, r) {
    let stars = '';
    for (let i = 0; i < 42; i++) stars += `<circle cx="${r() * 600}" cy="${r() * 420}" r="${r() * 2 + .6}" fill="${c.c3}" opacity="${.3 + r() * .6}"/>`;
    return `<defs><radialGradient id="mg${c.uid}" cx="38%" cy="34%"><stop offset="0%" stop-color="${c.c3}"/><stop offset="62%" stop-color="${c.c2}"/><stop offset="100%" stop-color="${c.c1}"/></radialGradient></defs>
      <rect width="600" height="600" fill="${c.c1}"/>${stars}
      <circle cx="300" cy="265" r="155" fill="url(#mg${c.uid})"/>
      <circle cx="300" cy="265" r="155" fill="none" stroke="${c.c3}" stroke-width="1.5" opacity=".5"/>`;
  },
  stripes(c, r) {
    let bands = '', y = 0;
    while (y < 600) {
      const h = 14 + r() * 52;
      bands += `<rect x="0" y="${y.toFixed(1)}" width="600" height="${h.toFixed(1)}" fill="${r() > .55 ? c.c2 : c.c3}" opacity="${(.55 + r() * .45).toFixed(2)}"/>`;
      y += h + 8 + r() * 22;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${bands}`;
  },
  blot(c, r) {
    let blobs = '';
    for (let i = 0; i < 4; i++) {
      const cx = 120 + r() * 360, cy = 120 + r() * 340, rad = 70 + r() * 110;
      let d = '';
      for (let a = 0; a < 360; a += 30) {
        const rr = rad * (0.72 + r() * 0.5), x = cx + Math.cos(a * Math.PI / 180) * rr, y = cy + Math.sin(a * Math.PI / 180) * rr;
        d += (a === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
      }
      blobs += `<path d="${d}Z" fill="${i % 2 ? c.c2 : c.c3}" opacity="${.42 + r() * .38}" style="filter:blur(.4px)"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${blobs}`;
  },
  star(c, r) {
    let rays = '';
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2, w = 0.055 + r() * 0.05, len = 400 + r() * 220;
      rays += `<path d="M300 300 L${(300 + Math.cos(a - w) * len).toFixed(1)} ${(300 + Math.sin(a - w) * len).toFixed(1)} L${(300 + Math.cos(a + w) * len).toFixed(1)} ${(300 + Math.sin(a + w) * len).toFixed(1)} Z" fill="${i % 2 ? c.c2 : c.c3}" opacity="${i % 2 ? .95 : .5}"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${rays}<circle cx="300" cy="300" r="54" fill="${c.c1}"/>`;
  },
  city(c, r) {
    let sky = '';
    for (let i = 0; i < 5; i++) sky += `<rect x="0" y="${i * 46}" width="600" height="46" fill="${c.c2}" opacity="${(.1 + i * .05).toFixed(2)}"/>`;
    let b = '', x = -10;
    while (x < 610) {
      const w = 26 + r() * 58, h = 110 + r() * 250;
      b += `<rect x="${x.toFixed(1)}" y="${(600 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${c.c1}"/>`;
      for (let wy = 600 - h + 16; wy < 588; wy += 24)
        for (let wx = x + 8; wx < x + w - 8; wx += 18)
          if (r() > .62) b += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="6" height="9" fill="${c.c2}" opacity=".85"/>`;
      x += w + 4 + r() * 10;
    }
    return `<rect width="600" height="600" fill="${c.c3}"/>${sky}
      <circle cx="${140 + r() * 320}" cy="150" r="72" fill="${c.c2}" opacity=".9"/>${b}`;
  },
  crown(c, r) {
    return `<rect width="600" height="600" fill="${c.c1}"/>
      <path d="M300 88 L352 224 L494 236 L388 330 L420 470 L300 396 L180 470 L212 330 L106 236 L248 224 Z" fill="${c.c2}"/>
      <circle cx="300" cy="300" r="212" fill="none" stroke="${c.c3}" stroke-width="2.5" opacity=".55"/>
      <circle cx="300" cy="300" r="246" fill="none" stroke="${c.c3}" stroke-width="1" opacity=".3"/>`;
  },
  flame(c, r) {
    let f = '';
    for (let i = 5; i >= 0; i--) {
      const s = 1 - i * 0.13, w = 210 * s, h = 400 * s;
      f += `<path d="M300 ${600 - h} C${300 - w} ${600 - h * .55} ${300 - w * .5} ${600 - h * .2} 300 600 C${300 + w * .5} ${600 - h * .2} ${300 + w} ${600 - h * .55} 300 ${600 - h} Z" fill="${i % 2 ? c.c2 : c.c3}" opacity="${(.5 + i * .08).toFixed(2)}"/>`;
    }
    return `<rect width="600" height="600" fill="${c.c1}"/>${f}`;
  },
  mono(c, r) {
    let rules = '';
    for (let i = 0; i < 16; i++) rules += `<rect x="46" y="${104 + i * 15}" width="${(120 + r() * 380).toFixed(0)}" height="2" fill="${c.c2}" opacity="${(.1 + r() * .3).toFixed(2)}"/>`;
    return `<rect width="600" height="600" fill="${c.c1}"/>${rules}
      <rect x="46" y="70" width="508" height="4" fill="${c.c3}"/>
      <rect x="46" y="356" width="508" height="4" fill="${c.c3}"/>
      <circle cx="470" cy="452" r="72" fill="none" stroke="${c.c3}" stroke-width="3" opacity=".7"/>
      <circle cx="470" cy="452" r="9" fill="${c.c3}" opacity=".7"/>`;
  }
};

/* Куда класть текст и каким цветом — зависит от стиля. */
const TYPE_RULES = {
  prism:   { align: 'bottom' },
  sun:     { align: 'top' },
  wave:    { align: 'bottom' },
  orbit:   { align: 'bottom' },
  grid:    { align: 'bottom' },
  split:   { align: 'top' },
  moon:    { align: 'bottom' },
  stripes: { align: 'center' },
  blot:    { align: 'bottom' },
  star:    { align: 'center' },
  city:    { align: 'top' },
  crown:   { align: 'bottom' },
  flame:   { align: 'top' },
  mono:    { align: 'bottom' }
};

let _uid = 0;

/* Главная точка входа: изображение товара.

   Если у позиции в data.js задано поле `image` (путь или URL к фото
   конверта), показываем фотографию. Если нет — рисуем обложку кодом.
   Это точка подмены: чтобы поставить реальные фото, достаточно
   добавить `image: 'assets/img/что-то.jpg'` в карточку товара,
   ничего больше в коде менять не нужно. */
function renderCover(item) {
  if (item.image) {
    return `<img class="cover-img" src="${esc(item.image)}" alt="${esc((item.artist || item.kind || '') + ' — ' + (item.title || item.name || ''))}" loading="lazy" decoding="async">`;
  }
  const c = Object.assign({ uid: ++_uid }, item.cover);
  const style = STYLES[c.style] ? c.style : 'grid';
  const rand = rng(seedFrom(item.id + style));
  const art = STYLES[style](c, rand);
  const artist = item.artist || item.kind || '';
  const title = item.title || item.name || '';
  const bg = style === 'city' ? c.c3 : c.c1;
  const type = coverType(artist, title, TYPE_RULES[style], bg);
  return `<svg class="cover-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Обложка: ${esc(artist)} — ${esc(title)}">
    ${art}${type}
    <rect width="600" height="600" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="2"/>
  </svg>`;
}

/* Виниловый диск — для эффекта «пластинка выезжает из конверта»
   и для проигрывателя на главной. */
function renderDisc(labelColor, accent) {
  let grooves = '';
  for (let i = 0; i < 22; i++) grooves += `<circle cx="150" cy="150" r="${44 + i * 4.6}" fill="none" stroke="rgba(255,255,255,${i % 4 === 0 ? .1 : .045})" stroke-width="1"/>`;
  return `<svg class="disc-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="dsheen" cx="34%" cy="26%">
        <stop offset="0%" stop-color="#3d3d46"/><stop offset="42%" stop-color="#131317"/>
        <stop offset="78%" stop-color="#0a0a0d"/><stop offset="100%" stop-color="#17171c"/>
      </radialGradient>
      <linearGradient id="dglint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity=".22"/><stop offset="38%" stop-color="#fff" stop-opacity="0"/>
        <stop offset="66%" stop-color="#fff" stop-opacity=".1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <circle cx="150" cy="150" r="148" fill="url(#dsheen)"/>
    ${grooves}
    <circle cx="150" cy="150" r="148" fill="url(#dglint)"/>
    <circle cx="150" cy="150" r="43" fill="${labelColor || '#e8b93a'}"/>
    <circle cx="150" cy="150" r="43" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
    <path d="M150 118 a32 32 0 0 1 0 64" fill="none" stroke="${accent || 'rgba(0,0,0,.35)'}" stroke-width="6"/>
    <circle cx="150" cy="150" r="5" fill="#0b0b0e"/>
  </svg>`;
}

/* ------------------------------------------------------------
   Иллюстрации для техники и аксессуаров.
   Здесь нужна не «обложка», а узнаваемый предмет: покупатель должен
   с одного взгляда отличить щётку от конвертов. Рисуем схематично,
   в той же палитре, что и обложки.
   ------------------------------------------------------------ */
const GEAR_ART = {
  turntable(c) {
    let gr = '';
    for (let i = 0; i < 9; i++) gr += `<circle cx="250" cy="215" r="${52 + i * 12}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`;
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <rect x="62" y="70" width="476" height="290" rx="18" fill="rgba(255,255,255,.045)" stroke="${c.c2}" stroke-opacity=".28"/>
      <circle cx="250" cy="215" r="140" fill="#0e0e12"/><circle cx="250" cy="215" r="140" fill="none" stroke="rgba(255,255,255,.12)"/>
      ${gr}
      <circle cx="250" cy="215" r="42" fill="${c.c3}"/><circle cx="250" cy="215" r="5" fill="${c.c1}"/>
      <rect x="404" y="106" width="26" height="26" rx="7" fill="${c.c2}"/>
      <rect x="330" y="120" width="104" height="9" rx="4.5" fill="${c.c2}" transform="rotate(19 382 124)"/>
      <circle cx="326" cy="152" r="9" fill="#dcd8cf"/>
      <rect x="96" y="312" width="58" height="12" rx="6" fill="${c.c2}" opacity=".7"/>
      <rect x="166" y="312" width="30" height="12" rx="6" fill="rgba(255,255,255,.16)"/>`;
  },
  brush(c) {
    let br = '';
    for (let i = 0; i < 30; i++) br += `<rect x="${132 + i * 11}" y="248" width="4" height="${52 + (i % 3) * 8}" rx="2" fill="${c.c2}" opacity="${.5 + (i % 4) * .12}"/>`;
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <rect x="120" y="150" width="360" height="96" rx="20" fill="${c.c3}"/>
      <rect x="120" y="150" width="360" height="96" rx="20" fill="none" stroke="rgba(0,0,0,.25)"/>
      <rect x="150" y="176" width="300" height="10" rx="5" fill="rgba(0,0,0,.18)"/>
      <rect x="120" y="238" width="360" height="16" rx="4" fill="rgba(0,0,0,.35)"/>
      ${br}
      <path d="M96 336 h408" stroke="${c.c2}" stroke-width="2" opacity=".3" stroke-dasharray="6 8"/>`;
  },
  innersleeve(c) {
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <g transform="rotate(-7 300 210)">
        <rect x="196" y="72" width="250" height="250" rx="4" fill="${c.c3}" opacity=".55"/>
        <rect x="176" y="86" width="250" height="250" rx="4" fill="${c.c3}" opacity=".78"/>
        <rect x="156" y="100" width="250" height="250" rx="4" fill="${c.c3}"/>
        <rect x="156" y="100" width="250" height="250" rx="4" fill="none" stroke="rgba(0,0,0,.22)"/>
        <path d="M156 100 h250" stroke="${c.c2}" stroke-width="7"/>
        <circle cx="281" cy="225" r="86" fill="none" stroke="rgba(0,0,0,.16)" stroke-width="2"/>
      </g>
      <circle cx="430" cy="252" r="86" fill="#121216"/>
      <circle cx="430" cy="252" r="86" fill="none" stroke="rgba(255,255,255,.14)"/>
      <circle cx="430" cy="252" r="26" fill="${c.c2}"/>`;
  },
  outersleeve(c) {
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <rect x="176" y="76" width="248" height="248" rx="3" fill="${c.c3}"/>
      <circle cx="300" cy="200" r="72" fill="${c.c2}" opacity=".85"/>
      <rect x="152" y="60" width="296" height="296" rx="6" fill="rgba(180,205,235,.16)" stroke="rgba(210,230,255,.5)" stroke-width="2"/>
      <path d="M152 300 L448 96" stroke="rgba(255,255,255,.28)" stroke-width="20" opacity=".5"/>
      <path d="M152 348 L448 144" stroke="rgba(255,255,255,.14)" stroke-width="9"/>`;
  },
  stand(c) {
    let slabs = '';
    for (let i = 0; i < 9; i++) slabs += `<rect x="${146 + i * 34}" y="${104 + (i % 3) * 6}" width="24" height="${188 - (i % 3) * 8}" rx="3" fill="${i % 2 ? c.c2 : c.c3}" opacity="${.55 + (i % 4) * .1}"/>`;
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <rect x="118" y="86" width="364" height="230" rx="10" fill="none" stroke="${c.c2}" stroke-width="12" stroke-opacity=".85"/>
      ${slabs}
      <rect x="118" y="316" width="364" height="14" rx="7" fill="${c.c2}"/>
      <rect x="150" y="330" width="22" height="22" rx="6" fill="${c.c2}" opacity=".6"/>
      <rect x="428" y="330" width="22" height="22" rx="6" fill="${c.c2}" opacity=".6"/>`;
  },
  bottle(c) {
    return `<rect width="600" height="420" fill="${c.c1}"/>
      <rect x="316" y="196" width="150" height="150" rx="10" fill="${c.c3}" opacity=".5"/>
      <rect x="336" y="216" width="150" height="150" rx="10" fill="${c.c3}" opacity=".8"/>
      <rect x="196" y="62" width="34" height="42" rx="6" fill="${c.c2}"/>
      <path d="M186 104 h54 a26 26 0 0 1 22 26 v198 a22 22 0 0 1 -22 22 h-54 a22 22 0 0 1 -22 -22 v-198 a26 26 0 0 1 22 -26 z" fill="${c.c2}" opacity=".9"/>
      <rect x="176" y="176" width="74" height="96" rx="6" fill="rgba(255,255,255,.85)"/>
      <rect x="188" y="196" width="50" height="6" rx="3" fill="${c.c1}" opacity=".55"/>
      <rect x="188" y="212" width="38" height="5" rx="2.5" fill="${c.c1}" opacity=".35"/>
      <rect x="188" y="226" width="46" height="5" rx="2.5" fill="${c.c1}" opacity=".35"/>`;
  },
  wall(c) {
    let sq = '';
    for (let i = 0; i < 4; i++) {
      const x = 96 + (i % 2) * 216, y = 76 + Math.floor(i / 2) * 172;
      sq += `<rect x="${x}" y="${y}" width="152" height="152" rx="3" fill="${i % 2 ? c.c2 : c.c3}" opacity=".85"/>
        <circle cx="${x + 76}" cy="${y + 76}" r="44" fill="${c.c1}" opacity=".45"/>
        <rect x="${x - 8}" y="${y + 138}" width="168" height="7" rx="3.5" fill="rgba(255,255,255,.2)"/>`;
    }
    return `<rect width="600" height="420" fill="${c.c1}"/>${sq}`;
  }
};

const GEAR_SHAPES = {
  'g-audiotechnica': 'turntable', 'g-probject': 'turntable', 'g-brush': 'brush',
  'g-sleeves': 'innersleeve', 'g-outer': 'outersleeve', 'g-stand': 'stand',
  'g-cleaner': 'bottle', 'g-wallmount': 'wall'
};

function renderGearArt(item) {
  const shape = GEAR_SHAPES[item.id] || 'turntable';
  return `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(item.name)}">
    ${GEAR_ART[shape](item.cover)}
  </svg>`;
}
