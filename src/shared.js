/**
 * Shared utilities and constants for the Serendipity application.
 * This file contains sample data, helper functions, and constants used throughout the application.
 */

/**
 * Initial tree data structure with sample content.
 * This provides a starting point for the application with example topics and flashcards.
 * Image URLs have been updated for relevance and validity.
 */
export const initialData = [
  {
    title: "Biology",
    type: "topic",
    category: "Biology",
    expanded: true,
    content: "# Biology\n\nBiology is the scientific study of life and living organisms, including their physical structure, chemical processes, molecular interactions, physiological mechanisms, development, and evolution.",
    author: "Jane Smith",
    timestamp: "2025-03-21",
    source: "https://example.com/biology/introduction",
    children: [
      {
        title: "Cell Biology",
        type: "topic",
        content: "## Cell Biology\n\nCell biology is the study of cells, the fundamental units of life. All living organisms are composed of one or more cells, each containing complex molecular machinery that enables life processes.",
        category: "Biology",
        expanded: true,
        author: "Jane Smith",
        timestamp: "2025-03-21",
        source: "https://example.com/biology/cell-biology",
        children: [
          {
            title: "Cell Structure",
            type: "topic",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-structure",
            content: "### Cell Structure\n\nEukaryotic cells contain membrane-bound organelles including a nucleus, while prokaryotic cells do not. Key organelles include:\n\n- **Nucleus**: Contains genetic material, surrounded by a double nuclear membrane with pores\n- **Mitochondria**: Energy production through oxidative phosphorylation, contain their own DNA\n- **Endoplasmic reticulum**: Protein synthesis (rough ER) and lipid synthesis (smooth ER)\n- **Golgi apparatus**: Protein processing, modification, and packaging\n- **Lysosomes**: Contain hydrolytic enzymes for cellular digestion\n- **Ribosomes**: Protein synthesis via translation of mRNA\n\nThe plasma membrane, composed of a phospholipid bilayer with embedded proteins, regulates movement of substances via simple diffusion and other transport mechanisms."
          },
          {
            title: "Cell Division",
            type: "topic",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-division",
            content: "### Cell Division\n\nCell division includes mitosis (division of the nucleus) and cytokinesis (division of the cytoplasm). The cell cycle consists of:\n\n1. **Interphase** (G₁, S, G₂): Cell growth and DNA replication\n   - G₁: Cell growth and metabolic activities\n   - S: DNA synthesis and chromosome duplication\n   - G₂: Preparation for mitosis\n2. **Prophase**: Chromosomes condense, nuclear envelope breaks down\n3. **Metaphase**: Chromosomes align at the equator of the cell\n4. **Anaphase**: Sister chromatids separate and move to opposite poles\n5. **Telophase**: Nuclear membranes reform around the new nuclei\n6. **Cytokinesis**: Cytoplasm divides creating two daughter cells\n\nThe cell cycle is regulated by cyclins and cyclin-dependent kinases (CDKs)."
          },
          {
            title: "Mitochondria Function",
            type: "flashcard",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/mitochondria",
            content: "What is the primary function of mitochondria in cells?\n---\nMitochondria are the powerhouse of the cell, responsible for producing ATP through cellular respiration. They utilize the electron transport chain and oxidative phosphorylation to generate approximately 30-32 ATP molecules per glucose molecule, much more efficient than the 2 ATP produced by glycolysis alone."
          },
          {
            title: "Cell Types",
            type: "flashcard",
            category: "Cell Biology",
            author: "Jane Smith",
            timestamp: "2025-03-21",
            source: "https://example.com/biology/cell-types",
            content: "What are the two main types of cells?\n---\nProkaryotic cells (bacteria and archaea) and eukaryotic cells (plants, animals, fungi, and protists). Prokaryotic cells lack membrane-bound organelles and a true nucleus, while eukaryotic cells have membrane-bound organelles including a nucleus containing genetic material enclosed by a nuclear membrane."
          }
        ]
      },
      {
        title: "Evolution",
        type: "topic",
        category: "Biology",
        content: "## Evolution\n\nEvolution is the process by which different kinds of living organisms developed from earlier forms during the history of the Earth. The theory of evolution by natural selection was first proposed by Charles Darwin and Alfred Russel Wallace.",
        expanded: true,
        author: "Jane Smith",
        timestamp: "2025-04-01",
        source: "https://example.com/biology/evolution",
        children: [
          {
            title: "Natural Selection",
            type: "topic",
            category: "Evolution",
            author: "Jane Smith",
            timestamp: "2025-04-01",
            source: "https://example.com/evolution/natural-selection",
            content: "### Natural Selection\n\nNatural selection is the differential survival and reproduction of individuals due to differences in phenotype. The four key components are:\n\n1. **Variation**: Individuals in a population vary in traits\n2. **Heritability**: Traits can be passed to offspring\n3. **Differential reproduction**: Some variants reproduce more than others\n4. **Selection over time**: Advantageous traits become more common\n\nThis process leads to adaptation to the environment and is a primary mechanism of evolution. Allele frequencies change over time based on selection pressure."
          },
          {
            title: "Speciation",
            type: "topic",
            category: "Evolution",
            author: "Jane Smith",
            timestamp: "2025-04-02",
            source: "https://example.com/evolution/speciation",
            content: "### Speciation\n\nSpeciation is the evolutionary process by which populations evolve to become distinct species. Major mechanisms include:\n\n- **Allopatric speciation**: Geographic isolation separates populations\n- **Sympatric speciation**: Populations diverge without geographic separation\n- **Parapatric speciation**: Divergence with partial separation\n- **Peripatric speciation**: Isolation of a small population from a larger one\n\nReproductive isolation mechanisms prevent gene flow between newly formed species, including prezygotic barriers (habitat, temporal, behavioral isolation) and postzygotic barriers (reduced hybrid viability, sterility)."
          },
          {
            title: "Darwin's Finches",
            type: "flashcard",
            category: "Evolution",
            author: "Jane Smith",
            timestamp: "2025-04-03",
            source: "https://example.com/evolution/darwin-finches",
            content: "Why are Darwin's finches significant?\n---\nDarwin's finches demonstrated how natural selection leads to adaptive radiation, as different species evolved specialized beaks to exploit different food sources on the Galápagos Islands. These observations provided critical evidence for Darwin's theory of evolution by natural selection, showing how environmental pressures lead to differentiation of traits."
          },
          {
            title: "Genetic Drift",
            type: "flashcard",
            category: "Evolution",
            author: "Jane Smith",
            timestamp: "2025-04-04",
            source: "https://example.com/evolution/genetic-drift",
            content: "What is genetic drift?\n---\nGenetic drift is a mechanism of evolution where allele frequencies in a population change by random chance rather than natural selection, occurring more significantly in small populations. Examples include the founder effect (when a small group establishes a new population) and the bottleneck effect (when population size is drastically reduced)."
          }
        ]
      }
    ]
  },
  {
    title: "Medicine",
    type: "topic",
    category: "Medicine",
    expanded: true,
    content: "# Medicine for Medical Education\n\nMedicine is the science and practice of establishing the diagnosis, prognosis, treatment, and prevention of disease. This section focuses on high-yield topics for medical education.",
    author: "Dr. Maria Chen",
    timestamp: "2025-04-05",
    source: "https://example.com/medicine/overview",
    children: [
      {
        title: "Anatomy",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Anatomy\n\nAnatomy is the study of the structure and organization of the body and its parts, essential for medical diagnosis and treatment. Medical examinations frequently test anatomical relationships and clinical correlations.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-05",
        source: "https://example.com/medicine/anatomy",
        children: [
          {
            title: "Neuroanatomy",
            type: "topic",
            category: "Anatomy",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-05",
            source: "https://example.com/anatomy/neuro",
            content: "### Neuroanatomy\n\nNeuroanatomy focuses on the structure of the nervous system, including the brain, spinal cord, and peripheral nerves. High-yield areas include:\n\n- **Cerebral cortex**: Functional localization\n  - Primary motor cortex (precentral gyrus, Brodmann area 4)\n  - Primary somatosensory cortex (postcentral gyrus, Brodmann areas 3,1,2)\n  - Visual cortex (occipital lobe, Brodmann areas 17,18,19)\n  - Auditory cortex (temporal lobe, Brodmann areas 41,42)\n\n- **Basal ganglia**: Motor control circuits comprising the caudate nucleus, putamen, globus pallidus, substantia nigra, and subthalamic nucleus\n\n- **Ventricles**: CSF production and circulation through the lateral ventricles, third ventricle, cerebral aqueduct, and fourth ventricle\n\nNeural communication uses electrical impulses governed by the Nernst equation, which relates membrane potential to ionic concentrations."
          },
          {
            title: "Cardiovascular Anatomy",
            type: "topic",
            category: "Anatomy",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-06",
            source: "https://example.com/anatomy/cardiovascular",
            content: "### Cardiovascular Anatomy\n\nCardiovascular anatomy covers the heart, including its chambers, valves, and major vessels. Key medical topics include:\n\n- **Cardiac chambers**:\n  - Right atrium: Receives deoxygenated blood via superior and inferior venae cavae\n  - Right ventricle: Pumps to pulmonary circulation, has thinner walls (5-8mm)\n  - Left atrium: Receives oxygenated blood from pulmonary veins\n  - Left ventricle: Pumps to systemic circulation, thicker walls (13-15mm)\n\n- **Heart valves**:\n  - Tricuspid valve: Right AV valve with three cusps\n  - Pulmonary valve: Between right ventricle and pulmonary artery\n  - Mitral valve: Left AV valve with two cusps\n  - Aortic valve: Between left ventricle and aorta\n\n- **Coronary circulation**: Left and right coronary arteries arise from the aortic sinuses\n\nCardiac output is calculated as: Cardiac Output = Stroke Volume × Heart Rate"
          },
          {
            title: "Cranial Nerves",
            type: "flashcard",
            category: "Anatomy",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-07",
            source: "https://example.com/anatomy/cranial-nerves",
            content: "What are the 12 cranial nerves in order?\n---\nI: Olfactory (sensory) - smell\nII: Optic (sensory) - vision\nIII: Oculomotor (motor) - eye movement, pupil constriction, upper eyelid elevation\nIV: Trochlear (motor) - superior oblique muscle\nV: Trigeminal (mixed) - facial sensation and mastication\nVI: Abducens (motor) - lateral rectus muscle\nVII: Facial (mixed) - facial expression, taste anterior 2/3 of tongue\nVIII: Vestibulocochlear (sensory) - hearing and balance\nIX: Glossopharyngeal (mixed) - taste posterior 1/3 of tongue, swallowing\nX: Vagus (mixed) - parasympathetic to thoracoabdominal viscera\nXI: Accessory (motor) - sternocleidomastoid and trapezius muscles\nXII: Hypoglossal (motor) - tongue movement"
          },
          {
            title: "Brachial Plexus",
            type: "flashcard",
            category: "Anatomy",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-08",
            source: "https://example.com/anatomy/brachial-plexus",
            content: "What are the five components of the brachial plexus in order?\n---\nRoots (C5-T1), Trunks (Upper, Middle, Lower), Divisions (Anterior, Posterior), Cords (Lateral, Posterior, Medial), and Branches (terminal nerves including musculocutaneous, axillary, radial, median, and ulnar). Remember: 'Real Texans Drink Cold Beer'. Injury patterns produce distinctive motor and sensory deficits depending on the level of injury."
          }
        ]
      },
      {
        title: "Physiology",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Physiology\n\nPhysiology examines the normal function of body systems and the mechanisms that regulate them. Understanding normal physiology is essential for identifying pathological processes.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-09",
        source: "https://example.com/medicine/physiology",
        children: [
          {
            title: "Renal Physiology",
            type: "topic",
            category: "Physiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-09",
            source: "https://example.com/physiology/renal",
            content: "### Renal Physiology\n\nRenal physiology focuses on kidney function. High-yield medical concepts include:\n\n- **Glomerular filtration**: Filtration barrier (endothelium, basement membrane, podocytes) allows water and small solutes to pass while retaining cells and proteins. Normal GFR is 100-125 mL/min/1.73m².\n\n- **Tubular reabsorption**: Sodium reabsorption via Na⁺/K⁺-ATPase, glucose via SGLT1/2 and GLUT transporters, amino acids via various transporters\n\n- **Tubular secretion**: Protons for acid-base balance, potassium regulation, drug elimination\n\n- **Countercurrent multiplication**: Concentrates urine through the loop of Henle's countercurrent system\n\nThe GFR can be estimated using the Cockcroft-Gault equation, which accounts for age, weight, serum creatinine, and gender."
          },
          {
            title: "Respiratory Physiology",
            type: "topic",
            category: "Physiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-10",
            source: "https://example.com/physiology/respiratory",
            content: "### Respiratory Physiology\n\nRespiratory physiology examines gas exchange and breathing mechanics. Critical medical concepts include:\n\n- **Lung volumes and capacities**:\n  - Tidal Volume (TV): ~500 mL at rest\n  - Vital Capacity (VC): ~4.5 L, maximum volume exhaled from maximum inspiration\n  - Residual Volume (RV): ~1.2 L, air remaining after maximal exhalation\n  - Total Lung Capacity (TLC): ~6 L, sum of all volumes\n  - Functional Residual Capacity (FRC): ~2.5-3 L, volume remaining after normal exhalation\n\n- **Ventilation/perfusion matching**: V/Q ratio normally 0.8, affects gas exchange efficiency\n\n- **Oxygen-hemoglobin dissociation curve**: Sigmoidal shape, affected by pH, temperature, 2,3-DPG\n\nThe alveolar gas equation helps calculate alveolar oxygen pressure based on inspired oxygen, atmospheric pressure, water vapor pressure, and arterial CO2."
          },
          {
            title: "GFR",
            type: "flashcard",
            category: "Physiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-11",
            source: "https://example.com/physiology/gfr",
            content: "What is the normal Glomerular Filtration Rate (GFR)?\n---\nThe normal GFR is approximately 100-125 mL/min/1.73m² in healthy young adults. GFR decreases with age (approximately 1 mL/min/year after age 40). Measured by inulin clearance or estimated using creatinine-based formulas like CKD-EPI or MDRD equations."
          },
          {
            title: "Cardiac Output",
            type: "flashcard",
            category: "Physiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-12",
            source: "https://example.com/physiology/cardiac-output",
            content: "How is cardiac output calculated?\n---\nCardiac Output = Stroke Volume × Heart Rate. Normal cardiac output at rest is approximately 4-8 liters per minute. Stroke volume is determined by preload (end-diastolic volume), afterload (resistance to ventricular ejection), and contractility (intrinsic strength of cardiac muscle contraction independent of loading conditions)."
          }
        ]
      },
      {
        title: "Pharmacology",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Pharmacology\n\nPharmacology is the study of drugs, their actions, and their effects on living systems. Medical education emphasizes mechanism of action, clinical uses, adverse effects, and drug interactions.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-13",
        source: "https://example.com/medicine/pharmacology",
        children: [
          {
            title: "Antimicrobials",
            type: "topic",
            category: "Pharmacology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-13",
            source: "https://example.com/pharmacology/antimicrobials",
            content: "### Antimicrobials\n\nAntimicrobials include antibiotics, antivirals, antifungals, and antiparasitics. Medical high-yield concepts include:\n\n- **Cell wall inhibitors**:\n  - Penicillins: Inhibit transpeptidation, bactericidal\n  - Cephalosporins: Five generations with increasing gram-negative coverage\n  - Vancomycin: Inhibits peptidoglycan synthesis, active against MRSA\n\n- **Protein synthesis inhibitors**:\n  - Macrolides: Bind 50S ribosomal subunit (erythromycin, azithromycin)\n  - Aminoglycosides: Bind 30S subunit, bactericidal (gentamicin, amikacin)\n  - Tetracyclines: Bind 30S subunit, bacteriostatic (doxycycline)\n\n- **DNA/RNA synthesis inhibitors**: Fluoroquinolones (ciprofloxacin), rifampin\n\nDrug concentration over time follows first-order kinetics, decreasing exponentially based on the elimination rate constant."
          },
          {
            title: "Cardiovascular Drugs",
            type: "topic",
            category: "Pharmacology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-14",
            source: "https://example.com/pharmacology/cardiovascular",
            content: "### Cardiovascular Drugs\n\nCardiovascular drugs include antihypertensives, anticoagulants, antiarrhythmics, and treatments for heart failure. Key medical concepts include:\n\n- **Antihypertensives**:\n  - ACE inhibitors: End in -pril, block angiotensin II production\n  - ARBs: End in -sartan, block AT1 receptors\n  - CCBs: Dihydropyridines (amlodipine) and non-dihydropyridines (diltiazem, verapamil)\n  - Diuretics: Thiazides, loops, potassium-sparing\n  - Beta-blockers: Selective (metoprolol) and non-selective (propranolol)\n\n- **Anticoagulants**:\n  - Heparin: Activates antithrombin III, monitored by aPTT\n  - Warfarin: Inhibits vitamin K epoxide reductase, monitored by INR\n  - Direct oral anticoagulants (DOACs): Direct thrombin or factor Xa inhibitors\n\n- **Antiarrhythmics**: Classified by Vaughan Williams system (Classes I-IV) based on mechanism"
          },
          {
            title: "Beta-Blockers",
            type: "flashcard",
            category: "Pharmacology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-15",
            source: "https://example.com/pharmacology/beta-blockers",
            content: "What are the main indications for beta-blockers?\n---\nHypertension, angina, myocardial infarction, heart failure, arrhythmias, migraine prophylaxis, essential tremor, anxiety disorders, and glaucoma (ophthalmic preparations). Cardioselective beta-blockers (β1-selective) include metoprolol, atenolol, and bisoprolol. Non-selective include propranolol, nadolol, and carvedilol (with additional α-blocking activity)."
          },
          {
            title: "Penicillin",
            type: "flashcard",
            category: "Pharmacology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-16",
            source: "https://example.com/pharmacology/penicillin",
            content: "What is the mechanism of action of penicillin?\n---\nPenicillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), preventing cross-linking of peptidoglycan, which leads to cell lysis. This causes osmotic instability and bacterial cell death. Penicillins are bactericidal against actively dividing bacteria. Resistance occurs through β-lactamase production, altered PBPs, or decreased permeability."
          }
        ]
      },
      {
        title: "Pathology",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Pathology\n\nPathology is the study of disease processes, including their causes, development, and consequences. Medical education focuses on pathophysiology, morphology, and clinical correlations.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-17",
        source: "https://example.com/medicine/pathology",
        children: [
          {
            title: "Neoplasia",
            type: "topic",
            category: "Pathology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-17",
            source: "https://example.com/pathology/neoplasia",
            content: "### Neoplasia\n\nNeoplasia refers to abnormal tissue growth that may be benign or malignant. High-yield medical concepts include:\n\n- **Carcinogenesis**: Multi-step process involving initiation (DNA damage), promotion (clonal expansion), and progression (invasion/metastasis)\n\n- **Tumor markers**:\n  - PSA: Prostate cancer\n  - AFP: Hepatocellular carcinoma, yolk sac tumors\n  - CEA: Colorectal cancer\n  - CA-125: Ovarian cancer\n  - CA 19-9: Pancreatic cancer\n\n- **Tumor classification**:\n  - Benign: Well-differentiated, encapsulated, no invasion/metastasis\n  - Malignant: Poorly differentiated, invasive, metastatic potential\n\n- **Oncogenes and tumor suppressors**: RAS (proliferation), p53 (apoptosis), RB (cell cycle), BRCA (DNA repair)"
          },
          {
            title: "Inflammation",
            type: "topic",
            category: "Pathology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-18",
            source: "https://example.com/pathology/inflammation",
            content: "### Inflammation\n\nInflammation is a protective response involving immune cells, blood vessels, and molecular mediators. Medical-relevant concepts include:\n\n- **Acute inflammation**:\n  - Vascular changes: Vasodilation, increased permeability\n  - Cellular events: Neutrophil recruitment, phagocytosis\n  - Chemical mediators: Histamine, prostaglandins, leukotrienes, complement\n  - Cardinal signs: Rubor (redness), calor (heat), dolor (pain), tumor (swelling), functio laesa (loss of function)\n\n- **Chronic inflammation**:\n  - Cellular infiltrate: Macrophages, lymphocytes, plasma cells\n  - Tissue effects: Fibrosis, granuloma formation\n  - Examples: Tuberculosis, sarcoidosis, rheumatoid arthritis\n\n- **Wound healing**: Phases include hemostasis, inflammation, proliferation, and remodeling"
          },
          {
            title: "Metastasis",
            type: "flashcard",
            category: "Pathology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-19",
            source: "https://example.com/pathology/metastasis",
            content: "What are the steps of metastasis?\n---\nMetastasis involves: 1) Invasion of local tissue through loss of cell adhesion and secretion of proteolytic enzymes, 2) Intravasation into blood/lymphatic vessels, 3) Survival in circulation despite mechanical stress and immune surveillance, 4) Extravasation at distant site through attachment to endothelium and migration, 5) Colonization and growth in new environment requiring angiogenesis and evasion of local immune responses."
          },
          {
            title: "Cirrhosis",
            type: "flashcard",
            category: "Pathology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-20",
            source: "https://example.com/pathology/cirrhosis",
            content: "What are the major complications of cirrhosis?\n---\nPortal hypertension, ascites, hepatic encephalopathy, variceal bleeding, coagulopathy, hepatorenal syndrome, and increased risk of hepatocellular carcinoma. Cirrhosis represents the final common pathway of many chronic liver diseases with fibrosis replacing normal parenchyma, leading to altered liver architecture and function."
          }
        ]
      },
      {
        title: "Microbiology & Immunology",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Microbiology & Immunology\n\nMicrobiology and immunology cover pathogens and host defense mechanisms. These subjects are heavily tested on medical examinations.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-21",
        source: "https://example.com/medicine/microbiology",
        children: [
          {
            title: "Bacteriology",
            type: "topic",
            category: "Microbiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-21",
            source: "https://example.com/microbiology/bacteria",
            content: "### Bacteriology\n\nBacteriology studies bacterial pathogens, their characteristics, and diseases. Key medical concepts include:\n\n- **Classification**:\n  - Gram-positive: Thick peptidoglycan layer, no outer membrane, retain crystal violet\n  - Gram-negative: Thin peptidoglycan, outer membrane with LPS/endotoxin\n  - Acid-fast: Mycobacteria with waxy cell walls resistant to decolorization\n  - Morphology: Cocci, bacilli, spirochetes, etc.\n\n- **Virulence factors**:\n  - Exotoxins: Secreted proteins (tetanus toxin, diphtheria toxin)\n  - Endotoxin: Lipopolysaccharide (LPS) in gram-negative cell walls\n  - Adhesins: Facilitate attachment to host cells\n  - Capsules: Antiphagocytic polysaccharide layer\n\n- **Laboratory diagnosis**: Gram stain, culture characteristics, biochemical tests, molecular methods (PCR), MALDI-TOF mass spectrometry"
          },
          {
            title: "Immunology",
            type: "topic",
            category: "Immunology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-22",
            source: "https://example.com/immunology/basics",
            content: "### Immunology\n\nImmunology examines host defense mechanisms against pathogens. High-yield medical topics include:\n\n- **Innate immunity**:\n  - Physical barriers: Skin, mucous membranes\n  - Cellular components: Neutrophils, macrophages, NK cells, dendritic cells\n  - Molecular components: Complement system, antimicrobial peptides\n  - Pattern recognition receptors: Toll-like receptors detect PAMPs\n\n- **Adaptive immunity**:\n  - T cells: CD4+ (helper), CD8+ (cytotoxic), regulatory T cells\n  - B cells: Antibody production, plasma cells, memory B cells\n  - Antibody structure: Variable and constant regions, isotypes (IgG, IgM, IgA, IgE, IgD)\n\n- **Cytokines**: IL-1, IL-2, IL-4, IL-6, TNF-α, IFN-γ\n\n- **Hypersensitivity reactions**:\n  - Type I: IgE-mediated, immediate (allergies, anaphylaxis)\n  - Type II: Antibody-mediated cytotoxicity (transfusion reactions)\n  - Type III: Immune complex deposition (serum sickness)\n  - Type IV: T cell-mediated, delayed (contact dermatitis, TB skin test)"
          },
          {
            title: "T Cell Types",
            type: "flashcard",
            category: "Immunology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-23",
            source: "https://example.com/immunology/t-cells",
            content: "What are the main types of T cells and their functions?\n---\nCD4+ T helper cells: Activate other immune cells through cytokine secretion (Th1, Th2, Th17, Tfh subsets); CD8+ Cytotoxic T cells: Kill infected cells via perforin/granzyme and Fas/FasL pathways; T regulatory cells (Tregs): Suppress immune responses and maintain self-tolerance; Memory T cells: Provide long-term immunity with rapid response to previously encountered antigens."
          },
          {
            title: "Gram Stain",
            type: "flashcard",
            category: "Microbiology",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-24",
            source: "https://example.com/microbiology/gram-stain",
            content: "Why do gram-positive and gram-negative bacteria stain differently?\n---\nGram-positive bacteria have a thick peptidoglycan layer that retains crystal violet-iodine complex after alcohol washing, appearing purple. Gram-negative bacteria have a thin peptidoglycan layer and lose the primary stain during decolorization, taking up the counterstain safranin and appearing pink/red. The structural difference affects antibiotic penetration, with gram-negative bacteria having greater resistance due to their outer membrane."
          }
        ]
      },
      {
        title: "Biochemistry",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Biochemistry\n\nBiochemistry is the study of chemical processes within and relating to living organisms. It bridges biology and chemistry and is fundamental to understanding cellular functions and disease processes.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-25",
        source: "https://example.com/medicine/biochemistry",
        children: [
          {
            title: "Metabolism",
            type: "topic",
            category: "Biochemistry",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-25",
            source: "https://example.com/biochemistry/metabolism",
            content: "### Metabolism\n\nMetabolism encompasses all biochemical reactions involved in maintaining living state of cells. Key medical concepts include:\n\n- **Glycolysis**: Cytoplasmic pathway converting glucose to pyruvate, yielding 2 ATP and 2 NADH\n  - Rate-limiting enzymes: Hexokinase, phosphofructokinase-1, pyruvate kinase\n  - Net reaction: Glucose + 2 NAD⁺ + 2 ADP + 2 Pi → 2 Pyruvate + 2 NADH + 2 H⁺ + 2 ATP + 2 H₂O\n\n- **TCA cycle**: Mitochondrial cycle generating NADH and FADH₂ for oxidative phosphorylation\n  - Key enzymes: Citrate synthase, isocitrate dehydrogenase, α-ketoglutarate dehydrogenase\n  - Regulation: Inhibited by high NADH/NAD⁺ ratio and ATP levels\n\n- **Electron transport chain and oxidative phosphorylation**:\n  - Complexes I-IV transfer electrons to oxygen, generating proton gradient\n  - ATP synthase (Complex V) produces ATP from ADP + Pi using proton motive force\n  - Net yield: ~30-32 ATP per glucose molecule\n\n- **Fatty acid metabolism**: Beta-oxidation produces acetyl-CoA, NADH, and FADH₂"
          },
          {
            title: "Amino Acids",
            type: "topic",
            category: "Biochemistry",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-26",
            source: "https://example.com/biochemistry/amino-acids",
            content: "### Amino Acids\n\nAmino acids are the building blocks of proteins. Medical students must know their structures, properties, and metabolism:\n\n- **Classification**:\n  - Nonpolar/hydrophobic: Alanine, valine, leucine, isoleucine, methionine, phenylalanine, tryptophan, proline\n  - Polar/uncharged: Glycine, serine, threonine, cysteine, tyrosine, asparagine, glutamine\n  - Positively charged: Lysine, arginine, histidine\n  - Negatively charged: Aspartate, glutamate\n\n- **Essential amino acids**: Cannot be synthesized by humans, must be obtained through diet\n  - Mnemonic \"PVT TIM HALL\": Phenylalanine, Valine, Threonine, Tryptophan, Isoleucine, Methionine, Histidine, Arginine, Leucine, Lysine\n\n- **Amino acid derivatives**:\n  - Tyrosine → Dopamine, norepinephrine, epinephrine, melanin, thyroid hormones\n  - Tryptophan → Serotonin, melatonin, niacin\n  - Histidine → Histamine\n  - Methionine → S-adenosylmethionine (SAM, methyl donor)\n\nAmino acids are joined by peptide bonds, forming the primary structure of proteins."
          },
          {
            title: "Enzymes",
            type: "flashcard",
            category: "Biochemistry",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-27",
            source: "https://example.com/biochemistry/enzymes",
            content: "What is enzyme kinetics and the significance of Km?\n---\nEnzyme kinetics studies the rates of enzyme-catalyzed reactions, often described by the Michaelis-Menten equation. Km (Michaelis constant) represents the substrate concentration at which reaction rate is half of Vmax. Km is inversely related to substrate affinity—a lower Km indicates higher affinity. Clinically, enzyme kinetics helps understand drug metabolism, design enzyme inhibitors, and diagnose enzyme deficiencies."
          },
          {
            title: "Vitamins",
            type: "flashcard",
            category: "Biochemistry",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-28",
            source: "https://example.com/biochemistry/vitamins",
            content: "What are the fat-soluble vitamins and their deficiencies?\n---\nFat-soluble vitamins include:\n- Vitamin A (Retinol): Night blindness, xerophthalmia, hyperkeratosis\n- Vitamin D (Calciferol): Rickets in children, osteomalacia in adults\n- Vitamin E (Tocopherol): Hemolytic anemia, peripheral neuropathy, ataxia\n- Vitamin K: Bleeding diathesis, increased PT/INR\nFat-soluble vitamins can be stored in the body and may cause toxicity with excessive supplementation, particularly vitamins A and D."
          }
        ]
      },
      {
        title: "Clinical Skills",
        type: "topic",
        category: "Medicine",
        expanded: true,
        content: "## Clinical Skills\n\nClinical skills encompass the practical abilities necessary for patient care, including history taking, physical examination, communication, and procedural skills.",
        author: "Dr. Maria Chen",
        timestamp: "2025-04-29",
        source: "https://example.com/medicine/clinical-skills",
        children: [
          {
            title: "Physical Examination",
            type: "topic",
            category: "Clinical Skills",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-29",
            source: "https://example.com/clinical-skills/physical-exam",
            content: "### Physical Examination\n\nPhysical examination is a methodical evaluation of the patient to detect signs of disease. Key components include:\n\n- **General inspection**: Appearance, level of distress, vital signs (temperature, heart rate, blood pressure, respiratory rate, oxygen saturation)\n\n- **HEENT examination**:\n  - Head: Inspection, palpation for tenderness, masses\n  - Eyes: Visual acuity, pupillary reflexes, extraocular movements, fundoscopy\n  - Ears: Otoscopic examination, Weber and Rinne tests\n  - Nose: Patency, septum, mucosa\n  - Throat: Oropharynx, tonsils, dentition\n\n- **Cardiovascular examination**:\n  - Inspection: JVP, visible pulsations\n  - Palpation: PMI, thrills, pulses\n  - Auscultation: Heart sounds (S1, S2, S3, S4), murmurs characterized by timing, location, radiation, intensity (grade 1-6), pitch, and quality\n\n- **Respiratory examination**:\n  - Inspection: Respiratory rate and pattern, use of accessory muscles\n  - Palpation: Tactile fremitus, chest expansion\n  - Percussion: Resonant (normal), dull (consolidation, pleural effusion), hyperresonant (pneumothorax, emphysema)\n  - Auscultation: Breath sounds, adventitious sounds (crackles, wheezes, rubs)\n\n- **Abdominal examination**:\n  - Inspection: Contour, visible peristalsis, scars\n  - Auscultation: Bowel sounds, bruits\n  - Percussion: Tympany, dullness, shifting dullness in ascites\n  - Palpation: Tenderness, masses, organomegaly"
          },
          {
            title: "History Taking",
            type: "topic",
            category: "Clinical Skills",
            author: "Dr. Maria Chen",
            timestamp: "2025-04-30",
            source: "https://example.com/clinical-skills/history",
            content: "### History Taking\n\nHistory taking is the process of gathering information from the patient through effective interviewing. Components include:\n\n- **Chief complaint (CC)**: The primary reason for the patient's visit, in their own words\n\n- **History of present illness (HPI)**: Detailed chronological account of the current problem\n  - OPQRST framework for pain: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Timing\n  - Associated symptoms\n  - Previous treatments and response\n\n- **Past medical history (PMH)**:\n  - Medical conditions\n  - Surgical procedures\n  - Hospitalizations\n  - Allergies and reactions\n  - Current medications (prescription and OTC)\n  - Immunization status\n\n- **Family history (FH)**: Health status of first-degree relatives, hereditary conditions\n\n- **Social history (SH)**:\n  - Occupational history and exposures\n  - Tobacco, alcohol, and substance use\n  - Sexual history when relevant\n  - Diet, exercise, and sleep patterns\n  - Social support and living situation\n\n- **Review of systems (ROS)**: Systematic inquiry of symptoms by organ system"
          },
          {
            title: "Heart Murmurs",
            type: "flashcard",
            category: "Clinical Skills",
            author: "Dr. Maria Chen",
            timestamp: "2025-05-01",
            source: "https://example.com/clinical-skills/heart-murmurs",
            content: "How do you differentiate common heart murmurs?\n---\n- Aortic stenosis: Harsh mid-systolic crescendo-decrescendo murmur, radiates to carotids, best heard at right upper sternal border\n- Mitral regurgitation: Holosystolic murmur, radiates to axilla, best heard at apex\n- Mitral stenosis: Low-pitched diastolic rumble with presystolic accentuation, best heard at apex in left lateral position\n- Aortic regurgitation: High-pitched early diastolic decrescendo murmur, best heard at left lower sternal border with patient sitting forward in deep exhalation"
          },
          {
            title: "Abdominal Pain",
            type: "flashcard",
            category: "Clinical Skills",
            author: "Dr. Maria Chen",
            timestamp: "2025-05-02",
            source: "https://example.com/clinical-skills/abdominal-pain",
            content: "What is the differential diagnosis for right lower quadrant abdominal pain?\n---\n- Appendicitis: Periumbilical pain migrating to RLQ, anorexia, nausea/vomiting, fever, rebound tenderness, positive psoas sign\n- Ileocecal Crohn's disease: Chronic diarrhea, weight loss, fatigue, possible mass\n- Ovarian pathology (women): Ovarian torsion, ruptured ovarian cyst, tubo-ovarian abscess\n- Ectopic pregnancy (women): Amenorrhea, positive β-hCG, vaginal bleeding\n- Mesenteric adenitis: Often follows viral infection, lymphadenopathy\n- Cecal diverticulitis: Similar to appendicitis but typically in older patients\n- Intussusception (children): Intermittent colicky pain, currant jelly stools, palpable mass"
          }
        ]
      }
    ]
  }
];

