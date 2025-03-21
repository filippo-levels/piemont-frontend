import React, { useState, useRef, useEffect } from 'react';

interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Disciplinare Comune di Torino',
      date: new Date(2024, 2, 5),
      messages: [
        {
          id: '1-1',
          text: 'Ciao! Sono Lucy, l\'assistente virtuale per i disciplinari di gara. Come posso aiutarti con il disciplinare del Comune di Torino?',
          sender: 'bot',
          timestamp: new Date(2024, 2, 5, 10, 30)
        },
        {
          id: '1-2',
          text: 'Quali sono i criteri principali di valutazione?',
          sender: 'user',
          timestamp: new Date(2024, 2, 5, 10, 31)
        },
        {
          id: '1-3',
          text: 'I criteri principali di valutazione sono divisi in: Offerta Tecnica (70 punti) e Offerta Economica (30 punti). L\'offerta tecnica valuta principalmente la qualità dei materiali, le metodologie operative e le tempistiche di esecuzione.',
          sender: 'bot',
          timestamp: new Date(2024, 2, 5, 10, 31)
        }
      ]
    },
    {
      id: '2',
      title: 'Gara SMAT S.p.A.',
      date: new Date(2024, 2, 10),
      messages: [
        {
          id: '2-1',
          text: 'Ciao! Sono Lucy, l\'assistente virtuale per i disciplinari di gara. Come posso aiutarti con il disciplinare SMAT?',
          sender: 'bot',
          timestamp: new Date(2024, 2, 10, 14, 15)
        },
        {
          id: '2-2',
          text: 'Quali sono i requisiti di partecipazione?',
          sender: 'user',
          timestamp: new Date(2024, 2, 10, 14, 16)
        },
        {
          id: '2-3',
          text: 'Per partecipare alla gara SMAT è richiesta: Categoria SOA OG6 classifica IV, fatturato minimo annuo di € 5M negli ultimi 3 esercizi, e almeno 2 lavori analoghi negli ultimi 5 anni per un importo complessivo di € 3M.',
          sender: 'bot',
          timestamp: new Date(2024, 2, 10, 14, 16)
        }
      ]
    },
    {
      id: '3',
      title: 'Appalto Città Metropolitana',
      date: new Date(2024, 3, 1),
      messages: [
        {
          id: '3-1',
          text: 'Ciao! Sono Lucy, l\'assistente virtuale per i disciplinari di gara. Come posso aiutarti con l\'appalto della Città Metropolitana?',
          sender: 'bot',
          timestamp: new Date(2024, 3, 1, 9, 0)
        },
        {
          id: '3-2',
          text: 'Qual è la scadenza per la presentazione delle offerte?',
          sender: 'user',
          timestamp: new Date(2024, 3, 1, 9, 1)
        },
        {
          id: '3-3',
          text: 'La scadenza per la presentazione delle offerte è fissata per il 30/04/2024 alle ore 12:00. Le offerte devono essere caricate sulla piattaforma telematica indicata nel disciplinare.',
          sender: 'bot',
          timestamp: new Date(2024, 3, 1, 9, 1)
        }
      ]
    }
  ]);
  
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Set the first session as active by default
  useEffect(() => {
    if (chatSessions.length > 0 && !activeSession) {
      setActiveSession(chatSessions[0]);
    }
  }, [chatSessions, activeSession]);
  
  const handleSessionClick = (session: ChatSession) => {
    setActiveSession(session);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeSession || inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update the active session with the new message
    const updatedSessions = chatSessions.map(session => {
      if (session.id === activeSession.id) {
        return {
          ...session,
          messages: [...session.messages, userMessage]
        };
      }
      return session;
    });
    
    setChatSessions(updatedSessions);
    setActiveSession({
      ...activeSession,
      messages: [...activeSession.messages, userMessage]
    });
    
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "Sto analizzando il disciplinare di gara per te. Ci sono specifici criteri che ti interessano?",
        "Posso aiutarti a identificare i criteri di valutazione più importanti in questo disciplinare.",
        "Ho trovato diversi criteri simili in altri disciplinari che potrebbero esserti utili.",
        "Questo disciplinare ha una struttura standard per un appalto pubblico. Vuoi che ti evidenzi le parti più rilevanti?",
        "Basandomi sulla mia analisi, questo disciplinare richiede particolare attenzione ai requisiti tecnici.",
        "Ti consiglio di prestare attenzione alla sezione relativa ai criteri di valutazione dell'offerta tecnica."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Update the active session with the bot response
      const updatedSessionsWithBotResponse = chatSessions.map(session => {
        if (session.id === activeSession.id) {
          return {
            ...session,
            messages: [...session.messages, userMessage, botMessage]
          };
        }
        return session;
      });
      
      setChatSessions(updatedSessionsWithBotResponse);
      setActiveSession({
        ...activeSession,
        messages: [...activeSession.messages, userMessage, botMessage]
      });
      
      setIsTyping(false);
    }, 1500);
  };
  

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for session list
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Nuova chat ${chatSessions.length + 1}`,
      date: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          text: 'Ciao! Sono Lucy, l\'assistente virtuale per i disciplinari di gara. Come posso aiutarti oggi?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]
    };
    
    setChatSessions([...chatSessions, newSession]);
    setActiveSession(newSession);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex h-[600px]">
        {/* Sidebar with chat history */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-[#3dcab1] text-white">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Lucy
            </h2>
          </div>
          
          <div className="p-3">
            <button 
              onClick={handleNewChat}
              className="w-full py-2 px-4 bg-[#3dcab1] text-white rounded-md hover:bg-[#3dcab1]/90 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuova chat
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {chatSessions.map(session => (
              <div 
                key={session.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                  activeSession?.id === session.id ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-[#3dcab1] mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{session.title}</h3>
                    <p className="text-xs text-gray-500">{formatDate(session.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-2/3 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-gray-800">
              {activeSession ? activeSession.title : 'Seleziona una chat'}
            </h3>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {activeSession?.messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 border shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Scrivi un messaggio..."
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3dcab1]"
                disabled={!activeSession}
              />
              <button 
                type="submit"
                className="bg-[#3dcab1] text-white px-4 py-2 rounded-r-lg hover:bg-[#3dcab1]/90 transition-colors"
                disabled={!activeSession}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 