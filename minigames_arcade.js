/* ================= MINIGAMES_ARCADE.JS — GTA 6 & EA FC 27 TAM EKRAN ================= */
let activeArcadeMode = null;
let arcadeAnimId = null;
const arcadeKeys = {};

window.addEventListener('keydown', e => {
  arcadeKeys[e.code] = true;
  if (e.code === 'KeyF' && document.getElementById('consoleOverlay').classList.contains('open')) {
    toggleBrowserFullscreen();
  }
});
window.addEventListener('keyup', e => { arcadeKeys[e.code] = false; });

function openConsole(defaultGame = 'gta6') {
  document.getElementById('consoleOverlay').classList.add('open');
  launchConsoleGame(defaultGame);
}

function closeConsole() {
  if (arcadeAnimId) { cancelAnimationFrame(arcadeAnimId); arcadeAnimId = null; }
  activeArcadeMode = null;
  document.getElementById('consoleOverlay').classList.remove('open');
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

function toggleBrowserFullscreen() {
  const el = document.getElementById('consoleOverlay');
  if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
  else document.exitFullscreen().catch(() => {});
}

function launchConsoleGame(mode) {
  if (arcadeAnimId) { cancelAnimationFrame(arcadeAnimId); arcadeAnimId = null; }
  activeArcadeMode = mode;
  const c = document.getElementById('arcadeCanvas');
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  if (mode === 'gta6') {
    document.getElementById('consoleTitle').textContent = '🚗 GTA 6: AYDIN VICE — MİKRO AÇIK DÜNYA (16-BIT)';
    document.getElementById('arcadeHelp').textContent = 'WASD / Yön Tuşları: Sür | SPACE: El Freni & Nitro | Sarı Paketleri Topla, Polisten Kaç!';
    startGta6Mini(c, ctx);
  } else {
    document.getElementById('consoleTitle').textContent = '⚽ EA FC 27: KANAT FORVET MODU (16-BIT)';
    document.getElementById('arcadeHelp').textContent = 'WASD / Yön Tuşları: Kanattan Kat Et | SPACE: Plase Şut Çek | 3 Gol At Maçı Kazan!';
    startFifaMini(c, ctx);
  }
}

/* --- MİKRO GTA 6 (640x360 PİKSEL) --- */
function startGta6Mini(c, x) {
  const car = { x: 320, y: 180, angle: 0, speed: 0 };
  const cops = [
    { x: 90, y: 80, speed: 1.55 },
    { x: 540, y: 290, speed: 1.75 }
  ];
  let packageItem = { x: 480, y: 110 };
  let cash = 0, stars = 1, bustedTimer = 0;

  function loop() {
    if (activeArcadeMode !== 'gta6') return;

    if (bustedTimer > 0) {
      bustedTimer--;
      x.fillStyle = 'rgba(15, 23, 42, 0.85)'; x.fillRect(0, 0, 640, 360);
      x.fillStyle = '#ff6b6b'; x.font = 'bold 28px monospace';
      x.fillText('YAKALANDIN! (BUSTED)', 170, 175);
      x.fillStyle = '#fff'; x.font = 'bold 14px monospace';
      x.fillText('Hastane nöbetine yeniden doğuluyor...', 185, 205);
      if (bustedTimer === 0) { car.x = 320; car.y = 180; car.speed = 0; stars = 1; }
      arcadeAnimId = requestAnimationFrame(loop);
      return;
    }

    // Kontroller
    if (arcadeKeys['ArrowUp'] || arcadeKeys['KeyW']) car.speed = Math.min(4.4, car.speed + 0.16);
    else if (arcadeKeys['ArrowDown'] || arcadeKeys['KeyS']) car.speed = Math.max(-2.2, car.speed - 0.16);
    else car.speed *= 0.94;

    if (arcadeKeys['Space']) car.speed *= 0.88;
    if (Math.abs(car.speed) > 0.2) {
      if (arcadeKeys['ArrowLeft'] || arcadeKeys['KeyA']) car.angle -= 0.065;
      if (arcadeKeys['ArrowRight'] || arcadeKeys['KeyD']) car.angle += 0.065;
    }

    car.x = Math.max(20, Math.min(620, car.x + Math.cos(car.angle) * car.speed));
    car.y = Math.max(20, Math.min(340, car.y + Math.sin(car.angle) * car.speed));

    // Paket Toplama
    if (Math.hypot(car.x - packageItem.x, car.y - packageItem.y) < 24) {
      cash += 250;
      stars = Math.min(5, stars + 1);
      state.money += 100;
      updateHud();
      packageItem = { x: 60 + Math.random() * 520, y: 50 + Math.random() * 260 };
      document.getElementById('arcadeScore').textContent = `VICE CASH: $${cash} (+100₺ Gerçek Hesap!) | ARANMA: ${'★'.repeat(stars)}`;
    }

    // Şehir Haritası Çizimi
    x.fillStyle = '#1e293b'; x.fillRect(0, 0, 640, 360);
    // Asfalt Yollar
    x.fillStyle = '#0f172a';
    x.fillRect(0, 155, 640, 50);
    x.fillRect(295, 0, 50, 360);
    // Yol Şeritleri
    x.fillStyle = '#fcc419';
    for (let i = 0; i < 640; i += 28) x.fillRect(i, 179, 14, 2);
    for (let j = 0; j < 360; j += 28) x.fillRect(319, j, 2, 14);
    // Binalar & Palmiyeler
    x.fillStyle = '#334155'; x.fillRect(40, 30, 180, 95);
    x.fillStyle = '#4c1d95'; x.fillRect(410, 30, 180, 95);
    x.fillStyle = '#065f46'; x.fillRect(40, 235, 180, 95);
    x.fillStyle = '#7c2d12'; x.fillRect(410, 235, 180, 95);

    // Görev Paketi
    x.fillStyle = '#fcc419';
    x.fillRect(packageItem.x - 8, packageItem.y - 8, 16, 16);
    x.fillStyle = '#000'; x.font = 'bold 11px monospace';
    x.fillText('$', packageItem.x - 3, packageItem.y + 4);

    // Polis Kovalamacası
    cops.forEach((cp, idx) => {
      const ang = Math.atan2(car.y - cp.y, car.x - cp.x);
      cp.x += Math.cos(ang) * (cp.speed + stars * 0.14);
      cp.y += Math.sin(ang) * (cp.speed + stars * 0.14);
      x.fillStyle = '#ffffff'; x.fillRect(cp.x - 10, cp.y - 7, 20, 14);
      x.fillStyle = (Math.floor(Date.now() / 120) + idx) % 2 === 0 ? '#ef4444' : '#3b82f6';
      x.fillRect(cp.x - 4, cp.y - 3, 8, 6);

      if (Math.hypot(car.x - cp.x, car.y - cp.y) < 18) {
        bustedTimer = 90;
      }
    });

    // Oyuncu Spor Aracı
    x.save();
    x.translate(car.x, car.y);
    x.rotate(car.angle);
    x.fillStyle = '#ff6b6b'; x.fillRect(-13, -8, 26, 16);
    x.fillStyle = '#38bdf8'; x.fillRect(2, -6, 6, 12);
    x.restore();

    // HUD Yıldızları
    x.fillStyle = '#fcc419'; x.font = 'bold 15px monospace';
    x.fillText(`ARANMA: ${'★'.repeat(stars)}`, 480, 24);

    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* --- MİKRO EA FC 27: KANAT FORVET MODU (640x360 PİKSEL) --- */
function startFifaMini(c, x) {
  const player = { x: 110, y: 270 };
  const keeper = { x: 585, y: 180, dir: 1 };
  const defender = { x: 430, y: 160, dir: 1 };
  const ball = { x: 124, y: 270, vx: 0, vy: 0, shot: false };
  let goals = 0, shots = 0;

  function loop() {
    if (activeArcadeMode !== 'fifa') return;

    // Kanat Forvet Hareketi
    if (!ball.shot) {
      if (arcadeKeys['ArrowUp'] || arcadeKeys['KeyW']) player.y = Math.max(40, player.y - 3.2);
      if (arcadeKeys['ArrowDown'] || arcadeKeys['KeyS']) player.y = Math.min(320, player.y + 3.2);
      if (arcadeKeys['ArrowLeft'] || arcadeKeys['KeyA']) player.x = Math.max(40, player.x - 3.2);
      if (arcadeKeys['ArrowRight'] || arcadeKeys['KeyD']) player.x = Math.min(540, player.x + 3.2);
      ball.x = player.x + 12;
      ball.y = player.y;

      // Kanattan içeri kat edip plase şut (SPACE)
      if (arcadeKeys['Space']) {
        ball.shot = true;
        shots++;
        const targetY = player.y > 180 ? 152 : 208; // Uzak köşeye falsolu plase!
        const ang = Math.atan2(targetY - ball.y, 600 - ball.x);
        ball.vx = Math.cos(ang) * 7.8;
        ball.vy = Math.sin(ang) * 7.8;
      }
    } else {
      ball.x += ball.vx;
      ball.y += ball.vy;
      // Kaleci kurtarışı kontrolü
      if (Math.abs(ball.x - keeper.x) < 12 && Math.abs(ball.y - keeper.y) < 22) {
        ball.shot = false; player.x = 110; player.y = 270;
      }
      // Defans müdahalesi
      if (Math.abs(ball.x - defender.x) < 12 && Math.abs(ball.y - defender.y) < 18) {
        ball.shot = false; player.x = 110; player.y = 270;
      }
      // Gol kontrolü
      if (ball.x >= 596) {
        if (ball.y >= 132 && ball.y <= 228) {
          goals++;
          state.money += 150;
          state.stress = Math.max(0, state.stress - 5);
          updateHud();
          document.getElementById('arcadeScore').textContent = `GOL: ${goals} / ŞUT: ${shots} (+150₺ Maç Primi!)`;
        }
        ball.shot = false; player.x = 110; player.y = 270;
      }
    }

    // Kaleci & Stoper Yapay Zekası
    keeper.y += keeper.dir * 2.1;
    if (keeper.y > 215 || keeper.y < 145) keeper.dir *= -1;
    defender.y += defender.dir * 2.5;
    if (defender.y > 290 || defender.y < 70) defender.dir *= -1;

    // Çim Saha Çizimi
    x.fillStyle = '#1b5e20'; x.fillRect(0, 0, 640, 360);
    x.fillStyle = '#2e7d32';
    for (let sx = 0; sx < 640; sx += 64) x.fillRect(sx, 0, 32, 360);

    // Saha Çizgileri & Ceza Sahası
    x.strokeStyle = '#ffffff'; x.lineWidth = 2;
    x.strokeRect(24, 20, 576, 320);
    x.strokeRect(480, 90, 120, 180);
    // Kale
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.fillRect(600, 132, 22, 96);
    x.strokeRect(600, 132, 22, 96);

    // Oyuncu (Kanat Forvet)
    x.fillStyle = '#e03131'; x.fillRect(player.x - 8, player.y - 10, 16, 20);
    x.fillStyle = '#fcc419'; x.fillRect(player.x - 6, player.y - 16, 12, 6);

    // Defans & Kaleci
    x.fillStyle = '#1971c2'; x.fillRect(defender.x - 8, defender.y - 10, 16, 20);
    x.fillStyle = '#fcc419'; x.fillRect(keeper.x - 8, keeper.y - 12, 16, 24);

    // Top
    x.fillStyle = '#ffffff';
    x.beginPath(); x.arc(ball.x, ball.y, 5, 0, Math.PI * 2); x.fill();

    // Skor Tabelası
    x.fillStyle = '#0f172a'; x.fillRect(24, 4, 210, 22);
    x.fillStyle = '#fcc419'; x.font = 'bold 12px monospace';
    x.fillText(`AYDIN FC ${goals} - 0 RAKİP`, 34, 19);

    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}
