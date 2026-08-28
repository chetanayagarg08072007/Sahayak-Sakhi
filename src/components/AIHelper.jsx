import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation } from 'react-router-dom';

/* ── Inline SVG icons (no external dependency needed) ── */
const Icon = ({ d, size = 24, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d={d} />
  </svg>
);

const VolumeIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const StopIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" fill={color} />
  </svg>
);

const GlobeIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
  </svg>
);

const ChatIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Page-aware contextual help ── */
const pageContext = {
  '/': {
    en: "Welcome! This portal helps you find government benefits and compensation. You can choose between our AI Voice Bot auto-fill or filling the form manually.",
    hi: "स्वागत है! यह पोर्टल आपको सरकारी योजनाओं और मुआवजे को खोजने में मदद करता है। आप हमारे एआई वॉइस बॉट ऑटो-फिल या खुद फॉर्म भरने का विकल्प चुन सकते हैं।"
  },
  '/mode-select': {
    en: "Please select how you want to proceed: talk to the AI Voice Bot to auto-fill the form, or fill it step-by-step yourself.",
    hi: "कृपया चुनें कि आप कैसे आगे बढ़ना चाहते हैं: एआई वॉइस बॉट से बोलकर फॉर्म भरें, या खुद एक-एक करके फॉर्म भरें।"
  },
  '/voice-assessment': {
    en: "Speak naturally or describe your situation. The AI Voice Bot will automatically detect your details and prepare your application.",
    hi: "स्वाभाविक रूप से बोलें या अपनी स्थिति बताएं। एआई वॉइस बॉट आपकी जानकारी पहचानकर अपने आप फॉर्म तैयार करेगा।"
  },
  '/assessment': {
    en: "Answer each question carefully. Your answers help us match you with the right government schemes. You can go back and change answers anytime.",
    hi: "हर सवाल का ध्यान से जवाब दें। आपके जवाब सही सरकारी योजनाओं से मिलान करने में मदद करते हैं। आप कभी भी वापस जाकर जवाब बदल सकते हैं।"
  },
  '/verify-assessment': {
    en: "Here is your captured information. Listen to the voice summary, and tap Edit next to any field if you wish to make corrections before viewing eligible schemes.",
    hi: "यहाँ आपकी भरी गई जानकारी है। वॉइस सारांश सुनें, और यदि आप योजनाएं देखने से पहले कोई सुधार करना चाहते हैं तो 'सुधारें' पर टैप करें।"
  },
  '/dashboard': {
    en: "These are the schemes you may be eligible for. Tap any scheme to see full details, required documents, and step-by-step instructions to apply.",
    hi: "ये वो योजनाएँ हैं जिनके लिए आप पात्र हो सकते हैं। पूरी जानकारी, ज़रूरी दस्तावेज़ और आवेदन के चरण देखने के लिए किसी भी योजना पर टैप करें।"
  },
  '/tracker': {
    en: "Track the progress of your applications here. Update the status as you move through each step — from gathering documents to receiving benefits.",
    hi: "यहाँ अपने आवेदनों की प्रगति ट्रैक करें। दस्तावेज़ जमा करने से लेकर लाभ प्राप्त करने तक हर चरण पर स्थिति अपडेट करें।"
  }
};

