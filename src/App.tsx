import { useState, useEffect, useRef } from "react";

import type { Message } from "./types";

import Card from "./atoms/Card";

import Chat from "./Chat";
import Header from "./Header";
import ChatBox from "./ChatBox";
import Init from "./Init";

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  file: File;
}

const App = () => {

  const [sessionId, setSessionId] = useState<string>('');
  const [ validSession, setValidSession ] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your document assistant. Upload some documents and I'll help you find information from them.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="App h-dvh">
    <div className="h-dvh">
      { !validSession ?
      <Init 
      setSessionId={setSessionId} 
      sessionId={sessionId}
      setValidSession={setValidSession} 
      />
      :
      <Card className="p-[0px] h-dvh">
      <div className="flex flex-col h-full font-mono">
        <Header
          documents={documents}
          setDocuments={setDocuments}
          setMessages={setMessages}
          sessionId={sessionId}
        />
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
        <Chat
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          />
        
        {/* Input Area */}
        <ChatBox
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMessages={setMessages}
        />

        </div>
        <div>

        </div>

      </div>
      </Card>
      }
    </div>
    </div>
  );
}

export default App;