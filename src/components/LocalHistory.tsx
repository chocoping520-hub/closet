import React, { useState, useEffect } from "react";
import { History, Award, Calendar, Trash2 } from "lucide-react";

interface SavedRecord {
  id: string;
  recipientName: string;
  jobTitle: string;
  accomplishmentStory: string;
  encouragement: string;
  capturedImage?: string;
  timestamp: number;
  topJobId: string;
  bottomJobId: string;
}

interface LocalHistoryProps {
  onReopenRecord: (record: SavedRecord) => void;
}

export const LocalHistory: React.FC<LocalHistoryProps> = ({ onReopenRecord }) => {
  const [history, setHistory] = useState<SavedRecord[]>([]);

  // Query local cache database on mount and whenever storage events fire
  useEffect(() => {
    loadCachedDatabase();

    const syncDatabase = () => {
      loadCachedDatabase();
    };

    window.addEventListener("storage", syncDatabase);
    return () => {
      window.removeEventListener("storage", syncDatabase);
    };
  }, []);

  const loadCachedDatabase = () => {
    try {
      const dbStr = localStorage.getItem("kids_ar_costume_history_v2") || "[]";
      setHistory(JSON.parse(dbStr));
    } catch (e) {
      console.error("LocalHistory: Failed to load local database cache:", e);
    }
  };

  const deleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering reopen click
    try {
      const filtered = history.filter((record) => record.id !== id);
      localStorage.setItem("kids_ar_costume_history_v2", JSON.stringify(filtered));
      setHistory(filtered);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to update cache on delete:", e);
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-vibrant-peach border-4 border-dashed border-vibrant-yellow p-6 rounded-[30px] text-center shadow-inner mt-2">
        <History className="w-8 h-8 text-vibrant-orange mx-auto mb-2 animate-pulse" />
        <p className="text-xs font-black text-vibrant-brown">아직 발급받은 임명장이 없어요.</p>
        <p className="text-[10px] text-vibrant-brown/80 mt-0.5 font-bold">멋진 직업 옷들을 입어보고 위에 있는 [임명장 만들기]를 찰깍 눌러보세요!</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-vibrant-orange animate-spin-slow" />
        <h3 className="font-extrabold text-sm text-slate-800">
          내 임명장 보관함 🎒 <span className="text-xs text-vibrant-orange font-black font-mono">({history.length})</span>
        </h3>
        <span className="text-[10px] bg-vibrant-orange text-white px-3 py-0.5 rounded-full font-black">브라우저 안전 보관중</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {history.map((record) => (
          <div
            key={record.id}
            id={`btn-reopen-history-${record.id}`}
            onClick={() => onReopenRecord(record)}
            className="group relative bg-white border-2 border-slate-100 hover:border-vibrant-orange rounded-[25px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 flex flex-col scale-100 hover:scale-102"
          >
            {/* Embedded Polaroid style thumbnail */}
            <div className="w-full aspect-[4/5] bg-vibrant-peach overflow-hidden relative border-b-2 border-slate-100 flex items-center justify-center">
              {record.capturedImage ? (
                <img
                  src={record.capturedImage}
                  alt={record.jobTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="text-2xl animate-pulse">🏅</div>
              )}

              {/* Delete trash button overlaid on corner hover */}
              <button
                id={`btn-delete-history-${record.id}`}
                onClick={(e) => deleteRecord(record.id, e)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-vibrant-coral text-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100 shadow-md z-30"
                title="임명장 삭제"
              >
                <Trash2 className="w-3 px-0.5 h-3" />
              </button>
            </div>

            {/* Polaroid footer card labels */}
            <div className="p-2.5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h4 className="font-extrabold text-[11px] text-vibrant-brown line-clamp-1">
                  명예 {record.jobTitle}
                </h4>
                <p className="text-[10px] font-bold text-vibrant-orange mt-0.5">
                  대원: {record.recipientName}
                </p>
              </div>

              <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 border-t border-slate-50 pt-1">
                <Calendar className="w-2.5 h-2.5" />
                <span>
                  {new Date(record.timestamp).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
