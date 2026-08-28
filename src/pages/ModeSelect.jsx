import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Mic, FileEdit, ArrowRight, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

const ModeSelect = () => {
  const { language } = useUser();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <span className="badge badge-success mb-2" style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}>
          <Sparkles size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {isHindi ? 'सुगम और आसान सहायता' : 'Easy & Accessible Support'}
        </span>
        <h2 className="mb-2">
          {isHindi ? 'आप फॉर्म कैसे भरना चाहते हैं?' : 'How would you like to proceed?'}
        </h2>
        <p>
          {isHindi
            ? 'आप अपनी स्थिति बोलकर एआई को बता सकते हैं, या खुद कदम-दर-कदम फॉर्म भर सकते हैं।'
            : 'You can talk to our AI voice assistant to automatically fill the details, or fill out the step-by-step form yourself.'}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {/* Option 1: AI Voice Bot Mode (Primary/Recommended) */}
        <div
          className="card card-selectable"
          onClick={() => navigate('/voice-assessment')}
          style={{
            border: '2px solid var(--primary-color)',
            backgroundColor: '#f0f7ff',
            padding: '1.5rem',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', top: '-12px', right: '16px' }}>
            <span className="badge badge-primary" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
              ⭐ {isHindi ? 'अनुशंसित (आसान)' : 'Recommended (Fastest)'}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Mic size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                {isHindi ? '🎙️ एआई वॉइस बॉट को अपनी स्थिति बताएं' : '🎙️ Explain to AI Voice Bot'}
              </h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                {isHindi
                  ? 'अपनी भाषा में बोलें या संक्षेप में अपनी समस्या बताएं। एआई अपने आप फॉर्म भर देगा, फिर आप समीक्षा और सुधार कर सकते हैं।'
                  : 'Speak or describe your situation in your own words. The AI understands and fills the entire form for you, then helps you verify and correct.'}
              </p>
              <div className="flex items-center text-primary" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {isHindi ? 'वॉइस बॉट शुरू करें' : 'Start Voice & AI Assistant'} <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Self Fill Mode */}
        <div
          className="card card-selectable"
          onClick={() => navigate('/assessment')}
          style={{ padding: '1.5rem' }}
        >
          <div className="flex items-start gap-4">
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--secondary-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileEdit size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                {isHindi ? '✍️ मैं खुद फॉर्म भरूँगा / भरूँगी' : '✍️ Fill the Form Myself'}
              </h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                {isHindi
                  ? 'आसान बहुविकल्पीय (Multiple Choice) प्रश्नों के उत्तर देकर अपनी गति से फॉर्म पूरा करें।'
                  : 'Answer simple multiple-choice questions step-by-step at your own pace.'}
              </p>
              <div className="flex items-center" style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isHindi ? 'कदम-दर-कदम शुरू करें' : 'Start Step-by-Step Form'} <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.875rem' }}>
          <strong>{isHindi ? 'सुरक्षित और पूर्णतः गोपनीय:' : 'Safe & Confidential:'}</strong>{' '}
          {isHindi
            ? 'आपकी जानकारी केवल सरकारी योजनाओं की पात्रता जांचने के लिए उपयोग होती है।'
            : 'Your data is only used locally to match you with eligible government schemes.'}
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
