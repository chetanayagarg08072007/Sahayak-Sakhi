import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockSchemes } from '../data/mockSchemes';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [trackedSchemes, setTrackedSchemes] = useState({});
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [language, setLanguage] = useState('en');
  const [aiMessage, setAiMessage] = useState(null);

  // Load saved state from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('familySupportData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.assessmentData) setAssessmentData(parsed.assessmentData);
        if (parsed.trackedSchemes) setTrackedSchemes(parsed.trackedSchemes);
        if (parsed.language) setLanguage(parsed.language);
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    if (assessmentData || Object.keys(trackedSchemes).length > 0 || language) {
      localStorage.setItem('familySupportData', JSON.stringify({
        assessmentData,
        trackedSchemes,
        language
      }));
    }
  }, [assessmentData, trackedSchemes, language]);

  // Recalculate recommendations when assessment data changes
  useEffect(() => {
    if (assessmentData) {
      const eligible = mockSchemes.filter(scheme => scheme.matchCriteria(assessmentData));
      setRecommendedSchemes(eligible);
    }
  }, [assessmentData]);

  const saveAssessment = (data) => {
    setAssessmentData(data);
  };

  const updateSchemeStatus = (schemeId, status) => {
    setTrackedSchemes(prev => ({
      ...prev,
      [schemeId]: status
    }));
  };

  const clearData = () => {
    setAssessmentData(null);
    setTrackedSchemes({});
    localStorage.removeItem('familySupportData');
  };

  return (
    <UserContext.Provider value={{
      assessmentData,
      saveAssessment,
      recommendedSchemes,
      trackedSchemes,
      updateSchemeStatus,
      clearData,
      language,
      setLanguage,
      aiMessage,
      setAiMessage
    }}>
      {children}
    </UserContext.Provider>
  );
};
