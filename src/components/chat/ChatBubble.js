import BotImg from 'assets/images/bot.png';
import UserImg from 'assets/images/user.png';

export default function ChatBubble(props) {

  return (
    <div className={`p-3 rounded-lg ${props.from==='bot' ? 'col-start-1 col-end-8' : 'col-start-6 col-end-13'}`}>
      <div className={`flex items-start ${props.from==='bot' ? 'flex-row' : 'justify-start flex-row-reverse'}`}>
        <div
          className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
        >
          <img alt='chat icon' src={props.from==='bot' ? BotImg : UserImg} />
        </div>
        <div>
          <div
            className={`relative text-sm py-2 px-4 shadow rounded-xl ${props.from==='bot' ? 'ml-3 bg-white' : 'mr-3 bg-indigo-100'}`}
          >
            {props.type==='text' ? (<div>{props.value}</div>) : (<img alt='' src={props.value}></img>)}
            
          </div>
          {(props.from==='bot' && props.confidence && props.intent) ?
            (<div
              className="relative text-xs tracking-wider leading-loose py-2 px-4 text-gray-500"
            >
              Intent: <b>{props.intent}</b>
              <br/>
              Confidence: <b>{Math.trunc(props.confidence*10000)/10000}</b>
            </div>) : ''}
        </div>
        
      </div>
    </div>
  );
}