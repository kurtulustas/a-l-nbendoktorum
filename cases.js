/* ================= CASES.JS — 340 VAKA, 4 TIBBİ MİNİ-OYUN, İNTÖRN & KLİNİK AKIŞ ================= */

const SPECIALTY_BLUEPRINTS = {
  ophth: [
    { diag: 'Akut Açı Kapanması Glokomu', triage: 'red', action: 'treat', mg: 'iv', treat: 'IV Mannitol + Asetazolamid + Pilokarpin', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'TONOMETRİ & BİYOMİKROSKOP',
      comp: 'Sinemadan çıktığımdan beri sağ gözüm taş gibi sertleşti, ışıkların etrafında gökkuşağı halkaları görüyorum!',
      vit: 'TA: 165/95 | Nabız: 96 | Göz İçi Basıncı: 54 mmHg!', exam: 'Kornea ödemli, ön kamara sığ.', pupil: 'Sağ pupilla orta dilate ve ışığa yanıtsız!',
      rad: 'GİB 54 mmHg — Akut Glokom Krizi!', labs: 'Böbrek fonksiyonları IV Mannitol için uygun.', hint: 'GİB 54 mmHg! Poliklinikte IV Mannitol müdahalesi yap.' },
    { diag: 'Santral Retinal Arter Tıkanıklığı (CRAO)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'FUNDUS GÖRÜNTÜLEME',
      comp: 'Sabah uyandığımda sol gözümün önüne aniden siyah perde indi, hiç göremiyorum!',
      vit: 'TA: 170/95 | Nabız: 84 (AF) | Görme: El Hareketi', exam: 'Oküler emboli şüphesi.', pupil: 'Sol gözde RAPD (Marcus Gunn) pozitif!',
      rad: 'Makulada JAPON BAYRAĞI (Cherry-Red Spot) görünümü!', labs: 'EKG: Atriyal Fibrilasyon.', hint: 'Ağrısız ani görme kaybı + Japon Bayrağı makula! Göz Hastalıklarına yatır.' },
    { diag: 'Orbital Selülit (Post-Septal)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'brain', radTitle: 'ORBİTA BT',
      comp: 'Sinüzit sonrası sağ göz kapağım şişti, gözümü oynatırken çok ağrıyor ve çift görüyorum!',
      vit: 'Ateş: 39.2°C | Nabız: 118 | Propitozis: POZİTİF', exam: 'Oftalmopleji ve göz hareketleriyle şiddetli ağrı.', pupil: 'RAPD pozitif!',
      rad: 'Orbita BT: Post-septal apse formasyonu!', labs: 'WBC: 21.400 | CRP: 165', hint: 'Preseptal değil ORBİTAL selülit! IV antibiyotik için yatır.' },
    { diag: 'Penetran Göz Yaralanması (Açık Glob)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'ORBİTA BT & BİYOMİKROSKOP',
      comp: 'Spiral makinesiyle demir keserken gözüme metal parçası sıçradı, sıcak sıvı aktı!',
      vit: 'TA: 150/90 | Nabız: 108 | Görme: Işık Hissi (+)', exam: 'Korneada tam kat laserasyon, ön kamara sönmüş.', pupil: 'Teardrop (gözyaşı damlası) pupilla!',
      rad: 'Orbita BT: Göz içi 3 mm metalik yabancı cisim!', labs: 'Tetanoz profilaksisi yapıldı.', hint: 'Göze bası yapma! Kalkan takıp acil operasyona yatır.' },
    { diag: 'Kimyasal Alkali Göz Yanığı', triage: 'red', action: 'treat', mg: 'decon', treat: '2 Litre İzotonik ile Sürekli Oküler İrrigasyon', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'OKÜLER pH & FLORESEİN',
      comp: 'Lavabo açıcı temizlik maddesi yüzüme sıçradı, gözlerim yanıyor açamıyorum!',
      vit: 'TA: 145/85 | Nabız: 112 | Oküler pH: 10.5 (Alkali)!', exam: 'Limbal iskemi ve korneal bulanıklık.', pupil: 'Değerlendirilemiyor.',
      rad: 'Oküler pH 10.5 — Hemen sürekli yıkama şart!', labs: 'Tahlil beklenmeden yıkama yapılır.', hint: 'Alkali yanık korneayı eritir! Hemen yıkama mini-oyununu başlat.' },
    { diag: 'Regmatojen Retina Dekolmanı', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'B-SCAN OKÜLER USG',
      comp: 'İki gündür sağ gözümde şimşek çakmaları vardı, şimdi alttan karanlık perde yükseliyor!',
      vit: 'TA: 130/80 | Nabız: 78 | Görme: 0.2', exam: 'Vitreusta tütün tozu (Shafer) bulgusu.', pupil: 'Hafif RAPD pozitif.',
      rad: 'Retina yaprakları ayrılmış — Macula-On Dekolman!', labs: 'Pre-op rutin normal.', hint: 'Acil vitrektomi için Göz Hastalıklarına yatır.' },
    { diag: 'Endoftalmi (Post-Katarakt)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'ÖN KAMARA & B-USG',
      comp: '3 gün önce katarakt ameliyatı oldum, gözümde dayanılmaz ağrı ve görme kaybı var!',
      vit: 'Ateş: 37.8°C | Nabız: 94 | Görme: El Hareketi', exam: 'Ön kamarada 3 mm HİPOPİYON!', pupil: 'Kırmızı refle alınamıyor.',
      rad: 'Vitreus kavitesinde yoğun opasiteler — Endoftalmi!', labs: 'WBC: 14.800', hint: 'Cerrahi sonrası hipopiyon = Endoftalmi! Yatır.' },
    { diag: 'Dev Hücreli Arterit (AION)', triage: 'red', action: 'admit', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'TEMPORAL DOPPLER & FUNDUS',
      comp: '72 yaşındayım, yemek çiğnerken çenem yoruluyor ve sabah sağ gözüm tamamen kör oldu!',
      vit: 'TA: 155/85 | Temporal Arter: Hassas/Nabızsız', exam: 'Tebeşir beyazı ödemli optik disk.', pupil: 'Sağ RAPD 4+ pozitif.',
      rad: 'Temporal arterde Halo işareti!', labs: 'ESR: 112 mm/saat! CRP: 98!', hint: 'Diğer gözü korumak için IV Pulse Steroid ve yatış!' },
    { diag: 'Herpes Zoster Oftalmikus', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Antiviral (Valasiklovir) + Sikloplejik', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'FLORESEİN BOYA',
      comp: 'Alnımda ve burnumun tam ucunda içi su dolu ağrılı kabarcıklar çıktı!',
      vit: 'Ateş: 37.6°C | Nabız: 84', exam: 'Hutchinson bulgusu (+) ve dendritik keratit.', pupil: 'İzokorik.',
      rad: 'Korneada dendritik ülser!', labs: 'VZV klinik tanı.', hint: 'Burun ucu tutulumu korneayı gösterir! Antiviral tedavi uygula.' },
    { diag: 'Basit Bakteriyel Konjonktivit', triage: 'green', action: 'discharge', srv: 'Göz Hastalıkları', radType: 'eye', radTitle: 'ÖN SEGMENT MUAYENE',
      comp: 'Sabah iki gözüm sarı çapakla yapışmıştı ama görmem tamamen net.',
      vit: 'TA: 120/75 | Görme: 10/10 Tam', exam: 'Konjonktival hiperemi, kornea saydam.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Topikal antibiyotikli damla reçete edip taburcu et.' }
  ],
  cardio: [
    { diag: 'Akut Anterior STEMI', triage: 'red', action: 'admit', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: 'Sol koluma ve çeneme vuran sıkıştırıcı göğüs ağrısı 30 dakikadır geçmiyor, soğuk ter döküyorum!',
      vit: 'TA: 100/65 | Nabız: 108 | SpO2: %93', exam: 'S4 gallop ritmi.', pupil: 'İzokorik.',
      rad: 'V1-V5 derivasyonlarında dev ST ELEVASYONU!', labs: 'Troponin-I: 14.2 ng/mL', hint: 'Anterior STEMI! Primer anjiyo için Kardiyolojiye yatır.' },
    { diag: 'Akut İnferior STEMI + Sağ Ventrikül MI', triage: 'red', action: 'admit', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON + V4R EKG',
      comp: 'Mide yanması sandığım ağrıyla soğuk terleme ve baş dönmesi başladı, tansiyonum düştü!',
      vit: 'TA: 82/50 | Nabız: 52 | SpO2: %94', exam: 'Akciğerler temiz, boyun venleri dolgun (Kussmaul +)!', pupil: 'İzokorik.',
      rad: 'DII, DIII, aVF ve V4R derivasyonlarında ST elevasyonu!', labs: 'Troponin-I: 9.8 ng/mL', hint: 'Sağ ventrikül MI! Nitrat verme, IV sıvı ile Kardiyolojiye yatır.' },
    { diag: 'Anstabil Ventriküler Taşikardi (VT)', triage: 'red', action: 'treat', mg: 'cardioversion', treat: '100J Senkronize Kardiyoversiyon', srv: 'Kardiyoloji', radType: 'ecg', radTitle: 'MONİTÖR EKG',
      comp: 'Kalbim kuş gibi çırpınıyor, gözlerim kararıyor bayılmak üzereyim!',
      vit: 'TA: 70/40 | Nabız: 196/dk! | SpO2: %88', exam: 'Bilinç bulanık, nabızlar filiform.', pupil: 'İzokorik.',
      rad: 'Geniş QRS düzenli monomorfik VT!', labs: 'Potasyum: 3.1 mEq/L', hint: 'Hipotansif VT! Hemen 100J Senkronize Kardiyoversiyon mini-oyununu yap!' },
    { diag: 'Tam AV Blok (3. Derece)', triage: 'red', action: 'admit', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: 'Bugün iki kez aniden bayıldım, nabzım çok yavaş atıyor!',
      vit: 'TA: 88/52 | Nabız: 32/dk! | SpO2: %92', exam: 'Boyunda dev Cannon-A dalgaları.', pupil: 'İzokorik.',
      rad: 'P dalgaları ile QRS tamamen bağımsız (AV disosiasyon)!', labs: 'Elektrolitler normal.', hint: 'Geçici pacemaker için Kardiyolojiye yatır.' },
    { diag: 'Akut Dekompanse Kalp Yetmezliği', triage: 'red', action: 'treat', mg: 'iv', treat: 'IV Furosemid + Nitrogliserin + CPAP', srv: 'Kardiyoloji', radType: 'chest', radTitle: 'AKCİĞER GRAFİSİ',
      comp: 'Gece sırtüstü yatınca boğulur gibi uyandım, pembe köpüklü balgam çıkarıyorum!',
      vit: 'TA: 185/105 | Nabız: 124 | SpO2: %83', exam: 'Yaygın yaş raller + S3 gallop.', pupil: 'İzokorik.',
      rad: 'Kelebek kanadı tarzında pulmoner ödem!', labs: 'NT-proBNP: 18.500 pg/mL!', hint: 'Akut akciğer ödemi! IV diüretik & vazodilatör uygula.' },
    { diag: 'Kardiyak Tamponad (Beck Triadı)', triage: 'red', action: 'admit', srv: 'Kardiyoloji', radType: 'ecg', radTitle: 'EKG & YATAK BAŞI EKO',
      comp: 'Akciğer kanseri tedavisi görüyorum, nefesim daraldı ve tansiyonum düştü!',
      vit: 'TA: 76/48 | Nabız: 132 | Pulsus Paradoksus!', exam: 'Beck Triadı: Hipotansiyon + JVD + Derinden kalp sesleri.', pupil: 'İzokorik.',
      rad: 'Sağ ventrikül diyastolik kollapsı ve masif efüzyon!', labs: 'INR: 1.2', hint: 'Perikardiyosentez için Kardiyolojiye yatır.' },
    { diag: 'Tip A Aort Diseksiyonu', triage: 'red', action: 'admit', srv: 'Kardiyoloji', radType: 'chest', radTitle: 'TORAKS BT ANJİYO',
      comp: 'Sırtımda iki kürek kemiğimin arasında yırtılır gibi ani ve dayanılmaz ağrı başladı!',
      vit: 'Sağ Kol TA: 195/110 | Sol Kol TA: 135/80!', exam: '60 mmHg tansiyon farkı + aort üfürümü.', pupil: 'İzokorik.',
      rad: 'Çıkan aortada intimal flep — Tip A Diseksiyon!', labs: 'D-Dimer: 8.400 ng/mL', hint: 'Acil Kardiyoloji/KVC yatışı!' },
    { diag: 'Akut Perikardit (Viral)', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Yüksek Doz İbuprofen + Kolşisin', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: 'Öne eğilince hafifleyen, sırtüstü yatınca artan batıcı göğüs ağrım var.',
      vit: 'Ateş: 37.7°C | TA: 125/78 | Nabız: 92', exam: 'Perikardiyal frotman sesi!', pupil: 'İzokorik.',
      rad: 'Yaygın konkav ST elevasyonu ve PR çökmesi!', labs: 'Troponin negatif | CRP: 48', hint: 'Akut Perikardit! Antiinflamatuar tedavi uygula.' },
    { diag: 'SVT (Supraventriküler Taşikardi)', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Valsalva Manevrası + IV Adenozin', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: '6 kutu enerji içeceğinden sonra kalbim 185’le atmaya başladı ama tansiyonum iyi.',
      vit: 'TA: 122/80 | Nabız: 184/dk | SpO2: %98', exam: 'Düzenli çok hızlı kalp atımı.', pupil: 'İzokorik.',
      rad: 'Dar QRS düzenli taşikardi (SVT)!', labs: 'Troponin normal.', hint: 'Stabil SVT! IV Adenozin mini-oyunuyla ritmi kır.' },
    { diag: 'Kostokondrit (Kas-İskelet Ağrısı)', triage: 'green', action: 'discharge', srv: 'Kardiyoloji', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: 'Ağır koli taşıdıktan sonra göğsüme parmağımla basınca noktasal ağrı oluyor.',
      vit: 'TA: 118/76 | Nabız: 74 | SpO2: %99', exam: 'Kostokondral eklemde lokalize hassasiyet.', pupil: 'İzokorik.',
      rad: 'EKG tamamen normal sinüs ritmi.', labs: 'Troponin-I: Negatif.', hint: 'EKG ve Troponin normal. Analjezik yazıp taburcu et.' }
  ],
  emerg: [
    { diag: 'Tansiyon Pnömotoraks', triage: 'red', action: 'treat', mg: 'decon', treat: 'Sağ 2. İKA İğne Dekompresyonu', srv: 'Acil Resüsitasyon', radType: 'chest', radTitle: 'KLİNİK RESÜSİTASYON',
      comp: 'Motosiklet kazası geçirdim, sağ göğsüm şişti nefes alamıyorum!',
      vit: 'TA: 75/40 | Nabız: 138 | SpO2: %84', exam: 'Sağda solunum sesi YOK + Trakea sola deviye!', pupil: 'Boyun venleri şiş.',
      rad: 'Tansiyon Pnömotoraks! Röntgen beklemeden iğne dekompresyonu şart!', labs: 'Acil müdahale.', hint: 'Hemen İğne Dekompresyon mini-oyununu uygula!' },
    { diag: 'Anafilaktik Şok (Arı Sokması)', triage: 'red', action: 'treat', mg: 'iv', treat: '0.5 mg IM Adrenalin (Uyluk Dış Yanı)', srv: 'Acil Resüsitasyon', radType: 'ecg', radTitle: 'RESÜSİTASYON MONİTÖRÜ',
      comp: 'Eşek arısı soktu, 5 dakika içinde vücudum kabardı, dilim şişti, nefesim kesiliyor!',
      vit: 'TA: 68/38 | Nabız: 142 | SpO2: %85', exam: 'Yaygın ürtiker, stridor ve bronkospazm!', pupil: 'İzokorik.',
      rad: 'Anafilaktik Şok!', labs: 'Triptaz yüksek.', hint: 'İlk ilaç IM ADRENALİN! Müdahale et.' },
    { diag: 'Masif Pulmoner Emboli', triage: 'red', action: 'admit', srv: 'Acil Resüsitasyon', radType: 'chest', radTitle: 'TORAKS BT ANJİYO',
      comp: '12 saatlik otobüs yolculuğundan indikten sonra aniden nefesim kesildi ve bayıldım!',
      vit: 'TA: 78/46 | Nabız: 134 | SpO2: %82', exam: 'Sol baldırda şişlik + takipne (34/dk).', pupil: 'İzokorik.',
      rad: 'Ana pulmoner arterde EYER (Saddle) trombüsü!', labs: 'D-Dimer: 12.000', hint: 'Masif pulmoner emboli! Yoğun bakım/trombolitik için yatır.' },
    { diag: 'Diyabetik Ketoasidoz (DKA)', triage: 'red', action: 'admit', srv: 'Dahiliye / Yoğun Bakım', radType: 'ecg', radTitle: 'KAN GAZI & EKG',
      comp: 'Tip 1 diyabetliyim, 2 gündür insülin yapamadım; bulantı ve derin hızlı nefes almam var.',
      vit: 'TA: 95/60 | Nabız: 122 | Kussmaul Solunumu', exam: 'Ağızda aseton kokusu + ağır dehidratasyon.', pupil: 'İzokorik.',
      rad: 'Sinüs taşikardisi.', labs: 'Glukoz: 485 | pH: 7.12 | İdrar Keton: 4+!', hint: 'DKA! Dahiliye / Yoğun Bakıma yatır.' },
    { diag: 'Organofosfat Zehirlenmesi', triage: 'red', action: 'treat', mg: 'iv', treat: 'Yüksek Doz IV Atropin + Pralidoksim', srv: 'Acil Resüsitasyon', radType: 'chest', radTitle: 'TOKSİKOLOJİ',
      comp: 'Serada böcek ilacı sıktıktan sonra ağzımdan köpükler gelmeye ve terlemeye başladı!',
      vit: 'TA: 90/55 | Nabız: 46 | SpO2: %86', exam: 'Bronkore, kusma, hipersalivasyon (SLUDGE).', pupil: 'İğne ucu (Miyozis)!',
      rad: 'Akciğerde yaygın sekresyon.', labs: 'Psödokolinesteraz çok düşük!', hint: 'Kolinerjik kriz! IV Atropin uygula.' },
    { diag: 'Karbonmonoksit (Soba) Zehirlenmesi', triage: 'red', action: 'treat', mg: 'iv', treat: '%100 Oksijen + Hiperbarik O2', srv: 'Acil Resüsitasyon', radType: 'brain', radTitle: 'KAN GAZI & BEYİN BT',
      comp: 'Sabah soba yanan odada baş ağrısı, bulantı ve bilinç bulanıklığı ile bulundum!',
      vit: 'TA: 110/70 | Nabız: 116 | SpO2: %99 (Yanıltıcı!)', exam: 'Kiraz kırmızısı mukoza, konfüzyon.', pupil: 'İzokorik.',
      rad: 'Globus pallidus hipodansitesi.', labs: 'COHb: %34!', hint: 'COHb %34! Hemen %100 O2 müdahalesi uygula.' },
    { diag: 'Hiperkalemi (Diyaliz Hastası)', triage: 'red', action: 'treat', mg: 'iv', treat: 'IV Kalsiyum Glukonat + İnsülin/Dekstroz', srv: 'Acil Resüsitasyon', radType: 'ecg', radTitle: '12-DERİVASYON EKG',
      comp: 'Diyaliz seansımı kaçırdım ve bol muz/kayısı yedim; kollarımda uyuşma var!',
      vit: 'TA: 130/80 | Nabız: 48 | SpO2: %96', exam: 'Kas güçsüzlüğü ve hiporefleksi.', pupil: 'İzokorik.',
      rad: 'Sivri T dalgaları ve genişlemiş QRS!', labs: 'Potasyum (K+): 7.6 mEq/L!', hint: 'K+ 7.6 + EKG değişikliği! IV Kalsiyum Glukonat uygula.' },
    { diag: 'Sepsis / Septik Şok', triage: 'red', action: 'admit', srv: 'Dahiliye / Yoğun Bakım', radType: 'leg', radTitle: 'ÜRİNER USG',
      comp: '3 gündür idrar yanmam vardı, bugün tansiyonum çöktü ve sayıklıyorum!',
      vit: 'Ateş: 35.8°C | TA: 72/40 | Nabız: 136', exam: 'KVAH pozitif + benekli soğuk cilt.', pupil: 'İzokorik.',
      rad: 'Sol hidronefroz.', labs: 'Laktat: 5.4 | WBC: 24.000', hint: 'Septik şok! Dahiliye / Yoğun Bakıma yatır.' },
    { diag: 'Yelken Göğüs (Flail Chest)', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'chest', radTitle: 'TORAKS BT',
      comp: 'Direksiyon göğsüme çarptı, nefes alırken göğsümün sağ tarafı içeri çöküyor!',
      vit: 'TA: 105/65 | Nabız: 124 | SpO2: %87', exam: 'Paradoksal göğüs duvarı hareketi.', pupil: 'İzokorik.',
      rad: '4 komşu kostada çift taraflı kırık!', labs: 'Hipoksemi mevcut.', hint: 'Yelken Göğüs! Genel Cerrahi / Göğüs Cerrahisine yatır.' },
    { diag: 'Akut Ürtiker (Hafif Alerji)', triage: 'green', action: 'discharge', srv: 'Acil Resüsitasyon', radType: 'ecg', radTitle: 'FİZİK MUAYENE',
      comp: 'Çilek yedikten sonra kollarımda kaşıntılı kızarıklıklar çıktı; nefes darlığım yok.',
      vit: 'TA: 120/78 | Nabız: 80 | SpO2: %99', exam: 'Akciğerler temiz, uvula ödemi yok.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Anafilaksi yok. Antihistaminik yazıp taburcu et.' }
  ],
  neuro: [
    { diag: 'Akut İskemik İnme (İlk 4.5 Saat)', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'KONTRATSIZ BEYİN BT',
      comp: '40 dakika önce konuşmam peltekleşti, sol kolum ve bacağım tutmaz oldu!',
      vit: 'TA: 168/92 | Nabız: 88 | NIHSS: 14', exam: 'Sol hemiparezi.', pupil: 'İzokorik.',
      rad: 'Beyin BT’de KANAMA YOK! Sağ MCA hiperdens arter işareti!', labs: 'INR: 1.0 (tPA uygun).', hint: 'IV Trombolitik (tPA) için Nörolojiye yatır.' },
    { diag: 'Epidural Hematom', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'BEYİN BT',
      comp: 'Kafama darbe aldım, 5 dk bayılıp ayıldım ama şimdi şiddetli baş ağrısıyla uykuya meyil başladı!',
      vit: 'TA: 175/100 | Nabız: 54 | GKS: 11', exam: 'Sağ temporal hassasiyet.', pupil: 'ANİZOKORİ (Sağ pupilla dilate)!',
      rad: 'BİKONVEKS (mercek şeklinde) hiperdens hematom!', labs: 'Koagülasyon normal.', hint: 'Lucid interval + Bikonveks hematom! Beyin Cerrahiye yatır.' },
    { diag: 'Subaraknoid Kanama (SAK)', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'BEYİN BT',
      comp: 'Başımın arkasında hayatımın en şiddetli, balyoz vurulmuş gibi ani ağrısı patladı!',
      vit: 'TA: 190/105 | Ense Sertliği: POZİTİF', exam: 'Kernig ve Brudzinski pozitif.', pupil: 'İzokorik.',
      rad: 'Bazal sisternalarda yıldız şeklinde kanama!', labs: 'Troponin hafif yüksek.', hint: 'SAK! Beyin Cerrahiye yatır.' },
    { diag: 'Status Epileptikus', triage: 'red', action: 'treat', mg: 'iv', treat: 'IV Diazepam / Midazolam + Levetirasetam', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'ACİL NÖRO PROTOKOL',
      comp: 'Hastamız 15 dakikadır bilinci açılmadan arka arkaya kasılıp nöbet geçiriyor!',
      vit: 'TA: 160/95 | Nabız: 138 | SpO2: %88', exam: 'Jeneralize tonik-klonik kasılmalar.', pupil: 'Midriyatik.',
      rad: 'Nöbet durduktan sonra BT çekilecek.', labs: 'Kan şekeri: 110 mg/dL.', hint: 'Hemen IV Benzodiazepin müdahalesi yap!' },
    { diag: 'Akut Bakteriyel Menenjit', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'BOS & BEYİN BT',
      comp: 'Yüksek ateş, fışkırır kusma, fotofobi ve ense sertliği ile getirildim!',
      vit: 'Ateş: 39.6°C | TA: 105/65 | Nabız: 124', exam: 'Ense sertliği + bacaklarda peteşiler!', pupil: 'İzokorik.',
      rad: 'Beyin BT normal.', labs: 'BOS: Pürülan, Glukoz: 18, Protein: 240!', hint: 'IV Seftriakson + Vankomisin ile Nörolojiye yatır.' },
    { diag: 'Guillain-Barré Sendromu', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'BOS & EMG',
      comp: 'İshal sonrası ayaklarımda başlayan güçsüzlük bugün dizlerime ve kalçama çıktı!',
      vit: 'TA: 135/85 | Vital Kapasite Düşüyor', exam: 'Simetrik flask paralizi + DTR KAYIP!', pupil: 'İzokorik.',
      rad: 'Spinal MR normal.', labs: 'BOS: Albüminositolojik disosiasyon!', hint: 'Solunum kasları tutulmadan Nörolojiye yatır.' },
    { diag: 'Myastenia Gravis Krizi', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'chest', radTitle: 'TORAKS BT',
      comp: 'Göz kapaklarım düştü, yutkunamıyorum ve nefesim yetmiyor!',
      vit: 'TA: 140/85 | SpO2: %87', exam: 'Bilateral pitozis + bulber güçsüzlük.', pupil: 'Pupillalar normal.',
      rad: 'Timoma mevcut.', labs: 'AChR antikoru pozitif.', hint: 'Myastenik kriz! Plazmaferez/IVIG için Nörolojiye yatır.' },
    { diag: 'Subdural Hematom', triage: 'red', action: 'admit', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'BEYİN BT',
      comp: 'Kan sulandırıcı kullanıyorum; 2 hafta önce başımı çarpmıştım, bugün sağ kolumda güçsüzlük başladı.',
      vit: 'TA: 150/85 | GKS: 13', exam: 'Sağ pronator drift pozitif.', pupil: 'İzokorik.',
      rad: 'Sol hemisfer boyunca HİLAL (konkav) şeklinde hematom!', labs: 'INR: 3.4!', hint: 'Subdural Hematom! Beyin Cerrahiye yatır.' },
    { diag: 'Bell Paralizisi', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Oral Prednizolon + Göz Koruma', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'NÖROLOJİK MUAYENE',
      comp: 'Rüzgârda kaldıktan sonra yüzümün sağ tarafı kaydı, sağ gözümü kapatamıyorum ve alnımı kırıştıramıyorum!',
      vit: 'TA: 124/78 | Güç Kaybı Yok', exam: 'Alın dahil yüzün sağ yarısında tam paralizi.', pupil: 'İzokorik.',
      rad: 'Santral bulgu yok.', labs: 'Normal.', hint: 'Periferik yüz felci (Bell)! Kortikosteroid uygula.' },
    { diag: 'Gerilim Tipi Baş Ağrısı', triage: 'green', action: 'discharge', srv: 'Nöroloji / Beyin Cerrahi', radType: 'brain', radTitle: 'FİZİK MUAYENE',
      comp: 'Uykusuzluktan başımın etrafını mengene gibi sıkan hafif ağrım var, bulantı veya ateş yok.',
      vit: 'TA: 120/76 | Ateş: 36.6°C', exam: 'Nörolojik muayene normal.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Kırmızı bayrak yok. Basit analjezikle taburcu et.' }
  ],
  ortho: [
    { diag: 'Akut Kompartman Sendromu', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'leg', radTitle: 'KOMPARTMAN BASINCI',
      comp: 'Dün alçıya alınan bacağımda morfinle bile geçmeyen zonklayıcı ağrı ve uyuşma başladı!',
      vit: 'TA: 145/90 | Basınç: 46 mmHg!', exam: 'Pasif ayak parmağı germeyle şiddetli ağrı!', pupil: 'İzokorik.',
      rad: 'Akut Kompartman Sendromu! Acil fasyotomi!', labs: 'CK: 14.200 U/L', hint: 'Acil fasyotomi için Ortopediye yatır!' },
    { diag: 'Açık Tibia Kırığı (Gustilo Tip III)', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'leg', radTitle: 'KRURİS RÖNTGENİ',
      comp: 'Trafik kazası sonrası kaval kemiğim deriyi yırtıp dışarı çıktı!',
      vit: 'TA: 95/60 | Nabız: 124', exam: '8 cm açık yara, kemik ekspoze.', pupil: 'İzokorik.',
      rad: 'Tibia ve fibula parçalı deplase kırık.', labs: 'Hb: 9.8 g/dL', hint: 'IV Sefazolin + Tetanoz ile Ortopediye yatır.' },
    { diag: 'Kauda Equina Sendromu', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'brain', radTitle: 'LOMBER MR',
      comp: 'Bel fıtığım vardı, bacaklarım tutmuyor, apış aram uyuştu ve idrarımı tutamıyorum!',
      vit: 'TA: 138/84 | Rezidü İdrar: 650 mL', exam: 'Eyer tarzı (Saddle) anestezi!', pupil: 'İzokorik.',
      rad: 'L4-L5 dev santral disk hernisi ve kauda basısı!', labs: 'Normal.', hint: 'Acil cerrahi dekompresyon için Ortopediye yatır!' },
    { diag: 'Septik Artrit (Diz)', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'leg', radTitle: 'EKLEM PONKSİYONU',
      comp: 'Sağ dizim şişti, kızardı, ateşle birlikte milim bile oynatamıyorum!',
      vit: 'Ateş: 39.1°C | Nabız: 114', exam: 'Dizde ısı artışı ve şiddetli hareket kısıtlılığı.', pupil: 'İzokorik.',
      rad: 'Yoğun eklem içi efüzyon.', labs: 'Artrosentez WBC: 88.000/mm3!', hint: 'Septik Artrit! Eklem yıkaması için Ortopediye yatır.' },
    { diag: 'Posterior Diz Çıkığı', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'leg', radTitle: 'DİZ GRAFİSİ & ANJİYO',
      comp: 'Kazada dizim yerinden çıktı ve ayağım soğudu!',
      vit: 'TA: 105/68 | Ayak Nabzı: YOK!', exam: 'Dizde deformite, ayak soluk.', pupil: 'İzokorik.',
      rad: 'Posterior diz çıkığı + popliteal arter oklüzyonu!', labs: 'Pre-op hazır.', hint: 'Damar yaralanması var! Acil Ortopediye yatır.' },
    { diag: 'Yağ Embolisi Sendromu', triage: 'red', action: 'admit', srv: 'Ortopedi', radType: 'chest', radTitle: 'TORAKS BT',
      comp: 'Dün uyluk kemiğim kırıldı, bugün nefesim daraldı ve göğsümde kırmızı noktalar çıktı!',
      vit: 'Ateş: 38.6°C | SpO2: %83', exam: 'Konfüzyon + takipne + aksiller peteşiler!', pupil: 'İzokorik.',
      rad: 'Yaygın buzlu cam (kar fırtınası) görünümü!', labs: 'Trombosit: 78.000', hint: 'Yağ Embolisi! Ortopedi/YBÜ’ye yatır.' },
    { diag: 'Anterior Omuz Çıkığı', triage: 'yellow', action: 'treat', mg: 'fracture', treat: 'Sedasyon Altında Kapalı Omuz Redüksiyonu', srv: 'Ortopedi', radType: 'chest', radTitle: 'OMUZ AP GRAFİSİ',
      comp: 'Halı sahada kolumun üzerine düştüm, sağ omzum çöktü!',
      vit: 'TA: 135/85 | Aksiller Sinir: Sağlam', exam: 'Apolet belirtisi pozitif; radyal nabız güçlü.', pupil: 'İzokorik.',
      rad: 'Subkorakoid anterior çıkık (kırık yok).', labs: 'Gerekmedi.', hint: 'Kırık yok! Redüksiyon mini-oyunuyla yerine oturt.' },
    { diag: 'Femur Boyun Kırığı', triage: 'yellow', action: 'admit', srv: 'Ortopedi', radType: 'leg', radTitle: 'PELVİS GRAFİSİ',
      comp: '80 yaşındayım, evde halıya takılıp kalçamın üzerine düştüm!',
      vit: 'TA: 145/85 | Nabız: 88', exam: 'Sağ bacak KISA ve DIŞA ROTASYONDA!', pupil: 'İzokorik.',
      rad: 'Deplase femur boyun kırığı!', labs: 'Hb: 11.4', hint: 'Kalça kırığı! Ortopediye yatır.' },
    { diag: 'Deplase Tibia Kırığı (Kapalı)', triage: 'yellow', action: 'treat', mg: 'fracture', treat: 'Kapalı Redüksiyon + Uzun Bacak Atel', srv: 'Ortopedi', radType: 'leg', radTitle: 'KRURİS RÖNTGENİ',
      comp: 'Halı sahada şut çekerken kaval kemiğimden çatırt diye ses geldi!',
      vit: 'TA: 130/80 | Distal Nabızlar: Açık', exam: 'Sağ kruriste kapalı deformite.', pupil: 'İzokorik.',
      rad: 'Tibia distalde kapalı oblik kırık!', labs: 'Normal.', hint: 'Redüksiyon mini-oyunuyla kemiği hizalayıp atele al!' },
    { diag: 'Grade 1 Ayak Bileği Burkulması', triage: 'green', action: 'discharge', srv: 'Ortopedi', radType: 'leg', radTitle: 'OTTAWA MUAYENESİ',
      comp: 'Kaldırımdan inerken bileğim burkuldu; üzerine basıp 4 adım yürüyebiliyorum.',
      vit: 'TA: 118/74 | Nabız: 76', exam: 'Kemik hassasiyeti yok (Ottawa negatif).', pupil: 'İzokorik.',
      rad: 'Grafi gerekmedi.', labs: 'Gerekmedi.', hint: 'RICE + elastik bandaj ile taburcu et.' }
  ],
  peds: [
    { diag: 'Akut Epiglottit (Çocuk Acil)', triage: 'red', action: 'admit', srv: 'Pediatri', radType: 'chest', radTitle: 'YAN BOYUN GRAFİSİ',
      comp: '4 yaşındaki oğlumun ateşi 40 oldu, ağzından salya akıyor ve öne eğilip boğulur gibi nefes alıyor!',
      vit: 'Ateş: 39.9°C | Nabız: 148 | SpO2: %89', exam: 'Tripod pozisyonu + salya akması.', pupil: 'İzokorik.',
      rad: 'BAŞPARMAK İŞARETİ (Thumbprint Sign)!', labs: 'Acil hava yolu.', hint: 'Boğazına abeslangla bakma! Pediatri yoğun bakıma yatır.' },
    { diag: 'İnvajinasyon (Çilek Jölesi Dışkı)', triage: 'red', action: 'admit', srv: 'Pediatri', radType: 'leg', radTitle: 'BATIN USG',
      comp: '10 aylık bebeğim bacaklarını karnına çekip ağlıyor, bezinde çilek jölesi gibi kanlı kaka var!',
      vit: 'Ateş: 37.6°C | Nabız: 144', exam: 'Sağ üst kadranda sucuk şeklinde kitle!', pupil: 'İzokorik.',
      rad: 'HEDEF TAHTASI (Target Sign) görünümü!', labs: 'WBC: 14.200', hint: 'İnvajinasyon! Pediatriye yatır.' },
    { diag: 'Yabancı Cisim Aspirasyonu', triage: 'red', action: 'admit', srv: 'Pediatri', radType: 'chest', radTitle: 'EKSPİRYUM GRAFİSİ',
      comp: '2 yaşındaki kızım kuruyemiş yerken morardı, şimdi sağ göğsünden ıslık sesi geliyor!',
      vit: 'Nabız: 140 | SpO2: %88', exam: 'Tek taraflı wheezing ve ses azalması!', pupil: 'İzokorik.',
      rad: 'Sağ akciğerde hava hapsi ve mediastinal şift!', labs: 'Acil bronkoskopi.', hint: 'Rijit bronkoskopi için Pediatriye yatır.' },
    { diag: 'Düğme Pil Yutulması', triage: 'red', action: 'admit', srv: 'Pediatri', radType: 'chest', radTitle: 'TORAKS RÖNTGENİ',
      comp: '3 yaşındaki çocuğum kumandanın yuvarlak düğme pilini 1 saat önce yuttu!',
      vit: 'Nabız: 128 | SpO2: %98', exam: 'Yutkunma güçlüğü.', pupil: 'İzokorik.',
      rad: 'Özofagus üst darlıkta ÇİFT HALE işaretli düğme pil!', labs: 'Acil endoskopi.', hint: '2 saatte özofagusu deler! Acil Pediatriye yatır.' },
    { diag: 'Meningokoksemi', triage: 'red', action: 'admit', srv: 'Pediatri', radType: 'brain', radTitle: 'KLİNİK RESÜSİTASYON',
      comp: '5 yaşındaki çocuğumun ateşi 40 oldu, bacaklarında basmakla solmayan mor lekeler yayıldı!',
      vit: 'Ateş: 40.1°C | TA: 70/38 | Nabız: 162', exam: 'Solmayan peteşi/purpura + şok!', pupil: 'İzokorik.',
      rad: 'Klinik acil.', labs: 'Trombosit: 42.000 | Laktat: 6.1', hint: 'IV Seftriakson + sıvı ile Pediatriye yatır!' },
    { diag: 'Hipertrofik Pilor Stenozu', triage: 'yellow', action: 'admit', srv: 'Pediatri', radType: 'leg', radTitle: 'BATIN USG',
      comp: '5 haftalık erkek bebeğim her beslenmeden sonra safrasız fışkırır kusuyor ve sürekli aç!',
      vit: 'Nabız: 138 | Dehidratasyon', exam: 'Epigastriumda ZEYTİN (Olive) kitle!', pupil: 'İzokorik.',
      rad: 'Pilor kas kalınlığı 4.5 mm!', labs: 'Hipokloremik metabolik alkaloz!', hint: 'Pediatri / Çocuk Cerrahisine yatır.' },
    { diag: 'Kawasaki Hastalığı', triage: 'yellow', action: 'admit', srv: 'Pediatri', radType: 'ecg', radTitle: 'PEDİATRİK EKO',
      comp: '6 gündür düşmeyen 39.5 ateşi var; gözleri kıpkırmızı, dudakları çilek gibi ve elleri şiş!',
      vit: 'Ateş: 39.4°C | Nabız: 142', exam: 'Çilek dili, konjonktivit, servikal LAP.', pupil: 'İzokorik.',
      rad: 'Koroner arter anevrizması riski.', labs: 'CRP: 140 | Trombosit: 680.000!', hint: 'IVIG + Aspirin için Pediatriye yatır!' },
    { diag: 'Akut Krup', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Tek Doz Deksametazon + Nebülize Adrenalin', srv: 'Pediatri', radType: 'chest', radTitle: 'ÖN-ARKA BOYUN GRAFİSİ',
      comp: '2 yaşındaki oğlum gece havlar tarzda kuru öksürük ve ıslık sesiyle uyandı!',
      vit: 'Ateş: 38.1°C | SpO2: %94', exam: 'İnspiratuar stridor; salya akması YOK.', pupil: 'İzokorik.',
      rad: 'ÇAN KULESİ (Steeple Sign) görünümü!', labs: 'Viral.', hint: 'Deksametazon + Nebülize Adrenalin uygula.' },
    { diag: 'Basit Febril Konvülziyon', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Ateş Düşürücü + Gözlem', srv: 'Pediatri', radType: 'brain', radTitle: 'KLİNİK TAKİP',
      comp: '18 aylık bebeğim 39.2 ateşle 2 dk nöbet geçirdi, şimdi uyandı ve gülüyor!',
      vit: 'Ateş: 39.1°C | SpO2: %99', exam: 'Fokal bulgu yok, ense sertliği yok.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Rutin tetkik gerekmez.', hint: 'Basit febril konvülziyon! Ateşi düşür ve gözlemle.' },
    { diag: 'Hafif Viral Gastroenterit', triage: 'green', action: 'discharge', srv: 'Pediatri', radType: 'leg', radTitle: 'FİZİK MUAYENE',
      comp: '4 yaşındaki kızım 4 kez sulu kaka yaptı ama su içebiliyor ve keyfi yerinde.',
      vit: 'Ateş: 37.4°C | Gözyaşı Mevcut', exam: 'Mukozalar nemli, dehidratasyon yok.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'ORS sıvısı önerip taburcu et.' }
  ],
  ent: [
    { diag: 'Peritonsiller Apse (Quinsy)', triage: 'red', action: 'admit', srv: 'KBB', radType: 'brain', radTitle: 'BOYUN BT',
      comp: 'Boğaz ağrım 4 gündür arttı, ağzımı açamıyorum ve sesim sıcak patates yutmuş gibi boğuk!',
      vit: 'Ateş: 39.0°C | Trismus: POZİTİF', exam: 'Sağ tonsil itilmiş, uvula sola deviye!', pupil: 'İzokorik.',
      rad: '3.5 cm peritonsiller apse!', labs: 'WBC: 19.400', hint: 'Drenaj için KBB’ye yatır.' },
    { diag: 'Ludwig Anjini', triage: 'red', action: 'admit', srv: 'KBB', radType: 'chest', radTitle: 'BOYUN BT & HAVA YOLU',
      comp: 'Çenemin altı taş gibi şişti ve dilim yukarı doğru itilip nefesimi tıkıyor!',
      vit: 'Ateş: 39.3°C | SpO2: %89', exam: 'Submandibular odunsu sertlik + dil elevasyonu!', pupil: 'İzokorik.',
      rad: 'Ağız tabanında flegmon ve hava yolu daralması!', labs: 'WBC: 23.800', hint: 'Acil hava yolu güvenliği için KBB’ye yatır.' },
    { diag: 'Posterior Epistaksis', triage: 'red', action: 'admit', srv: 'KBB', radType: 'ecg', radTitle: 'KOAGÜLASYON & VİTAL',
      comp: '1 saattir burnumdan ve genzimden oluk oluk kan geliyor, ön tamponla durmadı!',
      vit: 'TA: 195/110 | Nabız: 118', exam: 'Orofarenks arka duvarında aktif kanama.', pupil: 'İzokorik.',
      rad: 'Posterior arter kanaması.', labs: 'Hb: 9.4 | INR: 1.3', hint: 'Posterior balon tamponad için KBB’ye yatır.' },
    { diag: 'Akut Mastoidit', triage: 'red', action: 'admit', srv: 'KBB', radType: 'brain', radTitle: 'TEMPORAL BT',
      comp: 'Kulak iltihabı sonrası kulağımın arkası şişti ve kepçe kulağım öne itildi!',
      vit: 'Ateş: 38.9°C | Nabız: 110', exam: 'Postauriküler flüktüasyon.', pupil: 'İzokorik.',
      rad: 'Mastoid hava hücrelerinde kemik yıkımı!', labs: 'WBC: 18.200', hint: 'KBB’ye yatır.' },
    { diag: 'Septal Hematom', triage: 'yellow', action: 'treat', mg: 'decon', treat: 'Acil İnsizyon & Hematom Drenajı', srv: 'KBB', radType: 'brain', radTitle: 'ANTERİOR RİNOSKOPİ',
      comp: 'Maçta burnuma dirsek geldi, iki burun deliğim de mor şişlikle kapandı!',
      vit: 'TA: 122/78 | Nabız: 80', exam: 'Nazal septumda flüktüan mor şişlik!', pupil: 'İzokorik.',
      rad: 'Nazal kırık eşlik ediyor.', labs: 'Normal.', hint: 'Semer burun gelişmeden hemen drene et!' },
    { diag: 'Ani İdiyopatik İşitme Kaybı', triage: 'yellow', action: 'treat', mg: 'iv', treat: 'Yüksek Doz Sistemik Steroid', srv: 'KBB', radType: 'brain', radTitle: 'ODYOMETRİ',
      comp: 'Sabah uyandığımda sol kulağım hiç duymuyordu ve şiddetli çınlama başladı!',
      vit: 'TA: 125/80 | Weber: SAĞA Lateralize', exam: 'Otoskopi normal.', pupil: 'İzokorik.',
      rad: '45 dB sensörinöral işitme kaybı!', labs: 'Normal.', hint: 'Erken steroid tedavisi uygula!' },
    { diag: 'BPPV (Pozisyonel Vertigo)', triage: 'green', action: 'treat', mg: 'decon', treat: 'Epley Repozisyon Manevrası', srv: 'KBB', radType: 'brain', radTitle: 'DİX-HALLPİKE TESTİ',
      comp: 'Yatakta sağa dönünce 25 saniye süren baş dönmesi oluyor; işitme kaybım yok.',
      vit: 'TA: 126/78 | Nabız: 82', exam: 'Dix-Hallpike rotatuar nistagmus (+)!', pupil: 'İzokorik.',
      rad: 'Serebellar testler normal.', labs: 'Gerekmedi.', hint: 'Epley manevrası uygula!' },
    { diag: 'Dış Kulak Yolunda Canlı Böcek', triage: 'yellow', action: 'treat', mg: 'decon', treat: 'Lidokain Damla + Mikroaspirasyon', srv: 'KBB', radType: 'brain', radTitle: 'OTOSKOPİ',
      comp: 'Kampta uyurken kulağıma böcek kaçtı, içeride kıpırdıyor çıldıracağım!',
      vit: 'TA: 135/85 | Nabız: 98', exam: 'Timpanik zar önünde canlı böcek.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Önce lidokain ile hareketsizleştirip çıkar!' },
    { diag: 'Akut Bakteriyel Rinosinüzit', triage: 'green', action: 'discharge', srv: 'KBB', radType: 'brain', radTitle: 'KLİNİK MUAYENE',
      comp: '10 gündür sarı-yeşil burun akıntım ve yüzümde basınç ağrım var.',
      vit: 'Ateş: 38.2°C | Nabız: 86', exam: 'Maksiller hassasiyet.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Antibiyotik + nazal yıkama reçete edip taburcu et.' },
    { diag: 'Buşon (Kulak Kiri)', triage: 'green', action: 'discharge', srv: 'KBB', radType: 'brain', radTitle: 'OTOSKOPİ',
      comp: 'Denize girdikten sonra sol kulağım tıkandı, ağrı yok.',
      vit: 'TA: 118/74', exam: 'Dış kulak yolunu tıkayan koyu serümen.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'Gliserin damla yazıp taburcu et.' }
  ],
  surg: [
    { diag: 'Akut Apandisit', triage: 'yellow', action: 'admit', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'BATIN USG',
      comp: 'Dün göbeğim ağrıyordu bugün sağ alt karnıma indi, iştahım kesildi ve kustum.',
      vit: 'Ateş: 37.9°C | Nabız: 102', exam: 'McBurney defans, rebound ve Rovsing POZİTİF!', pupil: 'İzokorik.',
      rad: '11 mm inflame apendiks!', labs: 'WBC: 16.400', hint: 'Genel Cerrahiye yatır.' },
    { diag: 'Peptik Ülser Perforasyonu', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'chest', radTitle: 'AYAKTA DİREKT KARIN GRAFİSİ',
      comp: 'Mide ülserim vardı, 1 saat önce karnımda bıçak saplanır gibi ani ağrı başladı!',
      vit: 'TA: 95/60 | Nabız: 124', exam: 'TAHTA KARIN (yaygın rijidite)!', pupil: 'İzokorik.',
      rad: 'Sağ diyafram altında SERBEST HAVA (Pnömoperitoneum)!', labs: 'WBC: 18.900', hint: 'Acil laparotomi için Genel Cerrahiye yatır.' },
    { diag: 'Akut Mezenter İskemisi', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'brain', radTitle: 'BATIN BT ANJİYO',
      comp: 'Kalp ritim bozukluğum var; korkunç göbek ağrım var ama karnıma basınca o kadar acımıyor!',
      vit: 'TA: 92/58 | Nabız: 128 (AF)', exam: 'Muayeneyle orantısız şiddetli ağrı!', pupil: 'İzokorik.',
      rad: 'SMA proksimalinde trombüs!', labs: 'Laktat: 6.8 mmol/L!', hint: 'Mezenter iskemisi! Genel Cerrahiye yatır.' },
    { diag: 'Strangüle İnguinal Herni', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'KASIK USG & GRAFİ',
      comp: 'Kasık fıtığım içeri girmiyor, üzeri kızardı ve safralı kusuyorum!',
      vit: 'Ateş: 38.4°C | Nabız: 118', exam: 'İrredüktabl, hiperemik hassas kitle.', pupil: 'İzokorik.',
      rad: 'Hava-sıvı seviyeleri (İleus).', labs: 'Laktat: 3.4', hint: 'Zorla itme, acil Genel Cerrahiye yatır.' },
    { diag: 'Akut Kolanjit (Reynolds)', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'HEPATOBİLİYER USG',
      comp: 'Safra taşım vardı; 39.5 ateş, sağ üst karın ağrısı ve gözlerimde sarılık başladı!',
      vit: 'Ateş: 39.5°C | TA: 85/50 | Nabız: 130', exam: 'Skleral ikter + Murphy (+) + konfüzyon.', pupil: 'İzokorik.',
      rad: 'Koledok 14 mm genişlemiş ve distalde taş!', labs: 'Bilirubin: 8.4 | WBC: 21.000', hint: 'Acil ERCP için Genel Cerrahiye yatır.' },
    { diag: 'Akut Biliyer Pankreatit', triage: 'yellow', action: 'admit', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'BATIN USG',
      comp: 'Yağlı yemek sonrası sırtıma kuşak tarzında vuran şiddetli ağrı ve durmayan kusmam var!',
      vit: 'TA: 108/66 | Nabız: 114', exam: 'Epigastrik hassasiyet.', pupil: 'İzokorik.',
      rad: 'Safra taşları + ödemli pankreas.', labs: 'Lipaz: 2.100 U/L (>3 kat)!', hint: 'Agresif hidrasyon için Genel Cerrahiye yatır.' },
    { diag: 'Akut Kolesistit', triage: 'yellow', action: 'admit', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'BATIN USG',
      comp: '6 saattir sağ kaburgamın altında geçmeyen ağrı, bulantı ve ateşim var!',
      vit: 'Ateş: 38.3°C | Nabız: 100', exam: 'Murphy bulgusu POZİTİF!', pupil: 'İzokorik.',
      rad: 'Safra kesesi duvarı 6 mm + impakte taş!', labs: 'WBC: 14.900', hint: 'Genel Cerrahiye yatır.' },
    { diag: 'Dalak Rüptürü (Kehr +)', triage: 'red', action: 'admit', srv: 'Genel Cerrahi', radType: 'chest', radTitle: 'FAST USG',
      comp: 'Bisikletten düşüp sol böğrümü çarptım, sol omzumun ucuna ağrı vuruyor ve başım dönüyor!',
      vit: 'TA: 80/48 | Nabız: 136', exam: 'Sol üst kadran hassasiyeti + Kehr bulgusu.', pupil: 'İzokorik.',
      rad: 'FAST USG: Batında bol serbest sıvı!', labs: 'Hb: 8.1 g/dL!', hint: 'Acil splenektomi için Genel Cerrahiye yatır.' },
    { diag: 'Tromboze Eksternal Hemoroid', triage: 'yellow', action: 'treat', mg: 'decon', treat: 'Lokal Anestezi ile Trombüs Eksizyonu', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'ANAL MUAYENE',
      comp: 'Dünden beri makatımda aniden çıkan mor renkli çok ağrılı şişlik var!',
      vit: 'TA: 132/82 | Ateş: 36.7°C', exam: '1.5 cm gergin tromboze eksternal hemoroid.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Gerekmedi.', hint: 'İlk 72 saatte lokal eksizyon yap!' },
    { diag: 'Fonksiyonel Dispepsi / Gastrit', triage: 'green', action: 'discharge', srv: 'Genel Cerrahi', radType: 'leg', radTitle: 'FİZİK MUAYENE',
      comp: 'Açken mide kazınması oluyor; kilo kaybı, kanama veya siyah dışkı yok.',
      vit: 'TA: 118/74 | Ateş: 36.6°C', exam: 'Batın rahat, melena yok.', pupil: 'İzokorik.',
      rad: 'Gerekmedi.', labs: 'Hb: 14.1', hint: 'PPI reçete edip taburcu et.' }
  ]
};

/* 320 Uzmanlık Vakası + 20 Özel Etik/Salgın/Beyaz Kod Vakası = 340 BENZERSİZ VAKA */
function buildAllCases() {
  const list = [];
  const firstNames = ['Ahmet','Fatma','Mehmet','Ayşe','Mustafa','Emine','Ali','Zeynep','Hasan','Elif','Murat','Selin','Kaan','Bora','İrem','Tolga','Deniz','Ceren','Burak','Merve','Onur','Ebru','Serkan','Gülşen','Yusuf','Seda','Emre','Büşra','Hakan','Derya','Tarık','Aslı','Cem','Nihal','Volkan','Pınar','Sinan','Özge','Erkan','Gamze'];
  const lastNames = ['Yılmaz','Kaya','Demir','Çelik','Şahin','Yıldız','Aydın','Öztürk','Arslan','Doğan'];
  const contexts = ['Nöbetin yoğun saatinde sedyeyle getirildi.','Yakınlarının kolunda başvurdu.','112 Acil ekibi teslim etti.','Gece yarısı şikâyetleri şiddetlenince gelmiş.'];

  let gid = 1;
  Object.keys(SPECIALTY_BLUEPRINTS).forEach((specKey, sIdx) => {
    const bps = SPECIALTY_BLUEPRINTS[specKey];
    for (let v = 0; v < 4; v++) {
      bps.forEach((bp, bIdx) => {
        const idx = v * 10 + bIdx;
        const fn = firstNames[(idx + sIdx * 3) % firstNames.length];
        const ln = lastNames[(idx + v * 2 + sIdx) % lastNames.length];
        const age = specKey === 'peds' ? (1 + ((idx * 3 + v) % 11)) : (21 + ((idx * 7 + v * 5 + sIdx * 3) % 58));

        list.push({
          id: `vaka_${gid++}_${specKey}`, spec: specKey, name: `${fn} ${ln} (${age})`, triage: bp.triage,
          pitch: specKey === 'peds' ? 420 : (age > 55 ? 210 : 310),
          appearance: {
            skin: (idx + v) % 2 === 0 ? '#f1c2a5' : '#d8a484',
            hair: age > 55 ? '#ced4da' : (idx % 3 === 0 ? '#4a3222' : '#1f1610'),
            shirt: ['#1971c2','#2f9e44','#d6336c','#e67700','#5f3dc4','#0ca678','#c92a2a','#364fc7'][(idx + sIdx) % 8],
            flush: bp.triage === 'red', sweat: bp.triage !== 'green',
            cyanosis: bp.vit.includes('82') || bp.vit.includes('83') || bp.vit.includes('84'),
            pupils: bp.pupil.includes('ANİZOKORİ') ? 'anisocoria' : (bp.pupil.includes('Miyozis') ? 'miosis' : (bp.pupil.includes('dilate') ? 'midriasis_fixed' : 'normal'))
          },
          complaint: `${bp.comp}\n[Not: ${contexts[v]}]`,
          vitals: bp.vit, lung: bp.exam, pupil: bp.pupil,
          radType: bp.radType || 'chest', radTitle: bp.radTitle || 'GÖRÜNTÜLEME', radFinding: bp.rad, labs: bp.labs,
          enabiz: idx % 5 === 0 ? `DİKKAT: Penisilin/NSAİİ hassasiyeti kaydı mevcut!` : 'Bilinen ilaç alerjisi yok.',
          correctAction: bp.action, targetService: bp.srv, targetReason: bp.diag,
          miniGame: bp.mg || null, treatLabel: bp.treat || 'Müdahale Et', hint: bp.hint
        });
      });
    }
  });

  // 20 Özel Etik / Salgın Karantina / Beyaz Kod / Rüşvet Vakası
  for (let s = 0; s < 20; s++) {
    const fn = firstNames[(s * 2) % firstNames.length];
    const mode = s % 3;
    if (mode === 0) {
      list.push({
        id: `spec_bribe_${s}`, spec: 'general', name: `${fn} (${30 + s})`, triage: 'yellow', pitch: 280,
        appearance: { skin: '#dfb195', hair: '#212529', shirt: '#343a40', flush: false, sweat: true, pupils: 'miosis' },
        complaint: 'Böbrek taşım düştü ölüyorum, bana hemen kırmızı reçeteli morfin yaz, çorbana bakarız...',
        vitals: 'TA: 110/70 | Nabız: 62 | Solunum: 10/dk', lung: 'Solunum yüzeysel.', pupil: 'TOPLU İĞNE BAŞI PUPILLA (MİYOZİS)!',
        radType: 'leg', radTitle: 'ÜRİNER GRAFİ', radFinding: 'Böbrek taşı saptanmadı.', labs: 'İdrar tamamen temiz!',
        enabiz: 'SON 1 AYDA 7 FARKLI ACİLDEN NARKOTİK İLAÇ TALEBİ!',
        bribe: { amount: 2200, text: 'Masanın altına 2.200₺ zarf uzattı: "Yaz şu morfin reçetesini hocam ikimiz de kazanalım."' },
        correctAction: 'police', targetService: 'Adli Bildirim', targetReason: 'Sahte Reçete / Narkotik Suistimali',
        hint: 'Göz feneri (Miyozis) + E-Nabız geçmişine bak! Rüşveti reddedip Hastane Polisine bildir.'
      });
    } else if (mode === 1) {
      list.push({
        id: `spec_quar_${s}`, spec: 'general', name: `${fn} (${35 + s})`, triage: 'red', pitch: 250,
        appearance: { skin: '#e0ac8b', hair: '#2b2d42', shirt: '#2f9e44', flush: true, sweat: true, pupils: 'normal' },
        complaint: 'Yurt dışı uçuşundan dün döndüm; 40.2 ateş, kanlı öksürük ve yaygın döküntüm var!',
        vitals: 'Ateş: 40.2°C | Nabız: 126 | TA: 92/58 | SpO2: %88', lung: 'Bilateral yaygın kaba raller.', pupil: 'İzokorik.',
        radType: 'chest', radTitle: 'AKCİĞER GRAFİSİ', radFinding: 'Bilateral buzlu cam opasiteleri (Yüksek Bulaşıcılık)!', labs: 'PCR Pozitif + Lenfopeni.',
        enabiz: 'Endemik salgın bölgesinden uluslararası uçuş kaydı!',
        correctAction: 'quarantine', targetService: 'Karantina', targetReason: 'Yüksek Bulaşıcı Salgın Vakası',
        hint: 'ÖNCE MUAYENE SEKMESİNDEN N95 MASKE TAK! Sonra Karantina / İzolasyon Odasına al.'
      });
    } else {
      list.push({
        id: `spec_white_${s}`, spec: 'general', name: `${fn} (${28 + s})`, triage: 'red', pitch: 230,
        appearance: { skin: '#f1c2a5', hair: '#111', shirt: '#c92a2a', flush: true, sweat: true, pupils: 'normal' },
        complaint: '20 DAKİKADIR BEKLİYORUZ! Bizim hastanın parmağı kesildi niye içeridekine bakıyorsun lan?!',
        vitals: 'SALDIRGAN HASTA YAKINI — FİZİKSEL TEHDİT!', lung: 'Kapıyı yumruklayıp içeri dalmaya çalışıyor!', pupil: 'Agresif.',
        radType: 'ecg', radTitle: 'GÜVENLİK UYARISI', radFinding: 'Personel güvenliği risk altında — 1111 BEYAZ KOD!', labs: 'Adli kayıt aktif.',
        enabiz: 'Önceki hastanede Beyaz Kod kaydı mevcut!', doorThreat: true,
        correctAction: 'whitecode', targetService: 'Güvenlik', targetReason: '1111 Beyaz Kod Tehdidi',
        hint: 'Konuş sekmesinden hemen 1111 BEYAZ KOD BAS (veya Hastane Polisine bildir)!'
      });
    }
  }
  return list;
}
const ALL_CASES = buildAllCases();

/* ================= VAKA AKIŞI, İNTÖRN, 2 AŞAMALI YATIŞ & MİNİ-OYUNLAR ================= */
function nextPatient() {
  document.getElementById('worldJoyWrap').style.display = 'none';
  document.getElementById('zoomHint').style.display = 'none';

  if (state.warnings >= 3) { triggerGameOver(); return; }
  if (state.seenToday >= 5) {
    if (typeof endOfShiftSummary === 'function') endOfShiftSummary();
    return;
  }

  state.crypto.btcPrice = Math.max(450, Math.round(state.crypto.btcPrice * (0.91 + Math.random() * 0.20)));
  state.crypto.goldPrice = Math.max(300, Math.round(state.crypto.goldPrice * (0.97 + Math.random() * 0.07)));

  if (typeof triggerRandomLoanRequest === 'function' && Math.random() < (state.diff === 'hard' ? 0.55 : 0.38)) {
    triggerRandomLoanRequest();
  }
  if (typeof checkLoanRepayments === 'function') checkLoanRepayments();

  state.location = 'er';
  state.activeStaffIdx = null;
  const sp = SPECIALTIES[state.specialty];
  document.getElementById('sceneTag').textContent = state.specialty === 'none'
    ? `${state.hospName.toUpperCase()} — ODA 1`
    : `${sp.icon} ${sp.title.toUpperCase()} POLİKLİNİĞİ`;

  let basePool = state.specialty !== 'none'
    ? (Math.random() < 0.80 ? ALL_CASES.filter(c => c.spec === state.specialty) : ALL_CASES.filter(c => c.spec === 'general'))
    : ALL_CASES;

  let unseenPool = basePool.filter(c => !state.usedCaseIds.includes(c.id));
  if (unseenPool.length === 0) {
    state.usedCaseIds = state.usedCaseIds.filter(id => !basePool.some(c => c.id === id));
    unseenPool = basePool;
  }

  const chosen = unseenPool[Math.floor(Math.random() * unseenPool.length)];
  state.usedCaseIds.push(chosen.id);
  state.currentPatient = chosen;
  state.examDone = { vitals: false, lung: false, pupil: false, rad: false, labs: false, enabiz: false };
  state.ppeOn = false;
  state.doorThreat = !!chosen.doorThreat || (state.diff === 'hard' && Math.random() < 0.18);
  state.bribePending = !!chosen.bribe;
  updateHud(); saveCareer();

  const badgeMap = { red: ['KIRMIZI ALAN', 't-red'], yellow: ['SARI ALAN', 't-yellow'], green: ['YEŞİL ALAN', 't-green'] };
  const [bt, bc] = badgeMap[chosen.triage];
  const specLabel = chosen.spec !== 'general' ? ` [${SPECIALTIES[chosen.spec]?.serviceName}]` : '';
  say(chosen.name + specLabel, `"${chosen.complaint}"`, bt, bc, chosen.pitch);
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
  if (!p || state.location !== 'er' || state.warnings >= 3) return;

  if (tab === 'talk') {
    addChoice(panel, 'Şikayeti Detaylandır & Klinik İpucu Al', () => say(p.name, `"${p.complaint}"\n\n💡 Klinik İpucu: ${p.hint}`, 'ANAMNEZ', 't-yellow', p.pitch));
    const intern = INTERNS[state.internIdx % INTERNS.length];
    addChoice(panel, `👨‍⚕️ ${intern.name}'e Danış / Süpervizyon`, () => runInternSupervision());

    if (state.doorThreat) {
      addChoice(panel, '🚨 1111 BEYAZ KOD BAS! (Kapıda Saldırı Tehdidi)', () => {
        playSfx('alarm');
        state.doorThreat = false; state.rep = Math.min(100, state.rep + 4); updateHud();
        say('GÜVENLİK EKİBİ', '1111 Beyaz Kod! Güvenlik ekibi saldırganı etkisiz hale getirdi.', 'GÜVENLİ', 't-green', 220);
        if (p.correctAction === 'whitecode') completeCase(true, 'Beyaz Kod zamanında verildi, ekip korundu! +500₺');
        else setTab('talk');
      }, 'danger');
    }
    if (state.bribePending && p.bribe) {
      addChoice(panel, `✉️ Rüşvet Teklifini Gör (${p.bribe.amount}₺)`, () => {
        say('ETİK İKİLEM', p.bribe.text, 'RÜŞVET', 't-red', 190);
        panel.innerHTML = '';
        addChoice(panel, `💰 Zarfı Al (+${p.bribe.amount}₺, %55 Müfettiş Riski)`, () => {
          state.money += p.bribe.amount; state.bribePending = false;
          addTx('Kayıt Dışı Zarf Geliri', p.bribe.amount, 'pos');
          if (Math.random() < 0.55) {
            state.warnings++; updateHud();
            if (state.warnings >= 3) { triggerGameOver(); return; }
            say('BAŞHEKİMLİK MÜFETTİŞİ', 'Suçüstü yakalandın! Usulsüz kazanç nedeniyle +1 Uyarı aldın!', 'UYARI', 't-red', 150);
          } else {
            state.stress = Math.min(100, state.stress + 8); updateHud();
            say('SİSTEM', `Zarfı cebine koydun (+${p.bribe.amount}₺). Stresin arttı.`, 'RİSKLİ', 't-yellow', 260);
          }
          saveCareer(); setTab('decide');
        }, 'danger');
        addChoice(panel, '🛡️ "Burası Devletin Hastanesi!" (Reddet & +6 İtibar)', () => {
          state.bribePending = false; state.rep = Math.min(100, state.rep + 6); updateHud(); saveCareer();
          say(state.docName, '"Paranı al çık dışarı, burada sadece tıp etiği geçer!"', 'ONURLU', 't-green', 340);
          setTab('decide');
        }, 'success');
      }, 'danger');
    }
  } else if (tab === 'exam') {
    addChoice(panel, `😷 KKE N95 Maske Tak (${state.ppeOn ? 'TAKILI ✓' : 'KAPALI'})`, () => {
      state.ppeOn = true; say('SİSTEM', 'N95 maske ve koruyucu eldiven giyildi.', 'KORUMALI', 't-green', 420); setTab('exam');
    }, state.ppeOn ? 'success' : '');
    addChoice(panel, `💓 Vital Bulgular (TA / Nabız / SpO2) ${state.examDone.vitals ? '✓' : ''}`, () => {
      state.examDone.vitals = true; playSfx('heart'); say('VİTAL MONİTÖR', p.vitals, 'VİTAL', 't-yellow', 380); setTab('exam');
    });
    addChoice(panel, `🩺 Stetoskop & Fizik Muayene ${state.examDone.lung ? '✓' : ''}`, () => {
      state.examDone.lung = true; say('FİZİK MUAYENE', p.lung, 'MUAYENE', 't-yellow', 250); setTab('exam');
    });
    addChoice(panel, `🔦 Göz Feneri (Pupilla / RAPD) ${state.examDone.pupil ? '✓' : ''}`, () => {
      state.examDone.pupil = true; say('NÖRO-OFTALMOLOJİ', p.pupil, 'PUPILLA', 't-yellow', 440); setTab('exam');
    });
  } else if (tab === 'file') {
    addChoice(panel, `🩻 ${p.radTitle} İste & Yakınlaştır ${state.examDone.rad ? '✓' : ''}`, () => {
      state.examDone.rad = true; document.getElementById('zoomHint').style.display = 'block';
      say(p.radTitle, p.radFinding, 'RADYOLOJİ', 't-yellow', 360); openDrawer('radiology');
    });
    addChoice(panel, `🧪 Kan & Biyokimya Tahlilleri ${state.examDone.labs ? '✓' : ''}`, () => {
      state.examDone.labs = true; say('LABORATUVAR', p.labs, 'TAHLİL', 't-yellow', 390); setTab('file');
    });
    addChoice(panel, `💻 E-Nabız & Alerji Geçmişi ${state.examDone.enabiz ? '✓' : ''}`, () => {
      state.examDone.enabiz = true; say('E-NABIZ KAYDI', p.enabiz, 'KAYIT', 't-red', 310); setTab('file');
    });
  } else if (tab === 'decide') {
    addChoice(panel, '🏥 Servise Yatış Yap (2 Aşamalı: Servis & Endikasyon)', () => openAdmissionFlow(), 'success');
    addChoice(panel, `💉 Acilde/Poliklinikte Müdahale Et (${p.treatLabel})`, () => {
      if (p.correctAction === 'quarantine' && !state.ppeOn) {
        completeCase(false, 'N95 maske takmadan bulaşıcı hastaya temas ettin ve enfekte oldun! +1 Uyarı.');
        return;
      }
      if (p.correctAction === 'treat') {
        if (p.miniGame) startMedicalMiniGame(p.miniGame, p.treatLabel);
        else completeCase(true, `Tanı: ${p.targetReason}\n${p.treatLabel} başarıyla uygulandı! +500₺`);
      } else {
        completeCase(false, `Yanlış Karar! Doğru Tanı: ${p.targetReason} (Bu vaka yatış/karantina/adli işlem gerektiriyordu).`);
      }
    });
    addChoice(panel, '☣️ Karantina / İzolasyon Odasına Al', () => {
      if (p.correctAction === 'quarantine') {
        if (!state.ppeOn) completeCase(false, 'Doğru tanı ama N95 maske takmadan temas ettin! +1 Uyarı.');
        else completeCase(true, 'Salgın vakası tam KKE korumasıyla izolasyona alındı! +600₺');
      } else completeCase(false, `Bulaşıcı olmayan hastayı karantinaya kapattın! Doğru Tanı: ${p.targetReason}`);
    });
    addChoice(panel, '👮 Hastane Polisi / Adli Bildirim', () => {
      const ok = p.correctAction === 'police' || p.correctAction === 'whitecode';
      completeCase(ok, ok ? 'Adli vaka / sahte reçete polise teslim edildi! +500₺' : `Masum hastaya polis çağırdın! Doğru Tanı: ${p.targetReason}`);
    });
    addChoice(panel, '🏠 Reçete Yaz & Taburcu Et', () => {
      const ok = p.correctAction === 'discharge';
      completeCase(ok, ok ? `Tanı: ${p.targetReason}\nHasta güvenle taburcu edildi. +400₺` : `KRİTİK HATA! Yatması gereken hastayı eve gönderdin! Doğru Tanı: ${p.targetReason}`);
    }, 'danger');
  }
}

/* 2 AŞAMALI YATIŞ PROTOKOLÜ */
function openAdmissionFlow() {
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  say('YATIŞ PROTOKOLÜ — ADIM 1/2', 'Hastayı hangi kliniğe / servise yatırıyorsun?', 'SERVİS SEÇ', 't-yellow', 330);
  ['Göz Hastalıkları','Kardiyoloji','Acil Resüsitasyon','Nöroloji / Beyin Cerrahi','Ortopedi','Pediatri','KBB','Genel Cerrahi','Dahiliye / Yoğun Bakım'].forEach(srv => {
    addChoice(panel, `🏥 ${srv}`, () => openAdmissionReason(srv));
  });
}

function openAdmissionReason(selectedService) {
  const p = state.currentPatient;
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  say(`YATIŞ: ${selectedService.toUpperCase()} — ADIM 2/2`, 'Konsültan uzmana iletilecek tıbbi tanıyı/endikasyonu seç:', 'ENDİKASYON', 't-yellow', 350);

  const distractors = [
    'Santral Retinal Arter Tıkanıklığı (CRAO)', 'Akut Anterior STEMI', 'Kardiyak Tamponad (Beck Triadı)',
    'Akut İskemik İnme (İlk 4.5 Saat)', 'Akut Kompartman Sendromu', 'Akut Epiglottit (Çocuk Acil)',
    'Peritonsiller Apse (Quinsy)', 'Akut Apandisit', 'Diyabetik Ketoasidoz (DKA)', 'Peptik Ülser Perforasyonu'
  ];
  const opts = new Set([p.targetReason]);
  while (opts.size < 4) opts.add(distractors[Math.floor(Math.random() * distractors.length)]);

  Array.from(opts).sort(() => Math.random() - 0.5).forEach(reason => {
    addChoice(panel, `📋 Tanı: ${reason}`, () => {
      if (p.correctAction !== 'admit') {
        completeCase(false, `${selectedService} uzmanı reddetti: "Bu hastanın servis yatışı gerekmiyor!" (Doğru: ${p.targetReason})`);
        return;
      }
      if (selectedService === p.targetService && reason === p.targetReason) {
        state.tusScore += 1;
        completeCase(true, `${selectedService} kabul etti! Tanı eksiksiz. (+1 TUS Puanı & +550₺)`);
      } else if (selectedService === p.targetService) {
        completeCase(true, `${selectedService} hastayı aldı ama uzman ön tanıyı düzeltti. +350₺`);
      } else {
        completeCase(false, `YANLIŞ SERVİS! ${selectedService} yerine ${p.targetService} olmalıydı! (${p.targetReason})`);
      }
    });
  });
}

/* 4 İNTERAKTİF TIBBİ MÜDAHALE MİNİ-OYUNU */
function startMedicalMiniGame(type, label) {
  const titles = {
    cardioversion: '⚡ SENKRONİZE KARDİYOVERSİYON',
    iv: '💉 IV DAMAR YOLU & İLAÇ BOLUSU',
    fracture: '🦴 KIRIK / ÇIKIK REDÜKSİYON HİZALAMA',
    decon: '🫁 İĞNE DEKOMPRESYON / OKÜLER YIKAMA'
  };
  const body = openSidePanel(titles[type] || '🩺 KLİNİK MÜDAHALE');
  body.innerHTML = `
    <div class="card-box" style="padding:12px;display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
      <div style="font-size:12.5px;color:var(--accent-gold);font-weight:800;">${label}</div>
      <canvas id="mgCanvas" width="360" height="160"></canvas>
      <div style="font-size:12px;color:var(--accent-green);">Hareketli gösterge YEŞİL hedef bölgeye geldiğinde müdahaleyi uygula!</div>
      <button id="mgActionBtn" class="start-btn" style="padding:11px;">🩺 MÜDAHALEYİ UYGULA</button>
    </div>`;

  const c = document.getElementById('mgCanvas');
  const x = c.getContext('2d');
  let cursor = 20, dir = 1, speed = 4.2, targetStart = 146, targetW = 68, finished = false;

  function renderMg() {
    if (finished) return;
    cursor += dir * speed;
    if (cursor >= 335) { cursor = 335; dir = -1; }
    if (cursor <= 25) { cursor = 25; dir = 1; }

    x.fillStyle = '#06090f'; x.fillRect(0, 0, 360, 160);
    if (type === 'cardioversion') {
      x.strokeStyle = '#ff6b6b'; x.lineWidth = 2; x.beginPath();
      for (let i = 10; i < 350; i += 4) { const py = 54 + Math.sin(i * 0.22 + cursor * 0.05) * 24; if (i === 10) x.moveTo(i, py); else x.lineTo(i, py); }
      x.stroke();
    } else if (type === 'fracture') {
      x.fillStyle = '#f1f3f5'; x.fillRect(85, 44, 90, 18); x.fillRect(182, 44 + (cursor - 180) * 0.14, 90, 18);
    } else if (type === 'iv') {
      x.fillStyle = '#3bc9db'; x.fillRect(24, 46, 312, 18); x.fillStyle = '#fff'; x.fillRect(24, 52, 312, 5);
    } else {
      x.strokeStyle = '#51cf66'; x.lineWidth = 2; x.strokeRect(100, 26, 160, 56);
      x.fillStyle = '#fcc419'; x.font = 'bold 11px monospace'; x.fillText('ANATOMİK HEDEF', 132, 58);
    }
    x.fillStyle = '#1a2336'; x.fillRect(20, 108, 320, 24);
    x.fillStyle = '#51cf66'; x.fillRect(targetStart, 108, targetW, 24);
    x.strokeStyle = '#fff'; x.lineWidth = 2; x.strokeRect(targetStart, 108, targetW, 24);
    x.fillStyle = '#fcc419'; x.fillRect(cursor - 4, 102, 8, 36);
    activeLoopId = requestAnimationFrame(renderMg);
  }
  renderMg();

  document.getElementById('mgActionBtn').onclick = () => {
    if (finished) return;
    finished = true;
    const hit = cursor >= targetStart && cursor <= (targetStart + targetW);
    closeDrawer();
    if (hit) {
      state.tusScore += 1;
      completeCase(true, `MÜKEMMEL ZAMANLAMA! ${label} başarıyla uygulandı! (+1 TUS & +550₺)`);
    } else {
      completeCase(true, `Müdahale tamamlandı; hasta stabilize edildi. (+350₺)`);
    }
  };
}

/* İNTÖRN SÜPERVİZYONU */
function runInternSupervision() {
  const p = state.currentPatient;
  const intern = INTERNS[state.internIdx % INTERNS.length];
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';

  let proposal = '', isMistake = true;
  if (intern.flaw === 'allergy') proposal = '"Hocam vakit kaybetmeyelim, ben hemen 1000 mg Penisilin iğnesi yapıp gönderiyorum!"';
  else if (intern.flaw === 'sleepy') proposal = '*Esner* "Hocam cihazı taktım ama fişi prize takmayı unutmuşum..."';
  else if (intern.flaw === 'rude') proposal = '"Abartmayın, internetten okuyup acili meşgul etmeyin!" (Hasta yakını öfkelendi!)';
  else { proposal = `"Hocam ellerim titriyor ama ${p.radTitle} istemini ve vitalleri hazırladım, doğru mu?"`; isMistake = false; }

  say(`${intern.name.toUpperCase()} (${intern.trait})`, proposal, 'SÜPERVİZYON', isMistake ? 't-red' : 't-green', 270);
  if (isMistake) {
    addChoice(panel, '✋ "DUR! Hata Yapıyorsun, Doğrusunu Göstereyim" (+3 İtibar)', () => {
      state.internTrust += 10; state.rep = Math.min(100, state.rep + 3); updateHud(); saveCareer();
      say(intern.name, '"Çok haklısınız hocam, az kalsın büyük hata yapıyordum!"', 'EĞİTİLDİ', 't-green', 320);
      setTab('exam');
    }, 'success');
    addChoice(panel, '☕ İntörne Sıcak Çay Ismarla (-30₺, Odak & Moral +15)', () => {
      if (state.money >= 30) {
        state.money -= 30; state.internTrust += 15; addTx('Kantin Çay İkramı', -30, 'neg'); updateHud(); saveCareer();
        say(intern.name, '"İlaç gibi geldi hocam, zihnim açıldı!"', 'MORAL +15', 't-green', 360);
      } else alert('Yetersiz bakiye!');
      setTab('exam');
    });
  } else {
    addChoice(panel, '👏 "Aferin, Aynen Böyle Devam Et!" (+2 İtibar)', () => {
      state.internTrust += 12; state.rep = Math.min(100, state.rep + 2); updateHud(); saveCareer();
      say(intern.name, '"Teşekkürler hocam, sayenizde kendime güvenim geldi!"', 'MOTİVE', 't-green', 370);
      setTab('exam');
    }, 'success');
  }
}

function completeCase(success, msg) {
  playSfx(success ? 'stamp' : 'alarm');
  state.seenToday++; state.hour += 2;
  const spBonus = SPECIALTIES[state.specialty]?.bonusPay || 0;

  if (success) {
    state.dailyCorrect++; state.totalSaved++;
    const earned = 480 + spBonus;
    state.money += earned;
    state.rep = Math.min(100, state.rep + 4);
    state.stress = Math.max(0, state.stress - 3);
    addTx(`Vaka Primi (${state.currentPatient.name})`, earned, 'pos');
  } else {
    state.dailyWrong++;
    state.rep = Math.max(0, state.rep - 8);
    state.stress = Math.min(100, state.stress + 12);
    state.warnings++;
  }
  updateHud(); saveCareer();

  if (state.warnings >= 3) { triggerGameOver(); return; }

  say(success ? 'VAKA BAŞARILI ✓' : 'KLİNİK HATA ✕', msg, success ? '+KAZANÇ' : 'UYARI', success ? 't-green' : 't-red', success ? 420 : 160);
  const panel = document.getElementById('subPanel'); panel.innerHTML = '';
  addChoice(panel, 'Sıradaki Hastayı Çağır', () => nextPatient(), 'success');
}

/* DRAWER MODALLARI: RADYOLOJİ, TUS & 8 UZMANLIK, HARİTA & MASA EKİPMAN DÜKKÂNI */
function openDrawer(type) {
  if (type === 'radiology') {
    const p = state.currentPatient;
    const body = openSidePanel(p ? p.radTitle : 'GÖRÜNTÜLEME EKRANI');
    if (!p) { body.textContent = 'Aktif hasta yok.'; return; }
    const c = document.createElement('canvas'); c.id = 'zoomCanvas'; c.width = 360; c.height = 180;
    body.appendChild(c);
    drawRadiologyZoom(c, p.radType);
    const info = document.createElement('div');
    info.style.cssText = 'padding:10px;background:var(--bg-card);border:1.5px solid var(--accent-green);border-radius:7px;font-size:12.5px;line-height:1.5;';
    info.innerHTML = `<strong style="color:var(--accent-gold)">KLİNİK GÖRÜNTÜLEME RAPORU:</strong><br>${p.radFinding}`;
    body.appendChild(info);
  } else if (type === 'tus') {
    const body = openSidePanel('TUS & 8 KLİNİK UZMANLIK (340 VAKA)');
    const curSp = SPECIALTIES[state.specialty];
    body.innerHTML = `<div style="background:var(--bg-card);border:1.5px solid var(--accent-purple);border-radius:8px;padding:10px;font-size:12.5px;line-height:1.5;">
      <div><strong style="color:var(--accent-gold)">Unvan:</strong> ${curSp.icon} ${curSp.title}</div>
      <div><strong style="color:var(--accent-green)">TUS:</strong> ${state.tusScore}p | <strong style="color:var(--accent-cyan)">İtibar:</strong> ${state.rep}/100</div>
    </div>`;
    addChoice(body, '📚 Hızlı TUS Denemesi Çöz (-300₺ -> +3 TUS Puanı)', () => {
      if (state.money >= 300) {
        state.money -= 300; state.tusScore += 3; addTx('TUS Deneme & Soru Bankası', -300, 'neg');
        playSfx('coin'); updateHud(); saveCareer(); openDrawer('tus');
      } else alert('Yetersiz bakiye!');
    }, 'purple');
    Object.values(SPECIALTIES).filter(s => s.id !== 'none').forEach(sp => {
      const active = state.specialty === sp.id;
      const ok = state.tusScore >= sp.reqTus && state.rep >= sp.reqRep;
      const lbl = active ? `${sp.icon} ${sp.title} [AKTİF • 40 VAKA ✓]` : `${sp.icon} ${sp.title} (${sp.reqTus} TUS & ${sp.reqRep} İtibar | +${sp.bonusPay}₺)`;
      addChoice(body, lbl, () => {
        if (active) return;
        if (!ok) { alert(`En az ${sp.reqTus} TUS Puanı ve ${sp.reqRep} İtibar gerekli!`); return; }
        state.specialty = sp.id; playSfx('coin'); updateHud(); saveCareer(); closeDrawer(); nextPatient();
      }, active ? 'success' : (ok ? 'purple' : ''));
    });
  } else if (type === 'map') {
    const body = openSidePanel('ŞEHİR & MEKÂN HARİTASI');
    addChoice(body, '🌆 Açık Dünya Modunda Gez (WASD / Joystick)', () => enterOpenWorld(), 'success');
    addChoice(body, '🏥 Hastane Polikliniği / Acil', () => nextPatient());
    addChoice(body, '🕹️ Aydın E-Spor & İnternet Kafe (150₺)', () => goLocation('icafe'));
    addChoice(body, '🖥️ PS5 & 4K Monitör Mağazası', () => goLocation('tech'), 'purple');
    addChoice(body, '🏠 Evim (Salon & Oyun Köşesi)', () => goLocation('home'));
    addChoice(body, '☕ Hastane Kantini (Personel Hikâyeleri & AI)', () => goLocation('canteen'));
    addChoice(body, '⚽ Aydın Halı Saha', () => goLocation('pitch'));
    addChoice(body, '🚗 Oto Galeri, Akaryakıt & Sanayi', () => goLocation('dealer'));
    addChoice(body, '🍲 Mahalle Esnaf Lokantası', () => goLocation('diner'));
  } else if (type === 'shop') {
    const body = openSidePanel('MASA ÖZELLEŞTİRME DÜKKÂNI');
    [
      ['thermos', '☕ Çelik Nöbet Termosu (400₺)', 400],
      ['cactus', '🌵 Masaüstü Saksı Kaktüsü (250₺)', 250],
      ['littmann', '🩺 Littmann Profesyonel Stetoskop (700₺)', 700],
      ['dualMonitor', '🖥️ Çift Ekranlı Negatoskop (950₺)', 950]
    ].forEach(([key, label, cost]) => {
      const owned = state.upgrades[key];
      addChoice(body, owned ? `${label} [ALINDI ✓]` : label, () => {
        if (!owned && state.money >= cost) {
          state.money -= cost; state.upgrades[key] = true; addTx(`Masa Ekipmanı: ${label}`, -cost, 'neg');
          playSfx('coin'); updateHud(); saveCareer(); openDrawer('shop');
        } else if (!owned) alert('Yetersiz bakiye!');
      }, owned ? 'success' : '');
    });
  }
}
