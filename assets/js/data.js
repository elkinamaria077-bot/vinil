/* Каталог «Оборота».
   Состав каталога отражает реальную структуру спроса на российском рынке
   1П 2026 (см. docs/research.md): русский рок, классический рок, саундтреки,
   классика, джаз. Цены — в коридоре рынка: медиана ~2 000 ₽, новые импортные
   издания 3 500–6 500 ₽, раритеты вторичного рынка выше.

   Поля карточки закрывают возражения сегмента «Коллекционер»:
   лейбл, страна прессинга, год издания, вес, кол-во дисков, мастеринг.
   grade.media / grade.sleeve — раздельный грейдинг по стандарту Goldmine. */

const GRADES = {
  M:    { label: 'M',   full: 'Mint — запечатано',        pct: 100, note: 'Фабричная плёнка не вскрыта. Идеал.' },
  NM:   { label: 'NM',  full: 'Near Mint — как новая',    pct: 92,  note: 'Играли пару раз. Царапин нет, звук чистый.' },
  'VG+':{ label: 'VG+', full: 'Very Good Plus — отличная',pct: 78,  note: 'Лёгкие следы игры, слышны только в тишине между треками.' },
  VG:   { label: 'VG',  full: 'Very Good — хорошая',      pct: 58,  note: 'Заметные потёртости, лёгкий фоновый шум. Играет уверенно.' },
  G:    { label: 'G',   full: 'Good — играет',            pct: 35,  note: 'Много следов, шум слышен. Берут ради редкости.' }
};

const MOODS = {
  drive:   'Драйв',
  melanch: 'Меланхолия',
  cozy:    'Уют',
  dance:   'Танцы',
  focus:   'Сосредоточенность',
  nostal:  'Ностальгия',
  epic:    'Эпично',
  romance: 'Романтика'
};

/* cover: { style, c1, c2, c3 } — параметры процедурного генератора обложки.
   Обложки рисуются кодом (assets/js/covers.js), это оригинальная графика,
   а не сканы издательских артов. */

