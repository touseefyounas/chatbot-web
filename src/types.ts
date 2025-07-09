export interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    }