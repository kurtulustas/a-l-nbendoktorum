/* ================= CONSOLE_ONLINE.JS — AÇIK DÜNYA, JOYSTICK, ONLINE P2P & 4 PS5 OYUNU ================= */

const keys = {};
const worldJoyVec = { x: 0, y: 0 };
const arcadeJoyVec = { x: 0, y: 0 };

function isTypingInField() {
  const tag = document.activeElement?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

window.addEventListener('blur', () => {
  Object.keys(keys).forEach(k => keys[k] = false);
  worldJoyVec.x = 0; worldJoyVec.y = 0;
  arcadeJoyVec.x = 0; arcadeJoyVec.y = 0;
});

window.addEventListener('keydown', e => {
  if (isTypingInField()) return;
  const consoleOpen = document.getElementById('consoleOverlay').classList.contains('open');
  if (consoleOpen || state.location === 'world') {
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
  }
  keys[e.code] = true;
  if (e.repeat) return;

  if (e.code === 'KeyF' && consoleOpen) toggleBrowserFullscreen();
  if (e.code === 'KeyE') {
    if (activeArcadeMode === 'gta6') toggleGtaVehicle();
    else if (activeArcadeMode === 'fifa') triggerFifaPass();
    else if (activeArcadeMode === 'tekken') triggerTekkenKick();
  }
  if (e.code === 'Space') {
    if (activeArcadeMode === 'fifa') triggerFifaShot();
    else if (activeArcadeMode === 'tekken') triggerTekkenPunch();
  }
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function bindVirtualJoystick(baseId, knobId, targetVec) {
  const base = document.getElementById(baseId);
  const knob = document.getElementById(knobId);
  if (!base || !knob) return;
  let activeId = null;

  function updateStick(clientX, clientY) {
    const r = base.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const maxR = r.width / 2 - 16;
    let dx = clientX - cx, dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    targetVec.x = dx / maxR; targetVec.y = dy / maxR;
  }

  function resetStick() {
    activeId = null;
    knob.style.transform = 'translate(0px, 0px)';
    targetVec.x = 0; targetVec.y = 0;
  }

  base.addEventListener('pointerdown', e => {
    e.preventDefault(); base.setPointerCapture(e.pointerId);
    activeId = e.pointerId; updateStick(e.clientX, e.clientY);
  });
  base.addEventListener('pointermove', e => { if (e.pointerId === activeId) updateStick(e.clientX, e.clientY); });
  base.addEventListener('pointerup', e => { if (e.pointerId === activeId) resetStick(); });
  base.addEventListener('pointercancel', resetStick);
}

bindVirtualJoystick('worldJoyWrap', 'worldJoyKnob', worldJoyVec);
bindVirtualJoystick('arcadeJoyBase', 'arcadeJoyKnob', arcadeJoyVec);

const padPrimary = document.getElementById('btnPadPrimary');
if (padPrimary) {
  padPrimary.addEventListener('pointerdown', e => {
    e.preventDefault(); keys['Space'] = true;
    if (activeArcadeMode === 'fifa') triggerFifaShot();
    if (activeArcadeMode === 'tekken') triggerTekkenPunch();
  });
  padPrimary.addEventListener('pointerup', e => { e.preventDefault(); keys['Space'] = false; });
  padPrimary.addEventListener('pointercancel', () => { keys['Space'] = false; });
}

const padSecondary = document.getElementById('btnPadSecondary');
if (padSecondary) {
  padSecondary.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (activeArcadeMode === 'gta6') toggleGtaVehicle();
    else if (activeArcadeMode === 'fifa') triggerFifaPass();
    else if (activeArcadeMode === 'tekken') triggerTekkenKick();
  });
}

/* ================= AÇIK DÜNYA HARİTA HAREKETİ ================= */
function enterOpenWorld() {
  state.location = 'world';
  closeDrawer();
  document.getElementById('zoomHint').style.display = 'none';
  document.getElementById('worldJoyWrap').style.display = 'block';
  document.getElementById('sceneTag').textContent = 'AYDIN AÇIK DÜNYA — JOYSTICK / WASD İLE GEZ';
  say('AÇIK DÜNYA ŞEHİR HARİTASI', 'Joystick veya WASD ile Aydın sokaklarında yürü ya da arabanı sür!\n• 🕹️ İnternet Kafe: 150₺ ile 4 Konsol Oyunu + Online P2P\n• 🖥️ PS5 & Monitör Mağazası: Evin için satın al\n• 🏠 Evim: Kendi sisteminle sınırsız oyna', 'KEŞİF', 't-green', 340);
  const p = document.getElementById('subPanel'); p.innerHTML = '';
  addChoice(p, '🕹️ İnternet Kafeye Gir (150₺ Saatlik PS5 & Online)', () => goLocation('icafe'));
  addChoice(p, '🖥️ Teknoloji Mağazasına Git (PS5 & Monitör Al)', () => goLocation('tech'), 'purple');
  addChoice(p, '🏠 Evime Git', () => goLocation('home'));
  addChoice(p, '🏥 Hastane Polikliniğine Dön', () => nextPatient(), 'success');
}

function updateOpenWorld() {
  const wp = state.worldPlayer;
  const spd = state.assets.car !== 'Yok (Belediye Otobüsü)' ? 2.5 : 1.6;
  let mx = worldJoyVec.x, my = worldJoyVec.y;
  if (keys['ArrowUp'] || keys['KeyW']) my = -1;
  if (keys['ArrowDown'] || keys['KeyS']) my = 1;
  if (keys['ArrowLeft'] || keys['KeyA']) mx = -1;
  if (keys['ArrowRight'] || keys['KeyD']) mx = 1;

  wp.x = Math.max(12, Math.min(466, wp.x + mx * spd));
  wp.y = Math.max(12, Math.min(166, wp.y + my * spd));

  for (const b of WORLD_BUILDINGS) {
    if (wp.x > b.x && wp.x < b.x + b.w && wp.y > b.y && wp.y < b.y + b.h) {
      wp.y += (wp.y < 90 ? 18 : -18);
      worldJoyVec.x = 0; worldJoyVec.y = 0;
      document.getElementById('worldJoyWrap').style.display = 'none';
      if (b.id === 'er') nextPatient();
      else goLocation(b.id);
      break;
    }
  }
}

/* ================= ONLINE WEBRTC P2P ARKADAŞ DAVET ================= */
let peerConn = null, dataChannel = null, isP2PHost = false, p2pTick = 0;
let remotePlayerInput = { x: 0, y: 0 };

function openOnlineInviteModal() { document.getElementById('onlineInviteModal').classList.add('show'); }
function closeOnlineInviteModal() { document.getElementById('onlineInviteModal').classList.remove('show'); }

function setupDataChannel(dc) {
  dataChannel = dc;
  dc.onopen = () => {
    document.getElementById('p2pStatus').textContent = 'DURUM: BAĞLANDI! (2 Oyunculu Online Aktif ✓)';
    document.getElementById('p2pStatus').style.color = '#51cf66';
    playSfx('coin');
  };
  dc.onmessage = ev => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'input') remotePlayerInput = msg.data;
      else if (msg.type === 'state' && !isP2PHost && activeArcadeMode === 'fifa') syncClientFifaState(msg.data);
    } catch (e) {}
  };
}

