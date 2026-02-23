// frcs_fa_syllabus.ts

export type SyllabusTopic = {
    id: string;                 // stable key for tracking
    domain: string;             // broad grouping (e.g. "Trauma", "Arthritis")
    topic: string;              // specific topic (e.g. "Ankle fracture fixation")
    procedures: string[];       // key operations / techniques
    target_cards: number;       // how many flashcards to generate for this topic
    difficulty_bias?: "FRCS" | "Mixed"; // optional
  };
  
  export const FRCS_FA_SYLLABUS: SyllabusTopic[] = [
    // -------------------------
    // FOUNDATIONS / EXAM BASICS
    // -------------------------
    {
      id: "foundations_anatomy_osseous",
      domain: "Foundations",
      topic: "Foot & ankle osseous anatomy (hindfoot, midfoot, forefoot)",
      procedures: [],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
    {
      id: "foundations_anatomy_soft_tissues",
      domain: "Foundations",
      topic: "Ligaments, tendons, retinacula, plantar fascia, ankle syndesmosis",
      procedures: [],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
    {
      id: "foundations_neurovascular",
      domain: "Foundations",
      topic: "Neurovascular anatomy (tarsal tunnel, sural, SPN/DPN, PTN; angiosomes)",
      procedures: [],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
    {
      id: "foundations_biomechanics_gait",
      domain: "Foundations",
      topic: "Biomechanics & gait: hindfoot alignment, first ray, windlass, subtalar axis",
      procedures: [],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
    {
      id: "foundations_imaging",
      domain: "Foundations",
      topic: "Imaging & measurements: weight-bearing XR, CT, MRI, US; key angles/lines",
      procedures: [],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
    {
      id: "foundations_periop",
      domain: "Foundations",
      topic: "Peri-op: antibiotics, thromboprophylaxis, compartment syndrome, tourniquet, wound care",
      procedures: [],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // TRAUMA
    // -------------------------
    {
      id: "trauma_ankle_fractures",
      domain: "Trauma",
      topic: "Ankle fractures: Weber/Lauge-Hansen, stability, fixation strategy, syndesmosis",
      procedures: ["ORIF ankle", "Syndesmosis fixation", "Deltoid assessment/repair (indications)"],
      target_cards: 60,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_pilon",
      domain: "Trauma",
      topic: "Pilon fractures: classification, staged management, approaches, complications",
      procedures: ["External fixation spanning", "Definitive ORIF pilon", "Circular frame (principles)"],
      target_cards: 55,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_talar_neck_body",
      domain: "Trauma",
      topic: "Talus fractures: Hawkins, AVN risk, approaches, fixation, osteochondral injury",
      procedures: ["ORIF talus", "Management of talar AVN/collapse"],
      target_cards: 40,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_calcaneus",
      domain: "Trauma",
      topic: "Calcaneal fractures: Sanders, Böhler/Gissane, indications for ORIF vs non-op",
      procedures: ["ORIF calcaneus", "Minimally invasive fixation", "Primary subtalar fusion (selected cases)"],
      target_cards: 55,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_lisfranc",
      domain: "Trauma",
      topic: "Lisfranc injuries: diagnosis, WB imaging/CT, fixation vs primary fusion",
      procedures: ["ORIF Lisfranc", "Primary TMT fusion"],
      target_cards: 45,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_midfoot_forefoot",
      domain: "Trauma",
      topic: "Midfoot/forefoot fractures & dislocations: navicular, cuboid, metatarsals, toes",
      procedures: ["Bridge plating", "External fixation principles", "Metatarsal fixation"],
      target_cards: 35,
      difficulty_bias: "FRCS",
    },
    {
      id: "trauma_open_fractures_soft_tissue",
      domain: "Trauma",
      topic: "Open injuries & soft tissue: timing, debridement principles, flap options overview",
      procedures: ["Debridement", "Temporising fixation", "Definitive fixation timing"],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // ARTHRITIS / DEFORMITY / RECON
    // -------------------------
    {
      id: "arthritis_ankle_oa",
      domain: "Arthritis & Reconstruction",
      topic: "Ankle OA: causes, staging, joint preservation vs fusion vs TAR",
      procedures: ["Ankle arthrodesis", "Total ankle replacement (principles)"],
      target_cards: 55,
      difficulty_bias: "FRCS",
    },
    {
      id: "arthritis_subtalar_triple",
      domain: "Arthritis & Reconstruction",
      topic: "Subtalar arthritis, triple arthrodesis, hindfoot alignment correction",
      procedures: ["Subtalar fusion", "Triple fusion", "Adjunct osteotomies"],
      target_cards: 50,
      difficulty_bias: "FRCS",
    },
    {
      id: "deformity_cavovarus",
      domain: "Deformity",
      topic: "Cavovarus: assessment, Coleman block, soft tissue + osteotomy algorithm",
      procedures: ["Dorsiflexion 1st met osteotomy", "Calcaneal osteotomy", "Tendon transfers", "Midfoot osteotomy"],
      target_cards: 55,
      difficulty_bias: "FRCS",
    },
    {
      id: "deformity_flatfoot_pttd",
      domain: "Deformity",
      topic: "Adult acquired flatfoot (PCFD/PTTD): staging, reconstruction options",
      procedures: ["MDCO/LCL", "FDL transfer", "Spring ligament repair", "Medial column procedures", "Fusion options"],
      target_cards: 60,
      difficulty_bias: "FRCS",
    },
    {
      id: "hallux_valgus",
      domain: "Forefoot",
      topic: "Hallux valgus: assessment angles, procedure selection, complications",
      procedures: ["Distal chevron", "Scarf", "Akin", "Lapidus", "MTP fusion (selected)"],
      target_cards: 60,
      difficulty_bias: "FRCS",
    },
    {
      id: "hallux_rigidus",
      domain: "Forefoot",
      topic: "Hallux rigidus: grading, cheilectomy vs osteotomy vs arthrodesis vs arthroplasty",
      procedures: ["Cheilectomy", "Moberg osteotomy", "1st MTP fusion"],
      target_cards: 35,
      difficulty_bias: "FRCS",
    },
    {
      id: "lesser_toes_metatarsalgia",
      domain: "Forefoot",
      topic: "Metatarsalgia & lesser toe disorders: plantar plate, MTP instability, claw/hammer toes",
      procedures: ["Weil osteotomy", "Plantar plate repair (principles)", "PIP arthrodesis", "Tendon balancing"],
      target_cards: 45,
      difficulty_bias: "FRCS",
    },
    {
      id: "charcot_diabetic",
      domain: "Diabetes & Neuropathic",
      topic: "Diabetic foot & Charcot: staging, offloading, reconstruction principles, infection",
      procedures: ["Exostectomy (selected)", "Arthrodesis constructs overview", "Amputation level decisions"],
      target_cards: 45,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // SPORTS / TENDON / LIGAMENT
    // -------------------------
    {
      id: "achilles_rupture",
      domain: "Sports & Tendon",
      topic: "Achilles rupture: diagnosis, non-op vs op, rehab, complications",
      procedures: ["Open repair", "Percutaneous repair", "FHL transfer (chronic)"],
      target_cards: 40,
      difficulty_bias: "FRCS",
    },
    {
      id: "insertional_achilles_haglund",
      domain: "Sports & Tendon",
      topic: "Insertional Achilles/Haglund: indications, approach, tendon reattachment constructs",
      procedures: ["Retrocalcaneal bursectomy", "Calcaneal exostectomy", "Tendon reattachment"],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
    {
      id: "ankle_instability",
      domain: "Sports & Ligament",
      topic: "Chronic lateral ankle instability: workup, Broström, syndesmosis differentials",
      procedures: ["Broström-Gould", "Reconstruction (principles)"],
      target_cards: 35,
      difficulty_bias: "FRCS",
    },
    {
      id: "osteochondral_lesions_talus",
      domain: "Sports & Cartilage",
      topic: "OLT: classification, arthroscopy options, microfracture vs grafting principles",
      procedures: ["Ankle arthroscopy OLT management"],
      target_cards: 35,
      difficulty_bias: "FRCS",
    },
    {
      id: "peroneal_pathology",
      domain: "Sports & Tendon",
      topic: "Peroneal tendon tears/subluxation: diagnosis, groove deepening, repair principles",
      procedures: ["Peroneal repair", "Retinaculum repair", "Groove deepening (principles)"],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
    {
      id: "posterior_tibial_tendon",
      domain: "Sports & Tendon",
      topic: "Posterior tibial tendon dysfunction: imaging, non-op, tendon transfer concepts",
      procedures: ["FDL transfer", "Adjunct osteotomies/fusions"],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
    {
      id: "plantar_fasciitis_baxter",
      domain: "Sports & Overuse",
      topic: "Plantar heel pain: plantar fasciitis, Baxter’s nerve, stress fracture differentials",
      procedures: ["Surgical release (indications/risks)"],
      target_cards: 20,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // NERVE / ENTRAPMENT
    // -------------------------
    {
      id: "tarsal_tunnel",
      domain: "Nerve",
      topic: "Tarsal tunnel syndrome: anatomy, diagnosis, decompression principles, pitfalls",
      procedures: ["Tarsal tunnel decompression"],
      target_cards: 20,
      difficulty_bias: "FRCS",
    },
    {
      id: "mortons_neuroma",
      domain: "Nerve",
      topic: "Morton’s neuroma: diagnosis, injections, neurectomy indications, complications",
      procedures: ["Interdigital neurectomy"],
      target_cards: 20,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // INFECTION / TUMOUR / MISC
    // -------------------------
    {
      id: "infection_osteomyelitis_septic_arthritis",
      domain: "Infection",
      topic: "Foot/ankle infection: septic arthritis, osteomyelitis, hardware infection, diabetic infection",
      procedures: ["Debridement", "Staged reconstruction principles"],
      target_cards: 30,
      difficulty_bias: "FRCS",
    },
    {
      id: "tumours_masses",
      domain: "Tumours & Masses",
      topic: "Common benign/malignant lesions of foot & ankle + red flags + biopsy principles",
      procedures: [],
      target_cards: 20,
      difficulty_bias: "FRCS",
    },
  
    // -------------------------
    // PAEDIATRICS (core FRCS breadth)
    // -------------------------
    {
      id: "paeds_clubfoot",
      domain: "Paediatrics",
      topic: "CTEV/clubfoot: Ponseti principles, relapse, surgical options overview",
      procedures: ["Tendo-Achilles tenotomy (principles)", "Relapse procedures overview"],
      target_cards: 20,
      difficulty_bias: "Mixed",
    },
    {
      id: "paeds_flatfoot_coalition",
      domain: "Paediatrics",
      topic: "Flatfoot, tarsal coalition: imaging, resection vs fusion, peroneal spasm",
      procedures: ["Coalition resection (principles)", "Hindfoot fusion indications"],
      target_cards: 25,
      difficulty_bias: "FRCS",
    },
  ];