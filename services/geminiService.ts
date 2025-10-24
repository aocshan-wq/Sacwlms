
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
    // API key must be obtained from environment variables.
    // A new client is created for each call to ensure the latest key is used,
    // which is a good practice for environments with dynamic keys.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey });
};

// Converts a File object to a base64 encoded string.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateChatResponse = async (prompt: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an English learning assistant. Keep your responses concise and helpful. User: ${prompt}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error in generateChatResponse:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const analyzeImage = async (imageFile: File, prompt: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error in analyzeImage:", error);
        return "Sorry, I couldn't analyze the image. Please try again.";
    }
};

export const assistWriting = async (text: string, mode: 'quick' | 'deep'): Promise<string> => {
    try {
        const ai = getAiClient();
        if (mode === 'deep') {
            const systemInstruction = "You are an expert English writing tutor. Provide a deep, comprehensive analysis of the following text. Cover grammar, style, tone, clarity, and suggest specific, actionable improvements with explanations. Structure your feedback in clear sections using Markdown.";
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: text,
                config: {
                    systemInstruction: systemInstruction,
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });
            return response.text;
        } else {
            const systemInstruction = "You are a helpful proofreader. Quickly review the following text for grammar, spelling, and punctuation errors. Provide a corrected version and a brief summary of the changes. Be concise.";
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                config: {
                    systemInstruction: systemInstruction
                }
            });
            return response.text;
        }
    } catch (error) {
        console.error("Error in assistWriting:", error);
        return "Sorry, an error occurred while analyzing your text.";
    }
};

export const analyzeReading = async (passage: string, question: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Based on the following passage, answer the user's question. If the answer isn't in the passage, say so.

Passage: "${passage}"

Question: "${question}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in analyzeReading:", error);
        return "Sorry, I couldn't process your question about the passage.";
    }
};


export const defineWord = async (word: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Act as a dictionary. For the word "${word}", provide:
1.  **Definition**: A clear and concise definition.
2.  **Example Sentence**: A sentence using the word correctly.
3.  **Synonyms**: A few common synonyms.
4.  **Antonyms**: A few common antonyms.
Format the response using Markdown.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in defineWord:", error);
        return `Sorry, I couldn't find a definition for "${word}".`;
    }
};

export const getGrammarExplanation = async (topic: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Act as an expert English grammar teacher. Provide a clear and comprehensive lesson on the topic: "${topic}".
The lesson should include:
1.  **Explanation**: A simple and clear explanation of the grammar rule.
2.  **Formation/Structure**: How to form sentences using the rule (if applicable).
3.  **Examples**: At least 3-5 clear example sentences.
4.  **Common Mistakes**: Point out common mistakes learners make.

Format the entire response using Markdown with headings, bold text, and lists for readability.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in getGrammarExplanation:", error);
        return `Sorry, I couldn't generate a lesson for "${topic}". Please try again.`;
    }
};


export const generateGrammarQuiz = async (topic: string): Promise<any> => {
    try {
        const ai = getAiClient();
        const prompt = `Generate a 3-question multiple-choice quiz about the English grammar topic: "${topic}". Each question must have exactly 4 options. Ensure the correctAnswerIndex is the zero-based index of the correct option in the options array.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING, description: "The quiz question." },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "An array of 4 possible answers."
                                    },
                                    correctAnswerIndex: { type: Type.INTEGER, description: "The 0-based index of the correct answer in the 'options' array." }
                                },
                                required: ['question', 'options', 'correctAnswerIndex']
                            }
                        }
                    },
                    required: ['questions']
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.questions;

    } catch (error) {
        console.error("Error in generateGrammarQuiz:", error);
        return null;
    }
};
