import './chat.css';
import React, { useState } from 'react';
import axios from 'axios';
import ChatBubble from 'components/chat/ChatBubble';

function Chat() { 
  
  const URL = 'http://localhost:5005/webhooks/rest/webhook';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    setMessages(messages => [...messages, {from: 'user', type: 'text', value: input}]);
    
    try {
      axios.post(URL, {
        sender: 'user1',
        message: input
      })
      .then((response) => {
        console.log('User utter:', input);

        for(let i=0; i < response.data.length; i++){
          if (response.data[i]['text']) {
            setMessages(messages => [...messages, {from: 'bot', type: 'text', value: response.data[i]['text']}]);
          }
          else if (response.data[i]['image']) {
            setMessages(messages => [...messages, {from: 'bot', type: 'imageURL', value: response.data[i]['image']}]);
          }
        }

        console.log('Bot utter:', response.data);

        // Clear the input field
        setInput('');
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

  };
  
  return (
    <div id='chat-container' className='chat-container flex h-screen antialiased text-gray-800'>
      <div className='flex flex-row h-full w-full overflow-x-hidden'>
        <div className='flex flex-col flex-auto h-full p-6'>
          <div
            className='flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4'
          >
            <div className='flex flex-col h-full overflow-x-auto mb-4'>
              <div className='flex flex-col h-full'>
                <div id='chat-window' className='chat-window grid grid-cols-12 gap-y-2'>
                  {messages.map((message, index) => {
                    return (
                      <ChatBubble key={index} from={message.from} type={message.type} value={message.value}></ChatBubble>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div
              className='flex flex-row items-center h-16 rounded-xl bg-white w-full px-4'
            >
              <div className='flex-grow'>
                <div className='relative w-full'>
                  <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Type your message...'
                    className='flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10'
                  />
                </div>
              </div>
              <div className='ml-4'>
                <button
                  className='flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0'
                  onClick={handleSendMessage}
                >
                  <span>Send</span>
                  <span className='ml-2'>
                    <svg
                      className='w-4 h-4 transform rotate-45 -mt-px'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
  
export default Chat;