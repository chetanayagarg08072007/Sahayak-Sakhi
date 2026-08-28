import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { questions, getApplicableQuestions } from '../data/questions';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Assessment = () => {
  const { saveAssessment, assessmentData, language } = useUser();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(assessmentData || {});

  const applicableQuestions = getApplicableQuestions(answers);
  const currentQuestion = applicableQuestions[currentStep] || applicableQuestions[0];

  const handleSelect = (val) => {
    const updated = { ...answers, [currentQuestion.id]: val };
    setAnswers(updated);
  };

  const handleNext = () => {
    saveAssessment(answers);
    const nextApplicable = getApplicableQuestions(answers);

    if (currentStep + 1 < nextApplicable.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Direct user to verify and review before dashboard
      navigate('/verify-assessment');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/mode-select');
    }
  };

  const progress = ((currentStep + 1) / applicableQuestions.length) * 100;
  const isHindi = language === 'hi';
  const t = (textObj) => (textObj ? textObj[language] || textObj['en'] : '');

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div style={{ height: '8px', backgroundColor: 'var(--secondary-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              transition: 'width 0.3s'
            }}
          ></div>
        </div>
        <p className="text-center mt-2 text-muted" style={{ fontSize: '0.875rem' }}>
          {isHindi
            ? `चरण ${currentStep + 1} / ${applicableQuestions.length}`
            : `Step ${currentStep + 1} of ${applicableQuestions.length}`}
        </p>
      </div>

      <h2 className="mb-6">{t(currentQuestion?.title)}</h2>

      <div className="flex flex-col gap-3 mb-8">
        {currentQuestion?.options.map(opt => {
          const isSelected = answers[currentQuestion.id] === opt.value;
          return (
            <div
              key={opt.value}
              className={`card card-selectable ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.1rem 1.25rem',
                margin: 0
              }}
            >
              <strong>{t(opt.label)}</strong>
              {isSelected && <CheckCircle2 size={20} color="var(--primary-color)" />}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button className="btn btn-outline" style={{ width: 'auto' }} onClick={handleBack}>
          <ArrowLeft size={20} /> {isHindi ? 'पीछे' : 'Back'}
        </button>
        <button
          className="btn btn-primary"
          style={{ width: 'auto' }}
          onClick={handleNext}
          disabled={!answers[currentQuestion?.id]}
        >
          {currentStep >= applicableQuestions.length - 1
            ? (isHindi ? 'सत्यापन पर जाएं' : 'Proceed to Verification')
            : (isHindi ? 'अगला' : 'Next')}{' '}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Assessment;
