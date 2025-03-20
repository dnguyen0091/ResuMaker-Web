import { useEffect, useRef, useState } from 'react';
import '../../index.css';
import './chatTab.css'; // We'll create this file next
import './resumeBuilder.css';

export default function ChatTab({ onSuggestionAccept }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: 'Hello! I\'m ResuMaker Assistant. How can I help with your resume today?' 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    
    // Automatically scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };
    
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    const sendMessage = async () => {
        if (!inputValue.trim()) return;
        
        const userMessage = { role: 'user', content: inputValue.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        
        try {
            // This is where you'd typically call an API to get AI responses
            // For now, we'll simulate it with a timeout
            setTimeout(() => {
                let response;
                
                if (inputValue.toLowerCase().includes('experience')) {
                    response = { 
                        role: 'assistant', 
                        content: 'Here\'s a suggestion for your work experience:',
                        suggestions: [
                            {
                                title: 'Software Developer',
                                company: 'Tech Solutions Inc.',
                                date: 'Jan 2020 - Present',
                                description: '• Developed responsive web applications using React\n• Implemented RESTful APIs with Node.js and Express\n• Improved application performance by 30%'
                            }
                        ]
                    };
                } else if (inputValue.toLowerCase().includes('skills')) {
                    response = { 
                        role: 'assistant', 
                        content: 'Here are some technical skills you might want to include:',
                        suggestions: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Agile Methodology']
                    };
                } else {
                    response = { 
                        role: 'assistant', 
                        content: 'I can help you create a professional resume. You can ask me about formatting, content suggestions, or how to highlight your skills and experience effectively.'
                    };
                }
                
                setMessages(prev => [...prev, response]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            console.error('Error getting response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
            setIsTyping(false);
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        if (onSuggestionAccept) {
            onSuggestionAccept(suggestion);
        }
    };
    
    return (
        <div className={`chat-tab-container ${isOpen ? 'open' : ''}`}>
            <button 
                className="chat-tab-toggle"
                onClick={toggleChat}
                aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                )}
                <span>{isOpen ? 'Close' : 'ResuMaker Assistant'}</span>
            </button>
            
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>ResuMaker Assistant</h3>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                            >
                                <div className="message-content">
                                    <p>{message.content}</p>
                                    
                                    {message.suggestions && Array.isArray(message.suggestions) && (
                                        <div className="suggestion-list">
                                            {message.suggestions.map((sugg, i) => (
                                                <div 
                                                    key={i} 
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick(sugg)}
                                                >
                                                    {typeof sugg === 'object' ? (
                                                        <div className="experience-suggestion">
                                                            <div className="exp-header">
                                                                <strong>{sugg.title}</strong>
                                                                <span>{sugg.company}</span>
                                                                <em>{sugg.date}</em>
                                                            </div>
                                                            <p className="exp-description">{sugg.description}</p>
                                                        </div>
                                                    ) : (
                                                        sugg
                                                    )}
                                                    <button className="insert-btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M5 12h14"></path>
                                                            <path d="M12 5v14"></path>
                                                        </svg>
                                                        Insert
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="message assistant-message">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chat-input">
                        <textarea 
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask for resume writing help..."
                            rows={1}
                        />
                        <button 
                            className="send-button"
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}