import { useState } from 'react';
import { Message, ChatData, PERSONA_AVATARS } from '../utils/constants';

export function useChatManagement() {
  const [chats, setChats] = useState<ChatData>({});
  const [currentChatName, setCurrentChatName] = useState<string | null>(null);
  const [editChatName, setEditChatName] = useState<string | null>(null);

  const newChat = (currentPersona: 'Ancestra' | 'The Guardian', messages: Message[], setMessages: (messages: Message[]) => void, setCurrentPath: (path: string) => void) => {
    if (currentChatName && messages.length > 1) {
      setChats(prev => ({ ...prev, [currentChatName]: messages }));
    }
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newChatName = `Chat ${timestamp}`;
    setCurrentChatName(newChatName);
    
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: currentPersona === 'Ancestra' 
        ? "🌺 Welcome to Ancestra! I'm your heritage tourism guide for St. Kitts and Nevis. Ask me about sites, food, history, culture, and attractions!"
        : "🛡️ Welcome to The Guardian! I'm here to provide you with essential safety information and tips for a secure visit to St. Kitts and Nevis.",
      sender: 'bot',
      timestamp: new Date(),
      avatar: PERSONA_AVATARS[currentPersona].icon
    };
    setMessages([welcomeMessage]);
    setCurrentPath('Homepage > Chat');
  };

  const loadChat = (chatName: string, messages: Message[], setMessages: (messages: Message[]) => void) => {
    if (currentChatName && messages.length > 1) {
      setChats(prev => ({ ...prev, [currentChatName]: messages }));
    }
    setMessages(chats[chatName] || []);
    setCurrentChatName(chatName);
  };

  const deleteChat = (chatName: string, currentPersona: 'Ancestra' | 'The Guardian', messages: Message[], setMessages: (messages: Message[]) => void, setCurrentPath: (path: string) => void) => {
    const newChats = { ...chats };
    delete newChats[chatName];
    setChats(newChats);
    if (currentChatName === chatName) {
      newChat(currentPersona, messages, setMessages, setCurrentPath);
    }
  };

  const renameChatName = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      const newChats = { ...chats };
      if (chats[oldName]) {
        newChats[newName] = chats[oldName];
        delete newChats[oldName];
      }
      setChats(newChats);
      if (currentChatName === oldName) {
        setCurrentChatName(newName);
      }
    }
    setEditChatName(null);
  };

  return {
    chats,
    currentChatName,
    editChatName,
    setEditChatName,
    newChat,
    loadChat,
    deleteChat,
    renameChatName
  };
}