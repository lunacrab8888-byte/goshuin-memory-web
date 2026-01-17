import { useState, useMemo } from 'react';
import { useGosuinStorage } from '../hooks/useGosuinStorage';
import RecordCard from '../components/RecordCard';

export default function Home() {
  const { records, isLoading } = useGosuinStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // 検索とフィルタリング
  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.shrineName.toLowerCase().includes(query) ||
          record.location.toLowerCase().includes(query)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((record) => {
        const visitDate = new Date(record.visitDate);
        const recordMonth = `${visitDate.getFullYear()}-${String(
          visitDate.getMonth() + 1
        ).padStart(2, '0')}`;
        return recordMonth === selectedMonth;
      });
    }

    return filtered;
  }, [records, searchQuery, selectedMonth]);

  // 利用可能な月を取得
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    records.forEach((record) => {
      const visitDate = new Date(record.visitDate);
      const month = `${visitDate.getFullYear()}-${String(
        visitDate.getMonth() + 1
      ).padStart(2, '0')}`;
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }, [records]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🌙</span>
            <h1 className="text-2xl font-bold text-foreground">参拝記録</h1>
          </div>
          <p className="text-sm text-muted">月の光に照らされた参拝の思い出</p>
        </div>

        {/* 検索ボックス */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="神社名や所在地で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 月フィルター */}
        {availableMonths.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {availableMonths.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                  selectedMonth === month
                    ? 'bg-primary text-white'
                    : 'bg-surface text-foreground border border-border'
                }`}
              >
                {formatMonth(month)}
              </button>
            ))}
          </div>
        )}

        {/* 記録一覧 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">読み込み中...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-6xl mb-4">🌙</span>
            <p className="text-lg text-muted text-center">
              {searchQuery || selectedMonth ? '該当する記録がありません' : 'まだ記録がありません'}
            </p>
            <p className="text-sm text-muted text-center mt-2">
              {searchQuery || selectedMonth
                ? '検索条件を変更してみてください'
                : '「追加」タブから御朱印を撮影して記録を作成してください'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
