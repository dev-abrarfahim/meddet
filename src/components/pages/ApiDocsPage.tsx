import React, { useState } from 'react';
import { Code2, Terminal, Play, Copy, Check, Sparkles, ExternalLink, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { handlePublicApiRequest } from '../../api/publicApiHandler';
import { LanguageMode } from '../../types';

interface ApiDocsPageProps {
  lang: LanguageMode;
}

export const ApiDocsPage: React.FC<ApiDocsPageProps> = ({ lang }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'search' | 'detail' | 'alternatives' | 'generic' | 'stats'>('search');
  const [testParamQuery, setTestParamQuery] = useState<string>('Napa');
  const [testParamId, setTestParamId] = useState<string>('1');
  const [testParamGenericId, setTestParamGenericId] = useState<string>('1');
  const [selectedLangSnippet, setSelectedLangSnippet] = useState<'curl' | 'javascript' | 'python' | 'dart'>('javascript');
  const [copied, setCopied] = useState<boolean>(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);

  const baseUrl = 'https://medvhai.heliox.workers.dev';

  const endpoints = [
    {
      id: 'search',
      method: 'GET',
      path: '/api/v1/search?q={query}&limit=10',
      title: 'Search Medicines',
      desc: 'Search brand medicines, generics, active ingredients, or dosage forms.'
    },
    {
      id: 'detail',
      method: 'GET',
      path: '/api/v1/medicines/{id}',
      title: 'Get Medicine Details',
      desc: 'Fetch single medicine details with MRP, pack size, manufacturer & clinical monograph.'
    },
    {
      id: 'alternatives',
      method: 'GET',
      path: '/api/v1/alternatives?genericId={genericId}&form=Tablet',
      title: 'Get Alternative Brands',
      desc: 'Fetch lower cost alternative brands for a generic ID filtered by dosage form.'
    },
    {
      id: 'generic',
      method: 'GET',
      path: '/api/v1/generics/{genericId}',
      title: 'Get Generic Monograph',
      desc: 'Fetch generic monograph, indication, dosage guidelines & all associated brands.'
    },
    {
      id: 'stats',
      method: 'GET',
      path: '/api/v1/stats',
      title: 'Database Statistics',
      desc: 'Fetch database totals summary for brands, generics, and companies.'
    }
  ];

  const getResolvedPath = () => {
    switch (selectedEndpoint) {
      case 'search':
        return `/api/v1/search?q=${encodeURIComponent(testParamQuery)}&limit=5`;
      case 'detail':
        return `/api/v1/medicines/${testParamId || '1'}`;
      case 'alternatives':
        return `/api/v1/alternatives?genericId=${testParamGenericId || '1'}&form=Tablet`;
      case 'generic':
        return `/api/v1/generics/${testParamGenericId || '1'}`;
      case 'stats':
        return '/api/v1/stats';
    }
  };

  const handleRunLiveTest = () => {
    let mockPath = '/api/v1/search';
    const params = new URLSearchParams();

    if (selectedEndpoint === 'search') {
      mockPath = '/api/v1/search';
      params.set('q', testParamQuery);
      params.set('limit', '5');
    } else if (selectedEndpoint === 'detail') {
      mockPath = `/api/v1/medicines/${testParamId || '1'}`;
    } else if (selectedEndpoint === 'alternatives') {
      mockPath = '/api/v1/alternatives';
      params.set('genericId', testParamGenericId || '1');
      params.set('form', 'Tablet');
    } else if (selectedEndpoint === 'generic') {
      mockPath = `/api/v1/generics/${testParamGenericId || '1'}`;
    } else if (selectedEndpoint === 'stats') {
      mockPath = '/api/v1/stats';
    }

    const res = handlePublicApiRequest(mockPath, params);
    setLiveResponse(res);
  };

  const getCodeSnippet = () => {
    const fullUrl = `${baseUrl}${getResolvedPath()}`;
    switch (selectedLangSnippet) {
      case 'curl':
        return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
      case 'javascript':
        return `// JavaScript (Fetch API)
const response = await fetch("${fullUrl}");
const data = await response.json();
console.log(data);`;
      case 'python':
        return `# Python (Requests)
import requests

url = "${fullUrl}"
response = requests.get(url)
data = response.json()
print(data)`;
      case 'dart':
        return `// Flutter / Dart (http package)
import 'package:http/http.dart' as http;
import 'dart:convert';

final response = await http.get(Uri.parse('${fullUrl}'));
if (response.statusCode == 200) {
  final data = jsonDecode(response.body);
  print(data);
}`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <Code2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Open Developer Platform' : 'ডেভেলপার ওপেন এপিআই'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'MedVhai Developer REST API' : 'MedVhai ডেভেলপার REST API'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? 'Integrate 30,500+ verified brand medicines, active ingredients, BDT MRP prices, and clinical monograph data into your medical apps, hospital EHRs, or pharmacy software.'
              : 'আপনার মেডিকেল অ্যাপ, ফার্মেসি সফটওয়্যার বা রিসার্চ প্রজেক্টে মেডিসিন ডেটাবেজ যুক্ত করতে আমাদের ফ্রি ওপেন REST API ব্যবহার করুন।'}
          </p>
        </div>
      </div>

      {/* Overview Spec Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400">Base URL</div>
          <div className="text-xs sm:text-sm font-mono font-black text-[#095D7E] dark:text-[#2DD4BF] truncate">
            https://medvhai.heliox.workers.dev
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400">Rate Limit</div>
          <div className="text-xs sm:text-sm font-mono font-black text-[#14967F] dark:text-[#6EE7B7]">
            60 req / min
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400">Data Format</div>
          <div className="text-xs sm:text-sm font-mono font-black text-[#095D7E] dark:text-[#2DD4BF]">
            JSON (UTF-8)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400">Authentication</div>
          <div className="text-xs sm:text-sm font-mono font-black text-[#14967F] dark:text-[#6EE7B7]">
            Open Access
          </div>
        </div>
      </div>

      {/* Main Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Endpoint List */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? 'API Endpoints' : 'এপিআই এন্ডপয়েন্টসমূহ'}
          </h2>

          <div className="space-y-2">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep.id as any);
                  setLiveResponse(null);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint === ep.id
                    ? 'bg-[#095D7E] text-white border-[#095D7E] shadow-md'
                    : 'bg-white dark:bg-[#152232] text-slate-700 dark:text-slate-200 border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md font-mono ${
                    selectedEndpoint === ep.id ? 'bg-white/20 text-[#E2FCD6]' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-xs font-bold truncate opacity-90">{ep.title}</span>
                </div>
                <div className="font-mono text-xs mt-2 truncate opacity-80">
                  {ep.path}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Code Generator & Live Tester */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-4">
            
            {/* Target URL Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs font-mono shrink-0 text-center">
                GET
              </span>
              <span className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200 truncate flex-1 px-2">
                {baseUrl}{getResolvedPath()}
              </span>
              <button
                onClick={handleRunLiveTest}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#14967F] hover:bg-[#11806C] text-[#E2FCD6] text-xs font-black transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Live</span>
              </button>
            </div>

            {/* Parameter Inputs */}
            {selectedEndpoint === 'search' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Query Parameter (q):</label>
                <input
                  type="text"
                  value={testParamQuery}
                  onChange={(e) => setTestParamQuery(e.target.value)}
                  placeholder="e.g. Napa, Seclo, Paracetamol"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono"
                />
              </div>
            )}

            {(selectedEndpoint === 'detail' || selectedEndpoint === 'alternatives' || selectedEndpoint === 'generic') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">ID Parameter:</label>
                <input
                  type="number"
                  value={selectedEndpoint === 'detail' ? testParamId : testParamGenericId}
                  onChange={(e) => selectedEndpoint === 'detail' ? setTestParamId(e.target.value) : setTestParamGenericId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono"
                />
              </div>
            )}

            {/* Code Snippets Toolbar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {(['javascript', 'python', 'curl', 'dart'] as const).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => setSelectedLangSnippet(langKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        selectedLangSnippet === langKey
                          ? 'bg-[#095D7E] text-white'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {langKey.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#14967F] hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#091522] text-[#CCECEE] font-mono text-xs overflow-x-auto leading-relaxed border border-[#1E3A52]">
                {getCodeSnippet()}
              </pre>
            </div>

            {/* Live Response Viewer */}
            {liveResponse && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>200 OK — Live JSON Response</span>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
                  {JSON.stringify(liveResponse, null, 2)}
                </pre>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
