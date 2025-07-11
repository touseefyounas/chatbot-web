export interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    }

export type Mode = 'chat' | 'web' | 'rag';