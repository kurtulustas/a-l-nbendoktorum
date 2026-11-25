/* =========================================================================
   EXPANSION.JS — ÖZEL KLİNİK, E-REÇETE KAŞE, HAVA/GÜN DÖNGÜSÜ & ROZETLER
   ========================================================================= */

(function () {
  /* --- 1. EK CSS STİLLERİ (ROZET BİLDİRİMİ, HAVA ETİKETİ, E-REÇETE KAŞE) --- */
  const style = document.createElement('style');
  style.textContent = `
    .weather-tag {
      position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
      background: rgba(9, 13, 22, 0.9); border: 1.5px solid #3bc9db; border-radius: 4px;
      padding: 3px 9px; font-family: var(--font-pixel); font-size: 10px;
      color: #e0fbfc; font-weight: 800; white-space: nowrap; pointer-events: none;
    }
    #achToast {
      position: fixed; top: 56px; right: 14px; z-index: 200;
      background: linear-gradient(135deg, #1b263b 0%, #0f172a 100%);
      border: 2px solid var(--accent-gold); border-radius: 10px;
      padding: 10px 14px; max-width: 310px; box-shadow: 0 8px 24px rgba(0,0,0,0.55);
      display: none; flex-direction: column; gap: 3px; animation: toastPop 0.25s ease-out;
    }
    @keyframes toastPop {
      from { opacity: 0; transform: translateY(-10px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .rx-paper {
      background: #f8f9fa; color: #111827; border: 2px solid #1c7ed6;
      border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
      position: relative; overflow: hidden;
    }
    .rx-header {
      border-bottom: 2px solid #1c7ed6; padding-bottom: 6px;
      display: flex; justify-content: space-between; align-items: center;
      font-family: var(--font-pixel); font-size: 10.5px; font-weight: 900; color: #1864ab;
    }
    .rx-stamp {
      position: absolute; right: 14px; bottom: 12px;
      border: 2.5px solid #c92a2a; color: #c92a2a; border-radius: 6px;
      padding: 4px 8px; font-family: var(--font-pixel); font-size: 10px; font-weight: 900;
      transform: rotate(-10deg); opacity: 0.92; pointer-events: none;
    }
    .badge-card {
      background: var(--bg-card); border: 1.5px solid var(--border-subtle);
      border-radius: 8px; padding: 9px 10px; display: flex; align-items: center; gap: 10px;
    }
    .badge-card.unlocked {
      border-color: var(--accent-gold); background: rgba(252, 196, 25, 0.08);
    }
    .badge-ico { font-size: 22px; width: 32px; text-align: center; flex-shrink: 0; }
    .clinic-banner {
      background: linear-gradient(135deg, #102a43 0%, #1d3557 100%);
      border: 1.5px solid var(--accent-cyan); border-radius: 10px; padding: 12px;
      display: flex; flex-direction: column; gap: 5px;
    }
  `;
  document.head.appendChild(style);

  /* --- 2. GENİŞLETİLMİŞ DURUM ŞEMASI --- */
  function defaultExpansionData() {
    return {
      weather: 'clear', // 'clear' | 'rain' | 'storm' | 'fog'
      clinic: {
        owned: false,
        name: 'Özel Sağlık Polikliniği',
        level: 1, // 1: Muayenehane, 2: Tıp Merkezi, 3: Özel Hastane
        staff: { nurse: false, radTech: false, specialist: false, prof: false },
        adLevel: 0,
        totalEarned: 0
      },
      stats: {
        prescriptionsWritten: 0,
        bribesRefused: 0,
        whiteCodes: 0,
        sahinBreakdowns: 0,
        stormShifts: 0
      },
      achievements: []
    };
  }

  function ensureExpansionState(target) {
    const def = defaultExpansionData();
    if (!target.weather) target.weather = def.weather;
    target.clinic = { ...def.clinic, ...(target.clinic || {}) };
    target.clinic.staff = { ...def.clinic.staff, ...((target.clinic && target.clinic.staff) || {}) };
    target.stats = { ...def.stats, ...(target.stats || {}) };
    if (!Array.isArray(target.achievements)) target.achievements = [];
    return target;
  }

  ensureExpansionState(state);

  const origCreateFresh = window.createFreshState;
  window.createFreshState = function () {
    return ensureExpansionState(origCreateFresh());
  };

  const origLoadCareer = window.loadCareer;
  window.loadCareer = function () {
    const ok = origLoadCareer();
    if (ok) ensureExpansionState(state);
    return ok;
  };

  /* --- 3. HUD & SAHNE ARAYÜZ ENJEKSİYONU --- */
  function injectExpansionUI() {
    const hudBtns = document.querySelector('.hud-btns');
    if (hudBtns && !document.getElementById('btnClinicHud')) {
      const btnClinic = document.createElement('button');
      btnClinic.id = 'btnClinicHud';
      btnClinic.className = 'icon-btn';
      btnClinic.title = 'Kendi Özel Kliniğin';
      btnClinic.textContent = '🏥 Kliniğim';
      btnClinic.onclick = () => openDrawer('clinic');

      const btnAch = document.createElement('button');
      btnAch.id = 'btnAchHud';
      btnAch.className = 'icon-btn';
      btnAch.title = 'Başarımlar & İstatistikler';
      btnAch.textContent = '🏆 Rozetler';
      btnAch.onclick = () => openDrawer('achievements');

      hudBtns.insertBefore(btnAch, hudBtns.children[2] || null);
      hudBtns.insertBefore(btnClinic, btnAch);
    }

    const sceneWrap = document.getElementById('sceneWrap');
    if (sceneWrap && !document.getElementById('weatherTag')) {
      const wt = document.createElement('div');
      wt.id = 'weatherTag';
      wt.className = 'weather-tag';
      sceneWrap.appendChild(wt);
    }

    if (!document.getElementById('achToast')) {
      const toast = document.createElement('div');
      toast.id = 'achToast';
      document.body.appendChild(toast);
    }
    updateWeatherTag();
  }

  window.addEventListener('DOMContentLoaded', injectExpansionUI);

  /* --- 4. HAVA DURUMU & GECE-GÜNDÜZ DÖNGÜSÜ --- */
  const WEATHER_META = {
    clear: { label: 'AÇIK', iconNight: '🌙', iconDay: '☀️', traumaBoost: 0 },
    rain:  { label: 'YAĞMURLU (TRAVMA +)', iconNight: '🌧️', iconDay: '🌧️', traumaBoost: 0.45 },
    storm: { label: 'FIRTINALI (ACİL TRAVMA ++)', iconNight: '⛈️', iconDay: '⛈️', traumaBoost: 0.65 },
    fog:   { label: 'SİSLİ', iconNight: '🌫️', iconDay: '🌫️', traumaBoost: 0.2 }
  };

  function getTimePhase(hRaw) {
    const h = hRaw % 24;
    if (h >= 20 || h < 4) return { id: 'night', label: 'GECE', top: '#070b14', bot: '#121c33', tint: null };
    if (h >= 4 && h < 6)  return { id: 'dawn',  label: 'ŞAFAK', top: '#241738', bot: '#d9480f', tint: 'rgba(252, 165, 80, 0.06)' };
    if (h >= 6 && h < 8)  return { id: 'sunrise', label: 'GÜN DOĞUMU', top: '#3b5bdb', bot: '#fcc419', tint: 'rgba(252, 196, 25, 0.08)' };
    if (h >= 8 && h < 18) return { id: 'day',   label: 'GÜNDÜZ', top: '#1c7ed6', bot: '#74c0fc', tint: 'rgba(255, 255, 255, 0.04)' };
    return { id: 'sunset', label: 'GÜN BATIMI', top: '#3b1d52', bot: '#e8590c', tint: 'rgba(232, 89, 12, 0.07)' };
  }

  function updateWeatherTag() {
    const el = document.getElementById('weatherTag');
    if (!el) return;
    const w = WEATHER_META[state.weather] || WEATHER_META.clear;
    const phase = getTimePhase(state.hour);
    const ico = (phase.id === 'night' || phase.id === 'dawn') ? w.iconNight : w.iconDay;
    el.textContent = `${ico} ${phase.label} • ${w.label}`;
  }

  function rollNewWeather() {
    const r = Math.random();
    if (r < 0.42) state.weather = 'clear';
    else if (r < 0.72) state.weather = 'rain';
    else if (r < 0.90) state.weather = 'storm';
    else state.weather = 'fog';
    updateWeatherTag();
  }

  // Pencere içi dinamik gökyüzü, yıldız/ay/güneş ve yağmur damlaları
  function drawSkyWindow(wx, wy, ww, wh) {
    const phase = getTimePhase(state.hour);
    const g = ctx.createLinearGradient(0, wy, 0, wy + wh);
    g.addColorStop(0, phase.top);
    g.addColorStop(1, phase.bot);
    ctx.fillStyle = g;
    ctx.fillRect(wx, wy, ww, wh);

    // Yıldız & Ay (Gece / Şafak)
    if (phase.id === 'night' || phase.id === 'dawn') {
      pxRect(wx + 8, wy + 7, 2, 2, '#fff');
      pxRect(wx + 24, wy + 13, 1, 1, '#fcc419');
      pxRect(wx + ww - 18, wy + 6, 7, 7, '#fef3c7');
      pxRect(wx + ww - 15, wy + 6, 5, 5, phase.top); // Hilal efekti
    } else if (phase.id === 'sunrise' || phase.id === 'sunset') {
      pxRect(wx + ww / 2 - 6, wy + wh - 12, 12, 10, '#fcc419');
    } else {
      pxRect(wx + ww - 16, wy + 6, 8, 8, '#ffe066');
    }

    // Uzak şehir silueti
    pxRect(wx + 2, wy + wh - 12, 10, 12, '#0f172a');
    pxRect(wx + 14, wy + wh - 18, 12, 18, '#1e293b');
    pxRect(wx + 28, wy + wh - 10, 14, 10, '#0f172a');
    pxRect(wx + 44, wy + wh - 15, 10, 15, '#1e293b');
    pxRect(wx + 17, wy + wh - 14, 2, 2, '#fcc419');
    pxRect(wx + 21, wy + wh - 10, 2, 2, '#fcc419');

    // Pencere camında yağmur & şimşek
    if (state.weather === 'rain' || state.weather === 'storm') {
      const drops = state.weather === 'storm' ? 14 : 8;
      for (let i = 0; i < drops; i++) {
        const rx = wx + ((i * 17 + tick * 2) % (ww - 2));
        const ry = wy + ((i * 11 + tick * 3) % (wh - 4));
        pxRect(rx, ry, 1, 4, 'rgba(148, 210, 255, 0.75)');
      }
      if (state.weather === 'storm' && (tick % 190) < 4) {
        pxRect(wx, wy, ww, wh, 'rgba(255, 255, 255, 0.7)');
      }
    } else if (state.weather === 'fog') {
      pxRect(wx, wy + wh - 16, ww, 16, 'rgba(203, 213, 225, 0.28)');
    }

    // Pencere çerçevesi ve kayıtları
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(wx, wy, ww, wh);
    pxRect(wx + Math.floor(ww / 2), wy, 2, wh, '#475569');
    pxRect(wx, wy + Math.floor(wh / 2), ww, 1, '#334155');
  }

  const origDrawHospital = window.drawDetailedHospitalRoom;
  window.drawDetailedHospitalRoom = function (spec) {
    origDrawHospital(spec);
    // Tüm poliklinik odalarında üst duvara dışarıyı gösteren 16-bit pencere
    if (spec === 'none') {
      drawSkyWindow(88, 26, 58, 48);
    } else if (spec === 'surg') {
      drawSkyWindow(274, 18, 52, 42);
    } else {
      drawSkyWindow(202, 16, 114, 44);
    }
    const phase = getTimePhase(state.hour);
    if (phase.tint) pxRect(0, 0, 480, 118, phase.tint);
    if (state.weather === 'storm' && (tick % 190) < 3) {
      pxRect(0, 0, 480, 180, 'rgba(255, 255, 255, 0.12)');
    }
  };

  const origRenderLoc = window.renderLocationScene;
  window.renderLocationScene = function () {
    origRenderLoc();
    const outdoor = ['world', 'pitch', 'dealer'].includes(state.location);
    if (outdoor && (state.weather === 'rain' || state.weather === 'storm')) {
      const count = state.weather === 'storm' ? 42 : 24;
      for (let i = 0; i < count; i++) {
        const rx = (i * 37 + tick * 3) % 480;
        const ry = (i * 23 + tick * 5) % 180;
        pxRect(rx, ry, 1, 5, 'rgba(148, 210, 255, 0.65)');
      }
      if (state.weather === 'storm' && (tick % 190) < 3) {
        pxRect(0, 0, 480, 180, 'rgba(255, 255, 255, 0.16)');
      }
    } else if (outdoor && state.weather === 'fog') {
      pxRect(0, 0, 480, 180, 'rgba(203, 213, 225, 0.12)');
    }
    if (state.location === 'home') {
      drawSkyWindow(22, 20, 88, 56);
    }
  };

  const origUpdateHud = window.updateHud;
  window.updateHud = function () {
    origUpdateHud();
    updateWeatherTag();
  };

  /* --- 5. YAĞMURLU GECE TRAVMA ARTIŞI (nextPatient HOOK) --- */
  const origNextPatient = window.nextPatient;
  window.nextPatient = function () {
    origNextPatient();
    updateWeatherTag();
    const p = state.currentPatient;
    if (!p || state.location !== 'er') return;

    const wMeta = WEATHER_META[state.weather];
    if (wMeta && wMeta.traumaBoost > 0 && Math.random() < wMeta.traumaBoost) {
      const traumaSpecs = ['ortho', 'surg', 'emerg'];
      if (!traumaSpecs.includes(p.spec) && state.specialty === 'none') {
        const tPool = ALL_CASES.filter(c => traumaSpecs.includes(c.spec) && c.triage !== 'green');
        if (tPool.length) {
          const picked = tPool[Math.floor(Math.random() * tPool.length)];
          state.currentPatient = picked;
          const badgeMap = { red: ['KIRMIZI ALAN', 't-red'], yellow: ['SARI ALAN', 't-yellow'], green: ['YEŞİL ALAN', 't-green'] };
          const [bt, bc] = badgeMap[picked.triage];
          say(
            `${picked.name} [🌧️ HAVA TRAVMASI]`,
            `"${picked.complaint}"\n(⛈️ Yağışlı hava nedeniyle acile travma başvurusu arttı!)`,
            bt, bc, picked.pitch
          );
          setTab('talk');
        }
      }
    }
  };

  /* --- 6. GERÇEK E-REÇETE & KAŞE SİSTEMİ --- */
  const RX_DATABASE = [
    { key: 'Konjonktivit', drug: 'Moksifloksasin %0.5 Göz Damlası', dose: '3x1 Damla (7 Gün)' },
    { key: 'Kostokondrit', drug: 'İbuprofen 400 mg Tablet + Lokal Jel', dose: '2x1 Tok Karnına' },
    { key: 'Ürtiker',      drug: 'Setirizin 10 mg Antihistaminik', dose: '1x1 Akşam' },
    { key: 'Gerilim Tipi', drug: 'Parasetamol 500 mg + İstirahat', dose: '3x1 Gerektiğinde' },
    { key: 'Burkulması',   drug: 'RICE + Elastik Bandaj + Diklofenak Jel', dose: '3x1 Topikal + Buz' },
    { key: 'Gastroenterit',drug: 'Oral Rehidratasyon Sıvısı (ORS) + Probiyotik', dose: 'Bol Sıvı + 1x1 Saşe' },
    { key: 'Rinosinüzit',  drug: 'Amoksisilin-Klavulanat 1000 mg + Nazal Yıkama', dose: '2x1 (10 Gün)' },
    { key: 'Buşon',        drug: 'Gliserin Kulak Damlası (Buşon Yumuşatıcı)', dose: '3x3 Damla (5 Gün)' },
    { key: 'Dispepsi',     drug: 'Pantoprazol 40 mg (PPI) + Reflü Diyeti', dose: '1x1 Sabah Aç' }
  ];

  function getCorrectRxForPatient(p) {
    const reason = (p.targetReason || '').toLowerCase();
    return RX_DATABASE.find(item => reason.includes(item.key.toLowerCase())) || null;
  }

  function openPrescriptionPad() {
    const p = state.currentPatient;
    if (!p) return;
    const body = openSidePanel('📝 E-REÇETE & HEKİM KAŞESİ');

    const correctRx = getCorrectRxForPatient(p);
    const pool = [...RX_DATABASE].sort(() => Math.random() - 0.5);
    const options = [];
    if (correctRx) options.push(correctRx);
    for (const item of pool) {
      if (options.length >= 4) break;
      if (!options.some(o => o.drug === item.drug)) options.push(item);
    }
    options.sort(() => Math.random() - 0.5);

    let selectedDrug = options[0].drug;
    let selectedFreq = options[0].dose;

    function renderRx() {
      body.innerHTML = `
        <div class="rx-paper">
          <div class="rx-header">
            <span>T.C. SAĞLIK BAKANLIĞI • E-REÇETE</span>
            <span>GÜN ${state.day}</span>
          </div>
          <div style="font-size:11.5px;line-height:1.45;">
            <strong>Hasta:</strong> ${p.name}<br>
            <strong>Hekim:</strong> ${state.docName} (${SPECIALTIES[state.specialty].title})<br>
            <strong>Seçili İlaç:</strong> <span style="color:#1864ab;font-weight:800;">${selectedDrug}</span><br>
            <strong>Kullanım:</strong> ${selectedFreq}
          </div>
          <div id="rxStampVisual" class="rx-stamp" style="display:none;">KAŞELENDİ ✓<br>${state.docName.slice(0, 18)}</div>
        </div>
        <div style="font-size:11.5px;color:var(--accent-gold);font-weight:800;margin-top:4px;">1. UYGUN İLACI SEÇ:</div>
      `;

      options.forEach(opt => {
        const isSel = opt.drug === selectedDrug;
        addChoice(body, `${isSel ? '☑' : '☐'} ${opt.drug} (${opt.dose})`, () => {
          selectedDrug = opt.drug;
          selectedFreq = opt.dose;
          renderRx();
        }, isSel ? 'success' : '');
      });

      const stampBtn = document.createElement('button');
      stampBtn.className = 'start-btn';
      stampBtn.style.marginTop = '6px';
      stampBtn.textContent = '🟥 REÇETEYİ KAŞELE & TABURCU ET';
      stampBtn.onclick = () => {
        playSfx('stamp');
        const stEl = document.getElementById('rxStampVisual');
        if (stEl) stEl.style.display = 'block';
        stampBtn.disabled = true;

        setTimeout(() => {
          closeDrawer();
          if (p.correctAction !== 'discharge') {
            completeCase(false, `KRİTİK HATA! Yatması veya acil müdahale edilmesi gereken hastaya reçete yazıp eve gönderdin! (Doğru Tanı: ${p.targetReason})`);
            return;
          }
          if (correctRx && selectedDrug === correctRx.drug) {
            state.stats.prescriptionsWritten++;
            state.tusScore += 1;
            state.money += 120; // Doğru reçete ekstra bonusu
            addTx(`E-Reçete Tam İsabet Bonusu`, 120, 'pos');
            completeCase(true, `E-REÇETE TAM İSABET! (${selectedDrug}) — Hasta güvenle taburcu edildi. (+1 TUS & +600₺)`);
          } else {
            completeCase(true, `Taburcu kararı doğru ama ilaç uyuşmadı! Eczacı arayıp (${correctRx ? correctRx.drug : 'uygun ilaç'}) olarak düzeltti.`);
          }
          checkAchievements();
        }, 420);
      };
      body.appendChild(stampBtn);
    }
    renderRx();
  }

  // Karar sekmesindeki "Reçete Yaz & Taburcu Et" butonunu E-Reçete ekranına bağla
  const origSetTab = window.setTab;
  window.setTab = function (tab) {
    origSetTab(tab);
    if (tab === 'decide') {
      const panel = document.getElementById('subPanel');
      const btns = Array.from(panel.querySelectorAll('button'));
      const dischargeBtn = btns.find(b => b.textContent.includes('Reçete Yaz'));
      if (dischargeBtn) {
        dischargeBtn.textContent = '📝 E-Reçete Yaz, Kaşele & Taburcu Et';
        dischargeBtn.onclick = () => openPrescriptionPad();
      }
    }
  };

  /* --- 7. KENDİ ÖZEL KLİNİĞİNİ KURMA (ENDGAME SİSTEMİ) --- */
  const CLINIC_TIERS = [
    null,
    { level: 1, title: 'Özel Muayenehane', baseIncome: 650, upgradeCost: 12000, nextTitle: 'Özel Tıp Merkezi' },
    { level: 2, title: 'Özel Tıp Merkezi', baseIncome: 1600, upgradeCost: 25000, nextTitle: 'Özel Hastane' },
    { level: 3, title: 'Özel Hastane',     baseIncome: 3800, upgradeCost: 0,     nextTitle: 'MAKSİMUM SEVİYE' }
  ];

  const CLINIC_STAFF = [
    { key: 'nurse',      name: 'Hemşire & Tıbbi Sekreter', cost: 2000,  income: 300 },
    { key: 'radTech',    name: 'Radyoloji & Lab Teknikeri', cost: 3500,  income: 550 },
    { key: 'specialist', name: 'Yardımcı Uzman Hekim',      cost: 6000,  income: 950 },
    { key: 'prof',       name: 'Konsültan Profesör',        cost: 10000, income: 1650 }
  ];

  function calcClinicShiftIncome() {
    const cl = state.clinic;
    if (!cl.owned) return 0;
    let total = CLINIC_TIERS[cl.level].baseIncome;
    CLINIC_STAFF.forEach(st => { if (cl.staff[st.key]) total += st.income; });
    if (state.specialty !== 'none') total = Math.round(total * 1.35); // Uzmanlık bonusu +%35
    total = Math.round(total * (1 + cl.adLevel * 0.2)); // Reklam bonusu
    return total;
  }

  function renderClinicDrawer() {
    const body = openSidePanel('🏥 ÖZEL KLİNİK YÖNETİMİ');
    const cl = state.clinic;

    if (!cl.owned) {
      const openCost = 6000;
      const isSpec = state.specialty !== 'none';
      body.innerHTML = `
        <div class="clinic-banner">
          <div style="font-family:var(--font-pixel);color:var(--accent-gold);font-size:13px;font-weight:900;">KENDİ ÖZEL KLİNİĞİNİ KUR!</div>
          <div style="font-size:12px;line-height:1.5;color:#dee2e6;">
            Hastane nöbetlerinin yanında kendi özel muayenehaneni açarak her nöbet sonunda <strong>otomatik pasif gelir</strong> kazan, personel istihdam et ve Özel Hastaneye kadar büyü!
          </div>
          <div style="font-size:11.5px;color:var(--accent-cyan);margin-top:4px;">
            • Açılış Maliyeti: <strong>${openCost.toLocaleString('tr-TR')}₺</strong><br>
            • Uzmanlık Durumu: ${isSpec ? '<strong style="color:#51cf66">UZMAN (+%35 Gelir Bonusu ✓)</strong>' : 'Pratisyen (Uzman olunca +%35 artar)'}
          </div>
        </div>`;

      addChoice(body, `🏥 Özel Muayenehane Aç (-${openCost.toLocaleString('tr-TR')}₺)`, () => {
        if (state.money < openCost) { alert(`Klinik açmak için ${openCost.toLocaleString('tr-TR')}₺ gerekiyor!`); return; }
        state.money -= openCost;
        cl.owned = true;
        cl.name = `${state.docName.replace(/^Dr\.\s*/i, '').split(' ')[0]} Özel Polikliniği`;
        addTx('Özel Muayenehane Kuruluş Sermayesi', -openCost, 'neg');
        state.news.unshift(`İŞ DÜNYASI: ${state.docName}, Aydın'da kendi özel polikliniğini hizmete açtı!`);
        playSfx('coin'); updateHud(); saveCareer(); checkAchievements();
        renderClinicDrawer();
      }, 'success');
      return;
    }

    const tier = CLINIC_TIERS[cl.level];
    const perShift = calcClinicShiftIncome();

    body.innerHTML = `
      <div class="clinic-banner">
        <div style="font-family:var(--font-pixel);color:var(--accent-gold);font-size:13px;font-weight:900;">${cl.name.toUpperCase()}</div>
        <div style="font-size:12px;color:var(--accent-cyan);font-weight:700;">Seviye ${cl.level}: ${tier.title}</div>
        <div style="font-size:12px;margin-top:4px;">
          • Nöbet Başı Pasif Gelir: <strong style="color:#51cf66">+${perShift.toLocaleString('tr-TR')}₺</strong><br>
          • Toplam Kazandırılan: <strong>${cl.totalEarned.toLocaleString('tr-TR')}₺</strong><br>
          • Reklam Seviyesi: <strong>Lv.${cl.adLevel}/5 (+%${cl.adLevel * 20})</strong>
        </div>
      </div>
      <div style="font-size:11.5px;color:var(--accent-gold);font-weight:800;margin-top:4px;">KADRO & PERSONEL İSTİHDAMI</div>`;

    CLINIC_STAFF.forEach(st => {
      const hired = cl.staff[st.key];
      const lbl = hired
        ? `✓ ${st.name} [ÇALIŞIYOR • +${st.income}₺/nöbet]`
        : `👤 ${st.name} İşe Al (-${st.cost.toLocaleString('tr-TR')}₺ -> +${st.income}₺/nöbet)`;
      addChoice(body, lbl, () => {
        if (hired) return;
        if (state.money < st.cost) { alert('Yetersiz bakiye!'); return; }
        state.money -= st.cost; cl.staff[st.key] = true;
        addTx(`Klinik Personel: ${st.name}`, -st.cost, 'neg');
        playSfx('coin'); updateHud(); saveCareer(); renderClinicDrawer();
      }, hired ? 'success' : '');
    });

    if (cl.adLevel < 5) {
      const adCost = 1000 + cl.adLevel * 600;
      addChoice(body, `📢 Dijital Reklam Kampanyası (-${adCost.toLocaleString('tr-TR')}₺ -> +%20 Gelir)`, () => {
        if (state.money < adCost) { alert('Yetersiz bakiye!'); return; }
        state.money -= adCost; cl.adLevel++;
        addTx('Özel Klinik Reklam Kampanyası', -adCost, 'neg');
        playSfx('coin'); updateHud(); saveCareer(); renderClinicDrawer();
      }, 'purple');
    }

    if (tier.upgradeCost > 0) {
      addChoice(body, `🏗️ ${tier.nextTitle} Seviyesine Büyüt (-${tier.upgradeCost.toLocaleString('tr-TR')}₺)`, () => {
        if (state.money < tier.upgradeCost) { alert('Yetersiz bakiye!'); return; }
        state.money -= tier.upgradeCost; cl.level++;
        addTx(`Klinik Büyütme: ${tier.nextTitle}`, -tier.upgradeCost, 'neg');
        state.news.unshift(`SAĞLIK SEKTÖRÜ: ${cl.name} artık ${tier.nextTitle} statüsünde hizmet veriyor!`);
        playSfx('coin'); updateHud(); saveCareer(); checkAchievements(); renderClinicDrawer();
      }, 'success');
    }
  }

  /* --- 8. BAŞARIM (ROZET) & İSTATİSTİK SİSTEMİ --- */
  const ACHIEVEMENTS = [
    { id: 'first_save',    icon: '🩺', title: 'İlk Nöbet Kahramanı', desc: 'İlk hastanı başarıyla tedavi et.', reward: 150, check: () => state.totalSaved >= 1 },
    { id: 'ten_saves',     icon: '🚑', title: 'Acil Gediklisi',      desc: 'Toplam 10 hastayı başarıyla kurtar.', reward: 300, check: () => state.totalSaved >= 10 },
    { id: 'hundred_saves', icon: '👑', title: '100 Hayat Kurtaran',  desc: '100 hastayı başarıyla tedavi et.', reward: 2500, check: () => state.totalSaved >= 100 },
    { id: 'no_bribe',      icon: '🛡️', title: 'Rüşvete Geçit Yok',   desc: 'Rüşvet zarfını onurla reddet.', reward: 400, check: () => state.stats.bribesRefused >= 1 },
    { id: 'white_code',    icon: '🚨', title: '1111 Çelik Sinir',    desc: 'Beyaz Kod vererek ekibi koru.', reward: 300, check: () => state.stats.whiteCodes >= 1 },
    { id: 'rx_pro',        icon: '📝', title: 'E-Reçete Üstadı',     desc: '5 hastaya doğru ilaçla kaşeli reçete yaz.', reward: 400, check: () => state.stats.prescriptionsWritten >= 5 },
    { id: 'specialist',    icon: '🎓', title: 'Uzman Hekim',         desc: 'TUS ile 8 uzmanlık dalından birine geç.', reward: 750, check: () => state.specialty !== 'none' },
    { id: 'sahin_sanayi',  icon: '🔧', title: 'Şahin\'le Sanayiye Düşen', desc: 'Modifiyeli Şahin ile Mahmut Usta\'ya düş.', reward: 350, check: () => state.stats.sahinBreakdowns >= 1 },
    { id: 'ps5_owner',     icon: '🎮', title: 'Nöbet Çıkışı Keyif',  desc: 'Evine hem 4K Monitör hem PS5 Pro kur.', reward: 500, check: () => state.assets.hasPs5 && state.assets.hasMonitor },
    { id: 'clinic_boss',   icon: '🏥', title: 'Özel Klinik Patronu', desc: 'Kendi özel kliniğini aç.', reward: 1000, check: () => state.clinic.owned },
    { id: 'storm_shift',   icon: '⛈️', title: 'Fırtına Nöbetçisi',   desc: 'Yağmurlu veya fırtınalı gecede nöbet bitir.', reward: 350, check: () => state.stats.stormShifts >= 1 },
    { id: 'rich_doc',      icon: '💎', title: 'TıpBank VIP',         desc: 'Hesabında aynı anda 20.000₺ biriktir.', reward: 1000, check: () => state.money >= 20000 }
  ];

  let toastTimer = null;
  function showAchToast(ach) {
    const el = document.getElementById('achToast');
    if (!el) return;
    el.innerHTML = `
      <div style="font-family:var(--font-pixel);font-size:10px;color:var(--accent-gold);font-weight:900;">🏆 YENİ ROZET KAZANILDI!</div>
      <div style="font-size:13px;font-weight:800;color:#fff;">${ach.icon} ${ach.title}</div>
      <div style="font-size:11px;color:var(--accent-green);">Ödül: +${ach.reward}₺ TıpBank hesabına eklendi!</div>`;
    el.style.display = 'flex';
    playSfx('coin');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.display = 'none'; }, 4200);
  }

  function checkAchievements() {
    ensureExpansionState(state);
    let unlockedAny = false;
    ACHIEVEMENTS.forEach(ach => {
      if (!state.achievements.includes(ach.id) && ach.check()) {
        state.achievements.push(ach.id);
        state.money += ach.reward;
        addTx(`Rozet Ödülü: ${ach.title}`, ach.reward, 'pos');
        showAchToast(ach);
        unlockedAny = true;
      }
    });
    if (unlockedAny) { updateHud(); saveCareer(); }
  }
  window.checkAchievements = checkAchievements;

  function renderAchievementsDrawer() {
    const body = openSidePanel(`🏆 ROZETLER & İSTATİSTİK (${state.achievements.length}/${ACHIEVEMENTS.length})`);
    body.innerHTML = `
      <div class="card-box" style="padding:10px;font-size:12px;line-height:1.55;">
        <div style="color:var(--accent-cyan);font-weight:800;margin-bottom:3px;">KARİYER İSTATİSTİKLERİ</div>
        • Kurtarılan Hasta: <strong>${state.totalSaved}</strong> | Benzersiz Vaka: <strong>${state.usedCaseIds.length}/${ALL_CASES.length}</strong><br>
        • Doğru E-Reçete: <strong>${state.stats.prescriptionsWritten}</strong> | Reddedilen Rüşvet: <strong>${state.stats.bribesRefused}</strong><br>
        • Beyaz Kod: <strong>${state.stats.whiteCodes}</strong> | Özel Klinik Geliri: <strong>${state.clinic.totalEarned.toLocaleString('tr-TR')}₺</strong>
      </div>`;

    ACHIEVEMENTS.forEach(ach => {
      const done = state.achievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = 'badge-card' + (done ? ' unlocked' : '');
      card.innerHTML = `
        <div class="badge-ico">${done ? ach.icon : '🔒'}</div>
        <div style="flex:1;">
          <div style="font-size:12.5px;font-weight:800;color:${done ? 'var(--accent-gold)' : '#94a3b8'};">${ach.title} ${done ? '✓' : ''}</div>
          <div style="font-size:11px;color:#ced4da;">${ach.desc}</div>
        </div>
        <div style="font-family:var(--font-pixel);font-size:10.5px;color:var(--accent-green);font-weight:800;">+${ach.reward}₺</div>`;
      body.appendChild(card);
    });
  }

  /* --- 9. MEVCUT FONKSİYONLARA GÜVENLİ BAĞLANTILAR (HOOKS) --- */
  const origOpenDrawer = window.openDrawer;
  window.openDrawer = function (type) {
    if (type === 'clinic') { renderClinicDrawer(); return; }
    if (type === 'achievements') { renderAchievementsDrawer(); return; }
    origOpenDrawer(type);
  };

  const origSay = window.say;
  window.say = function (speaker, text, badgeText, badgeClass, pitch) {
    origSay(speaker, text, badgeText, badgeClass, pitch);
    if (badgeText === 'ONURLU') { state.stats.bribesRefused++; checkAchievements(); }
    else if (badgeText === 'GÜVENLİ' && String(speaker).includes('GÜVENLİK')) { state.stats.whiteCodes++; checkAchievements(); }
    else if (badgeText === 'ARIZA' && state.assets.car.includes('Şahin')) { state.stats.sahinBreakdowns++; checkAchievements(); }
  };

  const origCompleteCase = window.completeCase;
  window.completeCase = function (success, msg) {
    origCompleteCase(success, msg);
    checkAchievements();
  };

  const origBuyHomeGear = window.buyHomeGear;
  window.buyHomeGear = function (prop, label, cost, returnLoc) {
    origBuyHomeGear(prop, label, cost, returnLoc);
    checkAchievements();
  };

  const origEndOfShift = window.endOfShiftSummary;
  window.endOfShiftSummary = function () {
    const wasStormy = state.weather === 'rain' || state.weather === 'storm';
    if (wasStormy) state.stats.stormShifts++;

    // Özel Klinik pasif gelir tahsilatı
    const clinicIncome = calcClinicShiftIncome();
    if (clinicIncome > 0) {
      state.money += clinicIncome;
      state.clinic.totalEarned += clinicIncome;
      addTx(`Özel Klinik Pasif Geliri (${state.clinic.name})`, clinicIncome, 'pos');
    }

    rollNewWeather();
    origEndOfShift();

    if (clinicIncome > 0) {
      const dlg = document.getElementById('dialogueText');
      if (dlg) setTimeout(() => { dlg.textContent += `\n• 🏥 ${state.clinic.name} Pasif Geliri: +${clinicIncome.toLocaleString('tr-TR')}₺`; }, 600);
    }
    const panel = document.getElementById('subPanel');
    if (panel) {
      addChoice(panel, '🏥 Özel Kliniğini Yönet & Büyüt', () => openDrawer('clinic'), 'purple');
    }
    checkAchievements();
  };
})();
