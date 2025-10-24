
import React, { useState } from 'react';
import { defineWord } from '../services/geminiService';
import { SparklesIcon } from './common/Icons';
import { Loader } from './common/Loader';
import { Card } from './common/Card';

const VocabularyBuilder: React.FC = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDefineWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    setIsLoading(true);
    setDefinition('');
    const result = await defineWord(word);
    setDefinition(result);
    setIsLoading(false);
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><SparklesIcon className="mr-2"/> Vocabulary Builder</h2>
        <p className="text-gray-400 mb-6">Enter a word to get its definition, an example sentence, synonyms, and antonyms.</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleDefineWord} className="max-w-xl mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a word..."
              className="w-full bg-gray-700 border border-gray-600 rounded-l-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !word.trim()}
              className="px-6 py-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Define
            </button>
          </div>
        </form>
        <div className="mt-6 max-w-xl mx-auto bg-gray-800/50 rounded-lg p-6 min-h-[200px] border border-gray-700">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader />
              <p className="ml-2 text-gray-400">Looking up "{word}"...</p>
            </div>
          ) : definition ? (
            <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: definition.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-gray-500 text-center pt-16">The definition will appear here.</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VocabularyBuilder;
