import React from 'react';
import { Search, PenSquare, MoreHorizontal } from 'lucide-react';
import NewMessageUI from './NewMessageUI';
import { useUIStore } from '../store/uiStore';

interface Message {
  id: number;
  title: string;
  sender: string;
  time: string;
  preview: string;
  read: boolean;
  folder: number;
}

interface ListBrowserProps {
  messages: Message[];
  selectedMessage: Message | null;
  onSelectMessage: (message: Message) => void;
  isHidden: boolean;
  folder: {
    id: number;
    name: string;
    icon: React.ReactNode;
    count: number;
  };
}

const ListBrowser: React.FC<ListBrowserProps> = ({
  messages,
  selectedMessage,
  onSelectMessage,
  isHidden,
  folder,
}) => {
  const { isNewMessageOpen, setNewMessageOpen } = useUIStore();

  return (
    <div
      className={`
        w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 flex flex-col
        transition-all duration-300 ease-in-out
        ${isHidden ? 'hidden' : 'flex'}
      `}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <span className="mr-2 text-gray-500 dark:text-gray-400">{folder.icon}</span>
            {folder.name}
          </h2>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setNewMessageOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              title="New Message"
              aria-label="Compose new message"
            >
              <PenSquare size={16} />
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder={`Search in ${folder.name.toLowerCase()}`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map(message => (
              <li key={message.id}>
                <button
                  onClick={() => onSelectMessage(message)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none transition duration-150 ease-in-out ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-medium ${message.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-semibold'}`}>
                      {message.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{message.sender}</p>
                  <p className={`text-xs truncate ${message.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {message.preview}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">No messages in {folder.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Messages that appear in {folder.name.toLowerCase()} will show up here.
            </p>
          </div>
        )}
      </div>

      {isNewMessageOpen && (
        <NewMessageUI onClose={() => setNewMessageOpen(false)} />
      )}
    </div>
  );
};

export default ListBrowser;