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
  memo: string;
  productRecommendation: string;
  selectedProductIds?: string[];
  id?: string;
  isPdf?: boolean;
  page?: 1 | 2 | 3;
}

export const PostureReport: React.FC<PostureReportProps> = ({ data, analysisResult, memo, productRecommendation, selectedProductIds = [], id, isPdf, page }) => {
  return (
    <div id={id} className={isPdf ? 'flex flex-col' : ''}>
      {(!page || page === 1) && <Page1 data={data} analysisResult={analysisResult} isPdf={isPdf} />}
      {(!page || page === 2) && (
        <Page2 
          data={data} 
          analysisResult={analysisResult} 
          isPdf={isPdf} 
        />
      )}
      {(!page || page === 3) && (
        <Page3
          data={data}
          analysisResult={analysisResult}
          memo={memo}
          productRecommendation={productRecommendation}
          selectedProductIds={selectedProductIds}
          isPdf={isPdf}
        />
      )}
    </div>
  );
};

const typeLabels: Record<BodyType, string> = {
  [BodyType.TYPE0]: '건강형 (균형형)',
  [BodyType.TYPEA]: '상체 말림형',
  [BodyType.TYPEB]: '좌우 비대칭형',
  [BodyType.TYPEC]: '하체 O다리형',
  [BodyType.TYPED]: '골반-요추 불균형형',
  [BodyType.TYPEE]: '복합 불균형형',
};

const typeImages: Record<BodyType, string> = {
  [BodyType.TYPE0]: '/type_healthy.png',
  [BodyType.TYPEA]: '/type_rounded_shoulder.png',
  [BodyType.TYPEB]: '/type_asymmetry.png',
  [BodyType.TYPEC]: '/type_o_leg.png',
  [BodyType.TYPED]: '/type_pelvis_lumbar.png',
  [BodyType.TYPEE]: '/type_complex.png',
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
  <div className="absolute bottom-6 left-12 right-12 pt-4 border-t border-sidiz-medium-gray flex justify-between items-end bg-white">
    <div className="text-left">
      <p className="text-[8px] text-sidiz-medium-gray sidiz-voice-1">본 결과지는 참고용이며 전문 의료진의 진단을 대신할 수 없습니다.</p>
    </div>
    <div className="text-right">
      <p className="text-[10px] sidiz-voice-3 text-sidiz-medium-gray font-eng uppercase tracking-widest">Sidiz The Progressive</p>
    </div>
  </div>
);

