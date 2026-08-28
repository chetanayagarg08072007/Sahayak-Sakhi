import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  questions,
  getApplicableQuestions,
  matchVoiceToOption,
  extractFieldsFromStory,
  getAnswerLabel,
  getQuestionTitle
} from '../data/questions';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  MessageSquareQuote,
  RefreshCw
} from 'lucide-react';

const VoiceAssessment = () => {
  const { assessmentData, saveAssessment, language } = useUser();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  const [mode, setMode] = useState('guided'); // 'guided' (step-by-step voice) or 'story' (speak full situation)
  const [answers, setAnswers] = useState(assessmentData || {});
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [storyText, setStoryText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [detectedFields, setDetectedFields] = useState({});

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Applicable questions based on current answers
  const applicableQuestions = getApplicableQuestions(answers);
  const currentQuestion = applicableQuestions[currentStep] || applicableQuestions[applicableQuestions.length - 1];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(text);

        if (event.results[0].isFinal) {
          handleVoiceInput(text);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isHindi, currentStep, mode]);

  // Read current question when step changes in guided mode
  useEffect(() => {
    if (mode === 'guided' && currentQuestion) {
      speakQuestion(currentQuestion);
    }
  }, [currentStep, mode]);

  const speakText = (text, callback) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (callback) callback();
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const speakQuestion = (q) => {
    const prompt = q.voicePrompt ? (q.voicePrompt[language] || q.voicePrompt['en']) : (q.title[language] || q.title['en']);
    speakText(prompt, () => {
      // Auto-start listening after speaking if supported
      startListening();
    });
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.lang = isHindi ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Could not start recognition:', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = (spoken) => {
    if (mode === 'story') {
      setStoryText(prev => (prev ? prev + ' ' + spoken : spoken));
      const extracted = extractFieldsFromStory(storyText + ' ' + spoken);
      setDetectedFields(extracted);
      setAnswers(prev => ({ ...prev, ...extracted }));
      return;
    }

    if (!currentQuestion) return;
    const matchedValue = matchVoiceToOption(spoken, currentQuestion);
    if (matchedValue) {
      const updatedAnswers = { ...answers, [currentQuestion.id]: matchedValue };
      setAnswers(updatedAnswers);

      const feedback = isHindi ? `ठीक है, चुना गया।` : `Got it.`;
      speakText(feedback, () => {
        goToNextStep(updatedAnswers);
      });
    } else {
      const retryMsg = isHindi
        ? `कृपया दिए गए विकल्पों में से चुनें या फिर से बोलें।`
        : `Please say one of the options or tap below.`;
      speakText(retryMsg);
    }
  };

  const handleOptionSelect = (val) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(updatedAnswers);
    goToNextStep(updatedAnswers);
  };

  const goToNextStep = (currentAnswers) => {
    const nextApplicable = getApplicableQuestions(currentAnswers);
    if (currentStep + 1 < nextApplicable.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // All questions done! Go to verification
      saveAssessment(currentAnswers);
      speakText(
        isHindi
          ? 'मैंने आपकी सारी जानकारी एकत्रित कर ली है। आइए अब इसे सत्यापित और ठीक करें।'
          : "I have captured all your information. Let's review and verify it together.",
        () => {
          navigate('/verify-assessment');
        }
      );
    }
  };

  const handleStoryAnalyze = () => {
    const extracted = extractFieldsFromStory(storyText);
    setDetectedFields(extracted);
    const merged = { ...answers, ...extracted };
    setAnswers(merged);
    saveAssessment(merged);

    const count = Object.keys(extracted).length;
    const msg = isHindi
      ? `मैंने आपकी कहानी से ${count} मुख्य जानकारियां पहचानी हैं। आइए अब विवरण सत्यापित करें।`
      : `I have extracted ${count} key details from your story. Let's verify and complete them.`;

    speakText(msg, () => {
      navigate('/verify-assessment');
    });
  };

  const sampleStories = isHindi
    ? [
        {
          label: 'उदाहरण: सड़क दुर्घटना (सैलरी कर्मचारी)',
          text: 'मेरे पति की एक सड़क दुर्घटना में मृत्यु हो गई। वे एक निजी कंपनी में नौकरी करते थे और उनका PF कटता था। उनका बैंक खाता भी था और हमारा परिवार कम आय वर्ग में आता है।'
        },
        {
          label: 'उदाहरण: मातृत्व और गर्भावस्था',
          text: 'मैं पहली बार गर्भवती हूँ और सरकारी मातृत्व सहायता योजना का लाभ लेना चाहती हूँ। हम बीपीएल श्रेणी में आते हैं।'
        }
      ]
    : [
        {
          label: 'Example: Road Accident (Salaried Worker)',
          text: 'My husband passed away in a road traffic accident. He worked in a private company and had an active PF account and bank account. We are low income and need support.'
        },
        {
          label: 'Example: Maternity & Pregnancy Support',
          text: 'I am pregnant with my first child and looking for government maternity financial assistance. We have a BPL card.'
        }
      ];

  return (
    <div className="fade-in">
      {/* Mode switcher tab bar */}
      <div className="flex gap-2 mb-6" style={{ background: '#e5e7eb', padding: 4, borderRadius: 12 }}>
        <button
          onClick={() => setMode('guided')}
          className={`btn ${mode === 'guided' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: 8 }}
        >
          🎙️ {isHindi ? 'चरणबद्ध वॉइस संवाद' : 'Interactive Voice Q&A'}
        </button>
        <button
          onClick={() => setMode('story')}
          className={`btn ${mode === 'story' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: 8 }}
        >
          💬 {isHindi ? 'पूरी स्थिति बोलें / लिखें' : 'Explain Full Situation'}
        </button>
      </div>

      {/* ── Mode 1: Interactive Guided Voice Q&A ── */}
      {mode === 'guided' && currentQuestion && (
        <div>
          {/* Progress header */}
          <div className="mb-4">
            <div style={{ height: 8, backgroundColor: 'var(--secondary-color)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${((currentStep + 1) / applicableQuestions.length) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary-color)',
                  transition: 'width 0.3s'
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
              <span>{isHindi ? `प्रश्न ${currentStep + 1} / ${applicableQuestions.length}` : `Question ${currentStep + 1} of ${applicableQuestions.length}`}</span>
              <span>{isSpeaking ? '🔊 ' + (isHindi ? 'एआई बोल रहा है...' : 'AI speaking...') : (isListening ? '🎤 ' + (isHindi ? 'सुन रहा है...' : 'Listening...') : '')}</span>
            </div>
          </div>

          {/* Voice Prompt Box */}
          <div
            className="card mb-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)',
              border: '2px solid #bfdbfe',
              padding: '1.75rem 1.25rem'
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: isListening ? '#dc2626' : (isSpeaking ? '#2563eb' : 'var(--primary-color)'),
                color: 'white',
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 0 0 8px rgba(220, 38, 38, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => {
                if (isListening) stopListening();
                else speakQuestion(currentQuestion);
              }}
              title={isListening ? 'Stop listening' : 'Click to hear question or speak'}
            >
              {isListening ? <MicOff size={32} /> : (isSpeaking ? <Volume2 size={32} /> : <Mic size={32} />)}
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#1e3a8a' }}>
              {currentQuestion.title[language] || currentQuestion.title['en']}
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#3b82f6', marginBottom: 0 }}>
              {currentQuestion.voicePrompt ? (currentQuestion.voicePrompt[language] || currentQuestion.voicePrompt['en']) : ''}
            </p>

            {transcript && (
              <div style={{ marginTop: 12, padding: '6px 12px', background: 'white', borderRadius: 20, display: 'inline-block', fontSize: '0.875rem', color: '#1f2937' }}>
                🎤 <em>"{transcript}"</em>
              </div>
            )}
          </div>

          {/* Quick Select Options (Voice + Touch friendly) */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isHindi ? 'बोलें या नीचे दिए गए विकल्प पर टैप करें:' : 'Speak or tap an option below:'}
            </label>
            {currentQuestion.options.map(opt => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <div
                  key={opt.value}
                  className={`card card-selectable ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(opt.value)}
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: 0
                  }}
                >
                  <span style={{ fontWeight: isSelected ? 600 : 500 }}>
                    {opt.label[language] || opt.label['en']}
                  </span>
                  {isSelected && <CheckCircle2 size={20} color="var(--primary-color)" />}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center">
            <button
              className="btn btn-outline"
              style={{ width: 'auto' }}
              onClick={() => {
                if (currentStep > 0) setCurrentStep(currentStep - 1);
                else navigate('/mode-select');
              }}
            >
              <ArrowLeft size={18} /> {isHindi ? 'पीछे' : 'Back'}
            </button>

            <button
              className="btn btn-primary"
              style={{ width: 'auto' }}
              onClick={() => goToNextStep(answers)}
              disabled={!answers[currentQuestion.id]}
            >
              {currentStep >= applicableQuestions.length - 1
                ? (isHindi ? 'सत्यापन पर जाएं' : 'Proceed to Verification')
                : (isHindi ? 'अगला' : 'Next')}{' '}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Mode 2: Explain Full Story / Situation to AI ── */}
      {mode === 'story' && (
        <div>
          <div className="alert alert-info mb-4">
            <Sparkles size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.875rem' }}>
              {isHindi
                ? 'अपनी पूरी बात बोलें या लिखें। हमारा एआई आपके शब्दों से जरूरी जानकारियां निकाल कर फॉर्म में भर देगा।'
                : 'Describe your situation naturally in voice or text. Our AI will extract all details and prepare your form.'}
            </div>
          </div>

          {/* Large Speech / Text Input Area */}
          <div className="card mb-4" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-center mb-2">
              <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                {isHindi ? 'अपनी समस्या / स्थिति बताएं:' : 'Describe your situation:'}
              </label>
              <button
                onClick={() => {
                  if (isListening) stopListening();
                  else startListening();
                }}
                className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  width: 'auto',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: 20,
                  backgroundColor: isListening ? '#dc2626' : undefined,
                  borderColor: isListening ? '#dc2626' : undefined,
                  color: isListening ? 'white' : undefined
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                {isListening ? (isHindi ? 'सुनना बंद करें' : 'Stop Mic') : (isHindi ? 'माइक से बोलें' : 'Speak via Mic')}
              </button>
            </div>

            <textarea
              className="form-control"
              rows={5}
              value={storyText}
              onChange={(e) => {
                setStoryText(e.target.value);
                const extracted = extractFieldsFromStory(e.target.value);
                setDetectedFields(extracted);
                setAnswers(prev => ({ ...prev, ...extracted }));
              }}
              placeholder={
                isHindi
                  ? 'उदा. "मेरे पति की एक सड़क दुर्घटना में मृत्यु हो गई। वे एक निजी कंपनी में नौकरी करते थे और PF था। हमारी आय कम है..."'
                  : 'e.g. "My husband passed away in a road accident. He worked in a private company and had PF. We are low income and need support..."'
              }
              style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
            />

            {/* Quick Sample Clickers */}
            <div className="mt-3">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                {isHindi ? 'त्वरित उदाहरण (क्लिक करके आज़माएं):' : 'Try quick examples:'}
              </span>
              <div className="flex flex-col gap-2">
                {sampleStories.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStoryText(sample.text);
                      const extracted = extractFieldsFromStory(sample.text);
                      setDetectedFields(extracted);
                      setAnswers(prev => ({ ...prev, ...extracted }));
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '6px 10px',
                      fontSize: '0.8rem',
                      borderRadius: 6,
                      border: '1px dashed var(--border-color)',
                      backgroundColor: '#f9fafb',
                      cursor: 'pointer'
                    }}
                  >
                    <strong>{sample.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Detected Fields Badges */}
          {Object.keys(detectedFields).length > 0 && (
            <div className="card mb-6" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={18} /> {isHindi ? 'एआई द्वारा पहचानी गई जानकारी:' : 'Details Detected by AI:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(detectedFields).map(([key, val]) => (
                  <span
                    key={key}
                    className="badge badge-success"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  >
                    {getQuestionTitle(key, language)}: <strong>{getAnswerLabel(key, val, language)}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-between items-center">
            <button
              className="btn btn-outline"
              style={{ width: 'auto' }}
              onClick={() => navigate('/mode-select')}
            >
              <ArrowLeft size={18} /> {isHindi ? 'पीछे' : 'Back'}
            </button>

            <button
              className="btn btn-primary"
              style={{ width: 'auto' }}
              onClick={handleStoryAnalyze}
              disabled={!storyText.trim()}
            >
              <Sparkles size={18} />
              {isHindi ? 'फॉर्म भरें और सत्यापित करें' : 'Auto-Fill & Verify Details'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssessment;
