
import React, { useState } from 'react';
import { getGrammarExplanation, generateGrammarQuiz } from '../services/geminiService';
import { AcademicCapIcon } from './common/Icons';
import { Loader } from './common/Loader';
import { Card } from './common/Card';

const grammarTopics = [
    "Present Simple", "Present Continuous", "Past Simple", "Past Continuous",
    "Present Perfect", "Past Perfect", "Future Simple", "Articles (a, an, the)",
    "Prepositions of Place", "Prepositions of Time", "First Conditional",
    "Second Conditional", "Third Conditional", "Modal Verbs", "Reported Speech", "Passive Voice",
];

type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
};

const GrammarLessons: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quiz State
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizMode, setQuizMode] = useState<'idle' | 'active' | 'finished'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const handleTopicSelect = async (topic: string) => {
    if (isLoading && topic === selectedTopic) return;
    
    // Reset all states
    setSelectedTopic(topic);
    setIsLoading(true);
    setIsGeneratingQuiz(true);
    setExplanation('');
    setQuiz(null);
    setQuizMode('idle');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);

    const lessonResult = await getGrammarExplanation(topic);
    setExplanation(lessonResult);
    setIsLoading(false);

    const quizResult = await generateGrammarQuiz(topic);
    setQuiz(quizResult);
    setIsGeneratingQuiz(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || !quiz) return;
    
    setSelectedAnswer(index);
    const correct = index === quiz[currentQuestionIndex].correctAnswerIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizMode('finished');
    }
  };
  
  const resetQuiz = () => {
      setQuizMode('active');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
  }

  const renderQuizContent = () => {
    if (quizMode === 'finished') {
      return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h3>
          <p className="text-lg text-gray-300 mb-6">You scored <span className="text-blue-400 font-bold">{score}</span> out of <span className="font-bold">{quiz?.length}</span>.</p>
          <button onClick={resetQuiz} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors">
            Try Again
          </button>
        </div>
      );
    }

    if (quizMode === 'active' && quiz) {
      const question = quiz[currentQuestionIndex];
      return (
        <div className="p-4">
            <p className="text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {quiz.length}</p>
            <h4 className="text-lg font-semibold text-white mb-6">{question.question}</h4>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === question.correctAnswerIndex;
                    let buttonClass = "w-full text-left p-3 rounded-md transition-all border-2 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50";
                    if (isSelected) {
                        buttonClass = isCorrect ? `${buttonClass} bg-green-500/30 border-green-500` : `${buttonClass} bg-red-500/30 border-red-500`;
                    } else if (selectedAnswer !== null && isCorrectAnswer) {
                        buttonClass = `${buttonClass} bg-green-500/30 border-green-500`;
                    }
                    return (
                        <button key={index} onClick={() => handleAnswerSelect(index)} disabled={selectedAnswer !== null} className={buttonClass}>
                            {option}
                        </button>
                    );
                })}
            </div>
            {selectedAnswer !== null && (
                 <button onClick={handleNextQuestion} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-500 transition-colors">
                    {currentQuestionIndex < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                 </button>
            )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><AcademicCapIcon className="mr-2"/> Grammar Lessons & Quizzes</h2>
        <p className="text-gray-400 mb-6">Select a topic to study the lesson, then test your knowledge with an interactive quiz.</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]">
        <div className="md:col-span-1 md:border-r border-gray-700 md:pr-4">
            <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
            <ul className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                {grammarTopics.map(topic => (
                    <li key={topic}>
                        <button 
                            onClick={() => handleTopicSelect(topic)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${
                                selectedTopic === topic 
                                ? 'bg-blue-600 text-white font-semibold' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {topic}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        <div className="md:col-span-2">
             <h3 className="text-lg font-semibold text-white mb-4">
                {quizMode === 'idle' ? `Lesson: ${selectedTopic || "..."}` : `Quiz: ${selectedTopic}`}
             </h3>
             <div className="bg-gray-900/70 rounded-lg h-[55vh] overflow-y-auto border border-gray-700 relative">
                {quizMode !== 'idle' ? renderQuizContent() : (
                    <>
                      {isLoading && (
                          <div className="flex justify-center items-center h-full">
                              <Loader />
                              <p className="ml-3 text-gray-400">Generating lesson for "{selectedTopic}"...</p>
                          </div>
                      )}
                      {!isLoading && explanation && (
                          <div className="p-4">
                              <div 
                                  className="prose prose-invert prose-sm max-w-none" 
                                  dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} 
                              />
                          </div>
                      )}
                      {!isLoading && !explanation && (
                           <div className="flex justify-center items-center h-full">
                              <p className="text-gray-500 text-center">Select a topic from the left to start learning.</p>
                          </div>
                      )}
                      
                      {!isLoading && explanation && (
                        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex justify-center">
                            <button 
                                onClick={() => setQuizMode('active')} 
                                disabled={isGeneratingQuiz || !quiz}
                                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {isGeneratingQuiz ? <><Loader /><span className="ml-2">Generating Quiz...</span></> : "Start Quiz"}
                            </button>
                        </div>
                      )}
                    </>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default GrammarLessons;
