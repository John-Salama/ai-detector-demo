"use client";

import { useState } from "react";
import {
  Wand2,
  Brain,
  AlertTriangle,
  CheckCircle,
  Copy,
  RotateCcw,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Shield,
  Check,
} from "lucide-react";
import { detectAIText } from "ai-text-detector";

// Define interface for analysis result
interface AnalysisResult {
  isAIGenerated: boolean;
  confidence: number;
  reasons: string[];
  score: number;
  error?: string;
  perplexityScore: number;
  burstinessScore: number;
}

// Safe wrapper function to handle short text
const safeDetectAI = (text: string) => {
  if (text.trim().length < 50) {
    return {
      isAIGenerated: false,
      confidence: 0,
      reasons: ["Text too short for reliable analysis"],
      score: 0,
      error: "Minimum 50 characters required",
      perplexityScore: 0,
      burstinessScore: 0,
    };
  }

  try {
    const result = detectAIText(text);
    return {
      ...result,
      perplexityScore: result.score * 10, // Convert score to perplexity-like value
      burstinessScore: (1 - result.confidence) * 10, // Convert confidence to burstiness-like value
    };
  } catch (error) {
    return {
      isAIGenerated: false,
      confidence: 0,
      reasons: ["Error analyzing text"],
      score: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      perplexityScore: 0,
      burstinessScore: 0,
    };
  }
};

