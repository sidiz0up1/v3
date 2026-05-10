import React from 'react';
import { 
  Activity, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, 
  ShieldCheck, Settings, ArrowUpCircle, Maximize2, Move, Equal, Minus, ArrowDownUp, RefreshCw, UserCheck, RotateCcw,
  Info, FileText, ShoppingBag, HelpCircle, QrCode, Armchair
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { PostureData, AnalysisResult, BodyType } from '../types';
import { PRODUCTS } from '../constants';

interface PostureReportProps {
  data: PostureData;
  analysisResult: AnalysisResult;
  productRecommendation: string;
  selectedProductIds?: string[];
  id?: string;
  isPdf?: boolean;
  page?: 0 | 1 | 2 | 3;
}

export const PostureReport: React.FC<PostureReportProps> = ({ data, analysisResult, productRecommendation, selectedProductIds = [], id, isPdf, page }) => {
  const showCover = page === undefined || (page as number) === 0;
  const showPage1 = page === undefined || page === 1;
  const showPage2 = page === undefined || page === 2;
  const showPage3 = page === undefined || page === 3;

  return (
    <div id={id} className={`${isPdf ? 'flex flex-col is-pdf-mode' : ''}`}>
      {showCover && <CoverPage data={data} isPdf={isPdf} />}
      {showPage1 && <Page1 data={data} analysisResult={analysisResult} isPdf={isPdf} />}
      {showPage2 && (
        <Page2 
          data={data} 
          analysisResult={analysisResult} 
          isPdf={isPdf} 
        />
      )}
      {showPage3 && (
        <Page3
          data={data}
          analysisResult={analysisResult}
          productRecommendation={productRecommendation}
          selectedProductIds={selectedProductIds}
          isPdf={isPdf}
        />
      )}
    </div>
  );
};

const typeLabels: Record<BodyType, string> = {
  [BodyType.TYPE0]: '건강형',
  [BodyType.TYPEA]: '상체 말림형',
  [BodyType.TYPEB]: '좌우 비대칭형',
  [BodyType.TYPEC]: '하체 O다리형',
  [BodyType.TYPED]: '골반-요추 불균형형',
  [BodyType.TYPEE]: '복합 불균형형',
};

const typeImages: Record<BodyType, string> = {
  [BodyType.TYPE0]: '/v2_type_healthy.png',
  [BodyType.TYPEA]: '/v2_type_rounded.png',
  [BodyType.TYPEB]: '/v2_type_asymmetry.png',
  [BodyType.TYPEC]: '/v2_type_o_leg.png',
  [BodyType.TYPED]: '/v2_type_pelvis.png',
  [BodyType.TYPEE]: '/v2_type_complex.png',
};

const getStatusEmoji = (val: number, ranges: number[], labels: string[]) => {
  let segmentIndex = -1;
  const isSigned = ranges[0] < 0;
  
  if (isSigned) {
    for (let i = 0; i < ranges.length - 1; i++) {
        if (val >= ranges[i] && val <= ranges[i+1]) {
            segmentIndex = i;
            break;
        }
    }
  } else {
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i + 1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1 && val >= ranges[ranges.length - 1]) segmentIndex = ranges.length - 2;
  }
  
  const label = labels[segmentIndex] || '';
  if (label.includes('정상') || label.includes('표준')) return '🟢';
  if (label.includes('심각') || label.includes('이상')) return '🔴';
  return '🟡';
};

const getStatusEmojiFromLabel = (label: string) => {
  if (label.includes('정상') || label.includes('표준') || label.includes('중견')) return '🟢';
  if (label.includes('심각') || label.includes('이상')) return '🔴';
  return '🟡';
};

const getStatusBarColor = (label: string) => {
  if (label.includes('정상') || label.includes('표준') || label.includes('중견')) return '#000000'; // Black
  if (label.includes('심각') || label.includes('이상') || label.includes('높음')) return '#f43f5e'; // Red
  return '#f59e0b'; // Yellow (Caution, etc)
};

const CHAIR_TIPS: Record<string, { title: string; items: string[] }> = {
  '라운드숄더': {
    title: '가슴을 열어주는 등받이와 팔을 지지해주는 기능',
    items: ['등 중간까지 받쳐주는 등받이', '팔걸이 높이 조절']
  },
  '거북목': {
    title: '허리를 세우고 목을 뒤에서 받쳐주는 기능',
    items: ['요추 지지', '헤드레스트 (높이/각도 조절)']
  },
  '골반 수평': {
    title: '골반을 중앙에 고정하고 수평을 유지해주는 기능',
    items: ['내 체형에 맞는 좌판', '좌판 깊이 조절']
  },
  '흉추 각도': {
    title: '흉추를 자연스럽게 펴주고 상체를 안정적으로 지지해주는 기능',
    items: ['등 중간(흉추)까지 밀착되는 등받이', '자연스러운 S라인을 유지하는 곡률의 등판', '상체를 뒤로 열어주는 틸팅 기능']
  }
};

const IconMap: Record<string, any> = {
  ShieldCheck, Settings, ArrowUpCircle, Maximize2, Move, Equal, Minus, ArrowDownUp, RefreshCw, UserCheck, RotateCcw, Activity
};

const RELATED_FEATURES: Record<string, string> = {
  '라운드숄더': '등판',
  '거북목': '헤드레스트',
  '흉추 각도': '등판 및 틸팅',
  '어깨 기울기': '팔걸이',
  '골반 수평': '좌판',
  '어깨 수평': '팔걸이 및 좌판',
  '무릎 수평': '좌판',
  '골반 전방경사': '좌판 및 요추 지지대',
  '요추 각도': '요추 지지대',
  '다리 각도': '좌판 및 발받침대',
};

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1 align-middle">
    <HelpCircle size={10} className="text-sidiz-medium-gray cursor-help hover:text-sidiz-blue transition-colors" />
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-sidiz-black text-white text-[8px] rounded-lg z-50 leading-tight"
      style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sidiz-black" />
    </div>
  </div>
);

const Footer = () => (
  <div className="absolute bottom-6 left-12 right-12 h-8 border-t border-sidiz-black flex justify-between items-center bg-white px-1">
    <div className="text-left">
      <p className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1">본 결과지는 참고용이며 전문 의료진의 진단을 대신할 수 없습니다.</p>
    </div>
    <div className="text-right">
      <p className="text-[10px] sidiz-voice-3 text-sidiz-black font-eng uppercase tracking-widest font-black">Sidiz The Progressive</p>
    </div>
  </div>
);

