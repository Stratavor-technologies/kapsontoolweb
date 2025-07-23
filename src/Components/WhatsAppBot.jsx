import React, { useState } from 'react';

const WhatsAppBot = () => {
    const [name, setName] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! 👋 I'm your AI assistant. What's your name?", isBot: true }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            // Add user's name to messages
            setMessages(prev => [...prev, { text: name, isBot: false }]);
            
            // Add bot's response
            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    text: `Nice to meet you, ${name}! Let me redirect you to WhatsApp to continue our conversation.`, 
                    isBot: true 
                }]);
                
                // Redirect to WhatsApp after 2 seconds
                setTimeout(() => {
                    const whatsappNumber = "9888788888";
                    const message = encodeURIComponent(`Hello ${name}! Thanks for connecting with us.`);
                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                    setShowChat(false);
                }, 2000);
            }, 1000);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {showChat ? (
                <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-green-500 p-4 text-white relative">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 19.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">WhatsApp Assistant</h3>
                                <p className="text-sm opacity-90">Online</p>
                            </div>
                        </div>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowChat(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.isBot
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-green-500 text-white'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Type your name..."
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setShowChat(true)}
                    className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 19.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default WhatsAppBot; 