async function createP2PHostOffer() {
  isP2PHost = true;
  document.getElementById('p2pStatus').textContent = 'Oda kodu oluşturuluyor...';
  peerConn = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  setupDataChannel(peerConn.createDataChannel('gameRoom'));
  peerConn.onicecandidate = e => {
    if (!e.candidate) {
      const token = btoa(JSON.stringify({ role: 'offer', sdp: peerConn.localDescription }));
      document.getElementById('p2pLocalCode').value = token;
      document.getElementById('p2pStatus').textContent = 'Kod hazır! Kopyalayıp arkadaşına gönder, cevabını aşağı yapıştır.';
    }
  };
  const offer = await peerConn.createOffer();
  await peerConn.setLocalDescription(offer);
}

async function acceptP2PRemoteCode() {
  const raw = document.getElementById('p2pRemoteCode').value.trim();
  if (!raw) { alert('Önce arkadaşından gelen kodu yapıştır!'); return; }
  try {
    const parsed = JSON.parse(atob(raw));
    if (parsed.role === 'offer') {
      isP2PHost = false;
      peerConn = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      peerConn.ondatachannel = ev => setupDataChannel(ev.channel);
      peerConn.onicecandidate = e => {
        if (!e.candidate) {
          const ansToken = btoa(JSON.stringify({ role: 'answer', sdp: peerConn.localDescription }));
          document.getElementById('p2pLocalCode').value = ansToken;
          document.getElementById('p2pStatus').textContent = 'Cevap kodu oluştu! Kopyalayıp odayı kuran arkadaşına gönder.';
        }
      };
      await peerConn.setRemoteDescription(new RTCSessionDescription(parsed.sdp));
      const answer = await peerConn.createAnswer();
      await peerConn.setLocalDescription(answer);
    } else if (parsed.role === 'answer' && peerConn) {
      await peerConn.setRemoteDescription(new RTCSessionDescription(parsed.sdp));
      document.getElementById('p2pStatus').textContent = 'Bağlantı kuruluyor...';
    }
  } catch (e) { alert('Geçersiz davet kodu!'); }
}

function copyInviteCode() {
  const txt = document.getElementById('p2pLocalCode').value;
  if (!txt) return;
  navigator.clipboard?.writeText(txt);
  alert('Davet kodu panoya kopyalandı!');
}

/* ================= KONSOL YÖNETİMİ & TAKIM SEÇİMİ ================= */
let activeArcadeMode = null, arcadeIsCafeSession = false, arcadeAnimId = null;

function openConsole(defaultGame = 'fifa', isCafe = false) {
  closeDrawer();
  arcadeIsCafeSession = isCafe;
  document.getElementById('consoleOverlay').classList.add('open');
  if (defaultGame === 'fifa') openTeamSelectModal();
  else launchConsoleGame(defaultGame);
}

function switchConsoleGame(mode) {
  if (!arcadeIsCafeSession && (!state.assets.hasPs5 || !state.assets.hasMonitor)) {
    alert('Evde PS5 ve Monitör kurulu değil!'); return;
  }
  launchConsoleGame(mode);
}