const Page1 = ({ data, analysisResult, isPdf }: { data: PostureData; analysisResult: AnalysisResult; isPdf?: boolean }) => (
    <div 
      className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden mb-8'}`} 
      style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
    <div className="px-12 py-10">
      {/* Thin Info Bar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-6">
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
      <div className="flex flex-col gap-3">
        {/* Top Section: User Info */}
        <div className="border-b border-indigo-50 pb-2">
          <div className="mb-1">
            <h2 className="text-[14px] sidiz-voice-3 text-sidiz-black font-bold">
              {data.userInfo.name || '고객'}님의 체형 분석 결과 리포트입니다.
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 sidiz-voice-3 uppercase tracking-wider mb-0.5">성별</span>
              <span className="text-[13px] text-slate-800 sidiz-voice-3 font-medium">{data.userInfo.gender || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 sidiz-voice-3 uppercase tracking-wider mb-0.5">연령</span>
              <span className="text-[13px] text-slate-800 sidiz-voice-3 font-medium">{data.userInfo.age ? `${data.userInfo.age}세` : '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 sidiz-voice-3 uppercase tracking-wider mb-0.5">키</span>
              <span className="text-[13px] text-slate-800 sidiz-voice-3 font-medium">{data.userInfo.height ? `${data.userInfo.height}cm` : '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 sidiz-voice-3 uppercase tracking-wider mb-0.5">몸무게</span>
              <span className="text-[13px] text-slate-800 sidiz-voice-3 font-medium">{data.userInfo.weight ? `${data.userInfo.weight}kg` : '-'}</span>
            </div>
          </div>
        </div>

        {/* Score & Ranking Section */}
        <div className="flex justify-between items-end border-b border-indigo-50 pb-4">
          <div className="text-left">
            <h2 className="text-[9px] sidiz-voice-3 text-indigo-400 uppercase sidiz-headline mb-0.5">종합 체형 점수</h2>
            <div className="flex items-baseline">
              <span className="text-4xl sidiz-voice-2 text-indigo-600 font-eng leading-none">{analysisResult.overallScore}</span>
              <span className="text-lg sidiz-voice-3 text-indigo-400 ml-2 font-eng">/ 100</span>
            </div>
          </div>
          
          {data.topPercent !== null && (
            <div className="text-right">
              <h2 className="text-[9px] sidiz-voice-3 text-indigo-400 uppercase sidiz-headline mb-1">체형 랭킹</h2>
              <div className="flex items-baseline justify-end">
                <span className="text-3xl sidiz-voice-2 text-indigo-600 font-eng leading-none">100명 중 {data.topPercent}등</span>
                <span className="text-lg sidiz-voice-3 text-indigo-400 ml-1 font-eng">입니다.</span>
              </div>
            </div>
          )}
        </div>

        {/* Middle Section: Data Analysis */}
        <div className="space-y-4">
          {/* 1. 핵심 분석 지표 (Priority 1 - Combined with Posture Alignment) */}
          <section>
            <div className="flex items-center gap-2 mb-1 border-b-2 border-sidiz-black pb-1">
              <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">핵심 분석 지표</h2>
              <span className="text-[8px] text-sidiz-medium-gray sidiz-voice-1 ml-auto">* 주요 항목별 정렬 상태 및 분석 요약</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-slate-100 mt-2 pt-2">
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
              />
              <InBodyDualBarChart 
                label="흉추 각도" 
                description="등뼈(흉추)의 굽은 정도"
                valueL={data.sideLeft.thoracic || 0} 
                valueR={data.sideRight.thoracic || 0} 
                ranges={[20, 35, 45, 60]} 
                labels={['정상', '주의', '심각']}
                unit="°" 
                showHeader={true}
                isPdf={isPdf}
                meaning={analysisResult.keyMetrics.find(m => m.label.includes('흉추 각도'))?.meaning}
              />
              <InBodyDualBarChart 
                label="거북목" 
                description="경추가 앞으로 돌출된 정도"
                valueL={data.sideLeft.forwardHead || 0} 
                valueR={data.sideRight.forwardHead || 0} 
                ranges={[0, 40, 50, 60]} 
                labels={['정상', '주의', '심각']}
                unit="°" 
                showHeader={true}
                isPdf={isPdf}
                meaning={analysisResult.keyMetrics.find(m => m.label.includes('거북목'))?.meaning}
              />
              <InBodyPelvisDualBarChart 
                label="골반 수평"
                description="좌우 골반의 높낮이 차이"
                valueF={data.front.pelvisHorizontal}
                valueB={data.back.pelvisHorizontal}
                ranges={[0, 2, 4, 6]}
                labels={['정상', '주의', '심각']}
                unit="°"
                showHeader={true}
                isPdf={isPdf}
                meaning={analysisResult.keyMetrics.find(m => m.label.includes('골반 수평'))?.meaning}
              />
            </div>
          </section>

          {/* 3. 자세 측정 데이터 상세 (Priority 3 - Technical Data) */}
          <section>
            <div className="flex items-center gap-2 mb-2 border-b-2 border-sidiz-black pb-1">
              <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">자세 측정 데이터 상세</h2>
              <span className="text-[8px] text-sidiz-medium-gray sidiz-voice-1 ml-auto">* 정밀 측정 수치 및 상태</span>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6">
              <div className="grid grid-cols-2 gap-x-4">
                {/* 어깨/목 */}
                <div>
                  <h3 className="text-[9px] sidiz-voice-3 text-sidiz-black mb-1 px-1">어깨 및 목</h3>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <table className="w-full text-[8px] border-collapse">
                      <thead>
                        <tr className="bg-sidiz-core-light text-sidiz-dark-gray sidiz-voice-3">
                          <th className="py-1 px-1 text-left border-b border-r border-slate-200 last:border-r-0">측정 항목</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">측정 수치</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">정상 범위</th>
                          <th className="py-1 px-1 text-center border-b border-slate-200">상태(왼/오)</th>
                        </tr>
                      </thead>
                      <tbody className="sidiz-voice-1">
                        <InBodyDualTableRow label="어깨 기울기" description="어깨 끝점의 각도를 통해 어깨 상태를 판별합니다." valueL={data.front.leftShoulderSlope} valueR={data.front.rightShoulderSlope} isSlope />
                        <InBodyDualTableRow label="라운드 숄더" description="어깨가 앞으로 말려 있는 상태를 측정합니다." valueL={data.sideLeft.roundShoulder} valueR={data.sideRight.roundShoulder} isRound />
                        <InBodyDualTableRow label="거북목" description="경추가 앞으로 돌출된 정도를 측정합니다." valueL={data.sideLeft.forwardHead} valueR={data.sideRight.forwardHead} isHead />
                        <InBodyFrontBackTableRow label="어깨 수평" description="좌우 어깨 끝점의 높이 차이를 측정합니다." valueF={data.front.shoulderHorizontal} valueB={data.back.shoulderHorizontal} />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 골반 */}
                <div>
                  <h3 className="text-[9px] sidiz-voice-3 text-sidiz-black mb-1 px-1">골반</h3>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <table className="w-full text-[8px] border-collapse">
                      <thead>
                        <tr className="bg-sidiz-core-light text-sidiz-dark-gray sidiz-voice-3">
                          <th className="py-1 px-1 text-left border-b border-r border-slate-200 last:border-r-0">측정 항목</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">측정 수치</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">정상 범위</th>
                          <th className="py-1 px-1 text-center border-b border-slate-200">상태(왼/오)</th>
                        </tr>
                      </thead>
                      <tbody className="sidiz-voice-1">
                        <InBodyDualTableRow label="골반 전방경사" description="골반이 앞뒤로 기울어진 각도를 측정합니다." valueL={data.sideLeft.pelvisTilt} valueR={data.sideRight.pelvisTilt} isTilt />
                        <InBodyFrontBackTableRow label="골반 수평 각도" description="좌우 골반의 높낮이 차이를 전/후면에서 측정합니다." valueF={data.front.pelvisHorizontal} valueB={data.back.pelvisHorizontal} />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                {/* 무릎/다리 */}
                <div>
                  <h3 className="text-[9px] sidiz-voice-3 text-sidiz-black mb-1 px-1">무릎 및 다리</h3>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <table className="w-full text-[8px] border-collapse">
                      <thead>
                        <tr className="bg-sidiz-core-light text-sidiz-dark-gray sidiz-voice-3">
                          <th className="py-1 px-1 text-left border-b border-r border-slate-200 last:border-r-0">측정 항목</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">측정 수치</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">정상 범위</th>
                          <th className="py-1 px-1 text-center border-b border-slate-200">상태(왼/오)</th>
                        </tr>
                      </thead>
                      <tbody className="sidiz-voice-1">
                        <InBodyDualTableRow label="다리 각도" description="다리가 벌어지거나 모아진 정도를 측정합니다." valueL={data.front.leftLegAngle} valueR={data.front.rightLegAngle} isAngle />
                        <InBodyTableRow label="무릎 수평 (후면)" description="후면에서 측정한 좌우 무릎의 높이 차이입니다." value={data.back.kneeHorizontal} />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 척추 */}
                <div>
                  <h3 className="text-[9px] sidiz-voice-3 text-sidiz-black mb-1 px-1">척추 각도</h3>
                  <div className="rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <table className="w-full text-[8px] border-collapse">
                      <thead>
                        <tr className="bg-sidiz-core-light text-sidiz-dark-gray sidiz-voice-3">
                          <th className="py-1 px-1 text-left border-b border-r border-slate-200 last:border-r-0">측정 항목</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">측정 수치</th>
                          <th className="py-1 px-1 text-center border-b border-r border-slate-200 last:border-r-0">정상 범위</th>
                          <th className="py-1 px-1 text-center border-b border-slate-200">상태(왼/오)</th>
                        </tr>
                      </thead>
                      <tbody className="sidiz-voice-1">
                        <InBodyDualTableRow label="흉추 각도" description="등뼈(흉추)의 굽은 정도를 나타냅니다." valueL={data.sideLeft.thoracic} valueR={data.sideRight.thoracic} isThoracic />
                        <InBodyDualTableRow label="요추 각도" description="허리뼈(요추)의 굽은 정도를 나타냅니다." valueL={data.sideLeft.lumbar} valueR={data.sideRight.lumbar} isLumbar />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Radar Chart Component to prevent re-renders and infinite loops
const PostureRadarChart = React.memo(({ data, isPdf }: { data: any[]; isPdf?: boolean }) => {
  const hasCaution = data.some(d => d.value < 60);
  
  const chartContent = (
    <RadarChart 
      cx={isPdf ? 80 : "50%"} 
      cy={isPdf ? 70 : "50%"} 
      outerRadius={isPdf ? 45 : "55%"} 
      width={isPdf ? 160 : undefined}
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
        <div className="h-[140px] w-[160px] relative">
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
    <div className="px-10 py-8">
      <div className="flex flex-col gap-4">
        {/* 종합 체형 분석 결과 */}
        <section>
          <div className="flex items-center gap-2 mb-1 border-b-2 border-sidiz-black pb-1">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">종합 체형 분석 결과</h2>
          </div>
          <p className="text-[8px] text-sidiz-medium-gray sidiz-voice-1 mb-3 leading-relaxed">
            시디즈 의자연구소가 축적한 방대한 사용자 행동 패턴과 체형 데이터를 바탕으로, 당신의 현재 상태를 객관적이고 과학적으로 분석합니다.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-6 border-b border-slate-100 pb-2">
              <div className="flex-1">
                <p className="text-[8px] text-sidiz-medium-gray sidiz-voice-3 uppercase mb-0.5 font-eng tracking-wider">Main Body Type</p>
                <h3 className="text-[18px] sidiz-voice-3 sidiz-headline text-indigo-600 mb-1">{typeLabels[analysisResult.mainType]}</h3>
                <p className="text-[10px] text-sidiz-black sidiz-voice-3 leading-tight">
                  {analysisResult.description}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center">
                <PostureRadarChart data={analysisResult.radarData} isPdf={isPdf} />
                <p className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 text-center mt-0.5">자세별 균형 분포</p>
              </div>
            </div>

            {/* Fixed Illustration/Image Section - Maintained Aspect Ratio */}
            <div className="my-0.5 flex justify-center w-full bg-white">
              <img 
                src={typeImages[analysisResult.mainType]} 
                alt={typeLabels[analysisResult.mainType]} 
                className="w-full h-auto max-h-64 object-contain block"
                referrerPolicy="no-referrer"
                style={{ minHeight: '200px' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-0 mb-0 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {/* 체형 특징 섹션 */}
              <div className="p-4 flex flex-col bg-white border-r border-slate-200">
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                  <h4 className="text-[10px] sidiz-voice-3 text-sidiz-black flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    체형 특징
                  </h4>
                </div>
                <ul className="text-[9px] text-sidiz-dark-gray sidiz-voice-1 space-y-1.5 pl-1 mb-3 flex-1">
                  {analysisResult.bodyFeatures.map((f, i) => <li key={i} className="flex gap-2 leading-relaxed"><span>•</span>{f}</li>)}
                </ul>
                <div className="pt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-sidiz-black sidiz-voice-3 leading-relaxed">
                    <span className="text-indigo-600 mr-1">소견:</span>
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* 앉음 습관 문제 섹션 */}
              <div className="p-4 flex flex-col bg-white">
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                  <h4 className="text-[10px] sidiz-voice-3 text-sidiz-black flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    앉음 습관 문제
                  </h4>
                </div>
                <ul className="text-[9px] text-sidiz-dark-gray sidiz-voice-1 space-y-1.5 pl-1 mb-3 flex-1">
                  {analysisResult.sittingHabits.map((h, i) => <li key={i} className="flex gap-2 leading-relaxed"><span>•</span>{h}</li>)}
                </ul>
                <div className="pt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-sidiz-black sidiz-voice-3 leading-relaxed">
                    <span className="text-orange-600 mr-1">원인:</span>
                    {analysisResult.cause}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 bg-indigo-950 text-white rounded-xl">
              <p className="text-[10px] sidiz-voice-3 leading-tight">
                <span className="text-indigo-300 mr-2 font-eng tracking-widest">CORE INSIGHT:</span>
                {analysisResult.coreMessage}
              </p>
            </div>
          </div>
        </section>

        {/* 맞춤형 개선 가이드 */}
        <section>
          <div className="flex items-center gap-2 mb-3 border-b-2 border-sidiz-black pb-1">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">맞춤형 개선 가이드</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="grid grid-cols-2 gap-10">
                <div className="pr-6 border-r border-slate-100">
                  <p className="text-[10px] sidiz-voice-3 text-emerald-600 mb-4 flex items-center gap-1.5 font-bold">
                    생활 및 교정 습관
                  </p>
                  <ul className="text-[10px] text-sidiz-dark-gray sidiz-voice-1 space-y-3 tracking-tighter">
                    {[...analysisResult.lifeHabits, ...analysisResult.maintenanceStrategy].map((h, i) => (
                      <li key={i} className="flex gap-2 items-start leading-tight">
                        <CheckCircle2 size={12} className="mt-0.5 text-emerald-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pl-6">
                  <p className="text-[10px] sidiz-voice-3 text-rose-500 mb-4 flex items-center gap-1.5 font-bold">
                    피해야 할 습관
                  </p>
                  <ul className="text-[10px] text-sidiz-dark-gray sidiz-voice-1 space-y-3 tracking-tighter">
                    {analysisResult.avoidHabits.map((h, i) => (
                      <li key={i} className="flex gap-2 items-start leading-tight">
                        <AlertCircle size={12} className="mt-0.5 text-rose-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
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

const Page3 = ({ data, analysisResult, memo, productRecommendation, selectedProductIds = [], isPdf }: { 
  data: PostureData; 
  analysisResult: AnalysisResult; 
  memo: string; 
  productRecommendation: string; 
  selectedProductIds?: string[];
  isPdf?: boolean 
}) => {
  const recommendedProductIds = selectedProductIds.length > 0 
    ? selectedProductIds 
    : analysisResult.recommendedProductIds;

  const recommendedProducts = PRODUCTS.filter(p => recommendedProductIds.includes(p.id));

  return (
    <div 
      className={`bg-white font-sans text-slate-900 ${isPdf ? 'relative' : 'rounded-[32px] border border-slate-100 overflow-hidden'}`} 
      style={isPdf ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '794px', margin: '0 auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
    <div className="px-12 py-6">
      <div className="flex flex-col gap-6">
        {/* 3. 시디즈 솔루션 & 메모 & 제품 추천 */}
        <section>
          <div className="flex items-center gap-2 mb-3 border-b-2 border-sidiz-black pb-1">
            <h2 className="text-xs sidiz-voice-3 sidiz-headline text-sidiz-black">시디즈 솔루션 및 상담 결과</h2>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl sidiz-voice-3 text-sidiz-black">Sitting Expert Picks</h3>
                </div>
                <div className={`grid ${recommendedProducts.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                              <h4 className="text-xl sidiz-voice-3 text-sidiz-black font-eng truncate">{product.name}</h4>
                            </div>
                            {isPdf && (
                              <div className="shrink-0 bg-slate-50 p-0.5 rounded border border-slate-100">
                                <QRCodeSVG value={product.url} size={28} />
                              </div>
                            )}
                          </div>
                          <p className="text-[8px] text-sidiz-dark-gray leading-tight sidiz-voice-1 mb-2">{product.description}</p>
                          {product.tip && (
                            <div className="mt-1 p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                              <span className="text-[9px] sidiz-voice-3 text-indigo-700 block mb-1 font-bold">SE Tip!</span>
                              <p className="text-[8px] text-sidiz-black leading-relaxed sidiz-voice-1 font-medium bg-indigo-100/50 px-1 rounded">
                                {product.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-1.5 border-t border-slate-50">
                        {!isPdf && (
                          <a 
                            href={product.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <ShoppingBag size={10} />
                            <span className="text-[9px] sidiz-voice-3">상세 보기</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm sidiz-voice-3 text-sidiz-black">전문가 상담 메모</h3>
                </div>
                <div className="bg-white p-3 rounded-xl min-h-[80px] border border-slate-100">
                  <p className="text-[10px] text-sidiz-dark-gray leading-relaxed whitespace-pre-wrap sidiz-voice-1">
                    {memo || "입력된 상담 메모가 없습니다."}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="bg-indigo-950 text-white p-4 rounded-[32px] relative overflow-hidden shadow-xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-32 -mt-32 opacity-20 blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 rounded-full -ml-24 -mb-24 opacity-10 blur-[60px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-px bg-indigo-500"></div>
                    <span className="text-[10px] font-eng tracking-[0.2em] text-indigo-400 uppercase font-bold">PROGRESSIVE SITTING EXPERIENCE</span>
                  </div>
                  
                  <div className="mb-0">
                    <h3 className="text-[11px] sidiz-voice-3 leading-relaxed text-indigo-50">
                      시디즈는 최상의 의자 위 경험을 선물합니다.<br />
                      그 경험이 모여 '자기다움'을 찾아가는 여정이 되고,<br />
                      끊임없이 나아가는 이 발전적인 여정에는 끝이 없습니다.
                    </h3>
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
    <div className="relative h-4 w-full flex">
      {/* Offset to align with bars (L/R label width + gap) */}
      <div className="w-[14px] shrink-0" /> 
      
      <div className="flex-1 relative">
        {/* Labels with Ranges */}
        <div className="absolute bottom-0 inset-x-0 h-4 flex items-end pb-0.5 pointer-events-none">
          {labels.map((l, i) => {
            const start = ranges[i];
            const end = ranges[i + 1];
            const width = ((end - start) / total) * 100;
            const left = ((start - min) / total) * 100;
            return (
              <div 
                key={i} 
                className={`absolute text-[6px] sidiz-voice-3 text-sidiz-medium-gray text-center border-r border-slate-200 last:border-r-0 flex flex-col justify-end leading-none`}
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                <span className="font-bold">{l}</span>
                <span className="text-[6px] opacity-80">{start}-{end}{unit}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Right offset for values (w-16 label + gap-1.5) */}
      <div className="w-[70px] shrink-0" />
    </div>
  );
}

function InBodyDualBarChart({ label, description, valueL, valueR, ranges, labels, unit, showHeader = false, isPdf, meaning }: { 
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
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const total = max - min;
  
  const getBarColor = (val: number) => {
    if (val < ranges[1]) return '#343638'; // Normal (sidiz-black)
    if (val < ranges[2]) return '#f59e0b'; // Caution (amber-500)
    return '#f43f5e'; // Severe (rose-500)
  };

  const isAbnormal = valueL >= ranges[1] || valueR >= ranges[1];
  const tipData = Object.entries(CHAIR_TIPS).find(([key]) => label.includes(key))?.[1];

  const renderBar = (val: number, side: '왼' | '오') => {
    const percentage = Math.min(100, Math.max(0, ((val - min) / total) * 100));
    
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] sidiz-voice-3 text-sidiz-medium-gray w-2 shrink-0">{side}</span>
          <div className="flex-1 h-5 flex flex-col justify-center relative">
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
              {ranges.slice(0, -1).map((r, i) => {
                const start = ranges[i];
                const end = ranges[i + 1];
                const width = ((end - start) / total) * 100;
                const bgColors = ['#f8fafc', '#fff7ed', '#fff1f2']; // slate-50, orange-50, rose-50
                return (
                  <div 
                    key={i} 
                    className="h-full border-r border-slate-200" 
                    style={{ width: `${width}%`, backgroundColor: bgColors[i] || '#f8fafc' }} 
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
            <div className="relative h-2 w-full bg-transparent">
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPdf ? '' : 'transition-all duration-700'} rounded-full z-10`}
                style={{ width: `${percentage}%`, backgroundColor: getBarColor(val), boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              />
            </div>
          </div>
          {/* Value Indicator - Moved to the right side and left-aligned */}
          <div className="w-16 text-left shrink-0">
            <span className="text-[9px] sidiz-voice-3 font-eng text-sidiz-black leading-tight block">{(val?.toFixed(1) || '-')}</span>
            <span className="text-[6px] text-sidiz-medium-gray block -mt-0.5">{unit}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-3 items-start py-2 border-b border-slate-50">
      <div className="col-span-3">
        <div className="text-[10px] sidiz-voice-3 text-sidiz-black font-bold leading-tight">{label}</div>
        {description && <div className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 leading-tight mt-0.5">{description}</div>}
      </div>
      <div className="col-span-9">
        {showHeader && (
          <div className="mb-1">
            <DynamicScaleHeader ranges={ranges} labels={labels} unit={unit} />
          </div>
        )}
        <div className="flex flex-col gap-1">
          {renderBar(valueL, '왼')}
          {renderBar(valueR, '오')}
        </div>
        
        {/* Fixed height container for meaning and tips */}
        <div className="mt-1.5 min-h-[75px] flex flex-col gap-1">
          {meaning ? (
            <div className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[8px] text-sidiz-medium-gray sidiz-voice-1 leading-tight italic">
                {meaning}
              </p>
            </div>
          ) : (
            <div className="px-2 py-1 bg-transparent border border-transparent">
              <p className="text-[8px] text-transparent leading-tight italic">Spacer</p>
            </div>
          )}
          
          {tipData ? (
            <div className="p-1.5 bg-indigo-50 rounded-lg border-l-2 border-indigo-500 shadow-sm">
              <div className="flex items-center gap-1 mb-0.5">
                <Armchair size={8} className="text-indigo-500" />
                <span className="text-[7px] sidiz-voice-3 text-indigo-700 font-bold tracking-tight">의자 고르는 Tip!</span>
              </div>
              <div className="bg-white/50 p-1 rounded border border-indigo-100/50">
                <p className="text-[7px] text-sidiz-black leading-tight sidiz-voice-1 font-bold mb-0.5">
                  {tipData.title}
                </p>
                <ul className="space-y-0">
                  {tipData.items.map((item, idx) => (
                    <li key={idx} className="text-[6px] text-sidiz-dark-gray sidiz-voice-1 flex items-start gap-1">
                      <span className="text-indigo-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-transparent border-l-2 border-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}

function InBodyPelvisDualBarChart({ label, description, valueF, valueB, ranges, labels, unit, showHeader = false, isPdf, meaning }: { 
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
}) {
  const min = ranges[0];
  const max = ranges[ranges.length - 1];
  const total = max - min;
  
  const getBarColor = (val: number) => {
    if (val < ranges[1]) return '#343638'; // Normal (sidiz-black)
    if (val < ranges[2]) return '#f59e0b'; // Caution (amber-500)
    return '#f43f5e'; // Severe (rose-500)
  };

  const isAbnormal = (valueF?.value >= ranges[1]) || (valueB?.value >= ranges[1]);
  const tipData = Object.entries(CHAIR_TIPS).find(([key]) => label.includes(key))?.[1];

  const renderBar = (valObj: any, sideLabel: string) => {
    if (!valObj) return <div className="flex-1" />;
    const val = valObj.value;
    const dir = valObj.direction;
    const percentage = Math.min(100, Math.max(0, ((val - min) / total) * 100));
    
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] sidiz-voice-3 text-sidiz-medium-gray w-2 shrink-0">{sideLabel}</span>
          <div className="flex-1 h-5 flex flex-col justify-center relative">
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
              {ranges.slice(0, -1).map((r, i) => {
                const start = ranges[i];
                const end = ranges[i + 1];
                const width = ((end - start) / total) * 100;
                const bgColors = ['#f8fafc', '#fff7ed', '#fff1f2']; // slate-50, orange-50, rose-50
                return (
                  <div 
                    key={i} 
                    className="h-full border-r border-slate-200" 
                    style={{ width: `${width}%`, backgroundColor: bgColors[i] || '#f8fafc' }} 
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
            <div className="relative h-2 w-full bg-transparent">
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPdf ? '' : 'transition-all duration-700'} rounded-full z-10`}
                style={{ width: `${percentage}%`, backgroundColor: getBarColor(val), boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
              />
            </div>
          </div>
          <div className="w-16 text-left shrink-0 leading-[1.1]">
            <span className="text-[8px] sidiz-voice-3 text-sidiz-black block">
              {dir === 'L' || dir === '왼' ? '왼쪽' : dir === 'R' || dir === '오' ? '오른쪽' : dir === 'F' || dir === '전' ? '전면' : '후면'}
            </span>
            <span className="text-[8px] sidiz-voice-3 text-sidiz-black block">
              {dir === 'F' || dir === '전' || dir === 'B' || dir === '후' ? '각도' : '기울임'} {(val?.toFixed(1) || '-')}{unit}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-3 items-start py-2 border-b border-slate-50">
      <div className="col-span-3">
        <div className="text-[10px] sidiz-voice-3 text-sidiz-black font-bold leading-tight">{label}</div>
        {description && <div className="text-[7px] text-sidiz-medium-gray sidiz-voice-1 leading-tight mt-0.5">{description}</div>}
      </div>
      <div className="col-span-9">
        {showHeader && (
          <div className="mb-1">
            <DynamicScaleHeader ranges={ranges} labels={labels} unit={unit} />
          </div>
        )}
        <div className="flex flex-col gap-1">
          {renderBar(valueF, '전')}
          {renderBar(valueB, '후')}
        </div>
        
        {/* Fixed height container for meaning and tips */}
        <div className="mt-1.5 min-h-[75px] flex flex-col gap-1">
          {meaning ? (
            <div className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[8px] text-sidiz-medium-gray sidiz-voice-1 leading-tight italic">
                {meaning}
              </p>
            </div>
          ) : (
            <div className="px-2 py-1 bg-transparent border border-transparent">
              <p className="text-[8px] text-transparent leading-tight italic">Spacer</p>
            </div>
          )}
          
          {tipData ? (
            <div className="p-1.5 bg-indigo-50 rounded-lg border-l-2 border-indigo-500 shadow-sm">
              <div className="flex items-center gap-1 mb-0.5">
                <Armchair size={8} className="text-indigo-500" />
                <span className="text-[7px] sidiz-voice-3 text-indigo-700 font-bold tracking-tight">의자 고르는 Tip!</span>
              </div>
              <div className="bg-white/50 p-1 rounded border border-indigo-100/50">
                <p className="text-[7px] text-sidiz-black leading-tight sidiz-voice-1 font-bold mb-0.5">
                  {tipData.title}
                </p>
                <ul className="space-y-0">
                  {tipData.items.map((item, idx) => (
                    <li key={idx} className="text-[6px] text-sidiz-dark-gray sidiz-voice-1 flex items-start gap-1">
                      <span className="text-indigo-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-transparent border-l-2 border-transparent" />
          )}
        </div>
      </div>
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
    let segmentIndex = 0;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (value >= ranges[i] && value < ranges[i+1]) {
        segmentIndex = i;
        break;
      }
      if (i === ranges.length - 2 && value >= ranges[i+1]) {
        segmentIndex = i;
      }
    }
    
    const currentLabel = labels[segmentIndex];
    if (currentLabel.includes('정상') || currentLabel.includes('표준')) {
      return 'bg-sidiz-blue';
    } else if (currentLabel.includes('주의') || currentLabel.includes('전만') || currentLabel.includes('후만')) {
      return 'bg-orange-500';
    } else if (currentLabel.includes('심각')) {
      return 'bg-rose-500';
    }
    return 'bg-sidiz-dark-gray';
  };

  const barColor = getBarColor();
  
  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-3 text-[10px] sidiz-voice-3 text-sidiz-medium-gray pt-1">{label}</div>
      <div className="col-span-7">
        <div className="relative h-5 rounded-full overflow-hidden flex mb-0.5">
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
                className="absolute top-0 bottom-0"
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
          
          {/* Progress Bar */}
          <div 
            className={`h-full ${barColor} ${isPdf ? '' : 'transition-all duration-500'} relative z-20`} 
            style={{ width: `${percentage}%` }}
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
      <div className="col-span-2 text-left text-[11px] sidiz-voice-3 font-eng text-sidiz-black pt-1">{(value?.toFixed(1) || '-')}{unit}</div>
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
    if (v <= 4) return { label: '주의', color: 'text-amber-600', display: `${dir} ${(v?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
    return { label: '심각', color: 'text-rose-500', display: `${dir} ${(v?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
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
          <div className="flex items-center gap-0.5">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">전</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusF.display}</span>
          </div>
          <div className="flex items-center gap-0.5">
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
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(v?.toFixed(1) || '-') }°`, reference: '±3.0°' };
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
          <div className="flex items-center gap-0.5">
            <span className="text-[7px] text-sidiz-medium-gray sidiz-voice-3">왼</span>
            <span className="font-eng sidiz-voice-3 text-sidiz-black">{statusL.display}</span>
          </div>
          <div className="flex items-center gap-0.5">
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
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${(val?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
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
      return { label: isNormal ? '정상' : '심각', color: isNormal ? 'text-sidiz-black' : 'text-rose-500', display: `${dir} ${(value.value?.toFixed(1) || '-') }°`, reference: '≤2.0°' };
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
      <td className="py-1 px-1 border border-slate-200 text-center font-eng sidiz-voice-3 text-sidiz-black whitespace-nowrap">{status.display}</td>
      <td className="py-1 px-1 border border-slate-200 text-center text-sidiz-medium-gray text-[8px] font-eng whitespace-nowrap">{status.reference}</td>
      <td className={`py-1 px-1 border border-slate-200 text-center sidiz-voice-3 whitespace-nowrap ${status.color}`}>{status.label}</td>
    </tr>
  );
}
