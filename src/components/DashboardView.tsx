import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  LabelList
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Target,
  Loader2,
  AlertCircle,
  Filter,
  Calendar
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { PostureReportRecord, Store } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

export default function DashboardView() {
  const [records, setRecords] = useState<PostureReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await storageService.getReports();
        setRecords(data);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthOptions = useMemo(() => {
    const options = new Set<string>();
    records.forEach(r => {
      const d = new Date(r.created_at);
      options.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(options).sort().reverse();
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (selectedMonth === 'all') return records;
    return records.filter(r => {
      const d = new Date(r.created_at);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return m === selectedMonth;
    });
  }, [records, selectedMonth]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const purchases = filteredRecords.filter(r => r.purchased).length;
    const rate = total > 0 ? (purchases / total) * 100 : 0;

    // Store stats
    const storeMap = new Map<string, { name: string; count: number; purchases: number }>();
    filteredRecords.forEach(r => {
      const storeName = r.store_name || '매장 미지정';
      const current = storeMap.get(storeName) || { name: storeName, count: 0, purchases: 0 };
      current.count++;
      if (r.purchased) current.purchases++;
      storeMap.set(storeName, current);
    });

    const storeData = Array.from(storeMap.values()).map(s => ({
      ...s,
      rate: s.count > 0 ? Math.round((s.purchases / s.count) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Body type stats
    const bodyTypeMap = new Map<string, number>();
    filteredRecords.forEach(r => {
      const type = r.analysis_result?.mainType || '분석 결과 없음';
      bodyTypeMap.set(type, (bodyTypeMap.get(type) || 0) + 1);
    });

    const bodyTypeData = Array.from(bodyTypeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8

    // Daily trend (last 30 days or current month)
    const trendMap = new Map<string, { date: string; count: number }>();
    filteredRecords.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      const current = trendMap.get(date) || { date, count: 0 };
      current.count++;
      trendMap.set(date, current);
    });
    const trendData = Array.from(trendMap.values()).slice(-14); // Last 14 entries

    return { total, purchases, rate, storeData, bodyTypeData, trendData };
  }, [filteredRecords]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 sidiz-voice-3">통계 데이터를 분석 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 rounded-3xl border border-rose-100 flex items-center gap-4 text-rose-600">
        <AlertCircle size={24} />
        <p className="sidiz-voice-3">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sidiz-headline text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" />
            상담 분석 대시보드
          </h2>
          <p className="text-slate-500 text-sm mt-1">매장별 성과 및 체형 분석 통계를 확인하세요.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Calendar size={18} className="text-slate-400 ml-2" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-8"
          >
            <option value="all">전체 기간</option>
            {monthOptions.map(m => (
              <option key={m} value={m}>{m.replace('-', '년 ')}월</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">총 체험 인원</p>
            <p className="text-3xl font-black text-slate-800">{stats.total.toLocaleString()}<span className="text-lg font-normal ml-1">명</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">총 구매 건수</p>
            <p className="text-3xl font-black text-slate-800">{stats.purchases.toLocaleString()}<span className="text-lg font-normal ml-1">건</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Target size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">평균 구매 전환율</p>
            <p className="text-3xl font-black text-slate-800">{stats.rate.toFixed(1)}<span className="text-lg font-normal ml-1">%</span></p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Performance */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            매장별 체험 현황
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.storeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  wrapperStyle={{ zIndex: 1000 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Bar dataKey="count" name="체험 인원" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="count" position="right" style={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Type Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-pink-500 rounded-full" />
            주요 체형 분석 타입
          </h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bodyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.bodyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="value" position="outside" style={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  wrapperStyle={{ zIndex: 1000 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate by Store */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            매장별 구매 전환율 (%)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.storeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  wrapperStyle={{ zIndex: 1000 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Bar dataKey="rate" name="전환율 (%)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30}>
                  <LabelList dataKey="rate" position="top" style={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience Trend */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-amber-500 rounded-full" />
            최근 체험 추이
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  wrapperStyle={{ zIndex: 1000 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="체험 인원" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                >
                  <LabelList dataKey="count" position="top" offset={10} style={{ fontSize: 10, fill: '#f59e0b', fontWeight: 'bold' }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