const CATALOG = [
  /* ============ РУССКИЙ РОК ============ */
  {
    id: 'kino-zvezda', artist: 'Кино', title: 'Звезда по имени Солнце',
    genre: 'Русский рок', year: 1989, press: 2021, label: 'Maschina Records', country: 'Россия',
    price: 3490, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 8, mastering: 'Ремастеринг с оригинальных лент',
    tags: ['Хит продаж', 'Новое издание'], moods: ['melanch', 'nostal'], entry: true,
    about: 'Последний прижизненный студийный альбом Цоя. В топах российских продаж пятый год подряд — та самая пластинка, с которой у половины страны начинается коллекция.',
    tracks: ['Песня без слов', 'Звезда по имени Солнце', 'Невесёлая песня', 'Место для шага вперёд', 'Пачка сигарет', 'Апрель'],
    cover: { style: 'sun', c1: '#0d0b12', c2: '#e8b93a', c3: '#d94f2b' }
  },
  {
    id: 'kino-krovi', artist: 'Кино', title: 'Группа крови',
    genre: 'Русский рок', year: 1988, press: 2020, label: 'Maschina Records', country: 'Россия',
    price: 3290, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 5,
    tags: ['Хит продаж'], moods: ['drive', 'nostal'], entry: true,
    about: 'Альбом, после которого «Кино» перестало быть ленинградской группой и стало общим языком. Записан на студии Алексея Вишни.',
    tracks: ['Группа крови', 'Закрой за мной дверь, я ухожу', 'Война', 'Спокойная ночь', 'Мама, мы все тяжело больны', 'Бошетунмай', 'В наших глазах', 'Попробуй спеть вместе со мной', 'Легенда'],
    cover: { style: 'split', c1: '#101216', c2: '#c0392b', c3: '#f2f0e6' }
  },
  {
    id: 'kish-best', artist: 'Король и Шут', title: 'Лучшее',
    genre: 'Русский рок', year: 2023, press: 2024, label: 'Никитин', country: 'Россия',
    price: 5990, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 3,
    tags: ['№1 в продажах', '2LP'], moods: ['drive', 'nostal'],
    about: 'Двойник, который после сериала снёс все чарты и до сих пор держит первое место по продажам винила в России.',
    tracks: ['Лесник', 'Прыгну со скалы', 'Кукла колдуна', 'Проклятый старый дом', 'Ели мясо мужики', 'Мёртвый анархист', 'Дурак и молния'],
    cover: { style: 'flame', c1: '#120a0a', c2: '#e03e1a', c3: '#f5c542' }
  },
  {
    id: 'aquarium-africa', artist: 'Аквариум', title: 'Радио Африка',
    genre: 'Русский рок', year: 1983, press: 2019, label: 'Bomba Music', country: 'Россия',
    price: 4190, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'VG+' }, stock: 2,
    tags: ['Б/у'], moods: ['melanch', 'cozy'],
    about: 'Магнитоальбом, записанный полулегально и разошедшийся по стране на катушках. Один из главных документов русского андеграунда.',
    tracks: ['Блюз простого человека', 'Рок-н-ролл мёртв', 'Об оступившемся', 'Танцы на грани весны', 'Змея', 'Регги'],
    cover: { style: 'wave', c1: '#0a1418', c2: '#2f9e8f', c3: '#e6d9a8' }
  },
  {
    id: 'nautilus-razluka', artist: 'Наутилус Помпилиус', title: 'Разлука',
    genre: 'Русский рок', year: 1986, press: 2022, label: 'Maschina Records', country: 'Россия',
    price: 3790, discs: 1, weight: 180, color: 'Прозрачный синий',
    grade: { media: 'M', sleeve: 'M' }, stock: 6,
    tags: ['Цветной винил'], moods: ['melanch', 'nostal'],
    about: 'Свердловский альбом, из которого выросла вся эстетика позднего СССР. Ограниченный тираж на прозрачном синем виниле.',
    tracks: ['Гудбай, Америка', 'Скованные одной цепью', 'Взгляд с экрана', 'Разлука', 'Праздник общей беды'],
    cover: { style: 'city', c1: '#0b1020', c2: '#3d6fb5', c3: '#cfd8e8' }
  },
  {
    id: 'ddt-aktrisa', artist: 'ДДТ', title: 'Актриса Весна',
    genre: 'Русский рок', year: 1992, press: 2018, label: 'Navigator Records', country: 'Россия',
    price: 3590, discs: 1, weight: 140, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG+' }, stock: 1,
    tags: ['Б/у', 'Последний экземпляр'], moods: ['melanch'],
    about: 'Самый мелодичный альбом Шевчука — записан после переезда в Петербург, с духовыми и струнными.',
    tracks: ['Что такое осень', 'Актриса Весна', 'Ночная пьеса', 'Дождь', 'Метель'],
    cover: { style: 'blot', c1: '#141b12', c2: '#7fa03f', c3: '#e9dfc0' }
  },
  {
    id: 'grob-plan', artist: 'Гражданская Оборона', title: 'Всё идёт по плану',
    genre: 'Русский рок', year: 1988, press: 2021, label: 'Выргород', country: 'Россия',
    price: 4490, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4,
    tags: ['Новое издание'], moods: ['drive'],
    about: 'Ремастер с оригинальных плёнок под контролем Натальи Чумаковой. Панк, который стал фольклором.',
    tracks: ['Всё идёт по плану', 'Everything Is Going According to Plan', 'Мы — лёд', 'Harley-Davidson', 'Про дурачка'],
    cover: { style: 'stripes', c1: '#0e0e0e', c2: '#d02a2a', c3: '#e8e4d8' }
  },
  {
    id: 'splean-granat', artist: 'Сплин', title: 'Гранатовый альбом',
    genre: 'Русский рок', year: 1998, press: 2023, label: 'Navigator Records', country: 'Россия',
    price: 4290, discs: 2, weight: 180, color: 'Гранатовый прозрачный',
    grade: { media: 'M', sleeve: 'M' }, stock: 7,
    tags: ['Цветной винил', '2LP'], moods: ['melanch', 'nostal'], entry: true,
    about: 'Альбом, который вывел «Сплин» из клубов на стадионы. Переиздан на гранатово-прозрачном виниле — в цвет названию.',
    tracks: ['Орбит без сахара', 'Свободу Анджеле Дэвис', 'Романс', 'Двое не спят', 'Феллини'],
    cover: { style: 'orbit', c1: '#180a10', c2: '#a01f3c', c3: '#e8b0a0' }
  },
  {
    id: 'mummy-troll-morskaya', artist: 'Мумий Тролль', title: 'Морская',
    genre: 'Русский рок', year: 1997, press: 2020, label: 'Navigator Records', country: 'Россия',
    price: 3890, discs: 1, weight: 180, color: 'Морская волна',
    grade: { media: 'M', sleeve: 'M' }, stock: 5,
    tags: ['Цветной винил'], moods: ['cozy', 'romance'], entry: true,
    about: 'Пластинка, с которой в русской музыке появилось слово «рокапопс». Владивосток, Лондон, гитары в реверберации.',
    tracks: ['Утекай', 'Владивосток 2000', 'Кот кота', 'Забавы', 'Медведица'],
    cover: { style: 'wave', c1: '#06171c', c2: '#2ec5c0', c3: '#f0e5c8' }
  },
  {
    id: 'agata-opium', artist: 'Агата Кристи', title: 'Опиум',
    genre: 'Русский рок', year: 1995, press: 2019, label: 'Maschina Records', country: 'Россия',
    price: 4690, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'NM' }, stock: 2,
    tags: ['Б/у'], moods: ['drive', 'melanch'],
    about: 'Самый мрачный и самый успешный альбом братьев Самойловых. Кабаре, синтезаторы и дурная слава.',
    tracks: ['Опиум для никого', 'Как на войне', 'Сказочная тайга', 'Ковёр-вертолёт', 'Чёрная луна'],
    cover: { style: 'moon', c1: '#0a0710', c2: '#6b3fa0', c3: '#d8c8e8' }
  },
  {
    id: 'alisa-shabash', artist: 'Алиса', title: 'Шабаш',
    genre: 'Русский рок', year: 1991, press: 2017, label: 'Мистерия звука', country: 'Россия',
    price: 5290, discs: 2, weight: 140, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG' }, stock: 1,
    tags: ['Б/у', 'Последний экземпляр', '2LP'], moods: ['drive', 'epic'],
    about: 'Живой двойник с концерта памяти Александра Башлачёва в ДС «Юбилейный». Считается лучшей концертной записью русского рока.',
    tracks: ['Шабаш I', 'Шабаш II', 'Тоталитарный рэп', 'Мы вместе', 'Красное на чёрном'],
    cover: { style: 'star', c1: '#0d0000', c2: '#d41d1d', c3: '#000000' }
  },
  {
    id: 'piknik-harakiri', artist: 'Пикник', title: 'Харакири',
    genre: 'Русский рок', year: 1991, press: 2022, label: 'Bomba Music', country: 'Россия',
    price: 3990, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4,
    tags: [], moods: ['melanch', 'epic'],
    about: 'Восточные лады, виолончель и голос Шклярского. Альбом, который «Пикник» до сих пор играет целиком на юбилейных концертах.',
    tracks: ['Иероглиф', 'Немного огня', 'Египтянин', '洞窟 / Пещера', 'Харакири'],
    cover: { style: 'blot', c1: '#170d08', c2: '#c2703a', c3: '#efe0c4' }
  },

  /* ============ КЛАССИЧЕСКИЙ РОК ============ */
  {
    id: 'pf-dsotm', artist: 'Pink Floyd', title: 'The Dark Side of the Moon',
    genre: 'Классический рок', year: 1973, press: 2023, label: 'Pink Floyd Records', country: 'Германия',
    price: 6490, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 9, mastering: 'Remaster 50th Anniversary, James Guthrie',
    tags: ['Хит продаж', 'Аудиофильское'], moods: ['focus', 'epic'], entry: true, audiophile: true,
    about: 'Юбилейное издание к 50-летию: ремастер Джеймса Гатри с оригинальных мастер-лент, разворотный конверт, два постера и два стикера в комплекте.',
    tracks: ['Speak to Me / Breathe', 'On the Run', 'Time', 'The Great Gig in the Sky', 'Money', 'Us and Them', 'Any Colour You Like', 'Brain Damage', 'Eclipse'],
    cover: { style: 'prism', c1: '#000000', c2: '#ffffff', c3: '#ff2e63' }
  },
  {
    id: 'pf-wywh', artist: 'Pink Floyd', title: 'Wish You Were Here',
    genre: 'Классический рок', year: 1975, press: 2016, label: 'Pink Floyd Records', country: 'Европа',
    price: 5890, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'NM' }, stock: 3, mastering: 'Remaster, James Guthrie / Bernie Grundman',
    tags: ['Б/у', 'Аудиофильское'], moods: ['melanch', 'focus'], audiophile: true,
    about: 'Альбом об отсутствии: о Сиде Барретте, об индустрии, о самих себе. «Shine On You Crazy Diamond» занимает обе стороны.',
    tracks: ['Shine On You Crazy Diamond (I–V)', 'Welcome to the Machine', 'Have a Cigar', 'Wish You Were Here', 'Shine On You Crazy Diamond (VI–IX)'],
    cover: { style: 'flame', c1: '#1a1206', c2: '#e07b2c', c3: '#f5e2b8' }
  },
  {
    id: 'queen-opera', artist: 'Queen', title: 'A Night at the Opera',
    genre: 'Классический рок', year: 1975, press: 2015, label: 'Virgin EMI', country: 'Великобритания',
    price: 5490, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 6, mastering: 'Half-speed master, Abbey Road',
    tags: ['Аудиофильское', 'Хит продаж'], moods: ['epic', 'drive'], entry: true, audiophile: true,
    about: 'Half-speed мастеринг с Abbey Road — «Bohemian Rhapsody» в том виде, в каком её задумывали в 1975-м, а не в радиоверсии.',
    tracks: ['Death on Two Legs', "You're My Best Friend", "'39", 'The Prophet’s Song', 'Love of My Life', 'Bohemian Rhapsody', 'God Save the Queen'],
    cover: { style: 'crown', c1: '#0a0a14', c2: '#d4af37', c3: '#f2f0ea' }
  },
  {
    id: 'lz-iv', artist: 'Led Zeppelin', title: 'Led Zeppelin IV',
    genre: 'Классический рок', year: 1971, press: 2014, label: 'Atlantic', country: 'Германия',
    price: 5690, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'VG+' }, stock: 2, mastering: 'Remaster, Jimmy Page',
    tags: ['Б/у'], moods: ['drive', 'epic'],
    about: 'Альбом без названия и без имени группы на конверте — только четыре руны. Ремастер под личным контролем Джимми Пейджа.',
    tracks: ['Black Dog', 'Rock and Roll', 'The Battle of Evermore', 'Stairway to Heaven', 'Misty Mountain Hop', 'Going to California', 'When the Levee Breaks'],
    cover: { style: 'grid', c1: '#1b160f', c2: '#8a6b3d', c3: '#ded3bc' }
  },
  {
    id: 'beatles-abbey', artist: 'The Beatles', title: 'Abbey Road',
    genre: 'Классический рок', year: 1969, press: 2019, label: 'Apple Records', country: 'Европа',
    price: 6290, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 5, mastering: 'Mix 2019, Giles Martin',
    tags: ['Хит продаж', 'Аудиофильское'], moods: ['cozy', 'nostal'], entry: true, audiophile: true,
    about: 'Юбилейный микс Джайлса Мартина к 50-летию — впервые сведён со стерео-лент заново, без компромиссов 1969 года.',
    tracks: ['Come Together', 'Something', 'Oh! Darling', 'Octopus’s Garden', 'Here Comes the Sun', 'Because', 'Golden Slumbers', 'The End'],
    cover: { style: 'stripes', c1: '#dfe4e8', c2: '#2c3138', c3: '#f7f8f9' }
  },
  {
    id: 'nirvana-nevermind', artist: 'Nirvana', title: 'Nevermind',
    genre: 'Классический рок', year: 1991, press: 2021, label: 'Geffen', country: 'США',
    price: 4990, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 8,
    tags: ['Хит продаж'], moods: ['drive'], entry: true,
    about: 'Издание к 30-летию. Альбом, который за одну зиму закончил восьмидесятые и начал девяностые.',
    tracks: ['Smells Like Teen Spirit', 'In Bloom', 'Come as You Are', 'Breed', 'Lithium', 'Polly', 'Drain You', 'Something in the Way'],
    cover: { style: 'wave', c1: '#053a56', c2: '#1e88c7', c3: '#eaf4fb' }
  },
  {
    id: 'metallica-mop', artist: 'Metallica', title: 'Master of Puppets',
    genre: 'Классический рок', year: 1986, press: 2017, label: 'Blackened Recordings', country: 'США',
    price: 5390, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'NM' }, stock: 3,
    tags: ['Б/у'], moods: ['drive', 'epic'],
    about: 'Последний альбом с Клиффом Бёртоном. Ремастер 2017 года с оригинальных лент.',
    tracks: ['Battery', 'Master of Puppets', 'The Thing That Should Not Be', 'Welcome Home (Sanitarium)', 'Disposable Heroes', 'Orion', 'Damage, Inc.'],
    cover: { style: 'star', c1: '#0b0b0d', c2: '#b8b8be', c3: '#d63a2f' }
  },
  {
    id: 'doors-lawoman', artist: 'The Doors', title: 'L.A. Woman',
    genre: 'Классический рок', year: 1971, press: 2012, label: 'Elektra', country: 'США',
    price: 7490, discs: 1, weight: 200, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG+' }, stock: 1,
    tags: ['Б/у', 'Последний экземпляр', 'Аудиофильское'], moods: ['drive', 'nostal'], audiophile: true,
    about: 'Издание на 200 г виниле, нарезка с аналоговых лент. Последняя пластинка, записанная с Джимом Моррисоном.',
    tracks: ['The Changeling', 'Love Her Madly', 'Been Down So Long', 'L.A. Woman', 'Hyacinth House', 'Riders on the Storm'],
    cover: { style: 'city', c1: '#180d06', c2: '#e0a03a', c3: '#733018' }
  },
  {
    id: 'bowie-ziggy', artist: 'David Bowie', title: 'The Rise and Fall of Ziggy Stardust',
    genre: 'Классический рок', year: 1972, press: 2016, label: 'Parlophone', country: 'Европа',
    price: 5790, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4, mastering: 'Remaster 2012, Ray Staff',
    tags: [], moods: ['drive', 'epic'],
    about: 'Ремастер Рэя Стаффа — того самого инженера, который резал оригинальный лак в 1972-м.',
    tracks: ['Five Years', 'Soul Love', 'Moonage Daydream', 'Starman', 'Ziggy Stardust', 'Suffragette City', 'Rock ’n’ Roll Suicide'],
    cover: { style: 'prism', c1: '#120616', c2: '#ff5fa2', c3: '#4fc3f7' }
  },
  {
    id: 'radiohead-okc', artist: 'Radiohead', title: 'OK Computer',
    genre: 'Классический рок', year: 1997, press: 2016, label: 'XL Recordings', country: 'Европа',
    price: 6890, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 3,
    tags: ['2LP'], moods: ['melanch', 'focus'],
    about: 'Двойник с ремастером. Альбом про тревогу перед новым веком, записанный за три года до него.',
    tracks: ['Airbag', 'Paranoid Android', 'Subterranean Homesick Alien', 'Exit Music (For a Film)', 'Karma Police', 'No Surprises', 'Lucky'],
    cover: { style: 'grid', c1: '#e9eaec', c2: '#2b3a45', c3: '#d24b2f' }
  },
  {
    id: 'acdc-back', artist: 'AC/DC', title: 'Back in Black',
    genre: 'Классический рок', year: 1980, press: 2020, label: 'Columbia', country: 'Европа',
    price: 4890, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 7,
    tags: ['Хит продаж'], moods: ['drive'], entry: true,
    about: 'Второй самый продаваемый альбом в истории. Записан за полтора месяца после смерти Бона Скотта.',
    tracks: ['Hells Bells', 'Shoot to Thrill', 'Back in Black', 'You Shook Me All Night Long', 'Have a Drink on Me', 'Rock and Roll Ain’t Noise Pollution'],
    cover: { style: 'mono', c1: '#050505', c2: '#1a1a1a', c3: '#8f8f8f' }
  },
  {
    id: 'dp-machinehead', artist: 'Deep Purple', title: 'Machine Head',
    genre: 'Классический рок', year: 1972, press: 2016, label: 'Purple Records', country: 'Европа',
    price: 5190, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'VG+' }, stock: 2,
    tags: ['Б/у'], moods: ['drive', 'nostal'],
    about: 'Записан в коридорах отеля в Монтрё после того, как казино сгорело — история, которая стала «Smoke on the Water».',
    tracks: ['Highway Star', 'Maybe I’m a Leo', 'Pictures of Home', 'Smoke on the Water', 'Lazy', 'Space Truckin’'],
    cover: { style: 'flame', c1: '#0d0d10', c2: '#6f7bd6', c3: '#c9d0f0' }
  },

  /* ============ ПОП И СОВРЕМЕННОЕ ============ */
  {
    id: 'ldr-btd', artist: 'Lana Del Rey', title: 'Born to Die',
    genre: 'Поп', year: 2012, press: 2022, label: 'Interscope', country: 'Европа',
    price: 5290, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 6,
    tags: ['Хит продаж', '2LP'], moods: ['melanch', 'romance'], entry: true,
    about: 'Один из самых продаваемых виниловых альбомов в России последних лет. Кинематографичный поп, который не стареет.',
    tracks: ['Born to Die', 'Off to the Races', 'Blue Jeans', 'Video Games', 'Diet Mountain Dew', 'National Anthem', 'Summertime Sadness'],
    cover: { style: 'moon', c1: '#0b1526', c2: '#8ab4e8', c3: '#f3e9dc' }
  },
  {
    id: 'mj-thriller', artist: 'Michael Jackson', title: 'Thriller',
    genre: 'Поп', year: 1982, press: 2018, label: 'Epic', country: 'Европа',
    price: 4590, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 10,
    tags: ['Хит продаж'], moods: ['dance', 'nostal'], entry: true,
    about: 'Самый продаваемый альбом в истории. После выхода байопика вернулся в топы российских продаж винила.',
    tracks: ['Wanna Be Startin’ Somethin’', 'Thriller', 'Beat It', 'Billie Jean', 'Human Nature', 'P.Y.T.'],
    cover: { style: 'split', c1: '#0f0f12', c2: '#e8e2d5', c3: '#c0392b' }
  },
  {
    id: 'daftpunk-ram', artist: 'Daft Punk', title: 'Random Access Memories',
    genre: 'Электроника', year: 2013, press: 2021, label: 'Columbia', country: 'Европа',
    price: 6990, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4, mastering: 'Записан на аналоговой ленте, Capitol Studios',
    tags: ['2LP', 'Аудиофильское'], moods: ['dance', 'epic'], audiophile: true,
    about: 'Альбом, записанный принципиально на живых музыкантов и аналоговую ленту — на виниле звучит так, как задумывалось.',
    tracks: ['Give Life Back to Music', 'The Game of Love', 'Giorgio by Moroder', 'Instant Crush', 'Get Lucky', 'Touch', 'Doin’ It Right', 'Contact'],
    cover: { style: 'orbit', c1: '#050508', c2: '#c9a227', c3: '#3a3f4a' }
  },
  {
    id: 'amy-btb', artist: 'Amy Winehouse', title: 'Back to Black',
    genre: 'Поп', year: 2006, press: 2019, label: 'Island', country: 'Европа',
    price: 4390, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 5,
    tags: [], moods: ['melanch', 'romance'], entry: true,
    about: 'Соул шестидесятых, записанный в двухтысячные с секцией Dap-Kings. Голос, который невозможно спутать.',
    tracks: ['Rehab', 'You Know I’m No Good', 'Me & Mr Jones', 'Back to Black', 'Love Is a Losing Game', 'Tears Dry on Their Own'],
    cover: { style: 'mono', c1: '#0a0a0a', c2: '#f0ece4', c3: '#7a6a58' }
  },
  {
    id: 'weeknd-afterhours', artist: 'The Weeknd', title: 'After Hours',
    genre: 'Поп', year: 2020, press: 2022, label: 'Republic', country: 'Европа',
    price: 5490, discs: 2, weight: 180, color: 'Прозрачный красный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4,
    tags: ['Цветной винил', '2LP'], moods: ['dance', 'melanch'],
    about: 'Ограниченное издание на прозрачном красном виниле. Синтезаторы восьмидесятых, поданные как хоррор.',
    tracks: ['Alone Again', 'Hardest to Love', 'Scared to Live', 'Heartless', 'Faith', 'Blinding Lights', 'Save Your Tears', 'After Hours'],
    cover: { style: 'moon', c1: '#14060a', c2: '#e02040', c3: '#f0c0c0' }
  },
  {
    id: 'billie-whenweall', artist: 'Billie Eilish', title: 'When We All Fall Asleep, Where Do We Go?',
    genre: 'Поп', year: 2019, press: 2019, label: 'Darkroom / Interscope', country: 'Европа',
    price: 4790, discs: 1, weight: 180, color: 'Неоново-зелёный',
    grade: { media: 'M', sleeve: 'M' }, stock: 6,
    tags: ['Цветной винил'], moods: ['melanch', 'dance'],
    about: 'Записан в спальне брата на обычном интерфейсе — и собрал пять «Грэмми». Издание на неоново-зелёном виниле.',
    tracks: ['bad guy', 'xanny', 'you should see me in a crown', 'when the party’s over', 'bury a friend', 'ilomilo'],
    cover: { style: 'blot', c1: '#0a0f08', c2: '#8ede3a', c3: '#1c2418' }
  },
  {
    id: 'am-am', artist: 'Arctic Monkeys', title: 'AM',
    genre: 'Классический рок', year: 2013, press: 2013, label: 'Domino', country: 'Европа',
    price: 4690, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 8,
    tags: ['Хит продаж'], moods: ['drive', 'romance'], entry: true,
    about: 'Самый продаваемый винил среди альбомов XXI века. Обложка — визуализация звуковой волны.',
    tracks: ['Do I Wanna Know?', 'R U Mine?', 'Arabella', 'I Wanna Be Yours', 'Why’d You Only Call Me When You’re High?', 'Snap Out of It'],
    cover: { style: 'wave', c1: '#0a0a0a', c2: '#ffffff', c3: '#5a5a5a' }
  },

  /* ============ ДЖАЗ ============ */
  {
    id: 'miles-kindofblue', artist: 'Miles Davis', title: 'Kind of Blue',
    genre: 'Джаз', year: 1959, press: 2015, label: 'Columbia / Legacy', country: 'Европа',
    price: 4990, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 6, mastering: 'Mono/Stereo remaster с оригинальных лент',
    tags: ['Аудиофильское'], moods: ['focus', 'cozy'], entry: true, audiophile: true,
    about: 'Самый продаваемый джазовый альбом в истории и лучшая пластинка для проверки нового тракта. Записан за две сессии почти без репетиций.',
    tracks: ['So What', 'Freddie Freeloader', 'Blue in Green', 'All Blues', 'Flamenco Sketches'],
    cover: { style: 'split', c1: '#071a2c', c2: '#2e6f9e', c3: '#e8dcc0' }
  },
  {
    id: 'coltrane-love', artist: 'John Coltrane', title: 'A Love Supreme',
    genre: 'Джаз', year: 1965, press: 2016, label: 'Impulse! / Verve', country: 'Европа',
    price: 5590, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'NM' }, stock: 2, mastering: 'Acoustic Sounds Series, Ryan Smith',
    tags: ['Б/у', 'Аудиофильское'], moods: ['focus', 'epic'], audiophile: true,
    about: 'Сюита в четырёх частях — духовный манифест Колтрейна. Нарезка Райана Смита с оригинальной аналоговой ленты.',
    tracks: ['Acknowledgement', 'Resolution', 'Pursuance', 'Psalm'],
    cover: { style: 'sun', c1: '#0d0904', c2: '#e0a72c', c3: '#7a3a10' }
  },
  {
    id: 'brubeck-timeout', artist: 'Dave Brubeck Quartet', title: 'Time Out',
    genre: 'Джаз', year: 1959, press: 2018, label: 'Columbia', country: 'Европа',
    price: 4290, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 5,
    tags: [], moods: ['cozy', 'focus'], entry: true,
    about: 'Джаз в нечётных размерах, который при этом слушается как самая уютная музыка на свете. «Take Five» — в размере 5/4.',
    tracks: ['Blue Rondo à la Turk', 'Strange Meadow Lark', 'Take Five', 'Three to Get Ready', 'Kathy’s Waltz', 'Pick Up Sticks'],
    cover: { style: 'grid', c1: '#131010', c2: '#d9622b', c3: '#e8d9b8' }
  },
  {
    id: 'evans-waltz', artist: 'Bill Evans Trio', title: 'Waltz for Debby',
    genre: 'Джаз', year: 1961, press: 2019, label: 'Riverside / OJC', country: 'Европа',
    price: 5890, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG+' }, stock: 1,
    tags: ['Б/у', 'Последний экземпляр'], moods: ['cozy', 'romance'],
    about: 'Живая запись в Village Vanguard за одиннадцать дней до гибели басиста Скотта Лафаро. Слышно, как звенят бокалы в зале.',
    tracks: ['My Foolish Heart', 'Waltz for Debby', 'Detour Ahead', 'My Romance', 'Some Other Time', 'Milestones'],
    cover: { style: 'mono', c1: '#12100c', c2: '#c8b48a', c3: '#4a4238' }
  },

  /* ============ КЛАССИКА ============ */
  {
    id: 'tchaikovsky-seasons', artist: 'П. И. Чайковский', title: 'Времена года',
    genre: 'Классика', year: 1876, press: 2021, label: 'Мелодия', country: 'Россия',
    price: 3290, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 7,
    tags: ['Новое издание'], moods: ['focus', 'cozy'], entry: true,
    about: 'Издание «Мелодии» с архивных лент фирмы. Классика стабильно входит в тройку самых продаваемых жанров винила в России.',
    tracks: ['Январь. У камелька', 'Апрель. Подснежник', 'Июнь. Баркарола', 'Октябрь. Осенняя песнь', 'Декабрь. Святки'],
    cover: { style: 'blot', c1: '#0c1418', c2: '#9fc6d8', c3: '#e8eef0' }
  },
  {
    id: 'vivaldi-seasons', artist: 'Antonio Vivaldi', title: 'Le quattro stagioni',
    genre: 'Классика', year: 1725, press: 2020, label: 'Deutsche Grammophon', country: 'Германия',
    price: 4990, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4, mastering: 'Original Source, аналоговая нарезка',
    tags: ['Аудиофильское'], moods: ['focus', 'epic'], audiophile: true,
    about: 'Серия Original Source: нарезка напрямую с оригинальной четырёхдорожечной ленты, без цифрового звена в тракте.',
    tracks: ['La primavera', 'L’estate', 'L’autunno', 'L’inverno'],
    cover: { style: 'orbit', c1: '#0a1206', c2: '#7fb03a', c3: '#e8e0c0' }
  },
  {
    id: 'einaudi-sevendays', artist: 'Ludovico Einaudi', title: 'Seven Days Walking: Day One',
    genre: 'Классика', year: 2019, press: 2019, label: 'Decca', country: 'Европа',
    price: 4190, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 5,
    tags: [], moods: ['focus', 'melanch'], entry: true,
    about: 'Фортепиано, скрипка и виолончель, записанные как дневник семи прогулок по зимним Альпам. Идеальная пластинка для работы.',
    tracks: ['Low Mist Var. 1', 'Golden Butterflies Var. 1', 'Cold Wind Var. 1', 'A Sense of Symmetry', 'Ascent'],
    cover: { style: 'wave', c1: '#141618', c2: '#b8c4c8', c3: '#f0f2f2' }
  },

  /* ============ САУНДТРЕКИ ============ */
  {
    id: 'ost-pulpfiction', artist: 'Various Artists', title: 'Pulp Fiction. Оригинальный саундтрек',
    genre: 'Саундтреки', year: 1994, press: 2016, label: 'Geffen', country: 'Европа',
    price: 4890, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 6,
    tags: ['Хит продаж'], moods: ['drive', 'nostal'], entry: true,
    about: 'Сёрф-рок, соул и диалоги Тарантино на одной стороне. Один из самых востребованных саундтреков на российском рынке винила.',
    tracks: ['Misirlou — Dick Dale', 'Jungle Boogie — Kool & The Gang', 'Son of a Preacher Man — Dusty Springfield', 'Girl, You’ll Be a Woman Soon — Urge Overkill', 'Surf Rider — The Lively Ones'],
    cover: { style: 'mono', c1: '#1a1208', c2: '#e8d8a8', c3: '#b02020' }
  },
  {
    id: 'ost-smeshariki', artist: 'Смешарики', title: 'Музыка из мультсериала',
    genre: 'Саундтреки', year: 2023, press: 2023, label: 'Мелодия', country: 'Россия',
    price: 3690, discs: 1, weight: 180, color: 'Оранжевый',
    grade: { media: 'M', sleeve: 'M' }, stock: 9,
    tags: ['Цветной винил', 'Хит продаж'], moods: ['cozy', 'nostal'], entry: true,
    about: 'Неожиданный, но стабильный хит российских продаж винила: первая пластинка, которую покупают детям — и оставляют себе.',
    tracks: ['Круглая песня', 'Романтика', 'Песня Кроша', 'Бумажный самолётик', 'Финальная тема'],
    cover: { style: 'orbit', c1: '#1a1008', c2: '#f0902a', c3: '#ffd88a' }
  },
  {
    id: 'ost-interstellar', artist: 'Hans Zimmer', title: 'Interstellar',
    genre: 'Саундтреки', year: 2014, press: 2019, label: 'Sony Classical', country: 'Европа',
    price: 6490, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 3, mastering: 'Записан на органе Temple Church, Лондон',
    tags: ['2LP', 'Аудиофильское'], moods: ['epic', 'focus'], audiophile: true,
    about: 'Орган храма Темпл в Лондоне на виниле — одна из самых сложных для воспроизведения записей. Проверка нижнего регистра вашей системы.',
    tracks: ['Dreaming of the Crash', 'Cornfield Chase', 'Mountains', 'No Time for Caution', 'Detach', 'Day One'],
    cover: { style: 'moon', c1: '#03060c', c2: '#3a5a8a', c3: '#e0e8f0' }
  },
  {
    id: 'ost-bladerunner', artist: 'Hans Zimmer & Benjamin Wallfisch', title: 'Blade Runner 2049',
    genre: 'Саундтреки', year: 2017, press: 2018, label: 'Epic', country: 'Европа',
    price: 5990, discs: 2, weight: 180, color: 'Прозрачный янтарный',
    grade: { media: 'M', sleeve: 'M' }, stock: 2,
    tags: ['Цветной винил', '2LP'], moods: ['epic', 'melanch'],
    about: 'Синтезаторные стены звука на янтарном прозрачном виниле — под цвет лос-анджелесского смога из фильма.',
    tracks: ['2049', 'Sapper’s Tree', 'Flight to LAPD', 'Mesa', 'Sea Wall', 'Tears in the Rain'],
    cover: { style: 'city', c1: '#1a0c04', c2: '#e08a2a', c3: '#4a1c08' }
  },
  {
    id: 'ost-twinpeaks', artist: 'Angelo Badalamenti', title: 'Twin Peaks. Оригинальный саундтрек',
    genre: 'Саундтреки', year: 1990, press: 2017, label: 'Death Waltz', country: 'Европа',
    price: 7290, discs: 1, weight: 180, color: 'Чёрный с красным',
    grade: { media: 'NM', sleeve: 'NM' }, stock: 1,
    tags: ['Б/у', 'Последний экземпляр', 'Цветной винил'], moods: ['melanch', 'cozy'],
    about: 'Издание Death Waltz с новым артом и разворотным конвертом. Тот самый саундтрек, под который заваривают кофе.',
    tracks: ['Twin Peaks Theme', 'Laura Palmer’s Theme', 'Audrey’s Dance', 'Dance of the Dream Man', 'Falling'],
    cover: { style: 'stripes', c1: '#0a0806', c2: '#8a1a1a', c3: '#d8cbb0' }
  },

  /* ============ ЭЛЕКТРОНИКА И ХИП-ХОП ============ */
  {
    id: 'massive-mezzanine', artist: 'Massive Attack', title: 'Mezzanine',
    genre: 'Электроника', year: 1998, press: 2019, label: 'Virgin', country: 'Европа',
    price: 5890, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 3,
    tags: ['2LP'], moods: ['melanch', 'focus'],
    about: 'Трип-хоп, у которого низ проработан так, что пластинку берут для настройки сабвуфера.',
    tracks: ['Angel', 'Risingson', 'Teardrop', 'Inertia Creeps', 'Dissolved Girl', 'Group Four'],
    cover: { style: 'blot', c1: '#050608', c2: '#2a3a48', c3: '#8a9aa8' }
  },
  {
    id: 'kendrick-gkmc', artist: 'Kendrick Lamar', title: 'good kid, m.A.A.d city',
    genre: 'Хип-хоп', year: 2012, press: 2020, label: 'Aftermath / Interscope', country: 'Европа',
    price: 5690, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'M', sleeve: 'M' }, stock: 4,
    tags: ['2LP'], moods: ['drive', 'focus'],
    about: 'Автобиографический альбом-фильм о Комптоне. Один из немногих хип-хоп релизов, который стабильно продаётся на виниле.',
    tracks: ['Sherane', 'Bitch, Don’t Kill My Vibe', 'Money Trees', 'Poetic Justice', 'Swimming Pools', 'Sing About Me'],
    cover: { style: 'mono', c1: '#101010', c2: '#d8d0c0', c3: '#7a6a50' }
  },
  {
    id: 'portishead-dummy', artist: 'Portishead', title: 'Dummy',
    genre: 'Электроника', year: 1994, press: 2014, label: 'Go! Beat', country: 'Европа',
    price: 5290, discs: 1, weight: 180, color: 'Чёрный',
    grade: { media: 'NM', sleeve: 'VG+' }, stock: 2,
    tags: ['Б/у'], moods: ['melanch', 'romance'],
    about: 'Бристольский трип-хоп, собранный из семплов, терменвокса и голоса Бет Гиббонс. Пластинка для одного слушателя и ночи.',
    tracks: ['Mysterons', 'Sour Times', 'Strangers', 'It Could Be Sweet', 'Wandering Star', 'Glory Box'],
    cover: { style: 'grid', c1: '#0a0a0c', c2: '#4a5058', c3: '#c8bca8' }
  },
  {
    id: 'boc-mhtrtc', artist: 'Boards of Canada', title: 'Music Has the Right to Children',
    genre: 'Электроника', year: 1998, press: 2013, label: 'Warp', country: 'Европа',
    price: 8490, discs: 2, weight: 180, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG+' }, stock: 1,
    tags: ['Б/у', 'Раритет', 'Последний экземпляр', '2LP'], moods: ['focus', 'nostal'],
    about: 'Позиция вторичного рынка: тираж давно распродан, переизданий не было. Ностальгическая электроника, звучащая как выцветшая VHS-кассета.',
    tracks: ['Wildlife Analysis', 'An Eagle in Your Mind', 'Telephasic Workshop', 'Roygbiv', 'Aquarius', 'Olson'],
    cover: { style: 'sun', c1: '#141008', c2: '#c8a860', c3: '#6a8a5a' }
  },

  /* ============ РАРИТЕТЫ ВТОРИЧНОГО РЫНКА ============ */
  {
    id: 'melodiya-vysotsky', artist: 'Владимир Высоцкий', title: 'Сентиментальный боксёр',
    genre: 'Раритеты', year: 1987, press: 1987, label: 'Мелодия', country: 'СССР',
    price: 9900, discs: 1, weight: 140, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG' }, stock: 1,
    tags: ['Раритет', 'Оригинальный пресс', 'Последний экземпляр'], moods: ['nostal'],
    about: 'Оригинальный советский пресс Апрелевского завода из серии «На концертах Владимира Высоцкого». Конверт с потёртостями по углам — честно указано в оценке.',
    tracks: ['Сентиментальный боксёр', 'Песня о госпитале', 'Он не вернулся из боя', 'Братские могилы'],
    cover: { style: 'mono', c1: '#141210', c2: '#d8cdb8', c3: '#8a4a2a' }
  },
  {
    id: 'melodiya-pesniary', artist: 'Песняры', title: 'Песняры II',
    genre: 'Раритеты', year: 1974, press: 1974, label: 'Мелодия', country: 'СССР',
    price: 6900, discs: 1, weight: 140, color: 'Чёрный',
    grade: { media: 'VG', sleeve: 'VG' }, stock: 1,
    tags: ['Раритет', 'Оригинальный пресс', 'Последний экземпляр'], moods: ['nostal', 'cozy'],
    about: 'Ленинградский завод, синяя этикетка «Мелодии». Играет ровно, лёгкий фоновый шум на тихих местах — типично для прессов тех лет.',
    tracks: ['Вологда', 'Беловежская пуща', 'Косил Ясь конюшину', 'Александрына'],
    cover: { style: 'stripes', c1: '#0e1408', c2: '#4a7a3a', c3: '#e0d8b8' }
  },
  {
    id: 'beatles-melodiya', artist: 'The Beatles', title: 'Вкус мёда',
    genre: 'Раритеты', year: 1986, press: 1986, label: 'Мелодия', country: 'СССР',
    price: 14900, discs: 1, weight: 140, color: 'Чёрный',
    grade: { media: 'VG+', sleeve: 'VG+' }, stock: 1,
    tags: ['Раритет', 'Оригинальный пресс', 'Последний экземпляр'], moods: ['nostal'],
    about: 'Легендарное издание «Мелодии», где The Beatles значились как «ансамбль». Коллекционная позиция: советские лицензионники Битлз — отдельная дисциплина в коллекционировании.',
    tracks: ['A Taste of Honey', 'Till There Was You', 'Anna', 'Chains', 'Boys', 'Baby It’s You'],
    cover: { style: 'crown', c1: '#141010', c2: '#c8a038', c3: '#e8e0d0' }
  }
];

