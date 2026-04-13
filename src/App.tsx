/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { PostureData, AnalysisResult, HorizontalValue, Product, BodyType, Store } from './types';
import { analyzePosture } from './utils/analysis';
import { PostureInput } from './components/PostureInput';
import { PostureReport } from './components/PostureReport';
import { HistoryView } from './components/HistoryView';
import ConsultationGuide from './components/ConsultationGuide';
import { mockUsers, UserData } from './data/mockUsers';
import { PRODUCTS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  RotateCcw, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText, 
  Plus, 
  X, 
  ShoppingBag, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Edit2,
  Trash2,
  LayoutDashboard
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { getSupabase } from './lib/supabase';

import { storageService } from './services/storageService';
import DashboardView from './components/DashboardView';

const INITIAL_DATA: PostureData = {
  userInfo: {
    name: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
  },
  front: {
    rightShoulderSlope: null,
    leftShoulderSlope: null,
    shoulderHorizontal: null,
    rightLegAngle: null,
    leftLegAngle: null,
    pelvisHorizontal: null,
    sectionScore: null,
  },
  sideLeft: {
    roundShoulder: null,
    pelvisTilt: null,
    forwardHead: null,
    thoracic: null,
    lumbar: null,
    sectionScore: null,
  },
  sideRight: {
    roundShoulder: null,
    pelvisTilt: null,
    forwardHead: null,
    thoracic: null,
    lumbar: null,
    sectionScore: null,
  },
  back: {
    shoulderHorizontal: null,
    kneeHorizontal: null,
    pelvisHorizontal: null,
    sectionScore: null,
  },
  manualScore: null,
  topPercent: null,
};

const SAMPLE_DATA: PostureData = {
  userInfo: {
    name: '홍길동',
    gender: '남성',
    age: '32',
    height: '178',
    weight: '75',
  },
  front: {
    rightShoulderSlope: 20.6,
    leftShoulderSlope: 23.2,
    shoulderHorizontal: { direction: 'R', value: 1.0 },
    rightLegAngle: -0.8,
    leftLegAngle: -2.9,
    pelvisHorizontal: { direction: 'L', value: 3.1 },
    sectionScore: 65,
  },
  sideLeft: {
    roundShoulder: 48.5,
    pelvisTilt: 6.4,
    forwardHead: 24.4,
    thoracic: 43.7,
    lumbar: 51.2,
    sectionScore: 72,
  },
  sideRight: {
    roundShoulder: 40.6,
    pelvisTilt: 6.8,
    forwardHead: 23.8,
    thoracic: 43.8,
    lumbar: 51.5,
    sectionScore: 75,
  },
  back: {
    shoulderHorizontal: { direction: 'R', value: 0.9 },
    kneeHorizontal: { direction: 'R', value: 0.9 },
    pelvisHorizontal: { direction: 'L', value: 1.0 },
    sectionScore: 80,
  },
  manualScore: 72,
  topPercent: 15,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'input' | 'history' | 'guide' | 'dashboard'>('input');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [data, setData] = useState<PostureData>(INITIAL_DATA);
  const [showResult, setShowResult] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('front');
  const [memo, setMemo] = useState('');
  const [productRecommendation, setProductRecommendation] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      const data = await storageService.getStores();
      setStores(data);
      if (data.length > 0 && !selectedStore) {
        setSelectedStore(data[0].name);
      }
    };
    fetchStores();
  }, []);

  const handleAddStore = async () => {
    if (!newStoreName.trim()) return;
    const newStore = await storageService.addStore(newStoreName.trim());
    setStores(prev => [...prev, newStore]);
    setSelectedStore(newStore.name);
    setNewStoreName('');
    setIsAddingStore(false);
  };

  const handleUpdateStore = async (id: string, name: string) => {
    if (!name.trim()) return;
    const success = await storageService.updateStore(id, name.trim());
    if (success) {
      setStores(prev => prev.map(s => s.id === id ? { ...s, name: name.trim() } : s));
      if (stores.find(s => s.id === id)?.name === selectedStore) {
        setSelectedStore(name.trim());
      }
    }
    setEditingStoreId(null);
  };

  const handleDeleteStore = async (id: string) => {
    if (stores.length <= 1) {
      alert('최소 한 개의 매장은 있어야 합니다.');
      return;
    }
    const storeToDelete = stores.find(s => s.id === id);
    const success = await storageService.deleteStore(id);
    if (success) {
      setStores(prev => prev.filter(s => s.id !== id));
      if (storeToDelete?.name === selectedStore) {
        const remaining = stores.filter(s => s.id !== id);
        setSelectedStore(remaining[0]?.name || '');
      }
    }
  };

  const analysisResult = useMemo(() => {
    const allValues = [
      ...Object.values(data.front),
      ...Object.values(data.sideLeft),
      ...Object.values(data.sideRight),
      ...Object.values(data.back),
    ];
    const filledCount = allValues.filter(v => v !== null).length;
    if (filledCount < 5) return null;
    return analyzePosture(data);
  }, [data]);

  const handleReset = () => {
    setData(INITIAL_DATA);
    setShowResult(false);
    setMemo('');
    setProductRecommendation('');
    setSelectedProductIds([]);
  };

  const handleSample = () => {
    setData(SAMPLE_DATA);
    setShowResult(true);
  };

  const handleLoadUser = (user: UserData) => {
    setData(user.data);
    setMemo(user.memo);
    setProductRecommendation(user.recommendation);
    setShowResult(true);
  };

  const updateField = (section: keyof PostureData, field: string, value: any) => {
    setData(prev => {
      const sectionData = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...(typeof sectionData === 'object' ? sectionData : {}),
          [field]: value
        }
      };
    });
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  };

  const handlePrint = async () => {
    if (!showResult || !analysisResult) {
      alert('결과 페이지에서만 PDF 저장이 가능합니다.');
      return;
    }

    const btn = document.activeElement as HTMLButtonElement;
    const originalText = btn ? btn.innerText : '';
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'PDF 생성 중...';
    }

    try {
      // Wait longer to ensure all charts and images are fully rendered
      await new Promise(resolve => setTimeout(resolve, 2500));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageIds = ['pdf-page-1', 'pdf-page-2', 'pdf-page-3'];
      
      for (let i = 0; i < pageIds.length; i++) {
        const pageId = pageIds[i];
        const element = document.getElementById(pageId);
        
        if (!element) {
          throw new Error(`${pageId} 요소를 찾을 수 없습니다.`);
        }

        // Capture Page using html-to-image (much more robust for modern CSS like oklch/oklab)
        const dataUrl = await toPng(element, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
          style: {
            display: 'block',
            visibility: 'visible',
          }
        });
        
        if (!dataUrl || dataUrl === 'data:,') {
          throw new Error(`${pageId} 캡처에 실패했습니다.`);
        }

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
        
        // Small delay between pages to prevent memory issues
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      pdf.save(`바디체크_체형분석보고서_${new Date().toISOString().split('T')[0]}.pdf`);

      // Storage Integration
      try {
        const supabase = getSupabase();
        let publicUrl = '';

        if (supabase) {
          const pdfBlob = pdf.output('blob');
          const timestamp = Date.now();
          const fileName = `report_${timestamp}.pdf`;

          // 1. Upload PDF to Storage
          const { error: storageError } = await supabase.storage
            .from('reports')
            .upload(fileName, pdfBlob, {
              contentType: 'application/pdf',
              cacheControl: '3600',
              upsert: true
            });

          if (storageError) {
            console.warn('Supabase Storage upload failed:', storageError.message);
          } else {
            // 2. Get Public URL
            const { data: { publicUrl: url } } = supabase.storage
              .from('reports')
              .getPublicUrl(fileName);
            publicUrl = url;
          }
        }

        // 3. Save Data using storageService (handles both Supabase and LocalStorage)
        const { success, error: saveError } = await storageService.saveReport(
          data.userInfo.name,
          data.userInfo,
          data,
          analysisResult,
          publicUrl,
          selectedStore
        );

        if (success) {
          console.log('Data successfully saved.');
          alert('분석 결과가 성공적으로 저장되었습니다.');
        } else {
          console.warn('Data save failed:', saveError);
          alert(`데이터 저장 중 문제가 발생했습니다: ${saveError}`);
        }
      } catch (err) {
        console.error('Storage integration error:', err);
      }
      
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert(`PDF 생성 중 오류가 발생했습니다: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarHovered ? 280 : 80 }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className="bg-white border-r border-slate-200 flex flex-col no-print z-50 relative shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 overflow-hidden">
          <img 
            src="/attention_logo_black.png" 
            alt="Attention Logo" 
            className="w-10 h-10 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <AnimatePresence>
            {isSidebarHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <h1 className="text-xl sidiz-voice-3 tracking-tighter text-sidiz-blue sidiz-headline">SIDIZ</h1>
                <p className="text-[10px] text-slate-400 mt-1 sidiz-voice-3 uppercase tracking-widest">Bodycheck System</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <button 
            onClick={() => setCurrentView('input')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              currentView === 'input' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Plus size={20} className={currentView === 'input' ? 'text-white' : 'group-hover:text-indigo-600'} />
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidiz-voice-3 text-sm whitespace-nowrap"
                >
                  자세 측정 데이터 입력
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button 
            onClick={() => setCurrentView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              currentView === 'history' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Database size={20} className={currentView === 'history' ? 'text-white' : 'group-hover:text-indigo-600'} />
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidiz-voice-3 text-sm whitespace-nowrap"
                >
                  분석결과 조회
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              currentView === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'text-white' : 'group-hover:text-indigo-600'} />
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidiz-voice-3 text-sm whitespace-nowrap"
                >
                  대시보드
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button 
            onClick={() => setCurrentView('guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              currentView === 'guide' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <MessageSquare size={20} className={currentView === 'guide' ? 'text-white' : 'group-hover:text-indigo-600'} />
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidiz-voice-3 text-sm whitespace-nowrap"
                >
                  상담 가이드
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button 
            onClick={() => window.open('https://bespoke-sopapillas-94e70a.netlify.app/', '_blank')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 group"
          >
            <HelpCircle size={20} className="group-hover:text-indigo-600" />
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 flex-1"
                >
                  <span className="sidiz-voice-3 text-sm whitespace-nowrap">틸트 설명</span>
                  <ExternalLink size={14} className="ml-auto opacity-40" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="relative group">
            <button className="w-full flex items-center justify-between px-4 py-2 text-xs sidiz-voice-3 text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Info size={14} />
                데이터 불러오기
              </div>
              <ChevronUp size={14} />
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-[60]">
              {mockUsers.map((user, i) => (
                <button
                  key={i}
                  onClick={() => handleLoadUser(user)}
                  className="w-full text-left px-4 py-2 text-xs sidiz-voice-1 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {user.name}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={handleSample}
                className="w-full text-left px-4 py-2 text-xs sidiz-voice-1 text-slate-400 hover:bg-slate-50 transition-colors"
              >
                기본 샘플 데이터
              </button>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs sidiz-voice-3 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            데이터 초기화
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm sidiz-voice-3 text-slate-400">Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm sidiz-voice-3 text-slate-800">
              {currentView === 'input' ? '자세 측정 데이터 입력' : currentView === 'history' ? '분석결과 조회' : currentView === 'dashboard' ? '대시보드' : '상담 가이드'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={openInNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sidiz-voice-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
            >
              <ExternalLink size={14} />
              새 탭에서 열기
            </button>
            {currentView === 'input' && analysisResult && (
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs sidiz-voice-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-all"
              >
                <FileText size={14} />
                PDF 저장 및 DB 등록
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${currentView === 'guide' ? 'p-0' : 'p-8'}`}>
          <AnimatePresence mode="wait">
            {currentView === 'input' && (
              <motion.div 
                key="input-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h2 className="text-xl sidiz-voice-3 sidiz-headline text-slate-800">자세 측정 데이터 입력</h2>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store</label>
                          <select 
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                          >
                            {stores.map(store => (
                              <option key={store.id} value={store.name}>{store.name}</option>
                            ))}
                          </select>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setIsAddingStore(true);
                            }}
                            className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                            title="매장 관리"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* User Info & Scores */}
                      <div className="p-6 rounded-2xl border border-indigo-100" style={{ backgroundColor: 'rgba(238, 242, 255, 0.5)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                          <h3 className="text-sm sidiz-voice-3 text-indigo-900">고객 정보 및 종합 점수</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] sidiz-voice-3 text-slate-500 ml-1">이름</label>
                            <input 
                              type="text" 
                              value={data.userInfo.name}
                              onChange={(e) => setData(prev => ({ ...prev, userInfo: { ...prev.userInfo, name: e.target.value } }))}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="이름"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] sidiz-voice-3 text-slate-500 ml-1">성별</label>
                            <select 
                              value={data.userInfo.gender}
                              onChange={(e) => setData(prev => ({ ...prev, userInfo: { ...prev.userInfo, gender: e.target.value } }))}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">성별</option>
                              <option value="남성">남성</option>
                              <option value="여성">여성</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] sidiz-voice-3 text-slate-500 ml-1">연령</label>
                            <input 
                              type="number" 
                              value={data.userInfo.age}
                              onChange={(e) => setData(prev => ({ ...prev, userInfo: { ...prev.userInfo, age: e.target.value } }))}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="연령"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] sidiz-voice-3 text-slate-500 ml-1">키(cm)</label>
                            <input 
                              type="number" 
                              value={data.userInfo.height}
                              onChange={(e) => setData(prev => ({ ...prev, userInfo: { ...prev.userInfo, height: e.target.value } }))}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="키"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] sidiz-voice-3 text-slate-500 ml-1">몸무게(kg)</label>
                            <input 
                              type="number" 
                              value={data.userInfo.weight}
                              onChange={(e) => setData(prev => ({ ...prev, userInfo: { ...prev.userInfo, weight: e.target.value } }))}
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="몸무게"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <PostureInput 
                            label="포스처 스코어 (직접 입력)" 
                            value={data.manualScore} 
                            onChange={(v) => setData(prev => ({ ...prev, manualScore: v }))}
                            unit="점"
                            description="분석 결과에 표시될 최종 점수를 입력하세요."
                          />
                          <PostureInput 
                            label="상위 N% (직접 입력)" 
                            value={data.topPercent} 
                            onChange={(v) => setData(prev => ({ ...prev, topPercent: v }))}
                            unit="%"
                            description="전체 사용자 중 상위 백분율을 입력하세요."
                          />
                        </div>
                      </div>

                      {/* Posture Sections */}
                      <div className="grid grid-cols-1 gap-4">
                        <Section title="정면 자세" isOpen={activeSection === 'front'} onToggle={() => toggleSection('front')}>
                          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <PostureInput 
                              label="정면 자세 종합 점수" 
                              value={data.front.sectionScore} 
                              onChange={(v) => updateField('front', 'sectionScore', v)}
                              unit="점"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <PostureInput label="오른쪽 어깨 기울기" value={data.front.rightShoulderSlope} onChange={(v) => updateField('front', 'rightShoulderSlope', v)} />
                            <PostureInput label="왼쪽 어깨 기울기" value={data.front.leftShoulderSlope} onChange={(v) => updateField('front', 'leftShoulderSlope', v)} />
                            <PostureInput label="어깨 수평 각도" horizontal horizontalValue={data.front.shoulderHorizontal} onHorizontalChange={(v) => updateField('front', 'shoulderHorizontal', v)} value={null} onChange={() => {}} />
                            <PostureInput label="골반 수평 각도" horizontal horizontalValue={data.front.pelvisHorizontal} onHorizontalChange={(v) => updateField('front', 'pelvisHorizontal', v)} value={null} onChange={() => {}} />
                            <PostureInput label="오른쪽 O/X 다리" value={data.front.rightLegAngle} onChange={(v) => updateField('front', 'rightLegAngle', v)} />
                            <PostureInput label="왼쪽 O/X 다리" value={data.front.leftLegAngle} onChange={(v) => updateField('front', 'leftLegAngle', v)} />
                          </div>
                        </Section>

                        <Section title="측면 자세 (왼쪽)" isOpen={activeSection === 'sideLeft'} onToggle={() => toggleSection('sideLeft')}>
                          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <PostureInput label="측면(좌) 종합 점수" value={data.sideLeft.sectionScore} onChange={(v) => updateField('sideLeft', 'sectionScore', v)} unit="점" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <PostureInput label="라운드 숄더" value={data.sideLeft.roundShoulder} onChange={(v) => updateField('sideLeft', 'roundShoulder', v)} />
                            <PostureInput label="거북목" value={data.sideLeft.forwardHead} onChange={(v) => updateField('sideLeft', 'forwardHead', v)} />
                            <PostureInput label="골반전방경사" value={data.sideLeft.pelvisTilt} onChange={(v) => updateField('sideLeft', 'pelvisTilt', v)} />
                            <PostureInput label="흉추 각도" value={data.sideLeft.thoracic} onChange={(v) => updateField('sideLeft', 'thoracic', v)} />
                            <PostureInput label="요추 각도" value={data.sideLeft.lumbar} onChange={(v) => updateField('sideLeft', 'lumbar', v)} />
                          </div>
                        </Section>

                        <Section title="측면 자세 (오른쪽)" isOpen={activeSection === 'sideRight'} onToggle={() => toggleSection('sideRight')}>
                          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <PostureInput label="측면(우) 종합 점수" value={data.sideRight.sectionScore} onChange={(v) => updateField('sideRight', 'sectionScore', v)} unit="점" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <PostureInput label="라운드 숄더" value={data.sideRight.roundShoulder} onChange={(v) => updateField('sideRight', 'roundShoulder', v)} />
                            <PostureInput label="거북목" value={data.sideRight.forwardHead} onChange={(v) => updateField('sideRight', 'forwardHead', v)} />
                            <PostureInput label="골반전방경사" value={data.sideRight.pelvisTilt} onChange={(v) => updateField('sideRight', 'pelvisTilt', v)} />
                            <PostureInput label="흉추 각도" value={data.sideRight.thoracic} onChange={(v) => updateField('sideRight', 'thoracic', v)} />
                            <PostureInput label="요추 각도" value={data.sideRight.lumbar} onChange={(v) => updateField('sideRight', 'lumbar', v)} />
                          </div>
                        </Section>

                        <Section title="후면 자세" isOpen={activeSection === 'back'} onToggle={() => toggleSection('back')}>
                          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <PostureInput label="후면 자세 종합 점수" value={data.back.sectionScore} onChange={(v) => updateField('back', 'sectionScore', v)} unit="점" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <PostureInput label="어깨 수평 각도" horizontal horizontalValue={data.back.shoulderHorizontal} onHorizontalChange={(v) => updateField('back', 'shoulderHorizontal', v)} value={null} onChange={() => {}} />
                            <PostureInput label="무릎 수평 각도" horizontal horizontalValue={data.back.kneeHorizontal} onHorizontalChange={(v) => updateField('back', 'kneeHorizontal', v)} value={null} onChange={() => {}} />
                            <PostureInput label="골반 수평 각도" horizontal horizontalValue={data.back.pelvisHorizontal} onHorizontalChange={(v) => updateField('back', 'pelvisHorizontal', v)} value={null} onChange={() => {}} />
                          </div>
                        </Section>
                      </div>

                      {/* Memo & Products */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm sidiz-voice-3 text-slate-700 ml-1">상담 메모</label>
                          <textarea 
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="고객 상담 내용을 입력하세요..."
                            className="w-full h-32 p-4 text-sm rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all resize-none sidiz-voice-1 bg-slate-50"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm sidiz-voice-3 text-slate-700 ml-1">추천 제품</label>
                          <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                            {selectedProductIds.map(id => (
                              <div key={id} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] sidiz-voice-3 border border-indigo-100">
                                {PRODUCTS.find(p => p.id === id)?.name}
                                <button onClick={() => toggleProduct(id)}><X size={10} /></button>
                              </div>
                            ))}
                          </div>
                          <select 
                            onChange={(e) => { if (e.target.value) toggleProduct(e.target.value); e.target.value = ''; }}
                            className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all sidiz-voice-1 bg-white"
                          >
                            <option value="">제품 선택...</option>
                            {PRODUCTS.map(p => <option key={p.id} value={p.id} disabled={selectedProductIds.includes(p.id)}>{p.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePrint}
                      disabled={!analysisResult}
                      className={`w-full mt-10 py-4 rounded-2xl sidiz-voice-3 sidiz-headline text-lg shadow-xl transition-all ${
                        analysisResult 
                          ? 'bg-sidiz-blue text-white hover:bg-sidiz-medium-blue active:scale-[0.98]' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      분석 결과 저장 및 PDF 생성
                    </button>
                  </div>
                </motion.div>
              )}

            {currentView === 'history' && (
              <motion.div 
                key="history-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <HistoryView />
              </motion.div>
            )}

            {currentView === 'guide' && (
              <motion.div 
                key="guide-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full w-full"
              >
                <ConsultationGuide />
              </motion.div>
            )}

            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full w-full"
              >
                <DashboardView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Hidden PDF Template (Rendered off-screen to ensure styles are applied) */}
      <div className="fixed pointer-events-none" style={{ left: '-9999px', top: '0', zIndex: -1, opacity: 1 }}>
        {analysisResult && (
          <>
            <div id="pdf-page-1">
              <PostureReport 
                data={data}
                analysisResult={analysisResult}
                memo={memo}
                productRecommendation={productRecommendation}
                selectedProductIds={selectedProductIds}
                isPdf={true}
                page={1}
              />
            </div>
            <div id="pdf-page-2">
              <PostureReport 
                data={data}
                analysisResult={analysisResult}
                memo={memo}
                productRecommendation={productRecommendation}
                selectedProductIds={selectedProductIds}
                isPdf={true}
                page={2}
              />
            </div>
            <div id="pdf-page-3">
              <PostureReport 
                data={data}
                analysisResult={analysisResult}
                memo={memo}
                productRecommendation={productRecommendation}
                selectedProductIds={selectedProductIds}
                isPdf={true}
                page={3}
              />
            </div>
          </>
        )}
      </div>

      {/* Store Management Modal */}
      <AnimatePresence>
        {isAddingStore && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingStore(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  <h3 className="text-lg font-bold text-slate-800">매장 관리</h3>
                </div>
                <button 
                  onClick={() => setIsAddingStore(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">새 매장 등록</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newStoreName}
                      onChange={(e) => setNewStoreName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddStore();
                        }
                      }}
                      placeholder="매장명을 입력하세요"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      autoFocus
                    />
                    <button 
                      onClick={handleAddStore}
                      className="px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      추가
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">등록된 매장 목록</label>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {stores.map(store => (
                      <div key={store.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group/item hover:border-indigo-200 transition-all">
                        {editingStoreId === store.id ? (
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text"
                              defaultValue={store.name}
                              onBlur={(e) => handleUpdateStore(store.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleUpdateStore(store.id, (e.target as HTMLInputElement).value);
                                }
                                if (e.key === 'Escape') setEditingStoreId(null);
                              }}
                              className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-1 text-sm focus:outline-none"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-slate-700 font-medium truncate flex-1 ml-1">{store.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setEditingStoreId(store.id)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                                title="수정"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteStore(store.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                                title="삭제"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 text-center">
                <button 
                  onClick={() => setIsAddingStore(false)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-sidiz-core-light rounded-2xl overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-sidiz-core-light transition-colors"
        style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
      >
        <span className="sidiz-voice-3 text-sidiz-dark-gray">{title}</span>
        {isOpen ? <ChevronUp size={20} className="text-sidiz-medium-gray" /> : <ChevronDown size={20} className="text-sidiz-medium-gray" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
