import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDreamHistory } from './services/dreamApi';

interface DreamRecord {
  _id: string;
  dreamContent: string;
  analysisResult: string;
  createdAt: string;
}

const DreamHistoryPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<DreamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DreamRecord | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getDreamHistory(user._id);
        setRecords(data.records || []);
      } catch (err) {
        setError('載入夢境紀錄失敗，請稍後再試');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="p-8 text-center">載入夢境紀錄中...</div>;

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl mb-4">請先登入會員，查看你的夢境紀錄</h2>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">我的夢境紀錄</h1>

      {records.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          暫時未有任何夢境紀錄，開始記錄第一個夢啦✨
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedRecord(item)}
              className="border p-4 rounded-lg cursor-pointer hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-start">
                <p className="font-medium truncate max-w-[70%]">
                  {item.dreamContent.slice(0, 60)}...
                </p>
                <span className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleString('zh-HK')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 彈窗：查看完整解夢 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">夢境詳細報告</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕ 關閉
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">夢境內容：</p>
              <p className="whitespace-pre-wrap">{selectedRecord.dreamContent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">解夢分析：</p>
              <p className="whitespace-pre-wrap">{selectedRecord.analysisResult}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamHistoryPage;
