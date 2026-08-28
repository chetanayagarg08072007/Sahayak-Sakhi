import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, ArrowRight, BookOpen, Mic, FileEdit, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Home = () => {
  const { assessmentData, language } = useUser();
  const navigate = useNavigate();

  const isHindi = language === 'hi';

  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <span className="badge badge-success mb-2" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
          <Sparkles size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {isHindi ? 'राष्ट्रीय परिवार सहायता पोर्टल' : 'National Family Support Portal'}
        </span>
        <h2 className="mb-2">
          {isHindi ? 'क्या आप सरकारी सहायता या योजनाओं की तलाश में हैं?' : 'Looking for government support or schemes?'}
        </h2>
        <p>
          {isHindi
            ? 'आप सरकारी लाभ, मुआवजे, बीमा, पेंशन और मातृत्व सहायता के हकदार हो सकते हैं। आइए पता करें कि आप किन योजनाओं के पात्र हैं।'
            : "You may be entitled to government welfare schemes, compensation, insurance claims, pensions, or maternity benefits. Let's find out what you qualify for."}
        </p>
      </div>

      {/* Main Choice CTA Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Voice AI Card */}
        <div
          className="card card-selectable"
          onClick={() => navigate('/voice-assessment')}
          style={{
            border: '2px solid var(--primary-color)',
            backgroundColor: '#f0f7ff',
            padding: '1.25rem',
            margin: 0
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Mic size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center justify-between">
                <strong style={{ fontSize: '1.05rem', color: 'var(--primary-color)' }}>
                  {isHindi ? '🎙️ एआई वॉइस बॉट से बात करें' : '🎙️ Talk to AI Voice Bot'}
                </strong>
                <span className="badge badge-primary" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                  {isHindi ? 'ऑटो-फिल' : 'Auto-Fill'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                {isHindi
                  ? 'अपनी स्थिति बोलें, एआई खुद फॉर्म भरेगा और आपको सत्यापन में मदद करेगा।'
                  : 'Speak your situation naturally. AI auto-fills and helps you verify.'}
              </p>
            </div>
          </div>
        </div>

        {/* Self-fill Card */}
        <div
          className="card card-selectable"
          onClick={() => navigate('/assessment')}
          style={{
            padding: '1.25rem',
            margin: 0
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--secondary-color)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileEdit size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '1.05rem' }}>
                {isHindi ? '✍️ खुद फॉर्म भरें' : '✍️ Fill Form Step-by-Step'}
              </strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                {isHindi
                  ? 'सरल बहुविकल्पीय प्रश्नों के उत्तर देकर पात्रता जांचें।'
                  : 'Answer quick multiple-choice questions at your own pace.'}
              </p>
            </div>
          </div>
        </div>

        {assessmentData && (
          <button
            className="btn btn-secondary mt-2"
            onClick={() => navigate('/dashboard')}
          >
            {isHindi ? 'मेरी सहेजी गई सिफारिशें देखें' : 'View My Saved Recommendations'}
          </button>
        )}
      </div>

      {/* Immediate Support Guidelines Alert */}
      <div className="alert alert-info flex-col mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={20} />
          <strong>{isHindi ? 'तत्काल सहायता दिशानिर्देश' : 'Immediate Emergency Guidelines'}</strong>
        </div>
        <p className="mb-2" style={{ fontSize: '0.875rem' }}>
          {isHindi
            ? 'यदि आपने हाल ही में परिवार के किसी सदस्य को खो दिया है, तो कृपया तुरंत निम्नलिखित सुनिश्चित करें:'
            : 'If you have recently lost a family member, please ensure you do the following immediately:'}
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.875rem' }}>
          <li>{isHindi ? 'मृत्यु प्रमाण पत्र की कई सत्यापित प्रतियां प्राप्त करें।' : 'Obtain multiple certified copies of the Death Certificate.'}</li>
          <li>{isHindi ? 'दुर्घटना की स्थिति में FIR और पोस्टमार्टम रिपोर्ट सुरक्षित रखें।' : 'In case of accident, ensure an FIR is filed and keep the post-mortem report safe.'}</li>
          <li>{isHindi ? 'संबंधित नियोक्ता या बैंक शाखा को 30 दिनों के भीतर सूचित करें।' : 'Inform the employer or bank branch within 30 days.'}</li>
          <li>{isHindi ? 'अज्ञात बिचौलियों या एजेंटों को मूल दस्तावेज कभी न दें।' : 'Never hand over original documents to unknown agents or middlemen.'}</li>
        </ul>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          className="card card-selectable text-center flex flex-col items-center justify-center"
          onClick={() => navigate('/tracker')}
          style={{ padding: '1rem', margin: 0 }}
        >
          <Activity size={28} className="mb-2 text-primary" color="var(--primary-color)" />
          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{isHindi ? 'आवेदन ट्रैक करें' : 'Track Applications'}</strong>
        </div>
        <div
          className="card card-selectable text-center flex flex-col items-center justify-center"
          onClick={() => navigate('/mode-select')}
          style={{ padding: '1rem', margin: 0 }}
        >
          <BookOpen size={28} className="mb-2 text-primary" color="var(--primary-color)" />
          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{isHindi ? 'योजना खोजक' : 'Scheme Finder'}</strong>
        </div>
      </div>
    </div>
  );
};

export default Home;
