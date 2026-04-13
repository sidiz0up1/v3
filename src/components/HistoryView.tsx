import React, { useEffect, useState, useMemo } from 'react';
import { PostureReportRecord, Store } from '../types';
import { 
  Search, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  ExternalLink,
  Loader2,
  AlertCircle,
  Activity,
  CheckCircle2,
  Filter,
  MapPin,
  Check,
  Trash2,
  X,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { storageService } from '../services/storageService';

export const HistoryView: React.FC = () => {
  const [records, setRecords] = useState<PostureReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [stores, setStores] = useState<Store[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle');

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reportsData, storesData] = await Promise.all([
        storageService.getReports(),
        Promise.resolve(storageService.getStores())
      ]);
      setRecords(reportsData);
      setStores(storesData);
    } catch (err: any) {
      console.error('Error fetching records:', err);
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePurchase = async (id: string, currentStatus: boolean) => {
    try {
      const success = await storageService.updatePurchasedStatus(id, !currentStatus);
      if (success) {
        setRecords(prev => {
          const newRecords = prev.map(r => r.id === id ? { 
            ...r, 
            purchased: !currentStatus,
            purchased_product: !currentStatus ? r.purchased_product : undefined
          } : r);
          return newRecords;
        });
      } else {
        alert('구매 상태 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error in handleTogglePurchase:', err);
    }
  };

  const handleUpdateProduct = async (id: string, productName: string) => {
    try {
      const success = await storageService.updatePurchasedProduct(id, productName);
      if (success) {
        setRecords(prev => prev.map(r => r.id === id ? { ...r, purchased_product: productName } : r));
      }
    } catch (err) {
      console.error('Error updating product name:', err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setDeleteStatus('deleting');
    try {
      const success = await storageService.deleteReport(id);
      if (success) {
        setRecords(prev => prev.filter(r => r.id !== id));
        setDeletingId(null);
        setDeleteStatus('idle');
      } else {
        setDeleteStatus('error');
        setTimeout(() => setDeleteStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      setDeleteStatus('error');
      setTimeout(() => setDeleteStatus('idle'), 3000);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.user_info?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const recordDate = new Date(record.created_at);
    const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
    const matchesMonth = selectedMonth === 'all' || recordMonth === selectedMonth;
    
    const matchesStore = selectedStore === 'all' || record.store_name === selectedStore;

    return matchesSearch && matchesMonth && matchesStore;
  });

  const monthOptions = useMemo(() => {
    const options = new Set<string>();
    records.forEach(r => {
      const d = new Date(r.created_at);
      options.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    // Add current month if not present
    const now = new Date();
    options.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    return Array.from(options).sort().reverse();
  }, [records]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="sidiz-voice-1">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-rose-500 p-8 text-center">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <h3 className="text-lg sidiz-voice-3 mb-2">오류가 발생했습니다</h3>
        <p className="text-sm sidiz-voice-1 mb-6">{error}</p>
        <button 
          onClick={fetchRecords}
          className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors sidiz-voice-3 text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            <h2 className="text-lg sidiz-voice-3 sidiz-headline text-slate-800">분석 결과 조회</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="고객 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Period</span>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]"
            >
              <option value="all">전체 기간</option>
              {monthOptions.map(m => (
                <option key={m} value={m}>{m.split('-')[0]}년 {m.split('-')[1]}월</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store</span>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
            >
              <option value="all">모든 매장</option>
              {stores.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-400">
            총 <span className="text-indigo-600 font-bold">{filteredRecords.length}</span>건의 결과
          </div>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-400 sidiz-voice-1">
            {searchTerm ? '검색 결과가 없습니다.' : '아직 저장된 분석 결과가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((record) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sidiz-voice-3 text-slate-800">{record.user_name || record.user_info?.name || '익명'}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] sidiz-voice-3">
                        {record.user_info?.gender} / {record.user_info?.age}세
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 sidiz-voice-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(record.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {record.store_name || '매장 미지정'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity size={12} />
                        스코어: <span className="text-indigo-500 font-bold">{record.analysis_result?.overallScore || '-'}점</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Purchase Toggle & Product Input */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pr-4 border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold whitespace-nowrap ${record.purchased ? 'text-green-600' : 'text-slate-400'}`}>
                        {record.purchased ? '구매 완료' : '구매 전'}
                      </span>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await handleTogglePurchase(record.id, !!record.purchased);
                        }}
                        disabled={loading}
                        className={`w-10 h-6 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          record.purchased ? 'bg-green-500 shadow-inner' : 'bg-slate-200'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 transform ${
                          record.purchased ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {record.purchased && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="relative"
                        >
                          <input 
                            type="text"
                            placeholder="구매 제품명 입력..."
                            defaultValue={record.purchased_product || ''}
                            onBlur={(e) => handleUpdateProduct(record.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateProduct(record.id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="text-[11px] px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 w-32 sm:w-40 transition-all"
                          />
                          <Edit2 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.pdf_url && (
                      <a 
                        href={record.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors text-sm sidiz-voice-3"
                      >
                        <Download size={16} />
                        PDF
                      </a>
                    )}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(record.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              
              <h3 className="text-xl sidiz-voice-3 text-center text-slate-800 mb-2">분석 결과 삭제</h3>
              <p className="text-sm text-slate-500 text-center sidiz-voice-1 mb-8">
                정말 이 분석 결과를 삭제하시겠습니까?<br />
                삭제된 데이터는 복구할 수 없습니다.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeletingId(null);
                    setDeleteStatus('idle');
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDeleteRecord(deletingId)}
                  disabled={deleteStatus === 'deleting'}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteStatus === 'deleting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      삭제 중...
                    </>
                  ) : '삭제하기'}
                </button>
              </div>
              
              {deleteStatus === 'error' && (
                <p className="text-xs text-rose-500 text-center mt-4 animate-pulse">
                  삭제 중 오류가 발생했습니다. 다시 시도해 주세요.
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
