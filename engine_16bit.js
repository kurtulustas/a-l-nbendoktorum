/* ================= ENGINE_16BIT.JS — 16-BİT RENDER, AÇIK DÜNYA & KLİNİK ================= */
let soundOn = true;
const keys = {};
window.addEventListener('keydown', e => { keys[e.code] = true; });
window.addEventListener('keyup', e => { keys[e.code] = false; });

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById('btnSound').textContent = soundOn ? '🔊' : '🔇';
}

if (localStorage.getItem(SAVE_KEY)) {
  const btn = document.getElementById('btnContinueSave');
  btn.style.display = 'block';
  btn.onclick = () => {
    if (loadCareer()) {
      document.getElementById('startScreen').style.display = 'none';
      updateHud(); nextPatient();
    }
  };
}

document.getElementById('btnStartGame').onclick = () => {
  const dn = document.getElementById('inpDocName').value.trim();
  const hn = document.getElementById('inpHospName').value.trim();
  const ak = document.getElementById('inpApiKey').value.trim();
  if (dn) state.docName = dn;
  if (hn) state.hospName = hn;
  if (ak) state.apiKey = ak;
  document.getElementById('startScreen').style.display = 'none';
  updateHud(); saveCareer(); nextPatient();
};

function updateHud() {
  document.getElementById('hudDay').textContent = `G${state.day} ${state.seenToday}/5`;
  document.getElementById('hudMoney').textContent = `${state.money.toLocaleString('tr-TR')}₺`;
  document.getElementById('repFill').style.width = `${Math.max(10, state.rep)}%`;
  document.getElementById('hudTus').textContent = `TUS:${state.tusScore}`;
  document.getElementById('hudWarn').textContent = `⚠️${state.warnings}/3`;
  document.getElementById('clockTag').textContent = `${String(state.hour % 24).padStart(2, '0')}:00`;
  const sp = SPECIALTIES[state.specialty] || SPECIALTIES.none;
  document.getElementById('rankTag').textContent = `${sp.icon} ${sp.title.toUpperCase()}`;
}

function say(speaker, text, badgeText = 'AKTİF', badgeClass = 't-green') {
  document.getElementById('speakerName').textContent = speaker;
  const b = document.getElementById('triageBadge');
  b.textContent = badgeText;
  b.className = 'triage-badge ' + badgeClass;
  document.getElementById('dialogueText').textContent = text;
}

function addChoice(parent, label, onClick, extraClass = '') {
  const b = document.createElement('button');
  b.className = 'choice-btn ' + extraClass;
  b.textContent = label;
  b.onclick = onClick;
  parent.appendChild(b);
}

/* ================= AÇIK DÜNYA ŞEHİR HARİTASI MODU ================= */
function enterOpenWorld() {
  state.location = 'world';
  closeDrawer();
  document.getElementById('mobileDpad').style.display = 'grid';
  document.getElementById('sceneTag').textContent = 'AYDIN AÇIK DÜNYA — WASD / OK TUŞLARIYLA GEZ';
  document.getElementById('worldHint').textContent = 'Binaların kapısına yaklaşarak giriş yap!';
  say('AÇIK DÜNYA ŞEHİR MODU', 'Yön tuşları veya WASD ile Aydın sokaklarında yürü ya da arabanla gez! Hastane, Ev (PS5), Galeri, Lokanta veya Halı Sahaya girebilirsin.', 'KEŞİF', 't-green');
  const p = document.getElementById('subPanel');
  p.innerHTML = '';
  addChoice(p, '🏠 Doğrudan Eve Gir & PS5 Aç (GTA 6 / EA FC 27)', () => goLocation('home'), 'purple');
  addChoice(p, '🏥 Hastane Polikliniğine Dön', () => nextPatient(), 'success');
}

