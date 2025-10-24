
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { PhotoIcon, SparklesIcon, DocumentArrowUpIcon } from './common/Icons';
import { Loader } from './common/Loader';
import { Card } from './common/Card';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail. What vocabulary words can I learn from it?');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !prompt.trim()) {
        setError('Please select an image and provide a prompt.');
        return;
    };
    setError('');
    setIsLoading(true);
    setAnalysis('');
    const result = await analyzeImage(imageFile, prompt);
    setAnalysis(result);
    setIsLoading(false);
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
     if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis('');
    }
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  return (
    <Card>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><PhotoIcon className="mr-2"/> Image Analyzer</h2>
            <p className="text-gray-400 mb-6">Upload a photo to build vocabulary and practice describing what you see. The AI will analyze the image based on your prompt.</p>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <div 
                    onDrop={onDrop} 
                    onDragOver={onDragOver}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-800/50"
                >
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer w-full flex flex-col items-center">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="max-h-60 rounded-lg object-contain mb-4" />
                        ) : (
                            <div className="mb-4 text-gray-500"><DocumentArrowUpIcon className="w-12 h-12 mx-auto"/></div>
                        )}
                        <span className="text-blue-400 font-semibold">{previewUrl ? 'Change Image' : 'Click to upload or drag and drop'}</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 4MB)</p>
                    </label>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                
                <div className="mt-4">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Prompt</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., Describe this image for a beginner English learner."
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !imageFile}
                    className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {isLoading ? <Loader /> : <SparklesIcon className="mr-2"/>}
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                <div className="bg-gray-900/70 rounded-lg p-4 h-[400px] overflow-y-auto border border-gray-700">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <Loader />
                            <p className="ml-2 text-gray-400">Generating analysis...</p>
                        </div>
                    )}
                    {analysis ? (
                        <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
                    ) : (
                       !isLoading && <p className="text-gray-500 text-center pt-16">The analysis will appear here once you upload an image and click "Analyze".</p>
                    )}
                </div>
            </div>
        </div>
    </Card>
  );
};

export default ImageAnalyzer;
