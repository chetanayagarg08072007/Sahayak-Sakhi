import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  questions,
  getApplicableQuestions,
  getAnswerLabel,
  getQuestionTitle
} from '../data/questions';
import {
  CheckCircle2,
  Edit3,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

const VerifyAssessment = () => {
  const { assessmentData, saveAssessment, language } = useUser();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  const [answers, setAnswers] = useState(assessmentData || {});
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const applicableQuestions = getApplicableQuestions(answers);

  // Auto-read summary on first arrival
  useEffect(() => {
    // Generate voice summary text
    const summaryText = buildVoiceSummary(answers);
    speakText(summaryText);

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const buildVoiceSummary = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return isHindi
        ? 'कोई जानकारी नहीं मिली। कृपया पहले मूल्यांकन भरें।'
        : 'No information found. Please complete the assessment first.';
    }

    const items = applicableQuestions
      .filter(q => data[q.id])
      .map(q => {
        const title = q.title[language] || q.title['en'];
        const val = getAnswerLabel(q.id, data[q.id], language);
        return isHindi ? `${title}: ${val}` : `${title}: ${val}`;
      });

    if (isHindi) {
      return `यहाँ आपके द्वारा दी गई जानकारी की समीक्षा है। ${items.join(
        '। '
      )}। यदि कुछ बदलना चाहते हैं, तो संबंधित विकल्प के पास 'सुधारें' पर टैप करें।`;
    } else {
      return `Here is a summary of the details provided. ${items.join(
        '. '
      )}. If you want to make any corrections, tap Edit next to the item.`;
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleUpdateField = (fieldId, newValue) => {
    const updated = { ...answers, [fieldId]: newValue };
    setAnswers(updated);
    saveAssessment(updated);
    setEditingFieldId(null);

    const feedback = isHindi
      ? `जानकारी अपडेट कर दी गई है।`
      : `Detail has been updated.`;
    speakText(feedback);
  };

  const handleConfirm = () => {
    saveAssessment(answers);
    navigate('/dashboard');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-6">
        <span className="badge badge-success mb-2" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
          <Sparkles size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          {isHindi ? 'एआई सत्यापन और सुधार' : 'AI Verification & Correction'}
        </span>
        <h2 className="mb-2">
          {isHindi ? 'अपनी जानकारी की समीक्षा करें' : 'Verify Your Information'}
        </h2>
        <p style={{ margin: 0 }}>
          {isHindi
            ? 'कृपया सुनिश्चित करें कि सभी विवरण सही हैं। किसी भी विकल्प को बदलने के लिए "सुधारें" पर क्लिक करें।'
            : 'Please confirm that all details are accurate. Click "Edit" on any field to make instant corrections.'}
        </p>
      </div>

      {/* Voice Readout Banner */}
      <div
        className="card mb-6"
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: isSpeaking ? '#dc2626' : 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            onClick={() => speakText(buildVoiceSummary(answers))}
          >
            {isSpeaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e3a8a' }}>
              {isSpeaking
                ? (isHindi ? 'एआई विवरण पढ़ रहा है...' : 'AI is reading your details...')
                : (isHindi ? 'एआई से सारांश सुनें' : 'Listen to AI Summary')}
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
              {isSpeaking
                ? (isHindi ? 'रोकने के लिए क्लिक करें' : 'Click to stop reading')
                : (isHindi ? 'बोलकर पूरी जानकारी सुनने के लिए क्लिक करें' : 'Click to have AI read back your filled form')}
            </span>
          </div>
        </div>
      </div>

      {/* List of Verified Fields with Edit Options */}
      <div className="flex flex-col gap-3 mb-6">
        {applicableQuestions.map((q) => {
          const currentVal = answers[q.id];
          const hasVal = currentVal !== undefined && currentVal !== null && currentVal !== '';
          const isEditing = editingFieldId === q.id;

          return (
            <div
              key={q.id}
              className="card"
              style={{
                margin: 0,
                padding: '1rem 1.25rem',
                border: isEditing ? '2px solid var(--primary-color)' : (hasVal ? '1px solid #e5e7eb' : '1px dashed #f59e0b'),
                backgroundColor: hasVal ? 'white' : '#fffbeb'
              }}
            >
              <div className="flex justify-between items-start">
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {q.title[language] || q.title['en']}
                  </div>

                  {!isEditing && (
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: hasVal ? 'var(--text-primary)' : '#b45309' }}>
                      {hasVal ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={18} color="var(--success-color)" />
                          {getAnswerLabel(q.id, currentVal, language)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <AlertCircle size={18} color="#d97706" />
                          {isHindi ? 'जानकारी दर्ज नहीं है (जोड़ें)' : 'Not Provided (Click to add)'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setEditingFieldId(q.id)}
                    className="btn btn-outline"
                    style={{
                      width: 'auto',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: 6,
                      flexShrink: 0
                    }}
                  >
                    <Edit3 size={14} style={{ marginRight: 4 }} />
                    {isHindi ? 'सुधारें' : 'Edit'}
                  </button>
                )}
              </div>

              {/* Inline Edit Selector */}
              {isEditing && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isHindi ? 'नया विकल्प चुनें:' : 'Select the correct option:'}
                  </label>
                  <div className="flex flex-col gap-2 mb-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleUpdateField(q.id, opt.value)}
                        style={{
                          textAlign: 'left',
                          padding: '0.6rem 0.9rem',
                          borderRadius: 6,
                          border: currentVal === opt.value ? '2px solid var(--primary-color)' : '1px solid #d1d5db',
                          backgroundColor: currentVal === opt.value ? '#eff6ff' : 'white',
                          fontWeight: currentVal === opt.value ? 600 : 400,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{opt.label[language] || opt.label['en']}</span>
                        {currentVal === opt.value && <Check size={16} color="var(--primary-color)" />}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditingFieldId(null)}
                      className="btn btn-secondary"
                      style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <X size={14} style={{ marginRight: 4 }} />
                      {isHindi ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="btn btn-outline"
          style={{ width: 'auto' }}
          onClick={() => navigate('/mode-select')}
        >
          <ArrowLeft size={18} /> {isHindi ? 'पुनः शुरू करें' : 'Restart Form'}
        </button>

        <button
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
          onClick={handleConfirm}
        >
          <Check size={18} />
          {isHindi ? 'विवरण की पुष्टि करें और योजनाएं देखें' : 'Confirm & View Eligible Schemes'}{' '}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default VerifyAssessment;
