import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LanguageMode } from '../../../types';

interface BmiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: LanguageMode;
}

export const BmiInfoModal: React.FC<BmiInfoModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#095D7E]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-md border border-[#CCECEE] shadow-2xl p-5 z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-[#CCECEE] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#E2FCD6] text-[#0D6F5D] flex items-center justify-center border border-[#14967F]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#095D7E]">
                {lang === 'en' ? 'Clinical Standards' : 'ক্লিনিক্যাল স্ট্যান্ডার্ড'}
              </h2>
              <p className="text-[10px] text-[#64748B]">
                {lang === 'en' ? 'WHO Anthropometric References' : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) নির্দেশিকা'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#F1F9FF] text-[#64748B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-[#334155]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#14967F] flex-shrink-0 mt-0.5" />
            <p>
              <strong>{lang === 'en' ? 'WHO Clinical Classifications:' : 'WHO ক্লিনিক্যাল পরিমাপ:'}</strong>{' '}
              {lang === 'en'
                ? 'Calibrated with World Health Organization (WHO) and CDC anthropometric standards for accurate clinical assessment.'
                : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও সিডিসি স্ট্যান্ডার্ড অনুযায়ী ৫টি ধাপে বিএমআই ও স্বাস্থ্যঝুঁকি সঠিকভাবে বিশ্লেষণ করা হয়।'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#14967F] flex-shrink-0 mt-0.5" />
            <p>
              <strong>{lang === 'en' ? 'Med Navy (#095D7E) Silhouettes:' : 'শারীরবৃত্তীয় বডি মডেল:'}</strong>{' '}
              {lang === 'en'
                ? 'Anatomical models stay uniform in Med Navy to eliminate stigmatizing color codes on human silhouettes.'
                : 'সকল মানুষের জন্য সম্মানজনকভাবে কোনো পক্ষপাতমূলক রঙ ছাড়াই নিরপেক্ষ অ্যানাটমিক্যাল মডেল ব্যবহৃত হয়েছে।'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#14967F] flex-shrink-0 mt-0.5" />
            <p>
              <strong>{lang === 'en' ? 'Metric & Imperial Parity:' : 'উভয় এককের সমতা:'}</strong>{' '}
              {lang === 'en'
                ? 'Precise mathematical conversions between centimeters, feet/inches, kilograms, and pounds.'
                : 'সেন্টিমিটার, ফিট/ইঞ্চি, কিলোগ্রাম ও পাউন্ডের মধ্যে নির্ভুল গাণিতিক রূপান্তর সুবিধা।'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-md bg-[#14967F] hover:bg-[#0D6F5D] text-white font-bold text-xs tracking-wide transition-colors cursor-pointer"
        >
          {lang === 'en' ? 'Close Guidelines' : 'নির্দেশিকা বন্ধ করুন'}
        </button>
      </div>
    </div>
  );
};