function updateOpenWorld() {
  const wp = state.worldPlayer;
  const spd = state.assets.car !== 'Yok (Belediye Otobüsü)' ? 2.4 : 1.5;
  if (keys['ArrowUp'] || keys['KeyW']) { wp.y = Math.max(12, wp.y - spd); wp.dir = 'up'; }
  if (keys['ArrowDown'] || keys['KeyS']) { wp.y = Math.min(164, wp.y + spd); wp.dir = 'down'; }
  if (keys['ArrowLeft'] || keys['KeyA']) { wp.x = Math.max(12, wp.x - spd); wp.dir = 'left'; }
  if (keys['ArrowRight'] || keys['KeyD']) { wp.x = Math.min(464, wp.x + spd); wp.dir = 'right'; }

  for (const b of WORLD_BUILDINGS) {
    if (wp.x > b.x && wp.x < b.x + b.w && wp.y > b.y && wp.y < b.y + b.h) {
      wp.y += (wp.y < 90 ? 18 : -18);
      document.getElementById('mobileDpad').style.display = 'none';
      if (b.id === 'er') nextPatient();
      else goLocation(b.id);
      break;
    }
  }
}

/* ================= KLİNİK VAKA AKIŞI ================= */
function nextPatient() {
  document.getElementById('mobileDpad').style.display = 'none';
  if (state.seenToday >= 5) {
    state.day++; state.seenToday = 0; state.hour = 20;
    const pay = 1200 + (SPECIALTIES[state.specialty]?.bonusPay || 0);
    state.money += pay;
    updateHud(); saveCareer();
    say(`GÜN ${state.day - 1} NÖBETİ BİTTİ`, `Döner sermaye ödemesi +${pay}₺ hesabına yattı! Evine gidip PS5 oynayabilir veya yeni nöbete geçebilirsin.`, 'NÖBET SONU', 't-green');
    const p = document.getElementById('subPanel'); p.innerHTML = '';
    addChoice(p, '🏠 Eve Git & PS5 Oyna (GTA 6 / EA FC 27)', () => goLocation('home'), 'purple');
    addChoice(p, '🌆 Açık Dünyada Gez', () => enterOpenWorld());
    addChoice(p, '🏥 Yeni Nöbete Başla', () => nextPatient(), 'success');
    return;
  }

  state.location = 'er';
  const sp = SPECIALTIES[state.specialty];
  document.getElementById('sceneTag').textContent = state.specialty === 'none'
    ? `${state.hospName.toUpperCase()} — ODA 1`
    : `${sp.icon} ${sp.title.toUpperCase()} POLİKLİNİĞİ`;

  let pool = state.specialty !== 'none'
    ? ALL_CASES.filter(c => c.spec === state.specialty)
    : ALL_CASES;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  state.currentPatient = chosen;
  state.examDone = { vitals: false, lung: false, pupil: false, rad: false, labs: false, enabiz: false };

  const badgeMap = { red: ['KIRMIZI ALAN', 't-red'], yellow: ['SARI ALAN', 't-yellow'], green: ['YEŞİL ALAN', 't-green'] };
  const [bt, bc] = badgeMap[chosen.triage];
  say(chosen.name, `"${chosen.complaint}"`, bt, bc);
  setTab('talk');
}

