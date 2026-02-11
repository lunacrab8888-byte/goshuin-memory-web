import { GosuinRecord } from '../hooks/useGosuinStorage';
import { useNavigate } from 'react-router-dom';

interface RecordCardProps {
  record: GosuinRecord;
}

export default function RecordCard({ record }: RecordCardProps) {
  const navigate = useNavigate();
  const visitDate = new Date(record.visitDate);
  const dateStr = visitDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <button
      onClick={() => navigate(`/detail/${record.id}`)}
      className="w-full text-left bg-surface rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 p-4">
        {/* 画像 */}
        <img
          src={record.imageUri}
          alt={record.shrineName}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />

        {/* 情報 */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {record.shrineName}
            </h3>
            <p className="text-sm text-muted mt-1">{record.location}</p>
          </div>
          <p className="text-xs text-muted">参拝日: {dateStr}</p>
        </div>
      </div>
    </button>
  );
}