function closeConsole() {
  if (arcadeAnimId) { cancelAnimationFrame(arcadeAnimId); arcadeAnimId = null; }
  activeArcadeMode = null;
  arcadeJoyVec.x = 0; arcadeJoyVec.y = 0; keys['Space'] = false;
  document.getElementById('teamSelectModal').classList.remove('show');
  document.getElementById('onlineInviteModal').classList.remove('show');
  document.getElementById('consoleOverlay').classList.remove('open');
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

function toggleBrowserFullscreen() {
  const el = document.getElementById('consoleOverlay');
  if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
  else document.exitFullscreen().catch(() => {});
}

const TEAMS = [
  { id: 'gs',  name: 'GALATASARAY', primary: '#a90432', secondary: '#fdb912', away: '#111827' },
  { id: 'fb',  name: 'FENERBAHÇE',  primary: '#002d72', secondary: '#ffed00', away: '#f8f9fa' },
  { id: 'rm',  name: 'REAL MADRID', primary: '#ffffff', secondary: '#7048e8', away: '#1e1b4b' },
  { id: 'liv', name: 'LIVERPOOL',   primary: '#c8102e', secondary: '#00b2a9', away: '#0f172a' }
];
let selectedMyTeam = TEAMS[0];
let selectedOppTeam = TEAMS[2];

function openTeamSelectModal() {
  const myGrid = document.getElementById('myTeamGrid');
  const oppGrid = document.getElementById('oppTeamGrid');
  myGrid.innerHTML = ''; oppGrid.innerHTML = '';
  TEAMS.forEach(t => {
    const c1 = document.createElement('div');
    c1.className = 'team-card' + (selectedMyTeam.id === t.id ? ' selected' : '');
    c1.style.borderLeft = `6px solid ${t.primary}`;
    c1.textContent = t.name;
    c1.onclick = () => { selectedMyTeam = t; openTeamSelectModal(); };
    myGrid.appendChild(c1);

    const c2 = document.createElement('div');
    c2.className = 'team-card' + (selectedOppTeam.id === t.id ? ' selected' : '');
    c2.style.borderLeft = `6px solid ${t.primary}`;
    c2.textContent = t.name;
    c2.onclick = () => { selectedOppTeam = t; openTeamSelectModal(); };
    oppGrid.appendChild(c2);
  });
  document.getElementById('teamSelectModal').classList.add('show');
}

function confirmTeamsAndStartFifa() {
  document.getElementById('teamSelectModal').classList.remove('show');
  launchConsoleGame('fifa');
}

function launchConsoleGame(mode) {
  if (arcadeAnimId) { cancelAnimationFrame(arcadeAnimId); arcadeAnimId = null; }
  activeArcadeMode = mode;
  const c = document.getElementById('arcadeCanvas');
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;

  if (mode === 'fifa') {
    document.getElementById('consoleTitle').textContent = `⚽ EA FC 27: ${selectedMyTeam.name} vs ${selectedOppTeam.name}`;
    document.getElementById('arcadeHelp').textContent = 'Joystick / WASD: Dripling | E / Sarı Tuş: PAS AT | SPACE / Kırmızı Tuş: FALSOLU ŞUT';
    document.getElementById('btnPadSecondary').style.display = 'block';
    document.getElementById('btnPadSecondary').innerHTML = 'PAS AT<br>(E)';
    document.getElementById('btnPadPrimary').innerHTML = 'ŞUT ÇEK<br>(SPACE)';
    startFifaFull(c, x);
  } else if (mode === 'gta6') {
    document.getElementById('consoleTitle').textContent = '🔫 GTA 6: AYDIN VICE — 3. ŞAHIS (TPS) & SİLAH';
    document.getElementById('arcadeHelp').textContent = 'Joystick / WASD: Koş & Nişan Al | SPACE / Kırmızı Tuş: ATEŞ ET | E / Sarı Tuş: Arabaya Bin-İn';
    document.getElementById('btnPadSecondary').style.display = 'block';
    document.getElementById('btnPadSecondary').innerHTML = 'ARABA<br>(E)';
    document.getElementById('btnPadPrimary').innerHTML = 'ATEŞ ET<br>(SPACE)';
    startGta6ThirdPerson(c, x);
  } else if (mode === 'nfs') {
    document.getElementById('consoleTitle').textContent = '🏎️ NEED FOR SPEED: AYDIN GECE YARIŞI';
    document.getElementById('arcadeHelp').textContent = 'Joystick / A-D: Şerit Değiştir & Makas At | SPACE / Kırmızı Tuş: NİTRO TURBO';
    document.getElementById('btnPadSecondary').style.display = 'none';
    document.getElementById('btnPadPrimary').innerHTML = 'NİTRO<br>(SPACE)';
    startNfsNightRace(c, x);
  } else if (mode === 'tekken') {
    document.getElementById('consoleTitle').textContent = '🥊 TEKKEN 8: ACİL ARENA (1v1 DÖVÜŞ)';
    document.getElementById('arcadeHelp').textContent = 'Joystick / A-D: İleri-Geri | SPACE / Kırmızı Tuş: YUMRUK KOMBO | E / Sarı Tuş: DÖNER TEKME';
    document.getElementById('btnPadSecondary').style.display = 'block';
    document.getElementById('btnPadSecondary').innerHTML = 'TEKME<br>(E)';
    document.getElementById('btnPadPrimary').innerHTML = 'YUMRUK<br>(SPACE)';
    startTekkenArena(c, x);
  }
}

/* ================= 1. EA FC 27 ================= */
let fifaStateRef = null;

function triggerFifaPass() {
  if (!fifaStateRef || activeArcadeMode !== 'fifa') return;
  const fs = fifaStateRef;
  if (fs.ballMode !== 'dribble') return;
  const nextIdx = (fs.activeIdx + 1) % fs.mates.length;
  const targetMate = fs.mates[nextIdx];
  fs.passTargetIdx = nextIdx;
  fs.ballMode = 'pass';
  const ang = Math.atan2(targetMate.y - fs.ball.y, targetMate.x - fs.ball.x);
  fs.ball.vx = Math.cos(ang) * 10.5; fs.ball.vy = Math.sin(ang) * 10.5; fs.ball.curve = 0;
  playBlip(440, 'triangle', 0.06);
}

function triggerFifaShot() {
  if (!fifaStateRef || activeArcadeMode !== 'fifa') return;
  const fs = fifaStateRef;
  if (fs.ballMode !== 'dribble') return;
  fs.ballMode = 'shot'; fs.shots++;
  playBlip(300, 'triangle', 0.08);
  const targetY = fs.ball.y > 225 ? 172 : 278;
  const ang = Math.atan2(targetY - fs.ball.y, 755 - fs.ball.x);
  fs.ball.vx = Math.cos(ang) * 11.4; fs.ball.vy = Math.sin(ang) * 11.4;
  fs.ball.curve = fs.ball.y > 225 ? -0.055 : 0.055;
}

function syncClientFifaState(remoteData) {
  if (!fifaStateRef) return;
  Object.assign(fifaStateRef, remoteData);
}

function startFifaFull(c, x) {
  const oppPrimary = selectedOppTeam.id === selectedMyTeam.id ? selectedOppTeam.away : selectedOppTeam.primary;
  const fs = {
    mates: [{ x: 160, y: 120 }, { x: 240, y: 225 }, { x: 160, y: 330 }],
    activeIdx: 2, passTargetIdx: 2,
    keeper: { x: 734, y: 225, dir: 1 },
    defs: [{ x: 460, y: 150, dir: 1 }, { x: 560, y: 295, dir: -1 }, { x: 640, y: 210, dir: 1 }],
    ball: { x: 175, y: 330, vx: 0, vy: 0, curve: 0 },
    ballMode: 'dribble', myGoals: 0, oppGoals: 0, shots: 0, matchFrames: 90 * 40,
    bannerText: '', bannerTimer: 0
  };
  fifaStateRef = fs;

  function kickoff(who) {
    fs.ballMode = 'dribble'; fs.ball.vx = 0; fs.ball.vy = 0; fs.ball.curve = 0;
    fs.mates[0].x = 180; fs.mates[0].y = 115;
    fs.mates[1].x = 260; fs.mates[1].y = 225;
    fs.mates[2].x = 180; fs.mates[2].y = 335;
    fs.activeIdx = 2; fs.ball.x = fs.mates[2].x + 14; fs.ball.y = fs.mates[2].y;
    if (who === 'me') { fs.bannerText = `GOOOOOL! ${selectedMyTeam.name} +150₺`; fs.bannerTimer = 75; }
    else if (who === 'save') { fs.bannerText = 'KALECİ KURTARDI!'; fs.bannerTimer = 45; }
    else if (who === 'block') { fs.bannerText = 'DEFANS BLOKLADI!'; fs.bannerTimer = 45; }
  }

  function loop() {
    if (activeArcadeMode !== 'fifa') return;
    p2pTick++;

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

    const activePlayer = fs.mates[fs.activeIdx];
    if (fs.ballMode === 'dribble') {
      activePlayer.x = Math.max(45, Math.min(715, activePlayer.x + ix * 4.0));
      activePlayer.y = Math.max(42, Math.min(408, activePlayer.y + iy * 4.0));
      fs.ball.x = activePlayer.x + 14; fs.ball.y = activePlayer.y;
      fs.mates.forEach((m, idx) => {
        if (idx === fs.activeIdx) return;
        const idealX = Math.min(660, activePlayer.x + (idx === 1 ? 110 : 40));
        m.x += (idealX - m.x) * 0.03;
      });
    } else if (fs.ballMode === 'pass') {
      fs.ball.x += fs.ball.vx; fs.ball.y += fs.ball.vy;
      const receiver = fs.mates[fs.passTargetIdx];
      if (Math.hypot(fs.ball.x - receiver.x, fs.ball.y - receiver.y) < 18) {
        fs.activeIdx = fs.passTargetIdx; fs.ballMode = 'dribble';
        fs.ball.x = receiver.x + 14; fs.ball.y = receiver.y;
      } else if (fs.ball.x < 30 || fs.ball.x > 760 || fs.ball.y < 25 || fs.ball.y > 425) kickoff(null);
    } else if (fs.ballMode === 'shot') {
      fs.ball.vy += fs.ball.curve; fs.ball.x += fs.ball.vx; fs.ball.y += fs.ball.vy;
      if (Math.abs(fs.ball.x - fs.keeper.x) < 12 && Math.abs(fs.ball.y - fs.keeper.y) < 22) {
        playBlip(180, 'square', 0.08); kickoff('save');
      } else if (fs.defs.some(d => Math.abs(fs.ball.x - d.x) < 12 && Math.abs(fs.ball.y - d.y) < 18)) {
        playBlip(160, 'square', 0.08); kickoff('block');
      } else if (fs.ball.x >= 748) {
        if (fs.ball.y >= 165 && fs.ball.y <= 285) {
          fs.myGoals++; state.money += 150; state.stress = Math.max(0, state.stress - 5);
          addTx('EA FC 27 Gol Primi', 150, 'pos'); updateHud(); saveCareer(); playSfx('coin');
          kickoff('me');
        } else kickoff(null);
      } else if (fs.ball.y < 20 || fs.ball.y > 430) kickoff(null);
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
      try { dataChannel.send(JSON.stringify({ type: 'state', data: fs })); } catch (e) {}
    }

    const matchMin = Math.min(90, 90 - Math.floor(fs.matchFrames / 40));
    document.getElementById('arcadeScore').textContent = `${matchMin}' | ${selectedMyTeam.name} ${fs.myGoals} - ${fs.oppGoals} ${selectedOppTeam.name} | ŞUT: ${fs.shots}`;

    x.fillStyle = '#1b5e20'; x.fillRect(0, 0, 800, 450);
    x.fillStyle = '#2e7d32'; for (let sx = 0; sx < 800; sx += 80) x.fillRect(sx, 0, 40, 450);
    x.strokeStyle = '#fff'; x.lineWidth = 2.5;
    x.strokeRect(30, 25, 720, 400);
    x.beginPath(); x.moveTo(390, 25); x.lineTo(390, 425); x.stroke();
    x.beginPath(); x.arc(390, 225, 52, 0, Math.PI * 2); x.stroke();
    x.strokeRect(610, 115, 140, 220);
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.fillRect(750, 165, 28, 120); x.strokeRect(750, 165, 28, 120);

    fs.mates.forEach((m, idx) => {
      if (idx === fs.activeIdx) { x.strokeStyle = '#fcc419'; x.lineWidth = 2; x.beginPath(); x.arc(m.x, m.y + 14, 14, 0, Math.PI * 2); x.stroke(); }
      x.fillStyle = selectedMyTeam.primary; x.fillRect(m.x - 10, m.y - 12, 20, 24);
      x.fillStyle = selectedMyTeam.secondary; x.fillRect(m.x - 10, m.y - 3, 20, 6);
      x.fillStyle = '#f1c2a5'; x.fillRect(m.x - 6, m.y - 19, 12, 7);
    });
    fs.defs.forEach(d => {
      x.fillStyle = oppPrimary; x.fillRect(d.x - 10, d.y - 12, 20, 24);
      x.fillStyle = selectedOppTeam.secondary; x.fillRect(d.x - 10, d.y - 3, 20, 6);
      x.fillStyle = '#f1c2a5'; x.fillRect(d.x - 6, d.y - 19, 12, 7);
    });
    x.fillStyle = '#fcc419'; x.fillRect(fs.keeper.x - 10, fs.keeper.y - 15, 20, 30);
    x.fillStyle = '#fff'; x.beginPath(); x.arc(fs.ball.x, fs.ball.y, 6.5, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#000'; x.lineWidth = 1.5; x.stroke();

    x.fillStyle = 'rgba(15, 23, 42, 0.9)'; x.fillRect(24, 6, 410, 26);
    x.fillStyle = '#fcc419'; x.font = 'bold 13px monospace';
    x.fillText(`${matchMin}'  ${selectedMyTeam.name} ${fs.myGoals} - ${fs.oppGoals} ${selectedOppTeam.name}`, 36, 24);

    if (fs.bannerTimer > 0) {
      fs.bannerTimer--;
      x.fillStyle = 'rgba(15, 23, 42, 0.9)'; x.fillRect(190, 185, 420, 64);
      x.fillStyle = '#51cf66'; x.font = 'bold 20px monospace';
      x.fillText(fs.bannerText, 215, 224);
    }
    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ================= 2. GTA 6: 3. ŞAHIS (TPS) + BİNA ÇARPIŞMASI + HUD ================= */
let gtaPlayerRef = null, gtaCarRef = null;

function toggleGtaVehicle() {
  if (!gtaPlayerRef || !gtaCarRef) return;
  if (gtaPlayerRef.inCar) {
    gtaPlayerRef.inCar = false; gtaPlayerRef.x = gtaCarRef.x + 28; gtaPlayerRef.y = gtaCarRef.y;
  } else if (Math.hypot(gtaPlayerRef.x - gtaCarRef.x, gtaPlayerRef.y - gtaCarRef.y) < 55) {
    gtaPlayerRef.inCar = true;
  }
}

function startGta6ThirdPerson(c, x) {
  const WORLD_SIZE = 2000;
  const buildings = [];
  for (let bx = 290; bx < WORLD_SIZE - 200; bx += 400) {
    for (let by = 290; by < WORLD_SIZE - 200; by += 400) buildings.push({ x: bx, y: by, w: 220, h: 220 });
  }
  function hitsBuilding(px, py, rad) {
    return buildings.some(b => px + rad > b.x && px - rad < b.x + b.w && py + rad > b.y && py - rad < b.y + b.h);
  }

  const player = { x: 235, y: 235, angle: 0, hp: 100, inCar: false, fireCd: 0 };
  const car = { x: 235, y: 295, angle: 0, speed: 0 };
  gtaPlayerRef = player; gtaCarRef = car;

  const bullets = [], enemies = [], lootBags = [];
  for (let i = 0; i < 12; i++) enemies.push({ x: 235 + (i % 4) * 400 + 30, y: 235 + Math.floor(i / 4) * 400 + 110, hp: 60, shootCd: 70 });
  for (let i = 0; i < 8; i++) lootBags.push({ x: 235 + (i % 4) * 400, y: 235 + ((i * 2) % 4) * 400 });

  let viceCash = 0, kills = 0, stars = 1, wastedTimer = 0;

  function fireWeapon() {
    if (player.fireCd > 0) return;
    player.fireCd = 10;
    playBlip(520, 'sawtooth', 0.05, 0.05);
    const ox = player.inCar ? car.x : player.x, oy = player.inCar ? car.y : player.y;
    const ang = player.inCar ? car.angle : player.angle;
    bullets.push({ x: ox + Math.cos(ang) * 18, y: oy + Math.sin(ang) * 18, vx: Math.cos(ang) * 11, vy: Math.sin(ang) * 11, fromPlayer: true, life: 55 });
  }

  function loop() {
    if (activeArcadeMode !== 'gta6') return;
    if (wastedTimer > 0) {
      wastedTimer--;
      x.fillStyle = 'rgba(15, 23, 42, 0.85)'; x.fillRect(0, 0, 800, 450);
      x.fillStyle = '#ff6b6b'; x.font = 'bold 38px monospace'; x.fillText('WASTED — ACİLE KALDIRILDIN', 110, 225);
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
      if (iy < -0.2) car.speed = Math.min(6.2, car.speed + 0.22);
      else if (iy > 0.2) car.speed = Math.max(-2.8, car.speed - 0.22);
      else car.speed *= 0.94;
      if (Math.abs(car.speed) > 0.25 && Math.abs(ix) > 0.15) car.angle += ix * 0.065;
      const nx = Math.max(60, Math.min(WORLD_SIZE - 60, car.x + Math.cos(car.angle) * car.speed));
      const ny = Math.max(60, Math.min(WORLD_SIZE - 60, car.y + Math.sin(car.angle) * car.speed));
      if (!hitsBuilding(nx, ny, 18)) { car.x = nx; car.y = ny; } else { car.speed *= -0.4; }
      player.x = car.x; player.y = car.y; player.angle = car.angle;
    } else {
      const mag = Math.hypot(ix, iy);
      if (mag > 0.15) {
        const vx = (ix / Math.max(1, mag)) * 3.6, vy = (iy / Math.max(1, mag)) * 3.6;
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
      if (b.life <= 0 || hitsBuilding(b.x, b.y, 3)) { bullets.splice(i, 1); continue; }
      if (b.fromPlayer) {
        for (let j = enemies.length - 1; j >= 0; j--) {
          const en = enemies[j];
          if (Math.hypot(b.x - en.x, b.y - en.y) < 18) {
            en.hp -= 30; bullets.splice(i, 1);
            if (en.hp <= 0) {
              enemies.splice(j, 1); kills++; viceCash += 300;
              stars = Math.min(5, Math.floor(kills / 2) + 1);
              state.money += 120; addTx('GTA 6 Vice Ödülü', 120, 'pos'); updateHud(); saveCareer();
              enemies.push({ x: 235 + (kills % 4) * 400, y: 235 + ((kills + 1) % 4) * 400, hp: 60, shootCd: 75 });
            }
            break;
          }
        }
      } else if (Math.hypot(b.x - player.x, b.y - player.y) < 16) {
        player.hp -= (player.inCar ? 4 : 10); bullets.splice(i, 1);
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
        bullets.push({ x: en.x + Math.cos(ang) * 14, y: en.y + Math.sin(ang) * 14, vx: Math.cos(ang) * 6.5, vy: Math.sin(ang) * 6.5, fromPlayer: false, life: 60 });
      }
    });

    for (let i = lootBags.length - 1; i >= 0; i--) {
      if (Math.hypot(player.x - lootBags[i].x, player.y - lootBags[i].y) < 26) {
        viceCash += 250; state.money += 100; addTx('GTA 6 Çanta Ganimeti', 100, 'pos'); updateHud(); saveCareer(); playSfx('coin');
        lootBags[i] = { x: 235 + Math.floor(Math.random() * 4) * 400, y: 235 + Math.floor(Math.random() * 4) * 400 };
      }
    }

    document.getElementById('arcadeScore').textContent = `CAN: %${player.hp} | LEŞ: ${kills} | VICE CASH: $${viceCash} (+120₺/Leş) | ARANMA: ${'★'.repeat(stars)}`;

    const camX = player.x - 400, camY = player.y - 225;
    x.save(); x.translate(-camX, -camY);
    x.fillStyle = '#1e293b'; x.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);
    x.fillStyle = '#0f172a';
    for (let gx = 200; gx < WORLD_SIZE; gx += 400) x.fillRect(gx, 0, 70, WORLD_SIZE);
    for (let gy = 200; gy < WORLD_SIZE; gy += 400) x.fillRect(0, gy, WORLD_SIZE, 70);
    buildings.forEach(b => {
      x.fillStyle = '#090d16'; x.fillRect(b.x + 8, b.y + 8, b.w, b.h);
      x.fillStyle = '#334155'; x.fillRect(b.x, b.y, b.w, b.h);
      x.fillStyle = '#475569'; x.fillRect(b.x + 14, b.y + 14, b.w - 28, b.h - 28);
    });
    lootBags.forEach(lb => {
      x.fillStyle = '#fcc419'; x.fillRect(lb.x - 10, lb.y - 10, 20, 20);
      x.fillStyle = '#000'; x.font = 'bold 13px monospace'; x.fillText('$', lb.x - 4, lb.y + 5);
    });
    x.save(); x.translate(car.x, car.y); x.rotate(car.angle);
    x.fillStyle = '#ff6b6b'; x.fillRect(-22, -13, 44, 26); x.fillStyle = '#38bdf8'; x.fillRect(4, -10, 10, 20);
    x.restore();
    enemies.forEach(en => {
      x.fillStyle = '#1d4ed8'; x.fillRect(en.x - 10, en.y - 10, 20, 20);
      x.fillStyle = '#ef4444'; x.fillRect(en.x - 12, en.y - 18, (en.hp / 60) * 24, 3);
    });
    if (!player.inCar) {
      x.save(); x.translate(player.x, player.y); x.rotate(player.angle);
      x.fillStyle = '#10b981'; x.fillRect(-10, -12, 20, 24);
      x.fillStyle = '#f1c2a5'; x.fillRect(-6, -6, 12, 12);
      x.fillStyle = '#111827'; x.fillRect(6, 3, 18, 5);
      x.restore();
    }
    bullets.forEach(b => { x.fillStyle = b.fromPlayer ? '#fcc419' : '#ff6b6b'; x.fillRect(b.x - 3, b.y - 3, 6, 6); });
    x.restore();

    x.fillStyle = 'rgba(9,13,22,0.82)'; x.fillRect(14, 14, 210, 44);
    x.fillStyle = '#51cf66'; x.fillRect(22, 22, (player.hp / 100) * 194, 10);
    x.fillStyle = '#fcc419'; x.font = 'bold 12px monospace'; x.fillText(`VICE $${viceCash}  ${'★'.repeat(stars)}`, 22, 48);
    if (!player.inCar && Math.hypot(player.x - car.x, player.y - car.y) < 55) {
      x.fillStyle = '#3bc9db'; x.font = 'bold 13px monospace'; x.fillText('[E veya SARI TUŞ: ARABAYA BİN]', 260, 34);
    }
    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ================= 3. NEED FOR SPEED — AYDIN GECE YARIŞI ================= */
function startNfsNightRace(c, x) {
  let carX = 380, speed = 7, score = 0, nextReward = 500, nitro = 100, roadOffset = 0, crashFlash = 0;
  const traffic = [];
  for (let i = 0; i < 5; i++) traffic.push({ x: 220 + (i % 4) * 100, y: -i * 150, color: ['#ff6b6b','#fcc419','#3bc9db','#b197fc'][i % 4] });

  function loop() {
    if (activeArcadeMode !== 'nfs') return;
    let ix = arcadeJoyVec.x;
    if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
    if (keys['ArrowRight'] || keys['KeyD']) ix = 1;

    const boosting = keys['Space'] && nitro > 2;
    if (boosting) { speed = 13; nitro = Math.max(0, nitro - 0.8); }
    else { speed = 7; nitro = Math.min(100, nitro + 0.25); }

    carX = Math.max(200, Math.min(560, carX + ix * 6.5));
    roadOffset = (roadOffset + speed) % 60;
    score += Math.round(speed * 0.4);

    if (score >= nextReward) {
      nextReward += 500; state.money += 100;
      addTx('NFS Gece Yarışı Primi', 100, 'pos'); updateHud(); saveCareer(); playSfx('coin');
    }

    x.fillStyle = crashFlash > 0 ? '#3b0d14' : '#090d16';
    if (crashFlash > 0) crashFlash--;
    x.fillRect(0, 0, 800, 450);
    x.fillStyle = '#1e293b'; x.fillRect(180, 0, 440, 450);
    x.fillStyle = '#fcc419'; x.fillRect(174, 0, 6, 450); x.fillRect(620, 0, 6, 450);
    x.fillStyle = '#fff';
    for (let y = -60 + roadOffset; y < 450; y += 60) { x.fillRect(326, y, 4, 30); x.fillRect(470, y, 4, 30); }

    traffic.forEach(t => {
      t.y += speed * 0.72;
      if (t.y > 470) { t.y = -90; t.x = 220 + Math.floor(Math.random() * 4) * 100; }
      x.fillStyle = t.color; x.fillRect(t.x - 18, t.y - 30, 36, 60);
      if (Math.abs(t.x - carX) < 32 && Math.abs(t.y - 360) < 52) {
        score = Math.max(0, score - 150); crashFlash = 14; t.y = -130; playBlip(140, 'sawtooth', 0.12);
      }
    });

    x.fillStyle = '#51cf66'; x.fillRect(carX - 18, 330, 36, 62);
    x.fillStyle = '#38bdf8'; x.fillRect(carX - 14, 344, 28, 16);
    if (boosting) { x.fillStyle = '#ff6b6b'; x.fillRect(carX - 10, 392, 20, 18); }

    document.getElementById('arcadeScore').textContent = `HIZ: ${speed * 22} KM/S | SKOR: ${score} (Ödül: ${nextReward}) | NİTRO: %${Math.round(nitro)}`;
    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ================= 4. TEKKEN 8 — ACİL ARENA ================= */
let tkRef = null;
function triggerTekkenPunch() {
  if (!tkRef || activeArcadeMode !== 'tekken' || tkRef.p1.cd > 0) return;
  tkRef.p1.anim = 10; tkRef.p1.cd = 14;
  if (Math.abs(tkRef.p1.x - tkRef.p2.x) < 95) { tkRef.p2.hp = Math.max(0, tkRef.p2.hp - 12); playBlip(260, 'square', 0.06); }
}
function triggerTekkenKick() {
  if (!tkRef || activeArcadeMode !== 'tekken' || tkRef.p1.cd > 0) return;
  tkRef.p1.anim = 14; tkRef.p1.cd = 20;
  if (Math.abs(tkRef.p1.x - tkRef.p2.x) < 115) { tkRef.p2.hp = Math.max(0, tkRef.p2.hp - 18); playBlip(190, 'sawtooth', 0.08); }
}

function startTekkenArena(c, x) {
  const tk = { p1: { x: 240, hp: 100, anim: 0, cd: 0 }, p2: { x: 540, hp: 100, cd: 45, anim: 0 }, wins: 0, koTimer: 0 };
  tkRef = tk;

  function loop() {
    if (activeArcadeMode !== 'tekken') return;
    let ix = arcadeJoyVec.x;
    if (keys['ArrowLeft'] || keys['KeyA']) ix = -1;
    if (keys['ArrowRight'] || keys['KeyD']) ix = 1;

    tk.p1.x = Math.max(80, Math.min(720, tk.p1.x + ix * 4.5));
    if (tk.p1.anim > 0) tk.p1.anim--;
    if (tk.p1.cd > 0) tk.p1.cd--;
    if (tk.p2.anim > 0) tk.p2.anim--;

    const dist = tk.p2.x - tk.p1.x;
    const facing = dist >= 0 ? 1 : -1;

    if (Math.abs(dist) > 80) tk.p2.x -= Math.sign(dist) * 2.2;
    else if (--tk.p2.cd <= 0) { tk.p2.cd = 50; tk.p2.anim = 10; tk.p1.hp = Math.max(0, tk.p1.hp - 9); }

    if (tk.p2.hp <= 0) {
      tk.wins++; tk.koTimer = 50; tk.p2.hp = 100; tk.p1.hp = 100;
      state.money += 200; addTx('Tekken 8 Arena Galibiyeti', 200, 'pos'); updateHud(); saveCareer(); playSfx('coin');
    } else if (tk.p1.hp <= 0) { tk.p1.hp = 100; tk.p2.hp = 100; }

    x.fillStyle = '#1e1633'; x.fillRect(0, 0, 800, 360);
    x.fillStyle = '#334155'; x.fillRect(0, 360, 800, 90);
    x.fillStyle = '#51cf66'; x.fillRect(40, 24, tk.p1.hp * 3, 20);
    x.fillStyle = '#ff6b6b'; x.fillRect(760 - tk.p2.hp * 3, 24, tk.p2.hp * 3, 20);

    x.fillStyle = '#3bc9db'; x.fillRect(tk.p1.x - 20, 260, 40, 100);
    if (tk.p1.anim > 0) { x.fillStyle = '#fcc419'; x.fillRect(facing === 1 ? tk.p1.x + 20 : tk.p1.x - 65, 280, 45, 16); }

    x.fillStyle = '#e03131'; x.fillRect(tk.p2.x - 20, 260, 40, 100);
    if (tk.p2.anim > 0) { x.fillStyle = '#ff8787'; x.fillRect(facing === 1 ? tk.p2.x - 55 : tk.p2.x + 20, 285, 35, 14); }

    if (tk.koTimer > 0) { tk.koTimer--; x.fillStyle = '#fcc419'; x.font = 'bold 42px monospace'; x.fillText('K.O.! +200₺', 270, 180); }

    document.getElementById('arcadeScore').textContent = `KAZANILAN RAUND: ${tk.wins} (+200₺/Raund) | SEN: %${tk.p1.hp} vs RAKİP: %${tk.p2.hp}`;
    arcadeAnimId = requestAnimationFrame(loop);
  }
  loop();
}
