/* =========================================================================
   GRAPHICS_HD.JS — SIFIR ASSET HD-2D IŞIKLANDIRMA, ANİMASYON & EFEKT MOTORU
   Mevcut index.html, cases.js, phone_life.js, console_online.js ve
   expansion.js ile %100 uyumlu eklenti modülü.
   ========================================================================= */

(function () {
  /* =======================================================================
     1. HASTANE & ŞEHİR HD-2D IŞIKLANDIRMA, KARAKTER GÖLGELENDİRME & POST-FX
     ======================================================================= */

  // Daha detaylı, gölgeli ve ışık yansımalı karakter çizici
  window.drawPixelCharacter = function (x, y, opts) {
    const {
      skin = '#f1c2a5',
      hair = '#2b1d14',
      shirt = '#1971c2',
      isDoctor = false,
      coatColor = '#f8f9fa',
      flush = false,
      cyanosis = false,
      sweat = false,
      pupils = 'normal',
      blink = false,
      bob = 0
    } = opts || {};

    const sy = Math.floor(y + bob);
    const sx = Math.floor(x);

    // Arka plan yumuşak derinlik gölgesi
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(sx + 4, sy + 2, 22, 43);

    // Saç (Katmanlı + üst ışık yansıması)
    pxRect(sx + 7, sy, 14, 3, hair);
    pxRect(sx + 5, sy + 2, 18, 5, hair);
    pxRect(sx + 4, sy + 5, 3, 7, hair);
    pxRect(sx + 21, sy + 5, 3, 7, hair);
    pxRect(sx + 9, sy + 1, 8, 1, 'rgba(255,255,255,0.22)');

    // Kulaklar
    pxRect(sx + 4, sy + 10, 2, 4, '#c68b6b');
    pxRect(sx + 22, sy + 10, 2, 4, '#c68b6b');

    // Yüz, çene ve yanak derinliği
    pxRect(sx + 6, sy + 6, 16, 12, skin);
    pxRect(sx + 7, sy + 18, 14, 2, skin);
    pxRect(sx + 6, sy + 6, 16, 1, 'rgba(0,0,0,0.18)'); // Alın saç gölgesi
    pxRect(sx + 7, sy + 19, 14, 1, 'rgba(0,0,0,0.22)'); // Çene gölgesi
    pxRect(sx + 20, sy + 7, 2, 11, 'rgba(0,0,0,0.12)'); // Sağ yüz gölgesi

    // Kaşlar ve burun
    pxRect(sx + 8, sy + 8, 4, 1, hair);
    pxRect(sx + 16, sy + 8, 4, 1, hair);
    pxRect(sx + 13, sy + 11, 2, 3, 'rgba(130,75,55,0.45)');

    // Kızarıklık / Siyanoz / Ağız
    if (flush) {
      pxRect(sx + 7, sy + 13, 3, 2, 'rgba(255, 107, 107, 0.78)');
      pxRect(sx + 18, sy + 13, 3, 2, 'rgba(255, 107, 107, 0.78)');
    }
    pxRect(sx + 11, sy + 16, 6, 1, cyanosis ? '#5c7cfa' : '#a85a52');
    pxRect(sx + 12, sy + 17, 4, 1, 'rgba(255,255,255,0.18)');

    // Gözler (Işık yansımalı)
    if (!blink) {
      pxRect(sx + 8, sy + 10, 4, 3, '#ffffff');
      pxRect(sx + 16, sy + 10, 4, 3, '#ffffff');
      const p1 = pupils === 'miosis' ? 1 : 2;
      const p2 = (pupils === 'anisocoria' || pupils === 'midriasis_fixed') ? 3 : p1;
      pxRect(sx + 9, sy + 10, p1, p1, '#111111');
      pxRect(sx + 17, sy + 10, p2, p2, '#111111');
      pxRect(sx + 9, sy + 10, 1, 1, 'rgba(255,255,255,0.75)');
      pxRect(sx + 17, sy + 10, 1, 1, 'rgba(255,255,255,0.75)');
    } else {
      pxRect(sx + 8, sy + 11, 4, 1, '#2b1d14');
      pxRect(sx + 16, sy + 11, 4, 1, '#2b1d14');
    }

    // Parlak ter damlası
    if (sweat) {
      const dy = sy + 7 + (Math.floor(tick / 6) % 4);
      pxRect(sx + 24, dy, 2, 3, '#3bc9db');
      pxRect(sx + 24, dy, 1, 1, '#ffffff');
    }

    // Boyun
    pxRect(sx + 11, sy + 20, 6, 3, '#c68b6b');
    pxRect(sx + 11, sy + 20, 6, 1, 'rgba(0,0,0,0.28)');

    if (isDoctor) {
      // Beyaz doktor önlüğü, yaka kıvrımları, scrub ve metalik stetoskop
      pxRect(sx + 3, sy + 23, 22, 22, coatColor);
      pxRect(sx + 21, sy + 23, 4, 22, 'rgba(0,0,0,0.14)');
      pxRect(sx + 3, sy + 23, 2, 22, 'rgba(255,255,255,0.45)');
      pxRect(sx + 10, sy + 23, 8, 22, shirt);
      pxRect(sx + 10, sy + 23, 8, 2, 'rgba(0,0,0,0.25)');
      // Önlük yakaları
      pxRect(sx + 8, sy + 23, 2, 8, '#dee2e6');
      pxRect(sx + 18, sy + 23, 2, 8, '#dee2e6');
      // Stetoskop kordonu + metal çan
      pxRect(sx + 9, sy + 22, 1, 9, '#212529');
      pxRect(sx + 18, sy + 22, 1, 9, '#212529');
      pxRect(sx + 17, sy + 30, 3, 3, '#adb5bd');
      pxRect(sx + 18, sy + 31, 1, 1, '#ffffff');
      // Kimlik yaka kartı
      pxRect(sx + 4, sy + 28, 4, 3, '#3bc9db');
      pxRect(sx + 5, sy + 29, 2, 1, '#ffffff');
    } else {
      // Hasta kıyafeti (Omuz parlaklığı, kıvrım gölgesi ve kol ayrımı)
      pxRect(sx + 2, sy + 23, 24, 22, shirt);
      pxRect(sx + 2, sy + 23, 24, 2, 'rgba(255,255,255,0.16)');
      pxRect(sx + 20, sy + 23, 6, 22, 'rgba(0,0,0,0.26)');
      pxRect(sx + 2, sy + 23, 3, 22, 'rgba(0,0,0,0.18)');
      pxRect(sx + 10, sy + 23, 8, 2, '#111827');
      pxRect(sx + 6, sy + 28, 1, 17, 'rgba(0,0,0,0.35)');
      pxRect(sx + 21, sy + 28, 1, 17, 'rgba(0,0,0,0.35)');
    }
  };

  // Sahne üstü HD-2D ışıklandırma, monitör parıltısı ve sinematik vignette katmanı
  function drawScenePostFX() {
    ctx.save();
    if (state.location === 'er') {
      // Tavan floresanlarından yumuşak ışık konileri
      const lamp1 = ctx.createRadialGradient(122, 4, 4, 122, 58, 95);
      lamp1.addColorStop(0, 'rgba(224, 251, 252, 0.14)');
      lamp1.addColorStop(1, 'rgba(224, 251, 252, 0)');
      ctx.fillStyle = lamp1;
      ctx.fillRect(20, 0, 210, 125);

      const lamp2 = ctx.createRadialGradient(356, 4, 4, 356, 58, 95);
      lamp2.addColorStop(0, 'rgba(224, 251, 252, 0.14)');
      lamp2.addColorStop(1, 'rgba(224, 251, 252, 0)');
      ctx.fillStyle = lamp2;
      ctx.fillRect(250, 0, 220, 125);

      // Sol EKG monitörünün masaya vuran yeşil parıltısı
      const ekgGlow = ctx.createRadialGradient(53, 112, 4, 53, 112, 48);
      ekgGlow.addColorStop(0, 'rgba(81, 207, 102, 0.18)');
      ekgGlow.addColorStop(1, 'rgba(81, 207, 102, 0)');
      ctx.fillStyle = ekgGlow;
      ctx.fillRect(0, 70, 115, 95);

      // Kırmızı Alan hastası varsa ekran kenarlarında hafif nabız uyarısı
      if (state.currentPatient && state.currentPatient.triage === 'red') {
        const pulse = 0.08 + Math.abs(Math.sin(tick * 0.08)) * 0.14;
        const alertGrad = ctx.createRadialGradient(240, 90, 130, 240, 90, 265);
        alertGrad.addColorStop(0, 'rgba(255, 50, 50, 0)');
        alertGrad.addColorStop(1, `rgba(255, 59, 59, ${pulse.toFixed(3)})`);
        ctx.fillStyle = alertGrad;
        ctx.fillRect(0, 0, 480, 180);
      }
    } else if (state.location === 'icafe') {
      // İnternet kafe neon pembe-mavi atmosfer parıltısı
      const neon = ctx.createLinearGradient(0, 0, 480, 180);
      neon.addColorStop(0, 'rgba(214, 51, 108, 0.14)');
      neon.addColorStop(0.5, 'rgba(59, 201, 219, 0.08)');
      neon.addColorStop(1, 'rgba(112, 72, 232, 0.16)');
      ctx.fillStyle = neon;
      ctx.fillRect(0, 0, 480, 180);
    }

    // Tüm sahnelerde hafif sinematik vignette (köşe derinliği)
    const vig = ctx.createRadialGradient(240, 90, 145, 240, 90, 275);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(4,7,14,0.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, 480, 180);
    ctx.restore();
  }

  const origRenderLoop = window.renderLoop;
  window.renderLoop = function () {
    origRenderLoop();
    drawScenePostFX();
  };

  /* =======================================================================
     2. TEKKEN 8: HD EKLEMLİ DÖVÜŞÇÜLER, HIT-STOP, SCREEN SHAKE & KOMBO
     ======================================================================= */
  let hdTk = null;

  function spawnSparks(arr, x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2.5 + Math.random() * 6.5;
      arr.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.5,
        life: 16 + Math.floor(Math.random() * 14),
        maxLife: 30,
        size: 2 + Math.random() * 3.5,
        color
      });
    }
  }

  window.triggerTekkenPunch = function () {
    if (!hdTk || activeArcadeMode !== 'tekken') return;
    const p1 = hdTk.p1, p2 = hdTk.p2;
    if (p1.cd > 0 || hdTk.koTimer > 0) return;

    p1.comboStep = (p1.comboStep + 1) % 3;
    p1.attackType = 'punch';
    p1.attackFrame = 12;
    p1.cd = 15;

    const dist = Math.abs(p1.x - p2.x);
    if (dist < 105 && Math.abs(p1.y - p2.y) < 55) {
      const dmg = p1.comboStep === 2 ? 15 : 10;
      p2.hp = Math.max(0, p2.hp - dmg);
      p2.hurtFrame = 12;
      p2.vx = (p2.x >= p1.x ? 1 : -1) * (p1.comboStep === 2 ? 8 : 4.5);
      hdTk.hitStop = 4;
      hdTk.shake = p1.comboStep === 2 ? 9 : 5;
      hdTk.comboCount++;
      hdTk.comboResetTimer = 75;
      const hx = (p1.x + p2.x) / 2;
      const hy = p2.y - 68;
      spawnSparks(hdTk.particles, hx, hy, p1.comboStep === 2 ? '#fcc419' : '#3bc9db', 14);
      hdTk.popups.push({ x: p2.x, y: p2.y - 108, text: `-${dmg}`, color: '#fcc419', life: 36 });
      playBlip(p1.comboStep === 2 ? 190 : 280, 'square', 0.06, 0.06);
    } else {
      playBlip(440, 'triangle', 0.03, 0.03);
    }
  };

  window.triggerTekkenKick = function () {
    if (!hdTk || activeArcadeMode !== 'tekken') return;
    const p1 = hdTk.p1, p2 = hdTk.p2;
    if (p1.cd > 0 || hdTk.koTimer > 0) return;

    p1.attackType = 'kick';
    p1.attackFrame = 16;
    p1.cd = 23;

    const dist = Math.abs(p1.x - p2.x);
    if (dist < 126 && Math.abs(p1.y - p2.y) < 65) {
      const dmg = 18;
      p2.hp = Math.max(0, p2.hp - dmg);
      p2.hurtFrame = 16;
      p2.vx = (p2.x >= p1.x ? 1 : -1) * 11;
      hdTk.hitStop = 6;
      hdTk.shake = 12;
      hdTk.comboCount++;
      hdTk.comboResetTimer = 75;
      const hx = (p1.x + p2.x) / 2;
      const hy = p2.y - 54;
      spawnSparks(hdTk.particles, hx, hy, '#ff922b', 22);
      hdTk.popups.push({ x: p2.x, y: p2.y - 115, text: `KRİTİK -${dmg}!`, color: '#ff6b6b', life: 42 });
      playBlip(145, 'sawtooth', 0.09, 0.07);
    } else {
      playBlip(360, 'triangle', 0.04, 0.03);
    }
  };

  function drawArticulatedFighter(x, f, facing, isPlayer, t) {
    x.save();
    x.translate(f.x, f.y);

    // Zemin temas gölgesi (Zıplayınca küçülür)
    const groundY = 372 - f.y;
    const shadowScale = Math.max(0.45, 1 - Math.abs(groundY) / 140);
    x.fillStyle = 'rgba(0,0,0,0.45)';
    x.beginPath();
    x.ellipse(0, groundY + 4, 34 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    x.fill();

    // Darbe yiyince geriye eğilme + beyaz parlama
    const hurtTilt = f.hurtFrame > 0 ? -facing * 0.22 : 0;
    const bob = Math.sin(t * 0.14 + (isPlayer ? 0 : 2)) * 3;
    x.rotate(hurtTilt);
    x.scale(facing, 1);

    const walk = Math.abs(f.vx) > 0.6 ? Math.sin(t * 0.35) * 14 : 0;
    const primary = f.hurtFrame > 8 ? '#ffffff' : (isPlayer ? '#f8f9fa' : '#1e1b2e');
    const accent = isPlayer ? '#3bc9db' : '#e03131';
    const skin = '#f1c2a5';

    // Arka Bacak
    x.strokeStyle = isPlayer ? '#1e293b' : '#111827';
    x.lineWidth = 11; x.lineCap = 'round';
    x.beginPath(); x.moveTo(-6, -42 + bob); x.lineTo(-14 - walk * 0.6, -20); x.lineTo(-16 - walk, 0); x.stroke();

    // Ön Bacak (Tekme animasyonlu)
    x.strokeStyle = isPlayer ? '#334155' : '#2b141c';
    x.beginPath();
    if (f.attackType === 'kick' && f.attackFrame > 4) {
      x.moveTo(6, -44 + bob); x.lineTo(36, -54 + bob); x.lineTo(68, -64 + bob);
      x.stroke();
      // Döner tekme enerji yayı
      x.strokeStyle = isPlayer ? 'rgba(252,196,25,0.85)' : 'rgba(255,107,107,0.85)';
      x.lineWidth = 5;
      x.beginPath(); x.arc(16, -52 + bob, 52, -0.7, 0.45); x.stroke();
    } else {
      x.moveTo(6, -42 + bob); x.lineTo(14 + walk * 0.6, -20); x.lineTo(16 + walk, 0);
      x.stroke();
    }

    // Gövde (Doktor önlüğü / Dövüşçü gi'si)
    x.fillStyle = primary;
    x.beginPath();
    x.roundRect(-16, -86 + bob, 32, 46, 7);
    x.fill();
    // İç kuşak / Scrub detayı
    x.fillStyle = accent;
    x.fillRect(-5, -86 + bob, 11, 46);
    x.fillStyle = '#0f172a';
    x.fillRect(-16, -48 + bob, 32, 6); // Kemer

    // Arka Kol (Gard)
    x.strokeStyle = primary; x.lineWidth = 9;
    x.beginPath(); x.moveTo(-10, -78 + bob); x.lineTo(-22, -62 + bob); x.lineTo(-6, -58 + bob); x.stroke();

    // Kafa, Bandana / Gözler
    x.fillStyle = skin;
    x.beginPath(); x.arc(2, -100 + bob, 13, 0, Math.PI * 2); x.fill();
    x.fillStyle = isPlayer ? '#2b1d14' : '#111827';
    x.beginPath(); x.arc(0, -104 + bob, 13, Math.PI, Math.PI * 2); x.fill();
    // Bandana şeridi & rüzgârda uçuşan kuyruk
    x.fillStyle = accent;
    x.fillRect(-11, -107 + bob, 25, 4);
    x.strokeStyle = accent; x.lineWidth = 3;
    x.beginPath();
    x.moveTo(-11, -105 + bob);
    x.quadraticCurveTo(-24, -103 + Math.sin(t * 0.2) * 5, -34, -97 + Math.cos(t * 0.2) * 6);
    x.stroke();
    // Göz
    x.fillStyle = isPlayer ? '#111' : '#ff4d4d';
    x.fillRect(7, -102 + bob, 4, 3);

    // Ön Kol & Yumruk
    x.strokeStyle = primary; x.lineWidth = 10;
    x.beginPath();
    if (f.attackType === 'punch' && f.attackFrame > 2) {
      x.moveTo(10, -78 + bob); x.lineTo(36, -76 + bob); x.lineTo(62, -76 + bob);
      x.stroke();
      // Eldiven / Yumruk + darbe halkası
      x.fillStyle = accent;
      x.beginPath(); x.arc(64, -76 + bob, 8, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 2;
      x.beginPath(); x.arc(66, -76 + bob, 13, -0.8, 0.8); x.stroke();
    } else {
      x.moveTo(10, -78 + bob); x.lineTo(24, -64 + bob); x.lineTo(18, -56 + bob);
      x.stroke();
      x.fillStyle = accent;
      x.beginPath(); x.arc(19, -56 + bob, 6, 0, Math.PI * 2); x.fill();
    }

    x.restore();
  }

  window.startTekkenArena = function (c, x) {
    x.imageSmoothingEnabled = true;
    const tk = {
      p1: { x: 230, y: 372, vx: 0, vy: 0, hp: 100, dispHp: 100, attackType: null, attackFrame: 0, hurtFrame: 0, cd: 0, comboStep: 0 },
      p2: { x: 570, y: 372, vx: 0, vy: 0, hp: 100, dispHp: 100, attackType: null, attackFrame: 0, hurtFrame: 0, cd: 45 },
      wins: 0, koTimer: 0, hitStop: 0, shake: 0, comboCount: 0, comboResetTimer: 0,
      particles: [], popups: [], t: 0
    };
    hdTk = tk;

    function loop() {
      if (activeArcadeMode !== 'tekken') return;
      tk.t++;

      if (tk.hitStop > 0) {
        tk.hitStop--;
        arcadeAnimId = requestAnimationFrame(loop);
        return;
      }

      if (tk.shake > 0) tk.shake *= 0.82;
      if (tk.comboResetTimer > 0) {
        tk.comboResetTimer--;
        if (tk.comboResetTimer === 0) tk.comboCount = 0;
      }

      // Oyuncu Kontrolleri (Yürüme + Zıplama)
      let ix = arcadeJoyVec.x, iy = arcadeJoyVec.y;
      if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
      if (keys['ArrowRight'] || keys['KeyD']) ix = 1;
      if (keys['ArrowUp'] || keys['KeyW']) iy = -1;

      if (tk.koTimer === 0) {
        tk.p1.vx = ix * 4.8;
        tk.p1.x = Math.max(70, Math.min(730, tk.p1.x + tk.p1.vx));
        if (iy < -0.55 && tk.p1.y >= 372) {
          tk.p1.vy = -12.5;
          playBlip(360, 'triangle', 0.05, 0.03);
        }
      }
      // Yerçekimi
      [tk.p1, tk.p2].forEach(f => {
        f.y += f.vy;
        if (f.y < 372) f.vy += 0.68;
        else { f.y = 372; f.vy = 0; }
        if (f.attackFrame > 0) f.attackFrame--;
        if (f.hurtFrame > 0) f.hurtFrame--;
        if (f.cd > 0) f.cd--;
        f.dispHp += (f.hp - f.dispHp) * 0.08;
      });

      // Rakip AI
      const dist = tk.p2.x - tk.p1.x;
      const facing1 = dist >= 0 ? 1 : -1;
      if (tk.koTimer === 0) {
        if (tk.p2.hurtFrame > 0) {
          tk.p2.x = Math.max(70, Math.min(730, tk.p2.x + tk.p2.vx));
          tk.p2.vx *= 0.8;
        } else if (Math.abs(dist) > 88) {
          tk.p2.vx = -Math.sign(dist) * 2.5;
          tk.p2.x = Math.max(70, Math.min(730, tk.p2.x + tk.p2.vx));
        } else {
          tk.p2.vx = 0;
          if (tk.p2.cd <= 0) {
            tk.p2.cd = 48;
            tk.p2.attackType = Math.random() < 0.35 ? 'kick' : 'punch';
            tk.p2.attackFrame = 12;
            const dmg = tk.p2.attackType === 'kick' ? 12 : 8;
            if (Math.abs(tk.p1.y - tk.p2.y) < 55) {
              tk.p1.hp = Math.max(0, tk.p1.hp - dmg);
              tk.p1.hurtFrame = 10;
              tk.shake = 6;
              spawnSparks(tk.particles, (tk.p1.x + tk.p2.x) / 2, tk.p1.y - 68, '#ff6b6b', 10);
              playBlip(170, 'square', 0.06, 0.05);
            }
          }
        }
      }

      if (tk.p2.hp <= 0 && tk.koTimer === 0) {
        tk.wins++; tk.koTimer = 75;
        state.money += 200; addTx('Tekken 8 Arena Galibiyeti', 200, 'pos');
        updateHud(); saveCareer(); playSfx('coin');
      } else if (tk.p1.hp <= 0 && tk.koTimer === 0) {
        tk.koTimer = 65;
      }

      if (tk.koTimer > 0) {
        tk.koTimer--;
        if (tk.koTimer === 0) {
          tk.p1.hp = 100; tk.p1.dispHp = 100; tk.p1.x = 230;
          tk.p2.hp = 100; tk.p2.dispHp = 100; tk.p2.x = 570;
          tk.comboCount = 0;
        }
      }

      // ÇİZİM (Kamera Titremesi dahil)
      x.save();
      if (tk.shake > 0.5) x.translate((Math.random() - 0.5) * tk.shake, (Math.random() - 0.5) * tk.shake);

      // Gece Neon Arena Gökyüzü
      const sky = x.createLinearGradient(0, 0, 0, 340);
      sky.addColorStop(0, '#090d1a');
      sky.addColorStop(0.55, '#1d1438');
      sky.addColorStop(1, '#311a4f');
      x.fillStyle = sky; x.fillRect(0, 0, 800, 340);

      // Ay ve Şehir Silueti
      x.fillStyle = '#fef3c7';
      x.beginPath(); x.arc(400, 92, 34, 0, Math.PI * 2); x.fill();
      for (let i = 0; i < 16; i++) {
        const bw = 42 + (i % 3) * 16;
        const bh = 70 + ((i * 37) % 110);
        const bx = i * 52;
        x.fillStyle = '#0f172a';
        x.fillRect(bx, 340 - bh, bw, bh);
        x.fillStyle = i % 2 === 0 ? 'rgba(59,201,219,0.45)' : 'rgba(252,196,25,0.4)';
        for (let wy = 348 - bh; wy < 326; wy += 14) {
          x.fillRect(bx + 8, wy, 6, 4); x.fillRect(bx + 22, wy, 6, 4);
        }
      }

      // Hareketli Arena Spot Işıkları
      const sp1 = 220 + Math.sin(tk.t * 0.025) * 120;
      const g1 = x.createLinearGradient(sp1, 0, sp1 - 50, 360);
      g1.addColorStop(0, 'rgba(59, 201, 219, 0.22)');
      g1.addColorStop(1, 'rgba(59, 201, 219, 0)');
      x.fillStyle = g1;
      x.beginPath(); x.moveTo(sp1 - 15, 0); x.lineTo(sp1 + 15, 0); x.lineTo(sp1 + 90, 360); x.lineTo(sp1 - 140, 360); x.fill();

      // Yansımalı Arena Zemini
      const floor = x.createLinearGradient(0, 340, 0, 450);
      floor.addColorStop(0, '#1e293b'); floor.addColorStop(1, '#090d16');
      x.fillStyle = floor; x.fillRect(0, 340, 800, 110);
      x.strokeStyle = 'rgba(59,201,219,0.28)'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(0, 340); x.lineTo(800, 340); x.stroke();
      for (let lx = -120; lx <= 920; lx += 80) {
        x.strokeStyle = 'rgba(255,255,255,0.06)';
        x.beginPath(); x.moveTo(400 + (lx - 400) * 0.45, 340); x.lineTo(lx, 450); x.stroke();
      }

      // Eklemli Dövüşçüler
      drawArticulatedFighter(x, tk.p1, facing1, true, tk.t);
      drawArticulatedFighter(x, tk.p2, -facing1, false, tk.t);

      // Kıvılcım Partikülleri
      for (let i = tk.particles.length - 1; i >= 0; i--) {
        const pt = tk.particles[i];
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.25; pt.life--;
        x.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        x.fillStyle = pt.color;
        x.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
        if (pt.life <= 0) tk.particles.splice(i, 1);
      }
      x.globalAlpha = 1;

      // Hasar Yazıları
      for (let i = tk.popups.length - 1; i >= 0; i--) {
        const pp = tk.popups[i];
        pp.y -= 1.2; pp.life--;
        x.globalAlpha = Math.min(1, pp.life / 18);
        x.fillStyle = pp.color; x.font = 'bold 17px monospace';
        x.fillText(pp.text, pp.x - 24, pp.y);
        if (pp.life <= 0) tk.popups.splice(i, 1);
      }
      x.globalAlpha = 1;

      // Tekken Tarzı Gecikmeli Can Barları
      x.fillStyle = 'rgba(9,13,22,0.85)';
      x.fillRect(34, 18, 326, 26); x.fillRect(440, 18, 326, 26);
      // Sol Oyuncu
      x.fillStyle = '#e03131'; x.fillRect(38, 22, tk.p1.dispHp * 3.18, 18);
      const hp1g = x.createLinearGradient(38, 0, 356, 0);
      hp1g.addColorStop(0, '#22b8cf'); hp1g.addColorStop(1, '#51cf66');
      x.fillStyle = hp1g; x.fillRect(38, 22, tk.p1.hp * 3.18, 18);
      // Sağ Boss
      x.fillStyle = '#fcc419'; x.fillRect(762 - tk.p2.dispHp * 3.18, 22, tk.p2.dispHp * 3.18, 18);
      x.fillStyle = '#ff6b6b'; x.fillRect(762 - tk.p2.hp * 3.18, 22, tk.p2.hp * 3.18, 18);
      // VS Rozeti
      x.fillStyle = '#fcc419'; x.font = 'bold 20px monospace'; x.fillText('VS', 387, 37);
      x.fillStyle = '#fff'; x.font = 'bold 11px monospace';
      x.fillText(state.docName.toUpperCase().slice(0, 22), 40, 58);
      x.fillText('ACİL ARENA ŞAMPİYONU', 604, 58);

      if (tk.comboCount >= 2) {
        x.fillStyle = '#fcc419'; x.font = 'bold 24px monospace';
        x.fillText(`${tk.comboCount} HIT COMBO!`, 40, 96);
      }
      if (tk.koTimer > 0) {
        x.fillStyle = 'rgba(9,13,22,0.75)'; x.fillRect(210, 165, 380, 74);
        x.strokeStyle = '#fcc419'; x.lineWidth = 3; x.strokeRect(210, 165, 380, 74);
        x.fillStyle = '#fcc419'; x.font = 'bold 38px monospace';
        x.fillText(tk.p2.hp <= 0 ? 'K.O.! +200₺' : 'YERE SERİLDİN!', 245, 215);
      }

      x.restore();
      document.getElementById('arcadeScore').textContent = `RAUND: ${tk.wins} (+200₺) | SEN: %${tk.p1.hp} vs RAKİP: %${tk.p2.hp} | W: Zıpla • SPACE: Kombo • E: Tekme`;
      arcadeAnimId = requestAnimationFrame(loop);
    }
    loop();
  };

  /* =======================================================================
     3. EA FC 27: GECE STADYUM PROJEKTÖRLERİ, 3D TOP YAYI & KONFETİLİ GOL
     ======================================================================= */
  let hdFifa = null;

  window.triggerFifaPass = function () {
    if (!hdFifa || activeArcadeMode !== 'fifa') return;
    if (hdFifa.ballMode !== 'dribble') return;
    const nextIdx = (hdFifa.activeIdx + 1) % hdFifa.mates.length;
    const target = hdFifa.mates[nextIdx];
    hdFifa.passTargetIdx = nextIdx;
    hdFifa.ballMode = 'pass';
    const ang = Math.atan2(target.y - hdFifa.ball.y, target.x - hdFifa.ball.x);
    hdFifa.ball.vx = Math.cos(ang) * 11;
    hdFifa.ball.vy = Math.sin(ang) * 11;
    hdFifa.ball.vz = 3.2;
    hdFifa.ball.z = 0;
    hdFifa.ball.curve = 0;
    playBlip(440, 'triangle', 0.06);
  };

  window.triggerFifaShot = function () {
    if (!hdFifa || activeArcadeMode !== 'fifa') return;
    if (hdFifa.ballMode !== 'dribble') return;
    hdFifa.ballMode = 'shot';
    hdFifa.shots++;
    playBlip(300, 'triangle', 0.08);
    const targetY = hdFifa.ball.y > 225 ? 172 : 278;
    const ang = Math.atan2(targetY - hdFifa.ball.y, 755 - hdFifa.ball.x);
    hdFifa.ball.vx = Math.cos(ang) * 12;
    hdFifa.ball.vy = Math.sin(ang) * 12;
    hdFifa.ball.vz = 5.4;
    hdFifa.ball.z = 1;
    hdFifa.ball.curve = hdFifa.ball.y > 225 ? -0.06 : 0.06;
  };

  window.syncClientFifaState = function (remoteData) {
    if (!hdFifa) return;
    Object.assign(hdFifa, remoteData);
  };

  function drawHdFootballer(x, px, py, primary, secondary, num, isActive, t) {
    // Yer gölgesi
    x.fillStyle = 'rgba(0,0,0,0.38)';
    x.beginPath(); x.ellipse(px, py + 13, 12, 5, 0, 0, Math.PI * 2); x.fill();

    if (isActive) {
      x.strokeStyle = '#fcc419'; x.lineWidth = 2.5;
      x.beginPath(); x.ellipse(px, py + 13, 16, 7, 0, 0, Math.PI * 2); x.stroke();
      // Üst yön oku
      x.fillStyle = '#fcc419';
      x.beginPath(); x.moveTo(px, py - 24); x.lineTo(px - 5, py - 32); x.lineTo(px + 5, py - 32); x.fill();
    }

    // Koşu bacakları
    const step = Math.sin(t * 0.25 + px * 0.06) * 4;
    x.fillStyle = '#111827';
    x.fillRect(px - 6, py + 6, 4, 8 + step * 0.5);
    x.fillRect(px + 2, py + 6, 4, 8 - step * 0.5);

    // Forma (Yuvarlatılmış + orta şerit + numara)
    x.fillStyle = primary;
    x.beginPath(); x.roundRect(px - 10, py - 11, 20, 20, 4); x.fill();
    x.fillStyle = secondary;
    x.fillRect(px - 10, py - 2, 20, 5);
    x.fillStyle = primary === '#ffffff' ? '#111' : '#fff';
    x.font = 'bold 9px monospace';
    x.fillText(String(num), px - 3, py + 2);

    // Kafa
    x.fillStyle = '#f1c2a5';
    x.beginPath(); x.arc(px, py - 15, 6.5, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#2b1d14';
    x.beginPath(); x.arc(px, py - 17, 6.5, Math.PI, Math.PI * 2); x.fill();
  }

  window.startFifaFull = function (c, x) {
    x.imageSmoothingEnabled = true;
    const oppPrimary = selectedOppTeam.id === selectedMyTeam.id ? selectedOppTeam.away : selectedOppTeam.primary;
    const fs = {
      mates: [{ x: 165, y: 120, num: 7 }, { x: 245, y: 225, num: 9 }, { x: 165, y: 330, num: 10 }],
      activeIdx: 2, passTargetIdx: 2,
      keeper: { x: 734, y: 225, dir: 1 },
      defs: [{ x: 460, y: 150, dir: 1, num: 4 }, { x: 560, y: 295, dir: -1, num: 5 }, { x: 640, y: 210, dir: 1, num: 3 }],
      ball: { x: 179, y: 330, z: 0, vx: 0, vy: 0, vz: 0, curve: 0 },
      ballTrail: [], confetti: [], netRipple: 0,
      ballMode: 'dribble', myGoals: 0, oppGoals: 0, shots: 0, matchFrames: 90 * 40,
      bannerText: '', bannerTimer: 0, t: 0
    };
    hdFifa = fs;

    function kickoff(who) {
      fs.ballMode = 'dribble';
      fs.ball.vx = 0; fs.ball.vy = 0; fs.ball.vz = 0; fs.ball.z = 0; fs.ball.curve = 0;
      fs.ballTrail = [];
      fs.mates[0].x = 180; fs.mates[0].y = 115;
      fs.mates[1].x = 260; fs.mates[1].y = 225;
      fs.mates[2].x = 180; fs.mates[2].y = 335;
      fs.activeIdx = 2; fs.ball.x = fs.mates[2].x + 14; fs.ball.y = fs.mates[2].y;
      if (who === 'me') {
        fs.bannerText = `GOOOOOL! ${selectedMyTeam.name} +150₺`;
        fs.bannerTimer = 80; fs.netRipple = 28;
        for (let i = 0; i < 45; i++) {
          fs.confetti.push({
            x: 750, y: 225,
            vx: -2 - Math.random() * 6, vy: (Math.random() - 0.5) * 9,
            color: i % 2 === 0 ? selectedMyTeam.primary : selectedMyTeam.secondary,
            life: 60 + Math.random() * 35
          });
        }
      } else if (who === 'save') { fs.bannerText = 'KALECİ KURTARDI!'; fs.bannerTimer = 45; }
      else if (who === 'block') { fs.bannerText = 'DEFANS BLOKLADI!'; fs.bannerTimer = 45; }
    }

    function loop() {
      if (activeArcadeMode !== 'fifa') return;
      fs.t++; p2pTick++;

      if (fs.matchFrames > 0) fs.matchFrames--;
      else {
        fs.matchFrames = 90 * 40;
        const winBonus = fs.myGoals > fs.oppGoals ? 300 : 0;
        if (winBonus > 0) { state.money += winBonus; addTx('EA FC 27 Galibiyet Primi', winBonus, 'pos'); updateHud(); saveCareer(); }
        fs.bannerText = `MAÇ BİTTİ (${fs.myGoals}-${fs.oppGoals}) ${winBonus ? '+300₺!' : ''}`;
        fs.bannerTimer = 95; fs.myGoals = 0; fs.oppGoals = 0;
      }

      let ix = arcadeJoyVec.x, iy = arcadeJoyVec.y;
      if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
      if (keys['ArrowRight'] || keys['KeyD']) ix = 1;
      if (keys['ArrowUp'] || keys['KeyW']) iy = -1;
      if (keys['ArrowDown'] || keys['KeyS']) iy = 1;

      if (dataChannel && dataChannel.readyState === 'open' && !isP2PHost && p2pTick % 2 === 0) {
        try { dataChannel.send(JSON.stringify({ type: 'input', data: { x: ix, y: iy } })); } catch (e) {}
      }

      const activeP = fs.mates[fs.activeIdx];
      if (fs.ballMode === 'dribble') {
        activeP.x = Math.max(45, Math.min(715, activeP.x + ix * 4.1));
        activeP.y = Math.max(42, Math.min(408, activeP.y + iy * 4.1));
        fs.ball.x = activeP.x + 14; fs.ball.y = activeP.y; fs.ball.z = 0;
        fs.mates.forEach((m, idx) => {
          if (idx === fs.activeIdx) return;
          const idealX = Math.min(660, activeP.x + (idx === 1 ? 115 : 45));
          m.x += (idealX - m.x) * 0.03;
        });
      } else {
        fs.ballTrail.push({ x: fs.ball.x, y: fs.ball.y - fs.ball.z, life: 12 });
        if (fs.ballTrail.length > 14) fs.ballTrail.shift();
        fs.ball.z = Math.max(0, fs.ball.z + fs.ball.vz);
        fs.ball.vz -= 0.24;
        if (fs.ball.z === 0 && fs.ball.vz < 0) fs.ball.vz *= -0.4;

        if (fs.ballMode === 'pass') {
          fs.ball.x += fs.ball.vx; fs.ball.y += fs.ball.vy;
          const rec = fs.mates[fs.passTargetIdx];
          if (Math.hypot(fs.ball.x - rec.x, fs.ball.y - rec.y) < 20) {
            fs.activeIdx = fs.passTargetIdx; fs.ballMode = 'dribble';
            fs.ball.x = rec.x + 14; fs.ball.y = rec.y; fs.ball.z = 0;
          } else if (fs.ball.x < 30 || fs.ball.x > 760 || fs.ball.y < 25 || fs.ball.y > 425) kickoff(null);
        } else if (fs.ballMode === 'shot') {
          fs.ball.vy += fs.ball.curve; fs.ball.x += fs.ball.vx; fs.ball.y += fs.ball.vy;
          if (Math.abs(fs.ball.x - fs.keeper.x) < 13 && Math.abs(fs.ball.y - fs.keeper.y) < 22) {
            playBlip(180, 'square', 0.08); kickoff('save');
          } else if (fs.defs.some(d => Math.abs(fs.ball.x - d.x) < 12 && Math.abs(fs.ball.y - d.y) < 17 && fs.ball.z < 18)) {
            playBlip(160, 'square', 0.08); kickoff('block');
          } else if (fs.ball.x >= 748) {
            if (fs.ball.y >= 165 && fs.ball.y <= 285) {
              fs.myGoals++; state.money += 150; state.stress = Math.max(0, state.stress - 5);
              addTx('EA FC 27 Gol Primi', 150, 'pos'); updateHud(); saveCareer(); playSfx('coin');
              kickoff('me');
            } else kickoff(null);
          } else if (fs.ball.y < 20 || fs.ball.y > 430) kickoff(null);
        }
      }

      if (dataChannel && dataChannel.readyState === 'open' && isP2PHost) {
        fs.keeper.y = Math.max(175, Math.min(275, fs.keeper.y + remotePlayerInput.y * 4.5));
        fs.defs[2].y = Math.max(80, Math.min(370, fs.defs[2].y + remotePlayerInput.y * 4.0));
      } else {
        fs.keeper.y += fs.keeper.dir * 2.1;
        if (fs.keeper.y > 266 || fs.keeper.y < 184) fs.keeper.dir *= -1;
      }

      fs.defs.forEach((d, idx) => {
        if (idx === 2 && dataChannel && dataChannel.readyState === 'open') return;
        d.y += d.dir * (2.2 + idx * 0.3);
        if (d.y > 365 || d.y < 85) d.dir *= -1;
      });

      if (isP2PHost && dataChannel && dataChannel.readyState === 'open' && p2pTick % 2 === 0) {
        try { dataChannel.send(JSON.stringify({ type: 'state', data: { mates: fs.mates, defs: fs.defs, keeper: fs.keeper, ball: fs.ball, myGoals: fs.myGoals, oppGoals: fs.oppGoals } })); } catch (e) {}
      }

      // STADYUM & ÇİM ÇİZİMİ
      x.fillStyle = '#0f172a'; x.fillRect(0, 0, 800, 450);
      // Tribün taraftar flaşları
      for (let f = 0; f < 14; f++) {
        if ((fs.t + f * 17) % 35 < 3) {
          x.fillStyle = 'rgba(255,255,255,0.75)';
          x.fillRect(40 + f * 52, f % 2 === 0 ? 8 : 438, 3, 3);
        }
      }

      x.fillStyle = '#195c24'; x.fillRect(24, 20, 752, 410);
      x.fillStyle = '#206e2d';
      for (let sx = 24; sx < 776; sx += 76) x.fillRect(sx, 20, 38, 410);

      // Saha çizgileri
      x.strokeStyle = 'rgba(255,255,255,0.88)'; x.lineWidth = 2.5;
      x.strokeRect(32, 26, 718, 398);
      x.beginPath(); x.moveTo(391, 26); x.lineTo(391, 424); x.stroke();
      x.beginPath(); x.arc(391, 225, 52, 0, Math.PI * 2); x.stroke();
      x.strokeRect(610, 115, 140, 220);
      x.strokeRect(700, 165, 50, 120);

      // Dalgalanan Kale Ağı
      if (fs.netRipple > 0) fs.netRipple--;
      const rip = fs.netRipple > 0 ? Math.sin(fs.t * 0.8) * 6 : 0;
      x.fillStyle = 'rgba(255,255,255,0.16)';
      x.beginPath();
      x.moveTo(750, 165); x.lineTo(778 + rip, 169); x.lineTo(778 + rip, 281); x.lineTo(750, 285);
      x.closePath(); x.fill(); x.stroke();

      // Oyuncular & Kaleci
      fs.mates.forEach((m, idx) => drawHdFootballer(x, m.x, m.y, selectedMyTeam.primary, selectedMyTeam.secondary, m.num, idx === fs.activeIdx, fs.t));
      fs.defs.forEach(d => drawHdFootballer(x, d.x, d.y, oppPrimary, selectedOppTeam.secondary, d.num, false, fs.t));
      drawHdFootballer(x, fs.keeper.x, fs.keeper.y, '#fcc419', '#111827', 1, false, fs.t);

      // Plase Şut Hız İzi
      fs.ballTrail.forEach((tr, i) => {
        x.fillStyle = `rgba(252, 196, 25, ${(i / 18).toFixed(2)})`;
        x.beginPath(); x.arc(tr.x, tr.y, 3 + i * 0.2, 0, Math.PI * 2); x.fill();
      });

      // 3D Top Gölgesi & Top
      x.fillStyle = 'rgba(0,0,0,0.42)';
      x.beginPath(); x.ellipse(fs.ball.x, fs.ball.y + 4, 7, 3.5, 0, 0, Math.PI * 2); x.fill();
      const ballScale = 6.5 + fs.ball.z * 0.14;
      x.fillStyle = '#ffffff';
      x.beginPath(); x.arc(fs.ball.x, fs.ball.y - fs.ball.z, ballScale, 0, Math.PI * 2); x.fill();
      x.strokeStyle = '#111'; x.lineWidth = 1.4; x.stroke();

      // 4 Köşe Projektör Işıkları
      [[24, 20], [776, 20], [24, 430], [776, 430]].forEach(([lx, ly]) => {
        const beam = x.createRadialGradient(lx, ly, 10, lx, ly, 230);
        beam.addColorStop(0, 'rgba(255, 255, 240, 0.14)');
        beam.addColorStop(1, 'rgba(255, 255, 240, 0)');
        x.fillStyle = beam;
        x.fillRect(0, 0, 800, 450);
      });

      // Gol Konfetileri
      for (let i = fs.confetti.length - 1; i >= 0; i--) {
        const cf = fs.confetti[i];
        cf.x += cf.vx; cf.y += cf.vy; cf.vx *= 0.96; cf.life--;
        x.fillStyle = cf.color; x.fillRect(cf.x, cf.y, 5, 5);
        if (cf.life <= 0) fs.confetti.splice(i, 1);
      }

      // Yayın Skor Tabelası (TV Broadcast HUD)
      const matchMin = Math.min(90, 90 - Math.floor(fs.matchFrames / 40));
      x.fillStyle = 'rgba(11, 16, 27, 0.92)'; x.fillRect(24, 6, 430, 26);
      x.fillStyle = selectedMyTeam.primary; x.fillRect(24, 6, 8, 26);
      x.fillStyle = oppPrimary; x.fillRect(446, 6, 8, 26);
      x.fillStyle = '#fcc419'; x.font = 'bold 13px monospace';
      x.fillText(`${String(matchMin).padStart(2, '0')}' | ${selectedMyTeam.name} ${fs.myGoals} - ${fs.oppGoals} ${selectedOppTeam.name}`, 40, 24);

      if (fs.bannerTimer > 0) {
        fs.bannerTimer--;
        x.fillStyle = 'rgba(11, 16, 27, 0.92)'; x.fillRect(190, 185, 420, 64);
        x.strokeStyle = '#51cf66'; x.lineWidth = 2.5; x.strokeRect(190, 185, 420, 64);
        x.fillStyle = '#51cf66'; x.font = 'bold 20px monospace';
        x.fillText(fs.bannerText, 212, 224);
      }

      document.getElementById('arcadeScore').textContent = `${matchMin}' | ${selectedMyTeam.name} ${fs.myGoals} - ${fs.oppGoals} ${selectedOppTeam.name} | ŞUT: ${fs.shots}`;
      arcadeAnimId = requestAnimationFrame(loop);
    }
    loop();
  };

  /* =======================================================================
     4. GTA 6: FAR KONİLERİ, POLİS ÇAKARI, NAMLU ALEVİ, DRİFT İZİ & RADAR
     ======================================================================= */
  let hdGtaPlayer = null, hdGtaCar = null;

  window.toggleGtaVehicle = function () {
    if (!hdGtaPlayer || !hdGtaCar) return;
    if (hdGtaPlayer.inCar) {
      hdGtaPlayer.inCar = false;
      hdGtaPlayer.x = hdGtaCar.x + 28;
      hdGtaPlayer.y = hdGtaCar.y;
    } else if (Math.hypot(hdGtaPlayer.x - hdGtaCar.x, hdGtaPlayer.y - hdGtaCar.y) < 58) {
      hdGtaPlayer.inCar = true;
    }
  };

  window.startGta6ThirdPerson = function (c, x) {
    x.imageSmoothingEnabled = true;
    const WORLD_SIZE = 2000;
    const buildings = [];
    const neonColors = ['#f06595', '#3bc9db', '#fcc419', '#b197fc'];
    let bIdx = 0;
    for (let bx = 290; bx < WORLD_SIZE - 200; bx += 400) {
      for (let by = 290; by < WORLD_SIZE - 200; by += 400) {
        buildings.push({ x: bx, y: by, w: 220, h: 220, neon: neonColors[bIdx++ % neonColors.length] });
      }
    }
    function hitsBuilding(px, py, rad) {
      return buildings.some(b => px + rad > b.x && px - rad < b.x + b.w && py + rad > b.y && py - rad < b.y + b.h);
    }

    const player = { x: 235, y: 235, angle: 0, hp: 100, inCar: false, fireCd: 0, muzzleFlash: 0 };
    const car = { x: 235, y: 295, angle: 0, speed: 0 };
    hdGtaPlayer = player; hdGtaCar = car;

    const bullets = [], enemies = [], lootBags = [], skids = [], sparks = [];
    for (let i = 0; i < 12; i++) enemies.push({ x: 235 + (i % 4) * 400 + 30, y: 235 + Math.floor(i / 4) * 400 + 110, hp: 60, shootCd: 70 });
    for (let i = 0; i < 8; i++) lootBags.push({ x: 235 + (i % 4) * 400, y: 235 + ((i * 2) % 4) * 400 });

    let viceCash = 0, kills = 0, stars = 1, wastedTimer = 0, shake = 0, gt = 0;

    function fireWeapon() {
      if (player.fireCd > 0) return;
      player.fireCd = 9; player.muzzleFlash = 4; shake = Math.max(shake, 3);
      playBlip(520, 'sawtooth', 0.05, 0.05);
      const ox = player.inCar ? car.x : player.x, oy = player.inCar ? car.y : player.y;
      const ang = player.inCar ? car.angle : player.angle;
      bullets.push({
        x: ox + Math.cos(ang) * 20, y: oy + Math.sin(ang) * 20,
        vx: Math.cos(ang) * 13, vy: Math.sin(ang) * 13, fromPlayer: true, life: 50
      });
      // Boş kovan partikülü
      sparks.push({
        x: ox, y: oy, vx: Math.cos(ang + 1.5) * 2.5, vy: Math.sin(ang + 1.5) * 2.5,
        life: 24, maxLife: 24, size: 3, color: '#fcc419'
      });
    }

    function loop() {
      if (activeArcadeMode !== 'gta6') return;
      gt++;
      if (shake > 0.3) shake *= 0.84;
      if (player.muzzleFlash > 0) player.muzzleFlash--;

      if (wastedTimer > 0) {
        wastedTimer--;
        x.fillStyle = 'rgba(11, 16, 27, 0.85)'; x.fillRect(0, 0, 800, 450);
        x.fillStyle = '#ff6b6b'; x.font = 'bold 40px monospace';
        x.fillText('WASTED — ACİLE KALDIRILDIN', 100, 225);
        if (wastedTimer === 0) { player.hp = 100; player.x = 235; player.y = 235; player.inCar = false; stars = 1; }
        arcadeAnimId = requestAnimationFrame(loop); return;
      }

      if (player.fireCd > 0) player.fireCd--;
      let ix = arcadeJoyVec.x, iy = arcadeJoyVec.y;
      if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
      if (keys['ArrowRight'] || keys['KeyD']) ix = 1;
      if (keys['ArrowUp'] || keys['KeyW']) iy = -1;
      if (keys['ArrowDown'] || keys['KeyS']) iy = 1;

      if (player.inCar) {
        if (iy < -0.2) car.speed = Math.min(6.6, car.speed + 0.24);
        else if (iy > 0.2) car.speed = Math.max(-2.8, car.speed - 0.24);
        else car.speed *= 0.94;
        if (Math.abs(car.speed) > 0.25 && Math.abs(ix) > 0.15) {
          car.angle += ix * 0.068;
          if (Math.abs(car.speed) > 3.5) {
            skids.push({ x: car.x, y: car.y, life: 90 });
            if (skids.length > 70) skids.shift();
          }
        }
        const nx = Math.max(60, Math.min(WORLD_SIZE - 60, car.x + Math.cos(car.angle) * car.speed));
        const ny = Math.max(60, Math.min(WORLD_SIZE - 60, car.y + Math.sin(car.angle) * car.speed));
        if (!hitsBuilding(nx, ny, 18)) { car.x = nx; car.y = ny; } else { car.speed *= -0.45; shake = 7; }
        player.x = car.x; player.y = car.y; player.angle = car.angle;
      } else {
        const mag = Math.hypot(ix, iy);
        if (mag > 0.15) {
          const vx = (ix / Math.max(1, mag)) * 3.7, vy = (iy / Math.max(1, mag)) * 3.7;
          const nx = Math.max(40, Math.min(WORLD_SIZE - 40, player.x + vx));
          const ny = Math.max(40, Math.min(WORLD_SIZE - 40, player.y + vy));
          if (!hitsBuilding(nx, player.y, 12)) player.x = nx;
          if (!hitsBuilding(player.x, ny, 12)) player.y = ny;
          player.angle = Math.atan2(vy, vx);
        }
      }

      if (keys['Space']) fireWeapon();

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]; b.x += b.vx; b.y += b.vy; b.life--;
        if (b.life <= 0 || hitsBuilding(b.x, b.y, 3)) {
          if (hitsBuilding(b.x, b.y, 3)) spawnSparks(sparks, b.x, b.y, '#fcc419', 5);
          bullets.splice(i, 1); continue;
        }
        if (b.fromPlayer) {
          for (let j = enemies.length - 1; j >= 0; j--) {
            const en = enemies[j];
            if (Math.hypot(b.x - en.x, b.y - en.y) < 18) {
              en.hp -= 30; bullets.splice(i, 1);
              spawnSparks(sparks, en.x, en.y, '#ff6b6b', 8);
              if (en.hp <= 0) {
                spawnSparks(sparks, en.x, en.y, '#ff922b', 22);
                enemies.splice(j, 1); kills++; viceCash += 300; shake = 8;
                stars = Math.min(5, Math.floor(kills / 2) + 1);
                state.money += 120; addTx('GTA 6 Vice Ödülü', 120, 'pos'); updateHud(); saveCareer();
                enemies.push({ x: 235 + (kills % 4) * 400, y: 235 + ((kills + 1) % 4) * 400, hp: 60, shootCd: 75 });
              }
              break;
            }
          }
        } else if (Math.hypot(b.x - player.x, b.y - player.y) < 16) {
          player.hp -= (player.inCar ? 4 : 10); shake = 5; bullets.splice(i, 1);
          if (player.hp <= 0) wastedTimer = 75;
        }
      }

      enemies.forEach(en => {
        const dist = Math.hypot(player.x - en.x, player.y - en.y);
        const ang = Math.atan2(player.y - en.y, player.x - en.x);
        if (dist > 130 && dist < 520) {
          const enx = en.x + Math.cos(ang) * 1.65, eny = en.y + Math.sin(ang) * 1.65;
          if (!hitsBuilding(enx, eny, 12)) { en.x = enx; en.y = eny; }
        }
        if (dist < 340 && --en.shootCd <= 0) {
          en.shootCd = 85;
          bullets.push({ x: en.x + Math.cos(ang) * 14, y: en.y + Math.sin(ang) * 14, vx: Math.cos(ang) * 6.8, vy: Math.sin(ang) * 6.8, fromPlayer: false, life: 60 });
        }
      });

      for (let i = lootBags.length - 1; i >= 0; i--) {
        if (Math.hypot(player.x - lootBags[i].x, player.y - lootBags[i].y) < 26) {
          viceCash += 250; state.money += 100; addTx('GTA 6 Çanta Ganimeti', 100, 'pos'); updateHud(); saveCareer(); playSfx('coin');
          lootBags[i] = { x: 235 + Math.floor(Math.random() * 4) * 400, y: 235 + Math.floor(Math.random() * 4) * 400 };
        }
      }

      // DÜNYA ÇİZİMİ
      const camX = player.x - 400 + (Math.random() - 0.5) * shake;
      const camY = player.y - 225 + (Math.random() - 0.5) * shake;
      x.save(); x.translate(-camX, -camY);

      x.fillStyle = '#18212f'; x.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);
      // Asfalt Bulvarlar + Sarı Kesikli Şeritler
      x.fillStyle = '#0c111d';
      for (let gx = 200; gx < WORLD_SIZE; gx += 400) {
        x.fillRect(gx, 0, 74, WORLD_SIZE);
        x.fillStyle = 'rgba(252,196,25,0.45)';
        for (let y = 0; y < WORLD_SIZE; y += 36) x.fillRect(gx + 35, y, 4, 18);
        x.fillStyle = '#0c111d';
      }
      for (let gy = 200; gy < WORLD_SIZE; gy += 400) {
        x.fillRect(0, gy, WORLD_SIZE, 74);
        x.fillStyle = 'rgba(252,196,25,0.45)';
        for (let bx = 0; bx < WORLD_SIZE; bx += 36) x.fillRect(bx, gy + 35, 18, 4);
        x.fillStyle = '#0c111d';
      }

      // Drift Lastik İzleri
      skids.forEach(sk => {
        sk.life--;
        x.fillStyle = `rgba(0,0,0,${Math.max(0, sk.life / 140)})`;
        x.fillRect(sk.x - 4, sk.y - 4, 8, 8);
      });

      // Neon Binalar & Çatı Detayları
      buildings.forEach(b => {
        x.fillStyle = 'rgba(0,0,0,0.55)'; x.fillRect(b.x + 12, b.y + 12, b.w, b.h);
        x.fillStyle = '#253147'; x.fillRect(b.x, b.y, b.w, b.h);
        x.fillStyle = '#182234'; x.fillRect(b.x + 14, b.y + 14, b.w - 28, b.h - 28);
        x.strokeStyle = b.neon; x.lineWidth = 2.5; x.strokeRect(b.x + 14, b.y + 14, b.w - 28, b.h - 28);
      });

      // Parlayan Para Çantaları
      lootBags.forEach(lb => {
        const g = x.createRadialGradient(lb.x, lb.y, 2, lb.x, lb.y, 26);
        g.addColorStop(0, 'rgba(252, 196, 25, 0.5)'); g.addColorStop(1, 'rgba(252, 196, 25, 0)');
        x.fillStyle = g; x.fillRect(lb.x - 26, lb.y - 26, 52, 52);
        x.fillStyle = '#fcc419'; x.fillRect(lb.x - 10, lb.y - 10, 20, 20);
        x.fillStyle = '#000'; x.font = 'bold 13px monospace'; x.fillText('$', lb.x - 4, lb.y + 5);
      });

      // Spor Araba + İkili Gece Far Konileri
      x.save(); x.translate(car.x, car.y); x.rotate(car.angle);
      const beam = x.createLinearGradient(22, 0, 185, 0);
      beam.addColorStop(0, 'rgba(255, 250, 205, 0.45)');
      beam.addColorStop(1, 'rgba(255, 250, 205, 0)');
      x.fillStyle = beam;
      x.beginPath(); x.moveTo(22, -10); x.lineTo(185, -52); x.lineTo(185, 52); x.lineTo(22, 10); x.fill();
      x.fillStyle = 'rgba(0,0,0,0.45)'; x.fillRect(-20, -11, 44, 26);
      x.fillStyle = '#e03131'; x.beginPath(); x.roundRect(-24, -14, 48, 28, 6); x.fill();
      x.fillStyle = '#38bdf8'; x.fillRect(3, -10, 11, 20);
      x.fillStyle = '#fff'; x.fillRect(21, -11, 3, 5); x.fillRect(21, 6, 3, 5);
      x.restore();

      // Polisler + Kırmızı/Mavi Çakar Parıltısı
      enemies.forEach((en, idx) => {
        const sirenCol = ((Math.floor(gt / 8) + idx) % 2 === 0) ? 'rgba(255,59,59,0.38)' : 'rgba(59,130,246,0.38)';
        const sg = x.createRadialGradient(en.x, en.y, 2, en.x, en.y, 38);
        sg.addColorStop(0, sirenCol); sg.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = sg; x.fillRect(en.x - 38, en.y - 38, 76, 76);
        x.fillStyle = '#1d4ed8'; x.beginPath(); x.arc(en.x, en.y, 11, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#f8f9fa'; x.fillRect(en.x - 5, en.y - 5, 10, 10);
        x.fillStyle = '#ef4444'; x.fillRect(en.x - 14, en.y - 20, (en.hp / 60) * 28, 3);
      });

      // Yaya Oyuncu + Silah + Namlu Alevi
      if (!player.inCar) {
        x.save(); x.translate(player.x, player.y); x.rotate(player.angle);
        x.fillStyle = 'rgba(0,0,0,0.4)'; x.beginPath(); x.arc(2, 2, 13, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#10b981'; x.beginPath(); x.roundRect(-10, -13, 20, 26, 6); x.fill();
        x.fillStyle = '#f1c2a5'; x.beginPath(); x.arc(0, 0, 7, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#111827'; x.fillRect(5, 3, 19, 5);
        if (player.muzzleFlash > 0) {
          x.fillStyle = '#fcc419';
          x.beginPath(); x.moveTo(24, 5); x.lineTo(42, -3); x.lineTo(42, 13); x.fill();
        }
        x.restore();
      }

      // İzli Mermiler & Kıvılcımlar
      bullets.forEach(b => {
        x.strokeStyle = b.fromPlayer ? '#fcc419' : '#ff6b6b'; x.lineWidth = 3;
        x.beginPath(); x.moveTo(b.x, b.y); x.lineTo(b.x - b.vx * 1.4, b.y - b.vy * 1.4); x.stroke();
      });
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i]; sp.x += sp.vx; sp.y += sp.vy; sp.life--;
        x.fillStyle = sp.color; x.fillRect(sp.x, sp.y, sp.size, sp.size);
        if (sp.life <= 0) sparks.splice(i, 1);
      }
      x.restore();

      // Üst Sol HUD
      x.fillStyle = 'rgba(9,13,22,0.85)'; x.fillRect(14, 14, 214, 48);
      x.fillStyle = '#51cf66'; x.fillRect(22, 22, (player.hp / 100) * 198, 11);
      x.fillStyle = '#fcc419'; x.font = 'bold 12px monospace';
      x.fillText(`VICE $${viceCash}  ${'★'.repeat(stars)}`, 22, 50);

      if (!player.inCar && Math.hypot(player.x - car.x, player.y - car.y) < 58) {
        x.fillStyle = '#3bc9db'; x.font = 'bold 13px monospace';
        x.fillText('[E veya SARI TUŞ: ARABAYA BİN]', 255, 34);
      }

      // Sağ Üst Canlı GTA Radar Haritası
      const rx = 730, ry = 70, rr = 52;
      x.save();
      x.beginPath(); x.arc(rx, ry, rr, 0, Math.PI * 2); x.fillStyle = 'rgba(9, 13, 22, 0.85)'; x.fill();
      x.strokeStyle = '#3bc9db'; x.lineWidth = 2.5; x.stroke();
      x.clip();
      const mapScale = rr / 650;
      lootBags.forEach(lb => {
        x.fillStyle = '#fcc419'; x.fillRect(rx + (lb.x - player.x) * mapScale - 2, ry + (lb.y - player.y) * mapScale - 2, 4, 4);
      });
      enemies.forEach(en => {
        x.fillStyle = '#ff6b6b'; x.fillRect(rx + (en.x - player.x) * mapScale - 2, ry + (en.y - player.y) * mapScale - 2, 4, 4);
      });
      x.fillStyle = '#38bdf8'; x.fillRect(rx + (car.x - player.x) * mapScale - 3, ry + (car.y - player.y) * mapScale - 3, 6, 6);
      x.fillStyle = '#51cf66'; x.beginPath(); x.arc(rx, ry, 4, 0, Math.PI * 2); x.fill();
      x.restore();

      document.getElementById('arcadeScore').textContent = `CAN: %${player.hp} | LEŞ: ${kills} | VICE $${viceCash} (+120₺/Leş) | ${'★'.repeat(stars)}`;
      arcadeAnimId = requestAnimationFrame(loop);
    }
    loop();
  };

  /* =======================================================================
     5. NEED FOR SPEED: 3D PERSPEKTİF GECE OTOYOLU, NİTRO & MAKAS BONUSU
     ======================================================================= */
  window.startNfsNightRace = function (c, x) {
    x.imageSmoothingEnabled = true;
    let laneX = 0; // -1 (sol) ... +1 (sağ)
    let speed = 0.022, score = 0, nextReward = 500, nitro = 100, roadPhase = 0, crashFlash = 0, shake = 0, makasTimer = 0;
    const horizonY = 175;

    const traffic = [];
    for (let i = 0; i < 6; i++) {
      traffic.push({
        lane: [-0.72, -0.24, 0.24, 0.72][i % 4],
        z: 0.15 + i * 0.18, // 0.02 ufuk -> 1.0 oyuncu
        color: ['#ff6b6b', '#fcc419', '#3bc9db', '#b197fc'][i % 4],
        passed: false
      });
    }

    function loop() {
      if (activeArcadeMode !== 'nfs') return;
      if (shake > 0.3) shake *= 0.85;

      let ix = arcadeJoyVec.x;
      if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
      if (keys['ArrowRight'] || keys['KeyD']) ix = 1;

      const boosting = keys['Space'] && nitro > 2;
      if (boosting) { speed = 0.042; nitro = Math.max(0, nitro - 0.75); }
      else { speed = 0.022; nitro = Math.min(100, nitro + 0.25); }

      laneX = Math.max(-0.92, Math.min(0.92, laneX + ix * 0.042));
      roadPhase = (roadPhase + speed * 4) % 1;
      score += Math.round(speed * 180);

      if (score >= nextReward) {
        nextReward += 500; state.money += 100;
        addTx('NFS Gece Yarışı Primi', 100, 'pos'); updateHud(); saveCareer(); playSfx('coin');
      }

      x.save();
      if (shake > 0.5) x.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      // Synthwave Gece Gökyüzü & Ufuk Parıltısı
      const sky = x.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, '#070b16'); sky.addColorStop(0.65, '#191438'); sky.addColorStop(1, '#4c1d95');
      x.fillStyle = sky; x.fillRect(0, 0, 800, horizonY);
      x.fillStyle = '#fcc419'; x.beginPath(); x.arc(400, 128, 34, 0, Math.PI * 2); x.fill();

      // Şehir Silueti
      x.fillStyle = '#0f172a';
      for (let i = 0; i < 20; i++) {
        const bh = 22 + ((i * 29) % 48);
        x.fillRect(i * 42, horizonY - bh, 36, bh);
      }

      // Zemin (Karanlık Gece Ovası)
      x.fillStyle = crashFlash > 0 ? '#3b0d14' : '#0b101d';
      if (crashFlash > 0) crashFlash--;
      x.fillRect(0, horizonY, 800, 450 - horizonY);

      // 3D Perspektif Otoyol Yamuğu
      const topW = 86, botW = 680;
      x.fillStyle = '#182234';
      x.beginPath();
      x.moveTo(400 - topW / 2, horizonY);
      x.lineTo(400 + topW / 2, horizonY);
      x.lineTo(400 + botW / 2, 450);
      x.lineTo(400 - botW / 2, 450);
      x.closePath(); x.fill();

      // Perspektif Yol Şeritleri & Yan Neon Bordürler
      for (let s = 0; s < 14; s++) {
        const z1 = Math.pow((s + roadPhase) / 14, 1.85);
        const z2 = Math.pow((s + roadPhase + 0.5) / 14, 1.85);
        const y1 = horizonY + z1 * (450 - horizonY);
        const y2 = horizonY + z2 * (450 - horizonY);
        const w1 = topW + z1 * (botW - topW);
        const w2 = topW + z2 * (botW - topW);

        // Yan bordür (Kırmızı / Beyaz)
        x.fillStyle = s % 2 === 0 ? '#e03131' : '#f8f9fa';
        x.fillRect(400 - w1 / 2 - 6 * z1, y1, 6 * z1 + 2, Math.max(2, y2 - y1));
        x.fillRect(400 + w1 / 2, y1, 6 * z1 + 2, Math.max(2, y2 - y1));

        // 3 İç Şerit Çizgisi
        x.fillStyle = 'rgba(255,255,255,0.75)';
        [-0.5, 0, 0.5].forEach(frac => {
          const lx = 400 + frac * (w1 / 2);
          x.fillRect(lx - 1.5, y1, 2 + z1 * 3, Math.max(2, (y2 - y1) * 0.7));
        });
      }

      // 3D Yaklaşan Trafik Arabaları (Ufuktan büyüyerek gelir)
      traffic.sort((a, b) => a.z - b.z);
      traffic.forEach(t => {
        t.z += speed * 0.82;
        if (t.z > 1.15) {
          t.z = 0.04;
          t.lane = [-0.72, -0.24, 0.24, 0.72][Math.floor(Math.random() * 4)];
          t.passed = false;
        }
        const zp = Math.pow(t.z, 1.7);
        const ty = horizonY + zp * (450 - horizonY);
        const roadW = topW + zp * (botW - topW);
        const tx = 400 + t.lane * (roadW * 0.42);
        const cw = 10 + zp * 66;
        const ch = 6 + zp * 38;

        x.fillStyle = 'rgba(0,0,0,0.45)'; x.fillRect(tx - cw / 2 + 2, ty - 2, cw, 6);
        x.fillStyle = t.color; x.beginPath(); x.roundRect(tx - cw / 2, ty - ch, cw, ch, 4); x.fill();
        x.fillStyle = '#0f172a'; x.fillRect(tx - cw * 0.36, ty - ch * 0.82, cw * 0.72, ch * 0.32);
        // Parlayan arka stop lambaları
        x.fillStyle = '#ff3b3b';
        x.fillRect(tx - cw * 0.44, ty - ch * 0.34, cw * 0.18, ch * 0.18);
        x.fillRect(tx + cw * 0.26, ty - ch * 0.34, cw * 0.18, ch * 0.18);

        // Çarpışma & Makas Bonusu
        if (t.z > 0.84 && t.z < 0.98) {
          const dLane = Math.abs(t.lane - laneX);
          if (dLane < 0.24) {
            score = Math.max(0, score - 150); crashFlash = 14; shake = 12;
            t.z = 0.04; playBlip(140, 'sawtooth', 0.12);
          } else if (dLane < 0.46 && !t.passed) {
            t.passed = true; makasTimer = 40; score += 85; state.money += 25;
            updateHud(); playBlip(820, 'triangle', 0.06);
          }
        }
      });

      // Nitro Hız Çizgileri
      if (boosting) {
        x.strokeStyle = 'rgba(59, 201, 219, 0.55)'; x.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2 + roadPhase;
          x.beginPath();
          x.moveTo(400 + Math.cos(ang) * 210, 225 + Math.sin(ang) * 120);
          x.lineTo(400 + Math.cos(ang) * 440, 225 + Math.sin(ang) * 260);
          x.stroke();
        }
      }

      // Oyuncu Süper Spor Arabası (Arka 3D Perspektif + Viraj Yatışı)
      const px = 400 + laneX * 265;
      const py = 404;
      x.save();
      x.translate(px, py);
      x.rotate(ix * 0.07);
      x.fillStyle = 'rgba(0,0,0,0.55)'; x.beginPath(); x.ellipse(0, 12, 46, 11, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#51cf66'; x.beginPath(); x.roundRect(-40, -28, 80, 36, 8); x.fill();
      x.fillStyle = '#0f172a'; x.beginPath(); x.roundRect(-28, -42, 56, 20, 6); x.fill();
      x.fillStyle = '#38bdf8'; x.fillRect(-24, -38, 48, 12);
      // Arka difüzör, spoiler ve LED stoplar
      x.fillStyle = '#111827'; x.fillRect(-44, -34, 88, 5);
      x.fillStyle = '#ff3b3b'; x.fillRect(-36, -16, 20, 7); x.fillRect(16, -16, 20, 7);
      if (boosting) {
        x.fillStyle = '#3bc9db';
        x.beginPath(); x.arc(-18, 10, 8 + Math.random() * 6, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(18, 10, 8 + Math.random() * 6, 0, Math.PI * 2); x.fill();
      }
      x.restore();

      if (makasTimer > 0) {
        makasTimer--;
        x.fillStyle = '#fcc419'; x.font = 'bold 26px monospace';
        x.fillText('⚡ MAKAS! +25₺', 295, 92);
      }

      x.restore();
      const kmh = Math.round(speed * 7200);
      document.getElementById('arcadeScore').textContent = `HIZ: ${kmh} KM/S | SKOR: ${score} (Ödül: ${nextReward}) | NİTRO: %${Math.round(nitro)}`;
      arcadeAnimId = requestAnimationFrame(loop);
    }
    loop();
  };
})();
