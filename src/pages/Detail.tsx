import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGosuinStorage } from '../hooks/useGosuinStorage';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecord, updateRecord, deleteRecord } = useGosuinStorage();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editInfo, setEditInfo] = useState<any>({});

  const record = id ? getRecord(id) : null;

  if (!record) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">記録が見つかりません</p>
      </div>
    );
  }

  const visitDate = new Date(record.visitDate);
  const dateStr = visitDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDeleteRecord = () => {
    if (confirm('この記録を削除してもよろしいですか？')) {
      deleteRecord(record.id);
      navigate('/');
    }
  };

  const handleUpdateDate = () => {
    if (editDate) {
      updateRecord(record.id, { visitDate: new Date(editDate).toISOString() });
      setIsEditingDate(false);
    }
  };

  const handleUpdateInfo = () => {
    updateRecord(record.id, editInfo);
    setIsEditingInfo(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-2xl hover:opacity-70 transition-opacity"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-foreground">詳細</h1>
          <button
            onClick={handleDeleteRecord}
            className="text-red-500 hover:opacity-70 transition-opacity"
          >
            🗑️
          </button>
        </div>

        {/* 御朱印画像 */}
        <div className="bg-surface rounded-2xl overflow-hidden border border-border mb-6">
          <img
            src={record.imageUri}
            alt={record.shrineName}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* 神社情報 */}
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {record.shrineName}
            </h2>
            <p className="text-muted">{record.location}</p>
          </div>

          {/* 参拝日 */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">参拝日</p>
                <p className="text-lg font-semibold text-foreground">{dateStr}</p>
              </div>
              <button
                onClick={() => {
                  setIsEditingDate(true);
                  setEditDate(record.visitDate.split('T')[0]);
                }}
                className="text-primary hover:opacity-70 transition-opacity"
              >
                ✏️
              </button>
            </div>
            {isEditingDate && (
              <div className="mt-4 space-y-2">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateDate}
                    className="flex-1 bg-primary text-white rounded-lg p-2 hover:opacity-90"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="flex-1 bg-surface text-foreground rounded-lg p-2 border border-border"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 御祭神 */}
          {record.deities.length > 0 && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-sm text-muted mb-2">御祭神</p>
              <div className="space-y-1">
                {record.deities.map((deity, idx) => (
                  <p key={idx} className="text-foreground">
                    {deity}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 創建 */}
          {record.founded && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-sm text-muted mb-2">創建</p>
              <p className="text-foreground">{record.founded}</p>
            </div>
          )}

          {/* 歴史 */}
          {record.history && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-sm text-muted mb-2">歴史</p>
              <p className="text-foreground text-sm leading-relaxed">{record.history}</p>
            </div>
          )}

          {/* 見どころ */}
          {record.highlights.length > 0 && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-sm text-muted mb-2">見どころ</p>
              <ul className="space-y-1">
                {record.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-foreground text-sm">
                    • {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 参拝写真 */}
          {record.additionalImages.length > 0 && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-sm text-muted mb-2">参拝写真</p>
              <div className="grid grid-cols-2 gap-2">
                {record.additionalImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`参拝写真 ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
