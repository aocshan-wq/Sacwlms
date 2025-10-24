
import React, { useState } from 'react';
import { assistWriting } from '../services/geminiService';
import { PencilSquareIcon, SparklesIcon } from './common/Icons';
import { Loader } from './common/Loader';
import { Card } from './common/Card';

type AnalysisMode = 'quick' | 'deep';

const WritingAssistant: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>('quick');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setFeedback('');
    const result = await assistWriting(text, mode);
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <Card>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><PencilSquareIcon className="mr-2"/> Writing Assistant</h2>
            <p className="text-gray-400 mb-6">Write or paste your text below. Choose "Quick Check" for fast proofreading or "Deep Analysis" for comprehensive feedback using Gemini's advanced thinking mode.</p>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start writing here..."
                    className="w-full h-80 bg-gray-900/70 border border-gray-700 rounded-md p-4 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex bg-gray-700 p-1 rounded-lg mb-4 sm:mb-0">
                        <button
                            onClick={() => setMode('quick')}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'quick' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Quick Check
                        </button>
                        <button
                            onClick={() => setMode('deep')}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'deep' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Deep Analysis (Pro)
                        </button>
                    </div>
                     <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !text.trim()}
                        className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {isLoading ? <Loader /> : <SparklesIcon className="mr-2"/>}
                        {isLoading ? `Analyzing...` : `Analyze Text`}
                    </button>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Feedback</h3>
                <div className="bg-gray-900/70 rounded-lg p-4 h-[400px] overflow-y-auto border border-gray-700">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <Loader />
                            <p className="ml-2 text-gray-400">Generating feedback... {mode === 'deep' && '(This may take a moment)'}</p>
                        </div>
                    )}
                    {feedback ? (
                        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
                    ) : (
                       !isLoading && <p className="text-gray-500 text-center pt-16">Your feedback will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    </Card>
  );
};

export default WritingAssistant;
