import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGosuinStorage } from '../hooks/useGosuinStorage';
import { analyzeShrineImage, imageToBase64 } from '../lib/api';

export default function Add() {
  const navigate = useNavigate();
  const { saveRecord } = useGosuinStorage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('画像の選択に失敗しました');
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setError(null);
      setIsAnalyzing(true);

      // Base64に変換
      const base64Image = selectedImage.split(',')[1];

      // AIで分析
      const shrineInfo = await analyzeShrineImage(base64Image);

      // 記録を保存
      const newRecord = {
        id: Date.now().toString(),
        imageUri: selectedImage,
        additionalImages: [],
        shrineName: shrineInfo.shrineName,
        location: shrineInfo.location,
        deities: shrineInfo.deities,
        founded: shrineInfo.founded,
        history: shrineInfo.history,
        highlights: shrineInfo.highlights,
        visitDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      saveRecord(newRecord);

      // 詳細画面に遷移
      navigate(`/detail/${newRecord.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : '分析に失敗しました';
      setError(message);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl font-bold text-foreground">御朱印を追加</h1>
          </div>
          <p className="text-sm text-muted">月の光に照らされた新しい思い出を記録</p>
        </div>

        {/* 画像プレビュー */}
        {selectedImage ? (
          <div className="bg-surface rounded-2xl overflow-hidden border-2 border-primary shadow-sm mb-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full aspect-square object-cover"
            />
          </div>
        ) : (
          <label className="block bg-surface rounded-2xl border-2 border-dashed border-primary/30 items-center justify-center aspect-square mb-4 cursor-pointer hover:bg-opacity-50 transition-colors">
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-4xl">🌙</span>
              <p className="text-muted text-center">画像を選択してください</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-error/10 rounded-xl p-3 border border-error mb-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* ボタン */}
        <div className="space-y-3 mb-4">
          <label className="block">
            <div className="bg-primary rounded-xl p-4 text-center text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity">
              📷 カメラで撮影
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>

          <label className="block">
            <div className="bg-surface rounded-xl p-4 text-center text-foreground font-semibold border-2 border-primary/30 cursor-pointer hover:bg-opacity-50 transition-colors">
              🖼️ ギャラリーから選択
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>

          {selectedImage && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary rounded-xl p-4 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzing && <span className="animate-spin">⏳</span>}
              {isAnalyzing ? '分析中...' : '✨ 分析する'}
            </button>
          )}
        </div>

        <p className="text-xs text-muted text-center">
          御朱印の写真をアップロードすると、AIが神社を特定して情報を取得します
        </p>
      </div>
    </div>
  );
}
