import type { Message } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseMessageHistory = (history: any[]): Message[] =>{
    return history.map((msg, index) => {
       const roleType = msg.id[2];
       return {
        id: index,
        type: roleType === 'HumanMessage' ? 'user' : 'assistant',
        content: msg.kwargs?.content || '',
        timestamp: new Date()
       }
    });
}