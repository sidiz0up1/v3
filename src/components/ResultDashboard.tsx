import React from 'react';
import { AnalysisResult, BodyType } from '../types';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, ChevronRight, Share2, Award, Activity } from 'lucide-react';

interface ResultDashboardProps {
  result: AnalysisResult;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ result }) => {
  const typeGradients: Record<BodyType, string> = {
    [BodyType.TYPE0]: 'linear-gradient(135deg, #10b981, #0d9488)',
    [BodyType.TYPEA]: 'linear-gradient(135deg, #6366f1, #2563eb)',
    [BodyType.TYPEB]: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    [BodyType.TYPEC]: 'linear-gradient(135deg, #8b5cf6, #9333ea)',
    [BodyType.TYPED]: 'linear-gradient(135deg, #f43f5e, #db2777)',
    [BodyType.TYPEE]: 'linear-gradient(135deg, #475569, #1e293b)',
  };

  const typeLabels: Record<BodyType, string> = {
    [BodyType.TYPE0]: '건강형 (균형형)',
    [BodyType.TYPEA]: '상체 말림형',
    [BodyType.TYPEB]: '좌우 비대칭형',
    [BodyType.TYPEC]: '하체 O다리형',
    [BodyType.TYPED]: '골반-요추 불균형형',
    [BodyType.TYPEE]: '복합 불균형형',
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Main Result Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{ background: typeGradients[result.mainType], boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 backdrop-blur-md rounded-full text-[10px] sidiz-voice-3 uppercase tracking-wider font-eng" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                Main Body Type
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl sidiz-voice-3 sidiz-headline mb-2">
              {typeLabels[result.mainType]}
            </h2>
            <p className="text-lg sidiz-voice-1 opacity-90 mb-4">
              {result.summary}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <span className="text-xs sidiz-voice-1 italic">
                “{result.coreMessage}”
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center backdrop-blur-md rounded-[32px] p-6 min-w-[160px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <span className="text-[10px] sidiz-voice-3 uppercase tracking-widest mb-1 opacity-80 font-eng">
              Posture Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sidiz-voice-2 sidiz-headline font-eng">
                {result.scores[result.mainType]}
              </span>
              <span className="text-xl sidiz-voice-3 opacity-60 font-eng">/ 100</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl -ml-24 -mb-24" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
      </motion.div>

      {/* 3. 핵심 분석 지표 (위치 이동) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 border border-slate-100"
        style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <h3 className="sidiz-voice-3">핵심 분석 지표</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {result.keyMetrics.map((metric, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-indigo-500 sidiz-voice-3 uppercase tracking-wider font-eng">
                    {metric.position} - {metric.area}
                  </span>
                  <span className="text-sm text-slate-800 sidiz-voice-3">{metric.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base sidiz-voice-3 font-eng ${metric.isAbnormal ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {metric.value}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed sidiz-voice-1">
                {metric.meaning}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 체형 및 습관 분석 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6"
          style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <Info size={18} className="text-indigo-500" />
              <h3 className="sidiz-voice-3">체형 특징</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.bodyFeatures.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs sidiz-voice-1 rounded-full border border-slate-100">
                  {feature}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <Activity size={18} className="text-indigo-500" />
              <h3 className="sidiz-voice-3">앉음 습관 특징</h3>
            </div>
            <ul className="space-y-2">
              {result.sittingHabits.map((habit, i) => (
                <li key={i} className="flex gap-2 items-start text-xs text-slate-500 leading-relaxed sidiz-voice-1">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  {habit}
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <AlertCircle size={18} className="text-rose-500" />
              <h3 className="sidiz-voice-3">피해야 할 습관</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {result.avoidHabits.map((habit, i) => (
                <div key={i} className="px-3 py-2 bg-rose-50 text-rose-700 text-xs sidiz-voice-1 rounded-xl border border-rose-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {habit}
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* 2. 유지 및 교정 전략 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6"
          style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <Award size={18} className="text-indigo-500" />
              <h3 className="sidiz-voice-3">유지/교정 전략</h3>
            </div>
            <div className="space-y-3">
              {result.maintenanceStrategy.map((tip, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl border border-indigo-100" style={{ backgroundColor: 'rgba(238, 242, 255, 0.5)' }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] sidiz-voice-3">
                    {i + 1}
                  </div>
                  <p className="text-xs text-indigo-900 leading-relaxed sidiz-voice-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <h3 className="sidiz-voice-3">생활 습관 가이드</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {result.lifeHabits.map((habit, i) => (
                <div key={i} className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs sidiz-voice-1 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  {habit}
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>

      {/* Score Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 border border-slate-100"
        style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
      >
        <h3 className="sidiz-voice-3 text-slate-800 mb-4">타입별 분석 점수</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {(Object.keys(result.scores) as BodyType[]).map((type) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between items-end">
                <span className={`text-xs sidiz-voice-3 ${result.mainType === type ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {typeLabels[type]}
                </span>
                <span className="text-[10px] font-eng sidiz-voice-3 text-slate-400">{result.scores[type]} / 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.scores[type]}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${result.mainType === type ? 'bg-indigo-500' : 'bg-slate-300'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
