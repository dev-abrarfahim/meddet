import React, { useState } from 'react';
import { Code2, Terminal, Play, Copy, Check, X, Sparkles, ExternalLink, Database, ShieldCheck } from 'lucide-react';
import { handlePublicApiRequest } from '../../api/publicApiHandler';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'search' | 'detail' | 'alternatives' | 'generic' | 'stats'>('search');
  const [testParamQuery, setTestParamQuery] = useState<string>('Napa');
  const [testParamId, setTestParamId] = useState<string>('1');
  const [testParamGenericId, setTestParamGenericId] = useState<string>('1');
  const [selectedLangSnippet, setSelectedLangSnippet] = useState<'curl' | 'javascript' | 'python' | 'dart'>('javascript');
  const [copied, setCopied] = useState<boolean>(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);

  if (!isOpen) return null;

  const baseUrl = 'https://medvhai.heliox.workers.dev';

  // Endpoint Details definition
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

  // Active URL builder
  const getActiveUrl = () => {
    if (selectedEndpoint === 'search') return `${baseUrl}/api/v1/search?q=${encodeURIComponent(testParamQuery)}&limit=5`;
    if (selectedEndpoint === 'detail') return `${baseUrl}/api/v1/medicines/${testParamId}`;
    if (selectedEndpoint === 'alternatives') return `${baseUrl}/api/v1/alternatives?genericId=${testParamGenericId}&form=Tablet`;
    if (selectedEndpoint === 'generic') return `${baseUrl}/api/v1/generics/${testParamGenericId}`;
    return `${baseUrl}/api/v1/stats`;
  };

  const activeUrl = getActiveUrl();

  // Execute Live Interactive API Test
  const handleRunTest = () => {
    let mockPath = '/api/v1/search';
    const params = new URLSearchParams();

    if (selectedEndpoint === 'search') {
      mockPath = '/api/v1/search';
      params.set('q', testParamQuery);
      params.set('limit', '5');
    } else if (selectedEndpoint === 'detail') {
      mockPath = `/api/v1/medicines/${testParamId}`;
    } else if (selectedEndpoint === 'alternatives') {
      mockPath = '/api/v1/alternatives';
      params.set('genericId', testParamGenericId);
      params.set('form', 'Tablet');
    } else if (selectedEndpoint === 'generic') {
      mockPath = `/api/v1/generics/${testParamGenericId}`;
    } else if (selectedEndpoint === 'stats') {
      mockPath = '/api/v1/stats';
    }

    const res = handlePublicApiRequest(mockPath, params);
    setLiveResponse(res);
  };

  // Code Snippet Generator
  const getSnippet = () => {
    if (selectedLangSnippet === 'curl') {
      return `curl -X GET "${activeUrl}" \\
  -H "Accept: application/json"`;
    }
    if (selectedLangSnippet === 'javascript') {
      return `// JavaScript / Fetch API (Node.js & Web)
fetch("${activeUrl}")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
    }
    if (selectedLangSnippet === 'python') {
      return `# Python (requests)
import requests

url = "${activeUrl}"
response = requests.get(url)
data = response.json()
print(data)`;
    }
    return `// Dart / Flutter
import 'package:http/http.dart' as http;
import 'dart:convert';

void fetchMedicineData() async {
  final response = await http.get(Uri.parse('${activeUrl}'));
  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print(data);
  }
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header Bar */}
        <div className="p-4 sm:p-5 bg-[#095D7E] dark:bg-[#0B1927] text-white flex items-center justify-between gap-3 border-b border-[#074760] dark:border-[#1E3A52]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#14967F] flex items-center justify-center text-white shadow-inner shrink-0">
              <Code2 className="w-6 h-6 text-[#E2FCD6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">MedVhai Developer API (v1)</h2>
                <span className="bg-[#14967F] text-[#E2FCD6] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#E2FCD6]/30">
                  Public & Free
                </span>
              </div>
              <p className="text-xs text-[#CCECEE] dark:text-slate-400">
                RESTful Medical JSON API for Mobile Apps, Websites & Healthcare Software
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Quick Overview Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="font-black text-xs">CORS Enabled (*)</div>
                <div className="text-[10px] opacity-80 font-normal">Call from any Flutter, iOS or React app</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <div className="font-black text-xs">30,500+ Medicines</div>
                <div className="text-[10px] opacity-80 font-normal">Instant indexed REST JSON queries</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div className="font-black text-xs">100% Free & Open</div>
                <div className="text-[10px] opacity-80 font-normal">No API keys required to start</div>
              </div>
            </div>
          </div>

          {/* Endpoint Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Select API Endpoint</label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep.id as any);
                    setLiveResponse(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    selectedEndpoint === ep.id
                      ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#14967F]'
                  }`}
                >
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    {ep.method}
                  </span>
                  <span>{ep.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Endpoint Description & Test Inputs */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {endpoints.find((e) => e.id === selectedEndpoint)?.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {endpoints.find((e) => e.id === selectedEndpoint)?.desc}
                </p>
              </div>

              <button
                onClick={handleRunTest}
                className="bg-[#14967F] dark:bg-[#2DD4BF] hover:bg-[#11806C] text-[#E2FCD6] dark:text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Test Endpoint Live</span>
              </button>
            </div>

            {/* Test Input Parameters */}
            {selectedEndpoint === 'search' && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Query (q):</label>
                <input
                  type="text"
                  value={testParamQuery}
                  onChange={(e) => setTestParamQuery(e.target.value)}
                  className="bg-white dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#14967F]"
                  placeholder="e.g. Napa, Seclo"
                />
              </div>
            )}

            {selectedEndpoint === 'detail' && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Medicine ID:</label>
                <input
                  type="number"
                  value={testParamId}
                  onChange={(e) => setTestParamId(e.target.value)}
                  className="bg-white dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#14967F] w-24"
                />
              </div>
            )}

            {(selectedEndpoint === 'alternatives' || selectedEndpoint === 'generic') && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Generic ID:</label>
                <input
                  type="number"
                  value={testParamGenericId}
                  onChange={(e) => setTestParamGenericId(e.target.value)}
                  className="bg-white dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#14967F] w-24"
                />
              </div>
            )}

            {/* Active Full Request URL */}
            <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-2.5 rounded-xl text-xs font-mono overflow-x-auto">
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="truncate flex-1">{activeUrl}</span>
            </div>
          </div>

          {/* Code Snippets Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#14967F]" />
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">Integration Code Snippet</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  onClick={() => setSelectedLangSnippet('javascript')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedLangSnippet === 'javascript' ? 'bg-[#095D7E] text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLangSnippet('python')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedLangSnippet === 'python' ? 'bg-[#095D7E] text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLangSnippet('dart')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedLangSnippet === 'dart' ? 'bg-[#095D7E] text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Flutter/Dart
                </button>
                <button
                  onClick={() => setSelectedLangSnippet('curl')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedLangSnippet === 'curl' ? 'bg-[#095D7E] text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  cURL
                </button>
              </div>
            </div>

            {/* Code View Container */}
            <div className="relative bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <pre className="text-emerald-300 leading-relaxed">{getSnippet()}</pre>
            </div>
          </div>

          {/* Live Response Result Box */}
          {liveResponse && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>Live JSON Response</span>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    HTTP {liveResponse.status} OK
                  </span>
                </span>

                <button
                  onClick={() => setLiveResponse(null)}
                  className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                >
                  Clear Response
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs max-h-64 overflow-y-auto border border-slate-800">
                <pre>{JSON.stringify(liveResponse, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#14967F]" />
            <span>Open Public API powered by MedVhai Database</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close API Docs
          </button>
        </div>

      </div>
    </div>
  );
};
