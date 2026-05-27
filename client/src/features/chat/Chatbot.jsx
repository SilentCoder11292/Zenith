import React from 'react';
import { Compass, Send } from 'lucide-react';

const Chatbot = ({
  localMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isChatLoading,
  isSendingMessage,
  chatEndRef
}) => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col justify-between bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] border-b-0 rounded-none shadow-sm transition-colors duration-200 overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-[#E5E5E5] dark:border-[#222222] bg-white/70 dark:bg-[#1A1917]/70 backdrop-blur flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-none bg-[#8C6D47] flex items-center justify-center text-[#F4F0EA] shadow-sm">
            <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#111111] dark:text-[#F5F5F5]">AI Venture Consultant</h3>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block leading-none">Online • Context-Aware Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] bg-[#F4F0EA] dark:bg-[#121110] border border-[#E5E5E5] dark:border-[#222222] text-slate-500 dark:text-slate-400 rounded-none font-mono px-2 py-0.5 tracking-wider uppercase">Gemini-3.5-Flash</span>
        </div>
      </div>

      {/* Scrollable bubble list connecting real backend history */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 bg-white dark:bg-[#1A1917] p-4 pt-6">
        {isChatLoading ? (
          <div className="h-full flex items-center justify-center text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider animate-pulse">
            Syncing Conversational Log...
          </div>
        ) : (
          <>
            {localMessages.map((msg, index) => {
              const isModel = msg.role === 'model';
              return (
                <div 
                  key={msg._id || index} 
                  className={`flex items-start gap-2.5 ${isModel ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow-sm ${
                    isModel 
                      ? 'bg-[#8C6D47] text-[#F4F0EA]' 
                      : 'bg-[#161513] dark:bg-[#F4F0EA] text-[#F4F0EA] dark:text-[#161513]'
                  }`}>
                    {isModel ? 'AI' : 'U'}
                  </div>
                  <div className={`max-w-xl p-3 rounded-none text-xs leading-normal shadow-sm border whitespace-pre-wrap ${
                    isModel 
                      ? 'bg-[#F4F0EA] dark:bg-[#121110] border-[#E5E5E5] dark:border-[#222222] text-[#111111] dark:text-[#F5F5F5]' 
                      : 'bg-[#161513] dark:bg-[#2E2C29] border-[#161513] dark:border-[#2E2C29] text-[#F5F5F5]'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
            
            {/* Thinking status bubble overlay */}
            {isSendingMessage && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-none bg-[#8C6D47] text-[#F4F0EA] flex items-center justify-center text-[10px] font-mono font-bold shrink-0 animate-bounce">
                  AI
                </div>
                <div className="max-w-xl p-3 rounded-none text-xs leading-normal bg-[#F4F0EA] dark:bg-[#121110] border border-[#E5E5E5] dark:border-[#222222] text-slate-400 dark:text-slate-500 font-semibold italic animate-pulse">
                  Consultant is compiling compliance frameworks...
                </div>
              </div>
            )}
            
            {/* Automatic scroll snap anchor point */}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input submission form */}
      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-[#FBFBFB] dark:bg-[#121110] border-t border-[#E5E5E5] dark:border-[#222222] flex gap-2 shrink-0 p-4 z-50 pt-2 pb-6 transition-colors duration-200">
        <input
          id="chat-input-field"
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask our AI Consultant about MSME, GSTIN, FSSAI, or BIS regulatory requirements..."
          className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] outline-none"
          disabled={isSendingMessage}
        />
        <button 
          type="submit"
          className="w-10 h-10 bg-[#161513] dark:bg-[#F4F0EA] text-white dark:text-[#111111] flex items-center justify-center shrink-0 rounded-none hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white transition-all shadow cursor-pointer"
          disabled={isSendingMessage}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
