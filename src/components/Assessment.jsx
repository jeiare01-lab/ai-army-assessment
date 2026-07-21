import React, { useState } from 'react';
import { ChevronRight, Download, RotateCcw } from 'lucide-react';
import { saveAssessment } from '../lib/supabase';

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [responses, setResponses] = useState({
    name: '',
    email: '',
    age: '',
    role: '',
    department: '',
    yearsExperience: '',
    currentAISkill: 3,
    aiCuriosity: 3,
    processImprovementMindset: 3,
    adaptabilityToChange: 3,
    willingness: 3,
    businessProcessKnowledge: 3,
  });
  const [profile, setProfile] = useState(null);

  const steps = [
    { title: 'Demographics', key: 'demographics' },
    { title: 'AI Skill & Knowledge', key: 'aiSkill' },
    { title: 'AI Appetite & Mindset', key: 'appetite' },
    { title: 'Assessment Complete', key: 'results' },
  ];

  const handleInputChange = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const calculateProfile = () => {
    const aiSkillScore = parseInt(responses.currentAISkill) || 1;
    const curiosityScore = parseInt(responses.aiCuriosity) || 1;
    const processScore = parseInt(responses.processImprovementMindset) || 1;
    const adaptScore = parseInt(responses.adaptabilityToChange) || 1;
    const willingnessScore = parseInt(responses.willingness) || 1;
    const businessScore = parseInt(responses.businessProcessKnowledge) || 1;

    const aiAppetiteScore = (curiosityScore + processScore + willingnessScore) / 3;
    const readinessScore = (aiSkillScore + adaptScore + businessScore) / 3;
    const overallScore = (aiAppetiteScore + readinessScore) / 2;

    let cluster, tier, recommendation;

    if (aiAppetiteScore >= 4.5 && readinessScore >= 4) {
      cluster = 'AI Champions';
      tier = 'Tier 1 - Leadership Track';
      recommendation = 'Ready for advanced roles. Consider for AI mentorship, process optimization projects, or innovation initiatives.';
    } else if (aiAppetiteScore >= 4 && readinessScore >= 3.5) {
      cluster = 'AI Accelerators';
      tier = 'Tier 2 - Fast Track';
      recommendation = 'High potential for rapid upskilling. Ideal for project teams, hands-on AI implementation, and process redesign.';
    } else if (aiAppetiteScore >= 3.5 && readinessScore >= 2.5) {
      cluster = 'AI Builders';
      tier = 'Tier 3 - Core Track';
      recommendation = 'Solid foundation with growth potential. Engage in foundational AI training and process improvement initiatives.';
    } else if (aiAppetiteScore >= 2.5) {
      cluster = 'AI Learners';
      tier = 'Tier 4 - Foundation Track';
      recommendation = 'Emerging interest in AI. Start with awareness programs, basic AI literacy, and process mapping exercises.';
    } else {
      cluster = 'AI Explorers';
      tier = 'Tier 5 - Awareness Track';
      recommendation = 'Beginning AI journey. Focus on exposure, curiosity building, and understanding AI fundamentals in business context.';
    }

    let appetiteProfile;
    if (aiAppetiteScore >= 4.5) {
      appetiteProfile = 'Voracious - Extremely hungry to innovate and transform processes through AI';
    } else if (aiAppetiteScore >= 4) {
      appetiteProfile = 'Strong - Motivated to adopt AI and drive process improvements';
    } else if (aiAppetiteScore >= 3.5) {
      appetiteProfile = 'Moderate - Open to AI and process improvements with proper support';
    } else if (aiAppetiteScore >= 2.5) {
      appetiteProfile = 'Emerging - Developing interest; needs encouragement and guidance';
    } else {
      appetiteProfile = 'Discovering - Early stage; open to learning more about AI potential';
    }

    const newProfile = {
      name: responses.name,
      email: responses.email,
      age: responses.age,
      role: responses.role,
      department: responses.department,
      years_experience: responses.yearsExperience,
      ai_skill: aiSkillScore,
      ai_curiosity: curiosityScore,
      process_improvement: processScore,
      adaptability: adaptScore,
      willingness: willingnessScore,
      business_knowledge: businessScore,
      ai_appetite: parseFloat(aiAppetiteScore.toFixed(2)),
      readiness: parseFloat(readinessScore.toFixed(2)),
      overall: parseFloat(overallScore.toFixed(2)),
      cluster,
      tier,
      appetite_profile: appetiteProfile,
      recommendation,
    };

    setProfile(newProfile);
    setStep(3);
  };

  const handleNext = () => {
    if (step === 2) {
      calculateProfile();
    } else {
      setStep(step + 1);
    }
  };

  const handleSaveAssessment = async () => {
    if (!profile) return;
    
    setLoading(true);
    setSaveMessage(null);
    
    try {
      await saveAssessment(profile);
      setSaveMessage({ type: 'success', text: 'Save successful! Redirecting...' });
      setTimeout(() => handleReset(), 2000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setProfile(null);
    setSaveMessage(null);
    setResponses({
      name: '',
      email: '',
      age: '',
      role: '',
      department: '',
      yearsExperience: '',
      currentAISkill: 3,
      aiCuriosity: 3,
      processImprovementMindset: 3,
      adaptabilityToChange: 3,
      willingness: 3,
      businessProcessKnowledge: 3,
    });
  };

  const downloadProfile = () => {
    const text = `
AI BUSINESS PROCESS ARMY - ASSESSMENT PROFILE
===============================================

Name: ${profile.name}
Email: ${profile.email}
Assessment Date: ${new Date().toLocaleString()}

DEMOGRAPHICS
Age: ${profile.age}
Role: ${profile.role}
Department: ${profile.department}
Years of Experience: ${profile.years_experience}

ASSESSMENT SCORES (1-5 Scale)
AI Skill Level: ${profile.ai_skill}/5
AI Curiosity: ${profile.ai_curiosity}/5
Process Improvement Mindset: ${profile.process_improvement}/5
Adaptability to Change: ${profile.adaptability}/5
Willingness to Learn: ${profile.willingness}/5
Business Process Knowledge: ${profile.business_knowledge}/5

KEY METRICS
AI Appetite Score: ${profile.ai_appetite}/5
Readiness Score: ${profile.readiness}/5
Overall Score: ${profile.overall}/5

CLUSTER & RECOMMENDATION
Cluster: ${profile.cluster}
Tier: ${profile.tier}
AI Appetite Profile: ${profile.appetite_profile}

Recommendation:
${profile.recommendation}

===============================================
Generated by AI Business Process Army Assessment Tool
    `;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Army-${profile.name.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const ScoreSlider = ({ label, field, description }) => (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <label className="font-semibold text-gray-800">{label}</label>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <span className="text-2xl font-bold text-blue-600">{responses[field]}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={responses[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Not at all</span>
        <span>Highly</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Business Process Army</h1>
          <p className="text-lg text-gray-600">Member Assessment & Cluster Analysis</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className="text-center flex-1">
                <div
                  className={`h-2 mx-1 rounded-full ${
                    i <= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
                <p className={`text-xs mt-2 ${i <= step ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={responses.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={responses.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={responses.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Age Range</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46-55">46-55</option>
                    <option value="55+">55+</option>
                  </select>
                  <select
                    value={responses.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Years of Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Current Role"
                  value={responses.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Department / SBU"
                  value={responses.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Skill & Knowledge</h2>
              <ScoreSlider
                label="Current AI Skill Level"
                field="currentAISkill"
                description="Your hands-on experience with AI tools"
              />
              <ScoreSlider
                label="Business Process Knowledge"
                field="businessProcessKnowledge"
                description="Your understanding of business processes in your role"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Appetite & Mindset</h2>
              <ScoreSlider
                label="AI Curiosity"
                field="aiCuriosity"
                description="Your interest in learning about AI"
              />
              <ScoreSlider
                label="Process Improvement Mindset"
                field="processImprovementMindset"
                description="Your drive to improve efficiency"
              />
              <ScoreSlider
                label="Adaptability to Change"
                field="adaptabilityToChange"
                description="Comfort with learning new approaches"
              />
              <ScoreSlider
                label="Willingness to Learn"
                field="willingness"
                description="Openness to trying new tools"
              />
            </div>
          )}

          {step === 3 && profile && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Results</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome, {profile.name}!</h3>
                <p className="text-gray-700">{profile.appetite_profile}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 font-semibold">AI APPETITE</p>
                  <p className="text-3xl font-bold text-blue-600">{profile.ai_appetite}</p>
                </div>
                <div className="bg-indigo-100 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 font-semibold">READINESS</p>
                  <p className="text-3xl font-bold text-indigo-600">{profile.readiness}</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 font-semibold">OVERALL</p>
                  <p className="text-3xl font-bold text-purple-600">{profile.overall}</p>
                </div>
              </div>

              <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded mb-6">
                <p className="font-semibold text-gray-900 mb-1">Cluster Assignment</p>
                <p className="text-lg font-bold text-blue-600 mb-2">{profile.cluster}</p>
                <p className="text-sm text-gray-700">{profile.recommendation}</p>
              </div>

              {saveMessage && (
                <div className={`p-4 rounded-lg mb-4 ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {saveMessage.text}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {step === 3 ? (
            <>
              <button
                onClick={downloadProfile}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <Download size={20} />
                Download
              </button>
              <button
                onClick={handleSaveAssessment}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save to Army'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
              >
                <RotateCcw size={20} />
                New
              </button>
            </>
          ) : (
            <>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                {step === 2 ? 'Generate' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
