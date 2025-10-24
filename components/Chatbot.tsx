
import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon as AiIcon } from './common/Icons';
import { Loader } from './common/Loader';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I'm your AI English tutor. How can I help you practice today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const aiResponse = await generateChatResponse(userInput);
    setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl max-w-3xl mx-auto h-[75vh] flex flex-col animate-slide-fade-in">
        <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-center text-white">AI Conversation Practice</h2>
        </div>
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="p-2 bg-blue-500/20 rounded-full text-blue-400 mt-1"><AiIcon/></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="p-2 bg-gray-600/20 rounded-full text-gray-400 mt-1"><UserCircleIcon/></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="p-2 bg-blue-500/20 rounded-full text-blue-400 mt-1"><AiIcon/></div>
            <div className="max-w-md p-3 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
              <Loader />
              <span className="ml-2 text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-lg">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-transparent p-3 text-gray-200 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
