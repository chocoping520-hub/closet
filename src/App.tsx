import { useState, useEffect } from "react";
import { Sparkles, Heart, Wand2, Award, Smile, RotateCw, ChevronUp, ChevronDown, X } from "lucide-react";
import { JOBS_LIST } from "./constants/jobs";
import { CameraAR } from "./components/CameraAR";
import { DreamCard } from "./components/DreamCard";
import { LocalHistory } from "./components/LocalHistory";
import { MergedCostumeRenderer } from "./components/JobSVGRenderers";
import { Job } from "./types";

export default function App() {
  // Selected garments index matrices
  const [selectedTopIndex, setSelectedTopIndex] = useState(0);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState(0);

  // Kid custom profiles
  const [userName, setUserName] = useState("박대원");
  const [customText, setCustomText] = useState("씩씩하게 우리동네 이웃들을 돕고 싶어요!");

  // AR Captured / Active states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [newCertificateReady, setNewCertificateReady] = useState(false);

  // Archive modal / active hints
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeHintJob, setActiveHintJob] = useState<Job | null>(null);
  const [hintPage, setHintPage] = useState<number>(0);

  // Track currently selected history record when they wish to re-open a previously saved certificate
  const [selectedHistoryCert, setSelectedHistoryCert] = useState<any | null>(null);

  const topJob = JOBS_LIST[selectedTopIndex];
  const bottomJob = JOBS_LIST[selectedBottomIndex];

  // Mascot welcome message
  useEffect(() => {
    // Welcoming greeting
    setTimeout(() => {
      speakLocal("안녕! 우리동네 에이알 요술옷장에 온 것을 환영해! 마음에 드는 옷들을 골라 입어봐!");
    }, 1200);
  }, []);

  const speakLocal = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Triggers when photo snapshot is captured successfully inside child CameraAR
  const handleSnapshotCaptured = (imageUri: string) => {
    setCapturedImage(imageUri);
    setNewCertificateReady(true);
    speakLocal("우와아! 멋진 명예 임명장이 안전하게 제작되어 보관함에 보관되었어요! 상단에 나타난 '방금 만든 임명장 보기' 단추를 눌러서 확인해 봐요! 📜");
  };

  const handleReopenHistory = (record: any) => {
    setSelectedHistoryCert(record);
  };

  // Cycle handlers
  const handlePrevTop = () => {
    setSelectedTopIndex((prev) => (prev - 1 + JOBS_LIST.length) % JOBS_LIST.length);
  };

  const handleNextTop = () => {
    setSelectedTopIndex((prev) => (prev + 1) % JOBS_LIST.length);
  };

  const handlePrevBottom = () => {
    setSelectedBottomIndex((prev) => (prev - 1 + JOBS_LIST.length) % JOBS_LIST.length);
  };

  const handleNextBottom = () => {
    setSelectedBottomIndex((prev) => (prev + 1) % JOBS_LIST.length);
  };

  // Mixed random costume picker ("요술 랜덤코디 🪄")
  const pickRandomMixAndMatch = () => {
    const randomTop = Math.floor(Math.random() * JOBS_LIST.length);
    const randomBottom = Math.floor(Math.random() * JOBS_LIST.length);
    setSelectedTopIndex(randomTop);
    setSelectedBottomIndex(randomBottom);

    const matchTop = JOBS_LIST[randomTop];
    const matchBottom = JOBS_LIST[randomBottom];

    // Cheerful chime synthesis
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046, audioCtx.currentTime + 0.24); // C6
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {}

    speakLocal(`얍! ${matchTop.title} 상의와 ${matchBottom.title} 하의가 섞여서 마법 조합이 완성되었어!`);
  };

  // For celebration animation
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastMatchedJobId, setLastMatchedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTopIndex === selectedBottomIndex) {
      const matchJob = JOBS_LIST[selectedTopIndex];
      // Avoid re-triggering if we already celebrated this exact match
      if (lastMatchedJobId !== matchJob.id) {
        setLastMatchedJobId(matchJob.id);
        triggerCelebration(matchJob);
      }
    } else {
      // Reset match key if they break the combination, permitting them to recomplete it later
      setLastMatchedJobId(null);
    }
  }, [selectedTopIndex, selectedBottomIndex]);

  const triggerCelebration = (job: Job) => {
    // Play retro chime synthesis
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      osc.frequency.setValueAtTime(1318.51, now + 0.4); // E6
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.9);
    } catch {}

    // Play beautiful children voice-over line
    const voiceScripts: Record<string, string> = {
      firefighter: "삐뽀삐뽀! 불이 나면 언제든 출동하여 우리 이웃을 씩씩하게 구해내는 용감한 명예 소방관 패션 완성! 안전지킵이 참 잘했어요!",
      police: "꼼짝 마라! 우리 동네를 지키는 씩씩하고 정의로운 경찰관 패션을 완성했어요! 우리 동네 안전 지킴이 최고!",
      doctor: "아픈 곳을 치료해주고 심장 소리를 따뜻하게 보살펴 줄 다정한 명예 의사 가운 완성! 마음씨가 참 고와요!",
      nurse: "토닥토닥! 아픈 환자들의 곁에서 하트 캡을 쓰고 힘을 주는 친절한 천사표 간호사 패션 완성! 참 잘했어요!",
      baker: "고소한 빵 냄새가 솔솔! 세상에서 가장 달콤하고 맛있는 빵을 만드는 꼬마 제빵사 대원 완성! 벌써 군침이 돌아요!",
      zookeeper: "동물이 너무 좋아! 귀여운 판다와 호랑이 친구들을 사랑으로 보살 피는 다정한 동물의 친구 사육사 코디 완성!",
      ballerina: "샤랄라~ 우아한 날개를 펴듯 아름다운 턴을 돌며 클래식 무대를 환히 밝힐 공주 발레리나 꽃장식 의상 완성!",
      idol: "반짝이는 무대 위의 최고 스타! 온 세상 어린이에게 노래와 춤으로 사랑을 퍼뜨릴 만능 아이돌 스타 완료!",
      skating: "얼음 궁전 위를 하얀 날개처럼 쌩쌩 날아오를 우아한 스케이터 요정! 멋진 피겨스케이터 단짝 완성!",
      mechanic: "철컥철컥! 고장 난 자동차와 기계를 무엇이든지 뚝딱 해결하는 만능 해결사 척척 천재 정비공 대원 완료!",
      astronaut: "삼, 이, 일, 발사! 은하계를 횡단하여 미지의 별과 우주비행선 수수께끼를 해결할 용감한 소년 우주비행사 완료!",
      pilot: "안전벨트를 매세요! 구름을 뚫고 끝없는 하늘 정원을 비행할 멋진 선장 캡틴 파일럿 대원 코디 성공!",
      explorer: "고대 보물 탐색 개시! 깊은 모험의 정글 숲을 씩씩하게 개척할 전설적인 정글 탐험가 모험 의상 완성! 모험 출발!",
      magician: "수리수리마수리 얍! 오색 비둘기도 날아오르고 꽃봉오리 피어나는 신기방기 만능 엔터 마술사 의복 완성!",
      scientist: "보글보글 시험 약병을 흔들어 지구 사람들을 더 건강하게 지켜줄 기상천외한 우주 과학자 유니폼 장식 완료!",
      farmer: "토실토실 알밤 수확! 정직하고 부지런하게 맛있는 야채 과일을 정성으로 수수하는 풍년 농부 대원 조합 성공!",
      soccer: "슛~ 골인! 바람만큼 날랜 발로 골대를 향해 질주해 나갈 불꽃 슛 자랑스러운 국가대표 축구 선수 완료!",
      diver: "어푸어푸! 깊은 오색 심해 속 보물 여정과 고래 단짝을 물 지켜 줄 멋진 스쿠버다이버 산소통 장식 완료!",
      hairstylist: "삭둑삭둑 위이잉! 마법 같은 손짓으로 헤어스타일 개성을 살려줄 전설의 마법 가위 최고 디자이너 미용사 성공!",
      gamedeveloper: "빛나라 컴퓨터 코드! 어린이들에게 가장 유익하고 신나는 꿈의 게임 세상을 구동할 게임 개발공 완료!"
    };

    const koreanMsg = voiceScripts[job.id] || `우와! 머리부터 발끝까지 완벽하게 맞는 ${job.title} 패션이 완성되었어요! 아주 멋져요!`;
    speakLocal(koreanMsg);

    // Set visual celebration state!
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen bg-vibrant-bg pb-6 font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Playful Floating cloud elements background decorations */}
      <div className="absolute top-12 left-10 w-24 h-8 bg-white/70 rounded-full blur-xs pointer-events-none animate-pulse" />
      <div className="absolute top-24 right-16 w-32 h-10 bg-white/70 rounded-full blur-xs pointer-events-none animate-pulse" />

      <div>
        {/* HEADER SECTION */}
        <header className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 border-b-4 border-vibrant-yellow bg-white rounded-[30px] shadow-md relative z-10 mt-4 mx-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 bg-vibrant-coral rounded-2xl flex items-center justify-center shadow-md border-b-4 border-red-700 transform hover:rotate-6 transition duration-300">
              <Wand2 className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-vibrant-coral tracking-tight flex items-center justify-center md:justify-start gap-1.5">
                <span>우리동네 직업체험관</span>
                <span className="bg-vibrant-yellow text-slate-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-orange-400 animate-bounce">
                  AR 요술옷장 ✨
                </span>
              </h1>
              <p className="text-[11px] text-slate-550 font-bold mt-0.5">
                다양한 직업의 옷을 직접 조합하여 입어보고 재미있는 모험담을 발급해보세요!
              </p>
            </div>
          </div>

          {/* Controller and History entry locker panel */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FFF9EB] border-2 border-vibrant-yellow rounded-full p-1.5 shadow-inner">
            {newCertificateReady && (
              <button
                id="btn-open-just-captured"
                onClick={() => {
                  setShowCertificate(true);
                  speakLocal("방금 도민 위원회에서 발송한 따끈따끈한 소중한 임명장을 우편함에서 개봉합니다! 우와아!");
                }}
                className="flex items-center gap-1.5 bg-vibrant-coral hover:bg-rose-600 text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow-md border-b-4 border-red-800 active:translate-y-0.5 transition outline-hidden cursor-pointer animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                <span>방금 만든 임명장 보기 📜</span>
              </button>
            )}

            <button
              id="btn-open-locker"
              onClick={() => {
                setShowHistoryModal(true);
                speakLocal("내 명예 임명장 보관함의 두터운 책을 펼칩니다! 🎒");
              }}
              className="flex items-center gap-1.5 bg-vibrant-blue hover:bg-sky-600 text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow-md border-b-4 border-blue-800 active:translate-y-0.5 transition outline-hidden cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 animate-bounce" />
              <span>내 임명장 보관함 🎒</span>
            </button>

            <button
              id="btn-magic-mix"
              onClick={pickRandomMixAndMatch}
              className="flex items-center gap-1.5 bg-vibrant-orange hover:bg-amber-600 text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow-md border-b-4 border-amber-800 active:translate-y-0.5 transition outline-hidden cursor-pointer"
            >
              <RotateCw className="w-3 h-3 animate-spin" />
              <span>이색 요술 코디! 🪄</span>
            </button>
          </div>
        </header>

        {/* CONTAINER */}
        <main className="max-w-6xl mx-auto px-4 pt-4 relative z-10 flex flex-col gap-4">
          
          {/* Compact Form Row */}
          <section className="bg-white px-6 py-2.5 rounded-[24px] border-4 border-vibrant-yellow shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧒</span>
              <div>
                <h2 className="font-extrabold text-xs text-slate-800">어린이 대원 프로필</h2>
                <p className="text-[9px] text-slate-400">등록한 이름과 가치에 맞추어 마법 같은 영예 문서를 지어드릴게요!</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-vibrant-peach border-2 border-vibrant-yellow rounded-full px-3 py-1.5 w-full md:w-36">
                <span className="text-[11px] text-vibrant-brown font-black select-none">이름:</span>
                <input
                  id="input-kid-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={10}
                  placeholder="예) 박대원"
                  className="bg-transparent text-xs font-bold text-slate-800 outline-hidden w-full"
                  aria-label="어린이 대원 이름 입력"
                />
              </div>

              <div className="flex items-center gap-1 bg-vibrant-peach border-2 border-vibrant-yellow rounded-full px-3 py-1.5 w-full md:w-64">
                <span className="text-[11px] text-vibrant-brown font-black select-none">다짐:</span>
                <input
                  id="input-kid-vow"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={40}
                  placeholder="어떤 영웅이 되고 싶나요?"
                  className="bg-transparent text-xs font-bold text-slate-800 outline-hidden w-full"
                  aria-label="어린이 대원 다짐 입력"
                />
              </div>
            </div>
          </section>

          {/* COMPACT CLOTHING AR FITTING HUB WITH ZERO SCROLL */}
          <section className="bg-white p-4 md:p-5 rounded-[40px] border-4 border-vibrant-blue shadow-lg flex flex-col items-center">
            
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <h3 className="font-black text-slate-850 text-sm md:text-base flex items-center gap-1.5">
                <span className="text-vibrant-blue">실시간 요술 피팅룸 🪞</span>
                <span className="text-[10px] text-slate-450 font-bold">| 왼쪽 화살표는 하의를, 오른쪽 화살표는 상의를 골라요!</span>
              </h3>
              
              {selectedTopIndex === selectedBottomIndex && (
                <span className="bg-vibrant-coral text-white font-black text-[10px] px-2.5 py-0.5 rounded-full border border-red-700 animate-pulse flex items-center gap-1">
                  ⭐ {topJob.title} 세트 완성!
                </span>
              )}
            </div>

            {/* Interactive Fitting Booth Center Row */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-5xl mx-auto">
              
              {/* LEFT COLUMN: Bottom Outfit Selector Arrows */}
              <div className="flex flex-col items-center justify-center gap-5">
                <button
                  id="btn-prev-bottom"
                  onClick={handlePrevBottom}
                  className="w-14 h-14 bg-vibrant-green hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 border-b-4 border-emerald-800 active:translate-y-0.5 transition-all outline-hidden cursor-pointer"
                  title="이전 하의 스타일"
                >
                  <ChevronUp className="w-8 h-8 stroke-[3.5]" />
                </button>
                
                <span className="text-xs font-black text-vibrant-green bg-green-50 px-3 py-1 rounded-md border border-green-200">하의</span>
                
                <button
                  id="btn-next-bottom"
                  onClick={handleNextBottom}
                  className="w-14 h-14 bg-vibrant-green hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 border-b-4 border-emerald-800 active:translate-y-0.5 transition-all outline-hidden cursor-pointer"
                  title="다음 하의 스타일"
                >
                  <ChevronDown className="w-8 h-8 stroke-[3.5]" />
                </button>
              </div>

              {/* CENTER FITTING BOOTH CAMERA */}
              <div className="flex-1 max-w-2xl">
                <CameraAR
                  topJob={topJob}
                  bottomJob={bottomJob}
                  onSnapshot={handleSnapshotCaptured}
                />
              </div>

              {/* RIGHT COLUMN: Top Outfit Selector Arrows */}
              <div className="flex flex-col items-center justify-center gap-5">
                <button
                  id="btn-prev-top"
                  onClick={handlePrevTop}
                  className="w-14 h-14 bg-vibrant-orange hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 border-b-4 border-amber-800 active:translate-y-0.5 transition-all outline-hidden cursor-pointer"
                  title="이전 상의 스타일"
                >
                  <ChevronUp className="w-8 h-8 stroke-[3.5]" />
                </button>
                
                <span className="text-xs font-black text-vibrant-orange bg-orange-50 px-3 py-1 rounded-md border border-orange-200">상의</span>
                
                <button
                  id="btn-next-top"
                  onClick={handleNextTop}
                  className="w-14 h-14 bg-vibrant-orange hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 border-b-4 border-amber-800 active:translate-y-0.5 transition-all outline-hidden cursor-pointer"
                  title="다음 상의 스타일"
                >
                  <ChevronDown className="w-8 h-8 stroke-[3.5]" />
                </button>
              </div>

            </div>

            {/* 🎖️ 직업별 의상 힌트 발굴장치 */}
            <div className="mt-4 bg-[#FFF9EB] p-4 rounded-[26px] border-2 border-vibrant-yellow shadow-inner w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 gap-2 border-b border-amber-200 pb-2">
                <h4 className="font-extrabold text-xs text-vibrant-brown flex flex-col gap-0.5">
                  <span className="flex items-center gap-1">💡 동네 직업별 가이드 힌트책</span>
                  <span className="text-[10px] text-vibrant-brown/70 font-semibold">(이모지를 누르면 의상 가이드와 찰떡 신발장 마법 힌트가 나타납니다!)</span>
                </h4>
                
                {/* 15 items Pagination Tabs */}
                <div className="flex gap-1.5 self-center sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setHintPage(0);
                      speakLocal("가이드북 1페이지 꿈나무 직업 15가지를 열었습니다!");
                    }}
                    className={`px-3 py-1 text-[11px] font-black rounded-lg border transition duration-250 cursor-pointer ${
                      hintPage === 0
                        ? "bg-vibrant-orange text-white border-orange-600 shadow-sm scale-105"
                        : "bg-white text-vibrant-brown border-amber-250 hover:bg-[#FFF5E1]"
                    }`}
                  >
                    📔 1페이지 (1~15)
                  </button>
                  <button
                    onClick={() => {
                      setHintPage(1);
                      speakLocal("가이드북 2페이지 미래 직업 15가지를 열었습니다!");
                    }}
                    className={`px-3 py-1 text-[11px] font-black rounded-lg border transition duration-250 cursor-pointer ${
                      hintPage === 1
                        ? "bg-vibrant-orange text-white border-orange-600 shadow-sm scale-105"
                        : "bg-white text-vibrant-brown border-amber-250 hover:bg-[#FFF5E1]"
                    }`}
                  >
                    📕 2페이지 (16~30)
                  </button>
                </div>
              </div>

              {/* Emojis list - Slice 15 elements based on active page */}
              <div className="flex flex-wrap gap-2.5 justify-center py-1 select-none">
                {JOBS_LIST.slice(hintPage * 15, (hintPage + 1) * 15).map((job) => (
                  <button
                    key={job.id}
                    id={`btn-hint-${job.id}`}
                    onClick={() => {
                      setActiveHintJob(job);
                      speakLocal(`${job.title} 의상 가이드 팝업을 열었습니다! 어떤 옷들과 요정 신발 세트가 있는지 입혀봐요!`);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xl transition duration-200 hover:scale-115 active:scale-90 shadow-sm outline-hidden cursor-pointer ${
                      activeHintJob?.id === job.id
                        ? "bg-vibrant-coral text-white border-2 border-white scale-110"
                        : "bg-white hover:bg-pink-50 border border-amber-200"
                    }`}
                    title={`${job.title} 힌트`}
                  >
                    {job.emoji}
                  </button>
                ))}
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* OVERLAY POPUP: CURRENT GENERATED CERTIFICATE */}
      {showCertificate && (
        <DreamCard
          topJob={topJob}
          bottomJob={bottomJob}
          userName={userName}
          customText={customText}
          capturedImage={capturedImage}
          onClose={() => {
            setShowCertificate(false);
            setCapturedImage(null);
          }}
        />
      )}

      {/* MAGICAL OUTFIT COMBINATION CENTER POPUP MODAL */}
      {activeHintJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[40px] border-8 border-vibrant-yellow w-full max-w-md overflow-hidden p-6 md:p-8 flex flex-col items-center relative shadow-2xl animate-in zoom-in duration-300">
            
            {/* Close Button X */}
            <button
              onClick={() => setActiveHintJob(null)}
              className="absolute top-5 right-5 p-2 bg-vibrant-peach hover:bg-amber-100 text-[#B45309] rounded-full transition z-10 cursor-pointer outline-hidden border-2 border-vibrant-yellow"
              title="도움말 창 닫기"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Title block */}
            <div className="text-center mb-4 flex flex-col items-center">
              <span className="text-5xl animate-bounce mb-2">{activeHintJob.emoji}</span>
              <h3 className="text-lg font-black text-vibrant-brown">
                {activeHintJob.title} 코디 힌트 도감 📖
              </h3>
              <p className="text-[10px] text-zinc-500 font-extrabold mt-1">어떤 옷들을 입어야 직업과 딱 어울리는 완벽한 짝꿍이 될까요?</p>
            </div>

            {/* Mannequin costume preview drawer */}
            <div className="w-44 h-56 bg-vibrant-peach rounded-[30px] border-4 border-vibrant-yellow relative flex items-center justify-center p-4 shadow-inner mb-4 overflow-visible">
              <div className="absolute top-2 right-2 bg-white/70 px-2.5 py-0.5 rounded-full text-[9px] font-black border border-vibrant-yellow/60">
                마네킹 가판대 🕴️
              </div>
              <MergedCostumeRenderer
                topJobId={activeHintJob.id}
                bottomJobId={activeHintJob.id}
                scale={0.8}
                offsetY={10}
              />
            </div>

            {/* Detailed visual parts board */}
            <div className="w-full bg-[#FFF9EB] p-3.5 rounded-2xl border-2 border-dashed border-vibrant-yellow text-left space-y-2 mb-5">
              {/* Top part details */}
              <div className="flex items-start gap-2">
                <span className="text-lg">👕</span>
                <div>
                  <h4 className="text-[11px] font-black text-vibrant-coral">상의 & 모자 장식</h4>
                  <p className="text-[10px] font-extrabold text-vibrant-brown leading-tight">
                    {activeHintJob.topCap} <span className="text-zinc-500 font-semibold">({activeHintJob.topDesc})</span>
                  </p>
                </div>
              </div>

              {/* Divider line */}
              <div className="border-t border-amber-200 my-1" />

              {/* Bottom part details */}
              <div className="flex items-start gap-2">
                <span className="text-lg">👖</span>
                <div>
                  <h4 className="text-[11px] font-black text-vibrant-green">하의 & 슈즈 장화</h4>
                  <p className="text-[10px] font-extrabold text-vibrant-brown leading-tight">
                    {activeHintJob.bottomCap} <span className="text-zinc-500 font-semibold">({activeHintJob.bottomDesc})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Wear costume button */}
            <button
              id={`btn-apply-popup-${activeHintJob.id}`}
              onClick={() => {
                const matchedIdx = JOBS_LIST.findIndex((j) => j.id === activeHintJob.id);
                if (matchedIdx !== -1) {
                  setSelectedTopIndex(matchedIdx);
                  setSelectedBottomIndex(matchedIdx);
                  speakLocal(`화라락! 마법 요술로 ${activeHintJob.title} 가이드를 단번에 장착했어요!`);
                  setActiveHintJob(null); // Close popup
                }
              }}
              className="w-full py-2.5 bg-vibrant-orange hover:bg-amber-600 text-white font-extrabold text-xs rounded-full border-b-4 border-amber-800 shadow-md active:translate-y-0.5 transition outline-hidden cursor-pointer flex items-center justify-center gap-1"
            >
              <span>🪄 이 옷 마법으로 입어보기!</span>
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY POPUP: RE-OPENED PREVIOUS CERTIFICATE CARD */}
      {selectedHistoryCert && (
        <DreamCard
          topJob={JOBS_LIST.find((j) => j.id === selectedHistoryCert.topJobId) || topJob}
          bottomJob={JOBS_LIST.find((j) => j.id === selectedHistoryCert.bottomJobId) || bottomJob}
          userName={selectedHistoryCert.recipientName}
          customText={selectedHistoryCert.encouragement}
          capturedImage={selectedHistoryCert.capturedImage}
          onClose={() => setSelectedHistoryCert(null)}
        />
      )}

      {/* OVERLAY POPUP: PERSISTENT HISTORICAL REGISTRY TABLE BOX */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[40px] border-8 border-vibrant-blue w-full max-w-4xl max-h-[90vh] overflow-hidden p-6 md:p-8 flex flex-col relative shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition z-10 cursor-pointer outline-hidden border border-slate-350"
              title="보관함 닫기"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 border-b-4 border-vibrant-blue pb-4 mb-4">
              <div className="w-11 h-11 bg-vibrant-blue rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">
                🎒
              </div>
              <div>
                <h2 className="text-xl font-black text-vibrant-brown">우리동네 드림 직업 임명장 보관함</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">내 컴퓨터/브라우저 캐시에 실시간 보관된 명예 임명장 들이에요!</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {/* Renders cache lists */}
              <LocalHistory onReopenRecord={(record) => {
                handleReopenHistory(record);
                setShowHistoryModal(false); // Close list container overview to preview document card
              }} />
            </div>
          </div>
        </div>
      )}

      {/* CELEBRATION MODORAMA INSPIRED POPUP OVERLAY */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-55 animate-fade-in">
          <div className="bg-white rounded-[40px] border-8 border-vibrant-yellow p-8 max-w-sm text-center shadow-2xl relative animate-bounce-short">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-vibrant-yellow rounded-full border-4 border-white flex items-center justify-center text-5xl shadow-lg animate-pulse">
              🎉
            </div>
            <div className="mt-8">
              <span className="bg-vibrant-coral text-white font-black px-4 py-1 rounded-full text-xs animate-pulse">코디 정답 합격! ✨</span>
              <h3 className="text-2xl font-black text-vibrant-brown mt-3">명예 {JOBS_LIST[selectedTopIndex].title}</h3>
              <p className="text-xs text-slate-500 font-extrabold mt-2 leading-relaxed">
                상의와 하의의 직업 짝꿍을 완벽히 맞췄어요! <br />
                지혜로운 직업 축하 구연동화가 흘러나옵니다!
              </p>
              <span className="text-5xl mt-4 block">{JOBS_LIST[selectedTopIndex].emoji}</span>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="mt-6 px-6 py-2 bg-vibrant-blue hover:bg-sky-600 text-white font-extrabold rounded-full border-b-4 border-indigo-900 shadow-md text-xs transition outline-hidden cursor-pointer"
              >
                확인 대원! 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center text-[11px] text-slate-400 mt-6 max-w-lg mx-auto">
        <p className="font-extrabold text-pink-300 uppercase tracking-widest">our neighborhood ar costume sandbox ✨</p>
        <p className="mt-1">내 허락 없이 기존 소스를 훼손하지 않는 범위에서 안전하게 아이들의 동심을 지키는 코드로 설계되었습니다.</p>
      </footer>
    </div>
  );
}
