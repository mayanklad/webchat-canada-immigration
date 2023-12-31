import './chat.css';
import React, { useState } from 'react';
import axios from 'axios';
import ChatBubble from 'components/chat/ChatBubble';

function Chat() { 
  
  const URL = 'http://localhost:5005/webhooks/rest/webhook';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleKeyDownInput = (event) => {
    if (event.key === 'Enter' && input !== '') {
      const sendBtn = document.getElementById('btn-send');
      sendBtn.click();
    }
  };

  const handleSendMessage = () => {
    if (input !== '') {
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
              if (i+1 < response.data.length && response.data[i+1]['custom']['response_selector']['default']['response']) {
                let metric = response.data[i+1]['custom']['response_selector']['default']['response'];
                setMessages(messages => [...messages, {from: 'bot', type: 'text', value: response.data[i]['text'], confidence: metric['confidence'], intent: metric['intent_response_key']}]);
              }
              else {
                setMessages(messages => [...messages, {from: 'bot', type: 'text', value: response.data[i]['text']}]);
              }
            }
            else if (response.data[i]['image']) {
              if (i+1 < response.data.length && response.data[i+1]['custom']['response_selector']['default']['response']) {
                let metric = response.data[i+1]['custom']['response_selector']['default']['response'];
                setMessages(messages => [...messages, {from: 'bot', type: 'imageURL', value: response.data[i]['image'], confidence: metric['confidence'], intent: metric['intent_response_key']}]);
              }
              else {
                setMessages(messages => [...messages, {from: 'bot', type: 'imageURL', value: response.data[i]['image']}]);
              }
            }
          }

          console.log('Bot utter:', response.data);

          // Clear the input field
          setInput('');
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  return (
    <div id='chat-container' className='chat-container flex h-screen antialiased text-gray-800'>
      <div className='flex flex-row h-full w-full overflow-x-hidden'>
        <div className='flex flex-col flex-auto h-full p-6'>
          <div
            className='flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4'
          >
            <div className='flex flex-col h-full overflow-y-auto mb-4'>
              <div className='flex flex-col h-full'>
                <div id='chat-window' className='chat-window grid grid-cols-12 gap-y-2'>
                  {messages.map((message, index) => {
                    return (
                      <ChatBubble key={index} from={message.from} type={message.type} value={message.value} confidence={message.confidence} intent={message.intent}></ChatBubble>
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
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDownInput}
                    placeholder='Type your message...'
                    className='flex w-full border rounded-xl focus:outline-sky-500 focus:bg-transparent hover:bg-gray-100 pl-4 h-10'
                  />
                </div>
              </div>
              <div className='ml-4'>
                <button
                  id='btn-send'
                  className={`btn-send h-10 px-4 flex items-center justify-center overflow-hidden text-white font-medium rounded-full from-cyan-400 to-blue-400 bg-gradient-to-r ${input === '' ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-blue-500'}`}
                  onClick={handleSendMessage}
                >
                  <span
                    className='flex items-center justify-center h-full'
                  >
                    <span>Send</span>
                    <span className='ml-2 relative'>
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