import { useState, useEffect, useCallback } from 'react';

export interface GosuinRecord {
  id: string;
  imageUri: string;
  additionalImages: string[];
  shrineName: string;
  location: string;
  deities: string[];
  founded: string;
  history: string;
  highlights: string[];
  visitDate: string;
  createdAt: string;
}

const STORAGE_KEY = 'goshuin_records';

export function useGosuinStorage() {
  const [records, setRecords] = useState<GosuinRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 記録を保存
  const saveRecord = useCallback((record: GosuinRecord) => {
    setRecords((prev) => {
      const updated = [record, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 記録を更新
  const updateRecord = useCallback((id: string, updates: Partial<GosuinRecord>) => {
    setRecords((prev) => {
      const updated = prev.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 記録を削除
  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => {
      const updated = prev.filter((record) => record.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 記録を取得
  const getRecord = useCallback((id: string) => {
    return records.find((record) => record.id === id);
  }, [records]);

  return {
    records,
    isLoading,
    saveRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  };
}
