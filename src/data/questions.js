// Shared questions data used by both manual Assessment and Voice Assessment
export const questions = [
  {
    id: 'supportType',
    title: {
      en: 'What kind of support are you looking for?',
      hi: 'आप किस प्रकार की सहायता ढूंढ रहे हैं?'
    },
    voicePrompt: {
      en: 'Please tell me, are you looking for support due to the loss of a family member, or for maternity and pregnancy support?',
      hi: 'कृपया बताएं, क्या आप किसी परिवार के सदस्य को खोने के कारण सहायता चाहते हैं, या मातृत्व और गर्भावस्था सहायता चाहते हैं?'
    },
    options: [
      { label: { en: 'Loss of a family member', hi: 'परिवार के किसी सदस्य को खोना' }, value: 'death', voiceKeywords: ['death', 'loss', 'lost', 'passed', 'died', 'family member', 'husband', 'father', 'brother', 'earning', 'breadwinner', 'मृत्यु', 'खोना', 'गुज़र', 'मर', 'पति', 'पिता', 'भाई'] },
      { label: { en: 'Maternity & Pregnancy Support', hi: 'मातृत्व और गर्भावस्था सहायता' }, value: 'pregnancy', voiceKeywords: ['pregnant', 'pregnancy', 'maternity', 'baby', 'child', 'mother', 'delivery', 'गर्भ', 'बच्चा', 'मातृत्व', 'गर्भावस्था', 'डिलीवरी'] }
    ]
  },
  {
    id: 'employmentType',
    title: {
      en: 'What was the employment status of the deceased?',
      hi: 'मृतक की रोजगार स्थिति क्या थी?'
    },
    voicePrompt: {
      en: 'What was the employment of the person who passed away? Were they in a private company, government job, self-employed, daily wage worker, or unemployed?',
      hi: 'जो व्यक्ति गुज़रे हैं उनका रोजगार क्या था? क्या वे निजी कंपनी में, सरकारी नौकरी, खुद का व्यवसाय, दैनिक मजदूरी, या बेरोजगार थे?'
    },
    options: [
      { label: { en: 'Private Sector Salaried', hi: 'निजी क्षेत्र के वेतनभोगी' }, value: 'private_salaried', voiceKeywords: ['private', 'salaried', 'company', 'corporate', 'office job', 'salary', 'निजी', 'कंपनी', 'प्राइवेट', 'नौकरी', 'वेतन'] },
      { label: { en: 'Government Employee', hi: 'सरकारी कर्मचारी' }, value: 'government', voiceKeywords: ['government', 'govt', 'sarkari', 'public sector', 'सरकारी', 'सरकार'] },
      { label: { en: 'Self-employed / Business', hi: 'स्व-नियोजित / व्यवसाय' }, value: 'self_employed', voiceKeywords: ['self', 'business', 'own', 'shop', 'vendor', 'व्यापार', 'व्यवसाय', 'दुकान', 'अपना', 'खुद'] },
      { label: { en: 'Daily Wage / Informal Worker', hi: 'दैनिक वेतनभोगी / अनौपचारिक कर्मचारी' }, value: 'informal', voiceKeywords: ['daily', 'wage', 'labour', 'labor', 'informal', 'mazdoor', 'contract', 'दैनिक', 'मजदूर', 'मज़दूर', 'दिहाड़ी'] },
      { label: { en: 'Unemployed', hi: 'बेरोजगार' }, value: 'unemployed', voiceKeywords: ['unemployed', 'no job', 'jobless', 'बेरोजगार', 'कोई काम नहीं'] }
    ],
    showIf: (data) => data.supportType === 'death'
  },
  {
    id: 'hadEPF',
    title: {
      en: 'Did they have a Provident Fund (PF / EPF) account?',
      hi: 'क्या उनके पास भविष्य निधि (PF / EPF) खाता था?'
    },
    voicePrompt: {
      en: 'Did the deceased person have a Provident Fund or PF account? You can say Yes, No, or Not Sure.',
      hi: 'क्या मृतक का भविष्य निधि या PF खाता था? आप हाँ, नहीं, या पता नहीं कह सकते हैं।'
    },
    options: [
      { label: { en: 'Yes', hi: 'हाँ' }, value: 'yes', voiceKeywords: ['yes', 'yeah', 'had', 'pf was there', 'epf', 'हाँ', 'हां', 'था', 'पीएफ था'] },
      { label: { en: 'No', hi: 'नहीं' }, value: 'no', voiceKeywords: ['no', 'nahi', 'did not have', 'नहीं', 'ना', 'नहीं था'] },
      { label: { en: 'I am not sure', hi: 'मुझे यकीन नहीं है' }, value: 'not_sure', voiceKeywords: ['not sure', 'don\'t know', 'maybe', 'unclear', 'पता नहीं', 'यकीन नहीं', 'शायद'] }
    ],
    showIf: (data) => data.supportType === 'death' && data.employmentType === 'private_salaried'
  },
  {
    id: 'causeOfDeath',
    title: {
      en: 'What was the primary cause of death?',
      hi: 'मृत्यु का प्राथमिक कारण क्या था?'
    },
    voicePrompt: {
      en: 'What was the cause of death? Was it natural or illness, or was it an accident?',
      hi: 'मृत्यु का कारण क्या था? क्या यह प्राकृतिक या बीमारी से हुई, या कोई दुर्घटना थी?'
    },
    options: [
      { label: { en: 'Natural Causes / Illness', hi: 'प्राकृतिक कारण / बीमारी' }, value: 'natural', voiceKeywords: ['natural', 'illness', 'disease', 'sick', 'health', 'heart attack', 'cancer', 'covid', 'प्राकृतिक', 'बीमारी', 'बीमार', 'अस्पताल'] },
      { label: { en: 'Accident', hi: 'दुर्घटना' }, value: 'accident', voiceKeywords: ['accident', 'accidental', 'crash', 'mishap', 'दुर्घटना', 'एक्सीडेंट', 'हादसा', 'टक्कर'] }
    ],
    showIf: (data) => data.supportType === 'death'
  },
  {
    id: 'accidentType',
    title: {
      en: 'Where did the accident occur?',
      hi: 'दुर्घटना कहाँ हुई थी?'
    },
    voicePrompt: {
      en: 'Where did the accident take place? Was it a road traffic accident, at the workplace, or elsewhere?',
      hi: 'दुर्घटना कहाँ हुई? क्या यह सड़क दुर्घटना थी, कार्यस्थल पर, या कहीं और?'
    },
    options: [
      { label: { en: 'Road Traffic Accident (Involving a vehicle)', hi: 'सड़क दुर्घटना (वाहन से)' }, value: 'road', voiceKeywords: ['road', 'traffic', 'vehicle', 'car', 'truck', 'bike', 'motor', 'highway', 'सड़क', 'वाहन', 'गाड़ी', 'ट्रक', 'बाइक', 'हाइवे'] },
      { label: { en: 'At the workplace', hi: 'कार्यस्थल पर' }, value: 'workplace', voiceKeywords: ['work', 'workplace', 'factory', 'office', 'site', 'construction', 'job', 'कार्यस्थल', 'फैक्ट्री', 'ऑफिस', 'काम पर', 'साइट'] },
      { label: { en: 'Other', hi: 'अन्य' }, value: 'other', voiceKeywords: ['other', 'home', 'drowning', 'fire', 'else', 'अन्य', 'घर', 'अलग'] }
    ],
    showIf: (data) => data.supportType === 'death' && data.causeOfDeath === 'accident'
  },
  {
    id: 'hadBankAccount',
    title: {
      en: 'Did they have an active bank account?',
      hi: 'क्या उनके पास बैंक खाता था?'
    },
    voicePrompt: {
      en: 'Did the deceased have an active savings bank account? Say Yes or No.',
      hi: 'क्या मृतक का बैंक में खाता था? कृपया हाँ या नहीं बताएं।'
    },
    options: [
      { label: { en: 'Yes', hi: 'हाँ' }, value: 'yes', voiceKeywords: ['yes', 'yeah', 'account was there', 'sbi', 'bank', 'हाँ', 'हां', 'था', 'खाता था'] },
      { label: { en: 'No', hi: 'नहीं' }, value: 'no', voiceKeywords: ['no', 'nahi', 'no account', 'नहीं', 'ना', 'खाता नहीं'] }
    ],
    showIf: (data) => data.supportType === 'death'
  },
  {
    id: 'incomeLevel',
    title: {
      en: 'What is the current financial status of the family?',
      hi: 'परिवार की वर्तमान वित्तीय स्थिति क्या है?'
    },
    voicePrompt: {
      en: 'What is the financial condition of the family? Are you BPL card holder, low income, middle income, or financially secure?',
      hi: 'परिवार की आर्थिक स्थिति कैसी है? क्या आपके पास बीपीएल राशन कार्ड है, कम आय, मध्यम आय, या सुरक्षित हैं?'
    },
    options: [
      { label: { en: 'Below Poverty Line (BPL Card Holder)', hi: 'गरीबी रेखा से नीचे (बीपीएल कार्ड)' }, value: 'bpl', voiceKeywords: ['bpl', 'poverty', 'ration card', 'below poverty', 'गरीबी', 'बीपीएल', 'राशन कार्ड'] },
      { label: { en: 'Low Income (Struggling to meet daily needs)', hi: 'कम आय (दैनिक जरूरतों को पूरा करने में संघर्ष)' }, value: 'low', voiceKeywords: ['low', 'struggling', 'poor', 'hard', 'tight', 'difficult', 'कम', 'संघर्ष', 'गरीब', 'तंगी', 'कठिनाई'] },
      { label: { en: 'Middle Income (Stable but need support)', hi: 'मध्यम आय (स्थिर लेकिन मदद की जरूरत है)' }, value: 'middle', voiceKeywords: ['middle', 'moderate', 'average', 'stable', 'मध्यम', 'ठीकठाक', 'साधारण'] },
      { label: { en: 'Financially Secure', hi: 'वित्तीय रूप से सुरक्षित' }, value: 'secure', voiceKeywords: ['secure', 'good', 'fine', 'wealthy', 'सुरक्षित', 'अच्छी', 'सक्षम'] }
    ]
  }
];

