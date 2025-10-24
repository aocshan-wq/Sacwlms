
import React, { useState } from 'react';
import { analyzeReading } from '../services/geminiService';
import { BookOpenIcon, QuestionMarkCircleIcon } from './common/Icons';
import { Loader } from './common/Loader';
import { Card } from './common/Card';

const samplePassage = `The Industrial Revolution, which began in Great Britain in the late 18th century, was a period of major industrialization that saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads. This period of transition had a profound effect on the social, economic, and cultural conditions of the time. The shift from a manual labor-based economy to one dominated by industry and machine manufacturing led to a massive migration of people from rural areas to urban centers, creating new social classes and challenges. While it brought about unprecedented growth in wealth and population, it also resulted in difficult working conditions and crowded living situations for many.`;

const ReadingComprehension: React.FC = () => {
  const [passage] = useState(samplePassage);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    setAnswer('');
    const result = await analyzeReading(passage, question);
    setAnswer(result);
    setIsLoading(false);
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><BookOpenIcon className="mr-2"/> Reading Comprehension</h2>
        <p className="text-gray-400 mb-6">Read the passage below, then ask a question to test your understanding. The AI will answer based on the text.</p>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Passage</h3>
          <div className="bg-gray-800/50 rounded-lg p-4 h-[300px] overflow-y-auto border border-gray-700">
            <p className="text-gray-300 leading-relaxed">{passage}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Ask a Question</h3>
          <form onSubmit={handleAskQuestion}>
            <div className="flex items-center bg-gray-700 rounded-lg">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Where did the Industrial Revolution begin?"
                className="w-full bg-transparent p-3 text-gray-200 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="p-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <QuestionMarkCircleIcon/>
              </button>
            </div>
          </form>
          <div className="mt-4 bg-gray-900/70 rounded-lg p-4 h-[236px] overflow-y-auto border border-gray-700">
            {isLoading && (
              <div className="flex items-center">
                <Loader />
                <p className="ml-2 text-gray-400">Finding the answer...</p>
              </div>
            )}
            {answer ? (
              <p className="text-gray-300">{answer}</p>
            ) : (
              !isLoading && <p className="text-gray-500">The answer will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReadingComprehension;
