import React, { useState } from 'react';
import { Compass, Send } from 'lucide-react';
import { useGetAssetsQuery } from '../assets/assetsApiSlice.js';

const Chatbot = ({
  localMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isChatLoading,
  isSendingMessage,
  chatEndRef
}) => {
  const { data: assetsData } = useGetAssetsQuery();
  const assets = assetsData?.data?.assets || [];
  const [chatError, setChatError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChatError(null);

    // Format asset matrix into clean, compact background string token layout
    const assetContextString = assets?.map(a => 
      `- Category: ${a.category || a.assetType || ''}, Value: ₹${a.valueINR}, Location: ${a.physicalAddress || a.location?.address || 'Bengaluru, Karnataka'}, Description: ${a.description || ''}`
    ).join('\n') || 'No assets registered yet.';

    const systemInstruction = `You are the elite Zenith AI Venture Co-Pilot, an expert corporate and regulatory architect specializing in Indian entrepreneurship frameworks. 
Your explicit goal is to transform raw asset data lists into actionable execution plans and compliance roadmaps.

CRITICAL WORKSPACE CONTEXT:
The user currently has these registered venture footprints logged in their database ledger:
${assetContextString}

OPERATIONAL RULES:
1. Base your business structure, tax tier, and licensing advice strictly on these registered assets.
2. Map out step-by-step regulatory milestones specifically for Indian state laws (handling MSME Udyam registration, GSTIN thresholds, and FSSAI or shop establishment permissions where applicable).
3. Never break character or output raw developer configurations. Maintain our sharp, professional, high-utility editorial tone.`;

    const fullPayloadText = `${systemInstruction}\n\nUser Operational Query:\n${chatInput}`;

    try {
      await handleSendMessage(e, fullPayloadText);
    } catch (err) {
      console.error('[Chatbot submit caught error]', err);
      const errorText = err.data?.message || err.message || (typeof err === 'string' ? err : JSON.stringify(err));
      if (errorText.includes('429') || errorText.includes('RESOURCE_EXHAUSTED')) {
        setChatError("Zenith AI Co-Pilot is currently calibrating due to high request volumes. Please pause for 30 seconds before submitting your next operational query.");
      } else {
        setChatError(errorText);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col justify-between !bg-white/40 dark:!bg-[#1A1917]/40 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#222222] border-b-0 rounded-none shadow-sm transition-colors duration-200 overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-[#E5E5E5] dark:border-[#222222] bg-white/30 dark:bg-[#1A1917]/30 backdrop-blur-sm flex items-center justify-between shrink-0">
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
          <span className="text-[9px] bg-[#F4F0EA]/60 dark:bg-[#121110]/60 border border-[#E5E5E5] dark:border-[#222222] text-slate-500 dark:text-slate-400 rounded-none font-mono px-2 py-0.5 tracking-wider uppercase">Gemini-3.5-Flash</span>
        </div>
      </div>

      {/* Scrollable bubble list connecting real backend history */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 bg-transparent p-4 pt-6">
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
                  <div className={`max-w-xl p-4 rounded-none text-xs shadow-sm border whitespace-pre-wrap ${
                    isModel 
                      ? 'bg-[#F4F0EA]/80 dark:bg-[#121110]/80 backdrop-blur-xs border-[#E5E5E5] dark:border-[#222222] text-[#111111] dark:text-[#F5F5F5] font-sans leading-relaxed tracking-wide font-medium' 
                      : 'bg-[#161513]/90 dark:bg-[#2E2C29]/90 border-[#161513] dark:border-[#2E2C29] text-[#F5F5F5] leading-normal'
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
                <div className="max-w-xl p-4 rounded-none text-xs leading-relaxed font-sans bg-[#F4F0EA]/60 dark:bg-[#121110]/60 border border-[#E5E5E5] dark:border-[#222222] text-slate-400 dark:text-slate-500 font-semibold italic animate-pulse">
                  Consultant is compiling compliance frameworks...
                </div>
              </div>
            )}
            
            {/* Graceful human-readable Gemini error catching notification */}
            {chatError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-none font-mono text-xs mb-4">
                {chatError}
              </div>
            )}
            
            {/* Automatic scroll snap anchor point */}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input submission form */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white/30 dark:bg-[#121110]/30 backdrop-blur-sm border-t border-[#E5E5E5] dark:border-[#222222] flex gap-2 shrink-0 p-4 z-50 pt-2 pb-6 transition-colors duration-200">
        <input
          id="chat-input-field"
          type="text"
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value);
            if (chatError) setChatError(null); // Clear error on typing fresh messages
          }}
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
