import React from "react";
import { ChevronLeft, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { Job } from "../types";

interface JobSelectorProps {
  jobs: Job[];
  selectedTopIndex: number;
  selectedBottomIndex: number;
  onSelectTop: (index: number) => void;
  onSelectBottom: (index: number) => void;
}

export const JobSelector: React.FC<JobSelectorProps> = ({
  jobs,
  selectedTopIndex,
  selectedBottomIndex,
  onSelectTop,
  onSelectBottom,
}) => {
  const currentTop = jobs[selectedTopIndex];
  const currentBottom = jobs[selectedBottomIndex];

  const handleNextTop = () => {
    onSelectTop((selectedTopIndex + 1) % jobs.length);
    playPop();
  };

  const handlePrevTop = () => {
    onSelectTop((selectedTopIndex - 1 + jobs.length) % jobs.length);
    playPop();
  };

  const handleNextBottom = () => {
    onSelectBottom((selectedBottomIndex + 1) % jobs.length);
    playPop();
  };

  const handlePrevBottom = () => {
    onSelectBottom((selectedBottomIndex - 1 + jobs.length) % jobs.length);
    playPop();
  };

  // Cute pop synthesizer sound
  const playPop = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {}
  };

  // Voice Speech: Mascot reads details of the selected clothing
  const speakDetails = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "ko-KR";
      utterance.rate = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. TOP SELECTOR CARD */}
      <div className="bg-white p-5 rounded-[30px] border-4 border-vibrant-yellow shadow-xl relative overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 left-0 w-full h-2 bg-vibrant-yellow"></div>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-vibrant-orange text-white px-3 py-1 rounded-full text-xs font-black">상의 & 모자 코디 👒</span>
          <span className="text-xs text-slate-500 font-medium">옆 버튼을 눌러 자유롭게 매칭해 보세요!</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            id="btn-prev-top"
            onClick={handlePrevTop}
            aria-label="이전 상의 조합 고르기"
            className="w-12 h-12 bg-vibrant-orange hover:bg-amber-650 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-2xl font-bold"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Central top card layout */}
          <div className="flex-1 text-center bg-vibrant-peach py-4 px-6 rounded-2xl border-2 border-dashed border-vibrant-yellow flex flex-col items-center">
            <span className="text-4xl mb-2 animate-bounce">{currentTop.emoji}</span>
            <h3 className="font-extrabold text-xl text-vibrant-brown flex items-center gap-1">
              <span>{currentTop.title}</span>
              <button
                id={`btn-listen-top-${currentTop.id}`}
                onClick={() => speakDetails(`${currentTop.title}! ${currentTop.topCap}를 멋지게 걸쳐보세요!`)}
                className="p-1 text-vibrant-orange hover:text-amber-600 transition"
                title="직업 목소리 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </h3>
            <p className="text-xs font-bold text-vibrant-orange mt-1">{currentTop.topCap}</p>
            <p className="text-[11px] text-vibrant-brown/70 mt-0.5 font-medium">장식: {currentTop.topDesc}</p>
          </div>

          <button
            id="btn-next-top"
            onClick={handleNextTop}
            aria-label="다음 상의 조합 고르기"
            className="w-12 h-12 bg-vibrant-orange hover:bg-amber-650 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-2xl font-bold"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* 2. BOTTOM SELECTOR CARD */}
      <div className="bg-white p-5 rounded-[30px] border-4 border-vibrant-green shadow-xl relative overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 left-0 w-full h-2 bg-vibrant-green"></div>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-vibrant-green text-white px-3 py-1 rounded-full text-xs font-black">하의 & 슈즈 코디 ⛸️</span>
          <span className="text-xs text-slate-500 font-medium">바지와 신발을 매치해 보세요!</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            id="btn-prev-bottom"
            onClick={handlePrevBottom}
            aria-label="이전 하의 조합 고르기"
            className="w-12 h-12 bg-vibrant-green hover:bg-emerald-650 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-2xl font-bold"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Central bottom card layout */}
          <div className="flex-1 text-center bg-[#F1F9F1] py-4 px-6 rounded-2xl border-2 border-dashed border-vibrant-green flex flex-col items-center">
            <span className="text-4xl mb-2 animate-bounce">{currentBottom.emoji}</span>
            <h3 className="font-extrabold text-xl text-vibrant-green-dark flex items-center gap-1">
              <span>{currentBottom.title}</span>
              <button
                id={`btn-listen-bottom-${currentBottom.id}`}
                onClick={() => speakDetails(`${currentBottom.title} 슈즈! ${currentBottom.bottomCap}와 ${currentBottom.bottomDesc}입니다.`)}
                className="p-1 text-vibrant-green hover:text-emerald-700 transition"
                title="직업 목소리 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </h3>
            <p className="text-xs font-bold text-vibrant-green-dark mt-1">{currentBottom.bottomCap}</p>
            <p className="text-[11px] text-vibrant-green-dark/70 mt-0.5 font-medium">슈즈: {currentBottom.bottomDesc}</p>
          </div>

          <button
            id="btn-next-bottom"
            onClick={handleNextBottom}
            aria-label="다음 하의 조합 고르기"
            className="w-12 h-12 bg-vibrant-green hover:bg-emerald-650 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-2xl font-bold"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Funny Career Merge Preview */}
      {currentTop.id !== currentBottom.id && (
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <div className="text-left">
              <h4 className="font-extrabold text-xs text-purple-800">우와! 새로운 미래 융합직업 탄생!</h4>
              <p className="text-[10px] text-purple-600">
                {currentTop.title} 상의에 {currentBottom.title} 하의를 매칭하셨어요! 어떤 꿈이 될까요?
              </p>
            </div>
          </div>
          <button
            id="btn-speak-fusion"
            onClick={() => speakDetails(`${currentTop.title}과 ${currentBottom.title}이 합쳐진 멋진 직업 명예 영웅이 탄생했어요!`)}
            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 active:scale-95 transition flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>이야기 듣기</span>
          </button>
        </div>
      )}
    </div>
  );
};
