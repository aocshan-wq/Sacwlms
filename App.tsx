import React, { useState, useCallback } from 'react';
import Chatbot from './components/Chatbot';
import ImageAnalyzer from './components/ImageAnalyzer';
import WritingAssistant from './components/WritingAssistant';
import ReadingComprehension from './components/ReadingComprehension';
import VocabularyBuilder from './components/VocabularyBuilder';
import GrammarLessons from './components/GrammarLessons';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Sidebar from './components/Sidebar';
import { HomeIcon, ChatBubbleLeftRightIcon, PhotoIcon, PencilSquareIcon, BookOpenIcon, SparklesIcon, AcademicCapIcon } from './components/common/Icons';

export type View = 'home' | 'chat' | 'image' | 'writing' | 'reading' | 'vocabulary' | 'grammar';

const VIEW_TITLES: Record<View, string> = {
  home: 'Dashboard',
  chat: 'AI Conversation Practice',
  image: 'Image Analyzer',
  writing: 'Writing Assistant',
  reading: 'Reading Comprehension',
  vocabulary: 'Vocabulary Builder',
  grammar: 'Grammar Lessons & Quizzes',
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setShowSignupModal(false);
  };

  const renderContent = useCallback(() => {
    switch (activeView) {
      case 'chat':
        return <Chatbot />;
      case 'image':
        return <ImageAnalyzer />;
      case 'writing':
        return <WritingAssistant />;
      case 'reading':
        return <ReadingComprehension />;
      case 'vocabulary':
        return <VocabularyBuilder />;
      case 'grammar':
        return <GrammarLessons />;
      case 'home':
      default:
        return <HomeDashboard setActiveView={setActiveView} />;
    }
  }, [activeView]);

  return (
    <>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />
      <main className="main-content">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">{VIEW_TITLES[activeView]}</h1>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignup}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
};

interface HomeDashboardProps {
  setActiveView: (view: View) => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ setActiveView }) => {
  const features = [
    { name: 'AI Chatbot', view: 'chat', icon: <ChatBubbleLeftRightIcon />, description: "Practice conversation with a friendly AI tutor." },
    { name: 'Image Analyzer', view: 'image', icon: <PhotoIcon />, description: "Learn vocabulary by analyzing images." },
    { name: 'Writing Assistant', view: 'writing', icon: <PencilSquareIcon />, description: "Get instant feedback on your writing." },
    { name: 'Reading Comprehension', view: 'reading', icon: <BookOpenIcon />, description: "Test your understanding of passages." },
    { name: 'Vocabulary Builder', view: 'vocabulary', icon: <SparklesIcon />, description: "Get definitions, examples, and synonyms." },
    { name: 'Grammar Lessons', view: 'grammar', icon: <AcademicCapIcon />, description: "Explore lessons and take quizzes on grammar." },
  ];

  return (
    <div className="animate-slide-fade-in">
      <div className="text-left mb-12 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Welcome to IntelliLearn</h1>
        <p className="text-lg text-gray-400 max-w-3xl">Your personal AI-powered platform for mastering the English language. Select a tool from the sidebar or below to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.name}
            style={{ animationDelay: `${index * 100}ms` }}
            className="group aurora-card glowing-border p-6 rounded-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-slide-fade-in"
            onClick={() => setActiveView(feature.view as View)}
          >
            <div className="flex items-center mb-4">
               <div className="p-3 bg-gray-800 rounded-full mr-4 text-gray-400 border border-gray-700 group-hover:text-blue-400 transition-all duration-300">
                {feature.icon}
              </div>
              <h2 className="text-2xl font-semibold text-white">{feature.name}</h2>
            </div>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;