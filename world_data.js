/* ================= WORLD_DATA.JS — VAKALAR, UZMANLIKLAR & AÇIK DÜNYA ================= */
const SAVE_KEY = 'acilin_ben_doktorum_v5';

const SPECIALTIES = {
  none:   { id: 'none',   title: 'Pratisyen Hekim',           icon: '🩺', reqTus: 40, reqRep: 40, bonusPay: 0,   serviceName: 'Acil Servis' },
  ophth:  { id: 'ophth',  title: 'Göz Hastalıkları Uzmanı',   icon: '👁️', reqTus: 52, reqRep: 48, bonusPay: 250, serviceName: 'Göz Hastalıkları' },
  cardio: { id: 'cardio', title: 'Kardiyoloji Uzmanı',        icon: '❤️', reqTus: 58, reqRep: 52, bonusPay: 300, serviceName: 'Kardiyoloji' },
  emerg:  { id: 'emerg',  title: 'Acil Tıp Uzmanı',           icon: '🚨', reqTus: 48, reqRep: 45, bonusPay: 220, serviceName: 'Acil Resüsitasyon' },
  neuro:  { id: 'neuro',  title: 'Nöroloji & Beyin Cerrahi',  icon: '🧠', reqTus: 56, reqRep: 50, bonusPay: 280, serviceName: 'Nöroloji / Beyin Cerrahi' },
  ortho:  { id: 'ortho',  title: 'Ortopedi & Travmatoloji',   icon: '🦴', reqTus: 50, reqRep: 48, bonusPay: 230, serviceName: 'Ortopedi' },
  peds:   { id: 'peds',   title: 'Pediatri & Çocuk Acil',     icon: '🧸', reqTus: 50, reqRep: 48, bonusPay: 230, serviceName: 'Pediatri' },
  ent:    { id: 'ent',    title: 'Kulak Burun Boğaz (KBB)',   icon: '👂', reqTus: 48, reqRep: 45, bonusPay: 210, serviceName: 'KBB' },
  surg:   { id: 'surg',   title: 'Genel Cerrahi Uzmanı',      icon: '🔪', reqTus: 54, reqRep: 50, bonusPay: 260, serviceName: 'Genel Cerrahi' }
};

const state = {
  docName: 'Dr. Muhammed Kurtuluş Taş',
  hospName: 'Aydın Merkez Acil Eğitim Hast.',
  apiKey: '',
  day: 1,
  hour: 20,
  seenToday: 0,
  dailyCorrect: 0,
  dailyWrong: 0,
  totalSaved: 0,
  money: 3500,
  rep: 52,
  tusScore: 45,
  specialty: 'none',
  stress: 10,
  warnings: 0,
  location: 'er', // 'er', 'world', 'canteen', 'diner', 'dealer', 'home', 'pitch'
  tab: 'talk',
  currentPatient: null,
  usedCaseIds: [],
  examDone: { vitals: false, lung: false, pupil: false, rad: false, labs: false, enabiz: false },
  ppeOn: false,
  doorThreat: false,
  internIdx: 0,
  upgrades: { thermos: false, cactus: false, littmann: false, dualMonitor: false },
  assets: {
    car: 'Yok (Belediye Otobüsü)',
    carColor: '#ff6b6b',
    fuel: 100,
    carHealth: 100,
    ps5Owned: true,
    homeLevel: 1
  },
  // Açık Dünya Oyuncu Koordinatları (480x180 piksel şehir haritası)
  worldPlayer: { x: 86, y: 88, dir: 'down', driving: false },
  transactions: [{ desc: 'Nöbet Başlangıç Bakiyesi', amt: 3500, type: 'pos' }],
  chats: [
    { id: 'elif', name: '🩺 Asistan Dr. Elif', role: 'Dahiliye Asistanı', msgs: [
      { from: 'Dr. Elif', text: 'Nöbet nasıl gidiyor? Çıkışta eve geçip biraz kafa dağıtır mısın?' }
    ]},
    { id: 'kaan', name: '⚽ Lise Arkadaşı Kaan', role: 'Halı Saha Kaptanı', msgs: [
      { from: 'Kaan', text: 'Kanka PS5 aldığını duydum! Eve geçince GTA 6 ve EA FC 27 atalım, halı sahaya da bekliyoruz!' }
    ]}
  ]
};