/* ── Simple chatbot knowledge base ── */
const knowledgeBase = {
  en: [
    { keywords: ['death certificate', 'certificate'], answer: "To get a Death Certificate, visit the local municipal office or Gram Panchayat within 21 days. You'll need the hospital's death summary, Aadhaar, and an identity proof of the applicant." },
    { keywords: ['fir', 'police'], answer: "An FIR (First Information Report) should be filed at the nearest police station immediately after an accident. Carry an ID proof and any witnesses. Get a copy of the FIR for your records — you'll need it for insurance and compensation claims." },
    { keywords: ['epf', 'pf', 'provident fund'], answer: "If the deceased had a PF account, the nominee can claim the full PF balance plus EDLI insurance (up to ₹7 lakh). Contact the employer or visit the EPFO portal with the UAN number." },
    { keywords: ['pmjjby', 'jeevan jyoti', 'life insurance'], answer: "PMJJBY provides ₹2 lakh to the nominee. Check the deceased's bank statement for a ₹436/year deduction. If found, visit the bank with the death certificate to file a claim within 30 days." },
    { keywords: ['pmsby', 'suraksha bima', 'accident insurance'], answer: "PMSBY covers accidental death with ₹2 lakh. Check the bank for a ₹20/year deduction. You'll need the FIR, post-mortem report, and death certificate to claim." },
    { keywords: ['widow', 'pension'], answer: "Widow pension provides ₹500–₹2500/month depending on your state. Apply at the Tehsildar or District Social Welfare office with your marriage certificate, husband's death certificate, income certificate, and bank passbook." },
    { keywords: ['mact', 'motor', 'road accident', 'vehicle'], answer: "For road accident deaths, file a MACT claim in the Motor Accident Claims Tribunal. You'll need the FIR, post-mortem report, income proof of the deceased, and details of the vehicle involved. Hire a lawyer experienced in MACT cases." },
    { keywords: ['pregnancy', 'maternity', 'pregnant'], answer: "If you are pregnant, you may be eligible for PMMVY (₹5,000 for first child) and JSY (for institutional delivery). Register at your nearest Anganwadi Centre or government hospital." },
    { keywords: ['document', 'documents', 'paperwork'], answer: "Key documents to keep ready: Death Certificate (multiple copies), Aadhaar cards, bank passbooks, income certificate, FIR (if accident), marriage certificate, and ration card. Never hand originals to unknown agents." },
    { keywords: ['how', 'use', 'app', 'help'], answer: "Start by tapping 'Find My Benefits' on the home page. Answer a few simple questions about your situation. The app will show you all schemes you may qualify for, along with step-by-step guidance to apply." },
    { keywords: ['hello', 'hi', 'namaste'], answer: "Hello! I'm here to help you navigate government support schemes. Ask me about any scheme, document, or process and I'll guide you step by step." },
    { keywords: ['thank', 'thanks', 'dhanyavad'], answer: "You're welcome! Remember, all the schemes listed here are free government services. Never pay money to middlemen or agents. If you need more help, just ask!" }
  ],
  hi: [
    { keywords: ['मृत्यु प्रमाण', 'प्रमाण पत्र', 'death certificate'], answer: "मृत्यु प्रमाण पत्र पाने के लिए, 21 दिनों के भीतर स्थानीय नगर निगम कार्यालय या ग्राम पंचायत जाएँ। आपको अस्पताल की मृत्यु रिपोर्ट, आधार और आवेदक का पहचान पत्र चाहिए।" },
    { keywords: ['एफआईआर', 'पुलिस', 'fir'], answer: "दुर्घटना के तुरंत बाद निकटतम पुलिस स्टेशन में FIR दर्ज करें। पहचान पत्र और गवाह साथ ले जाएँ। FIR की प्रतिलिपि अवश्य लें — बीमा और मुआवज़े के लिए ज़रूरी है।" },
    { keywords: ['पीएफ', 'भविष्य निधि', 'epf', 'pf'], answer: "अगर मृतक का PF खाता था, तो नॉमिनी पूरा PF बैलेंस और EDLI बीमा (₹7 लाख तक) का दावा कर सकता है। नियोक्ता से संपर्क करें या UAN नंबर से EPFO पोर्टल पर जाएँ।" },
    { keywords: ['गर्भावस्था', 'मातृत्व', 'गर्भवती', 'pregnancy'], answer: "अगर आप गर्भवती हैं, तो आप PMMVY (पहले बच्चे के लिए ₹5,000) और JSY (अस्पताल में प्रसव के लिए) के लिए पात्र हो सकती हैं। अपने निकटतम आंगनवाड़ी केंद्र या सरकारी अस्पताल में पंजीकरण करें।" },
    { keywords: ['दस्तावेज़', 'कागज़ात'], answer: "ज़रूरी दस्तावेज़: मृत्यु प्रमाण पत्र (कई प्रतियां), आधार कार्ड, बैंक पासबुक, आय प्रमाण पत्र, FIR (अगर दुर्घटना), विवाह प्रमाण पत्र, और राशन कार्ड। कभी भी अनजान लोगों को मूल दस्तावेज़ न दें।" },
    { keywords: ['नमस्ते', 'हैलो', 'hello', 'hi'], answer: "नमस्ते! मैं आपको सरकारी सहायता योजनाओं में मार्गदर्शन करने के लिए यहाँ हूँ। किसी भी योजना, दस्तावेज़ या प्रक्रिया के बारे में पूछें!" },
    { keywords: ['धन्यवाद', 'शुक्रिया', 'thanks'], answer: "आपका स्वागत है! याद रखें, यहाँ सूचीबद्ध सभी योजनाएँ मुफ़्त सरकारी सेवाएँ हैं। दलालों या एजेंटों को पैसे न दें। और मदद चाहिए तो बस पूछें!" },
    { keywords: ['कैसे', 'इस्तेमाल', 'ऐप', 'मदद'], answer: "होम पेज पर 'मेरी सहायता खोजें' पर टैप करें। अपनी स्थिति के बारे में कुछ सवालों का जवाब दें। ऐप आपको सभी उपयुक्त योजनाएँ और आवेदन के चरण दिखाएगा।" }
  ]
};

