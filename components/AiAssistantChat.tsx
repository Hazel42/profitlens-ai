import React, { useState, useEffect, useRef } from 'react';
import { useProfitLensData } from '../hooks/useProfitLensData';
import { startAiChat, sendMessageToAiChatStream } from '../services/geminiService';
import { ChatBubbleSparkleIcon } from './icons/ChatBubbleSparkleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { CloseIcon } from './icons/CloseIcon';

type Message = {
  author: 'user' | 'ai';
  content: string;
};

const AiAssistantChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const data = useProfitLensData();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && !isInitialized) {
            const initialize = async () => {
                setIsLoading(true);
                setMessages([{ author: 'ai', content: 'Menginisialisasi Asisten AI...' }]);
                try {
                    await startAiChat(data.menuItems, data.ingredients, data.salesHistory, data.operationalCosts);
                    setMessages([{ author: 'ai', content: "Halo! Saya Asisten ProfitLens. Apa yang bisa saya bantu analisis hari ini?" }]);
                    setIsInitialized(true);
                } catch (error) {
                    console.error("Gagal menginisialisasi AI Chat:", error);
                    setMessages([{ author: 'ai', content: "Maaf, saya tidak dapat terhubung ke layanan AI. Silakan coba lagi nanti." }]);
                } finally {
                    setIsLoading(false);
                }
            };
            initialize();
        }
    }, [isOpen, isInitialized, data]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading || !isInitialized) return;
        
        const userMessage: Message = { author: 'user', content: input };
        setMessages(prev => [...prev, userMessage, { author: 'ai', content: '' }]);
        setInput('');
        setIsLoading(true);
        
        try {
            const stream = await sendMessageToAiChatStream(userMessage.content);
            
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullText;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Gagal mengirim pesan ke AI:", error);
            const errorMessage: Message = { author: 'ai', content: "Maaf, terjadi kesalahan. Silakan coba lagi." };
             setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = errorMessage;
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (content: string) => {
        if (content === '') {
            return (
                <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
            )
        }
        const formatted = content
            .split('\n')
            .map(line => {
                if (line.startsWith('### ')) return `<h3 class="text-lg font-bold text-brand-secondary mt-2 mb-1">${line.substring(4)}</h3>`;
                if (line.startsWith('* ')) return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
                return `<p class="mb-1">${line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')}</p>`;
            })
            .join('');
        return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-dark text-white rounded-full p-4 shadow-2xl transition-transform transform hover:scale-110 z-50"
                aria-label="Buka Asisten AI"
            >
                <ChatBubbleSparkleIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-in-bottom-right">
                    <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-white">Asisten ProfitLens</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto chat-messages">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl ${msg.author === 'user' ? 'bg-brand-secondary text-white' : 'bg-gray-700 text-gray-200'}`}>
                                        {renderMessageContent(msg.content)}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>
                    <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Tanyakan sesuatu..."
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                                disabled={isLoading || !isInitialized}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !isInitialized}
                                className="bg-brand-primary hover:bg-brand-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-3"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default AiAssistantChat;