/* Аксессуары и техника — прямой ответ на средний чек 3 200 ₽ при
   медианной цене пластинки 1 978 ₽: люди добирают в корзину. */
const GEAR = [
  { id: 'g-audiotechnica', kind: 'Проигрыватель', name: 'Audio-Technica AT-LP60X', price: 24990,
    note: 'Автоматический, с встроенным фонокорректором. Классический первый проигрыватель — подключается к любым активным колонкам.',
    cover: { style: 'grid', c1: '#101214', c2: '#c8c8cc', c3: '#8a3a2a' } },
  { id: 'g-probject', kind: 'Проигрыватель', name: 'Pro-Ject Primary E', price: 32900,
    note: 'Ручной привод, картридж Ormofon OM 5E. Шаг вверх для тех, кто уже понял, что это надолго.',
    cover: { style: 'orbit', c1: '#0c0c0e', c2: '#d8d8dc', c3: '#4a6a8a' } },
  { id: 'g-brush', kind: 'Уход', name: 'Антистатическая щётка из углеволокна', price: 1490,
    note: 'Снимает пыль и статику за один проход перед каждым прослушиванием. Первое, что стоит купить после пластинки.',
    cover: { style: 'stripes', c1: '#0e1010', c2: '#3a8a7a', c3: '#d8e0dc' } },
  { id: 'g-sleeves', kind: 'Уход', name: 'Внутренние конверты, антистатик (50 шт.)', price: 1990,
    note: 'Рисовая бумага с полиэтиленовой подкладкой. Заводские бумажные конверты царапают пластинку — это факт, а не маркетинг.',
    cover: { style: 'mono', c1: '#12120e', c2: '#e0dcc8', c3: '#7a7458' } },
  { id: 'g-outer', kind: 'Уход', name: 'Внешние конверты для LP (25 шт.)', price: 1290,
    note: 'Защищают обложку от истирания и выцветания. Для коллекционных позиций — обязательно.',
    cover: { style: 'split', c1: '#101014', c2: '#8a8ab0', c3: '#e0e0e8' } },
  { id: 'g-stand', kind: 'Хранение', name: 'Дубовая стойка на 60 пластинок', price: 8900,
    note: 'Массив дуба, вертикальное хранение под правильным углом. Пластинки нельзя класть стопкой — коробятся.',
    cover: { style: 'grid', c1: '#140f08', c2: '#b07a3a', c3: '#e8d8b8' } },
  { id: 'g-cleaner', kind: 'Уход', name: 'Жидкость для глубокой очистки + салфетка', price: 2490,
    note: 'Спиртовой раствор без агрессивных ПАВ. Для б/у пластинок с барахолки — возвращает звук.',
    cover: { style: 'blot', c1: '#0a1014', c2: '#4aa0c8', c3: '#d8ecf4' } },
  { id: 'g-wallmount', kind: 'Хранение', name: 'Настенный держатель для 4 обложек', price: 3490,
    note: 'Пластинку видно, обложку — тоже. Меняете экспозицию под настроение.',
    cover: { style: 'star', c1: '#12100c', c2: '#d8a03a', c3: '#e8e0d0' } }
];

/* Наборы — механика для сегментов «Неофит» и «Дарящий». */
const BUNDLES = [
  { id: 'b-first', title: 'Первая пластинка', tagline: 'Всё для старта, ничего лишнего',
    items: ['Проигрыватель Audio-Technica AT-LP60X', 'Пластинка на ваш выбор до 4 000 ₽', 'Антистатическая щётка', 'Гид «Как не убить пластинку за первый месяц»'],
    price: 29900, old: 32970, accent: '#e8b93a' },
  { id: 'b-care', title: 'Набор ухода', tagline: 'Чтобы коллекция пережила вас',
    items: ['Антистатическая щётка', 'Внутренние конверты, 50 шт.', 'Внешние конверты, 25 шт.', 'Жидкость для глубокой очистки'],
    price: 6490, old: 7260, accent: '#4aa0c8' },
  { id: 'b-gift', title: 'Подарочный', tagline: 'Не знаете вкус — не проблема',
    items: ['Пластинка по результату подбора настроения', 'Подарочная упаковка и открытка от руки', 'Сертификат на обмен, если не угадали', 'Бесплатная доставка'],
    price: 5900, old: 6400, accent: '#d94f2b' }
];

const DELIVERY_FREE_FROM = 3000;