function setTab(tab) {
  state.tab = tab;
  ['tabTalk','tabExam','tabFile','tabDecide'].forEach(id => document.getElementById(id).classList.remove('active'));
  const map = { talk: 'tabTalk', exam: 'tabExam', file: 'tabFile', decide: 'tabDecide' };
  if (map[tab]) document.getElementById(map[tab]).classList.add('active');

  const panel = document.getElementById('subPanel');
  panel.innerHTML = '';
  const p = state.currentPatient;
  if (!p || state.location !== 'er') return;

  if (tab === 'talk') {
    addChoice(panel, 'Anamnezi Derinleştir & Klinik İpucu Al', () => say(p.name, `"${p.complaint}"\n(İpucu: ${p.hint})`, 'ANAMNEZ', 't-yellow'));
  } else if (tab === 'exam') {
    addChoice(panel, 'Vital Bulgular (TA / Nabız / SpO2)', () => { state.examDone.vitals = true; say('VİTALLER', p.vitals, 'VİTAL', 't-yellow'); });
    addChoice(panel, 'Fizik Muayene & Oskültasyon', () => { state.examDone.lung = true; say('MUAYENE', p.lung, 'MUAYENE', 't-yellow'); });
    addChoice(panel, 'Pupilla & Göz Feneri Muayenesi', () => { state.examDone.pupil = true; say('PUPILLA', p.pupil, 'NÖRO-GÖZ', 't-yellow'); });
  } else if (tab === 'file') {
    addChoice(panel, 'Radyoloji & Görüntüleme Raporu', () => { state.examDone.rad = true; say('GÖRÜNTÜLEME', p.radFinding, 'RADYOLOJİ', 't-yellow'); });
    addChoice(panel, 'Biyokimya & Kan Tahlilleri', () => { state.examDone.labs = true; say('LABORATUVAR', p.labs, 'TAHLİL', 't-yellow'); });
  } else if (tab === 'decide') {
    addChoice(panel, `Servise Yatır (${p.targetService})`, () => {
      const ok = p.correctAction === 'admit';
      finishCase(ok, ok ? `${p.targetService} kliniğine yatış yapıldı! +550₺ & +1 TUS` : 'Bu hastanın yatış endikasyonu yok!');
    }, 'success');
    addChoice(panel, `Poliklinikte Müdahale Et (${p.treatLabel})`, () => {
      const ok = p.correctAction === 'treat';
      finishCase(ok, ok ? `${p.treatLabel} başarıyla uygulandı! +500₺ & +1 TUS` : 'Bu vaka servise yatış gerektiriyordu!');
    });
    addChoice(panel, 'Reçete Yaz & Taburcu Et', () => {
      const ok = p.correctAction === 'discharge';
      finishCase(ok, ok ? 'Hasta güvenle taburcu edildi. +350₺' : 'Kritik hastayı eve gönderdin!');
    }, 'danger');
  }
}

function finishCase(ok, msg) {
  state.seenToday++; state.hour += 2;
  if (ok) {
    state.money += 500 + (SPECIALTIES[state.specialty]?.bonusPay || 0);
    state.tusScore += 1; state.rep = Math.min(100, state.rep + 3);
  } else {
    state.warnings++; state.rep = Math.max(0, state.rep - 6);
  }
  updateHud(); saveCareer();
  say(ok ? 'BAŞARILI MÜDAHALE ✓' : 'KLİNİK HATA ✕', msg, ok ? '+KAZANÇ' : 'UYARI', ok ? 't-green' : 't-red');
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  addChoice(panel, 'Sıradaki Hastayı Çağır', () => nextPatient(), 'success');
}