const WORLD_BUILDINGS = [
  { id: 'er',     name: '🏥 HASTANE ACİL',    x: 24,  y: 22, w: 96, h: 48, color: '#1c7ed6', roof: '#1864ab' },
  { id: 'diner',  name: '🍲 ESNAF LOKANTASI', x: 155, y: 22, w: 86, h: 44, color: '#e67700', roof: '#d9480f' },
  { id: 'dealer', name: '🚗 OTO GALERİ',      x: 275, y: 22, w: 92, h: 44, color: '#2b8a3e', roof: '#237032' },
  { id: 'home',   name: '🏠 EVİM (PS5 & TV)', x: 388, y: 22, w: 74, h: 48, color: '#7048e8', roof: '#5f3dc4' },
  { id: 'pitch',  name: '⚽ HALI SAHA',       x: 155, y: 122, w: 130, h: 44, color: '#2f9e44', roof: '#37b24d' },
  { id: 'canteen',name: '☕ HASTANE KANTİNİ', x: 24,  y: 122, w: 96, h: 44, color: '#495057', roof: '#343a40' }
];

const INTERNS = [
  { name: 'İntörn Berk', color: '#3bc9db' },
  { name: 'İntörn Selin', color: '#b197fc' },
  { name: 'İntörn Emre', color: '#fcc419' }
];