function findAnswer(query, lang) {
  const q = query.toLowerCase();
  const kb = knowledgeBase[lang] || knowledgeBase['en'];
  for (const entry of kb) {
    if (entry.keywords.some(kw => q.includes(kw.toLowerCase()))) {
      return entry.answer;
    }
  }
  return lang === 'hi'
    ? "मुझे इसका सटीक उत्तर नहीं मिला। कृपया 'दस्तावेज़', 'पेंशन', 'FIR', 'PF' जैसे शब्द पूछें, या होम पेज से मूल्यांकन शुरू करें।"
    : "I couldn't find a specific answer for that. Try asking about 'documents', 'pension', 'FIR', 'PF', 'insurance', or 'pregnancy'. You can also start the assessment from the home page.";
}

/* ── Styles ── */
const fab = {
  width: 56, height: 56, borderRadius: '50%', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const smallFab = {
  ...fab, width: 44, height: 44,
  backgroundColor: 'white', border: '1px solid #e5e7eb'
};

/* ── Component ── */
const AIHelper = () => {
  const { language, setLanguage } = useUser();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const isHindi = language === 'hi';

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send welcome message when chat opens
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      const path = location.pathname.startsWith('/scheme') ? '/dashboard' : location.pathname;
      const ctx = pageContext[path] || pageContext['/'];
      setMessages([{ role: 'bot', text: ctx[language] }]);
    }
  }, [chatOpen]);

  /* ── Voice ── */
  const handleSpeak = () => {
    const synth = synthRef.current;
    if (!synth) {
      alert(isHindi ? 'आपका ब्राउज़र वॉइस सपोर्ट नहीं करता।' : 'Your browser does not support text-to-speech.');
      return;
    }

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    // Read contextual text for the current page
    const path = location.pathname.startsWith('/scheme') ? '/dashboard' : location.pathname;
    const ctx = pageContext[path] || pageContext['/'];
    const textToSpeak = ctx[language];

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    synth.speak(utterance);
  };

  /* ── Chat ── */
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', text: trimmed };
    const botReply = { role: 'bot', text: findAnswer(trimmed, language) };

    setMessages(prev => [...prev, userMsg, botReply]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguage = () => {
    const newLang = isHindi ? 'en' : 'hi';
    setLanguage(newLang);
    // Reset chat with new language greeting
    if (chatOpen) {
      const path = location.pathname.startsWith('/scheme') ? '/dashboard' : location.pathname;
      const ctx = pageContext[path] || pageContext['/'];
      setMessages([{ role: 'bot', text: ctx[newLang] }]);
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: 90, right: 16, zIndex: 1000,
          width: 340, maxWidth: 'calc(100vw - 32px)', height: 440,
          backgroundColor: 'white', borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e5e7eb',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', backgroundColor: '#2b5c8f', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <strong style={{ fontSize: 14 }}>{isHindi ? '🤖 एआई सहायक' : '🤖 AI Assistant'}</strong>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                {isHindi ? 'मुझसे कुछ भी पूछें' : 'Ask me anything about schemes'}
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4
            }}>
              <CloseIcon size={20} color="white" />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: msg.role === 'user' ? '#2b5c8f' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1f2937',
                  fontSize: 14, lineHeight: 1.5,
                  boxShadow: msg.role === 'bot' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  border: msg.role === 'bot' ? '1px solid #e5e7eb' : 'none'
                }}>
                  {msg.text}
                </div>
                {/* Read aloud button for bot messages */}
                {msg.role === 'bot' && (
                  <button
                    onClick={() => {
                      const synth = synthRef.current;
                      if (!synth) return;
                      synth.cancel();
                      const u = new SpeechSynthesisUtterance(msg.text);
                      u.lang = isHindi ? 'hi-IN' : 'en-IN';
                      u.rate = 0.9;
                      synth.speak(u);
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 11, color: '#6b7280', marginTop: 4, padding: '2px 4px',
                      display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    🔊 {isHindi ? 'सुनें' : 'Listen'}
                  </button>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          <div style={{
            padding: '6px 12px', display: 'flex', gap: 6, overflowX: 'auto',
            borderTop: '1px solid #e5e7eb', backgroundColor: 'white'
          }}>
            {(isHindi
              ? ['दस्तावेज़ क्या चाहिए?', 'पेंशन कैसे मिलेगी?', 'FIR कैसे दर्ज करें?']
              : ['What documents?', 'How to get pension?', 'How to file FIR?']
            ).map((q, i) => (
              <button key={i} onClick={() => {
                setInput(q);
                setTimeout(() => {
                  const userMsg = { role: 'user', text: q };
                  const botReply = { role: 'bot', text: findAnswer(q, language) };
                  setMessages(prev => [...prev, userMsg, botReply]);
                  setInput('');
                }, 100);
              }} style={{
                padding: '5px 10px', fontSize: 12, borderRadius: 20,
                border: '1px solid #d1d5db', backgroundColor: '#f3f4f6',
                cursor: 'pointer', whiteSpace: 'nowrap', color: '#374151',
                flexShrink: 0
              }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid #e5e7eb',
            display: 'flex', gap: 8, alignItems: 'center', backgroundColor: 'white'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isHindi ? 'अपना सवाल लिखें...' : 'Type your question...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 24,
                border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button onClick={handleSend} style={{
              ...fab, width: 40, height: 40, backgroundColor: '#2b5c8f',
              boxShadow: 'none', flexShrink: 0
            }}>
              <SendIcon size={18} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Buttons ── */}
      <div style={{
        position: 'fixed', bottom: 20, right: 16, zIndex: 999,
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          style={{ ...smallFab, position: 'relative' }}
          title={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
        >
          <GlobeIcon size={20} color="#2b5c8f" />
          <span style={{
            position: 'absolute', bottom: -18, fontSize: 10,
            fontWeight: 700, color: '#2b5c8f', whiteSpace: 'nowrap'
          }}>
            {isHindi ? 'ENG' : 'हिन्दी'}
          </span>
        </button>

        {/* Voice (read page aloud) */}
        <button
          onClick={handleSpeak}
          style={{
            ...smallFab,
            backgroundColor: isPlaying ? '#dc2626' : 'white',
            borderColor: isPlaying ? '#dc2626' : '#e5e7eb'
          }}
          title={isPlaying
            ? (isHindi ? 'रुकें' : 'Stop')
            : (isHindi ? 'यह पेज सुनें' : 'Read this page aloud')}
        >
          {isPlaying
            ? <StopIcon size={20} color="white" />
            : <VolumeIcon size={20} color="#2b5c8f" />
          }
        </button>

        {/* Chat toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            ...fab,
            backgroundColor: chatOpen ? '#1e446d' : '#2b5c8f'
          }}
        >
          {chatOpen
            ? <CloseIcon size={26} color="white" />
            : <ChatIcon size={26} color="white" />
          }
        </button>
      </div>
    </>
  );
};

export default AIHelper;
