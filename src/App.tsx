import { useState, useEffect, useRef } from "react";

import Card from "./atoms/Card";

import Chat from "./Chat";

import { Send } from 'lucide-react';
import Header from "./Header";

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  file: File;
}

const App = () => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your document assistant. Upload some documents and I'll help you find information from them.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:3000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 1, // or dynamic if needed
        question: userMessage.content,
      }),
    });

    if (!response.body) {
      throw new Error('Readable stream not found in response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let assistantContent = '';
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add a placeholder assistant message first
    setMessages((prev) => [...prev, assistantMessage]);

    const updateLastAssistantMessage = (partialText: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: partialText }
            : msg
        )
      );
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      assistantContent += chunk;

      updateLastAssistantMessage(assistantContent);
    }

  } catch (error) {
    console.error('Streaming error:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        type: 'assistant',
        content: 'An error occurred while processing your request.',
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="App h-dvh">
    <div className="h-dvh">
      
      <Card className="p-[0px] h-dvh">
      <div className="flex flex-col h-full font-mono">
        <Header
          documents={documents}
          setDocuments={setDocuments}
          setMessages={setMessages}
        />
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
        <Chat
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          />
        
        {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your documents..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                style={{
                  minHeight: '36px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="cursor-pointer px-4 py-3 bg-primary/70 text-text-primary rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        </div>

        </div>
        <div>

        </div>

      </div>
      </Card>
    </div>
    </div>
  );
}

export default App;