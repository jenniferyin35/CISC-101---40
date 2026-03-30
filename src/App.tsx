import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Sparkles, 
  Mail, 
  Users, 
  MessageSquare, 
  Info, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Layout,
  Type as TypeIcon,
  Image as ImageIcon,
  MousePointer2
} from "lucide-react";
import { generateCampaign, CampaignResult } from "./services/geminiService";

export default function App() {
  const [formData, setFormData] = useState({
    campaignType: "",
    targetAudience: "",
    tone: "",
    productInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateCampaign(
        formData.campaignType,
        formData.targetAudience,
        formData.tone,
        formData.productInfo
      );
      setResult(data);
    } catch (err) {
      setError("Failed to generate campaign. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      campaignType: "",
      targetAudience: "",
      tone: "",
      productInfo: ""
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Campaign Architect</h1>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight">Build your campaign</h2>
              <p className="text-[#666] text-sm leading-relaxed">
                Provide the details below. Our AI will craft a complete, high-converting email strategy for you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="campaignType" className="text-[11px] uppercase tracking-widest font-semibold text-[#888] flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Campaign Type
                  </label>
                  <input
                    id="campaignType"
                    name="campaignType"
                    type="text"
                    required
                    placeholder="e.g. Product Launch, Seasonal Sale"
                    value={formData.campaignType}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a1a] transition-all placeholder:text-[#ccc]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="targetAudience" className="text-[11px] uppercase tracking-widest font-semibold text-[#888] flex items-center gap-2">
                    <Users className="w-3 h-3" /> Target Audience
                  </label>
                  <input
                    id="targetAudience"
                    name="targetAudience"
                    type="text"
                    required
                    placeholder="e.g. University Students, Tech Professionals"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a1a] transition-all placeholder:text-[#ccc]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tone" className="text-[11px] uppercase tracking-widest font-semibold text-[#888] flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Tone
                  </label>
                  <input
                    id="tone"
                    name="tone"
                    type="text"
                    required
                    placeholder="e.g. Professional, Playful, Urgent"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a1a] transition-all placeholder:text-[#ccc]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="productInfo" className="text-[11px] uppercase tracking-widest font-semibold text-[#888] flex items-center gap-2">
                    <Info className="w-3 h-3" /> Product / Service Info
                  </label>
                  <textarea
                    id="productInfo"
                    name="productInfo"
                    required
                    rows={4}
                    placeholder="Describe what you are promoting and any key value propositions..."
                    value={formData.productInfo}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a1a] transition-all placeholder:text-[#ccc] resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  loading 
                    ? "bg-[#e5e5e5] text-[#888] cursor-not-allowed" 
                    : "bg-[#1a1a1a] text-white hover:bg-[#333] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Architecting...
                  </>
                ) : (
                  <>
                    Generate Campaign <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading && !error && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-[#e5e5e5] rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-[#e5e5e5]">
                    <Layout className="w-8 h-8 text-[#ccc]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-[#1a1a1a]">No campaign generated yet</p>
                    <p className="text-sm text-[#888] max-w-[280px]">Fill out the form on the left to see your AI-crafted marketing strategy.</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] bg-white border border-[#e5e5e5] rounded-3xl p-12 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-[#f5f5f5] border-t-[#1a1a1a] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#1a1a1a]" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium">Analyzing your requirements</p>
                    <p className="text-sm text-[#888]">Crafting high-converting copy and visuals...</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-red-900">Something went wrong</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}

              {result && result.status === "clarification_needed" && (
                <motion.div 
                  key="clarification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-6"
                >
                  <div className="flex items-center gap-3 text-amber-800">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">More information needed</h3>
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    {result.clarification_question}
                  </p>
                  <div className="p-4 bg-white/50 rounded-xl border border-amber-200 text-sm text-amber-800 italic">
                    Tip: Try providing more specific details about your product features or the desired outcome of the campaign.
                  </div>
                </motion.div>
              )}

              {result && result.status === "success" && result.campaign && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white border border-[#e5e5e5] rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-[#f5f5f5] bg-[#fafafa] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <h3 className="text-xl font-semibold tracking-tight">Campaign Strategy</h3>
                      </div>
                      <span className="px-3 py-1 bg-white border border-[#e5e5e5] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#888]">
                        Ready to deploy
                      </span>
                    </div>

                    <div className="p-8 space-y-10">
                      {/* Section 1: Subject Lines */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#888]">
                          <TypeIcon className="w-3.5 h-3.5" /> Subject Lines
                        </div>
                        <div className="space-y-2">
                          {result.campaign.subjectLines.map((line, i) => (
                            <div key={i} className="p-4 bg-[#f9f9f9] border border-[#eee] rounded-xl text-sm font-medium flex items-center gap-3">
                              <span className="w-5 h-5 bg-white border border-[#e5e5e5] rounded-md flex items-center justify-center text-[10px] text-[#888] font-mono">
                                {i + 1}
                              </span>
                              {line}
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Section 2: Preview Text */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#888]">
                          <Layout className="w-3.5 h-3.5" /> Preview Text
                        </div>
                        <p className="text-sm leading-relaxed text-[#444] p-4 bg-[#f9f9f9] border border-[#eee] rounded-xl italic">
                          "{result.campaign.previewText}"
                        </p>
                      </section>

                      {/* Section 3: Email Body */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#888]">
                          <Mail className="w-3.5 h-3.5" /> Email Body
                        </div>
                        <div className="p-6 bg-white border border-[#e5e5e5] rounded-2xl text-sm leading-relaxed text-[#333] whitespace-pre-wrap font-serif">
                          {result.campaign.emailBody}
                        </div>
                      </section>

                      {/* Section 4: Call to Action */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#888]">
                          <MousePointer2 className="w-3.5 h-3.5" /> Call to Action
                        </div>
                        <div className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium">
                          {result.campaign.callToAction}
                        </div>
                      </section>

                      {/* Section 5: Supporting Visuals */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#888]">
                          <ImageIcon className="w-3.5 h-3.5" /> Supporting Visuals
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.campaign.supportingVisuals.map((visual, i) => (
                            <div key={i} className="p-4 bg-[#f9f9f9] border border-[#eee] rounded-xl text-xs text-[#666] flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#1a1a1a] mt-1 shrink-0" />
                              {visual}
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={() => window.print()}
                      className="text-xs font-medium text-[#888] hover:text-[#1a1a1a] transition-colors underline underline-offset-4"
                    >
                      Export as PDF / Print
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e5e5e5] mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-widest">Powered by Gemini AI</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#888] hover:text-[#1a1a1a] transition-colors">Documentation</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#888] hover:text-[#1a1a1a] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#888] hover:text-[#1a1a1a] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