// Helper to get applicable questions based on current answers
export function getApplicableQuestions(answers = {}) {
  return questions.filter(q => !q.showIf || q.showIf(answers));
}

// Match spoken text to an option value for a single question
export function matchVoiceToOption(spokenText, question) {
  if (!spokenText || !question) return null;
  const text = spokenText.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const opt of question.options) {
    const keywords = opt.voiceKeywords || [];
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = opt.value;
    }
  }
  return bestMatch;
}

// NLP story extractor: analyze free-form spoken story or paragraph and fill form fields automatically
export function extractFieldsFromStory(text) {
  if (!text || typeof text !== 'string') return {};
  const t = text.toLowerCase();
  const detected = {};

  // 1. Support Type
  if (t.includes('pregnant') || t.includes('pregnancy') || t.includes('maternity') || t.includes('baby') || t.includes('गर्भावस्था') || t.includes('गर्भ') || t.includes('मातृत्व')) {
    detected.supportType = 'pregnancy';
  } else if (t.includes('death') || t.includes('died') || t.includes('passed away') || t.includes('lost') || t.includes('killed') || t.includes('demise') || t.includes('expired') || t.includes('मृत्यु') || t.includes('गुज़र') || t.includes('मर गए') || t.includes('मौत') || t.includes('दुर्घटना')) {
    detected.supportType = 'death';
  }

  // 2. Cause of Death
  if (detected.supportType === 'death' || !detected.supportType) {
    if (t.includes('accident') || t.includes('crash') || t.includes('road') || t.includes('truck') || t.includes('bike') || t.includes('hit') || t.includes('mishap') || t.includes('दुर्घटना') || t.includes('एक्सीडेंट') || t.includes('हादसा')) {
      detected.causeOfDeath = 'accident';
      if (!detected.supportType) detected.supportType = 'death';
    } else if (t.includes('illness') || t.includes('disease') || t.includes('heart attack') || t.includes('cancer') || t.includes('natural') || t.includes('sick') || t.includes('बीमारी') || t.includes('प्राकृतिक')) {
      detected.causeOfDeath = 'natural';
      if (!detected.supportType) detected.supportType = 'death';
    }
  }

  // 3. Accident Type
  if (detected.causeOfDeath === 'accident') {
    if (t.includes('road') || t.includes('traffic') || t.includes('car') || t.includes('truck') || t.includes('bike') || t.includes('vehicle') || t.includes('highway') || t.includes('सड़क') || t.includes('गाड़ी')) {
      detected.accidentType = 'road';
    } else if (t.includes('work') || t.includes('factory') || t.includes('construction') || t.includes('office') || t.includes('site') || t.includes('कार्यस्थल') || t.includes('फैक्ट्री')) {
      detected.accidentType = 'workplace';
    } else {
      detected.accidentType = 'other';
    }
  }

  // 4. Employment Type
  if (t.includes('private') || t.includes('company') || t.includes('software') || t.includes('corporate') || t.includes('pvt') || t.includes('salaried') || t.includes('निजी') || t.includes('कंपनी')) {
    detected.employmentType = 'private_salaried';
  } else if (t.includes('govt') || t.includes('government') || t.includes('sarkari') || t.includes('police') || t.includes('railway') || t.includes('सरकारी')) {
    detected.employmentType = 'government';
  } else if (t.includes('business') || t.includes('shop') || t.includes('self employed') || t.includes('own work') || t.includes('दुकान') || t.includes('व्यापार') || t.includes('खुद का')) {
    detected.employmentType = 'self_employed';
  } else if (t.includes('daily wage') || t.includes('labour') || t.includes('labor') || t.includes('worker') || t.includes('mazdoor') || t.includes('painter') || t.includes('driver') || t.includes('मजदूर') || t.includes('दिहाड़ी')) {
    detected.employmentType = 'informal';
  }

  // 5. EPF / PF
  if (t.includes('pf') || t.includes('epf') || t.includes('provident fund') || t.includes('भविष्य निधि')) {
    if (t.includes('no pf') || t.includes('without pf') || t.includes('pf नहीं')) {
      detected.hadEPF = 'no';
    } else {
      detected.hadEPF = 'yes';
    }
  }

  // 6. Bank Account
  if (t.includes('bank') || t.includes('account') || t.includes('passbook') || t.includes('खाता')) {
    if (t.includes('no bank') || t.includes('no account') || t.includes('खाता नहीं')) {
      detected.hadBankAccount = 'no';
    } else {
      detected.hadBankAccount = 'yes';
    }
  }

  // 7. Income Level
  if (t.includes('bpl') || t.includes('ration card') || t.includes('बीपीएल')) {
    detected.incomeLevel = 'bpl';
  } else if (t.includes('poor') || t.includes('low income') || t.includes('struggling') || t.includes('hard') || t.includes('कम आय') || t.includes('तंगी') || t.includes('गरीब') || t.includes('मदद चाहिए')) {
    detected.incomeLevel = 'low';
  } else if (t.includes('middle class') || t.includes('middle income') || t.includes('मध्यम')) {
    detected.incomeLevel = 'middle';
  }

  return detected;
}

// Get readable label for an answer
export function getAnswerLabel(questionId, value, lang = 'en') {
  const q = questions.find(item => item.id === questionId);
  if (!q) return value;
  const opt = q.options.find(o => o.value === value);
  if (!opt) return value;
  return opt.label[lang] || opt.label['en'] || value;
}

// Get readable question title
export function getQuestionTitle(questionId, lang = 'en') {
  const q = questions.find(item => item.id === questionId);
  if (!q) return questionId;
  return q.title[lang] || q.title['en'] || questionId;
}
