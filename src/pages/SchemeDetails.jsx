import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockSchemes } from '../data/mockSchemes';
import { ArrowLeft, CheckCircle, FileText, MapPin, ShieldCheck } from 'lucide-react';

const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateSchemeStatus, trackedSchemes } = useUser();

  const scheme = mockSchemes.find(s => s.id === id);

  if (!scheme) {
    return <div>Scheme not found.</div>;
  }

  const currentStatus = trackedSchemes[scheme.id] || 'Not Started';

  const handleTrack = () => {
    if (currentStatus === 'Not Started') {
      updateSchemeStatus(scheme.id, 'Documents Required');
    }
    navigate('/tracker');
  };

  return (
    <div className="fade-in">
      <button className="btn btn-outline mb-6" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card mb-6" style={{ borderTop: '4px solid var(--primary-color)' }}>
        <h2 className="mb-2">{scheme.title}</h2>
        <p className="mb-4">{scheme.description}</p>
        
        <div className="alert alert-warning" style={{ margin: 0, fontSize: '0.875rem' }}>
          <ShieldCheck size={16} /> This is government-verified information. Please apply directly through official channels to avoid fraud.
        </div>
      </div>

      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-4"><CheckCircle size={20} color="var(--success-color)" /> Eligibility</h3>
        <ul style={{ paddingLeft: '1.5rem' }}>
          {scheme.eligibility.map((item, i) => (
            <li key={i} className="mb-2">{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-4"><FileText size={20} color="var(--primary-color)" /> Required Documents</h3>
        <div className="card" style={{ padding: '1rem' }}>
          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
            {scheme.documents.map((doc, i) => (
              <li key={i} className="mb-1">{doc}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-4"><MapPin size={20} color="var(--warning-color)" /> How to Apply (Step-by-Step)</h3>
        <ol style={{ paddingLeft: '1.5rem' }}>
          {scheme.steps.map((step, i) => (
            <li key={i} className="mb-2">{step}</li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <button 
          className="btn btn-primary w-full"
          onClick={handleTrack}
        >
          {currentStatus === 'Not Started' ? 'Save & Start Tracking' : 'View in Tracker'}
        </button>
      </div>
    </div>
  );
};

export default SchemeDetails;