const SPECIALTY_BLUEPRINTS = {
  ophth: [
    { diag: 'Akut Açı Kapanması Glokomu', triage: 'red', action: 'treat', treat: 'IV Mannitol + Asetazolamid + Pilokarpin', srv: 'Göz Hastalıkları',
      comp: 'Karanlık sinemadan çıktığımdan beri sağ gözüm taş gibi sertleşti, ışıkların etrafında gökkuşağı halkaları görüyorum!',
      vit: 'TA: 165/95 | Nabız: 96 | Göz İçi Basıncı: 54 mmHg!', exam: 'Kornea ödemli, ön kamara sığ.', pupil: 'Sağ pupilla orta dilate ve ışığa yanıtsız!',
      rad: 'GİB 54 mmHg — Akut Glokom Krizi!', labs: 'Böbrek fonksiyonları uygun.', hint: 'GİB 54 mmHg! Poliklinikte IV Mannitol müdahalesi yap.' },
    { diag: 'Santral Retinal Arter Tıkanıklığı (CRAO)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları',
      comp: 'Sabah uyandığımda sol gözümün önüne aniden siyah perde indi, hiç göremiyorum!',
      vit: 'TA: 170/95 | Nabız: 84 (AF) | Görme: El Hareketi', exam: 'Oküler emboli şüphesi.', pupil: 'Sol gözde RAPD (Marcus Gunn) pozitif!',
      rad: 'Makulada JAPON BAYRAĞI (Cherry-Red Spot) görünümü!', labs: 'EKG: Atriyal Fibrilasyon.', hint: 'Ağrısız ani görme kaybı + Japon Bayrağı makula! Göz Hastalıklarına yatır.' }
  ],
  cardio: [
    { diag: 'Akut Anterior STEMI', triage: 'red', action: 'admit', srv: 'Kardiyoloji',
      comp: 'Sol koluma ve çeneme vuran sıkıştırıcı göğüs ağrısı 30 dakikadır geçmiyor, soğuk ter döküyorum!',
      vit: 'TA: 100/65 | Nabız: 108 | SpO2: %93', exam: 'S4 gallop ritmi, soğuk terleme.', pupil: 'Pupiller izokorik.',
      rad: 'EKG V1-V5 derivasyonlarında dev ST ELEVASYONU!', labs: 'Troponin-I: 14.2 ng/mL', hint: 'Anterior STEMI! Primer anjiyo için Kardiyolojiye yatır.' },
    { diag: 'Kardiyak Tamponad (Beck Triadı)', triage: 'red', action: 'admit', srv: 'Kardiyoloji',
      comp: 'Nefesim çok daraldı, yatınca boğuluyorum ve başım dönüyor!',
      vit: 'TA: 80/50 (Pulsus Paradoksus) | Nabız: 134', exam: 'Beck Triadı: Hipotansiyon + Boyun ven dolgunluğu + Derinden kalp sesleri!', pupil: 'İzokorik.',
      rad: 'EKO: Masif perikardiyal efüzyon ve sağ ventrikül kollapsı!', labs: 'D-Dimer yüksek.', hint: 'Beck Triadı = Kardiyak Tamponad! Kardiyolojiye yatır.' }
  ],
  emerg: [
    { diag: 'Tansiyon Pnömotoraks', triage: 'red', action: 'treat', treat: 'Sağ 2. İKA İğne Dekompresyonu', srv: 'Acil Resüsitasyon',
      comp: 'Motosiklet kazası geçirdim, sağ göğsüm şişti nefes alamıyorum!',
      vit: 'TA: 75/40 | Nabız: 138 | SpO2: %84', exam: 'Sağda solunum sesi YOK + Trakea sola deviye!', pupil: 'Boyun venleri şiş.',
      rad: 'Tansiyon Pnömotoraks! Hemen iğne dekompresyonu şart!', labs: 'Acil müdahale.', hint: 'Trakea deviasyonu + hipotansiyon = Tansiyon Pnömotoraks! Hemen müdahale et.' },
    { diag: 'Anafilaktik Şok', triage: 'red', action: 'treat', treat: '0.5 mg İM Adrenalin + IV Sıvı', srv: 'Acil Resüsitasyon',
      comp: 'Fıstıklı baklava yedikten sonra boğazım şişti, hırıltım başladı bayılıyorum!',
      vit: 'TA: 82/45 | Nabız: 136 | SpO2: %88', exam: 'İnspiratuar stridor ve yaygın ürtiker.', pupil: 'İzokorik.',
      rad: 'Anafilaktik Şok! İlk seçenek 0.5 mg İM Adrenalin!', labs: 'E-Nabız: Yer fıstığı alerjisi.', hint: 'Hemen 0.5 mg İM Adrenalin uygula!' }
  ],
  neuro: [
    { diag: 'Akut İskemik İnme (İlk 4.5 Saat)', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi',
      comp: '40 dakika önce konuşmam peltekleşti, sol kolum ve bacağım tutmaz oldu!',
      vit: 'TA: 168/92 | Nabız: 88 | NIHSS: 14', exam: 'Sol hemiparezi ve santral fasiyal paralizi.', pupil: 'İzokorik.',
      rad: 'Beyin BT’de KANAMA YOK! Sağ MCA hiperdens arter işareti!', labs: 'INR: 1.0 (tPA uygun).', hint: 'İlk 4.5 saat ve kanama yok! Nörolojiye yatır.' }
  ],
  ortho: [
    { diag: 'Akut Kompartman Sendromu', triage: 'red', action: 'admit', srv: 'Ortopedi',
      comp: 'Dün alçıya alınan bacağımda morfinle bile geçmeyen zonklayıcı ağrı ve uyuşma başladı!',
      vit: 'TA: 145/90 | Nabız: 116 | Kompartman Basıncı: 46 mmHg!', exam: 'Pasif ayak parmağı germeyle şiddetli ağrı!', pupil: 'İzokorik.',
      rad: 'Akut Kompartman Sendromu! Acil fasyotomi endikasyonu!', labs: 'CK: 14.200 U/L', hint: 'Ortopediye acil fasyotomi için yatır!' }
  ],
  peds: [
    { diag: 'Akut Epiglottit (Çocuk Acil)', triage: 'red', action: 'admit', srv: 'Pediatri',
      comp: '4 yaşındaki oğlumun ateşi 40 oldu, ağzından salya akıyor ve öne eğilip boğulur gibi nefes alıyor!',
      vit: 'Ateş: 39.9°C | Nabız: 148 | SpO2: %89', exam: 'Tripod pozisyonu + salya akması (Dil basacağı KULLANMA!).', pupil: 'İzokorik.',
      rad: 'Yan boyun grafisinde BAŞPARMAK İŞARETİ (Thumbprint Sign)!', labs: 'Acil hava yolu güvenliği.', hint: 'Boğazına bakma, Pediatriye yatır!' }
  ],
  ent: [
    { diag: 'Peritonsiller Apse (Quinsy)', triage: 'red', action: 'admit', srv: 'KBB',
      comp: 'Boğaz ağrım 4 gündür arttı, ağzımı açamıyorum ve sesim sıcak patates yutmuş gibi boğuk!',
      vit: 'Ateş: 39.0°C | Nabız: 112 | Trismus: POZİTİF', exam: 'Uvula karşı tarafa (sola) deviye!', pupil: 'İzokorik.',
      rad: 'Sağ peritonsiller bölgede 3.5 cm apse!', labs: 'WBC: 19.400', hint: 'Trismus + uvula deviasyonu = Peritonsiller Apse! KBB’ye yatır.' }
  ],
  surg: [
    { diag: 'Akut Apandisit', triage: 'yellow', action: 'admit', srv: 'Genel Cerrahi',
      comp: 'Dün göbeğim ağrıyordu bugün sağ alt karnıma indi, iştahım kesildi ve kustum.',
      vit: 'Ateş: 37.9°C | Nabız: 102', exam: 'McBurney noktasında defans, rebound ve Rovsing POZİTİF!', pupil: 'İzokorik.',
      rad: 'Batın USG: 11 mm çaplı inflame apendiks!', labs: 'WBC: 16.400', hint: 'Genel Cerrahiye yatır!' }
  ]
};

