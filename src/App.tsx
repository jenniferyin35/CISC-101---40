import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Mail, 
  Users, 
  MessageSquare, 
  Info, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  Layout,
  Type as TypeIcon,
  Image as ImageIcon,
  MousePointer2,
  Send,
  User,
  Bot
} from "lucide-react";
import { processCampaignInput, CampaignState, CampaignResponse } from "./services/geminiService";

interface Message {
  role: "user" | "bot";
  content: string;
  campaign?: CampaignResponse["campaign"];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I am your Campaign Buddy. What would you like help with today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<CampaignState>({
    campaignType: "",
    targetAudience: "",
    tone: "",
    productInfo: ""
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await processCampaignInput(userMessage, state);
      
      setState(response.updatedState);
      
      const botMessage: Message = {
        role: "bot",
        content: response.message,
        campaign: response.campaign
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "I'm sorry, I encountered an error. Could you please try again?" }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: "bot", content: "Hello! I am your Campaign Buddy. What would you like help with today?" }]);
    setState({
      campaignType: "",
      targetAudience: "",
      tone: "",
      productInfo: ""
    });
    setInput("");
  };

  const isFieldComplete = (val: string) => val && val.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Campaign Buddy</h1>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-0 lg:p-6 overflow-hidden">
        
        {/* Progress Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 py-6">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sticky top-24 space-y-6">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#888]">Campaign Progress</h3>
            <div className="space-y-4">
              {[
                { label: "Type", val: state.campaignType, icon: Mail },
                { label: "Audience", val: state.targetAudience, icon: Users },
                { label: "Tone", val: state.tone, icon: MessageSquare },
                { label: "Product", val: state.productInfo, icon: Info },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isFieldComplete(item.val) ? "bg-green-500 border-green-500 text-white" : "bg-white border-[#e5e5e5] text-[#ccc]"}`}>
                    {isFieldComplete(item.val) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <item.icon className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#aaa]">{item.label}</p>
                    <p className={`text-xs truncate ${isFieldComplete(item.val) ? "text-[#1a1a1a] font-medium" : "text-[#ccc] italic"}`}>
                      {isFieldComplete(item.val) ? item.val : "Pending..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-9 flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)] bg-white lg:rounded-3xl lg:border lg:border-[#e5e5e5] shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-[#1a1a1a] text-white" : "bg-[#f0f0f0] text-[#666]"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#1a1a1a] text-white rounded-tr-none" : "bg-[#f0f0f0] text-[#1a1a1a] rounded-tl-none"}`}>
                        {msg.content}
                      </div>
                      
                      {msg.campaign && msg.campaign.subjectLines && msg.campaign.subjectLines.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-md mt-4"
                        >
                          <div className="p-6 border-b border-[#f5f5f5] bg-[#fafafa] flex items-center justify-between">
                            <h3 className="text-md font-semibold tracking-tight flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              Final Campaign
                            </h3>
                          </div>
                          <div className="p-6 space-y-8">
                            <section className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest font-bold text-[#888] flex items-center gap-2">
                                <TypeIcon className="w-3 h-3" /> Subject Lines
                              </div>
                              <div className="space-y-2">
                                {msg.campaign.subjectLines.map((line, i) => (
                                  <div key={i} className="p-3 bg-[#f9f9f9] border border-[#eee] rounded-xl text-xs font-medium">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </section>

                            <section className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest font-bold text-[#888] flex items-center gap-2">
                                <Layout className="w-3 h-3" /> Preview Text
                              </div>
                              <p className="text-xs italic text-[#444] p-3 bg-[#f9f9f9] border border-[#eee] rounded-xl">
                                "{msg.campaign.previewText}"
                              </p>
                            </section>

                            <section className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest font-bold text-[#888] flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email Body
                              </div>
                              <div className="p-4 bg-white border border-[#e5e5e5] rounded-xl text-xs leading-relaxed text-[#333] whitespace-pre-wrap font-serif">
                                {msg.campaign.emailBody}
                              </div>
                            </section>

                            <section className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest font-bold text-[#888] flex items-center gap-2">
                                <MousePointer2 className="w-3 h-3" /> Call to Action
                              </div>
                              <div className="inline-block px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-xs font-medium">
                                {msg.campaign.callToAction}
                              </div>
                            </section>

                            <section className="space-y-3">
                              <div className="text-[10px] uppercase tracking-widest font-bold text-[#888] flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Supporting Visuals
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {msg.campaign.supportingVisuals.map((visual, i) => (
                                  <div key={i} className="p-3 bg-[#f9f9f9] border border-[#eee] rounded-xl text-[10px] text-[#666] flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] mt-1 shrink-0" />
                                    {visual}
                                  </div>
                                ))}
                              </div>
                            </section>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#666]" />
                  </div>
                  <div className="bg-[#f0f0f0] p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-[#e5e5e5] bg-white">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="w-full bg-[#f8f9fa] border border-[#e5e5e5] rounded-2xl pl-4 pr-14 py-4 text-sm focus:outline-none focus:border-[#1a1a1a] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 w-10 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center transition-all hover:bg-[#333] active:scale-95 disabled:opacity-30 disabled:hover:bg-[#1a1a1a]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-[#aaa] text-center mt-3 uppercase tracking-widest font-medium">
              Press Enter to send
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
