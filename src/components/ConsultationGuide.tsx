import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Activity, 
  Lightbulb, 
  ShoppingBag,
  Info,
  ArrowRight,
  Quote,
  Plus
} from 'lucide-react';
import Markdown from 'react-markdown';
import { CONSULTATION_STEPS, GUIDE_DATA, GuideItem } from '../data/consultationData';

export default function ConsultationGuide() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = CONSULTATION_STEPS[currentStepIndex];

  // Filter data for current step
  const stepData = useMemo(() => {
    return GUIDE_DATA.filter(item => item.category1 === currentStep);
  }, [currentStep]);

  // Group by category2
  const groupedData = useMemo(() => {
    const groups: Record<string, GuideItem[]> = {};
    stepData.forEach(item => {
      if (!groups[item.category2]) {
        groups[item.category2] = [];
      }
      groups[item.category2].push(item);
    });
    return groups;
  }, [stepData]);

  const handleSelect = (category2: string, condition: string) => {
    setSelections(prev => ({
      ...prev,
      [`${currentStep}-${category2}`]: condition
    }));
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return <UserPlus size={20} />;
      case 1: return <Activity size={20} />;
      case 2: return <Lightbulb size={20} />;
      case 3: return <ShoppingBag size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  // Reset scroll when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStepIndex]);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Left Vertical Stepper */}
      <div className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col p-6 pt-12 shrink-0">
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Consultation Flow</h2>
          <div className="h-1 w-12 bg-indigo-600 rounded-full" />
        </div>
        
        <div className="space-y-4 relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-200" />
          
          {CONSULTATION_STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <button
                key={step}
                onClick={() => setCurrentStepIndex(index)}
                className="flex items-start gap-4 group relative z-10 text-left w-full"
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                      : isCompleted
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : getStepIcon(index)}
                </div>
                <div className="pt-1">
                  <span className={`text-xs sidiz-voice-3 block mb-0.5 ${
                    isActive ? 'text-indigo-600 font-bold' : 'text-slate-400'
                  }`}>
                    Step 0{index + 1}
                  </span>
                  <span className={`text-sm sidiz-voice-3 leading-tight transition-colors ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    {step}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Info size={16} />
            <span className="text-xs font-bold">상담 팁</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            고객의 비언어적 표현을 관찰하며 자연스럽게 대화를 이끌어주세요.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Step Title Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-2xl sidiz-voice-3 sidiz-headline text-slate-900">{currentStep}</h1>
            <p className="text-slate-400 text-sm mt-1">고객 맞춤형 상담을 위한 가이드 대본입니다.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(CONSULTATION_STEPS.length - 1, prev + 1))}
              disabled={currentStepIndex === CONSULTATION_STEPS.length - 1}
              className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Content Slider */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full space-y-12 pb-20"
            >
              {(Object.entries(groupedData) as [string, GuideItem[]][]).map(([category2, items]) => {
                const isBranch = items.some(item => item.type === 'branch');
                const selectedCondition = selections[`${currentStep}-${category2}`];
                
                return (
                  <section key={category2} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase">
                        {category2}
                      </div>
                      <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    <div className="grid gap-6">
                      {items.map((item, idx) => {
                        if (item.type === 'main') {
                          return (
                            <div key={idx} className="group relative">
                              {item.category3 && item.category3 !== '-' && (
                                <div className="ml-6 mb-2 flex items-center gap-2 text-slate-400">
                                  <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                  <span className="text-[11px] font-bold uppercase tracking-widest">{item.category3}</span>
                                </div>
                              )}
                              <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-indigo-200 transition-all duration-300">
                                <div className="flex gap-6">
                                  <div className="shrink-0">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                      <Quote size={24} />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-lg sidiz-voice-1 text-slate-700 leading-[1.8] whitespace-pre-wrap markdown-body">
                                      <Markdown>{item.script}</Markdown>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}

                      {isBranch && (
                        <div className="mt-4 space-y-8">
                          {/* Branch Selection Grid */}
                          {(() => {
                            const isBodyTypeStep = currentStep === '인사이트 기반 맞춤 제안 및 체험' && category2 === '종합 체형 분석 결과';
                            const conditions = Array.from(new Set(items.filter(i => i.type === 'branch').map(i => i.condition as string)));
                            
                            if (isBodyTypeStep) {
                              // Group by base type (e.g., "상체말림형")
                              const groups: Record<string, string[]> = {};
                              conditions.forEach(cond => {
                                const base = cond.split('-')[0];
                                if (!groups[base]) groups[base] = [];
                                groups[base].push(cond);
                              });

                              return (
                                <div className="space-y-10">
                                  {Object.entries(groups).map(([base, groupConditions]) => (
                                    <div key={base} className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{base}</h3>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                        {groupConditions.map(cond => {
                                          const isSelected = selectedCondition === cond;
                                          const isBase = cond === base;
                                          
                                          return (
                                            <button
                                              key={cond}
                                              onClick={() => handleSelect(category2, cond)}
                                              className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 relative overflow-hidden group/btn ${
                                                isSelected
                                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1'
                                                  : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md'
                                              }`}
                                            >
                                              {/* Decorative background element for better "button" feel */}
                                              {!isSelected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover/btn:bg-indigo-100/50" />
                                              )}
                                              
                                              <div className="flex items-center justify-between mb-2 relative z-10">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'opacity-80' : 'opacity-40'}`}>
                                                  {isBase ? 'Main Type' : 'Detail'}
                                                </span>
                                                {isSelected ? (
                                                  <CheckCircle2 size={18} />
                                                ) : (
                                                  <Plus size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-indigo-400" />
                                                )}
                                              </div>
                                              <span className={`sidiz-voice-3 font-bold block leading-tight relative z-10 ${
                                                isBase ? 'text-lg' : 'text-base'
                                              }`}>
                                                {cond.includes('-') ? cond.split('-')[1] : cond}
                                              </span>
                                              {!isSelected && (
                                                <span className="text-[10px] mt-3 block opacity-40 font-medium relative z-10">클릭하여 대본 보기</span>
                                              )}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                {conditions.map(cond => {
                                  const isSelected = selectedCondition === cond;
                                  return (
                                    <button
                                      key={cond}
                                      onClick={() => handleSelect(category2, cond)}
                                      className={`p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                                        isSelected
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                          : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Condition</span>
                                        {isSelected && <CheckCircle2 size={16} />}
                                      </div>
                                      <span className="sidiz-voice-3 font-bold block leading-tight text-base">
                                        {cond}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          <AnimatePresence mode="wait">
                            {selectedCondition && (
                              <motion.div
                                key={selectedCondition}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-indigo-50/50 rounded-[32px] p-10 border border-indigo-100 shadow-inner"
                              >
                                {items
                                  .filter(item => item.condition === selectedCondition)
                                  .map((item, idx) => (
                                    <div key={idx} className="space-y-8">
                                      <div className="flex items-center gap-3 text-indigo-600 mb-4">
                                        <MessageSquare size={20} />
                                        <span className="text-sm font-bold uppercase tracking-widest">Custom Script</span>
                                      </div>
                                      
                                      <div className="text-xl sidiz-voice-1 text-indigo-900 leading-[1.8] whitespace-pre-wrap font-medium markdown-body">
                                        <Markdown>{item.script}</Markdown>
                                      </div>
                                      
                                      {/* Sub-branches for Step 3 Body Types */}
                                      {currentStep === '인사이트 기반 맞춤 제안 및 체험' && category2 === '종합 체형 분석 결과' && (
                                        <div className="pt-8 border-t border-indigo-100">
                                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">추가 질문 / 상세 부위 선택</p>
                                          <div className="flex flex-wrap gap-3">
                                            {selectedCondition === '상체말림형' && (
                                              <>
                                                <SubBranchButton label="목 피로" onClick={() => handleSelect(category2, '상체말림형-목')} active={false} />
                                                <SubBranchButton label="어깨 피로" onClick={() => handleSelect(category2, '상체말림형-어깨')} active={false} />
                                              </>
                                            )}
                                            {selectedCondition === '비대칭형' && (
                                              <>
                                                <SubBranchButton label="어깨 결림" onClick={() => handleSelect(category2, '비대칭형-어깨')} active={false} />
                                                <SubBranchButton label="허리 통증" onClick={() => handleSelect(category2, '비대칭형-허리/골반')} active={false} />
                                              </>
                                            )}
                                            {selectedCondition === '하체 O다리형' && (
                                              <>
                                                <SubBranchButton label="종아리 아래" onClick={() => handleSelect(category2, '하체 O다리형-무릎/하체(종아리 아래)')} active={false} />
                                                <SubBranchButton label="종아리 위" onClick={() => handleSelect(category2, '하체 O다리형-허리/골반(종아리 위)')} active={false} />
                                              </>
                                            )}
                                            {selectedCondition === '골반-요추 불균형형' && (
                                              <>
                                                <SubBranchButton label="허리/골반" onClick={() => handleSelect(category2, '골반-요추 불균형형-허리/골반')} active={false} />
                                                <SubBranchButton label="무릎/하체" onClick={() => handleSelect(category2, '골반-요추 불균형형-무릎/하체')} active={false} />
                                              </>
                                            )}
                                            {selectedCondition === '복합 불균형형' && (
                                              <>
                                                <SubBranchButton label="목" onClick={() => handleSelect(category2, '복합 불균형형-목')} active={false} />
                                                <SubBranchButton label="어깨" onClick={() => handleSelect(category2, '복합 불균형형-어깨')} active={false} />
                                                <SubBranchButton label="허리/골반" onClick={() => handleSelect(category2, '복합 불균형형-허리/골반')} active={false} />
                                                <SubBranchButton label="무릎/하체" onClick={() => handleSelect(category2, '복합 불균형형-무릎/하체')} active={false} />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SubBranchButton({ label, onClick, active }: { label: string, onClick: () => void, active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl text-sm sidiz-voice-3 transition-all flex items-center gap-2 ${
        active
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      {label}
      <ArrowRight size={14} />
    </button>
  );
}