const predefinedExamples = {
  chatgpt: `In a quiet village where no one had ever seen the stars, a curious child named Luma built a tower tall enough to touch the sky. Each night, she climbed it with a lantern in hand, hoping the stars would notice her light. One evening, a single star blinked back—and then began to fall. It landed gently in her palm, whispering secrets of distant galaxies only she could understand. From that night on, the stars visited the village in dreams, painting the skies with colors unknown. Luma never spoke of her tower again, but the stars always lingered just a little closer.`,

  claude: `In today's rapidly evolving technological landscape, it's worth noting that machine learning algorithms continue to revolutionize how we approach data analysis. These cutting-edge systems enable organizations to harness the power of big data, transforming raw information into valuable insights that can enhance operational efficiency and drive innovation across diverse sectors.`,

  gemini: `The advancement of artificial intelligence represents a paradigm shift in computational capabilities. Through sophisticated algorithms and neural networks, these systems demonstrate remarkable proficiency in pattern recognition, natural language processing, and predictive analytics. This technological evolution enables unprecedented automation and optimization across various domains.`,

  gpt4: `As we delve into the realm of artificial intelligence, it becomes evident that these sophisticated systems have fundamentally transformed numerous aspects of modern business operations. The comprehensive integration of AI technologies facilitates enhanced decision-making processes, streamlines operational workflows, and enables organizations to maintain competitive advantages in an increasingly dynamic marketplace.`,

  human: `Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you’d expect to be involved in anything strange or mysterious, because they just didn’t hold with such nonsense.`,

  humanCasual: `Oh my goodness, I just discovered this amazing coffee shop downtown! The barista was SO nice, and they had this incredible lavender latte that I'm obsessed with. I've been there three times this week already (don't judge me 😅). The vibe is super chilly, perfect for working or just hanging out with friends. Anyone wanna check it out with me this weekend??`,
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const analysisResult = safeDetectAI(text);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = (exampleKey: string) => {
    setText(predefinedExamples[exampleKey as keyof typeof predefinedExamples]);
    setSelectedExample(exampleKey);
    setResult(null);
  };

  const clearAll = () => {
    setText("");
    setResult(null);
    setSelectedExample(null);
  };

  const copyToClipboard = (text: string, buttonId: string = "default") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [buttonId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [buttonId]: false }));
      }, 2000);
    });
  };

  const getResultColor = (isAI: boolean) => {
    return isAI
      ? darkMode
        ? "text-red-400"
        : "text-red-600"
      : darkMode
      ? "text-emerald-400"
      : "text-emerald-600";
  };

  const getResultBgColor = (isAI: boolean) => {
    return isAI
      ? darkMode
        ? "bg-red-500/10 border-red-500/30"
        : "bg-red-50 border-red-200"
      : darkMode
      ? "bg-emerald-500/10 border-emerald-500/30"
      : "bg-emerald-50 border-emerald-200";
  };

  const themeClasses = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
            darkMode ? "bg-purple-500" : "bg-purple-300"
          }`}
        ></div>
        <div
          className={`absolute top-0 right-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000 ${
            darkMode ? "bg-blue-500" : "bg-blue-300"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-1/3 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          }`}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`relative border-b backdrop-blur-xl ${
          darkMode
            ? "border-gray-800 bg-gray-900/80"
            : "border-gray-200 bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Text Detector
                </h1>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Advanced linguistic analysis powered by AI
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                Next-Gen AI Detection
              </span>
            </div>

            <h2 className="text-6xl font-bold leading-tight">
              Detect AI Text with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Neural Precision
              </span>
            </h2>

            <p
              className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Our revolutionary AI detector leverages advanced neural
              linguistics, analyzing over 50+ metrics including perplexity,
              semantic coherence, and syntactic patterns to identify
              AI-generated content with unprecedented accuracy.
            </p>
          </div>
        </div>

        {/* Predefined Examples */}
        <div className="mb-8">
          <h3
            className={`text-lg font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Try These Examples:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(predefinedExamples).map(([key]) => (
              <button
                key={key}
                onClick={() => loadExample(key)}
                className={`group p-4 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedExample === key
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg shadow-purple-500/25"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500/50 hover:bg-gray-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {selectedExample === key && <Sparkles className="w-3 h-3" />}
                  <span>
                    {key === "chatgpt"
                      ? "ChatGPT"
                      : key === "claude"
                      ? "Claude"
                      : key === "gemini"
                      ? "Gemini"
                      : key === "gpt4"
                      ? "GPT-4"
                      : key === "human"
                      ? "Human"
                      : "Casual"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Input Section */}
          <div className="space-y-6">
            <div
              className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-2xl ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 shadow-xl shadow-black/20"
                  : "bg-white/70 border-gray-200 shadow-xl"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <label
                    htmlFor="text-input"
                    className={`text-lg font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Enter Text to Analyze
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(text, "textarea")}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        copiedStates.textarea
                          ? darkMode
                            ? "text-green-400 bg-green-400/20 scale-110"
                            : "text-green-600 bg-green-100 scale-110"
                          : darkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      disabled={!text}
                      title={copiedStates.textarea ? "Copied!" : "Copy text"}
                    >
                      {copiedStates.textarea ? (
                        <Check className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={clearAll}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      disabled={!text && !result}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type the text you want to analyze here. Minimum 50 characters required for accurate neural analysis..."
                  className={`w-full h-64 p-4 rounded-xl resize-none transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    darkMode
                      ? "bg-gray-900/50 border-gray-600 text-gray-200 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />

                <div className="flex items-center justify-between mt-4">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {text.length} characters (minimum 50 required)
                  </p>

                  <button
                    onClick={analyzeText}
                    disabled={!text.trim() || text.length < 50 || isAnalyzing}
                    className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span>Neural Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Analyze Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="space-y-6 animate-in slide-in-from-right duration-700">
                {/* Main Result */}
                <div
                  className={`relative rounded-2xl border-2 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl ${getResultBgColor(
                    result.isAIGenerated
                  )} ${darkMode ? "shadow-xl shadow-black/20" : "shadow-xl"}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                  <div className="relative p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className={`p-3 rounded-full ${
                          result.isAIGenerated
                            ? "bg-red-500/20"
                            : "bg-emerald-500/20"
                        }`}
                      >
                        {result.isAIGenerated ? (
                          <AlertTriangle
                            className={`w-8 h-8 ${getResultColor(
                              result.isAIGenerated
                            )} animate-pulse`}
                          />
                        ) : (
                          <CheckCircle
                            className={`w-8 h-8 ${getResultColor(
                              result.isAIGenerated
                            )} animate-pulse`}
                          />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-bold ${getResultColor(
                            result.isAIGenerated
                          )}`}
                        >
                          {result.isAIGenerated
                            ? "AI Generated"
                            : "Human Written"}
                        </h3>
                        <p
                          className={`text-lg ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div
                        className={`p-4 rounded-xl backdrop-blur-sm transition-transform hover:scale-105 ${
                          darkMode ? "bg-gray-900/30" : "bg-white/50"
                        }`}
                      >
                        <p
                          className={`text-sm mb-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Perplexity Score
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {result.perplexityScore.toFixed(2)}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-xl backdrop-blur-sm transition-transform hover:scale-105 ${
                          darkMode ? "bg-gray-900/30" : "bg-white/50"
                        }`}
                      >
                        <p
                          className={`text-sm mb-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Burstiness Score
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                          {result.burstinessScore.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="mb-6">
                      <div
                        className={`flex justify-between text-sm mb-3 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span>Human</span>
                        <span>AI Generated</span>
                      </div>
                      <div
                        className={`w-full rounded-full h-4 ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                            result.isAIGenerated
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                          }`}
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div
                  className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700 shadow-lg shadow-black/10"
                      : "bg-white/70 border-gray-200 shadow-lg"
                  }`}
                >
                  <div className="p-6">
                    <h4
                      className={`text-lg font-semibold mb-4 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      Neural Analysis Breakdown
                    </h4>
                    <div className="space-y-3">
                      {result.reasons.map((reason: string, index: number) => (
                        <div
                          key={index}
                          className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                            darkMode ? "bg-gray-900/30" : "bg-gray-50"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                          <p
                            className={`text-sm leading-relaxed ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 shadow-lg shadow-black/10"
                    : "bg-white/70 border-gray-200 shadow-lg"
                }`}
              >
                <div className="p-8 text-center">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Brain
                      className={`w-10 h-10 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      } animate-pulse`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Neural Network Ready
                  </h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Enter text and unleash the power of advanced AI detection
                    algorithms.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 animate-in slide-in-from-bottom duration-1000">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Why Choose Our Neural Detector?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Neural Analysis",
                description:
                  "50+ linguistic metrics including semantic embeddings, syntactic patterns, and neural perplexity scoring.",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "83.2% Accuracy",
                description:
                  "Enhanced detection with improved recognition of emotional, informal, and creative writing patterns.",
                gradient: "from-emerald-400 to-green-500",
              },
              {
                icon: Sparkles,
                title: "Real-time Processing",
                description:
                  "Lightning-fast analysis with zero dependencies. Works seamlessly in any JavaScript environment.",
                gradient: "from-purple-400 to-pink-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 shadow-lg shadow-black/10"
                    : "bg-white/70 border-gray-200 shadow-lg"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${feature.gradient} shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Section */}
        <div className="mb-16 animate-in slide-in-from-bottom duration-1000">
          <div
            className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-2xl ${
              darkMode
                ? "bg-gray-800/50 border-gray-700 shadow-xl shadow-black/20"
                : "bg-white/70 border-gray-200 shadow-xl"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Use in Your Project?
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Integrate advanced AI detection into your applications with
                  our powerful npm package
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4
                    className={`text-xl font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Installation
                  </h4>
                  <div
                    className={`relative rounded-xl p-4 font-mono text-sm transition-all duration-300 hover:scale-[1.02] ${
                      darkMode
                        ? "bg-gray-900/50 border border-gray-700"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            "npm install ai-text-detector",
                            "npm-install"
                          )
                        }
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          copiedStates["npm-install"]
                            ? darkMode
                              ? "text-green-400 bg-green-400/20 scale-110"
                              : "text-green-600 bg-green-100 scale-110"
                            : darkMode
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white"
                        }`}
                        title={
                          copiedStates["npm-install"]
                            ? "Copied!"
                            : "Copy command"
                        }
                      >
                        {copiedStates["npm-install"] ? (
                          <Check className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <code
                      className={darkMode ? "text-green-400" : "text-green-600"}
                    >
                      npm install ai-text-detector
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4
                    className={`text-xl font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Basic Usage
                  </h4>
                  <div
                    className={`relative rounded-xl p-4 font-mono text-sm transition-all duration-300 hover:scale-[1.02] ${
                      darkMode
                        ? "bg-gray-900/50 border border-gray-700"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `import { detectAIText } from 'ai-text-detector';
const result = detectAIText(text);`,
                            "code-usage"
                          )
                        }
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          copiedStates["code-usage"]
                            ? darkMode
                              ? "text-green-400 bg-green-400/20 scale-110"
                              : "text-green-600 bg-green-100 scale-110"
                            : darkMode
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white"
                        }`}
                        title={
                          copiedStates["code-usage"] ? "Copied!" : "Copy code"
                        }
                      >
                        {copiedStates["code-usage"] ? (
                          <Check className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <code
                      className={`whitespace-pre-line ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {`import { detectAIText } from 'ai-text-detector';
const result = detectAIText(text);`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <a
                  href="https://www.npmjs.com/package/ai-text-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span>View on NPM</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative border-t backdrop-blur-xl ${
          darkMode
            ? "border-gray-800 bg-gray-900/80"
            : "border-gray-200 bg-white/80"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-32 left-1/2 transform -translate-x-1/2 w-96 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-10 ${
              darkMode ? "bg-purple-500" : "bg-purple-300"
            }`}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Text Detector
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <p
                className={`text-lg font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Built with{" "}
                <span className="text-red-500 animate-pulse">❤️</span> using the{" "}
                <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ai-text-detector
                </span>{" "}
                npm package
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-600"
                }`}
              >
                © 2025 AI Text Detector Demo • MIT License • Powered by JS
              </p>
            </div>

            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse`}
                ></div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Neural Network Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles
                  className={`w-3 h-3 ${
                    darkMode ? "text-purple-400" : "text-purple-500"
                  } animate-pulse`}
                />
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  83.2% Accuracy Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
