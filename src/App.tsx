import { useState, useEffect, useRef } from "react";

import Button from "./atoms/Button";
import Card from "./atoms/Card";

import Chat from "./Chat";

import { Send, Upload, File, X } from 'lucide-react';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

  const files = Array.from(e.target.files as FileList);
  if (files.length === 0) return;

  const file = files[0]; 

  const newFile: UploadedFile = {
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    file: file,
  };
  setDocuments((prev) => [...prev, newFile]);

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    alert(`File uploaded successfully: ${result.message}`);
  } catch (err) {
    console.error('Upload failed:', err);
  }
};


  const removeFile = (fileId: UploadedFile["id"]) => {
    setDocuments(prev => prev.filter(file => file.id !== fileId));
  };


  const formatFileSize = (bytes:number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        <div className="bg-secondary flex flex-col gap-2 justify-center">
        <div className="container mx-auto py-2 px-4 text-text-inverse font-mono flex flex-row items-center justify-between">
          <div className="bg-secondary text-text-inverse font-mono">
          <h1 className="text-2xl font-bold">Document Assistant</h1>
          <p className="text-sm">Ask questions about your uploaded documents</p>
          </div>
          <div className="text-text-primary font-semibold hover:text-text-inverse">
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              roundedBorder='half'
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="inline mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Uploaded Files */}
        {documents.length > 0 && (
          <div className="flex flex-row gap-1 mb-2 mx-2 items-center">
            <div className="flex flex-wrap gap-2">
              {documents.map(file => (
                <div key={file.id} className="flex items-center gap-2 bg-bg-tertiary text-text-primary px-3 py-1 rounded-full text-sm">
                  <File size={14} />
                  <span className="truncate max-w-32">{file.name}</span>
                  <span className="text-text-primary">({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="hover:bg-secondary hover:text-text-inverse  rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
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
                  minHeight: '48px',
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
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift+Enter for new line
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