function buildAllCases() {
  const list = [];
  const names = ['Ahmet','Fatma','Mehmet','Ayşe','Mustafa','Emine','Ali','Zeynep','Hasan','Elif','Murat','Selin','Kaan','Bora','İrem','Tolga','Ozan','Nihan'];
  Object.keys(SPECIALTY_BLUEPRINTS).forEach((specKey, sIdx) => {
    const bps = SPECIALTY_BLUEPRINTS[specKey];
    for (let i = 0; i < 25; i++) {
      const bp = bps[i % bps.length];
      const fn = names[(i * 5 + sIdx * 3) % names.length];
      const age = specKey === 'peds' ? (2 + (i % 10)) : (24 + ((i * 7) % 52));
      list.push({
        id: `${specKey}_${i + 1}`, spec: specKey, name: `${fn} (${age})`, triage: bp.triage, pitch: 280,
        appearance: {
          skin: i % 2 === 0 ? '#f1c2a5' : '#d8a484',
          hair: age > 55 ? '#ced4da' : '#2b1d14',
          shirt: ['#1971c2','#2f9e44','#d6336c','#e67700','#5f3dc4'][i % 5],
          flush: bp.triage === 'red', sweat: true, cyanosis: bp.vit.includes('84') || bp.vit.includes('88'),
          pupils: bp.pupil.includes('dilate') ? 'midriasis_fixed' : 'normal'
        },
        complaint: bp.comp, vitals: bp.vit, lung: bp.exam, pupil: bp.pupil,
        radFinding: bp.rad, labs: bp.labs, enabiz: 'Risk faktörü taraması tamamlandı.',
        correctAction: bp.action, targetService: bp.srv, targetReason: bp.diag,
        treatLabel: bp.treat || 'Acil Müdahale Uygula', hint: bp.hint
      });
    }
  });
  return list;
}
const ALL_CASES = buildAllCases();

function saveCareer() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, currentPatient: null })); } catch (e) {}
}
function loadCareer() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    Object.assign(state, JSON.parse(raw));
    return true;
  } catch (e) { return false; }
}
