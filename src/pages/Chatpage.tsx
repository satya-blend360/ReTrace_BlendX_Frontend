

'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Send,
    Upload,
    FileText,
    TrendingUp,
    Clock,
    AlertTriangle,
    RefreshCw,
    BarChart3,
    Target,
    Sparkles,
    Package,
    X,
    Brain,
    Database,
    Lightbulb,
    Zap
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isStreaming?: boolean;
    isLoading?: boolean;
}

interface QuickQuestion {
    icon: React.ReactNode;
    title: string;
    question: string;
    description: string;
    category: string;
}

export default function InventoryAIChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋\n\nI'm your Inventory Intelligence Assistant. I can help you analyze stockouts, identify root causes, and optimize your reorder decisions.\n\nTry one of the suggested questions or ask me anything!",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const loadingStages = [
        { icon: <Brain className="w-4 h-4" />, text: "Processing your request...", color: "text-purple-600" },
        { icon: <Zap className="w-4 h-4" />, text: "Searching knowledge base...", color: "text-blue-600" },
        { icon: <BarChart3 className="w-4 h-4" />, text: "Analyzing patterns...", color: "text-emerald-600" },
        { icon: <Sparkles className="w-4 h-4" />, text: "Crafting response...", color: "text-amber-600" },
    ];

    // Cycle through loading stages
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingStage((prev) => (prev + 1) % loadingStages.length);
            }, 2000); // Change stage every 2 seconds
        } else {
            setLoadingStage(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);
    const quickQuestions: QuickQuestion[] = [
        {
            icon: <Search className="w-5 h-5" />,
            title: 'Root Cause Analysis',
            question: 'Why did ITEM_0005 stock out?',
            description: 'Deep-dive into the root cause of this stockout event',
            category: 'Analysis'
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: 'Recent Events',
            question: 'What caused the most recent stockout for ITEM_0012?',
            description: 'Analyze the latest stockout incident and contributing factors',
            category: 'Recent'
        },
        {
            icon: <AlertTriangle className="w-5 h-5" />,
            title: 'Failure Classification',
            question: 'Was the stockout for ITEM_0043 a decision or execution failure?',
            description: 'Determine if this was a system decision issue or execution problem',
            category: 'Classification'
        },
        {
            icon: <RefreshCw className="w-5 h-5" />,
            title: 'Reorder Status',
            question: 'Did the system try to reorder before ITEM_0007 ran out of stock?',
            description: 'Check if reorder triggers were activated in time',
            category: 'Status'
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            title: 'Trend Analysis',
            question: 'Show me all stockouts from the last 30 days',
            description: 'View comprehensive stockout patterns and trends',
            category: 'Trends'
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: 'Predictions',
            question: 'Which items are at risk of stocking out this week?',
            description: 'Proactive alerts for potential upcoming stockouts',
            category: 'Prediction'
        }
    ];

    //   const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    //   };

    //   useEffect(() => {
    //     scrollToBottom();
    //   }, [messages]);

    const prevMessageCount = useRef(messages.length);

    useEffect(() => {
        if (messages.length > prevMessageCount.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            prevMessageCount.current = messages.length;
        }
    }, [messages.length]);

    const sendMessageToAPI = async (message: string) => {
        try {
            console.log('Sending message to API:', { message, email: user?.email });

            const response = await fetch('https://n8n.demo.blend360.app/webhook/8287adab-e6d8-40f2-af4e-0cc26b6779b2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: message,
                    UserEmail: user?.email || 'Saisrisatya.Padala@blend360.com',
                })
            });

            console.log('API Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response data:', data);
            return data.output || 'No response received from the server.';
        } catch (error) {
            console.error('API Error Details:', error);
            if (error instanceof Error) {
                return `Error: ${error.message}. Please check the console for more details.`;
            }
            return 'Sorry, I encountered an error while processing your request. Please try again.';
        }
    };

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputValue.trim();

        if (!textToSend && !uploadedFile) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
            id: aiMessageId,
            text: '',
            sender: 'ai',
            timestamp: new Date(),
            isStreaming: true,
            isLoading: true
        };
        setMessages(prev => [...prev, aiMessage]);

        const aiResponse = await sendMessageToAPI(textToSend);

        // Remove loading state before streaming response
        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessageId
                    ? { ...msg, isLoading: false }
                    : msg
            )
        );

        let currentText = '';
        const words = aiResponse.split(' ');

        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId
                        ? { ...msg, text: currentText }
                        : msg
                )
            );
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
            )
        );

        setIsLoading(false);
        setUploadedFile(null);
    };

    const handleQuickQuestion = (question: string) => {
        handleSendMessage(question);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-[1600px] mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Left Sidebar - Quick Start Questions */}
                    <div className="lg:col-span-1 h-full">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 h-full flex flex-col">
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-2 mb-2">
                                    {/* <Sparkles className="w-5 h-5 text-indigo-600" /> */}
                                    <h2 className="text-lg font-bold text-slate-800">Quick Start Questions</h2>
                                </div>
                                <p className="text-sm text-slate-600 mb-6">
                                    Click any question to analyze your inventory data instantly
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                                {quickQuestions.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(item.question)}
                                        disabled={isLoading}
                                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-indigo-600 group-hover:text-indigo-700 mt-1 flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1">
                                                    {item.category}
                                                </span>
                                                <h3 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-indigo-700">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                                                <p className="text-xs text-slate-500 italic line-clamp-1">"{item.question}"</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex-shrink-0 mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-200">
                                {/* <p className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Pro Tip
                </p> */}
                                {/* <p className="text-xs text-slate-700">
                  You can upload CSV files or type custom queries for deeper analysis. The AI understands natural language!
                </p> */}
                            </div>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="lg:col-span-2 h-full">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-full flex flex-col">
                            {/* Chat Header */}
                            <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                                            <Package className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">Inventory Assistant 📦</h3>
                                            <p className="text-xs text-slate-600">AI-powered stockout analysis and recommendations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium text-green-700">AI Online</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3 text-xs flex-wrap">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                        Real-time streaming
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                        Send emails & notifications
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                        Persistent history
                                    </span>
                                </div>
                            </div>

                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                                                }`}
                                        >
                                            {message.isLoading ? (
                                                // Loading stages animation
                                                <div className="space-y-3 py-2">
                                                    {loadingStages.map((stage, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center gap-3 transition-all duration-500 ${index === loadingStage
                                                                ? 'opacity-100 scale-100'
                                                                : index < loadingStage
                                                                    ? 'opacity-40 scale-95'
                                                                    : 'opacity-20 scale-90'
                                                                }`}
                                                        >
                                                            <div className={`${stage.color} ${index === loadingStage ? 'animate-pulse' : ''}`}>
                                                                {stage.icon}
                                                            </div>
                                                            <span className={`text-sm font-medium ${stage.color}`}>
                                                                {stage.text}
                                                            </span>
                                                            {index === loadingStage && (
                                                                <div className="flex gap-1 ml-auto">
                                                                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                                </div>
                                                            )}
                                                            {index < loadingStage && (
                                                                <Zap className="w-3 h-3 ml-auto text-green-500" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                    {message.text.split("\n").map((line, i) => {
                                                        const match = line.match(/\*\*(.+?):\*\*(.*)/);

                                                        if (match) {
                                                            return (
                                                                <p key={i}>
                                                                    <strong>{match[1]}:</strong>
                                                                    {match[2]}
                                                                </p>
                                                            );
                                                        }

                                                        return <p key={i}>{line}</p>;
                                                    })}
                                                </div>
                                            )}


                                            <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area - Fixed at bottom */}
                            <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">


                                <div className="flex gap-2">



                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                        placeholder="Ask questions or select from suggestions"
                                        className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                                        disabled={isLoading}
                                    />

                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={isLoading || (!inputValue.trim() && !uploadedFile)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl flex-shrink-0"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="font-medium">Analyzing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span className="font-medium">Send</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style    >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}