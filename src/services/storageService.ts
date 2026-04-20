import { getSupabase } from '../lib/supabase';
import { PostureReportRecord, PostureData, AnalysisResult, Store } from '../types';

const LOCAL_STORAGE_KEY = 'sidiz_posture_reports';
const STORES_STORAGE_KEY = 'sidiz_stores';

export const storageService = {
  async saveReport(
    userName: string,
    userInfo: any,
    measurementData: PostureData,
    analysisResult: AnalysisResult,
    pdfUrl?: string,
    storeName?: string
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Try to save to Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('posture_reports')
          .insert([{
            user_name: userName,
            user_info: userInfo,
            measurement_data: measurementData,
            analysis_result: analysisResult,
            pdf_url: pdfUrl,
            store_name: storeName,
            purchased: false,
            purchased_product: null
          }]);
        
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.error('Supabase save failed, falling back to local storage:', err);
      }
    }

    // 2. Local Storage fallback
    try {
      const existingReports = this.getLocalReports();
      const newReport: PostureReportRecord = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_name: userName,
        user_info: userInfo,
        measurement_data: measurementData,
        analysis_result: analysisResult,
        pdf_url: pdfUrl || '',
        store_name: storeName,
        purchased: false
      };
      
      const updatedReports = [newReport, ...existingReports].slice(0, 100); // Increased limit
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
      return { success: true };
    } catch (err: any) {
      console.error('Local storage save failed:', err);
      return { success: false, error: err.message };
    }
  },

  async updatePurchasedStatus(id: string, purchased: boolean): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const updateData: any = { purchased };
        if (!purchased) {
          updateData.purchased_product = null;
        }
        
        const { error } = await supabase
          .from('posture_reports')
          .update(updateData)
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }

    // Local fallback
    try {
      const reports = this.getLocalReports();
      const index = reports.findIndex(r => r.id === id);
      if (index !== -1) {
        reports[index].purchased = purchased;
        if (!purchased) {
          reports[index].purchased_product = undefined;
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
        return true;
      }
    } catch (err) {
      console.error('Local update failed:', err);
    }
    return false;
  },

  async updatePurchasedProduct(id: string, productName: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('posture_reports')
          .update({ purchased_product: productName })
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }

    // Local fallback
    try {
      const reports = this.getLocalReports();
      const index = reports.findIndex(r => r.id === id);
      if (index !== -1) {
        reports[index].purchased_product = productName;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
        return true;
      }
    } catch (err) {
      console.error('Local update failed:', err);
    }
    return false;
  },

  async getReports(): Promise<PostureReportRecord[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        console.log('Fetching reports from Supabase...');
        const { data, error } = await supabase
          .from('posture_reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase fetch reports error:', error);
          throw error;
        }
        if (data) {
          console.log(`Successfully fetched ${data.length} reports from Supabase.`);
          return data as PostureReportRecord[];
        }
      } catch (err) {
        console.error('Supabase fetch error, falling back to local storage:', err);
      }
    } else {
      console.warn('Supabase not configured, using local storage.');
    }
    return this.getLocalReports();
  },

  getLocalReports(): PostureReportRecord[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  },

  // Store Management
  async getStores(): Promise<Store[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        console.log('Fetching stores from Supabase...');
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Supabase fetch stores error:', error);
          throw error;
        }
        if (data) {
          console.log(`Successfully fetched ${data.length} stores from Supabase.`);
          return data as Store[];
        }
      } catch (err) {
        console.error('Supabase fetch stores error, falling back to local storage:', err);
      }
    } else {
      console.warn('Supabase not configured for stores, using local storage.');
    }

    try {
      const data = localStorage.getItem(STORES_STORAGE_KEY);
      const stores = data ? JSON.parse(data) : [];
      if (stores.length === 0) {
        // Default stores
        const defaults = [{ id: '1', name: '시디즈 플래그십 스토어 논현' }];
        localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      return stores;
    } catch (err) {
      return [];
    }
  },

  async addStore(name: string): Promise<Store> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('stores')
          .insert([{ name }])
          .select()
          .single();
        
        if (!error && data) return data as Store;
      } catch (err) {
        console.error('Supabase add store error:', err);
      }
    }

    const stores = await this.getStores();
    const newStore = { id: crypto.randomUUID(), name };
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify([...stores, newStore]));
    return newStore;
  },

  async updateStore(id: string, name: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('stores')
          .update({ name })
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase update store error:', err);
      }
    }

    const stores = await this.getStores();
    const updated = stores.map(s => s.id === id ? { ...s, name } : s);
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  async deleteStore(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('stores')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase delete store error:', err);
      }
    }

    const stores = await this.getStores();
    const updated = stores.filter(s => s.id !== id);
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  async deleteReport(id: string): Promise<boolean> {
    const supabase = getSupabase();
    
    // 1. Always update LocalStorage first for immediate UI feedback
    try {
      const reports = this.getLocalReports();
      const updated = reports.filter(r => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Local delete failed:', err);
    }

    if (supabase) {
      try {
        console.log('Attempting to delete record from Supabase:', id);
        
        // 1. Get the report first to find the PDF URL
        const { data: report, error: fetchError } = await supabase
          .from('posture_reports')
          .select('pdf_url')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching report for deletion:', fetchError);
        }

        // 2. Delete PDF from Storage if exists
        if (report?.pdf_url) {
          try {
            const urlParts = report.pdf_url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName && fileName.includes('report_')) {
              const { error: storageError } = await supabase.storage
                .from('reports')
                .remove([fileName]);
              
              if (storageError) {
                console.warn('Supabase Storage removal error:', storageError);
              } else {
                console.log('Successfully deleted PDF from storage:', fileName);
              }
            }
          } catch (storageErr) {
            console.warn('Failed to process PDF deletion:', storageErr);
          }
        }

        // 3. Delete record from Table
        // Use standard eq('id', id) for deletion
        const { error: deleteError, status } = await supabase
          .from('posture_reports')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error('Supabase table delete error:', deleteError);
          // If error is 403, it's likely an RLS policy issue
          if (deleteError.code === '42501') {
            alert('Supabase 권한 설정(RLS) 문제로 서버 데이터를 삭제할 수 없습니다. 관리자에게 문의하세요.');
          }
          return false;
        }

        console.log('Supabase delete response status:', status);
        console.log('Successfully deleted record from Supabase:', id);
        return true;
      } catch (err) {
        console.error('Supabase delete process failed:', err);
        return false;
      }
    }

    return true;
  }
};