/**
 * Helper function to flatten the tree data structure into a normalized array.
 * @param {Array} treeData - The hierarchical tree data to normalize
 * @param {Array} normalizedTreeData - Accumulator for the normalized data
 * @returns {Array} The flattened array of all nodes
 * @private
 */
const _normalizeTreeData = (treeData, normalizedTreeData = []) => {
  (treeData || []).forEach((item) => {
    normalizedTreeData.push(item);
    if (item.children?.length > 0) {
      _normalizeTreeData(item.children, normalizedTreeData);
    }
  });
  return normalizedTreeData;
};

/**
 * Normalizes tree data into a flat array for easier processing.
 * @param {Array} treeData - The hierarchical tree data to normalize
 * @returns {Array} The flattened array of all nodes
 */
export const normalizeTreeData = _normalizeTreeData;

/**
 * Returns the root node of the tree and its path for initial selection.
 * @param {Array} treeData - The hierarchical tree data
 * @returns {Array} An array containing the root node and its path
 */
export const rootNodeSelectionPayload = (treeData) => [treeData[0], [0]];

/**
 * Generates a random integer between min and max, different from the current value.
 * Used for the "Discover" feature to randomly select a different node.
 *
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @param {number} current - The current value to exclude
 * @returns {number} A random integer different from the current value
 */
export function getRandomIntExcept(min, max, current) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // Ensure max is at least min to avoid issues with range calculation
  if (max < min) {
      max = min;
  }
  // If only one possible value (excluding current is impossible)
  if (max === min && min === current) {
    // Or handle this case as an error/edge case if preferred
    return min;
  }
  // If range is only one item and it's the current one, adjust range slightly
  if (max - min === 0 && min === current) {
      // This case should ideally not happen if max is handled correctly above,
      // but as a fallback, maybe return min or max depending on context.
      // Let's return min as a default.
      return min;
  }

  let random;
  do {
      // Calculate range size correctly (inclusive)
      const rangeSize = max - min + 1;
      // Handle case where rangeSize might be 0 or negative if max < min initially
      if (rangeSize <= 0) {
          // Fallback or error handling needed
          return min; // Default fallback
      }
      random = Math.floor(Math.random() * rangeSize) + min;
  } while (random === current && rangeSize > 1); // Keep trying only if there are other options

  return random;
}
