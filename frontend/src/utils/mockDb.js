const SEED_SERVICES = [
  {
    _id: 'srv_1',
    title: 'Doctor Consultation',
    slug: 'doctor-consultation',
    shortDescription: 'Qualified general physicians and specialists visiting your home or consulting online.',
    fullDescription: 'Our Doctor Consultation service connects you with certified clinicians for home visits and virtual consultations. Skip travel stress, clinic queues, and potential cross-infections while receiving personalized primary care, mental health counselling, or expert second opinions at your convenience.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'In-person clinical diagnoses at your bedside',
      'Zero exposure to clinic queues and hospital-acquired infections (HAI)',
      'Direct access to national & international specialists for second opinions',
      'Continuous annual tracking with the Family Doctor program',
      'Integrated home sample collections and doorstep pharmacy deliveries',
      'Comprehensive digital prescriptions and secure e-health records'
    ],
    subServices: [
      { name: 'Doctor @ Home Visit', description: 'In-person general physician bedside visits for physical examination, diagnostics coordination, and prescriptions.', price: 1500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400' },
      { name: 'eConsultation (Video/Audio)', description: 'Remote video or voice call with a qualified doctor for quick diagnosis, vitals check, and drug renewals.', price: 500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
      { name: 'Specialist Second Opinion', description: 'Expert clinical diagnosis audits and case review by senior consultants to guide critical treatment plans.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=400' },
      { name: 'Family Doctor Annual Cover', description: 'Dedicated primary care physician coverage for regular checks and health tracking throughout the year.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Emotional Counselling', description: 'Confidential online sessions with general psychologists for emotional support, stress management, and mental wellness.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1527137341206-1a7ad25f8285?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'What is Doctor @ Home visit service?', answer: 'It is a bedside consultation where a qualified doctor visits your home. A paramedic coordinate can also assist with physical assessments and real-time vital feeds.' },
      { question: 'How does Second Opinion help?', answer: 'It allows leading medical specialists to review your diagnosis and check treatment plans remotely, ensuring peace of mind for critical clinical decisions.' },
      { question: 'Are prescription refills available virtually?', answer: 'Yes, our certified practitioners can issue digital prescriptions during remote video or audio consults if clinically suitable.' }
    ],
    price: 1500,
    bookable: true,
    active: true,
    displayOrder: 0,
    icon: 'UserCheck',
    preparationInstructions: 'Please keep your past medical histories, reports, and current prescriptions handy for the doctor to audit.'
  },
  {
    _id: 'srv_2',
    title: 'Ambulance Services',
    slug: 'ambulance-services',
    shortDescription: '24/7 advanced life support and basic life support medical transport.',
    fullDescription: 'We provide prompt, secure, and fully equipped Ambulance Services for both emergencies and non-emergency patient transfers.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      '24/7 availability with rapid response times',
      'Advanced medical transport monitoring and oxygen support',
      'Trained critical care paramedics on board',
      'Seamless coordination with hospital emergency rooms'
    ],
    subServices: [
      { name: 'Basic Ambulance', description: 'Basic Life Support (BLS) vehicle for transport, equipped with stretchers and oxygen supply.', price: 3000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400' },
      { name: 'Ventilator Ambulance', description: 'Advanced Life Support (ALS) vehicle with ICU ventilators, multi-para monitor, and emergency paramedic.', price: 8000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'Do you provide out-of-city transport?', answer: 'Yes. We support patient transfers across cities with ICU monitoring on board if required.' }
    ],
    price: 3000,
    bookable: true,
    active: true,
    displayOrder: 1,
    icon: 'Truck',
    preparationInstructions: 'Ensure the patient has their emergency referral sheet and emergency vitals summary before loading.'
  },
  {
    _id: 'srv_3',
    title: 'Nursing Services',
    slug: 'nursing-services',
    shortDescription: 'Compassionate, professional nursing care for short-term and long-term recovery.',
    fullDescription: 'Our registered and associate nurses provide complete home nursing care at your bedside, ensuring hospital-level nursing protocols are followed.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'Highly trained, certified nursing professionals',
      'Care plan customized to doctor prescriptions',
      'Hygiene maintenance and patient mobilization',
      'Regular health status reports shared with family and doctors'
    ],
    subServices: [
      { name: 'General Nursing Care', description: 'Bedside assistance for monitoring vitals, hygiene, and daily medical logs.', price: 2500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' },
      { name: 'Emergency Nursing Care', description: 'Immediate clinical nursing for critical vital drops and trauma recovery.', price: 3500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400' },
      { name: 'Wound Care Management', description: 'Aseptic dressing changes for diabetic or surgical wounds.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' },
      { name: 'Bed Sore Care', description: 'Positioning plans, air bed setups, and specialized sore dressings.', price: 1500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400' },
      { name: 'Tracheostomy Care', description: 'Cannula cleaning, suctioning, and stoma site cleaning.', price: 1800, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dressing Services', description: 'Post-op clinical dressing changes and stitch removals.', price: 800, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500' },
      { name: 'VAC Therapy', description: 'Vacuum-assisted wound closure device installation and foam dressing replacement.', price: 4500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' },
      { name: 'Post-Surgery Nursing Care', description: 'Rehabilitation support, vitals charts, and post-op drug administration.', price: 2500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
      { name: 'Elderly Patient Care', description: 'Elderly assistance for daily routines, drug feeding, and companionship.', price: 2000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' },
      { name: 'Long-Term Home Nursing Support', description: 'Monthly subscription nursing shifts (12/24 hours) for bedridden patients.', price: 50000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'What is the duration of a nursing shift?', answer: 'We offer 12-hour shifts as well as 24-hour live-in support depending on patient requirements.' }
    ],
    price: 2500,
    bookable: true,
    active: true,
    displayOrder: 2,
    icon: 'HeartPulse',
    preparationInstructions: 'A clean, well-ventilated bedside space with access to warm water and power plugs is recommended.'
  },
  {
    _id: 'srv_4',
    title: 'ICU Setup at Home',
    slug: 'icu-setup-at-home',
    shortDescription: 'Comprehensive critical care setup with ventilators, monitors, and 24/7 nursing.',
    fullDescription: 'For patients who require intensive monitoring but prefer recovering at home, we install a complete Intensive Care Unit (ICU) setup.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'Hospital-grade critical care equipment',
      '24/7 dedicated critical care nursing staff',
      'Significant cost savings compared to hospital ICU stays',
      'Higher psychological comfort in a familiar home environment'
    ],
    subServices: [
      { name: 'ICU Hospital Bed', description: 'Motorized hospital-grade ICU bed with back/knee raise and safety side rails.', price: 3500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=500' },
      { name: 'Patient Monitor', description: 'Multi-parameter monitor with alarms for pulse, oxygen levels, and temperature.', price: 2000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=500' },
      { name: 'Oxygen Concentrator', description: 'Bedside oxygen extraction unit supplying up to 5/10 L/min of medical oxygen.', price: 4500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Oxygen Cylinder', description: 'Back-up high pressure cylinder for power cuts and transfers.', price: 1500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'BiPAP Machine', description: 'Non-invasive ventilator supplying bilevel positive airway pressures.', price: 3000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'CPAP Machine', description: 'Continuous positive airway pressure unit for sleep apnea.', price: 2500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Nebulizer', description: 'Compressed air device for inhaling medication mist.', price: 800, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Suction Machine', description: 'Oral and tracheal aspirator for fluid suctioning.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Pulse Oximeter', description: 'Handheld monitor check device for SpO2 and pulse readings.', price: 300, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Infusion Pump', description: 'Micro-dose drug administration pump.', price: 1000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500' },
      { name: 'Complete Home ICU Setup', description: 'Bundle setup of hospital bed, monitor, concentrator, backup cylinder, suction machine, and installation.', price: 15000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=500' }
    ],
    faqs: [
      { question: 'How long does it take to set up an ICU room at home?', answer: 'Typically, it takes 4 to 6 hours to deliver, install, and calibrate the medical machinery.' }
    ],
    price: 12000,
    bookable: true,
    active: true,
    displayOrder: 3,
    icon: 'Activity',
    preparationInstructions: 'Requires a dedicated room, continuous power supply with UPS/generator backup, and sterile hygiene conditions.'
  },
  {
    _id: 'srv_5',
    title: 'Laboratory Services',
    slug: 'laboratory-services',
    shortDescription: 'Diagnostic blood tests and sample collection from your home.',
    fullDescription: 'Get accurate medical diagnostics without leaving your house. Our certified phlebotomists visit your home for sample collection.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'Hassle-free, hygienic home sample collection',
      'NABL-accredited diagnostic accuracy',
      'Fast turnaround time for electronic reports',
      'Wide panel of tests (Thyroid, CBC, Diabetes, Lipid, etc.)'
    ],
    subServices: [
      { name: 'Home Blood Sample Collection', description: 'Certified phlebotomist visit for collecting blood samples aseptic vials.', price: 200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400' },
      { name: 'Blood Tests', description: 'Complete Blood Count (CBC), Sugar Fasting, Liver (LFT), and Kidney Panels (KFT).', price: 800, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400' },
      { name: 'Urine Sample Collection', description: 'Container collection and lab transfer for urine analysis.', price: 300, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400' },
      { name: 'Diagnostic Sample Collection', description: 'Specialized diagnostic collections (swabs, skin scrapes) for cultures.', price: 500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'When do I get my test reports?', answer: 'Digital reports are emailed/messaged in 12 to 24 hours depending on the complexity of the test panel.' }
    ],
    price: 800,
    bookable: true,
    active: true,
    displayOrder: 4,
    icon: 'FlaskConical',
    preparationInstructions: 'Fasting of 8 to 12 hours is required for glucose, thyroid, and lipid profiles. Please verify details during booking.'
  },
  {
    _id: 'srv_6',
    title: 'Pharmacy',
    slug: 'pharmacy',
    shortDescription: 'Prescription medicines delivered directly to your doorstep.',
    fullDescription: 'Never run out of essential medicines. Upload your prescription and our pharmacy team will deliver verified medications directly to your home.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      '100% genuine and verified medicines',
      'Timely doorstep deliveries',
      'Refill alerts for chronic disease medications',
      'Secure storage and temperature-controlled logistics'
    ],
    subServices: [
      { name: 'Doorstep Medicine Delivery', description: 'Prompt dispatch of uploaded prescription drugs.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400' },
      { name: 'Monthly Medicine Refills', description: 'Subscribed refills for diabetes, blood pressure medications.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400' },
      { name: 'Prescription Medicine Delivery', description: 'Vetted pharmacist verification and dispatch coordinates.', price: 0, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'Can I order medicines without a prescription?', answer: 'No. Prescription-only medicines require uploading a valid prescription from a registered doctor.' }
    ],
    price: 0,
    bookable: false,
    active: true,
    displayOrder: 5,
    icon: 'Pills',
    preparationInstructions: 'Please upload a clear picture of your doctor’s prescription sheet showing the patient name, drugs, and duration.'
  },
  {
    _id: 'srv_7',
    title: 'Physiotherapy',
    slug: 'physiotherapy',
    shortDescription: 'Professional physical therapy for pain relief, stroke recovery, and mobility.',
    fullDescription: 'Our certified physiotherapists design customized home rehabilitation programs.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'Tailored exercise programs for faster recovery',
      'Use of modern therapeutic modalities (TENS, ultrasound, etc.)',
      'Safe, one-on-one sessions without travel pain',
      'Progress metrics tracked and shared weekly'
    ],
    subServices: [
      { name: 'Home Physiotherapy', description: 'Standard muscle mobilization, workout reviews, and dry needling.', price: 1000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' },
      { name: 'Orthopedic Physiotherapy', description: 'Rehabilitation following joint replacements, fractures, or arthritis pain.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' },
      { name: 'Neurological Rehabilitation', description: 'Re-training motor pathways for stroke, Parkinson\'s, or spinal injuries.', price: 1500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' },
      { name: 'Post-Surgery Rehabilitation', description: 'Post-op knee/hip mobility exercises to gain movement ranges.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' },
      { name: 'Elderly Mobility Therapy', description: 'Balance, gait training, and falls-prevention exercises for seniors.', price: 1000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'How many sessions will I need?', answer: 'Our therapist does a assessment on the first visit to formulate session counts.' }
    ],
    price: 1000,
    bookable: true,
    active: true,
    displayOrder: 6,
    icon: 'Accessibility',
    preparationInstructions: 'We recommend wearing loose, comfortable clothing and clearing a flat surface space for workouts.'
  },
  {
    _id: 'srv_8',
    title: 'Dietician Consultation',
    slug: 'dietician-consultation',
    shortDescription: 'Customized clinical nutrition plans for weight, diabetes, and cardiovascular health.',
    fullDescription: 'Eat right to heal faster and stay healthy. Our clinical dieticians offer home visits and virtual sessions to formulate highly personalized nutrition plans.',
    bannerImage: '',
    galleryImages: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400'],
    benefits: [
      'Detailed diet assessment based on medical history',
      'Customized meal charts based on regional dietary habits',
      'Supportive counseling and follow-up guidance',
      'Collaboration with treating physicians'
    ],
    subServices: [
      { name: 'Personalized Diet Plans', description: 'Customized food charts based on height, weight, and clinical parameters.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400' },
      { name: 'Clinical Nutrition', description: 'Specialized nutritional plans for kidney disease, heart issues, and cancer.', price: 1500, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400' },
      { name: 'Weight Management', description: 'Structured calorie deficit/surplus guidance charts.', price: 1000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400' },
      { name: 'Diabetes Diet Consultation', description: 'Low glycemic index charts and glucose tracker coordination.', price: 1200, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400' },
      { name: 'Nutrition Counseling', description: 'Counseling on healthy eating habits, food substitutions, and lifestyle improvements.', price: 1000, bookable: true, active: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400' }
    ],
    faqs: [
      { question: 'Can the dietician design meals for diabetic patients?', answer: 'Yes. Our clinical dieticians are specialists in therapeutic diets for diabetes, hypertension, and renal care.' }
    ],
    price: 1200,
    bookable: true,
    active: true,
    displayOrder: 7,
    icon: 'Apple',
    preparationInstructions: 'Please gather your recent lab test reports (like blood sugar HbA1c, lipid profile, renal panel) to help the dietician design your nutrition plans.'
  }
];

const SEED_TESTIMONIALS = [
  {
    _id: 't_1',
    name: 'Rajesh Sharma',
    text: 'Setting up the ICU at home for my father was the best decision. The equipment was state-of-the-art and the 24/7 nursing team was extremely professional and compassionate. Highly recommend!',
    designation: 'Son of patient, Nizamabad',
    image: '',
    order: 0
  },
  {
    _id: 't_2',
    name: 'Dr. Priya Nair',
    text: 'As a practicing physician, I always refer my patients to their home nursing services. Their post-operative dressing and drug administration compliance are excellent. A very reliable team.',
    designation: 'Consultant Cardiologist',
    image: '',
    order: 1
  },
  {
    _id: 't_3',
    name: 'Sarah D\'Souza',
    text: 'My grandmother was suffering from severe knee pain. The physiotherapist visited us three times a week. Within a month, her mobility improved drastically. Booking was very simple.',
    designation: 'Granddaughter of patient',
    image: '',
    order: 2
  }
];

const SEED_FAQS = [
  {
    _id: 'faq_1',
    question: 'How do I book a home healthcare service?',
    answer: 'You can book by filling out the form on our "Book a Service" page, calling our emergency number, or sending a message on WhatsApp. Our coordinator will call you back within 15 minutes to confirm details.',
    order: 0
  },
  {
    _id: 'faq_2',
    question: 'Are your medical staff qualified and verified?',
    answer: 'Yes. All our doctors, nurses, physiotherapists, and care attendants undergo rigorous background checks, credential validation, and clinical evaluations before they are deployed to patients.',
    order: 1
  },
  {
    _id: 'faq_3',
    question: 'What happens in case of a medical emergency at home?',
    answer: 'We provide 24/7 emergency support. If a patient under our care experiences an acute emergency, our standby nursing staff coordinates immediate transport via our dedicated BLS/ALS ambulances.',
    order: 2
  },
  {
    _id: 'faq_4',
    question: 'How does the ICU Setup at Home work?',
    answer: 'We deliver and install all required hospital-grade critical care equipment (ventilator, monitor, infusion pump, etc.) and deploy ICU-trained nurses. A consulting intensivist doctor oversees the patient via daily visits and remote telemetry.',
    order: 3
  }
];

const SEED_SETTINGS = {
  homepage: {
    heroHeading: 'Hospital-Quality Medical Care, at the Comfort of Your Home',
    heroDescription: 'Avoid stressful travel and hospital waiting rooms. We bring certified doctors, critical ICU setups, skilled nurses, and emergency support directly to your bedside.',
    ctaText: 'Book a Service',
    whyChooseUs: [
      { title: 'Experienced Clinicians', desc: 'All care is delivered by licensed medical professionals with intensive hospital backgrounds.' },
      { title: 'Hospital-Grade Equipment', desc: 'We install high-quality ventilators, monitors, and specialized medical beds directly at home.' },
      { title: '24/7 Quick Response', desc: 'Dedicated round-the-clock ambulance dispatch and medical helpline at your disposal.' },
      { title: 'Affordable Recovery', desc: 'Save up to 60% compared to extended hospital ICU or clinical boarding charges.' }
    ],
    howItWorks: [
      { step: '1', title: 'Request Service', desc: 'Fill out our simple form or contact us via call/WhatsApp to describe your clinical needs.' },
      { step: '2', title: 'Medical Assessment', desc: 'Our head coordinator reviews and aligns with doctors to design a custom care plan.' },
      { step: '3', title: 'Expert Deployment', desc: 'We deliver medical machinery, dispatch professionals, and coordinate immediate setup.' },
      { step: '4', title: 'Continuous Monitoring', desc: 'Get ongoing clinical audits, physician visits, and emergency support backup.' }
    ],
    founders: [
      {
        name: 'Dr. Anand Verma',
        role: 'Founder & Chief Medical Director',
        experience: '22+ Years Experience',
        bio: 'Our mission is to bring high-acuity critical care directly to patient bedrooms in Nizamabad, ensuring families recover together.',
        img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
      },
      {
        name: 'Dr. Priya Naidu',
        role: 'Co-founder & Chief Clinical Strategist',
        experience: '15+ Years Experience',
        bio: 'By establishing professional home nursing standards, we guarantee safety and clinical reliability for every recovery.',
        img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  contact: {
    phoneNumbers: ['+91 92488 49388', '+91 63035 91409'],
    emailAddress: 'contact@company.com',
    whatsappNumber: '+91 92488 49388',
    officeAddress: 'Chandra Shekar Colony, Nizamabad, Telangana - 503002',
    workingHours: 'Mon - Sun: 24/7 Available for Emergencies',
    emergencyContact: '+91 92488 49388',
    googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60320.09117621495!2d78.06456073100346!3d18.672462371908477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcddb435ff51ca1%3A0x67dbb8a0717e1329!2sNizamabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin',
    socials: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  email: {
    smtpHost: 'smtp.mailtrap.io',
    smtpPort: 2525,
    smtpUser: 'mock-user',
    smtpPass: 'mock-pass',
    businessEmail: 'bookings@company.com',
    senderName: 'Healthcare Services Support',
    templates: {
      patientConfirmation: 'Dear {{patientName}},\n\nThank you for choosing our services. We have received your booking request for {{serviceName}}.',
      adminNotification: 'Hello Admin,\n\nA new booking request has been submitted.'
    }
  },
  web: {
    companyName: 'Nest Cares.in',
    logoUrl: '/logo.png',
    faviconUrl: '',
    footerContent: 'Providing hospital-quality medical services at the comfort of your home. Trusted by over 10,000+ families.',
    copyright: '© 2026 Nest Cares.in Healthcare Services. All rights reserved.',
    seoTitle: 'Nest Cares.in - Premium Home Healthcare Services',
    seoDescription: 'Hospital-level ICU setups, home doctors, specialized nurses, and 24/7 ambulance services.',
    googleAnalyticsCode: 'UA-XXXXX-X'
  }
};

const SEED_DOCTORS = [
  {
    _id: 'doc_1',
    doctorId: 'DOC-101',
    password: 'doctor123',
    name: 'Dr. Anand Verma',
    designation: 'Chief Consultant Cardiologist & Medical Director',
    experience: '22 Years Experience',
    bio: 'Founder & Chief Medical Director overseeing home clinical procedures, emergency triage audits, and bedside telemetry systems.',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    speciality: 'Cardiology & ICU Care',
    active: true
  },
  {
    _id: 'doc_2',
    doctorId: 'DOC-102',
    password: 'doctor123',
    name: 'Dr. Priya Naidu',
    designation: 'Senior Consultant Pediatrist & Geriatrics Specialist',
    experience: '15 Years Experience',
    bio: 'Co-founder & Chief Clinical Strategist managing home pediatric setups, elderly recovery guidelines, and bedside nursing standards.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    speciality: 'Geriatrics & Pediatrics',
    active: true
  },
  {
    _id: 'doc_3',
    doctorId: 'DOC-103',
    password: 'doctor123',
    name: 'Dr. K. Srinivas',
    designation: 'Consultant Pulmonologist & Critical Care Advisor',
    experience: '18 Years Experience',
    bio: 'Consulting Pulmonologist specialized in home respirator calibrations, BiPAP/CPAP settings audits, and clinical oxygen management.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    speciality: 'Pulmonology & ICU Care',
    active: true
  }
];

const initializeLocalStorage = () => {
  try {
    const servicesStr = localStorage.getItem('mock_services');
    const settingsStr = localStorage.getItem('mock_settings');
    const doctorsStr = localStorage.getItem('mock_doctors');
    const needSeed = !servicesStr || !settingsStr || !settingsStr.includes('Nest Cares') || !settingsStr.includes('/logo.png') || !settingsStr.includes('Chandra Shekar') || !settingsStr.includes('founders') || !doctorsStr;
    if (needSeed) {
      localStorage.setItem('mock_services', JSON.stringify(SEED_SERVICES));
      localStorage.setItem('mock_testimonials', JSON.stringify(SEED_TESTIMONIALS));
      localStorage.setItem('mock_faqs', JSON.stringify(SEED_FAQS));
      localStorage.setItem('mock_settings', JSON.stringify(SEED_SETTINGS));
      localStorage.setItem('mock_doctors', JSON.stringify(SEED_DOCTORS));
      localStorage.setItem('mock_bookings', JSON.stringify([]));
      localStorage.setItem('mock_initialized', 'true');
      console.log('✅ LocalStorage Mock Database initialized with Nest Cares.in branding!');
    }
  } catch (e) {
    console.error('Failed to initialize local storage database:', e);
  }
};

const safeJsonParse = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'undefined' || val === 'null') return fallback;
    return JSON.parse(val);
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
};

initializeLocalStorage();

export const mockDb = {
  getServices: (includeHidden = false) => {
    const list = safeJsonParse('mock_services', []);
    const visible = includeHidden ? list : list.filter(s => s && s.active);
    return visible.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  saveService: (serviceData) => {
    const list = safeJsonParse('mock_services', []);
    if (serviceData._id) {
      const idx = list.findIndex(s => s && s._id === serviceData._id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...serviceData };
      }
    } else {
      const newSrv = {
        _id: 'srv_' + Date.now(),
        slug: serviceData.title.toLowerCase().replace(/\s+/g, '-'),
        displayOrder: list.length,
        active: true,
        bookable: true,
        icon: 'Heart',
        ...serviceData
      };
      list.push(newSrv);
    }
    localStorage.setItem('mock_services', JSON.stringify(list));
    return list;
  },

  deleteService: (id) => {
    const list = safeJsonParse('mock_services', []);
    const filtered = list.filter(s => s && s._id !== id);
    localStorage.setItem('mock_services', JSON.stringify(filtered));
    return filtered;
  },

  reorderServices: (orderedIds) => {
    const list = safeJsonParse('mock_services', []);
    const reordered = orderedIds.map((id, index) => {
      const item = list.find(s => s && s._id === id);
      if (item) item.displayOrder = index;
      return item;
    }).filter(Boolean);
    localStorage.setItem('mock_services', JSON.stringify(reordered));
    return reordered;
  },

  getBookings: (filters = {}) => {
    const list = safeJsonParse('mock_bookings', []);
    let filtered = [...list];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b && (
          b.name?.toLowerCase().includes(q) || 
          b.serviceName?.toLowerCase().includes(q) ||
          b.subServiceName?.toLowerCase().includes(q) ||
          b.mobile?.includes(q)
        )
      );
    }
    if (filters.service && filters.service !== 'all') {
      filtered = filtered.filter(b => b && b.serviceName === filters.service);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b && b.status === filters.status);
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getStats: () => {
    const bookings = safeJsonParse('mock_bookings', []);
    const services = safeJsonParse('mock_services', []);
    return {
      total: bookings.length,
      pending: bookings.filter(b => b && b.status === 'pending').length,
      approved: bookings.filter(b => b && b.status === 'approved').length,
      completed: bookings.filter(b => b && b.status === 'completed').length,
      rejected: bookings.filter(b => b && b.status === 'rejected').length,
      totalServices: services.length,
      recentBookings: bookings.slice(0, 5)
    };
  },

  createBooking: (bookingData) => {
    const list = safeJsonParse('mock_bookings', []);
    let nextId = 100;
    
    if (list && list.length > 0) {
      const bookingNumbers = list
        .map(b => {
          if (b.bookingId && b.bookingId.startsWith('NEST-')) {
            const num = parseInt(b.bookingId.replace('NEST-', ''), 10);
            return isNaN(num) ? null : num;
          }
          return null;
        })
        .filter(n => n !== null);
      if (bookingNumbers.length > 0) {
        nextId = Math.max(...bookingNumbers) + 1;
      }
    }
    const bookingId = `NEST-${nextId}`;

    const newBooking = {
      _id: 'b_' + Date.now(),
      bookingId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    list.push(newBooking);
    localStorage.setItem('mock_bookings', JSON.stringify(list));
    return newBooking;
  },

  updateBookingStatus: (id, status) => {
    const list = safeJsonParse('mock_bookings', []);
    const idx = list.findIndex(b => b && b._id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem('mock_bookings', JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  getTestimonials: () => {
    return safeJsonParse('mock_testimonials', []);
  },

  saveTestimonial: (data) => {
    const list = safeJsonParse('mock_testimonials', []);
    if (data._id) {
      const idx = list.findIndex(t => t && t._id === data._id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
    } else {
      const newTest = { _id: 't_' + Date.now(), order: list.length, ...data };
      list.push(newTest);
    }
    localStorage.setItem('mock_testimonials', JSON.stringify(list));
    return list;
  },

  deleteTestimonial: (id) => {
    const list = safeJsonParse('mock_testimonials', []);
    const filtered = list.filter(t => t && t._id !== id);
    localStorage.setItem('mock_testimonials', JSON.stringify(filtered));
    return filtered;
  },

  getFaqs: () => {
    return safeJsonParse('mock_faqs', []);
  },

  saveFaq: (data) => {
    const list = safeJsonParse('mock_faqs', []);
    if (data._id) {
      const idx = list.findIndex(f => f && f._id === data._id);
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
    } else {
      const newFaq = { _id: 'faq_' + Date.now(), order: list.length, ...data };
      list.push(newFaq);
    }
    localStorage.setItem('mock_faqs', JSON.stringify(list));
    return list;
  },

  deleteFaq: (id) => {
    const list = safeJsonParse('mock_faqs', []);
    const filtered = list.filter(f => f && f._id !== id);
    localStorage.setItem('mock_faqs', JSON.stringify(filtered));
    return filtered;
  },

  getDoctors: () => {
    return safeJsonParse('mock_doctors', []);
  },

  saveDoctor: (docData) => {
    const list = safeJsonParse('mock_doctors', []);
    if (docData._id) {
      const idx = list.findIndex(d => d && d._id === docData._id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...docData };
      }
    } else {
      const newDoc = {
        _id: 'doc_' + Date.now(),
        doctorId: docData.doctorId || `DOC-${101 + list.length}`,
        password: docData.password || 'doctor123',
        active: true,
        ...docData
      };
      list.push(newDoc);
    }
    localStorage.setItem('mock_doctors', JSON.stringify(list));
    return list;
  },

  deleteDoctor: (id) => {
    const list = safeJsonParse('mock_doctors', []);
    const filtered = list.filter(d => d && d._id !== id);
    localStorage.setItem('mock_doctors', JSON.stringify(filtered));
    return filtered;
  },

  getSettings: () => {
    return safeJsonParse('mock_settings', {});
  },

  saveSettingsKey: (key, value) => {
    const settings = safeJsonParse('mock_settings', {});
    settings[key] = value;
    localStorage.setItem('mock_settings', JSON.stringify(settings));
    return settings;
  }
};

initializeLocalStorage();
