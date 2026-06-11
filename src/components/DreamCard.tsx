import React, { useState, useEffect } from "react";
import { Award, Volume2, Download, Share2, Sparkles, X, RotateCcw, Heart, Loader2 } from "lucide-react";
import { MergedCostumeRenderer } from "./JobSVGRenderers";
import { Job } from "../types";

interface DreamCardProps {
  topJob: Job;
  bottomJob: Job;
  userName: string;
  customText: string;
  capturedImage: string | null;
  onClose: () => void;
}

interface CertificateData {
  recipientName: string;
  jobTitle: string;
  accomplishmentStory: string;
  encouragement: string;
  audioText: string;
  isOfflineMode: boolean;
}

export const DreamCard: React.FC<DreamCardProps> = ({
  topJob,
  bottomJob,
  userName,
  customText,
  capturedImage,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Trigger Gemini API to analyze the costume and fetch certificate details
  useEffect(() => {
    generateDreamCertificate();
  }, [topJob, bottomJob, userName, customText]);

  const generateDreamCertificate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/analyze-costume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: capturedImage,
          topJob: { id: topJob.id, title: topJob.title, description: topJob.description },
          bottomJob: { id: bottomJob.id, title: bottomJob.title, description: bottomJob.description },
          userName: userName,
          customText: customText,
        }),
      });

      if (!response.ok) {
        throw new Error("임명장 내용을 만드는 도중 실패했어요.");
      }

      const json = await response.json();
      setData(json);

      // Save to local cache database (persistent browser cache as requested!)
      saveToBrowserDatabaseHistory(json);

      // Play introductory pop and speak automatically!
      setTimeout(() => {
        speakContent(json.audioText);
      }, 500);

    } catch (err: any) {
      console.error("DreamCard: Failed to load custom certificate:", err);
      setError(err?.message || "네트워크 연결이 지연되고 있어서 오프라인 카드를 만들어 드렸어요!");
    } finally {
      setLoading(false);
    }
  };

  const saveToBrowserDatabaseHistory = (cert: CertificateData) => {
    try {
      const historyKey = "kids_ar_costume_history_v2";
      const existingStr = localStorage.getItem(historyKey) || "[]";
      const historyArr = JSON.parse(existingStr);

      const newRecord = {
        id: "cert_" + Date.now(),
        recipientName: cert.recipientName,
        jobTitle: cert.jobTitle,
        accomplishmentStory: cert.accomplishmentStory,
        encouragement: cert.encouragement,
        capturedImage: capturedImage,
        timestamp: Date.now(),
        topJobId: topJob.id,
        bottomJobId: bottomJob.id,
      };

      // Limit to max 40 entries
      const updated = [newRecord, ...historyArr].slice(0, 40);
      localStorage.setItem(historyKey, JSON.stringify(updated));

      // Trigger a local storage update event to synchronize with other observers
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to commit database cache.", e);
    }
  };

  const speakContent = async (text: string) => {
    if (isPlayingAudio) {
      if (localAudioUrl) {
        // Stop current play if any
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
    }

    setIsPlayingAudio(true);

    // Call server-side High Quality Gemini TTS or default to local Web Speech API
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.audio) {
          // Play PCM/WAV converted base64 audio
          const binary = atob(result.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(blob);
          setLocalAudioUrl(audioUrl);

          const sound = new Audio(audioUrl);
          sound.play();
          sound.onended = () => {
            setIsPlayingAudio(false);
          };
          return;
        }
      }
    } catch {
      console.log("DreamCard: Server-side TTS failed, falling back to local speech synthesis.");
    }

    // Default 100% reliable local client-side Speech Synthesis backup
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.05;
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  // Safe download of the generated appointment card image
  const handleDownload = () => {
    if (!capturedImage) {
      // Create mockup canvas if no webcam snap exists, downloading of direct vector is easy too
      const link = document.createElement("a");
      link.download = `우리동네_임명장_${userName || "꼬마영웅"}.txt`;
      link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(
        `[ 우리동네 명예 임명장 ]\n임명 대상: ${data?.recipientName}\n직업 명칭: ${data?.jobTitle}\n\n활약상:\n${data?.accomplishmentStory}\n\n격려:\n${data?.encouragement}`
      );
      link.click();
      return;
    }

    // Trigger local anchor downloads
    const link = document.createElement("a");
    link.download = `우리동네_AR직업임명장_${userName || "꼬마영웅"}.png`;
    link.href = capturedImage;
    link.click();
  };

  const handleShare = () => {
    setIsCopied(true);
    try {
      navigator.clipboard.writeText(
        `⭐ 우리동네의 새로운 명예 대원 탄생! ⭐\n${data?.recipientName} 마스터가 ${data?.jobTitle}이 되어 활약 중이에요!\n아름다운 꿈 체험을 친구들도 함께 시작해봐요!`
      );
    } catch {}
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl border-8 border-vibrant-yellow max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Confetti decoration falling layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <div className="confetti-paper bg-vibrant-coral w-2 h-4 absolute rounded-full top-0 left-1/4 animate-[bounce_3s_infinite_ease-in-out]" />
          <div className="confetti-paper bg-vibrant-blue w-3.5 h-3 absolute rounded-full top-0 left-2/4 animate-[bounce_4.2s_infinite_ease-in-out_0.5s]" />
          <div className="confetti-paper bg-vibrant-yellow w-2 h-4 absolute rounded-full top-0 left-3/4 animate-[bounce_3.6s_infinite_ease-in-out_1s]" />
          <div className="confetti-paper bg-vibrant-orange w-3 h-3 absolute rounded-full top-0 left-1/3 animate-[bounce_4.8s_infinite_ease-in-out_1.5s]" />
          <div className="confetti-paper bg-vibrant-green w-2.5 h-4.5 absolute rounded-full top-0 left-2/3 animate-[bounce_3.9s_infinite_ease-in-out_2s]" />
        </div>

        {/* Header decoration */}
        <div className="p-5 bg-vibrant-coral border-b-4 border-red-700 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-6 h-6 text-white animate-bounce" />
            <h2 className="text-lg font-black tracking-tight text-white">우리동네 드림 직업 임명장 도착! 💝</h2>
          </div>
          <button
            id="btn-close-cert-overlay"
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1 text-white hover:bg-white/30 rounded-full transition"
            title="임명장 창 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-vibrant-bg min-h-[400px]">
            <Loader2 className="w-12 h-12 text-vibrant-orange animate-spin mb-4" />
            <h3 className="text-lg font-black text-vibrant-brown">우체부 부엉이가 열심히 임명장을 배달하고 있어요...</h3>
            <p className="text-xs text-vibrant-brown/80 font-bold mt-1">인공지능 비서가 아이의 패션을 읽고 세세한 모험담을 짓고 있습니다!</p>
          </div>
        )}

        {/* Certificate Display Content */}
        {!loading && data && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-vibrant-bg flex flex-col items-center gap-6">
            
            {/* Elegant Appointment Document Frame Layer */}
            <div
              id="printed-certificate-sheet"
              className="relative w-full border-8 border-double border-vibrant-yellow bg-white p-6 rounded-[30px] shadow-inner flex flex-col md:flex-row items-center gap-6"
            >
              {/* Captured Photo / Custom mannequin preview left */}
              <div className="w-44 h-56 bg-vibrant-peach rounded-2xl border-4 border-vibrant-yellow flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                {capturedImage ? (
                  <img src={capturedImage} alt="AR Portrait of child" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-vibrant-peach p-2 flex items-center justify-center">
                    <MergedCostumeRenderer topJobId={topJob.id} bottomJobId={bottomJob.id} scale={0.9} offsetY={10} />
                  </div>
                )}
              </div>

              {/* Text certificate body right */}
              <div className="flex-1 text-center md:text-left flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-amber-600 font-extrabold tracking-widest uppercase">제 2026-우리동네호 호</span>
                  <div className="w-12 h-12 rounded-full border-4 border-red-400 bg-red-100 flex items-center justify-center text-red-500 rotate-12 font-black text-xs select-none">
                    칭찬도장
                  </div>
                </div>

                <h1 className="font-extrabold text-2xl text-vibrant-coral tracking-tight border-b-2 border-dashed border-vibrant-yellow pb-2">
                  명예 임명장
                </h1>

                <div className="mt-1">
                  <p className="text-sm font-extrabold text-vibrant-brown">
                    임명대상: <strong className="text-lg text-vibrant-brown border-b-2 border-vibrant-orange px-1">{data.recipientName}</strong>
                  </p>
                  <p className="text-sm font-extrabold text-vibrant-coral mt-2">
                    임명업무: <strong className="text-base text-xl text-vibrant-orange font-black">{data.jobTitle}</strong>
                  </p>
                </div>

                {/* Accomplishment and Adventures story generated */}
                <div className="bg-vibrant-peach p-3.5 rounded-2xl border-2 border-dashed border-vibrant-yellow mt-1">
                  <p className="text-xs text-vibrant-brown font-black leading-relaxed">
                    {data.accomplishmentStory}
                  </p>
                </div>

                {/* Warm encouraging message */}
                <p className="text-xs text-vibrant-orange italic mt-1 font-bold flex items-center gap-1 justify-center md:justify-start">
                  <Heart className="w-3.5 h-3.5 text-vibrant-coral fill-vibrant-coral animate-pulse" />
                  <span>{data.encouragement}</span>
                </p>
              </div>
            </div>

            {/* Speach Voice Reading controls bar */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-3xl border-4 border-vibrant-yellow shadow-inner gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-extrabold text-xs text-vibrant-brown flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-vibrant-orange" />
                  <span>임명장 동화 구연 듣기 🎙️</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 max-w-sm">
                  우리동네 동물 마스코트가 실감 나는 목소리로 축하 편지를 읽어줄게요! 귀를 기울여 봐요!
                </p>
              </div>

              <button
                id="btn-play-congo-tts"
                onClick={() => speakContent(data.audioText)}
                className={`px-5 py-2 rounded-full font-black text-xs text-white border-b-4 hover:scale-105 active:scale-95 active:translate-y-0.5 transition flex items-center gap-1.5 shadow-md ${
                  isPlayingAudio 
                    ? "bg-vibrant-coral border-red-800" 
                    : "bg-vibrant-blue hover:bg-indigo-750 border-indigo-900"
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? "소리 끄기 🔇" : "목소리로 들려줘! 🔊"}</span>
              </button>
            </div>

            {/* Actions for local saving / sharing */}
            <div className="w-full flex justify-center gap-3">
              {/* Photo Booth card download option */}
              <button
                id="btn-download-cert"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-vibrant-green hover:bg-[#58af62] text-white rounded-full font-extrabold text-sm shadow-md border-b-4 border-emerald-800 transition active:translate-y-0.5 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>기기에 사진 저장 💾</span>
              </button>

              <button
                id="btn-share-cert"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-vibrant-blue hover:bg-[#34a2e2] text-white rounded-full font-extrabold text-sm shadow-md border-b-4 border-blue-800 transition active:translate-y-0.5 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{isCopied ? "복사 성공! 👍" : "가족들에게 공유하기 🔗"}</span>
              </button>
            </div>

            {/* Offline notice tag if Gemini API failed */}
            {data.isOfflineMode && (
              <span className="text-[10px] text-vibrant-brown/60 font-bold">
                ✔️ 이 임명장은 오프라인 맞춤화 모드로 작성되었습니다.
              </span>
            )}

          </div>
        )}

        {/* Bottom controller button bar footer */}
        <div className="p-4 bg-vibrant-peach border-t-2 border-vibrant-yellow/40 flex justify-end gap-2 z-10 animate-fade-in">
          <button
            id="btn-restart-fitting"
            onClick={onClose}
            className="px-5 py-2.5 bg-vibrant-orange text-white border-b-4 border-amber-800 rounded-full font-extrabold text-xs hover:bg-amber-600 active:scale-95 active:translate-y-0.5 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새로운 직업 입어보기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