const CoverPage = ({ data, isPdf }: { data: PostureData; isPdf?: boolean }) => (
  <div 
    className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden mb-8'}`} 
    style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
  >
    <div className="h-full flex flex-col items-center justify-between py-24 px-16 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-full h-[60%] bg-slate-50 -skew-y-6 origin-top-right -z-10" />
      
      <div className="w-full text-center flex flex-col items-center">
        <img 
          src="/attention_logo_black.png" 
          alt="Sidiz Logo" 
          className="w-32 h-32 object-contain mb-8"
        />
        <h1 className="text-[48px] sidiz-voice-3 sidiz-headline text-sidiz-black leading-tight tracking-tighter mb-4">
          POSTURE ANALYSIS<br />
          <span className="text-indigo-600">REPORT</span>
        </h1>
        <div className="w-24 h-1.5 bg-indigo-600 rounded-full mb-12" />
        
        <p className="text-lg sidiz-voice-1 text-slate-400 uppercase tracking-[0.2em] font-eng">
          Sidiz The Progressive Bodycheck System
        </p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-[40px] shadow-2xl space-y-6">
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-400 font-eng uppercase tracking-widest mb-1">Customer Name</span>
            <span className="text-xl sidiz-voice-3 text-slate-800 font-bold">{data.userInfo.name || '미기입'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-400 font-eng uppercase tracking-widest mb-1">Analysis Date</span>
            <span className="text-xl sidiz-voice-3 text-slate-800 font-bold font-eng">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-400 font-eng uppercase tracking-widest mb-1">Gender / Age</span>
            <span className="text-xl sidiz-voice-3 text-slate-800 font-bold">{data.userInfo.gender || '-'} / {data.userInfo.age || '-'}세</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-400 font-eng uppercase tracking-widest mb-1">Location</span>
            <span className="text-xl sidiz-voice-3 text-slate-800 font-bold">SIDIZ Flagship Store</span>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-100 pt-8 flex justify-center">
        <p className="text-[10px] sidiz-voice-3 text-sidiz-black font-eng uppercase tracking-[0.4em] font-black opacity-30">
          SIDIZ | THE PROGRESSIVE
        </p>
      </div>
    </div>
  </div>
);

const Page1 = ({ data, analysisResult, isPdf }: { data: PostureData; analysisResult: AnalysisResult; isPdf?: boolean }) => (
    <div 
      className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden mb-8'}`} 
      style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
    <div className="px-10 py-7">
      {/* Thin Info Bar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
        <h1 className="text-sm sidiz-voice-2 text-indigo-900 sidiz-headline">
          SIDIZ <span className="text-indigo-700">| THE PROGRESSIVE</span>
        </h1>
        <div className="flex gap-4 text-[8px] text-slate-400">
          <div className="flex gap-1">
            <span>검사일시</span>
            <span className="text-slate-600 font-eng">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex gap-1">
            <span>검사기관</span>
            <span className="text-slate-600">SIDIZ THE PROGRESSIVE</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {/* Top Section: User Name & Info badges */}
        <div className="border-b border-slate-100 pb-3 mb-2 flex justify-between items-center">
          <h2 className="text-[13px] sidiz-voice-3 text-sidiz-black font-bold">
            {data.userInfo.name || '고객'}님의 체형 분석 결과 리포트입니다.
          </h2>
          <div className="flex gap-2">
            {data.userInfo.gender && (
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] sidiz-voice-3 font-medium">
                {data.userInfo.gender}
              </span>
            )}
            {data.userInfo.age && (
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] sidiz-voice-3 font-medium font-eng">
                {data.userInfo.age}세
              </span>
            )}
          </div>
        </div>
        
        {/* Score & Ranking Section - Redesigned with Underlines */}
        <div className="border-b border-slate-100 py-2 mb-1 flex justify-between items-end">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[10px] sidiz-voice-1 text-indigo-500 uppercase tracking-widest">종합 체형 점수</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[8.5px] sidiz-voice-3 font-medium leading-none flex items-center">현대인 평균 55점</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sidiz-voice-2 text-indigo-600 font-eng leading-none">{analysisResult.overallScore}</span>
              <span className="text-xl sidiz-voice-3 text-indigo-400 font-eng">/ 100</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <h2 className="text-[10px] sidiz-voice-1 text-indigo-500 uppercase tracking-widest mb-1">자세 안정 분포</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sidiz-voice-2 text-indigo-600 leading-none">상위 {data.topPercent}%</span>
              <span className="text-lg sidiz-voice-3 text-indigo-400 ml-1">입니다.</span>
            </div>
          </div>
        </div>

        {/* Full Body Type Analysis Section (Moved from Page 2) */}
        <section className="mt-1">
          <div className="flex items-center gap-2 mb-3 border-b-2 border-sidiz-black pb-1.5">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">종합 체형 분석 결과</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start gap-4 p-1">
              <div className="flex-1">
                <p className="text-[8px] text-indigo-400 sidiz-voice-3 uppercase mb-0.5 font-eng tracking-widest">Main Body Type</p>
                <h3 className="text-[20px] sidiz-voice-3 sidiz-headline text-indigo-600 mb-1">{typeLabels[analysisResult.mainType]}</h3>
                <p className="text-[9.5px] text-sidiz-black sidiz-voice-1 leading-relaxed">
                  {analysisResult.description}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center">
                <PostureRadarChart data={analysisResult.radarData} isPdf={isPdf} />
                <p className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 text-center mt-1">종합 자세 균형 지표</p>
              </div>
            </div>

            {/* Illustration/Image Section - Centered and scaled to fit */}
            <div className="flex justify-center w-full py-2 mt-2">
              <img 
                src={typeImages[analysisResult.mainType]} 
                alt={typeLabels[analysisResult.mainType]} 
                className="w-[110%] h-auto object-contain block"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-2">
              {/* 체형 특징 섹션 */}
              <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
                <h4 className="text-[9.5px] sidiz-voice-3 text-sidiz-black flex items-center gap-1.5 mb-2 border-b border-slate-50 pb-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  체형 특징
                </h4>
                <ul className="text-[8.5px] text-sidiz-dark-gray sidiz-voice-1 space-y-1 pl-1 mb-2.5 flex-1">
                  {analysisResult.bodyFeatures.slice(0, 3).map((f, i) => <li key={i} className="flex gap-1.5 leading-tight"><span>•</span>{f}</li>)}
                </ul>
                <div className="pt-1.5 border-t border-slate-50">
                  <p className="text-[8.5px] text-sidiz-black sidiz-voice-1 leading-tight">
                    <span className="text-indigo-600 mr-1 font-bold">소견:</span>
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* 앉음 습관 문제 섹션 */}
              <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
                <h4 className="text-[9.5px] sidiz-voice-3 text-sidiz-black flex items-center gap-1.5 mb-2 border-b border-slate-50 pb-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  앉음 습관 문제
                </h4>
                <ul className="text-[8.5px] text-sidiz-dark-gray sidiz-voice-1 space-y-1 pl-1 mb-2.5 flex-1">
                  {analysisResult.sittingHabits.slice(0, 3).map((h, i) => <li key={i} className="flex gap-1.5 leading-tight"><span>•</span>{h}</li>)}
                </ul>
                <div className="pt-1.5 border-t border-slate-50">
                  <p className="text-[8.5px] text-sidiz-black sidiz-voice-1 leading-tight">
                    <span className="text-orange-600 mr-1 font-bold">원인:</span>
                    {analysisResult.cause}
                  </p>
                </div>
              </div>

              {/* 맞춤형 개선 가이드 섹션 (Page 3에서 이동 및 최소화) */}
              <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
                <h4 className="text-[9.5px] sidiz-voice-3 text-sidiz-black flex items-center gap-1.5 mb-2 border-b border-slate-50 pb-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  개선 가이드
                </h4>
                <div className="space-y-2.5 flex-1">
                  <div>
                    <span className="text-[8px] font-bold text-emerald-600 block mb-0.5">✓ 권장 습관</span>
                    <ul className="text-[8.5px] text-sidiz-dark-gray sidiz-voice-1 space-y-0.5 pl-1">
                      {analysisResult.lifeHabits.slice(0, 2).map((h, i) => <li key={i} className="leading-tight flex gap-1"><span>·</span>{h}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-rose-500 block mb-0.5">⚠️ 주의 사항</span>
                    <ul className="text-[8.5px] text-sidiz-dark-gray sidiz-voice-1 space-y-0.5 pl-1">
                      {analysisResult.avoidHabits.slice(0, 2).map((h, i) => <li key={i} className="leading-tight flex gap-1"><span>·</span>{h}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  </div>
);

// Radar Chart Component to prevent re-renders and infinite loops
const PostureRadarChart = React.memo(({ data, isPdf }: { data: any[]; isPdf?: boolean }) => {
  const hasCaution = data.some(d => d.value < 60);
  
  const chartContent = (
    <RadarChart 
      cx={isPdf ? 90 : "50%"} 
      cy={isPdf ? 70 : "50%"} 
      outerRadius={isPdf ? 40 : "48%"} 
      width={isPdf ? 180 : undefined}
      height={isPdf ? 140 : undefined}
      data={data}
    >
      <PolarGrid stroke="#cbd5e1" />
      <PolarAngleAxis 
        dataKey="subject" 
        tick={{ fill: '#475569', fontSize: 8, fontWeight: 600 }} 
      />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
      <Radar 
        name="Balance" 
        dataKey="value" 
        stroke={hasCaution ? '#f97316' : '#003EFF'} 
        fill={hasCaution ? '#f97316' : '#003EFF'} 
        fillOpacity={0.4} 
        isAnimationActive={!isPdf}
      />
    </RadarChart>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4">
        <div className="h-[140px] w-[180px] relative">
          {isPdf ? (
            chartContent
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartContent}
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex flex-col gap-1.5 min-w-[90px]">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-0.5">
              <span className="text-[9px] text-sidiz-medium-gray sidiz-voice-3">{d.subject}</span>
              <span className={`text-[10px] font-eng sidiz-voice-3 ${d.value < 60 ? 'text-orange-500 font-bold' : 'text-sidiz-black'}`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Radar Chart Legend */}
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#002D5D] opacity-60"></div>
          <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">정상 (60점 이상)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] opacity-60"></div>
          <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">주의 (60점 미만)</span>
        </div>
      </div>
    </div>
  );
});

const Page2 = ({ data, analysisResult, isPdf }: { 
  data: PostureData; 
  analysisResult: AnalysisResult; 
  isPdf?: boolean 
}) => (
    <div 
      className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden mb-8'}`} 
      style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
    <div className="px-10 py-5">
      <div className="flex flex-col gap-3">
        {/* Detailed Measurement Data (Moved from Page 1) */}
        <section>
          {/* Header without Traffic Light Indicators */}
          <div className="flex justify-between items-end mb-2 border-b-2 border-sidiz-black pb-1.5">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black uppercase tracking-tight">상세 측정 데이터 분석</h2>
          </div>
          
          <div className="space-y-2.5">
            {/* 1. 상체 정렬 분석 */}
            <section className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1.5 border-b border-indigo-100 pb-1 h-6">
                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shrink-0" />
                <h3 className="text-[12px] sidiz-voice-3 font-bold text-indigo-900 leading-none">상체 정렬</h3>
                <div className={`px-2 h-[16px] rounded-full border flex items-center justify-center shrink-0 ${analysisResult.areaScores.upperBody < 60 ? 'bg-orange-50 border-orange-200' : 'bg-indigo-50 border-indigo-100'}`}>
                  <span className={`text-[8.5px] font-bold font-eng leading-none ${analysisResult.areaScores.upperBody < 60 ? 'text-orange-600' : 'text-indigo-600'}`}>
                    {analysisResult.areaScores.upperBody}점
                  </span>
                </div>
                <span className="text-[7.5px] text-indigo-400 sidiz-voice-1 ml-auto font-medium self-center">상체 말림 및 거북목 상태</span>
              </div>
              <p className="text-[8px] text-sidiz-black sidiz-voice-1 mb-1.5 leading-tight px-1">
                {analysisResult.thematicSummaries.upperBody}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-1">
                 <InBodyDualBarChart 
                   label="라운드숄더" 
                   description="어깨가 앞으로 말려 있는 상태"
                   valueL={data.sideLeft.roundShoulder || 0} 
                   valueR={data.sideRight.roundShoulder || 0} 
                   ranges={[0, 30, 45, 60]} 
                   labels={['정상', '주의', '심각']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   meaning={analysisResult.keyMetrics.find(m => m.label.includes('라운드숄더'))?.meaning}
                   compact={true}
                   illuImage="/body_parts_round_soulder.png"
                 />
                 <InBodyDualBarChart 
                   label="흉추 각도" 
                   description="등뼈(흉추)의 굽은 정도"
                   valueL={data.sideLeft.thoracic || 0} 
                   valueR={data.sideRight.thoracic || 0} 
                   ranges={[20, 35, 45, 60]} 
                   labels={['전만', '정상', '후만']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   illuImage="/body_parts_thoracic_angle.png"
                 />
                 <InBodyDualBarChart 
                   label="거북목" 
                   description="목이 앞으로 나와 있는 상태"
                   valueL={data.sideLeft.forwardHead || 0} 
                   valueR={data.sideRight.forwardHead || 0} 
                   ranges={[0, 40, 50, 60]} 
                   labels={['정상', '주의', '심각']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   meaning={analysisResult.keyMetrics.find(m => m.label.includes('거북목'))?.meaning}
                   compact={true}
                   illuImage="/body_parts_neck.png"
                 />
                 <InBodyDualBarChart 
                   label="어깨 기울기" 
                   description="어깨의 상하 기울어진 정도"
                   valueL={data.front.leftShoulderSlope || 0} 
                   valueR={data.front.rightShoulderSlope || 0} 
                   ranges={[-5, 12, 18, 30]} 
                   labels={['상견', '중견', '하견']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   illuImage="/body_parts_soulder_tilt.png"
                 />
              </div>
            </section>

            {/* 2. 좌우 균형 분석 */}
            <section className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 mb-1.5">
              <div className="flex items-center gap-2 mb-1 border-b border-indigo-100 pb-1 h-6">
                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shrink-0" />
                <h3 className="text-[12px] sidiz-voice-3 font-bold text-indigo-900 leading-none">좌우 균형</h3>
                <div className={`px-2 h-[16px] rounded-full border flex items-center justify-center shrink-0 ${analysisResult.areaScores.leftRight < 60 ? 'bg-orange-50 border-orange-200' : 'bg-indigo-50 border-indigo-100'}`}>
                  <span className={`text-[8.5px] font-bold font-eng leading-none ${analysisResult.areaScores.leftRight < 60 ? 'text-orange-600' : 'text-indigo-600'}`}>
                    {analysisResult.areaScores.leftRight}점
                  </span>
                </div>
                <span className="text-[7.5px] text-indigo-400 sidiz-voice-1 ml-auto font-medium self-center">신체 좌우 대칭 및 수평 상태</span>
              </div>
              <p className="text-[8px] text-sidiz-black sidiz-voice-1 mb-1.5 leading-tight px-1">
                {analysisResult.thematicSummaries.asymmetry}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-1">
                 <InBodyPelvisDualBarChart 
                   label="골반 수평"
                   description="골반의 좌우 높낮이 차이"
                   valueF={data.front.pelvisHorizontal}
                   valueB={data.back.pelvisHorizontal}
                   ranges={[-10, -2, 2, 10]}
                   labels={['왼쪽 이상', '정상', '오른쪽 이상']}
                   unit="°"
                   showHeader={true}
                   isPdf={isPdf}
                   meaning={analysisResult.keyMetrics.find(m => m.label.includes('골반 수평'))?.meaning}
                   compact={true}
                   labelF="전면"
                   labelB="후면"
                   illuImage="/body_parts_pelvic_balance.png"
                 />
                 <InBodyPelvisDualBarChart 
                   label="어깨 수평" 
                   description="어깨의 좌우 높낮이 차이"
                   valueF={data.front.shoulderHorizontal} 
                   valueB={data.back.shoulderHorizontal} 
                   ranges={[-10, -2, 2, 10]} 
                   labels={['왼쪽 이상', '정상', '오른쪽 이상']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   labelF="전면"
                   labelB="후면"
                   illuImage="/body_parts_soulder_balance.png"
                 />
                 <InBodySingleBarChart 
                   label="무릎 수평" 
                   description="무릎의 좌우 높낮이 차이"
                   value={data.back.kneeHorizontal} 
                   ranges={[-10, -2, 2, 10]} 
                   labels={['왼쪽 이상', '정상', '오른쪽 이상']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   sideLabel="후면"
                   illuImage="/body_parts_knees.png"
                 />
              </div>
            </section>

            {/* 3. 골반 및 요추 분석 */}
            <section className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 mb-1.5">
              <div className="flex items-center gap-2 mb-1 border-b border-indigo-100 pb-1 h-6">
                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shrink-0" />
                <h3 className="text-[12px] sidiz-voice-3 font-bold text-indigo-900 leading-none">골반 및 요추</h3>
                <div className={`px-2 h-[16px] rounded-full border flex items-center justify-center shrink-0 ${analysisResult.areaScores.pelvisLumbar < 60 ? 'bg-orange-50 border-orange-200' : 'bg-indigo-50 border-indigo-100'}`}>
                  <span className={`text-[8.5px] font-bold font-eng leading-none ${analysisResult.areaScores.pelvisLumbar < 60 ? 'text-orange-600' : 'text-indigo-600'}`}>
                    {analysisResult.areaScores.pelvisLumbar}점
                  </span>
                </div>
                <span className="text-[7.5px] text-indigo-400 sidiz-voice-1 ml-auto font-medium self-center">골반 경사 및 허리 정렬 상태</span>
              </div>
              <p className="text-[8px] text-sidiz-black sidiz-voice-1 mb-1.5 leading-tight px-1">
                {analysisResult.thematicSummaries.pelvisLumbar}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-1">
                 <InBodyDualBarChart 
                   label="골반 전방경사" 
                   description="골반이 앞/뒤로 기울어진 정도"
                   valueL={data.sideLeft.pelvisTilt || 0} 
                   valueR={data.sideRight.pelvisTilt || 0} 
                   ranges={[-5, 5, 8, 20]} 
                   labels={['후만', '정상', '전만']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   meaning={analysisResult.keyMetrics.find(m => m.label.includes('골반 전방경사'))?.meaning}
                   compact={true}
                   illuImage="/body_parts_pelvic_tilt.png"
                 />
                 <InBodyDualBarChart 
                   label="요추 각도" 
                   description="허리뼈(요추)의 굽은 정도"
                   valueL={data.sideLeft.lumbar || 0} 
                   valueR={data.sideRight.lumbar || 0} 
                   ranges={[30, 45, 55, 70]} 
                   labels={['주의', '정상', '주의']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   illuImage="/body_parts_lumber_angle.png"
                 />
              </div>
            </section>

            {/* 4. 하체 정렬 분석 */}
            <section className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1 border-b border-indigo-100 pb-1 h-6">
                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shrink-0" />
                <h3 className="text-[12px] sidiz-voice-3 font-bold text-indigo-900 leading-none">하체 정렬</h3>
                <div className={`px-2 h-[16px] rounded-full border flex items-center justify-center shrink-0 ${analysisResult.areaScores.lowerBody < 60 ? 'bg-orange-50 border-orange-200' : 'bg-indigo-50 border-indigo-100'}`}>
                  <span className={`text-[8.5px] font-bold font-eng leading-none ${analysisResult.areaScores.lowerBody < 60 ? 'text-orange-600' : 'text-indigo-600'}`}>
                    {analysisResult.areaScores.lowerBody}점
                  </span>
                </div>
                <span className="text-[7.5px] text-indigo-400 sidiz-voice-1 ml-auto font-medium self-center">다리 정렬 및 무릎 상태</span>
              </div>
              <p className="text-[8px] text-sidiz-black sidiz-voice-1 mb-1.5 leading-tight px-1">
                {analysisResult.thematicSummaries.lowerBody}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-1">
                 <InBodyDualBarChart 
                   label="다리 각도" 
                   description="다리의 정렬 상태"
                   valueL={data.front.leftLegAngle || 0} 
                   valueR={data.front.rightLegAngle || 0} 
                   ranges={[-10, -3, 3, 10]} 
                   labels={['O다리', '정상', 'X다리']}
                   unit="°" 
                   showHeader={true}
                   isPdf={isPdf}
                   compact={true}
                   labelL="왼"
                   labelR="오"
                   illuImage="/body_parts_legs.png"
                 />
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
);

const Page3 = ({ data, analysisResult, productRecommendation, selectedProductIds = [], isPdf }: { 
  data: PostureData; 
  analysisResult: AnalysisResult; 
  productRecommendation: string; 
  selectedProductIds?: string[];
  isPdf?: boolean 
}) => {
  const baseProductIds = selectedProductIds.length > 0 
    ? selectedProductIds 
    : analysisResult.recommendedProductIds;

  const baseProducts = PRODUCTS.filter(p => baseProductIds.includes(p.id));
  
  // Combine base recommended products with Stefo if enabled
  const recommendedProducts = [...baseProducts];
  if (data.recommendStefo) {
    const stepo = PRODUCTS.find(p => p.id === 'stepo');
    if (stepo && !recommendedProducts.find(p => p.id === 'stepo')) {
      recommendedProducts.push(stepo);
    }
  }

  return (
    <div 
      className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden'}`} 
      style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
    <div className="px-12 py-6">
      <div className="flex flex-col gap-4">
          {/* 1. 고객 맞춤 데이터 분석 */}
        <section className="mt-0">
          <div className="flex items-center gap-2 mb-1.5 border-b-2 border-sidiz-black pb-1">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">고객 맞춤 데이터 분석</h2>
          </div>
          
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: '키', value: data.userInfo.height, diff: null, standard: 0, unit: 'cm' },
                { label: '몸무게', value: data.userInfo.weight, diff: null, standard: 0, unit: 'kg' },
                { label: '앉은키', value: data.userInfo.sittingHeight, diff: analysisResult.customizationDeviations?.sittingHeight?.diff, standard: analysisResult.customizationDeviations?.sittingHeight?.standard, unit: 'mm' },
                { label: '어깨넓이', value: data.userInfo.shoulderWidth, diff: analysisResult.customizationDeviations?.shoulderWidth?.diff, standard: analysisResult.customizationDeviations?.shoulderWidth?.standard, unit: 'mm' },
                { label: '발바닥-오금 높이', value: data.userInfo.poplitealHeight, diff: analysisResult.customizationDeviations?.poplitealHeight?.diff, standard: analysisResult.customizationDeviations?.poplitealHeight?.standard, unit: 'mm' }
              ].map((item, idx) => {
                const isStandard = item.diff !== null && Math.abs(item.diff) < (item.standard * 0.01);
                return (
                  <div key={idx} className="bg-white px-2 py-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-1.5 min-w-0">
                    <span className="text-[8px] text-sidiz-black sidiz-voice-3 font-bold whitespace-nowrap">{item.label}</span>
                    <div className={`flex ${item.diff !== null ? 'flex-row items-center justify-center' : 'flex-col items-center'} gap-1.5 w-full`}>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className={`${item.diff === null ? 'text-[12px]' : 'text-[10px]'} text-sidiz-black sidiz-voice-3 font-bold font-eng`}>{item.value || '-'}</span>
                        <span className="text-[6px] text-sidiz-medium-gray">{item.unit}</span>
                      </div>
                      {item.diff !== null && (
                        <div className={`px-1 py-0.5 rounded-lg text-center flex flex-col items-center justify-center min-w-[32px] ${
                          isStandard ? 'bg-slate-50 text-slate-500' : 
                          item.diff > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 
                          'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          <span className="text-[4px] opacity-70 font-bold mb-[-1px] leading-none">평균대비</span>
                          <span className="text-[7px] sidiz-voice-3 font-bold font-eng leading-none">
                            {isStandard ? '표준' : `${item.diff > 0 ? '+' : ''}${Math.round(item.diff)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[7px] text-sidiz-medium-gray mt-1.5 px-1 text-center">*표준 데이터는 한국인 인체지수 조사 자료(Size Korea)를 바탕으로 신장에 맞춰 산출되었습니다.</p>
          </div>
        </section>

        <section className="mt-2 text-[10px]">
          <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 backdrop-blur-md py-4 px-[18px] rounded-[24px] shadow-2xl flex flex-col justify-center relative overflow-hidden border border-white/10 ring-1 ring-white/5">
            {/* Decorative background accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-500/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 bg-indigo-500/15 rounded-lg p-1.5 ring-1 ring-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <img src="/attention_logo_black.png" alt="Attention" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <p className="text-[11px] text-slate-200/90 sidiz-voice-1 leading-[1.4]">
                {analysisResult.consultationSummary.split('\n').map((line, i) => (
                  <span key={i} className="block mb-1.5 opacity-95">
                    {line.split('**').map((part, j) => {
                      const isBold = j % 2 === 1;
                      if (isBold) {
                        return (
                          <b key={j} className="text-white font-bold text-[12px] px-1 bg-indigo-500/20 rounded-sm border-b-2 border-indigo-500 shadow-sm">
                            {part}
                          </b>
                        );
                      }
                      return part;
                    })}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-1 flex-1">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sidiz-voice-3 text-sidiz-black font-bold">Sitting Expert Picks</h3>
                  <span className="text-[8px] text-indigo-500 font-bold">체형별 맞춤 제품 추천</span>
                </div>
                <div className={`grid ${recommendedProducts.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="flex flex-col gap-2 mb-2 min-h-[120px]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                              <h4 className="text-[19px] sidiz-voice-3 text-sidiz-black font-eng line-clamp-2 leading-tight font-bold">{product.name}</h4>
                            </div>
                            {isPdf && (
                              <div className="shrink-0 bg-slate-50 p-0.5 rounded border border-slate-100">
                                <QRCodeSVG value={product.url} size={28} />
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] text-sidiz-dark-gray leading-tight sidiz-voice-1 mb-2 whitespace-normal break-words">{product.description}</p>
                          {product.tip && (
                            <div className="mt-auto p-2 bg-indigo-50 rounded-lg border-l-2 border-indigo-500 shadow-sm">
                              <span className="text-[8.5px] sidiz-voice-3 text-indigo-700 block mb-0.5 font-bold">SE Tip!</span>
                              <p className="text-[9px] text-sidiz-black leading-relaxed sidiz-voice-1 font-medium bg-[#f0f4ff] px-1 rounded whitespace-normal break-words">
                                {product.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isPdf && (
                        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-50">
                          <a 
                            href={product.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <ShoppingBag size={11} />
                            <span className="text-[9px] sidiz-voice-3 font-bold">상세 보기</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 space-y-3 mt-1">
              <div className="bg-indigo-50/80 text-sidiz-black p-5 rounded-[32px] relative overflow-hidden shadow-sm border border-indigo-100/50">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full -mr-48 -mt-48 opacity-20 blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100 rounded-full -ml-36 -mb-36 opacity-20 blur-[100px]"></div>
                
                <div className="relative z-10 py-0.5">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-px bg-indigo-300"></div>
                    <span className="text-[9px] font-eng tracking-[0.25em] text-indigo-500 uppercase font-extrabold">PROGRESSIVE SITTING EXPERIENCE</span>
                  </div>
                  
                  <div>
                    <h3 className="text-[12px] sidiz-voice-3 leading-relaxed text-indigo-900 font-medium whitespace-normal break-words">
                      시디즈는 최상의 의자 위 경험을 선물합니다.<br />
                      그 경험이 모여 '자기다움'을 찾아가는 여정이 되고, 끊임없이 나아가는 이 발전적인 여정에는 끝이 없습니다.
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-lime-50/80 text-sidiz-black p-5 rounded-[32px] relative overflow-hidden shadow-sm border border-lime-100/50">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full -mr-48 -mt-48 opacity-20 blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full -ml-36 -mb-36 opacity-20 blur-[100px]"></div>
                
                <div className="relative z-10 py-0.5">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-px bg-lime-300"></div>
                    <span className="text-[9px] font-eng tracking-[0.25em] text-lime-600 uppercase font-extrabold">SUSTAINABLE SITTING LIFE</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[12px] sidiz-voice-3 font-bold text-sidiz-black mb-1.5 underline underline-offset-4 decoration-lime-400/30">나에게 맞는 앉음의 가치, 더 오래 지속되도록</h4>
                      <p className="text-[10px] sidiz-voice-1 leading-relaxed text-sidiz-dark-gray font-medium whitespace-normal break-words">
                        당신만의 최적의 시팅에 의자를 아끼고 고치는 습관까지 더해보세요.<br />
                        이지리페어(Easy Repair)를 통해 건강한 바른 자세와 지구 환경의 가치를 오래도록 이어갈 수 있습니다.
                      </p>
                    </div>

                    <div className="p-3 bg-white/60 rounded-2xl border border-lime-100 shadow-sm backdrop-blur-sm">
                      <p className="text-[9.5px] sidiz-voice-1 leading-snug text-sidiz-dark-gray">
                        <span className="font-bold mr-2 text-lime-700">💡 이지리페어(Easy Repair)란?</span><br/>
                        의자 전체를 교체할 필요 없이, 마모되거나 오염된 부품만 개별적으로 구매하여 직접 교체할 수 있는 시디즈의 지속 가능한 솔루션입니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
  );
};

function DynamicScaleHeader({ ranges, labels, unit }: { ranges: number[], labels: string[], unit: string }) {
  const max = ranges[ranges.length - 1];
  const min = ranges[0];
  const total = max - min;

  return (
    <div className="flex items-center gap-2">
      {/* Spacer matching the side label width (w-7 = 28px) */}
      <div className="w-7 shrink-0" /> 
      
      {/* Main scale area matching the flex-1 bar area */}
      <div className="flex-1 relative h-6">
        <div className="absolute inset-0 flex">
          {ranges.slice(0, -1).map((r, i) => {
            const nextR = ranges[i + 1];
            const width = ((nextR - r) / total) * 100;
            return (
              <div 
                key={i} 
                className="h-full relative border-l border-slate-200 flex flex-col items-center justify-end pb-0.5"
                style={{ width: `${width}%` }}
              >
                <div className="flex flex-col items-center whitespace-nowrap">
                  <span className="text-[7px] sidiz-voice-3 text-sidiz-black font-bold leading-none">{labels[i]}</span>
                  <span className="text-[6px] text-sidiz-medium-gray font-eng leading-none mt-0.5">{r}-{nextR}{unit}</span>
                </div>
              </div>
            );
          })}
          {/* Last divider line */}
          <div className="h-full border-l border-slate-200" />
        </div>
      </div>

      {/* Spacer matching the right value area (w-16) */}
      <div className="w-16 shrink-0" />
    </div>
  );
}

function InBodyDualBarChart({ label, description, valueL, valueR, ranges, labels, unit, showHeader = false, isPdf, meaning, compact, labelL = '왼', labelR = '오', illuImage }: { 
  label: string; 
  description?: string;
  valueL: number; 
  valueR: number;
  ranges: number[]; 
  labels: string[];
  unit: string;
  showHeader?: boolean;
  isPdf?: boolean;
  meaning?: string;
  compact?: boolean;
  labelL?: string;
  labelR?: string;
  illuImage?: string;
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const total = max - min;
  
  const getBarColor = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    
    const labelText = labels[segmentIndex] || '';
    return getStatusBarColor(labelText);
  };

  const getStatusText = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    const text = labels[segmentIndex] || '';
    return text.includes('이상') ? text.replace('이상', '높음') : text;
  };

  const renderBar = (val: number, side: string) => {
    const percentage = Math.min(100, Math.max(0, ((val - min) / total) * 100));
    const containerHeight = compact ? 'h-4' : 'h-5';
    const status = getStatusText(val);
    
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div className={`w-7 shrink-0 flex items-center justify-center ${containerHeight}`}>
            {side && side !== '' && (
              <span className="text-[8.5px] sidiz-voice-3 text-sidiz-black font-bold text-center leading-none">
                {side === '좌' || side === 'L' || side === '왼' ? '왼' : side === '우' || side === 'R' || side === '오' ? '오' : side}
              </span>
            )}
          </div>
          <div className={`flex-1 ${containerHeight} flex flex-col justify-center relative group`}>
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
              {ranges.slice(0, -1).map((r, i) => {
                const start = ranges[i];
                const end = ranges[i + 1];
                const width = ((end - start) / total) * 100;
                const l = labels[i] || '';
                let bgColor = '#f8fafc';
                if (l.includes('심각')) bgColor = '#fff1f2';
                else if (!l.includes('정상') && !l.includes('표준')) bgColor = '#fff7ed';
                
                return (
                  <div 
                    key={i} 
                    className="h-full border-r border-slate-200" 
                    style={{ width: `${width}%`, backgroundColor: bgColor }} 
                  />
                );
              })}
            </div>
            
            {/* Scale Markers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {ranges.map((r, i) => (
                <div 
                  key={i} 
                  className="h-full absolute" 
                  style={{ left: `${((r - min) / total) * 100}%`, borderLeft: '1px solid rgba(255, 255, 255, 0.4)' }} 
                />
              ))}
            </div>

            {/* The Bar */}
            <div className={`relative ${compact ? 'h-1.5' : 'h-2'} w-full bg-transparent rounded-full`}>
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPdf ? '' : 'transition-all duration-700'} rounded-full z-10`}
                style={{ width: `${percentage}%`, backgroundColor: getStatusBarColor(status), boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              />
              
              {/* Value Marker Dot */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white z-30 shadow-sm`}
                style={{ left: `calc(${percentage}% - 3px)`, backgroundColor: getStatusBarColor(status) }}
              />
              
              {/* Value Label outside bar area */}
              <div 
                className={`absolute z-20 flex items-center pl-2 pointer-events-none top-1/2 -translate-y-1/2`}
                style={{ left: `${percentage}%`, whiteSpace: 'nowrap' }}
              >
                <span 
                  className="text-[7.5px] font-bold font-eng leading-none"
                  style={{ color: getStatusBarColor(status) }}
                >
                  {[status, (Math.abs(val)?.toFixed(1) || '-')].filter(Boolean).join(' ')}{unit}
                </span>
              </div>
            </div>
          </div>
          {/* Right Spacer for Alignment (Matches Header w-20) */}
          <div className="w-16 shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${compact ? 'py-0.5' : 'py-1.5'}`}>
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-3 flex items-center justify-center pr-2">
          {illuImage && (
            <div className="w-full opacity-90 scale-125 origin-center">
              <img 
                src={illuImage} 
                alt={label} 
                className="w-full h-auto object-contain max-h-[55px]"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
        <div className="col-span-9">
          <div className="flex items-baseline gap-1.5 mb-1">
            <div className={`${compact ? 'text-[10px]' : 'text-[11px]'} sidiz-voice-3 text-sidiz-black font-bold leading-tight`}>{label}</div>
            {description && <div className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight">({description})</div>}
          </div>

          {showHeader && (
            <div className="mb-1">
              <DynamicScaleHeader ranges={ranges} labels={labels} unit={unit} />
            </div>
          )}
          <div className={`flex flex-col ${compact ? 'gap-0.5' : 'gap-1'}`}>
            {renderBar(valueL, labelL)}
            {renderBar(valueR, labelR)}
          </div>
        </div>
      </div>

      {meaning && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3" />
          <div className="col-span-9 mt-1">
            <div className="px-2 py-1 bg-slate-50/80 rounded-lg border border-slate-100/50">
              <p className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight italic">
                {meaning.split('\n').filter(l => !l.startsWith('#')).join(' ').trim()}
              </p>
              {RELATED_FEATURES[label] && (
                <p className="text-[7.5px] text-sidiz-blue sidiz-voice-3 font-bold flex items-center gap-1">
                  <span className="text-[9px]">✓</span> 연관 기능: {RELATED_FEATURES[label]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InBodyPelvisDualBarChart({ label, description, valueF, valueB, ranges, labels, unit, showHeader = false, isPdf, meaning, compact, labelF = '전', labelB = '후', illuImage }: { 
  label: string; 
  description?: string;
  valueF: any; 
  valueB: any;
  ranges: number[]; 
  labels: string[];
  unit: string;
  showHeader?: boolean;
  isPdf?: boolean;
  meaning?: string;
  compact?: boolean;
  labelF?: string;
  labelB?: string;
  illuImage?: string;
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const total = max - min;
  
  const getBarColor = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    
    const labelText = labels[segmentIndex] || '';
    return getStatusBarColor(labelText);
  };

  const getStatusText = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    const text = labels[segmentIndex] || '';
    return text.includes('이상') ? text.replace('이상', '높음') : text;
  };

  const renderBar = (valObj: any, sideLabel: string) => {
    if (!valObj) return <div className="flex-1" />;
    const rawVal = valObj.value;
    const dir = valObj.direction;
    // If ranges start with a negative number, assume we want a signed scale
    const val = (ranges[0] < 0 && (dir === 'L' || dir === '왼')) ? -rawVal : rawVal;
    const percentage = Math.min(100, Math.max(0, ((val - min) / total) * 100));
    const containerHeight = compact ? 'h-4' : 'h-5';
    const status = getStatusText(val);
    
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div className={`w-7 shrink-0 flex items-center justify-center ${containerHeight}`}>
            {sideLabel !== '' && (
              <span className="text-[8.5px] sidiz-voice-3 text-sidiz-black font-bold text-center leading-none">{sideLabel}</span>
            )}
          </div>
          <div className={`flex-1 ${containerHeight} flex flex-col justify-center relative`}>
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
              {ranges.slice(0, -1).map((r, i) => {
                const start = ranges[i];
                const end = ranges[i + 1];
                const width = ((end - start) / total) * 100;
                const l = labels[i] || '';
                let bgColor = '#f8fafc';
                if (l.includes('심각')) bgColor = '#fff1f2';
                else if (!l.includes('정상') && !l.includes('표준')) bgColor = '#fff7ed';
                return (
                  <div 
                    key={i} 
                    className="h-full border-r border-slate-200" 
                    style={{ width: `${width}%`, backgroundColor: bgColor }} 
                  />
                );
              })}
            </div>
            
            {/* Scale Markers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {ranges.map((r, i) => (
                <div 
                  key={i} 
                  className="h-full absolute" 
                  style={{ left: `${((r - min) / total) * 100}%`, borderLeft: '1px solid rgba(255, 255, 255, 0.4)' }} 
                />
              ))}
            </div>

            {/* The Bar */}
            <div className={`relative ${compact ? 'h-1.5' : 'h-2'} w-full bg-transparent rounded-full`}>
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPdf ? '' : 'transition-all duration-700'} rounded-full z-10`}
                style={{ width: `${percentage}%`, backgroundColor: getStatusBarColor(status), boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              />
              
              {/* Value Marker Dot */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white z-30 shadow-sm`}
                style={{ left: `calc(${percentage}% - 3px)`, backgroundColor: getStatusBarColor(status) }}
              />
              
              {/* Value Label outside bar area */}
              <div 
                className={`absolute z-20 flex items-center pl-2 pointer-events-none top-1/2 -translate-y-1/2`}
                style={{ left: `${percentage}%`, whiteSpace: 'nowrap' }}
              >
                <span 
                  className="text-[7.5px] font-bold font-eng leading-none"
                  style={{ color: getStatusBarColor(status) }}
                >
                  {[status, (Math.abs(val)?.toFixed(1) || '-')].filter(Boolean).join(' ')}{unit}
                </span>
              </div>
            </div>
          </div>
          {/* Right Spacer for Alignment (Matches Header w-20) */}
          <div className="w-16 shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${compact ? 'py-0.5' : 'py-1.5'}`}>
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-3 flex items-center justify-center pr-2">
          {illuImage && (
            <div className="w-full opacity-90 scale-125 origin-center">
              <img 
                src={illuImage} 
                alt={label} 
                className="w-full h-auto object-contain max-h-[55px]"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
        <div className="col-span-9">
          <div className="flex items-baseline gap-1.5 mb-1">
            <div className={`${compact ? 'text-[10px]' : 'text-[11px]'} sidiz-voice-3 text-sidiz-black font-bold leading-tight`}>{label}</div>
            {description && <div className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight">({description})</div>}
          </div>

          {showHeader && (
            <div className="mb-1">
              <DynamicScaleHeader ranges={ranges} labels={labels} unit={unit} />
            </div>
          )}
          <div className={`flex flex-col ${compact ? 'gap-0.5' : 'gap-1'}`}>
            {renderBar(valueF, labelF)}
            {renderBar(valueB, labelB)}
          </div>
        </div>
      </div>

      {meaning && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3" />
          <div className="col-span-9 mt-1">
            <div className="px-2 py-1 bg-slate-50/80 rounded-lg border border-slate-100/50">
              <p className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight italic">
                {meaning.split('\n').filter(l => !l.startsWith('#')).join(' ').trim()}
              </p>
              {RELATED_FEATURES[label] && (
                <p className="text-[7.5px] text-sidiz-blue sidiz-voice-3 font-bold flex items-center gap-1">
                  <span className="text-[9px]">✓</span> 연관 기능: {RELATED_FEATURES[label]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InBodySingleBarChart({ label, description, value, ranges, labels, unit, showHeader = false, isPdf, meaning, compact, sideLabel = '측정', illuImage }: { 
  label: string; 
  description?: string;
  value: any; 
  ranges: number[]; 
  labels: string[];
  unit: string;
  showHeader?: boolean;
  isPdf?: boolean;
  meaning?: string;
  compact?: boolean;
  sideLabel?: string;
  illuImage?: string;
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const total = max - min;
  
  const getBarColor = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    
    const labelText = labels[segmentIndex] || '';
    return getStatusBarColor(labelText);
  };

  const getStatusText = (val: number) => {
    let segmentIndex = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (val >= ranges[i] && val < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
    }
    if (segmentIndex === -1) {
      if (val < ranges[0]) segmentIndex = 0;
      else segmentIndex = ranges.length - 2;
    }
    const text = labels[segmentIndex] || '';
    return text.includes('이상') ? text.replace('이상', '높음') : text;
  };

  const renderBar = (valObj: any) => {
    const rawVal = typeof valObj === 'object' ? valObj.value : valObj;
    const dir = typeof valObj === 'object' ? valObj.direction : null;
    // If ranges start with a negative number, assume we want a signed scale
    const val = (ranges[0] < 0 && (dir === 'L' || dir === '왼')) ? -rawVal : rawVal;
    const percentage = Math.min(100, Math.max(0, ((val - min) / total) * 100));
    const containerHeight = compact ? 'h-4' : 'h-5';
    const status = getStatusText(val);
    
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div className={`w-7 shrink-0 flex items-center justify-center ${containerHeight}`}>
            {sideLabel !== '' && (
              <span className="text-[8.5px] sidiz-voice-3 text-sidiz-black font-bold text-center leading-none">{sideLabel}</span>
            )}
          </div>
          <div className={`flex-1 ${containerHeight} flex flex-col justify-center relative group`}>
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
              {ranges.slice(0, -1).map((r, i) => {
                const start = ranges[i];
                const end = ranges[i + 1];
                const width = ((end - start) / total) * 100;
                const l = labels[i] || '';
                let bgColor = '#f8fafc';
                if (l.includes('심각')) bgColor = '#fff1f2';
                else if (!l.includes('정상') && !l.includes('표준')) bgColor = '#fff7ed';
                return (
                  <div 
                    key={i} 
                    className="h-full border-r border-slate-200" 
                    style={{ width: `${width}%`, backgroundColor: bgColor }} 
                  />
                );
              })}
            </div>
            
            {/* Scale Markers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {ranges.map((r, i) => (
                <div 
                  key={i} 
                  className="h-full absolute" 
                  style={{ left: `${((r - min) / total) * 100}%`, borderLeft: '1px solid rgba(255, 255, 255, 0.4)' }} 
                />
              ))}
            </div>

            {/* The Bar */}
            <div className={`relative ${compact ? 'h-1.5' : 'h-2'} w-full bg-transparent rounded-full`}>
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPdf ? '' : 'transition-all duration-700'} rounded-full z-10`}
                style={{ width: `${percentage}%`, backgroundColor: getStatusBarColor(status), boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              />
              
              {/* Value Marker Dot */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white z-30 shadow-sm`}
                style={{ left: `calc(${percentage}% - 3px)`, backgroundColor: getStatusBarColor(status) }}
              />
              
              {/* Value Label outside bar area */}
              <div 
                className={`absolute z-20 flex items-center pl-2 pointer-events-none top-1/2 -translate-y-1/2`}
                style={{ left: `${percentage}%`, whiteSpace: 'nowrap' }}
              >
                <span 
                  className="text-[7.5px] font-bold font-eng leading-none"
                  style={{ color: getStatusBarColor(status) }}
                >
                  {[status, (Math.abs(val)?.toFixed(1) || '-')].filter(Boolean).join(' ')}{unit}
                </span>
              </div>
            </div>
          </div>
          {/* Right Spacer for Alignment (Matches Header w-20) */}
          <div className="w-16 shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${compact ? 'py-0.5' : 'py-1.5'}`}>
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-3 flex items-center justify-center pr-2">
          {illuImage && (
            <div className="w-full opacity-90 scale-125 origin-center">
              <img 
                src={illuImage} 
                alt={label} 
                className="w-full h-auto object-contain max-h-[55px]"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
        <div className="col-span-9">
          <div className="flex items-baseline gap-1.5 mb-1">
            <div className={`${compact ? 'text-[10px]' : 'text-[11px]'} sidiz-voice-3 text-sidiz-black font-bold leading-tight`}>{label}</div>
            {description && <div className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight">({description})</div>}
          </div>

          {showHeader && (
            <div className="mb-1">
              <DynamicScaleHeader ranges={ranges} labels={labels} unit={unit} />
            </div>
          )}
          <div className="flex flex-col gap-1">
            {renderBar(value)}
          </div>
        </div>
      </div>

      {meaning && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3" />
          <div className="col-span-9 mt-1">
            <div className="px-2 py-1 bg-slate-50/80 rounded-lg border border-slate-100/50">
              <p className="text-[7.5px] text-sidiz-medium-gray sidiz-voice-1 leading-tight italic">
                {meaning.split('\n').filter(l => !l.startsWith('#')).join(' ').trim()}
              </p>
              {RELATED_FEATURES[label] && (
                <p className="text-[7.5px] text-sidiz-blue sidiz-voice-3 font-bold flex items-center gap-1">
                  <span className="text-[9px]">✓</span> 연관 기능: {RELATED_FEATURES[label]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InBodyBarChart({ label, value, ranges, labels, unit, isPdf }: { 
  label: string; 
  value: number; 
  ranges: number[]; 
  labels: string[];
  unit: string;
  isPdf?: boolean;
}) {
  const maxRange = ranges[ranges.length - 1];
  const percentage = Math.min(100, (value / maxRange) * 100);
  
  const getBarColor = () => {
    let segmentIndex = 1;
    for (let i = 0; i < ranges.length - 1; i++) {
        if (value >= ranges[i] && value < ranges[i+1]) {
            segmentIndex = i;
            break;
        }
    }
    const currentLabel = labels[segmentIndex] || '';
    if (currentLabel.includes('정상') || currentLabel.includes('표준') || currentLabel.includes('중견')) {
      return 'bg-sidiz-black';
    } else if (currentLabel.includes('심각') || currentLabel.includes('이상')) {
      return 'bg-rose-500';
    }
    return 'bg-orange-500';
  };

  const barColor = getBarColor();
  
  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-3 text-[10px] sidiz-voice-3 text-sidiz-medium-gray pt-1">{label}</div>
      <div className="col-span-7">
        <div className="relative h-5 rounded-full flex mb-0.5">
          {/* Background Zones */}
          {labels.map((l, i) => {
            const start = ranges[i];
            const end = ranges[i+1];
            const width = ((end - start) / maxRange) * 100;
            const left = (start / maxRange) * 100;
            
            let zoneStyle = { backgroundColor: '#f1f5f9' }; // bg-slate-100
            if (l.includes('표준') || l.includes('정상')) zoneStyle = { backgroundColor: '#e6ecff' }; // bg-sidiz-blue/10
            else if (l.includes('주의') || l.includes('전만') || l.includes('후만')) zoneStyle = { backgroundColor: '#fff7ed' }; // bg-orange-500/10
            else if (l.includes('심각')) zoneStyle = { backgroundColor: '#fff1f2' }; // bg-rose-500/10

            return (
              <div 
                key={i} 
                className={`absolute top-0 bottom-0 ${i === 0 ? 'rounded-l-full' : ''} ${i === labels.length - 1 ? 'rounded-r-full' : ''}`}
                style={{ left: `${left}%`, width: `${width}%`, ...zoneStyle }}
              />
            );
          })}
          
          {/* Grid Lines */}
          {ranges.slice(1).map((r, i) => (
            <div 
              key={i} 
              className="absolute top-0 bottom-0 z-10" 
              style={{ left: `${(r / maxRange) * 100}%`, borderRight: '1px solid rgba(255, 255, 255, 0.5)' }}
            />
          ))}
          
          {/* Progress Bar Container (for rounded clipping) */}
          <div className="absolute inset-0 rounded-full overflow-hidden z-20">
            <div 
              className={`h-full ${barColor} ${isPdf ? '' : 'transition-all duration-500'} relative`} 
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Value Marker Dot */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white z-40 shadow-sm ${barColor}`}
            style={{ left: `calc(${percentage}% - 3px)` }}
          />
          
          {/* Labels */}
          <div className="absolute inset-0 flex text-[8px] sidiz-voice-3 text-sidiz-medium-gray px-2 items-center pointer-events-none z-30">
            {labels.map((l, i) => (
              <div key={i} className="flex-1 text-center">{l}</div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[7px] text-sidiz-medium-gray font-eng px-0.5">
          {ranges.map((r, i) => (
            <span key={i}>{r}</span>
          ))}
        </div>
      </div>
      <div className="col-span-2 text-left text-[11px] sidiz-voice-3 font-eng text-sidiz-black pt-1 flex items-center gap-1.5">
        <span className="shrink-0">{(value?.toFixed(1) || '-')}{unit}</span>
      </div>
    </div>
  );
}

function InBodyFrontBackTableRow({ label, description, valueF, valueB }: { 
  label: string; 
  description?: string;
  valueF: any; 
  valueB: any;
}) {
  const getStatus = (val: any) => {
    if (val === null || val === undefined) return { label: '-', color: 'text-sidiz-black', display: '-', reference: '-' };
    const v = val.value;
    const dir = val.direction === 'L' ? '왼' : val.direction === 'R' ? '오' : val.direction;
    if (v <= 2) return { label: '정상', color: 'text-sidiz-black', display: `${dir} ${(v?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
    return { label: '이상', color: 'text-rose-500', display: `${dir} ${(v?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
  };

  const statusF = getStatus(valueF);
  const statusB = getStatus(valueB);

  return (
    <tr>
      <td className="py-1 px-1 border border-slate-200 text-sidiz-dark-gray sidiz-voice-3">
        <div className="flex items-center whitespace-nowrap">
          <span className="font-medium">{label}</span>
        </div>
        {description && <div className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 leading-tight mt-0.5">{description}</div>}
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center">
        <div className="flex justify-center gap-1.5 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">전</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusF.display}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">후</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusB.display}</span>
          </div>
        </div>
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center text-sidiz-medium-gray text-[8px] font-eng whitespace-nowrap">{statusF.reference}</td>
      <td className="py-1 px-1 border border-slate-200 text-center">
        <div className="flex justify-center gap-1 whitespace-nowrap">
          <span className={`text-[8px] sidiz-voice-3 ${statusF.color}`}>{statusF.label}</span>
          <span className="text-slate-300">/</span>
          <span className={`text-[8px] sidiz-voice-3 ${statusB.color}`}>{statusB.label}</span>
        </div>
      </td>
    </tr>
  );
}

function InBodyDualTableRow({ label, description, valueL, valueR, isAngle, isSlope, isTilt, isRound, isHead, isThoracic, isLumbar }: { 
  label: string; 
  description?: string;
  valueL: any; 
  valueR: any;
  isAngle?: boolean;
  isSlope?: boolean;
  isTilt?: boolean;
  isRound?: boolean;
  isHead?: boolean;
  isThoracic?: boolean;
  isLumbar?: boolean;
}) {
  const getStatus = (val: any) => {
    if (val === null || val === undefined) return { label: '-', color: 'text-sidiz-black', display: '-', reference: '-' };

    if (isAngle) {
      const v = val || 0;
      const isNormal = Math.abs(v) <= 3;
      let label = '정상';
      let color = 'text-sidiz-black';
      if (v < -3) { label = 'O다리'; color = 'text-rose-500'; }
      else if (v > 3) { label = 'X다리'; color = 'text-rose-500'; }
      return { label, color, display: `${(v?.toFixed(1) || '-') }°`, reference: '±3.0°' };
    }
    if (isSlope) {
      const v = val || 0;
      const isNormal = Math.abs(v - 20) <= 2;
      let label = '중견';
      let color = 'text-sidiz-black';
      if (v > 22) { label = '하견'; color = 'text-rose-500'; }
      if (v < 18) { label = '상견'; color = 'text-rose-500'; }
      return { label, color, display: `${(v?.toFixed(1) || '-') }°`, reference: '18-22°' };
    }
    if (isTilt) {
      const v = val || 0;
      const isNormal = v >= 5 && v <= 8;
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '5.0-8.0°' };
    }
    if (isRound) {
      const v = val || 0;
      if (v <= 30) return { label: '정상', color: 'text-sidiz-black', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
      if (v <= 45) return { label: '주의', color: 'text-amber-600', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
    }
    if (isHead) {
      const v = val || 0;
      if (v <= 40) return { label: '정상', color: 'text-sidiz-black', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
      if (v <= 50) return { label: '주의', color: 'text-amber-600', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
    }
    if (isThoracic) {
      const v = val || 0;
      if (v >= 35 && v <= 45) return { label: '정상', color: 'text-sidiz-black', display: `${(v?.toFixed(1) || '-') }°`, reference: '35.0-45.0°' };
      if ((v >= 30 && v < 35) || (v > 45 && v <= 50)) return { label: '주의', color: 'text-amber-600', display: `${(v?.toFixed(1) || '-') }°`, reference: '35.0-45.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '35.0-45.0°' };
    }
    if (isLumbar) {
      const v = val || 0;
      if (v >= 45 && v <= 55) return { label: '정상', color: 'text-sidiz-black', display: `${(v?.toFixed(1) || '-') }°`, reference: '45.0-55.0°' };
      if ((v >= 40 && v < 45) || (v > 55 && v <= 60)) return { label: '주의', color: 'text-amber-600', display: `${(v?.toFixed(1) || '-') }°`, reference: '45.0-55.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '45.0-55.0°' };
    }
    return { label: '정상', color: 'text-sidiz-black', display: `${(val?.toFixed(1) || '-') }°`, reference: '-' };
  };

  const statusL = getStatus(valueL);
  const statusR = getStatus(valueR);

  const tooltip = label === "어깨 기울기" ? "상견(High)은 어깨 끝이 위로 솟은 형태, 하견(Low)은 아래로 처진 형태를 의미합니다. 승모근 긴장도나 견갑골 위치에 따라 달라집니다." : 
                  label === "흉추 각도" ? "흉추 각도는 등뼈(흉추)의 굽은 정도를 나타냅니다. 표준 범위를 벗어나면 등이 굽어 보이거나 통증을 유발할 수 있습니다." : undefined;

  return (
    <tr>
      <td className="py-1 px-1 border border-slate-200 text-sidiz-dark-gray sidiz-voice-3">
        <div className="flex items-center whitespace-nowrap">
          <span className="font-medium">{label}</span>
        </div>
        {description && <div className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 leading-tight mt-0.5">{description}</div>}
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center">
        <div className="flex justify-center gap-1.5 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">왼</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusL.display}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">오</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusR.display}</span>
          </div>
        </div>
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center text-sidiz-medium-gray text-[8px] font-eng whitespace-nowrap">{statusL.reference}</td>
      <td className="py-1 px-1 border border-slate-200 text-center">
        <div className="flex justify-center gap-1 whitespace-nowrap">
          <span className={`text-[8px] sidiz-voice-3 ${statusL.color}`}>{statusL.label}</span>
          <span className="text-slate-300">/</span>
          <span className={`text-[8px] sidiz-voice-3 ${statusR.color}`}>{statusR.label}</span>
        </div>
      </td>
    </tr>
  );
}

function InBodyTableRow({ label, description, value, isAngle, isSlope, isTilt, isDiff, isRound, isHead }: { 
  label: string; 
  description?: string;
  value: any; 
  isAngle?: boolean;
  isSlope?: boolean;
  isTilt?: boolean;
  isDiff?: boolean;
  isRound?: boolean;
  isHead?: boolean;
}) {
  const getStatus = () => {
    if (value === null || value === undefined) return { label: '-', color: 'text-sidiz-black', display: '-', reference: '-' };

    if (isAngle) {
      const val = value || 0;
      const isNormal = Math.abs(val) <= 3;
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '±3.0°' };
    }
    if (isSlope) {
      const val = value || 0;
      const isNormal = Math.abs(val - 20) <= 2;
      let label = '중견';
      let color = 'text-sidiz-black';
      if (val > 22) { label = '하견'; color = 'text-rose-500'; }
      if (val < 18) { label = '상견'; color = 'text-rose-500'; }
      return { label, color, display: `${(val?.toFixed(1) || '-') }°`, reference: '18-22°' };
    }
    if (isTilt) {
      const val = value || 0;
      const isNormal = val >= 5 && val <= 8;
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '5.0-8.0°' };
    }
    if (isDiff) {
      const val = value || 0;
      const isNormal = val <= 2;
      return { label: isNormal ? '정상' : '이상', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
    }
    if (isRound) {
      const val = value || 0;
      if (val <= 30) return { label: '정상', color: 'text-sidiz-black', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
      if (val <= 45) return { label: '주의', color: 'text-amber-600', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤30.0°' };
    }
    if (isHead) {
      const val = value || 0;
      if (val <= 40) return { label: '정상', color: 'text-sidiz-black', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
      if (val <= 50) return { label: '주의', color: 'text-amber-600', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
      return { label: '심각', color: 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤40.0°' };
    }
    if (typeof value === 'object' && value.direction) {
      const isNormal = value.value <= 2;
      const dir = value.direction === 'L' ? '왼' : value.direction === 'R' ? '오' : value.direction;
      return { label: isNormal ? '정상' : '이상', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${dir} ${(value.value?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
    }
    if (typeof value === 'number') {
      return { label: '정상', color: 'text-sidiz-black', display: `${(value?.toFixed(1) || '-') }°`, reference: '-' };
    }
    return { label: '-', color: 'text-sidiz-black', display: '-', reference: '-' };
  };

  const status = getStatus();

  return (
    <tr>
      <td className="py-1 px-1 border border-slate-200 text-sidiz-dark-gray sidiz-voice-3">
        <div className="font-medium whitespace-nowrap">{label}</div>
        {description && <div className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 leading-tight mt-0.5">{description}</div>}
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center whitespace-nowrap">
        <div className="flex justify-center items-center gap-1.5">
          <span className="font-eng sidiz-voice-3 text-sidiz-black">{status.display}</span>
        </div>
      </td>
      <td className="py-1 px-1 border border-slate-200 text-center text-sidiz-medium-gray text-[8px] font-eng whitespace-nowrap">{status.reference}</td>
      <td className={`py-1 px-1 border border-slate-200 text-center sidiz-voice-3 whitespace-nowrap ${status.color}`}>{status.label}</td>
    </tr>
  );
}
