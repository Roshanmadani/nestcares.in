import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, X, Send, CheckCircle2, AlertCircle, MessageSquare, Mic, MicOff, Globe } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import { mockDb } from '../utils/mockDb';

const FloatingButtons = ({ contactSettings, hideOnMobile = false }) => {
  const [showScroll, setShowScroll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Chat Language State: 'english' or 'telugu'
  const [chatLang, setChatLang] = useState(localStorage.getItem('preferred_language') || 'english');

  useEffect(() => {
    const handleGlobalLang = () => {
      setChatLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', handleGlobalLang);
    return () => window.removeEventListener('languageChanged', handleGlobalLang);
  }, []);
  
  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Conversational Booking State
  // steps: 0 = idle, 1 = category, 2 = subservice, 3 = mobile, 4 = address, 5 = confirm
  const [bookingState, setBookingState] = useState({
    step: 0,
    serviceName: '',
    subServiceName: '',
    name: 'Chatbot Guest',
    mobile: '',
    address: '',
    preferredDate: '',
    preferredTime: 'Immediate (15 Mins)'
  });

  // Service Details Viewing State: null, 'list', or specific service category title
  const [activeServiceDetails, setActiveServiceDetails] = useState(null);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to Nest Cares.in. I'm your digital healthcare assistant. You can talk to me in English or Telugu! Would you like to book a service? (Click the Book chip below or type 'book').",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 92488 49388';
  const whatsapp = contactSettings?.whatsappNumber || '+91 92488 49388';
  const cleanPhone = String(phone || '').replace(/[^+\d]/g, '');
  const cleanWhatsapp = String(whatsapp || '').replace(/[^+\d]/g, '');

  const servicesList = [
    { title: 'Doctor Consultation', sub: ['Home Doctor Visit', 'Tele Consultation', 'Video Consultation'] },
    { title: 'Ambulance Services', sub: ['Basic Ambulance', 'Ventilator Ambulance'] },
    { title: 'Nursing Services', sub: ['General Nursing Care', 'Emergency Nursing Care', 'Wound Care Management', 'Bed Sore Care', 'Tracheostomy Care', 'VAC Therapy', 'Elderly Patient Care'] },
    { title: 'ICU Setup at Home', sub: ['ICU Hospital Bed', 'Patient Monitor', 'Oxygen Concentrator', 'Oxygen Cylinder', 'BiPAP Machine', 'CPAP Machine', 'Complete Home ICU Setup'] },
    { title: 'Laboratory Services', sub: ['Home Blood Sample Collection', 'Blood Tests', 'Urine Sample Collection', 'Diagnostic Sample Collection'] },
    { title: 'Physiotherapy', sub: ['Home Physiotherapy', 'Orthopedic Physiotherapy', 'Neurological Rehabilitation', 'Post-Surgery Rehabilitation', 'Elderly Mobility Therapy'] },
    { title: 'Dietician Advisory', sub: ['Personalized Diet Plans', 'Clinical Nutrition', 'Weight Management', 'Diabetes Diet Consultation', 'Nutrition Counseling'] }
  ];

  // Auto-detect language from text input
  const detectLanguage = (text) => {
    const teluguRegex = /[\u0C00-\u0C7F]/;
    if (teluguRegex.test(text)) {
      return 'telugu';
    }
    const teluguKeywords = ['kavali', 'kavaali', 'cheyali', 'cheyaali', 'eppudu', 'daggara', 'nenu', 'naaku', 'unnam', 'unte', 'ravandi', 'ravadam', 'cheyyandi', 'telugu'];
    const lowerText = text.toLowerCase();
    if (teluguKeywords.some(w => lowerText.includes(w))) {
      return 'telugu';
    }
    return null;
  };

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Language Helper
  const toggleLanguage = () => {
    const newLang = chatLang === 'english' ? 'telugu' : 'english';
    setChatLang(newLang);
    localStorage.setItem('preferred_language', newLang);
    window.dispatchEvent(new Event('languageChanged'));
    
    const botGreeting = newLang === 'telugu'
      ? "నమస్కారం! Nest Cares.in కి స్వాగతం. మీరు నాతో తెలుగులో బుకింగ్ చేసుకోవచ్చు. సర్వీస్ బుక్ చేయడానికి 'బుక్' అని టైప్ చేయండి లేదా కింద ఉన్న బటన్ క్లిక్ చేయండి."
      : "Welcome to Nest Cares.in! You can book services directly with me in English. Click the Book chip or type 'book' to get started.";
      
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: botGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Speech Recognition Mic triggers
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        addToast('Voice recognition is not supported in this browser. Try Chrome/Edge.', 'error');
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = chatLang === 'telugu' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setInputText(speechToText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  // Conversational booking workflow engine (Simplified 5-Step Flow)
  const handleBookingWorkflow = async (text, stepNum) => {
    setIsTyping(true);
    let reply = "";
    let nextStep = stepNum;
    let updatedBookingState = { ...bookingState };

    const lang = chatLang;

    setTimeout(async () => {
      // Step 1: Service Category Selection
      if (stepNum === 1) {
        const category = servicesList.find(s => 
          s.title.toLowerCase() === text.toLowerCase() || 
          text.toLowerCase().includes(s.title.toLowerCase())
        );

        if (category) {
          updatedBookingState.serviceName = category.title;
          nextStep = 2;
          reply = lang === 'telugu'
            ? `మీరు '${category.title}' ఎంచుకున్నారు. ఇప్పుడు దయచేసి చికిత్స విధానాన్ని ఎంచుకోండి:`
            : `You selected '${category.title}'. Now, please choose the specific treatment option:`;
        } else {
          reply = lang === 'telugu'
            ? "దయచేసి క్రింది కేటగిరీలలో ఒకదాన్ని సరిగ్గా ఎంచుకోండి:"
            : "Please choose one of the service categories from the options below:";
        }
      }

      // Step 2: Sub-Service (Treatment) Selection
      else if (stepNum === 2) {
        const parentCategory = servicesList.find(s => s.title === bookingState.serviceName);
        const matchSub = parentCategory?.sub.find(sub => 
          sub.toLowerCase() === text.toLowerCase() || 
          text.toLowerCase().includes(sub.toLowerCase())
        );

        if (matchSub) {
          updatedBookingState.subServiceName = matchSub;
          nextStep = 3;
          reply = lang === 'telugu'
            ? `చికిత్స: '${matchSub}'. దయచేసి మీ 10 అంకెల మొబైల్ నంబర్ తెలియజేయండి:`
            : `Treatment: '${matchSub}'. Please enter your 10-digit Mobile Number:`;
        } else {
          reply = lang === 'telugu'
            ? "దయచేసి ఇచ్చిన లిస్ట్ లోని చికిత్సను మాత్రమే టైప్ చేయండి లేదా క్లిక్ చేయండి:"
            : "Please click or type one of the matching treatments listed below:";
        }
      }

      // Step 3: Mobile Input
      else if (stepNum === 3) {
        const digits = text.replace(/\D/g, '');
        if (digits.length === 10) {
          updatedBookingState.mobile = digits;
          nextStep = 4;
          reply = lang === 'telugu'
            ? `మొబైల్: '${digits}'. దయచేసి నిజామాబాద్ లోని మీ డెలివరీ చిరునామా (అడ్రస్) తెలపండి:`
            : `Mobile: '${digits}'. Now, specify your service delivery address in Nizamabad (Street/Colony/Area):`;
        } else {
          reply = lang === 'telugu'
            ? "తప్పు మొబైల్ నంబర్. దయచేసి 10 అంకెల నంబర్ నమోదు చేయండి:"
            : "Invalid number. Please enter a valid 10-digit Mobile Number:";
        }
      }

      // Step 4: Address Input
      else if (stepNum === 4) {
        if (text.trim().length > 5) {
          updatedBookingState.address = text.trim();
          nextStep = 5;
          reply = lang === 'telugu'
            ? `అడ్రస్: '${text.trim()}'.\n\nబుకింగ్ వివరాలు:\n• సేవ: ${updatedBookingState.serviceName} (${updatedBookingState.subServiceName})\n• మొబైల్: ${updatedBookingState.mobile}\n• చిరునామా: ${text.trim()}\n\nదయచేసి ఈ వివరాలను ఖరారు చేయండి (Confirm/Cancel):`
            : `Address: '${text.trim()}'.\n\nBooking Summary:\n• Service: ${updatedBookingState.serviceName} (${updatedBookingState.subServiceName})\n• Mobile: ${updatedBookingState.mobile}\n• Address: ${text.trim()}\n\nDo you want to confirm this booking request (Confirm/Cancel)?`;
        } else {
          reply = lang === 'telugu'
            ? "దయచేసి నిజామాబాద్ లోని మీ పూర్తి చిరునామాను సరిగ్గా తెలపండి:"
            : "Please write your complete delivery address in Nizamabad:";
        }
      }

      // Step 5: Final Confirmation & Submit
      else if (stepNum === 5) {
        if (text.toLowerCase().includes('confirm') || text.includes('ఖరారు') || text.includes('yes') || text.includes('అవును')) {
          setLoading(true);
          try {
            // Save Booking Request
            let resBooking;
            const todayStr = new Date().toISOString().split('T')[0];
            try {
              const payload = {
                name: 'Chatbot Guest',
                mobile: updatedBookingState.mobile,
                email: 'conversational-bot@nestcares.in',
                address: updatedBookingState.address,
                serviceName: updatedBookingState.serviceName,
                subServiceName: updatedBookingState.subServiceName,
                preferredDate: todayStr,
                preferredTime: 'Immediate (15 Mins)',
                notes: 'Booking requested via simplified bilingual chatbot assistant.'
              };
              const response = await bookingsAPI.createBooking(payload);
              resBooking = response.data;
            } catch (err) {
              resBooking = mockDb.createBooking({
                name: 'Chatbot Guest',
                mobile: updatedBookingState.mobile,
                email: 'conversational-bot@nestcares.in',
                address: updatedBookingState.address,
                serviceName: updatedBookingState.serviceName,
                subServiceName: updatedBookingState.subServiceName,
                preferredDate: todayStr,
                preferredTime: 'Immediate (15 Mins)',
                notes: 'Booking requested via simplified bilingual chatbot assistant.'
              });
            }

            const copyText = `Hello Nest Cares, here is my booking copy:\n` +
              `• Booking ID: ${resBooking.bookingId}\n` +
              `• Service: ${updatedBookingState.serviceName} (${updatedBookingState.subServiceName})\n` +
              `• Date: ${todayStr}\n` +
              `• Slot: Immediate\n` +
              `• Address: ${updatedBookingState.address}`;
            const copyLink = `https://wa.me/919248849388?text=${encodeURIComponent(copyText)}`;

            reply = lang === 'telugu'
              ? `బుకింగ్ విజయవంతమైంది! మీ బుకింగ్ ఐడి (Booking ID): **${resBooking.bookingId}**.\n\nబుకింగ్ కాపీని వాట్సాప్ లో సేవ్ చేయడానికి ఇక్కడ క్లిక్ చేయండి: ${copyLink}\n\nమా కోఆర్డినేటర్ మీ అడ్రస్ ని ధృవీకరించడానికి 15 నిమిషాల్లో సంప్రదిస్తారు. ధన్యవాదాలు!`
              : `Success! Booking request registered. Your Booking ID is: **${resBooking.bookingId}**.\n\nClick here to save & share your booking copy on WhatsApp: ${copyLink}\n\nOur coordinator will call you back on ${updatedBookingState.mobile} within 15 minutes. Thank you!`;
            
            // Reset Booking flow state
            nextStep = 0;
            updatedBookingState = {
              step: 0,
              serviceName: '',
              subServiceName: '',
              name: 'Chatbot Guest',
              mobile: '',
              address: '',
              preferredDate: '',
              preferredTime: 'Immediate (15 Mins)'
            };
          } catch (e) {
            reply = lang === 'telugu'
              ? "క్షమించండి, బుకింగ్ సబ్మిట్ చేయడంలో లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి."
              : "Sorry, an error occurred while saving your booking request. Please try again.";
          } finally {
            setLoading(false);
          }
        } else {
          reply = lang === 'telugu'
            ? "బుకింగ్ రద్దు చేయబడింది. నేను మీకు ఏ విధంగా సహాయం చేయగలను?"
            : "Booking request cancelled. How else can I help you today?";
          nextStep = 0;
          updatedBookingState = {
            step: 0,
            serviceName: '',
            subServiceName: '',
            name: 'Chatbot Guest',
            mobile: '',
            address: '',
            preferredDate: '',
            preferredTime: 'Immediate (15 Mins)'
          };
        }
      }

      setIsTyping(false);
      setBookingState(updatedBookingState);
      setBookingState(prev => ({ ...prev, step: nextStep }));
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const handleBotResponse = (userText) => {
    // If booking flow is active, redirect to workflow engine
    if (bookingState.step > 0) {
      handleBookingWorkflow(userText, bookingState.step);
      return;
    }

    setIsTyping(true);
    
    // Check if user text triggers language change auto-detection
    const detectedLang = detectLanguage(userText);
    let activeLang = chatLang;
    if (detectedLang && detectedLang !== chatLang) {
      setChatLang(detectedLang);
      activeLang = detectedLang;
    }

    setTimeout(async () => {
      const text = userText.toLowerCase().trim();
      let reply = "";

      // Check if user wants to initiate booking conversational flow
      if (text === 'book' || text === 'booking' || text.includes('బుక్') || text.includes('appointment') || text.includes('ఖరారు')) {
        setBookingState({
          step: 1,
          serviceName: '',
          subServiceName: '',
          name: 'Chatbot Guest',
          mobile: '',
          address: '',
          preferredDate: '',
          preferredTime: 'Immediate (15 Mins)'
        });
        
        reply = activeLang === 'telugu'
          ? "సంతోషం! మనం నెస్ట్ కేర్స్ బుకింగ్ ప్రక్రియను ప్రారంభిద్దాం. దయచేసి క్రింది కేటగిరీలలో ఒకదాన్ని ఎంచుకోండి:"
          : "Great! Let's start the conversational booking setup. Please select a Service Category below:";
          
        setIsTyping(false);
        setBookingState(prev => ({ ...prev, step: 1 }));
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      // Handle service option clicks
      if (text === 'book this service' || text.includes('సర్వీస్ బుక్ చేయి')) {
        const parentName = activeServiceDetails;
        setBookingState({
          step: 2,
          serviceName: parentName,
          subServiceName: '',
          name: 'Chatbot Guest',
          mobile: '',
          address: '',
          preferredDate: '',
          preferredTime: 'Immediate (15 Mins)'
        });
        
        reply = activeLang === 'telugu'
          ? `బుకింగ్ సమన్వయం ప్రారంభమైంది. దయచేసి '${parentName}' కింద చికిత్స విధానాన్ని ఎంచుకోండి:`
          : `Booking coordinated. Please choose the specific treatment option for '${parentName}' below:`;
          
        setIsTyping(false);
        setBookingState(prev => ({ ...prev, step: 2 }));
        setActiveServiceDetails(null);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      if ((text === 'back to services' || text.includes('వెనుకకు')) && activeServiceDetails && activeServiceDetails !== 'list') {
        setActiveServiceDetails('list');
        reply = activeLang === 'telugu'
          ? "సమాచారం లేదా బుకింగ్ కోసం దయచేసి క్రింది సేవలలో ఒకదాన్ని క్లిక్ చేయండి:"
          : "Please click on one of the services below to view details or book:";
      }
      else if (text === 'back to main' || text.includes('ప్రధాన మెనూ') || text === 'back') {
        setActiveServiceDetails(null);
        reply = activeLang === 'telugu'
          ? "ప్రధాన మెనూకి తిరిగి వచ్చాము. నేను మీకు ఏ విధంగా సహాయం చేయగలను?"
          : "Returned to the main menu. How can I help you today?";
      }
      else if (text.includes('service') || text.includes('చికిత్స') || text.includes('వైద్య') || text.includes('సరివీస్') || text === 'check services' || text === 'services') {
        setActiveServiceDetails('list');
        reply = activeLang === 'telugu'
          ? "సమాచారం లేదా బుకింగ్ కోసం దయచేసి క్రింది సేవలలో ఒకదాన్ని క్లిక్ చేయండి:"
          : "Please click on one of the services below to view details or book:";
      }
      else {
        // Check if user clicked a service from the lists
        const matchedService = servicesList.find(s => 
          text === s.title.toLowerCase() || 
          text.includes(s.title.toLowerCase())
        );

        if (matchedService) {
          setActiveServiceDetails(matchedService.title);
          if (matchedService.title === 'Doctor Consultation') {
            reply = activeLang === 'telugu'
              ? "🩺 **డాక్టర్ సంప్రదింపులు (Doctor Consultation)**\nమేము నిజామాబాద్ లో వైద్యుల హోమ్ విజిట్స్ మరియు టెలి-కన్సల్టేషన్ సేవలను సమన్వయం చేస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "🩺 **Doctor Consultation**\nWe coordinate home physician visits and secure tele-consults/video triage coordinates in Nizamabad.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'Ambulance Services') {
            reply = activeLang === 'telugu'
              ? "🚑 **అంబులెన్స్ సేవలు (Ambulance Services)**\nమేము నిజామాబాద్ లో బేసిక్ మరియు వెంటిలేటర్ అంబులెన్స్ సేవలను సమన్వయం చేస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "🚑 **Ambulance Services**\nWe coordinate basic and ventilator standby ambulance dispatch coordinates in Nizamabad.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'Nursing Services') {
            reply = activeLang === 'telugu'
              ? "👩‍⚕️ **నర్సింగ్ సేవలు (Nursing Services)**\nమేము బెడ్‌సైడ్ నర్సింగ్ షిఫ్టులు (12గం/24గం), సర్జికల్ డ్రెస్సింగ్స్, వృద్ధుల సంరక్షణ సేవలను అందిస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "👩‍⚕️ **Nursing Services**\nWe deploy certified bedside nursing shifts (12h/24h), surgical dressings, bed sore care, and elderly support.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'ICU Setup at Home') {
            reply = activeLang === 'telugu'
              ? "🏥 **హోమ్ ICU సెటప్ (ICU Setup at Home)**\nమేము క్లినికల్ హాస్పిటల్ బెడ్స్, వెంటిలేటర్లు, బిపాప్/సిపాప్ సెటప్ లు మరియు పేషెంట్ మానిటర్ల రెంట్ సేవలను అందిస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "🏥 **ICU Setup at Home**\nWe rent clinical hospital beds, ventilators, bipap/cpap setups, and patient telemetry monitors.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'Laboratory Services') {
            reply = activeLang === 'telugu'
              ? "🔬 **ల్యాబ్ సేవలు (Laboratory Services)**\nమేము రక్తం మరియు ఇతర నమూనాల హోమ్ కలెక్షన్ మరియు ల్యాబ్ టెస్ట్ సేవలను సమన్వయం చేస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "🔬 **Laboratory Services**\nWe deploy certified technicians for home blood sample collection and laboratory tests.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'Physiotherapy') {
            reply = activeLang === 'telugu'
              ? "💪 **ఫిజియోథెరపీ (Physiotherapy)**\nమేము పోస్ట్-సర్జరీ మొబిలిటీ మరియు ఆర్థోపెడిక్/న్యూరో రిహాబిలిటేషన్ సేవలను అందిస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "💪 **Physiotherapy**\nWe send qualified physical therapists for post-surgery mobility and orthopedic/neuro rehabilitation.\n\nChoose one of the options below:";
          }
          else if (matchedService.title === 'Dietician Advisory') {
            reply = activeLang === 'telugu'
              ? "🍎 **డైటీషియన్ సేవలు (Dietician Advisory)**\nమేము వ్యక్తిగతీకరించిన క్లినికల్ న్యూట్రిషన్ ప్లాన్స్ మరియు డైట్ చార్ట్ సేవలను సమన్వయం చేస్తాము.\n\nకింద ఉన్న ఆప్షన్లలో ఒకదాన్ని ఎంచుకోండి:"
              : "🍎 **Dietician Advisory**\nWe coordinate personalized clinical nutrition plans and dietitian charts.\n\nChoose one of the options below:";
          }
        }
        else if (text.includes('emergency') || text.includes('అత్యవసర') || text.includes('call') || text.includes('hotline') || text.includes('ఫోన్')) {
          reply = activeLang === 'telugu'
            ? "అత్యవసర చికిత్స లేదా అంబులెన్స్ కోసం వెంటనే కాల్ చేయండి: +91 92488 49388 లేదా +91 63035 91409. మేము 24/7 అందుబాటులో ఉంటాము."
            : "For immediate ambulance dispatch or critical clinical triage, call our Nizamabad standby hotline: +91 92488 49388 or +91 63035 91409. We are available 24/7.";
        }
        else if (text.includes('whatsapp') || text.includes('చాట్') || text.includes('సపోర్ట్')) {
          reply = activeLang === 'telugu'
            ? "మీరు మా కోఆర్డినేటర్ తో వాట్సాప్ లో చాట్ చేయడానికి ఇక్కడ క్లిక్ చేయండి: https://wa.me/919248849388"
            : "You can chat directly with our senior coordinator on WhatsApp. Click here to chat: https://wa.me/919248849388";
        }
        else if (text.includes('price') || text.includes('ధర') || text.includes('ఖర్చు') || text.includes('డబ్బు')) {
          reply = activeLang === 'telugu'
            ? "మా వైద్య సేవలకు ఎటువంటి అడ్వాన్స్ పేమెంట్లు అవసరం లేదు. ఇన్స్టాలేషన్ విజయవంతంగా పూర్తయిన తర్వాతే బిల్లింగ్ ప్రారంభమవుతుంది. ధర అంచనా కోసం దయచేసి మీ మొబైల్ నంబర్ టైప్ చేయండి, కోఆర్డినేటర్ మీకు కాల్ చేస్తారు."
            : "All our setups feature customized plans. We do not require advanced payments online. Billing starts only after setup installation at home. For a custom quote, just enter your 10-digit mobile number here and a coordinator will call you.";
        }
        else if (text.includes('nizamabad') || text.includes('నిజామాబాద్') || text.includes('కాలనీ') || text.includes('అడ్రస్')) {
          reply = activeLang === 'telugu'
            ? "మేము నిజామాబాద్ లోని చంద్రశేఖర్ కాలనీ మరియు అన్ని ఇతర ప్రాంతాలలో వేగవంతమైన వైద్య సేవలను అందిస్తాము."
            : "We serve exclusively in Nizamabad, Telangana (including Chandra Shekar Colony, Subhash Nagar, and all surrounding locations) to guarantee 15-minute emergency callback coordinates.";
        }
        else {
          reply = activeLang === 'telugu'
            ? "నేను మీ ప్రశ్నను గ్రహించలేకపోయాను. దయచేసి మీ 10 అంకెల మొబైల్ నంబర్ పంపండి, మా కోఆర్డినేటర్ మీకు 15 నిమిషాల్లో కాల్ చేసి సమాధానం ఇస్తారు."
            : "I've noted your question! To get a detailed reply or match clinical staff, please enter your 10-digit mobile number here. Our Nizamabad coordinator will phone you back in 15 minutes.";
        }
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 850);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    handleBotResponse(userText);
  };

  const handleQuickChip = (chipText) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: chipText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    handleBotResponse(chipText);
  };

  const renderMessageContent = (msgText) => {
    // Parse markdown links [Label](url)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const httpRegex = /(https?:\/\/[^\s]+)/g;

    if (mdLinkRegex.test(msgText)) {
      mdLinkRegex.lastIndex = 0;
      const parts = [];
      let lastIdx = 0;
      let match;
      while ((match = mdLinkRegex.exec(msgText)) !== null) {
        if (match.index > lastIdx) {
          parts.push(msgText.substring(lastIdx, match.index));
        }
        const label = match[1];
        const url = match[2];
        
        if (url.startsWith('/')) {
          parts.push(
            <Link key={match.index} to={url} className="text-teal-755 underline font-bold hover:text-teal-900" onClick={() => setIsChatOpen(false)}>
              {label}
            </Link>
          );
        } else {
          parts.push(
            <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="text-teal-755 underline font-bold hover:text-teal-900">
              {label}
            </a>
          );
        }
        lastIdx = mdLinkRegex.lastIndex;
      }
      if (lastIdx < msgText.length) {
        parts.push(msgText.substring(lastIdx));
      }
      return parts;
    } 
    
    // Parse plain HTTP links
    if (httpRegex.test(msgText)) {
      httpRegex.lastIndex = 0;
      const parts = [];
      let lastIdx = 0;
      let match;
      while ((match = httpRegex.exec(msgText)) !== null) {
        if (match.index > lastIdx) {
          parts.push(msgText.substring(lastIdx, match.index));
        }
        const url = match[1];
        parts.push(
          <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="text-teal-755 underline font-bold hover:text-teal-900 break-all">
            {url}
          </a>
        );
        lastIdx = httpRegex.lastIndex;
      }
      if (lastIdx < msgText.length) {
        parts.push(msgText.substring(lastIdx));
      }
      return parts;
    }

    return msgText;
  };

  // Helper to render quick chips dynamically depending on booking step / chat mode
  const renderQuickReplyChips = () => {
    const lang = chatLang;

    // Conversational Booking Step 1: Category selection chips
    if (bookingState.step === 1) {
      return servicesList.map((s, idx) => (
        <button
          key={idx}
          onClick={() => handleQuickChip(s.title)}
          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200/50 text-teal-900 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          {s.title}
        </button>
      ));
    }

    // Conversational Booking Step 2: Subservice selection chips
    if (bookingState.step === 2) {
      const parent = servicesList.find(s => s.title === bookingState.serviceName);
      return (parent?.sub || []).map((sub, idx) => (
        <button
          key={idx}
          onClick={() => handleQuickChip(sub)}
          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200/50 text-teal-900 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          {sub}
        </button>
      ));
    }

    // Conversational Booking Step 5: Confirmation choices
    if (bookingState.step === 5) {
      return (
        <>
          <button 
            onClick={() => handleQuickChip('Confirm')}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm"
          >
            ✅ {lang === 'telugu' ? 'అవును' : 'Confirm'}
          </button>
          <button 
            onClick={() => handleQuickChip('Cancel')}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm"
          >
            ❌ {lang === 'telugu' ? 'రద్దు చేయి' : 'Cancel'}
          </button>
        </>
      );
    }

    // Services Selection List View
    if (bookingState.step === 0 && activeServiceDetails === 'list') {
      return (
        <>
          {servicesList.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(s.title)}
              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200/50 text-teal-900 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
            >
              {s.title === 'Doctor Consultation' ? '🩺 Doctor' :
               s.title === 'Ambulance Services' ? '🚑 Ambulance' :
               s.title === 'Nursing Services' ? '👩‍⚕️ Nursing' :
               s.title === 'ICU Setup at Home' ? '🏥 ICU Setup' :
               s.title === 'Laboratory Services' ? '🔬 Lab Tests' :
               s.title === 'Physiotherapy' ? '💪 Physio' :
               s.title === 'Dietician Advisory' ? '🍎 Dietician' : s.title}
            </button>
          ))}
          <button 
            onClick={() => handleQuickChip('Back to Main')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
          >
            ⬅️ {lang === 'telugu' ? 'వెనుకకు' : 'Back'}
          </button>
        </>
      );
    }

    // Specific Service Description View (Selected Category Details)
    if (bookingState.step === 0 && activeServiceDetails && activeServiceDetails !== 'list') {
      return (
        <>
          <button 
            onClick={() => handleQuickChip('Book This Service')}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm animate-bounce"
          >
            📅 {lang === 'telugu' ? 'బుకింగ్ చేయి' : 'Book This Service'}
          </button>
          <a 
            href={`https://wa.me/${cleanWhatsapp}?text=I%20want%20to%2520inquire%20about%20${encodeURIComponent(activeServiceDetails)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
          >
            💬 WhatsApp
          </a>
          <button 
            onClick={() => handleQuickChip('Back to Services')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
          >
            ⬅️ {lang === 'telugu' ? 'వెనుకకు' : 'Back to Services'}
          </button>
        </>
      );
    }

    // Standard Idle state chips
    return (
      <>
        <button 
          onClick={() => handleQuickChip('Book Service')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          📅 {lang === 'telugu' ? 'బుకింగ్ చేయండి' : 'Book Care'}
        </button>
        <button 
          onClick={() => handleQuickChip('Check Services')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          🩺 {lang === 'telugu' ? 'సేవలు' : 'Services'}
        </button>
        <button 
          onClick={() => handleQuickChip('Emergency Contact')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          📞 {lang === 'telugu' ? 'అత్యవసరం' : 'Emergency'}
        </button>
      </>
    );
  };

  return (
    <div className={`fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-5 right-4 sm:right-6 z-50 flex-col gap-3 no-print items-end select-none pointer-events-none ${hideOnMobile ? 'hidden md:flex' : 'flex'}`}>
      
      {/* Interactive Voice-Enabled Chatbot Window */}
      {isChatOpen && (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/60 p-0 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] w-[320px] max-w-[90vw] h-[400px] text-left mr-2 relative z-50 no-print flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto">
          
          {/* Chat Header */}
          <div className="bg-teal-900 text-white p-3.5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center relative">
                <MessageSquare className="w-4 h-4 text-teal-300" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-teal-900"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-black tracking-wider uppercase leading-none">Nest Cares Assistant</span>
                <span className="text-[7px] text-teal-300/80 font-bold uppercase mt-0.5 leading-none">Online support</span>
              </div>
            </div>
            
            {/* Language Switch Toggle & Close Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                title="Switch Language"
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[8px] font-extrabold uppercase rounded-md text-teal-200 hover:text-white flex items-center gap-1 transition-all"
              >
                <Globe className="w-2.5 h-2.5" />
                <span>{chatLang === 'english' ? 'తెలుగు' : 'English'}</span>
              </button>
              
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 text-teal-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages List Container */}
          <div className="grow overflow-y-auto p-4 space-y-3 bg-slate-50/50 scrollbar-thin">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col gap-1 max-w-[85%] ${isBot ? 'self-start text-left mr-auto' : 'self-end text-right ml-auto'}`}
                >
                  <div 
                    className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed font-semibold shadow-sm whitespace-pre-line ${
                      isBot 
                        ? 'bg-white border border-slate-150 text-slate-800 rounded-tl-none' 
                        : 'bg-teal-800 text-white rounded-tr-none'
                    }`}
                  >
                    {renderMessageContent(msg.text)}
                  </div>
                  <span className="text-[7px] text-slate-400 font-bold px-1 uppercase">{msg.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="self-start text-left mr-auto flex flex-col gap-1 max-w-[80%]">
                <div className="px-4 py-3 bg-white border border-slate-150 rounded-2xl rounded-tl-none shadow-sm flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Action Chips container */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 no-print">
            {renderQuickReplyChips()}
          </div>

          {/* Input & Mic Bar */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-150 bg-white flex items-center gap-1.5 shrink-0">
            {/* Microphone Button (Speech-to-Text) */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-200' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input (Mic)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input 
              type="text"
              placeholder={chatLang === 'telugu' ? "ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి..." : "Type or speak to me..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 focus:bg-white"
            />
            
            <button 
              type="submit"
              className="p-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Chatbot Toggle Button Container with Tooltip */}
      <div className="relative group/bot flex items-center gap-2 pointer-events-auto">
        {!isChatOpen && (
          <div className="hidden md:flex bg-white text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-md border border-slate-200/80 mr-2 whitespace-nowrap opacity-0 group-hover/bot:opacity-100 transition-opacity duration-300 font-sans pointer-events-none relative items-center">
            <span>Need Help? Chat with Dr. Ritu 💬</span>
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-white"></div>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center relative cursor-pointer outline-none transition-all duration-300 hover:-translate-y-1 active:scale-95 z-45"
          title="Chat with Assistant"
        >
          {isChatOpen ? (
            <div className="w-14 h-14 bg-white border-2 border-teal-800 rounded-full flex items-center justify-center shadow-lg">
              <X className="w-6 h-6 text-teal-800" />
            </div>
          ) : (
            <div className="relative w-14 h-14 flex items-center justify-center bg-teal-800 rounded-full border-2 border-white shadow-xl hover:bg-teal-900 transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-slate-100 flex items-center justify-center">
                <img 
                  src="/bot-avatar.png" 
                  alt="Assistant" 
                  className="w-full h-full object-cover scale-110"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120";
                  }}
                />
              </div>
              {/* Overlapping Chat Bubble Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md z-30">
                <MessageSquare className="w-3 h-3 fill-current" />
              </div>
            </div>
          )}
          
          {/* Pulsing CRO Notification Badge */}
          {!isChatOpen && (
            <span className="absolute top-0.5 left-0.5 flex h-3 w-3 z-30">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        id="back-to-top"
        className={`max-md:hidden w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-500 active:scale-95 group cursor-pointer pointer-events-auto ${
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        title="Scroll to Top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
      
    </div>
  );
};

export default FloatingButtons;
