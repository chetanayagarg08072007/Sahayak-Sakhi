import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockSchemes } from '../data/mockSchemes';
import { ArrowLeft, Trash2 } from 'lucide-react';

const statuses = [
  'Not Started',
  'Documents Required',
  'Application Submitted',
  'Under Review',
  'Approved',
  'Benefit Received'
];

const Tracker = () => {
  const { trackedSchemes, updateSchemeStatus } = useUser();
  const navigate = useNavigate();

  const trackedList = Object.keys(trackedSchemes).map(id => {
    const scheme = mockSchemes.find(s => s.id === id);
    return { ...scheme, currentStatus: trackedSchemes[id] };
  }).filter(s => s.id); // Filter out any mismatched IDs

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <button className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Home
        </button>
        <h2 style={{ margin: 0 }}>Application Tracker</h2>
        <div style={{ width: '80px' }}></div> {/* Spacer */}
      </div>

      {trackedList.length === 0 ? (
        <div className="card text-center py-8">
          <p className="mb-4">You haven't saved any applications to track yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Find Schemes
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {trackedList.map(scheme => (
            <div key={scheme.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{scheme.title}</h3>
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}
                  onClick={() => updateSchemeStatus(scheme.id, undefined)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="form-group mb-0">
                <label className="form-label">Current Status</label>
                <select 
                  className="form-control"
                  value={scheme.currentStatus}
                  onChange={(e) => updateSchemeStatus(scheme.id, e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {scheme.currentStatus === 'Documents Required' && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>Next Step:</strong> Gather all documents and contact the relevant department.
                  </p>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => navigate(`/scheme/${scheme.id}`)}>
                    View Document List
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tracker;
