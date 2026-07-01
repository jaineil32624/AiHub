import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, CheckSquare, Leaf, Palette, Zap, Menu, X, Copy, Check } from 'lucide-react';

const AiToolsWebsite = () => {
  const [activeModule, setActiveModule] = useState('assistant');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [copiedTool, setCopiedTool] = useState(null);

  // Text Assistant State
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantOutput, setAssistantOutput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Summarizer State
  const [summarizerInput, setSummarizerInput] = useState('');
  const [summarizerOutput, setSummarizerOutput] = useState('');
  const [summarizerLoading, setSummarizerLoading] = useState(false);

  // Task Planner State
  const [plannerInput, setPlannerInput] = useState('');
  const [plannerOutput, setPlannerOutput] = useState('');
  const [plannerLoading, setPlannerLoading] = useState(false);

  // Creative Generator State
  const [creativeInput, setCreativeInput] = useState('');
  const [creativeOutput, setCreativeOutput] = useState('');
  const [creativeLoading, setCreativeLoading] = useState(false);

  // Environmental Calculator State
  const [envActivity, setEnvActivity] = useState('car');
  const [envAmount, setEnvAmount] = useState('10');
  const [envOutput, setEnvOutput] = useState('');
  const [envLoading, setEnvLoading] = useState(false);

  // Productivity Assistant State
  const [prodInput, setProdInput] = useState('');
  const [prodOutput, setProdOutput] = useState('');
  const [prodLoading, setProdLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const callClaudeAPI = async (prompt, maxTokens = 500) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error('API call failed');
      const data = await response.json();
      return data.content[0]?.text || 'No response received';
    } catch (error) {
      return 'Error: Unable to process. Please try again.';
    }
  };

  const handleAssistant = async () => {
    if (!assistantInput.trim()) return;
    setAssistantLoading(true);
    const result = await callClaudeAPI(assistantInput, 600);
    setAssistantOutput(result);
    setAssistantLoading(false);
  };

  const handleSummarizer = async () => {
    if (!summarizerInput.trim()) return;
    setSummarizerLoading(true);
    const prompt = `Please provide a concise summary of the following text in 2-3 sentences:\n\n${summarizerInput}`;
    const result = await callClaudeAPI(prompt, 400);
    setSummarizerOutput(result);
    setSummarizerLoading(false);
  };

  const handlePlanner = async () => {
    if (!plannerInput.trim()) return;
    setPlannerLoading(true);
    const prompt = `Create a detailed action plan for the following goal. Include 5-7 specific, actionable steps with time estimates:\n\n${plannerInput}`;
    const result = await callClaudeAPI(prompt, 700);
    setPlannerOutput(result);
    setPlannerLoading(false);
  };

  const handleCreative = async () => {
    if (!creativeInput.trim()) return;
    setCreativeLoading(true);
    const prompt = `Generate creative content based on this prompt: ${creativeInput}\n\nProvide an engaging, imaginative response that's 150-200 words.`;
    const result = await callClaudeAPI(prompt, 500);
    setCreativeOutput(result);
    setCreativeLoading(false);
  };

  const handleEnvironmental = async () => {
    setEnvLoading(true);
    const activities = {
      car: 'driving a car',
      flight: 'taking a flight',
      energy: 'using electricity',
      water: 'using water',
    };
    const prompt = `Calculate and explain the environmental impact of ${activities[envActivity]} for ${envAmount} units. Provide the carbon footprint estimate and practical suggestions to reduce the impact.`;
    const result = await callClaudeAPI(prompt, 500);
    setEnvOutput(result);
    setEnvLoading(false);
  };

  const handleProductivity = async () => {
    if (!prodInput.trim()) return;
    setProdLoading(true);
    const prompt = `Provide productivity tips and strategies for: ${prodInput}\n\nInclude 5-6 actionable suggestions to boost efficiency and reduce procrastination.`;
    const result = await callClaudeAPI(prompt, 600);
    setProdOutput(result);
    setProdLoading(false);
  };

  const copyToClipboard = (text, toolName) => {
    navigator.clipboard.writeText(text);
    setCopiedTool(toolName);
    setTimeout(() => setCopiedTool(null), 2000);
  };

  const modules = [
    { id: 'assistant', name: 'AI Assistant', icon: Sparkles, color: 'from-blue-500 to-cyan-400' },
    { id: 'summarizer', name: 'Summarizer', icon: BookOpen, color: 'from-purple-500 to-pink-400' },
    { id: 'planner', name: 'Task Planner', icon: CheckSquare, color: 'from-green-500 to-emerald-400' },
    { id: 'environmental', name: 'Eco Calculator', icon: Leaf, color: 'from-teal-500 to-green-400' },
    { id: 'creative', name: 'Creative Gen', icon: Palette, color: 'from-orange-500 to-red-400' },
    { id: 'productivity', name: 'Productivity', icon: Zap, color: 'from-yellow-500 to-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Parallax Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        transform: `translateY(${scrollY * 0.5}px)`
      }}></div>

      {/* Header Navigation */}
      <header className="relative z-40 backdrop-blur-md bg-slate-900/50 border-b border-slate-700/50 sticky top-0 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-blue-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-emerald-300 transition-all duration-300">AiHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeModule === mod.id
                    ? 'bg-gradient-to-r ' + mod.color + ' shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700/50 hover:bg-slate-600/70 hover:scale-105'
                }`}
              >
                {mod.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-6 py-4 space-y-2">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(mod.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeModule === mod.id
                      ? 'bg-gradient-to-r ' + mod.color
                      : 'bg-slate-700/50 hover:bg-slate-600/70'
                  }`}
                >
                  <mod.icon className="w-4 h-4" />
                  {mod.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-in fade-in duration-700">
          <div className="space-y-6 text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700">
              Your AI Toolkit Hub
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Access powerful AI tools for writing, planning, creativity, and productivity—all in one beautiful, intelligent interface.
            </p>
          </div>

          {/* Module Grid Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20 group-hover:scale-105 group-hover:translate-y-[-4px]">
                  <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${mod.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-300 transition-colors">{mod.name}</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Access this tool to enhance your workflow</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Module Panel */}
        <div className="animate-in fade-in duration-500">
          {/* AI Assistant */}
          {activeModule === 'assistant' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                  <h3 className="text-3xl font-bold text-blue-300">AI Assistant</h3>
                </div>
                <p className="text-slate-300 mb-6">Ask me anything and I'll provide thoughtful, detailed responses to help you with any question or task.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    placeholder="Ask me anything... I'm here to help with questions, ideas, writing, or problem-solving."
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none h-32"
                  />
                  
                  <button
                    onClick={handleAssistant}
                    disabled={assistantLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {assistantLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Get Response
                      </>
                    )}
                  </button>

                  {assistantOutput && (
                    <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-300">Response</h4>
                        <button
                          onClick={() => copyToClipboard(assistantOutput, 'assistant')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'assistant' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{assistantOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summarizer */}
          {activeModule === 'summarizer' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                  <h3 className="text-3xl font-bold text-purple-300">Content Summarizer</h3>
                </div>
                <p className="text-slate-300 mb-6">Paste any text and get a concise, clear summary highlighting the key points.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={summarizerInput}
                    onChange={(e) => setSummarizerInput(e.target.value)}
                    placeholder="Paste your text here... Any article, document, or passage you'd like summarized."
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none h-40"
                  />
                  
                  <button
                    onClick={handleSummarizer}
                    disabled={summarizerLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {summarizerLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Summarize
                      </>
                    )}
                  </button>

                  {summarizerOutput && (
                    <div className="bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-300">Summary</h4>
                        <button
                          onClick={() => copyToClipboard(summarizerOutput, 'summarizer')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'summarizer' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{summarizerOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Task Planner */}
          {activeModule === 'planner' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <CheckSquare className="w-8 h-8 text-green-400" />
                  <h3 className="text-3xl font-bold text-green-300">Smart Task Planner</h3>
                </div>
                <p className="text-slate-300 mb-6">Define your goal and receive a step-by-step action plan with time estimates.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={plannerInput}
                    onChange={(e) => setPlannerInput(e.target.value)}
                    placeholder="What's your goal? E.g., 'Learn web development in 3 months' or 'Launch a small business'"
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none h-32"
                  />
                  
                  <button
                    onClick={handlePlanner}
                    disabled={plannerLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {plannerLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Planning...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-5 h-5" />
                        Create Plan
                      </>
                    )}
                  </button>

                  {plannerOutput && (
                    <div className="bg-slate-900/50 border border-green-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-300">Your Action Plan</h4>
                        <button
                          onClick={() => copyToClipboard(plannerOutput, 'planner')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'planner' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{plannerOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Environmental Calculator */}
          {activeModule === 'environmental' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-teal-500/30 rounded-3xl p-8 shadow-2xl shadow-teal-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-8 h-8 text-teal-400" />
                  <h3 className="text-3xl font-bold text-teal-300">Environmental Impact Calculator</h3>
                </div>
                <p className="text-slate-300 mb-6">Calculate the environmental impact of daily activities and learn ways to reduce your carbon footprint.</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Activity Type</label>
                      <select
                        value={envActivity}
                        onChange={(e) => setEnvActivity(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="car">Car Driving</option>
                        <option value="flight">Air Travel</option>
                        <option value="energy">Electricity Usage</option>
                        <option value="water">Water Consumption</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Amount/Duration</label>
                      <input
                        type="number"
                        value={envAmount}
                        onChange={(e) => setEnvAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleEnvironmental}
                    disabled={envLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-green-400 hover:from-teal-600 hover:to-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {envLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5" />
                        Calculate Impact
                      </>
                    )}
                  </button>

                  {envOutput && (
                    <div className="bg-slate-900/50 border border-teal-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-teal-300">Environmental Impact Analysis</h4>
                        <button
                          onClick={() => copyToClipboard(envOutput, 'environmental')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'environmental' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{envOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Creative Generator */}
          {activeModule === 'creative' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-8 shadow-2xl shadow-orange-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-8 h-8 text-orange-400" />
                  <h3 className="text-3xl font-bold text-orange-300">Creative Content Generator</h3>
                </div>
                <p className="text-slate-300 mb-6">Spark your creativity with AI-generated stories, ideas, and imaginative content on any topic.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={creativeInput}
                    onChange={(e) => setCreativeInput(e.target.value)}
                    placeholder="What would you like to create? E.g., 'A story about time travel' or 'Poetry about nature'"
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none h-32"
                  />
                  
                  <button
                    onClick={handleCreative}
                    disabled={creativeLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {creativeLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Palette className="w-5 h-5" />
                        Generate Content
                      </>
                    )}
                  </button>

                  {creativeOutput && (
                    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-orange-300">Generated Content</h4>
                        <button
                          onClick={() => copyToClipboard(creativeOutput, 'creative')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'creative' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{creativeOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Productivity Assistant */}
          {activeModule === 'productivity' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-yellow-500/30 rounded-3xl p-8 shadow-2xl shadow-yellow-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-3xl font-bold text-yellow-300">Productivity Assistant</h3>
                </div>
                <p className="text-slate-300 mb-6">Get personalized productivity tips and strategies to boost your efficiency and accomplish more.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={prodInput}
                    onChange={(e) => setProdInput(e.target.value)}
                    placeholder="Describe your productivity challenge. E.g., 'I struggle with procrastination' or 'How to balance multiple projects'"
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none h-32"
                  />
                  
                  <button
                    onClick={handleProductivity}
                    disabled={prodLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {prodLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Get Tips
                      </>
                    )}
                  </button>

                  {prodOutput && (
                    <div className="bg-slate-900/50 border border-yellow-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-yellow-300">Productivity Tips</h4>
                        <button
                          onClick={() => copyToClipboard(prodOutput, 'productivity')}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {copiedTool === 'productivity' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{prodOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-slate-700/50 bg-gradient-to-t from-slate-900 to-transparent py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p className="mb-2">Powered by Claude AI • All tools available for free</p>
          <p className="text-sm">Experience seamless AI assistance with our unified toolkit</p>
        </div>
      </footer>
    </div>
  );
};

export default AiToolsWebsite;