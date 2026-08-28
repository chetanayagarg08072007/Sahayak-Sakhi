import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowRight, Info, Edit3, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const { recommendedSchemes, assessmentData, language } = useUser();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  if (!assessmentData) {
    return (
      <div className="text-center mt-8">
        <p>{isHindi ? 'सिफारिशें देखने के लिए कृपया पहले मूल्यांकन पूरा करें।' : 'Please complete the assessment first to see recommendations.'}</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/mode-select')}>
          {isHindi ? 'मूल्यांकन शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const renderBadge = (priority) => {
    switch (priority) {
      case 'Apply Immediately':
        return <span className="badge badge-danger">🔴 {isHindi ? 'तुरंत आवेदन करें' : priority}</span>;
      case 'Important':
        return <span className="badge badge-warning">🟠 {isHindi ? 'महत्वपूर्ण' : priority}</span>;
      default:
        return <span className="badge badge-success">🟢 {isHindi ? 'अतिरिक्त लाभ' : priority}</span>;
    }
  };

  const immediate = recommendedSchemes.filter(s => s.priority === 'Apply Immediately');
  const important = recommendedSchemes.filter(s => s.priority === 'Important');
  const additional = recommendedSchemes.filter(s => s.priority === 'Additional Benefits');

  const Section = ({ title, schemes }) => {
    if (schemes.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="mb-4">{title}</h3>
        <div className="flex flex-col gap-3">
          {schemes.map(scheme => (
            <div
              key={scheme.id}
              className="card card-selectable"
              onClick={() => navigate(`/scheme/${scheme.id}`)}
              style={{ margin: 0 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{scheme.title}</h4>
                {renderBadge(scheme.priority)}
              </div>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {scheme.description}
              </p>
              <div className="flex items-center text-primary" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {isHindi ? 'दस्तावेज़ और आवेदन के चरण देखें' : 'View Requirements & Steps'} <ArrowRight size={16} style={{ marginLeft: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="alert alert-info flex-col mb-4">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', margin: 0, fontSize: '1.1rem' }}>
          <Info size={20} /> {isHindi ? 'आपकी व्यक्तिगत योजनाएं व लाभ' : 'Your Personalized Scheme Recommendations'}
        </h3>
        <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem' }}>
          {isHindi ? (
            <>
              आपकी जानकारी के आधार पर, आप <strong>{recommendedSchemes.length} सरकारी योजनाओं/लाभों</strong> के पात्र हो सकते हैं।
            </>
          ) : (
            <>
              Based on your details, you may be eligible for <strong>{recommendedSchemes.length} forms of support</strong>.
            </>
          )}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-outline"
          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          onClick={() => navigate('/verify-assessment')}
        >
          <Edit3 size={15} style={{ marginRight: 4 }} />
          {isHindi ? 'विवरण की समीक्षा / सुधारें' : 'Review / Edit Answers'}
        </button>

        <button
          className="btn btn-outline"
          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          onClick={() => navigate('/tracker')}
        >
          {isHindi ? 'ट्रैकर देखें' : 'View Tracker'} →
        </button>
      </div>

      {recommendedSchemes.length === 0 ? (
        <div className="card text-center py-6">
          <p style={{ margin: 0 }}>
            {isHindi
              ? 'दी गई जानकारी के आधार पर कोई विशिष्ट योजना नहीं मिली, लेकिन आप अन्य सामान्य सरकारी सहायता के पात्र हो सकते हैं।'
              : "We couldn't match you with specific schemes based on the information provided, but you may still be eligible for general assistance."}
          </p>
        </div>
      ) : (
        <>
          <Section title={isHindi ? '🔴 तुरंत आवेदन करें' : 'Apply Immediately'} schemes={immediate} />
          <Section title={isHindi ? '🟠 महत्वपूर्ण योजनाएं' : 'Important Schemes'} schemes={important} />
          <Section title={isHindi ? '🟢 अतिरिक्त लाभ' : 'Additional Benefits'} schemes={additional} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
