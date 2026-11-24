/* ================= PHONE_LIFE.JS — AKILLI TELEFON, EKONOMİ, SOSYAL & ŞEHİR MEKÂNLARI ================= */

/* --- 1. HİBRİT YAPAY ZEKA MOTORU (GEMINI / OPENAI + GELİŞMİŞ DAHİLİ AI) --- */
async function generateAIReply(characterName, persona, userMessage) {
  const key = (state.apiKey || '').trim();
  const spTitle = SPECIALTIES[state.specialty]?.title || 'Pratisyen Hekim';
  const sysContext = `Sen bir Türk hastane ve hayat simülasyonu oyununda karakterisin. Adın: ${characterName}. Kişiliğin: ${persona}. Konuştuğun kişi: ${state.docName} (Unvan: ${spTitle}, Bakiye: ${state.money}₺, TUS Puanı: ${state.tusScore}, Arabası: ${state.assets.car}, PS5: ${state.assets.hasPs5 ? 'Var' : 'Yok'}, Gün: ${state.day}). Doğal, samimi, akıcı ve karakterine yakışan Türkçe ile 1-3 cümle cevap ver.`;

  if (key) {
    try {
      if (key.startsWith('AIza') || key.startsWith('AQ.')) {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({ contents: [{ parts: [{ text: `${sysContext}\nOyuncunun mesajı: "${userMessage}"` }] }] })
        });
        const data = await res.json();
        const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) return txt.trim();
      } else if (key.startsWith('sk-')) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: sysContext }, { role: 'user', content: userMessage }]
          })
        });
        const data = await res.json();
        const txt = data?.choices?.[0]?.message?.content;
        if (txt) return txt.trim();
      }
    } catch (e) {}
  }

  const m = userMessage.toLowerCase();
  const firstName = state.docName.replace(/^Dr\.\s*/i, '').split(' ')[0] || 'Hocam';

  if (characterName.includes('Kaan')) {
    if (m.includes('halı saha') || m.includes('maç') || m.includes('fc') || m.includes('fifa')) {
      return `Kanka sen kanattan içeri kat edip plaseyi bıraktın mı kalecinin şansı yok ⚽ EA FC 27 online davet kodunu at hemen kaleye geçeyim!`;
    }
    if (m.includes('gta') || m.includes('ps5') || m.includes('monitör') || m.includes('kafe')) {
      return state.assets.hasPs5 && state.assets.hasMonitor
        ? `Eve PS5 Pro ve 4K monitörü dizmişsin kanka! GTA 6 Aydın Vice'da polislerden kaçarken arabaya binmeyi unutma.`
        : `Kanka eve PS5 + Monitör çekene kadar İnternet Kafede 150₺ verip masaya oturalım, hem GTA 6 hem Tekken 8 akıyor!`;
    }
    if (m.includes('araba') || m.includes('şahin') || m.includes('sedan')) {
      return state.assets.car.includes('Yok')
        ? `Oğlum ${state.money}₺ birikmişin var, az daha nöbet tut da galeriden araba çekelim, otobüs çilesi bitsin!`
        : `${state.assets.car} yakışır kardeşime! Akşam şehirde bir tur atalım.`;
    }
    return `Helal olsun ${firstName}, hem tıp hem yoğun nöbetler derken efsane gidiyorsun. Müsait olduğun an halı saha veya PS5 yapalım!`;
  }

  if (characterName.includes('Rıza')) {
    if (m.includes('kira') || m.includes('para') || m.includes('aidat')) {
      return `Senden kıymetli mi doktor evladım, nöbetlerin yoğun biliyorum. Sen hastaları iyileştir gerisi hallolur.`;
    }
    if (m.includes('tansiyon') || m.includes('hasta') || m.includes('ilaç')) {
      return `Allah razı olsun oğlum, apartmanda senin gibi doktor olunca hepimizin içi rahat. Yarın gündüz uğrarsan bir çayımızı iç.`;
    }
    return `Sağ olasın ${firstName} oğlum, apartmanda herkes ne kadar ilgili bir hekim olduğundan bahsediyor. Kolay gelsin.`;
  }

  if (characterName.includes('Mahmut')) {
    if (m.includes('hararet') || m.includes('arıza') || m.includes('tamir') || m.includes('bakım') || m.includes('şahin')) {
      return `Şahin dediğin nazlı makinedir doktorum, yağını suyunu eksik etme. Sıkıntı çıkarsa dükkan senin, hemen hallederiz!`;
    }
    return `Eyvallah doktorum! Can kurtaran adama sanayide öncelik her zaman bizdedir, lastiğine taş değmesin.`;
  }

  if (characterName.includes('Elif')) {
    if (m.includes('kahve') || m.includes('çay') || m.includes('mola') || m.includes('buluş') || m.includes('yemek')) {
      return `Bunu senden duymak bile nöbet yorgunluğumu aldı ${firstName}... 10 dakikaya kantinde buluşalım, bu sefer kahveler benden ☕`;
    }
    if (m.includes('tus') || m.includes('uzman') || m.includes('göz') || m.includes('kardiyo')) {
      return `Güncel ${state.tusScore} TUS puanın ve klinik pratiğinle istediğin polikliniğe girersin. ${spTitle} sana çok yakışıyor!`;
    }
    return `Seninle aynı nöbette denk gelmek günün en güzel olayı ${firstName}. Biraz soluklanınca mutlaka konuşalım!`;
  }

  if (characterName.includes('Başhekim')) {
    return `${state.docName}, şu ana kadar ${state.totalSaved} vakayı başarıyla yönettiniz, itibarınız ${state.rep}/100 ve uyarınız ${state.warnings}/3. Disiplini koruyunuz.`;
  }

  if (m.includes('tus') || m.includes('uzman')) {
    return `TUS puanın ${state.tusScore} seviyesinde ${firstName}! Üst menüdeki Uzmanlık merkezinden 8 branş kadrosunu kontrol edebilirsin.`;
  }
  if (m.includes('para') || m.includes('borç') || m.includes('maaş') || m.includes('borsa')) {
    return `TıpBank hesabında ${state.money}₺ var. Döner sermaye ödemeleri ve TıpBorsa ile bütçeni büyütebilirsin.`;
  }

  const generic = [
    `Çok haklısın ${firstName}, bu tempoda soğukkanlı kalabilmek gerçek hekimlik işi. Poliklinikte harika iş çıkarıyorsun.`,
    `Bunu hiç bu açıdan düşünmemiştim! Nöbet biraz sakinleşince oturup detaylıca konuşalım bunu.`,
    `Kesinlikle katılıyorum. Bugün ekibin moralini tek başına yükselttin, eline sağlık!`
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

/* --- 2. TIPBANK MESLEKTAŞ BORÇ & FAST SİSTEMİ --- */
const BORROW_SCENARIOS = [
  {
    id: 'loan_berk', from: 'İntörn Berk', role: 'Acil İntörnü',
    iban: 'TR18 0001 0023 4512 8890 01', amount: 600, returnAmt: 750, payChance: 0.92, loveGain: 15,
    story: 'Hocam KYK bursum bitti, ev sahibi kapıya dayandı! 600₺ ateşler misin, burs yatar yatmaz 750₺ olarak geri atayım?'
  },
  {
    id: 'loan_kerem', from: 'Op. Dr. Kerem', role: 'Genel Cerrahi',
    iban: 'TR55 0004 6008 7712 3300 03', amount: 1800, returnAmt: 2900, payChance: 0.55, loveGain: 10,
    story: 'Kardeşim içeriden kesin borsa/kripto haberi aldım! 1.800₺ atarsan akşam katlayıp 2.900₺ geri yolluyorum!'
  },
  {
    id: 'loan_elif', from: 'Asistan Dr. Elif', role: 'Dahiliye Asistanı',
    iban: 'TR71 0001 5009 1122 6655 04', amount: 850, returnAmt: 1000, payChance: 1.0, loveGain: 25,
    story: 'Nöbetteyim servisten çıkamıyorum, kedim hastalandı veterinere 850₺ lazım. IBAN atsam halleder misin? Akşam geri atarım 🙏'
  }
];

function triggerRandomLoanRequest() {
  if (state.loanRequests.length >= 2) return;
  const available = BORROW_SCENARIOS.filter(s => !state.loanRequests.some(r => r.id === s.id));
  if (!available.length) return;
  const pick = available[Math.floor(Math.random() * available.length)];
  state.loanRequests.push({ ...pick });
  const dot = document.getElementById('phoneDot');
  if (dot) dot.style.display = 'block';
  playSfx('msg');
}

function resolveLoan(reqId, accept) {
  const idx = state.loanRequests.findIndex(r => r.id === reqId);
  if (idx === -1) return;
  const req = state.loanRequests[idx];
  if (!accept) {
    state.loanRequests.splice(idx, 1);
    addTx(`Borç Talebi Reddedildi (${req.from})`, 0, 'neg');
    saveCareer(); openPhoneApp('bank'); return;
  }
  if (state.money < req.amount) { alert('TıpBank Bakiyesi Yetersiz!'); return; }
  state.money -= req.amount;
  state.loanRequests.splice(idx, 1);
  addTx(`FAST Havale -> ${req.from}`, -req.amount, 'neg');
  state.activeLoansOut.push({ ...req, dueInPatients: 2 });
  const st = state.staff.find(s => s.name.includes(req.from.split(' ').pop()));
  if (st) st.love = Math.min(100, st.love + req.loveGain);
  playSfx('coin'); updateHud(); saveCareer(); openPhoneApp('bank');
}

function checkLoanRepayments() {
  for (let i = state.activeLoansOut.length - 1; i >= 0; i--) {
    const loan = state.activeLoansOut[i];
    loan.dueInPatients--;
    if (loan.dueInPatients <= 0) {
      state.activeLoansOut.splice(i, 1);
      if (Math.random() < loan.payChance) {
        state.money += loan.returnAmt;
        addTx(`FAST Borç İadesi <- ${loan.from}`, loan.returnAmt, 'pos');
        const dot = document.getElementById('phoneDot');
        if (dot) dot.style.display = 'block';
        playSfx('coin');
      } else {
        addTx(`Geciken Alacak (${loan.from} Erteledi)`, 0, 'neg');
      }
      updateHud();
    }
  }
}

/* --- 3. AKILLI TELEFON (9 EKSİKSİZ UYGULAMA) --- */
function openPhone() {
  const dot = document.getElementById('phoneDot');
  if (dot) dot.style.display = 'none';
  openPhoneApp('home');
}

function openPhoneApp(app) {
  const body = openSidePanel(`${state.assets.phone.toUpperCase()}`);
  const hStr = String(state.hour % 24).padStart(2, '0');
  body.innerHTML = `
    <div class="phone-shell">
      <div class="phone-status"><span>TıpCell 5G</span><span>${hStr}:00</span><span>${state.apiKey ? 'AI API AKTİF' : 'DAHİLİ AI v9'}</span></div>
      <div id="phoneScreen" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-right:2px;"></div>
      <button class="choice-btn center" style="margin-top:8px;" onclick="openPhoneApp('home')">⌂ ANA EKRANA DÖN</button>
    </div>
  `;
  const scr = document.getElementById('phoneScreen');

  if (app === 'home') {
    const reqBadge = state.loanRequests.length ? `<span class="badge-dot" style="display:block;"></span>` : '';
    scr.innerHTML = `
      <div style="text-align:center;font-size:12px;color:var(--accent-gold);padding:4px;font-weight:700;">
        ${state.docName}<br><span style="color:var(--accent-purple);font-size:11px;">${SPECIALTIES[state.specialty].title}</span>
      </div>
      <div class="app-grid">
        <div class="app-icon" onclick="openPhoneApp('bank')">${reqBadge}<span class="ico">💳</span><span>TıpBank</span></div>
        <div class="app-icon" onclick="openPhoneApp('whatsdoc')"><span class="ico">💬</span><span>WhatsDoc AI</span></div>
        <div class="app-icon" onclick="openPhoneApp('casino')"><span class="ico">🎰</span><span>BetTıp Club</span></div>
        <div class="app-icon" onclick="openPhoneApp('borsa')"><span class="ico">📈</span><span>TıpBorsa</span></div>
        <div class="app-icon" onclick="openPhoneApp('yemek')"><span class="ico">🍔</span><span>NöbetYe</span></div>
        <div class="app-icon" onclick="openPhoneApp('fotogram')"><span class="ico">📸</span><span>FotoGram</span></div>
        <div class="app-icon" onclick="openPhoneApp('haber')"><span class="ico">📰</span><span>TıpHaber</span></div>
        <div class="app-icon" onclick="goLocation('icafe')"><span class="ico">🕹️</span><span>İnternet Kafe</span></div>
        <div class="app-icon" onclick="goLocation('tech')"><span class="ico">🖥️</span><span>PS5 Mağaza</span></div>
      </div>
      <div style="font-size:10.5px;color:var(--accent-cyan);text-align:center;margin-top:4px;">
        Ev Kurulumu: ${state.assets.hasPs5 && state.assets.hasMonitor ? 'PS5 Pro + 4K Monitör Kurulu ✓' : 'Eksik (Mağazadan Al veya İnternet Kafeye Git)'}
      </div>`;
  }
  else if (app === 'bank') {
    scr.innerHTML = `
      <div class="bank-card">
        <div style="font-size:10px;color:var(--accent-green);font-weight:800;">TIPBANK VADESİZ HESAP</div>
        <div style="font-size:21px;font-weight:900;margin:4px 0;">${state.money.toLocaleString('tr-TR')} ₺</div>
        <div style="font-size:9.5px;color:#adb5bd;">IBAN: ${state.iban}</div>
        ${state.bankDebt > 0 ? `<div style="font-size:11px;color:var(--accent-red);margin-top:4px;font-weight:700;">Aktif Kredi Borcu: ${state.bankDebt}₺</div>` : ''}
      </div>
      <div style="font-size:11.5px;color:var(--accent-gold);font-weight:800;margin-top:4px;">GELEN BORÇ TALEPLERİ (${state.loanRequests.length})</div>`;

    if (!state.loanRequests.length) {
      scr.innerHTML += `<div style="font-size:11px;color:var(--text-muted);padding:6px;background:var(--bg-card);border-radius:5px;">Bekleyen borç talebi yok.</div>`;
    } else {
      state.loanRequests.forEach(req => {
        const box = document.createElement('div');
        box.style.cssText = 'background:var(--bg-card);border:1.5px solid var(--accent-gold);border-radius:7px;padding:9px;display:flex;flex-direction:column;gap:6px;';
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;font-weight:800;color:var(--accent-gold);font-size:12px;">
            <span>${req.from}</span><span>İstenen: ${req.amount}₺</span>
          </div>
          <div style="font-size:11.5px;line-height:1.45;">"${req.story}"</div>
          <div style="font-size:10px;color:var(--accent-cyan);">IBAN: ${req.iban} • İade: ${req.returnAmt}₺</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="choice-btn success center" onclick="resolveLoan('${req.id}', true)">FAST Gönder</button>
            <button class="choice-btn danger center" onclick="resolveLoan('${req.id}', false)">Reddet</button>
          </div>`;
        scr.appendChild(box);
      });
    }

    addChoice(scr, '🏦 TıpBank Anında İhtiyaç Kredisi Çek (+2.000₺)', () => {
      if (state.bankDebt >= 4000) { alert('Kredi limitin doldu!'); return; }
      state.money += 2000; state.bankDebt += 2400;
      addTx('TıpBank Anında Kredi Kullanımı', 2000, 'pos');
      playSfx('coin'); updateHud(); saveCareer(); openPhoneApp('bank');
    }, 'purple');

    state.transactions.forEach(t => {
      const r = document.createElement('div');
      r.className = 'tx-row ' + t.type;
      r.innerHTML = `<span>${t.desc}</span><span>${t.amt >= 0 ? '+' : ''}${t.amt}₺</span>`;
      scr.appendChild(r);
    });
  }
  else if (app === 'whatsdoc') {
    scr.innerHTML = `<div style="font-size:12.5px;color:var(--accent-green);font-weight:800;">WHATSDOC AI — 6 KİŞİ & GRUP</div>`;
    state.chats.forEach((ch, idx) => {
      const last = ch.msgs[ch.msgs.length - 1];
      const b = document.createElement('div');
      b.style.cssText = 'background:var(--bg-card);border:1.5px solid var(--border-subtle);border-radius:8px;padding:9px;cursor:pointer;';
      b.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;color:var(--accent-gold);font-size:12.5px;">${ch.name}</span>
          <span style="font-size:10px;color:var(--accent-cyan);">${ch.role || ''}</span>
        </div>
        <div style="font-size:11.5px;color:#ced4da;margin-top:4px;line-height:1.35;">${last.from}: ${last.text}</div>`;
      b.onclick = () => openChatThread(idx);
      scr.appendChild(b);
    });
  }
  else if (app === 'casino') {
    openCasinoGame(scr, 'blackjack');
  }
  else if (app === 'borsa') {
    const cr = state.crypto;
    scr.innerHTML = `
      <div style="background:var(--bg-card);border:1.5px solid var(--accent-cyan);border-radius:8px;padding:10px;font-size:12px;">
        <div style="color:var(--accent-cyan);font-weight:800;">TIPBORSA — CANLI PİYASA</div>
        <div style="margin-top:5px;">• TıpCoin (TPC): <strong>${cr.btcPrice}₺</strong> (Cüzdan: ${cr.btcQty} Adet)</div>
        <div style="margin-top:3px;">• Gram Altın: <strong>${cr.goldPrice}₺</strong> (Cüzdan: ${cr.goldQty} Gr)</div>
      </div>`;
    addChoice(scr, `1 Adet TıpCoin Al (-${cr.btcPrice}₺)`, () => tradeAsset('btc', 1), 'success');
    addChoice(scr, `1 Adet TıpCoin Sat (+${cr.btcPrice}₺)`, () => tradeAsset('btc', -1), 'danger');
    addChoice(scr, `1 Gram Altın Al (-${cr.goldPrice}₺)`, () => tradeAsset('gold', 1), 'success');
    addChoice(scr, `1 Gram Altın Sat (+${cr.goldPrice}₺)`, () => tradeAsset('gold', -1), 'danger');
  }
  else if (app === 'yemek') {
    scr.innerHTML = `
      <div style="background:var(--bg-card);border:1.5px solid var(--accent-gold);border-radius:8px;padding:10px;font-size:12px;">
        <div style="color:var(--accent-gold);font-weight:800;">NÖBETYE — HASTANEYE HIZLI SİPARİŞ</div>
        <div style="color:#ced4da;margin-top:3px;">Güncel Stres Seviyesi: <strong>%${state.stress}</strong></div>
      </div>`;
    addChoice(scr, '🌯 Adana Dürüm & Ayran (-140₺, -12 Stres)', () => orderFood('Adana Dürüm & Ayran', 140, 12));
    addChoice(scr, '☕ Double Espresso & Brownie (-95₺, -8 Stres)', () => orderFood('Double Espresso & Brownie', 95, 8));
    addChoice(scr, '🍕 Ekibe Lahmacun Ziyafeti (-420₺, -20 Stres & +5 İtibar)', () => orderFood('Ekibe Lahmacun Ziyafeti', 420, 20), 'success');
  }
  else if (app === 'fotogram') {
    scr.innerHTML = `
      <div style="font-size:12px;color:var(--accent-gold);font-weight:800;">FOTOGRAM — PİKSEL PAYLAŞIM</div>
      <canvas id="photoCanvas" width="320" height="120"></canvas>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <button class="choice-btn" onclick="takePhoto('tea','Nöbet masasında çay ve EKG ☕🩺')">Nöbet Çayı Çek</button>
        <button class="choice-btn" onclick="takePhoto('car','Nöbet çıkışı PS5 & direksiyon 🚗💨')">Araç Pozu Çek</button>
      </div>`;
    drawRetroPhoto('tea');
    state.posts.forEach(pt => {
      const d = document.createElement('div');
      d.style.cssText = 'background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:7px;padding:8px;font-size:11.5px;';
      d.innerHTML = `<strong style="color:var(--accent-cyan)">@${pt.author.replace(/\s+/g,'').toLowerCase()}</strong><br>${pt.caption}<br><span style="color:var(--accent-red)">♥ ${pt.likes} Beğeni</span>`;
      scr.appendChild(d);
    });
  }
  else if (app === 'haber') {
    scr.innerHTML = `<div style="font-size:12.5px;color:var(--accent-gold);font-weight:800;">TIPHABER — GÜNCEL MANŞETLER</div>`;
    state.news.forEach(n => {
      const d = document.createElement('div');
      d.style.cssText = 'background:var(--bg-card);border-left:3px solid var(--accent-cyan);padding:9px;border-radius:5px;font-size:12px;line-height:1.45;';
      d.textContent = n;
      scr.appendChild(d);
    });
  }
}

function tradeAsset(kind, dir) {
  const cr = state.crypto;
  if (kind === 'btc') {
    if (dir === 1 && state.money >= cr.btcPrice) { state.money -= cr.btcPrice; cr.btcQty++; addTx('TıpCoin Alımı', -cr.btcPrice, 'neg'); }
    else if (dir === -1 && cr.btcQty > 0) { state.money += cr.btcPrice; cr.btcQty--; addTx('TıpCoin Satışı', cr.btcPrice, 'pos'); }
    else { alert('Bakiye veya TıpCoin yetersiz!'); return; }
  } else {
    if (dir === 1 && state.money >= cr.goldPrice) { state.money -= cr.goldPrice; cr.goldQty++; addTx('Gram Altın Alımı', -cr.goldPrice, 'neg'); }
    else if (dir === -1 && cr.goldQty > 0) { state.money += cr.goldPrice; cr.goldQty--; addTx('Gram Altın Satışı', cr.goldPrice, 'pos'); }
    else { alert('Bakiye veya Altın yetersiz!'); return; }
  }
  playSfx('coin'); updateHud(); saveCareer(); openPhoneApp('borsa');
}

function orderFood(name, cost, stressDrop) {
  if (state.money < cost) { alert('Yetersiz bakiye!'); return; }
  state.money -= cost;
  state.stress = Math.max(0, state.stress - stressDrop);
  if (cost >= 400) state.rep = Math.min(100, state.rep + 5);
  addTx(`NöbetYe: ${name}`, -cost, 'neg');
  playSfx('coin'); updateHud(); saveCareer();
  alert(`${name} hastaneye ulaştı! Stresin %${stressDrop} azaldı.`);
  openPhoneApp('yemek');
}

function drawRetroPhoto(mode) {
  const c = document.getElementById('photoCanvas');
  if (!c) return;
  const x = c.getContext('2d');
  x.fillStyle = '#0d1320'; x.fillRect(0, 0, 320, 120);
  x.strokeStyle = '#3bc9db'; x.strokeRect(4, 4, 312, 112);
  x.fillStyle = '#fcc419'; x.font = 'bold 12px monospace';
  x.fillText(mode === 'tea' ? 'ACİL NÖBET HATIRASI' : `${state.assets.car.toUpperCase()}`, 16, 26);
  x.fillStyle = '#51cf66'; x.fillRect(126, 46, 68, 48);
  x.fillStyle = '#000'; x.fillText('16-BIT', 136, 74);
}

function takePhoto(mode, caption) {
  drawRetroPhoto(mode);
  state.posts.unshift({ author: state.docName, caption, likes: 18 + Math.floor(Math.random() * 45) });
  playSfx('coin'); saveCareer(); openPhoneApp('fotogram');
}

async function openChatThread(idx) {
  const ch = state.chats[idx];
  const scr = document.getElementById('phoneScreen');
  scr.innerHTML = `<div style="font-weight:800;color:var(--accent-gold);border-bottom:1px solid var(--border-subtle);padding-bottom:6px;font-size:13px;">${ch.name} <span style="font-size:10.5px;color:var(--accent-cyan);font-weight:600;">(${ch.role || ''})</span></div>`;
  const list = document.createElement('div');
  list.style.cssText = 'flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:4px 0;';
  ch.msgs.forEach(m => {
    const isMe = m.from === state.docName;
    const d = document.createElement('div');
    d.style.cssText = `background:${isMe ? '#19324d' : 'var(--bg-card)'};border:1px solid var(--border-subtle);border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.45;white-space:pre-line;`;
    d.innerHTML = `<strong style="color:${isMe ? 'var(--accent-green)' : 'var(--accent-cyan)'}">${m.from}:</strong> ${m.text}`;
    list.appendChild(d);
  });
  scr.appendChild(list);
  list.scrollTop = list.scrollHeight;

  const bar = document.createElement('div');
  bar.className = 'chat-input-bar';
  bar.innerHTML = `<input id="phoneMsgInp" type="text" placeholder="Mesajını yaz..."><button class="chat-send-btn" id="phoneMsgSend">Gönder</button>`;
  scr.appendChild(bar);

  const sendFn = async () => {
    const inp = document.getElementById('phoneMsgInp');
    const txt = inp.value.trim();
    if (!txt) return;
    inp.value = '';
    ch.msgs.push({ from: state.docName, text: txt });
    playSfx('msg');
    openChatThread(idx);
    const reply = await generateAIReply(ch.name, ch.persona || ch.name, txt);
    ch.msgs.push({ from: ch.name.replace(/^[^\wğüşöçıİĞÜŞÖÇ]+\s*/, ''), text: reply });
    playSfx('msg');
    saveCareer();
    if (document.getElementById('phoneMsgInp')) openChatThread(idx);
  };
  document.getElementById('phoneMsgSend').onclick = sendFn;
  document.getElementById('phoneMsgInp').addEventListener('keydown', e => { if (e.key === 'Enter') sendFn(); });
}

/* --- 4. BETTIP CLUB: BLACKJACK 21, 5-KART VIDEO POKER & CANLI AT YARIŞI --- */
const bjState = { deck: [], player: [], dealer: [], bet: 200, active: false, msg: 'Bahis miktarını seçip Blackjack elini başlat!' };
const pkState = { deck: [], hand: [], held: [false,false,false,false,false], bet: 250, phase: 'deal', msg: '5 kart dağıt ve tutmak istediğin kartlara tıkla!' };
const hrState = { selectedHorse: 0, running: false, msg: 'Favori atını seç ve yarışı başlat!' };

const HORSES = [
  { name: '1. Karayel', odd: 2.0, color: '#3bc9db' },
  { name: '2. Rüzgarın Gölgesi', odd: 3.2, color: '#fcc419' },
  { name: '3. Şahbatur', odd: 4.5, color: '#51cf66' },
  { name: '4. Gece Nöbeti', odd: 6.5, color: '#ff6b6b' }
];

function createDeck() {
  const suits = ['♠','♥','♦','♣'];
  const vals = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const d = [];
  for (const s of suits) for (const v of vals) d.push({ s, v });
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function renderCardHTML(card, idx = -1, held = false, clickable = false) {
  const isRed = card.s === '♥' || card.s === '♦';
  const onclick = clickable ? `onclick="togglePokerHold(${idx})"` : '';
  return `<div class="p-card ${isRed ? 'red' : ''} ${held ? 'held' : ''}" ${onclick}>
    <div>${card.v}</div>
    <div style="text-align:center;font-size:15px;">${card.s}</div>
    <div style="text-align:right;">${card.v}</div>
    ${held ? '<span class="hold-tag">TUT</span>' : ''}
  </div>`;
}

function bjScore(hand) {
  let sum = 0, aces = 0;
  for (const c of hand) {
    if (['J','Q','K'].includes(c.v)) sum += 10;
    else if (c.v === 'A') { sum += 11; aces++; }
    else sum += Number(c.v);
  }
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
}

function openCasinoGame(scr, mode) {
  scr.innerHTML = `
    <div class="casino-tabs">
      <div class="c-tab ${mode === 'blackjack' ? 'active' : ''}" onclick="openCasinoGame(document.getElementById('phoneScreen'), 'blackjack')">🃏 Blackjack 21</div>
      <div class="c-tab ${mode === 'poker' ? 'active' : ''}" onclick="openCasinoGame(document.getElementById('phoneScreen'), 'poker')">♠️ Video Poker</div>
      <div class="c-tab ${mode === 'horse' ? 'active' : ''}" onclick="openCasinoGame(document.getElementById('phoneScreen'), 'horse')">🏇 At Yarışı</div>
    </div>
    <div id="casinoBody" style="display:flex;flex-direction:column;gap:8px;margin-top:4px;"></div>`;
  const cb = document.getElementById('casinoBody');

  if (mode === 'blackjack') {
    const pScore = bjScore(bjState.player);
    const dScore = bjState.active ? '?' : bjScore(bjState.dealer);
    cb.innerHTML = `
      <div style="background:var(--bg-card);border:1.5px solid var(--border-subtle);border-radius:8px;padding:9px;">
        <div style="font-size:11px;color:var(--accent-gold);font-weight:800;">KRUPİYE ELİ (${dScore})</div>
        <div class="card-row">
          ${bjState.dealer.map((c, idx) => (bjState.active && idx === 1) ? '<div class="p-card" style="background:#1c7ed6;color:#fff;justify-content:center;align-items:center;">?</div>' : renderCardHTML(c)).join('')}
        </div>
        <div style="font-size:11px;color:var(--accent-cyan);font-weight:800;margin-top:8px;">SENİN ELİN (${pScore})</div>
        <div class="card-row">${bjState.player.map(c => renderCardHTML(c)).join('')}</div>
        <div style="font-size:11.5px;color:#f1f3f5;text-align:center;margin-top:6px;">${bjState.msg}</div>
      </div>`;
    if (!bjState.active) {
      addChoice(cb, '200₺ Bahisle Kart Dağıt', () => startBlackjack(200), 'success');
      addChoice(cb, '500₺ Yüksek Bahisle Kart Dağıt', () => startBlackjack(500), 'danger');
    } else {
      addChoice(cb, 'Kart Çek (Hit)', () => bjHit(), 'success');
      addChoice(cb, 'Kal (Stand — Krupiye Oynar)', () => bjStand());
      if (bjState.player.length === 2 && state.money >= bjState.bet) {
        addChoice(cb, `Bahsi 2x Katla (+${bjState.bet}₺ & Tek Kart)`, () => bjDouble(), 'purple');
      }
    }
  }
  else if (mode === 'poker') {
    cb.innerHTML = `
      <div style="background:var(--bg-card);border:1.5px solid var(--border-subtle);border-radius:8px;padding:9px;">
        <div style="font-size:10px;color:var(--accent-gold);text-align:center;">J+ Çift (1x) • İki Çift (2x) • Üçlü (3x) • Kent/Floş (5-6x) • Full House (8x)</div>
        <div class="card-row" style="margin:10px 0 16px 0;">
          ${pkState.hand.map((c, i) => renderCardHTML(c, i, pkState.held[i], pkState.phase === 'draw')).join('')}
        </div>
        <div style="font-size:11.5px;color:#f1f3f5;text-align:center;">${pkState.msg}</div>
      </div>`;
    if (pkState.phase === 'deal') {
      addChoice(cb, '250₺ Bahisle 5 Kart Dağıt', () => pokerDeal(250), 'success');
      addChoice(cb, '600₺ Bahisle 5 Kart Dağıt', () => pokerDeal(600), 'danger');
    } else {
      addChoice(cb, 'Seçilmeyen Kartları Değiştir & Sonucu Gör', () => pokerDraw(), 'success');
    }
  }
  else if (mode === 'horse') {
    cb.innerHTML = `
      <canvas id="raceCanvas" width="360" height="135"></canvas>
      <div style="font-size:11.5px;color:var(--accent-gold);text-align:center;font-weight:700;">${hrState.msg}</div>`;
    drawHorseTrack([16, 16, 16, 16]);
    if (!hrState.running) {
      HORSES.forEach((h, idx) => {
        const sel = hrState.selectedHorse === idx ? ' [SEÇİLİ ✓]' : '';
        addChoice(cb, `${h.name} (Oran: ${h.odd}x)${sel}`, () => {
          hrState.selectedHorse = idx;
          openCasinoGame(document.getElementById('phoneScreen'), 'horse');
        }, hrState.selectedHorse === idx ? 'purple' : '');
      });
      addChoice(cb, '300₺ Bahis Yatır & Yarışı Başlat!', () => startHorseRace(300), 'success');
    }
  }
}

function startBlackjack(bet) {
  if (state.money < bet) { alert('Yetersiz bakiye!'); return; }
  state.money -= bet; updateHud();
  bjState.bet = bet; bjState.deck = createDeck();
  bjState.player = [bjState.deck.pop(), bjState.deck.pop()];
  bjState.dealer = [bjState.deck.pop(), bjState.deck.pop()];
  bjState.active = true; bjState.msg = 'Karar senin: Kart Çek veya Kal!';
  playSfx('card');
  if (bjScore(bjState.player) === 21) { bjStand(); return; }
  openCasinoGame(document.getElementById('phoneScreen'), 'blackjack');
}

function bjHit() {
  bjState.player.push(bjState.deck.pop());
  playSfx('card');
  if (bjScore(bjState.player) > 21) {
    bjState.active = false;
    bjState.msg = `21'i Aştın (${bjScore(bjState.player)})! Krupiye kazandı.`;
    state.stress = Math.min(100, state.stress + 5);
    addTx('BetTıp Blackjack Kaybı', -bjState.bet, 'neg');
    updateHud(); saveCareer();
  }
  openCasinoGame(document.getElementById('phoneScreen'), 'blackjack');
}

function bjDouble() {
  state.money -= bjState.bet; bjState.bet *= 2; updateHud();
  bjState.player.push(bjState.deck.pop()); playSfx('card');
  if (bjScore(bjState.player) > 21) {
    bjState.active = false;
    bjState.msg = `2x Katladın ama 21'i aştın! (-${bjState.bet}₺)`;
    addTx('BetTıp Blackjack Kaybı', -bjState.bet, 'neg');
    saveCareer(); openCasinoGame(document.getElementById('phoneScreen'), 'blackjack');
  } else bjStand();
}

function bjStand() {
  bjState.active = false;
  while (bjScore(bjState.dealer) < 17) bjState.dealer.push(bjState.deck.pop());
  const ps = bjScore(bjState.player), ds = bjScore(bjState.dealer);
  if (ds > 21 || ps > ds) {
    const win = Math.round(bjState.bet * (ps === 21 && bjState.player.length === 2 ? 2.5 : 2));
    state.money += win;
    bjState.msg = `KAZANDIN! (${ps} vs ${ds}) +${win}₺ hesabına geçti!`;
    addTx('BetTıp Blackjack Kazancı', win - bjState.bet, 'pos');
    playSfx('coin');
  } else if (ps === ds) {
    state.money += bjState.bet;
    bjState.msg = `BERABERE (${ps} - ${ds})! Bahsin iade edildi.`;
  } else {
    bjState.msg = `KRUPİYE KAZANDI (${ds} vs ${ps}).`;
    addTx('BetTıp Blackjack Kaybı', -bjState.bet, 'neg');
  }
  updateHud(); saveCareer();
  openCasinoGame(document.getElementById('phoneScreen'), 'blackjack');
}

function pokerDeal(bet) {
  if (state.money < bet) { alert('Yetersiz bakiye!'); return; }
  state.money -= bet; updateHud();
  pkState.bet = bet; pkState.deck = createDeck();
  pkState.hand = [pkState.deck.pop(), pkState.deck.pop(), pkState.deck.pop(), pkState.deck.pop(), pkState.deck.pop()];
  pkState.held = [false,false,false,false,false];
  pkState.phase = 'draw';
  pkState.msg = 'Tutmak istediğin kartlara dokun, sonra diğerlerini değiştir!';
  playSfx('card');
  openCasinoGame(document.getElementById('phoneScreen'), 'poker');
}

function togglePokerHold(idx) {
  if (pkState.phase !== 'draw') return;
  pkState.held[idx] = !pkState.held[idx];
  playSfx('card');
  openCasinoGame(document.getElementById('phoneScreen'), 'poker');
}

function pokerDraw() {
  for (let i = 0; i < 5; i++) if (!pkState.held[i]) pkState.hand[i] = pkState.deck.pop();
  pkState.phase = 'deal';
  const mult = evaluatePokerHand(pkState.hand);
  if (mult > 0) {
    const prize = pkState.bet * mult;
    state.money += prize;
    pkState.msg = `TEBRİKLER! (${mult}x Ödeme) +${prize}₺ kazandın!`;
    addTx('BetTıp Video Poker Kazancı', prize - pkState.bet, 'pos');
    playSfx('coin');
  } else {
    pkState.msg = 'El eşleşmedi! Tekrar deneyebilirsin.';
    addTx('BetTıp Video Poker Kaybı', -pkState.bet, 'neg');
  }
  updateHud(); saveCareer();
  openCasinoGame(document.getElementById('phoneScreen'), 'poker');
}

function evaluatePokerHand(hand) {
  const rankMap = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };
  const ranks = hand.map(c => rankMap[c.v]).sort((a,b) => a - b);
  const suits = hand.map(c => c.s);
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = ranks.every((r, i) => i === 0 || r === ranks[i - 1] + 1);
  const counts = {};
  ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
  const vals = Object.values(counts).sort((a,b) => b - a);
  if (isFlush && isStraight) return 15;
  if (vals[0] === 4) return 10;
  if (vals[0] === 3 && vals[1] === 2) return 8;
  if (isFlush) return 6;
  if (isStraight) return 5;
  if (vals[0] === 3) return 3;
  if (vals[0] === 2 && vals[1] === 2) return 2;
  if (vals[0] === 2) {
    const pairRank = Number(Object.keys(counts).find(k => counts[k] === 2));
    if (pairRank >= 11) return 1;
  }
  return 0;
}

function drawHorseTrack(posArr) {
  const c = document.getElementById('raceCanvas');
  if (!c) return;
  const x = c.getContext('2d');
  x.fillStyle = '#153821'; x.fillRect(0, 0, 360, 135);
  x.fillStyle = '#1c4a2b';
  for (let gx = 0; gx < 360; gx += 12) x.fillRect(gx, 0, 6, 135);
  x.fillStyle = '#fff'; x.fillRect(326, 0, 4, 135);
  HORSES.forEach((h, i) => {
    const y = 14 + i * 30;
    x.strokeStyle = 'rgba(255,255,255,0.28)';
    x.beginPath(); x.moveTo(0, y + 22); x.lineTo(360, y + 22); x.stroke();
    const px = Math.floor(posArr[i]);
    const legOff = Math.floor(px / 4) % 2 === 0 ? 2 : -2;
    x.fillStyle = h.color;
    x.fillRect(px, y + 5, 22, 10); x.fillRect(px + 17, y - 1, 7, 8);
    x.fillRect(px + 2, y + 15, 3, 5 + legOff); x.fillRect(px + 16, y + 15, 3, 5 - legOff);
    x.fillStyle = '#111'; x.font = 'bold 9px monospace';
    x.fillText(String(i + 1), px + 8, y + 13);
  });
}

function startHorseRace(bet) {
  if (hrState.running) return;
  if (state.money < bet) { alert('Yetersiz bakiye!'); return; }
  state.money -= bet; updateHud();
  hrState.running = true; hrState.msg = 'YARIŞ BAŞLADI! Atlar son düzlüğe giriyor...';
  openCasinoGame(document.getElementById('phoneScreen'), 'horse');

  const pos = [16, 16, 16, 16];
  const timer = setInterval(() => {
    let winner = -1;
    for (let i = 0; i < 4; i++) {
      const baseSpd = i === 0 ? 3.4 : (i === 1 ? 3.1 : (i === 2 ? 2.9 : 2.7));
      pos[i] += baseSpd + Math.random() * 4.2;
      if (pos[i] >= 312 && winner === -1) winner = i;
    }
    drawHorseTrack(pos);
    if (winner !== -1) {
      clearInterval(timer);
      hrState.running = false;
      if (winner === hrState.selectedHorse) {
        const prize = Math.round(bet * HORSES[winner].odd);
        state.money += prize;
        hrState.msg = `KAZANAN: ${HORSES[winner].name}! +${prize}₺ kazandın!`;
        addTx(`BetTıp At Yarışı (${HORSES[winner].name})`, prize - bet, 'pos');
        playSfx('coin');
      } else {
        hrState.msg = `Yarışı ${HORSES[winner].name} kazandı! Senin atın geride kaldı.`;
        addTx('BetTıp At Yarışı Kaybı', -bet, 'neg');
      }
      updateHud(); saveCareer();
      if (document.getElementById('raceCanvas')) openCasinoGame(document.getElementById('phoneScreen'), 'horse');
    }
  }, 55);
}

/* --- 5. NÖBET SONU EPİKRİZ KARNESİ, ARAÇ SANAYİ/YAKIT & OTOBÜS 110 BPM CPR --- */
function endOfShiftSummary() {
  const cToday = state.dailyCorrect, wToday = state.dailyWrong;
  state.day++; state.hour = 20; state.seenToday = 0;
  state.dailyCorrect = 0; state.dailyWrong = 0;
  state.coffeeGivenToday = false;
  state.internIdx = (state.internIdx + 1) % INTERNS.length;

  const spBonus = SPECIALTIES[state.specialty]?.bonusPay || 0;
  let payroll = 1150 + (state.rep * 5) + spBonus;
  if (state.bankDebt > 0) {
    const cut = Math.min(state.bankDebt, 600);
    state.bankDebt -= cut; payroll -= cut;
    addTx('TıpBank Otomatik Kredi Taksiti', -cut, 'neg');
  }
  state.money += payroll;
  addTx(`Gün ${state.day - 1} Döner Sermaye & Nöbet Bordrosu`, payroll, 'pos');
  state.news.unshift(`GÜN ${state.day - 1} BÜLTENİ: ${state.docName}, nöbette ${cToday} hastayı başarıyla tedavi etti.`);
  updateHud(); saveCareer();

  const nextInt = INTERNS[state.internIdx];
  const hasCar = state.assets.car !== 'Yok (Belediye Otobüsü)';
  say(
    `GÜN ${state.day - 1} NÖBET EPİKRİZ KARNESİ`,
    `• Doğru Müdahale: ${cToday} | Hata: ${wToday} | Toplam Kurtarılan: ${state.totalSaved}\n• Hesaba Yatan: +${payroll}₺ | Yarın Ekip: ${nextInt.name}`,
    'NÖBET BİTTİ', 't-green', 390
  );

  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  addChoice(panel, '🌆 Açık Dünyada Gez (İnternet Kafe / PS5 Mağaza / Ev)', () => enterOpenWorld(), 'success');
  addChoice(panel, '🕹️ İnternet Kafeye Git (150₺ Saatlik 4 PS5 Oyunu)', () => goLocation('icafe'), 'purple');
  if (hasCar) {
    addChoice(panel, `🚗 ${state.assets.car} İle Eve Sür (Yakıt: %${state.assets.fuel} | Kondisyon: %${state.assets.carHealth})`, () => driveHomeWithCar());
  } else {
    addChoice(panel, '🚌 Belediye Otobüsüyle Eve Dön (%30 Acil CPR Olayı)', () => {
      if (Math.random() < 0.30) startBusEmergency();
      else goLocation('home');
    });
  }
  addChoice(panel, '☕ Hastane Kantinine Uğra (Personel Hikâyeleri & AI)', () => goLocation('canteen'));
}

function driveHomeWithCar() {
  if (state.assets.fuel < 15) {
    say('YAKIT BİTTİ!', 'Depoda benzin kalmadı! Galeri & Akaryakıt istasyonundan yakıt doldurmalısın.', 'DEPO BOŞ', 't-red', 200);
    goLocation('dealer'); return;
  }
  state.assets.fuel = Math.max(0, state.assets.fuel - 22);
  const isSahin = state.assets.car.includes('Şahin');
  if (Math.random() < (isSahin ? 0.38 : 0.14)) {
    playSfx('alarm');
    state.assets.carHealth = Math.max(20, state.assets.carHealth - 30);
    const cost = isSahin ? 450 : 850;
    const issue = isSahin
      ? 'Modifiyeli Şahin yolda hararet yaptı ve egzoz patlattı! Mahmut Usta 450₺ masraf çıkardı.'
      : 'Alman Sedan uyarı verdi: Sensör ve periyodik bakım! Servis 850₺ masraf çıkardı.';
    state.money = Math.max(0, state.money - cost);
    addTx(`Oto Sanayi Arıza Masrafı (${state.assets.car})`, -cost, 'neg');
    updateHud(); saveCareer();
    goLocation('dealer');
    say('SANAYİ YOLU GÖRÜNDÜ! 🔧', `${issue} (Kondisyon: %${state.assets.carHealth})`, 'ARIZA', 't-red', 180);
  } else {
    saveCareer(); goLocation('home');
    say('KEYİFLİ SÜRÜŞ 🚗', `${state.assets.car} ile müzik eşliğinde evine ulaştın! (Kalan Yakıt: %${state.assets.fuel})`, 'EV', 't-green', 360);
  }
}

function startBusEmergency() {
  playSfx('alarm');
  let compressions = 0;
  say('OTOBÜSTE PANİK!', '"DOKTOR VAR MI?! YOLCU YERE YIĞILDI, NABIZ YOK!" — Kalp masajı için ritmik bas (110 BPM)!', 'ACİL CPR', 't-red', 480);
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'choice-btn danger';
  btn.textContent = '💓 GÖĞÜS BASISI UYGULA (0 / 10) — 110 BPM';
  btn.onclick = () => {
    compressions++; playSfx('heart');
    btn.textContent = `💓 GÖĞÜS BASISI UYGULA (${compressions} / 10) — DEVAM!`;
    if (compressions >= 10) {
      state.money += 600; state.rep = Math.min(100, state.rep + 8);
      addTx('Bakanlık / Belediye Kahramanlık Ödülü', 600, 'pos');
      state.news.unshift(`MANŞET: ${state.docName}, belediye otobüsünde kalbi duran vatandaşı hayata döndürdü!`);
      updateHud(); saveCareer();
      say('YEREL HABERLER MANŞETİ!', `"${state.docName}, otobüste kalbi duran vatandaşı hayata döndürdü!" (+600₺ & +8 İtibar)`, 'KAHRAMAN', 't-green', 440);
      panel.innerHTML = '';
      addChoice(panel, '🏠 Evine Geç', () => goLocation('home'), 'success');
      addChoice(panel, '🏥 Yeni Nöbete Başla', () => nextPatient());
    }
  };
  panel.appendChild(btn);
}

/* --- 6. ŞEHİR MEKÂNLARI (EV, İNTERNET KAFE, PS5 MAĞAZA, KANTİN, LOKANTA, GALERİ, HALI SAHA) --- */
function goLocation(loc) {
  state.location = loc;
  state.activeStaffIdx = null;
  document.getElementById('worldJoyWrap').style.display = 'none';
  document.getElementById('zoomHint').style.display = 'none';
  closeDrawer();
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';

  if (loc === 'home') {
    document.getElementById('sceneTag').textContent = 'KENDİ EVİN — SALON & OYUN KÖŞESİ';
    const hasSetup = state.assets.hasPs5 && state.assets.hasMonitor;
    if (!hasSetup) {
      const missing = [];
      if (!state.assets.hasMonitor) missing.push('4K Gaming Monitör (2.200₺)');
      if (!state.assets.hasPs5) missing.push('PS5 Pro Konsol (4.500₺)');
      say('EVİM — KONSOL KURULUMU EKSİK', `Evde ücretsiz oynayabilmek için kurulumu tamamlamalısın!\nEksik: ${missing.join(' + ')}\nParan yetmiyorsa İnternet Kafede 150₺ ile oynayabilirsin.`, 'KURULUM YOK', 't-red', 240);
      if (!state.assets.hasMonitor) {
        addChoice(panel, '🖥️ 4K Gaming Monitör Satın Al (2.200₺)', () => buyHomeGear('hasMonitor', '4K Gaming Monitör', 2200, 'home'), 'purple');
      }
      if (!state.assets.hasPs5) {
        addChoice(panel, '🎮 PS5 Pro Konsol Satın Al (4.500₺)', () => buyHomeGear('hasPs5', 'PS5 Pro Konsol', 4500, 'home'), 'purple');
      }
      addChoice(panel, '🕹️ İnternet Kafeye Git (150₺ Saatlik PS5)', () => goLocation('icafe'));
    } else {
      say('EVİM — PS5 PRO & 4K MONİTÖR AKTİF!', 'Kendi sistemin kurulu! Sınırsız ve ücretsiz olarak 4 PS5 oyununu veya Online P2P arkadaş davetini açabilirsin.', 'SİSTEM HAZIR', 't-green', 340);
      addChoice(panel, '⚽ EA FC 27 — Takım Seç, Pas At & Online Arkadaş Davet', () => openConsole('fifa', false), 'success');
      addChoice(panel, '🔫 GTA 6 — Aydın Vice (3. Şahıs TPS & Silah)', () => openConsole('gta6', false), 'purple');
      addChoice(panel, '🏎️ Need for Speed: Aydın Gece Yarışı (Nitro Drift)', () => openConsole('nfs', false));
      addChoice(panel, '🥊 Tekken 8: Acil Arena (1v1 Dövüş)', () => openConsole('tekken', false));
    }
    addChoice(panel, '📚 Evde TUS Çalış (-300₺ -> +3 TUS Puanı)', () => {
      if (state.money >= 300) {
        state.money -= 300; state.tusScore += 3; addTx('TUS Etüt & Soru Bankası', -300, 'neg');
        updateHud(); saveCareer(); say('TUS ETÜTÜ', `Harika etüt oldu! Güncel TUS Puanın: ${state.tusScore}`, 'TUS +3', 't-purple', 420);
      } else alert('Yetersiz bakiye!');
    });
    addChoice(panel, '🌆 Açık Dünyaya Çık', () => enterOpenWorld());
    addChoice(panel, '🏥 Yeni Nöbete Başla', () => nextPatient(), 'success');
  }
  else if (loc === 'icafe') {
    document.getElementById('sceneTag').textContent = 'AYDIN E-SPOR & İNTERNET KAFE';
    say('İNTERNET KAFE İŞLETMECİSİ', '"Hoş geldin doktor! Masalarımızda 4K monitör + PS5 Pro + Online P2P hazır. Saatlik 150₺!"', 'KAFE AÇIK', 't-yellow', 280);
    addChoice(panel, '⚽ Masa 1 Aç: EA FC 27 (Takım Seç + Pas + Online) (-150₺)', () => payCafeAndOpen('fifa'), 'success');
    addChoice(panel, '🔫 Masa 2 Aç: GTA 6 (3. Şahıs & Silah) (-150₺)', () => payCafeAndOpen('gta6'), 'purple');
    addChoice(panel, '🏎️ Masa 3 Aç: NFS Aydın Gece Yarışı (-150₺)', () => payCafeAndOpen('nfs'));
    addChoice(panel, '🥊 Masa 4 Aç: Tekken 8 Arena (-150₺)', () => payCafeAndOpen('tekken'));
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
  else if (loc === 'tech') {
    document.getElementById('sceneTag').textContent = 'AYDIN TEKNOLOJİ & KONSOL MAĞAZASI';
    say('TEKNOLOJİ MAĞAZASI', `Ev Kurulum Durumu:\n• 4K Gaming Monitör: ${state.assets.hasMonitor ? 'ALINDI ✓' : 'YOK (2.200₺)'}\n• PS5 Pro Konsol: ${state.assets.hasPs5 ? 'ALINDI ✓' : 'YOK (4.500₺)'}`, 'MAĞAZA', 't-cyan', 300);
    addChoice(panel, state.assets.hasMonitor ? '🖥️ 4K Gaming Monitör [ALINDI ✓]' : '🖥️ 4K Gaming Monitör Al (2.200₺)', () => buyHomeGear('hasMonitor', '4K Gaming Monitör', 2200, 'tech'), state.assets.hasMonitor ? 'success' : 'purple');
    addChoice(panel, state.assets.hasPs5 ? '🎮 PS5 Pro Konsol [ALINDI ✓]' : '🎮 PS5 Pro Konsol Al (4.500₺)', () => buyHomeGear('hasPs5', 'PS5 Pro Konsol', 4500, 'tech'), state.assets.hasPs5 ? 'success' : 'purple');
    addChoice(panel, '🏠 Eve Git & Sistemi Aç', () => goLocation('home'));
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
  else if (loc === 'canteen') {
    document.getElementById('sceneTag').textContent = 'HASTANE KANTİNİ — PERSONEL MOLA';
    say('HASTANE KANTİNİ', `Sohbet etmek (elle AI yazışması!) veya günde 1 kez kahve ısmarlamak için personel seç (Kahve hakkı: ${state.coffeeGivenToday ? 'KULLANILDI' : '1 MEVCUT'}):`, 'SOSYAL', 't-yellow', 340);
    state.staff.forEach((st, i) => addChoice(panel, `${st.name} (${st.role}) — Dostluk: ${st.love}/100`, () => interactStaff(i)));
    addChoice(panel, '🏥 Polikliniğe Dön', () => nextPatient(), 'success');
  }
  else if (loc === 'diner') {
    document.getElementById('sceneTag').textContent = 'MAHALLE ESNAF LOKANTASI';
    say('USTA AŞÇI', '"Hoş geldin doktor bey! Mercimek çorbası ve kavurma taze çıktı, stresini ve yorgunluğunu alır."', 'LOKANTA', 't-yellow', 240);
    addChoice(panel, '🍲 Mercimek Çorbası + Kavurma Ye (-90₺, -15 Stres)', () => {
      if (state.money >= 90) {
        state.money -= 90; state.stress = Math.max(0, state.stress - 15);
        addTx('Esnaf Lokantası Akşam Yemeği', -90, 'neg'); updateHud(); saveCareer();
        say('LEZİZ!', 'Sıcacık çorba ve kavurma stresini azalttı!', 'ENERJİ FULL', 't-green', 380);
      } else alert('Yetersiz bakiye!');
    });
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
    addChoice(panel, '🏥 Polikliniğe Dön', () => nextPatient(), 'success');
  }
  else if (loc === 'dealer') {
    document.getElementById('sceneTag').textContent = 'OTO GALERİ, AKARYAKIT & SANAYİ';
    const hasCar = state.assets.car !== 'Yok (Belediye Otobüsü)';
    say('GALERİ & MAHMUT USTA', hasCar
      ? `Aracın: ${state.assets.car} | Yakıt: %${state.assets.fuel} | Mekanik Kondisyon: %${state.assets.carHealth}`
      : 'Henüz aracın yok, belediye otobüsüyle gidip geliyorsun. Bütçene göre araç seç!', 'GALERİ', 't-yellow', 260);
    addChoice(panel, '🚘 1998 Modifiyeli Şahin Al (2.800₺ — Sık Sanayi Riski)', () => buyCar('Modifiyeli Şahin', 2800, '#ff6b6b'));
    addChoice(panel, '🚙 2024 Alman Sedan Al (7.500₺ — Sağlam & Konforlu)', () => buyCar('Alman Sedan', 7500, '#51cf66'));
    if (hasCar) {
      addChoice(panel, '⛽ Depoyu Full Yap (-220₺, Yakıt %100)', () => {
        if (state.money >= 220) { state.money -= 220; state.assets.fuel = 100; addTx('Akaryakıt (Full Depo)', -220, 'neg'); playSfx('coin'); updateHud(); saveCareer(); goLocation('dealer'); }
        else alert('Yetersiz bakiye!');
      }, 'success');
      addChoice(panel, '🔧 Sanayi Genel Bakım & Tamir (-400₺, Kondisyon %100)', () => {
        if (state.money >= 400) { state.money -= 400; state.assets.carHealth = 100; addTx('Oto Sanayi Bakım', -400, 'neg'); playSfx('coin'); updateHud(); saveCareer(); goLocation('dealer'); }
        else alert('Yetersiz bakiye!');
      });
    }
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
    addChoice(panel, '🏥 Polikliniğe Dön', () => nextPatient(), 'success');
  }
  else if (loc === 'pitch') {
    document.getElementById('sceneTag').textContent = 'AYDIN HALI SAHA TESİSLERİ';
    say('HALI SAHA MAÇI', 'Takımını seç, kanattan kat edip paslaşarak oyna veya arkadaşını online davet et!', 'MAÇ', 't-green', 340);
    addChoice(panel, '⚽ Halı Saha & EA FC 27 Maçına Çık', () => openConsole('fifa', true), 'success');
    addChoice(panel, '🌆 Açık Dünyaya Dön', () => enterOpenWorld());
  }
}

function buyHomeGear(prop, label, cost, returnLoc) {
  if (state.assets[prop]) return;
  if (state.money < cost) { alert(`Yetersiz bakiye! ${cost}₺ gerekli.`); return; }
  state.money -= cost;
  state.assets[prop] = true;
  addTx(`Satın Alma: ${label}`, -cost, 'neg');
  playSfx('coin'); updateHud(); saveCareer();
  goLocation(returnLoc);
}

function buyCar(name, cost, color) {
  if (state.money < cost) { alert(`Yetersiz bakiye! ${cost}₺ gerekli.`); return; }
  state.money -= cost;
  state.assets.car = name;
  state.assets.carColor = color;
  state.assets.fuel = 100;
  state.assets.carHealth = 100;
  addTx(`Araç Alımı: ${name}`, -cost, 'neg');
  playSfx('coin'); updateHud(); saveCareer();
  goLocation('dealer');
}

function payCafeAndOpen(gameMode) {
  if (state.money < 150) { alert('İnternet kafe ücreti için en az 150₺ gerekli!'); return; }
  state.money -= 150;
  addTx(`İnternet Kafe (${gameMode.toUpperCase()})`, -150, 'neg');
  playSfx('coin'); updateHud(); saveCareer();
  openConsole(gameMode, true);
}

function interactStaff(idx) {
  state.activeStaffIdx = idx;
  const st = state.staff[idx];
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  const line = st.stories[Math.min(st.stage, st.stories.length - 1)];
  st.stage = Math.min(st.stories.length - 1, st.stage + 1);
  say(`${st.name} (${st.role})`, `"${line}"`, `DOSTLUK ${st.love}/100`, 't-green', 340);

  const bar = document.createElement('div');
  bar.className = 'chat-input-bar';
  bar.innerHTML = `<input id="canteenChatInp" type="text" placeholder="${st.name} ile konuşmak için yaz..."><button class="chat-send-btn" id="canteenChatBtn">Konuş</button>`;
  panel.appendChild(bar);

  const askStaff = async () => {
    const inp = document.getElementById('canteenChatInp');
    const msg = inp.value.trim();
    if (!msg) return;
    inp.value = '';
    say(st.name, '...', 'YAZIYOR', 't-yellow', 300);
    const reply = await generateAIReply(st.name, st.persona, msg);
    st.love = Math.min(100, st.love + 3);
    saveCareer();
    say(`${st.name} (${st.role})`, `"${reply}"`, `DOSTLUK ${st.love}/100`, 't-green', 340);
  };
  document.getElementById('canteenChatBtn').onclick = askStaff;
  document.getElementById('canteenChatInp').addEventListener('keydown', e => { if (e.key === 'Enter') askStaff(); });

  if (!state.coffeeGivenToday) {
    addChoice(panel, '☕ Kahve Ismarla (-45₺, Günde 1 Kez, Dostluk +15, -8 Stres)', () => {
      if (state.money >= 45) {
        state.money -= 45; state.coffeeGivenToday = true;
        st.love = Math.min(100, st.love + 15);
        state.stress = Math.max(0, state.stress - 8);
        addTx(`Kantin Kahve İkramı (${st.name})`, -45, 'neg');
        playSfx('coin'); updateHud(); saveCareer();
        interactStaff(idx);
      } else alert('Yetersiz bakiye!');
    }, 'success');
  }
  addChoice(panel, '← Kantin Listesine Dön', () => goLocation('canteen'));
}
