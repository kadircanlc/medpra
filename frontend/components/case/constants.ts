export const TEST_CATEGORIES: { label: string; tests: string[] }[] = [
  { label: "Tam Kan Sayımı", tests: ["Tam Kan Sayımı (Hemogram)"] },
  {
    label: "Biyokimya",
    tests: ["Glukoz", "Üre", "Kreatinin", "Ürik Asit", "ALT", "AST", "ALP", "GGT", "Total Bilirubin", "Direkt Bilirubin", "Total Protein", "Albumin", "Sodyum", "Potasyum", "Kalsiyum", "Fosfor", "Magnezyum", "Klor"],
  },
  {
    label: "Kardiyak Belirteçler",
    tests: ["Troponin I (Yüksek Duyarlıklı)", "Troponin T", "CK-MB", "Miyoglobin", "BNP", "NT-proBNP"],
  },
  {
    label: "İnflamasyon & Koagülasyon",
    tests: ["CRP", "Sedimentasyon (ESR)", "Prokalsitonin", "Fibrinojen", "D-Dimer", "PT (Protrombin Zamanı)", "aPTT", "INR"],
  },
  {
    label: "Hormon & Tiroid",
    tests: ["TSH", "Serbest T4", "Serbest T3", "Kortizol", "HbA1c", "İnsülin", "C-Peptid"],
  },
  {
    label: "Lipid Paneli",
    tests: ["Total Kolesterol", "LDL Kolesterol", "HDL Kolesterol", "Trigliserid", "VLDL"],
  },
  {
    label: "İdrar & Böbrek",
    tests: ["İdrar Tahlili", "Spot İdrar Protein/Kreatinin", "24 Saatlik İdrar Protein", "Mikroalbüminüri", "eGFR"],
  },
  {
    label: "Mikrobiyoloji",
    tests: ["Kan Kültürü", "İdrar Kültürü", "Balgam Kültürü", "Boğaz Kültürü", "Gaita Kültürü"],
  },
  {
    label: "Kardiyak & Solunum Görüntüleme",
    tests: ["EKG (12 Derivasyon)", "Efor Testi", "Holter (24 Saatlik EKG)", "Ekokardiyografi (EKO)", "PA Akciğer Grafisi", "Lateral Akciğer Grafisi", "Toraks BT"],
  },
  {
    label: "Karın & Diğer Görüntüleme",
    tests: ["Batın Ultrasonografisi", "Pelvik Ultrasonografi", "Tiroid Ultrasonografisi", "Alt Ekstremite Venöz Doppler", "Karotis Doppler", "Batın BT", "Kranial BT", "Kranial MRI", "Lomber MRI", "Kemik Grafisi"],
  },
  {
    label: "Diğer",
    tests: ["Arteriyel Kan Gazı (AKG)", "Laktat", "Amilaz", "Lipaz", "LDH", "Ferritin", "Demir", "TIBC", "B12 Vitamini", "Folik Asit", "25-OH Vitamin D", "PSA"],
  },
];

export const EXAM_CATEGORIES: { label: string; types: string[] }[] = [
  { label: "Genel Bakı", types: ["Genel görünüm ve bilinç", "Antropometrik ölçümler"] },
  { label: "Baş-Boyun", types: ["Tiroid muayenesi", "Lenf nodu muayenesi", "Juguler venöz dolgunluk"] },
  { label: "Kardiyovasküler", types: ["Kalp oskültasyonu", "Periferik nabızlar", "Kapiller dolum"] },
  { label: "Solunum", types: ["Akciğer oskültasyonu", "Akciğer perküsyonu", "Solunum paterni"] },
  { label: "Batın", types: ["Batın inspeksiyonu", "Batın palpasyonu", "Batın perküsyonu", "Bağırsak sesleri"] },
  { label: "Nörolojik", types: ["Bilinç ve oryantasyon", "Kranial sinirler", "Motor muayene", "Refleksler"] },
  { label: "Ekstremiteler", types: ["Ödem değerlendirmesi", "Kas gücü", "Eklem muayenesi"] },
  { label: "Deri", types: ["Deri muayenesi"] },
];