/* ================= MEKÂN YÖNETİMİ (EVDE PS5, HALI SAHA, GALERİ) ================= */
function goLocation(loc) {
  state.location = loc;
  closeDrawer();
  const panel = document.getElementById('subPanel');
  panel.innerHTML = '';

  if (loc === 'home') {
    document.getElementById('sceneTag').textContent = 'EVİM — SALON & PS5 PRO OYUN KÖŞESİ';
    say('EVİM GÜZEL EVİM', '4K TV ve PS5 Pro açık! Tam ekranda GTA 6: Aydın Vice veya EA FC 27 oynayabilir, ya da TUS çalışabilirsin.', 'EV & KONSOL', 't-purple');
    addChoice(panel, '🚗 TAM EKRAN PS5: GTA 6 — Aydın Vice Oyna', () => openConsole('gta6'), 'purple');
    addChoice(panel, '⚽ TAM EKRAN PS5: EA FC 27 — Kanat Forvet Oyna', () => openConsole('fifa'), 'success');
    addChoice(panel, '📚 Evde TUS Çalış (-300₺ -> +3 TUS Puanı)', () => {
      if (state.money >= 300) { state.money -= 300; state.tusScore += 3; updateHud(); saveCareer(); say('TUS ETÜTÜ', `TUS puanın ${state.tusScore} oldu!`, 'TUS +3', 't-green'); }
    });
    addChoice(panel, '🌆 Açık Dünyaya Çık', () => enterOpenWorld());
    addChoice(panel, '🏥 Hastaneye Dön', () => nextPatient());
  }
  else if (loc === 'pitch') {
    document.getElementById('sceneTag').textContent = 'AYDIN HALI SAHA TESİSLERİ';
    say('HALI SAHA MAÇI', 'Kanat forvet mevkisinde maça çıkıp stres at ve galibiyet primi kazan!', 'MAÇ', 't-green');
    addChoice(panel, '⚽ Maça Çık (Tam Ekran EA FC 27 Motoru)', () => openConsole('fifa'), 'success');
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
  else if (loc === 'dealer') {
    document.getElementById('sceneTag').textContent = 'OTO GALERİ & SANAYİ';
    say('OTO GALERİ', `Mevcut Aracın: ${state.assets.car} | Bakiye: ${state.money}₺`, 'GALERİ', 't-yellow');
    addChoice(panel, '1998 Modifiyeli Şahin Al (2.500₺)', () => {
      if (state.money >= 2500) { state.money -= 2500; state.assets.car = 'Modifiyeli Şahin'; state.assets.carColor = '#ff6b6b'; updateHud(); saveCareer(); goLocation('dealer'); }
    });
    addChoice(panel, '2024 Alman Sedan Al (6.500₺)', () => {
      if (state.money >= 6500) { state.money -= 6500; state.assets.car = 'Alman Sedan'; state.assets.carColor = '#51cf66'; updateHud(); saveCareer(); goLocation('dealer'); }
    });
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
  else if (loc === 'diner') {
    document.getElementById('sceneTag').textContent = 'ESNAF LOKANTASI';
    say('USTA AŞÇI', 'Hoş geldin doktor bey! Mercimek çorbası + kavurma stresi sıfırlar.', 'LOKANTA', 't-yellow');
    addChoice(panel, 'Çorba + Kavurma Ye (-90₺, -15 Stres)', () => {
      if (state.money >= 90) { state.money -= 90; state.stress = Math.max(0, state.stress - 15); updateHud(); saveCareer(); say('AFİYET OLSUN', 'Enerjin yerine geldi!', 'STOK FULL', 't-green'); }
    });
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
  else if (loc === 'canteen') {
    document.getElementById('sceneTag').textContent = 'HASTANE KANTİNİ';
    say('HASTANE KANTİNİ', 'Asistan Dr. Elif ve hemşire ekibi kahve molasında.', 'KANTİN', 't-yellow');
    addChoice(panel, 'Ekibe Kahve Ismarla (-60₺, +4 İtibar)', () => {
      if (state.money >= 60) { state.money -= 60; state.rep = Math.min(100, state.rep + 4); updateHud(); saveCareer(); }
    });
    addChoice(panel, '🏥 Polikliniğe Dön', () => nextPatient(), 'success');
  }
}

/* ================= DRAWER & TELEFON ================= */
function openSidePanel(title) {
  document.getElementById('app').classList.add('split-open');
  document.getElementById('drawerTitle').textContent = title;
  const b = document.getElementById('drawerBody'); b.innerHTML = ''; return b;
}
function closeDrawer() { document.getElementById('app').classList.remove('split-open'); }

function openDrawer(type) {
  if (type === 'tus') {
    const body = openSidePanel('TUS & 8 KLİNİK UZMANLIK');
    Object.values(SPECIALTIES).filter(s => s.id !== 'none').forEach(sp => {
      const ok = state.tusScore >= sp.reqTus && state.rep >= sp.reqRep;
      addChoice(body, `${sp.icon} ${sp.title} (Şart: ${sp.reqTus} TUS | +${sp.bonusPay}₺)`, () => {
        if (!ok) { alert(`En az ${sp.reqTus} TUS Puanı ve ${sp.reqRep} İtibar gerekli!`); return; }
        state.specialty = sp.id; updateHud(); saveCareer(); closeDrawer(); nextPatient();
      }, ok ? 'purple' : '');
    });
  } else if (type === 'map') {
    const body = openSidePanel('HIZLI ULAŞIM HARİTASI');
    addChoice(body, '🌆 Açık Dünya Modunda Gez', () => enterOpenWorld(), 'success');
    addChoice(body, '🏥 Hastane Polikliniği', () => nextPatient());
    addChoice(body, '🏠 Evim (PS5: GTA 6 & EA FC 27)', () => goLocation('home'), 'purple');
    addChoice(body, '⚽ Aydın Halı Saha', () => goLocation('pitch'));
    addChoice(body, '🚗 Oto Galeri', () => goLocation('dealer'));
    addChoice(body, '🍲 Esnaf Lokantası', () => goLocation('diner'));
  } else if (type === 'shop') {
    const body = openSidePanel('MASA EKİPMANLARI');
    [['thermos','Çelik Termos (400₺)',400],['cactus','Saksı Kaktüsü (250₺)',250],['littmann','Littmann Stetoskop (700₺)',700]].forEach(([k,l,c]) => {
      addChoice(body, state.upgrades[k] ? `${l} [ALINDI ✓]` : l, () => {
        if (!state.upgrades[k] && state.money >= c) { state.money -= c; state.upgrades[k] = true; updateHud(); saveCareer(); openDrawer('shop'); }
      });
    });
  }
}

function openPhone() {
  const body = openSidePanel('TIPPHONE 17 PRO');
  addChoice(body, '🚗 Uzaktan Oyun: GTA 6 (Bulut Oyun)', () => openConsole('gta6'), 'purple');
  addChoice(body, '⚽ Uzaktan Oyun: EA FC 27 (Bulut Oyun)', () => openConsole('fifa'), 'success');
  addChoice(body, '💳 TıpBank Hesap Özeti', () => alert(`Güncel Bakiye: ${state.money}₺\nUnvan: ${SPECIALTIES[state.specialty].title}`));
}

/* ================= 16-BİT PİKSEL ART CANVAS RENDER (480x180) ================= */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
let tick = 0;

function pxRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawPixelCharacter(x, y, opts) {
  const { skin = '#f1c2a5', hair = '#2b1d14', shirt = '#1971c2', isDoctor = false, flush = false, sweat = false, bob = 0 } = opts;
  const sy = Math.floor(y + bob), sx = Math.floor(x);
  pxRect(sx + 6, sy, 16, 4, hair);
  pxRect(sx + 4, sy + 3, 20, 6, hair);
  pxRect(sx + 6, sy + 6, 16, 13, skin);
  if (flush) { pxRect(sx + 7, sy + 13, 3, 2, '#ff6b6b'); pxRect(sx + 18, sy + 13, 3, 2, '#ff6b6b'); }
  pxRect(sx + 8, sy + 10, 4, 3, '#fff'); pxRect(sx + 16, sy + 10, 4, 3, '#fff');
  pxRect(sx + 9, sy + 10, 2, 2, '#111'); pxRect(sx + 17, sy + 10, 2, 2, '#111');
  if (sweat) pxRect(sx + 24, sy + 7 + (Math.floor(tick / 6) % 4), 2, 3, '#3bc9db');
  pxRect(sx + 11, sy + 19, 6, 3, '#c68b6b');
  if (isDoctor) {
    pxRect(sx + 3, sy + 22, 22, 22, '#f8f9fa');
    pxRect(sx + 10, sy + 22, 8, 22, shirt);
    pxRect(sx + 9, sy + 22, 1, 8, '#343a40');
    pxRect(sx + 18, sy + 22, 1, 8, '#343a40');
  } else {
    pxRect(sx + 2, sy + 22, 24, 22, shirt);
  }
}

function renderOpenWorldCanvas() {
  updateOpenWorld();
  // Çim & Şehir Zemini
  pxRect(0, 0, 480, 180, '#163020');
  // Asfalt Bulvarlar
  pxRect(0, 82, 480, 28, '#1e293b');
  pxRect(130, 0, 22, 180, '#1e293b');
  pxRect(365, 0, 22, 180, '#1e293b');
  // Yol Çizgileri
  for (let i = 0; i < 480; i += 20) pxRect(i, 95, 10, 2, '#fcc419');

  // Şehir Binaları
  for (const b of WORLD_BUILDINGS) {
    pxRect(b.x, b.y, b.w, b.h, b.color);
    pxRect(b.x, b.y, b.w, 8, b.roof);
    pxRect(b.x + b.w / 2 - 8, b.y + b.h - 12, 16, 12, '#090d16'); // Kapı
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 7px monospace';
    ctx.fillText(b.name, b.x + 4, b.y + 20);
  }

  // Oyuncu veya Arabası
  const wp = state.worldPlayer;
  if (state.assets.car !== 'Yok (Belediye Otobüsü)') {
    pxRect(wp.x - 10, wp.y - 6, 20, 12, state.assets.carColor);
    pxRect(wp.x - 5, wp.y - 4, 10, 8, '#38bdf8');
  } else {
    pxRect(wp.x - 4, wp.y - 8, 8, 8, '#f1c2a5');
    pxRect(wp.x - 5, wp.y, 10, 10, '#f8f9fa');
  }
}

function renderLoop() {
  tick++;
  ctx.clearRect(0, 0, 480, 180);

  if (state.location === 'world') {
    renderOpenWorldCanvas();
  } else if (state.location === 'home') {
    pxRect(0, 0, 480, 124, '#151c2e');
    pxRect(0, 124, 480, 56, '#1e293b');
    // 4K Dev TV & PS5 Pro
    pxRect(170, 28, 140, 64, '#090d16');
    ctx.strokeStyle = '#3bc9db'; ctx.lineWidth = 2; ctx.strokeRect(170, 28, 140, 64);
    ctx.fillStyle = '#51cf66'; ctx.font = 'bold 9px monospace';
    ctx.fillText('PS5 PRO: GTA 6 & EA FC 27', 180, 62);
    pxRect(156, 96, 168, 28, '#475569');
    pxRect(295, 84, 10, 12, '#f8f9fa'); // PS5 konsol
    pxRect(297, 84, 2, 12, '#3bc9db');  // Mavi LED
  } else if (state.location === 'pitch') {
    pxRect(0, 0, 480, 180, '#1b5e20');
    ctx.strokeStyle = '#fff'; ctx.strokeRect(20, 14, 440, 152);
    ctx.beginPath(); ctx.arc(240, 90, 28, 0, Math.PI * 2); ctx.stroke();
  } else {
    // Poliklinik 16-Bit Odası
    pxRect(0, 0, 480, 118, '#141e30');
    pxRect(0, 78, 480, 40, '#20304d');
    pxRect(18, 26, 56, 92, '#334155');
    pxRect(21, 29, 24, 89, '#1e293b');
    pxRect(47, 29, 24, 89, '#1e293b');
    pxRect(334, 26, 48, 66, '#334155');
    pxRect(337, 29, 42, 60, '#0f172a');

    if (state.currentPatient) {
      drawPixelCharacter(218, 74, {
        ...state.currentPatient.appearance,
        bob: Math.sin(tick * 0.08) * 1.1
      });
    }
    drawPixelCharacter(388, 76, { isDoctor: true, shirt: '#3bc9db', bob: Math.cos(tick * 0.07) * 0.8 });

    // Muayene Masası & EKG
    pxRect(0, 118, 480, 62, '#131b2e');
    pxRect(0, 118, 480, 4, '#3b4d6b');
    pxRect(22, 96, 62, 36, '#1e293b');
    pxRect(25, 99, 56, 26, '#06090f');
    const px = Math.floor((tick * 1.8) % 50);
    pxRect(27 + px, 112 - (px > 20 && px < 25 ? 8 : 0), 3, 2, '#51cf66');
  }

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
