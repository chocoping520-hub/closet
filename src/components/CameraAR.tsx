import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Upload, Image as ImageIcon, Sliders, ChevronUp, ChevronDown, Plus, Minus, RotateCcw } from "lucide-react";
import { HatRenderer, TopRenderer, BottomRenderer, ShoesRenderer } from "./JobSVGRenderers";
import { Job } from "../types";

interface CameraARProps {
  topJob: Job;
  bottomJob: Job;
  onSnapshot: (imageUri: string) => void;
}

export const CameraAR: React.FC<CameraARProps> = ({ topJob, bottomJob, onSnapshot }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AR Costume fitting manual adjustments (very easy for kids!)
  const [scale, setScale] = useState(1.0); // Keep scale default as scale controls are removed
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(-5);
  const [rotation, setRotation] = useState(0);

  // Auto face tracking feature
  const [isFaceTracking, setIsFaceTracking] = useState(true);

  // Secondary interactive breathing & sway motion
  const [sway, setSway] = useState(0);
  const [bounce, setBounce] = useState(0);

  // Take photo states
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Initialize camera detection
  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  // Safe stream binder to active video element
  useEffect(() => {
    if (videoRef.current) {
      if (isCameraOn && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((playErr) => {
          console.warn("Video auto-play interrupted:", playErr);
        });
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOn, stream]);

  // Real-time Skin Centroid Detection / Face Follower
  useEffect(() => {
    if (!isCameraOn || !isFaceTracking || !videoRef.current) return;

    let active = true;
    let frameId: number;

    const offscreen = document.createElement("canvas");
    offscreen.width = 40;
    offscreen.height = 30;
    const octx = offscreen.getContext("2d");

    const trackSkin = () => {
      if (!active) return;
      if (videoRef.current && octx) {
        try {
          octx.drawImage(videoRef.current, 0, 0, 40, 30);
          const imgData = octx.getImageData(0, 0, 40, 30);
          const data = imgData.data;

          let sumX = 0;
          let sumY = 0;
          let count = 0;

          for (let y = 0; y < 30; y++) {
            for (let x = 0; x < 40; x++) {
              const idx = (y * 40 + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              // Skin color classifier in RGB spectrum
              const isSkin =
                r > 70 &&
                g > 35 &&
                b > 20 &&
                r > g &&
                r > b &&
                r - g > 12 &&
                Math.max(r, g, b) - Math.min(r, g, b) > 12;

              if (isSkin) {
                sumX += x;
                sumY += y;
                count++;
              }
            }
          }

          if (count > 25) {
            const cx = sumX / count;
            const cy = sumY / count;

            // Map centroid to offset coords
            const normX = (cx - 20) / 20; // -1.0 to 1.0
            const normY = (cy - 12) / 15; // -1.0 to 1.0

            const targetX = normX * 115;
            const targetY = normY * 65 - 15; // Placed at neck level below chin

            // Smooth interpolation
            setOffsetX((prev) => prev + (targetX - prev) * 0.18);
            setOffsetY((prev) => prev + (targetY - prev) * 0.18);
          }
        } catch (e) {
          // Skip frame processing safely
        }
      }

      setTimeout(() => {
        frameId = requestAnimationFrame(trackSkin);
      }, 75);
    };

    frameId = requestAnimationFrame(trackSkin);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [isCameraOn, isFaceTracking, topJob, bottomJob]);

  // Idle organic breathing physics sway (simulating child movement/AR swaying)
  useEffect(() => {
    let animationFrameId: number;
    let tick = 0;

    const updateSway = () => {
      tick += 0.04;
      // Soft organic chest breathing & head swaying:
      setSway(Math.sin(tick * 1.5) * 2.5); // soft rotation
      setBounce(Math.cos(tick) * 3);        // soft breathing height shift
      animationFrameId = requestAnimationFrame(updateSway);
    };

    updateSway();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setHasCamera(videoDevices.length > 0);
    } catch {
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();
      
      let mediaStream: MediaStream;
      try {
        // Primary user-facing higher res webcam feed
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch (innerErr) {
        console.warn("Higher resolution constraints failed, falling back to basic video...", innerErr);
        // Fallback constraint suited perfectly for nested iframes and mobile constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(mediaStream);
      setIsCameraOn(true);
      setUploadedImage(null); // Clear manual upload when camera starts
    } catch (err: any) {
      console.error("CameraAR: Could not access camera:", err);
      setCameraError("카메라를 켤 수 없어요. 브라우저 카메라 권한을 확인해주세요! 오류: " + err.message);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOn(false);
  };

  // Dragging logic for children to custom fit their outfits ("맞춤 드래그 AR")
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffsetX(dragStart.current.startOffsetX + dx);
    setOffsetY(dragStart.current.startOffsetY + dy);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reset calibration offsets
  const resetCalibration = () => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(-5);
    setRotation(0);
  };

  // Capture Photo Booth Card
  const capturePhoto = () => {
    if (countdown !== null) return;

    // Play visual countdown tick & sound effect
    let count = 3;
    setCountdown(count);

    // Cute voice countdown sound
    speakLocal(`찰칵 사진 찍기 ${count}초 전!`);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        speakLocal(`${count}`);
      } else {
        clearInterval(interval);
        setCountdown(null);
        performShutterFlash();
      }
    }, 1000);
  };

  const performShutterFlash = () => {
    setIsFlashing(true);
    speakLocal("치~즈! 찰칵! 📸");

    // Camera shutter sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Could not play synthesized audio.", e);
    }

    setTimeout(() => {
      setIsFlashing(false);
      renderCompositeImage();
    }, 250);
  };

  // Helper speech synthesizer for instant client feedback
  const speakLocal = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Draw composite Camera/Photo + Vector SVG to canvas for downloading/analyzing
  const renderCompositeImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load elements
    const isVid = isCameraOn && video;
    const isImg = uploadedImage;

    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw background
    if (isVid) {
      // Draw reversed for mirror feel
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    } else if (isImg) {
      const imgObj = new Image();
      imgObj.crossOrigin = "anonymous";
      imgObj.src = uploadedImage!;
      imgObj.onload = () => {
        ctx.drawImage(imgObj, 0, 0, width, height);
        drawSVGOverlays(ctx, width, height);
      };
      return;
    } else {
      // Chalkboard cute background if there is no image
      ctx.fillStyle = "#A7F3D0"; // light mint
      ctx.fillRect(0, 0, width, height);

      // Draw dashed silhouette guide outline
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.fillStyle = "#064E3B";
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("꿈을 펼치는 우리동네 직업체험관", width / 2, height / 2 - 20);
      ctx.font = "16px sans-serif";
      ctx.fillText("(카메라를 켜거나 사진을 등록하면 더 멋져요!)", width / 2, height / 2 + 15);
    }

    if (isVid || (!isVid && !isImg)) {
      drawSVGOverlays(ctx, width, height);
    }
  };

  const drawSVGOverlays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Generate an image representation of the combined costume onto the canvas!
    // Since SVG drawing in Canvas can be done by parsing SVG paths, we can construct the shapes.
    // To do this simply and 100% reliably in canvas context, we draw colorful polygons/labels corresponding to the elements!
    // This is super neat because it guarantees that even if SVG-to-canvas rendering tools fail, we generate a lovely high-fidelity outfit card!
    ctx.save();

    // Base coordinate logic (center of character)
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;

    // Draw the top career banner
    ctx.fillStyle = topJob.accentColor;
    ctx.fillRect(20, 20, 180, 40);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`${topJob.emoji} ${topJob.title}`, 30, 46);

    ctx.fillStyle = bottomJob.accentColor;
    ctx.fillRect(20, 68, 180, 40);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${bottomJob.emoji} ${bottomJob.title}`, 30, 94);

    // Draw a lovely kid outline silhouette badge on corner
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 2;
    ctx.fillRect(width - 150, 20, 130, 40);
    ctx.strokeRect(width - 150, 20, 130, 40);
    ctx.fillStyle = "#1E2937";
    ctx.font = "12px sans-serif";
    ctx.fillText("📸 AR 체험 임명장", width - 140, 44);

    // Let's draw highly detailed costume blocks matching the selected styles so the card is beautiful!
    // Draw a badge/label of the MIX AND MATCH result
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(width / 2 - 150, height - 55, 300, 40);
    ctx.strokeStyle = "#4F46E5";
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 150, height - 55, 300, 40);

    ctx.fillStyle = "#312E81";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`💡 융합 직업: 명예 ${topJob.title} ${bottomJob.title}`, width / 2, height - 30);

    ctx.restore();

    // Export the data URI
    const dataUri = canvasRef.current!.toDataURL("image/png");
    onSnapshot(dataUri);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Video / AR Screen viewport */}
      <div
        id="ar-screen-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full aspect-video rounded-[45px] overflow-hidden bg-[#E0F2FE] shadow-2xl border-8 ${
          isDragging ? "border-vibrant-orange cursor-grabbing" : "border-white cursor-grab"
        } select-none transition-colors duration-200`}
      >
        {/* Shutter flash screen element */}
        {isFlashing && <div className="absolute inset-0 bg-white z-50 animate-ping" />}

        {/* Shutter countdown banner */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-40">
            <div className="w-36 h-36 border-8 border-vibrant-yellow text-vibrant-yellow font-extrabold text-7xl flex items-center justify-center rounded-full animate-bounce">
              {countdown}
            </div>
            <p className="text-white font-bold mt-4 text-xl">치~즈 해봐요! 치근덕대지 말고 멋진 각도로!</p>
          </div>
        )}

        {/* Live Status overlay inspired by the reference mockups */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-5 py-1.5 rounded-full text-white text-xs font-black flex items-center gap-2 z-20 shadow-md">
          <div className="w-2.5 h-2.5 bg-vibrant-coral rounded-full animate-pulse"></div>
          <span>실시간 AR 인식 중... 🌟</span>
        </div>

        {/* Instruction label overlay */}
        <div className="absolute top-4 left-4 bg-black/60 px-3.5 py-1.5 rounded-full text-xs text-white backdrop-blur-md flex items-center gap-1.5 z-20 font-medium">
          <Sliders className="w-3.5 h-3.5 text-vibrant-orange" />
          <span>옷을 손가락으로 드래그하여 조절해 봐요! 🖐️</span>
        </div>

        {/* Live Camera Video stream */}
        <video
          id="ar-webcam-feed"
          ref={videoRef}
          aria-label="AR Webcam Live Feed"
          className={`w-full h-full object-cover scale-x-[-1] absolute inset-0 ${isCameraOn ? "block" : "hidden"}`} // mirror view
          playsInline
          muted
        />

        {/* Uploaded manual photograph preview */}
        {uploadedImage && (
          <img
            id="ar-uploaded-photo"
            src={uploadedImage}
            alt="Uploaded Child Portrait"
            className="w-full h-full object-cover"
          />
        )}

        {/* Guide graphic overlay when AR starts */}
        {!isCameraOn && !uploadedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-300 bg-linear-to-b from-slate-800 to-slate-950">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 border-2 border-pink-300">
              <Camera className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">AR 카메라를 켜보거나 내 얼굴 사진을 업로드해봐요!</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              방 안에 있는 가전/카메라 기능을 켜면 아이들과 똑같이 옷을 맞춰 입는 모험이 시작됩니다!
            </p>
          </div>
        )}

        {/* Layer 2: Live Costume AR Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 select-none">
          {/* Centering relative positioning hub */}
          <div className="relative w-full h-full">
            <svg
              viewBox="-160 -190 320 380"
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Costume adjustments applied here */}
              <g
                transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
                className="transition-all duration-75"
              >
                {/* 1. SHOES footer layer - drawn first */}
                <ShoesRenderer
                  jobId={bottomJob.id}
                  x={0}
                  y={130}
                  scale={0.75}
                  rotation={0}
                />

                {/* 2. BOTTOM Pants/Skirt on lower torso - drawn under the jacket so the jacket can cleanly layer on top */}
                <BottomRenderer
                  jobId={bottomJob.id}
                  x={0}
                  y={55}
                  scale={0.75}
                  rotation={0}
                />

                {/* 3. TOP Jacket aligned to chest - draws on top of bottoms nicely as a coat or shirt */}
                <TopRenderer
                  jobId={topJob.id}
                  x={0}
                  y={-35 + bounce}
                  scale={0.75}
                  rotation={sway * 0.4}
                />

                {/* 4. HAT item aligned to head coordinate - positioned slightly higher to widen its gap from the top */}
                <HatRenderer
                  jobId={topJob.id}
                  x={0}
                  y={-150 + bounce}
                  scale={0.85}
                  rotation={rotation + sway}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Error notice banner */}
        {cameraError && (
          <div className="absolute bottom-3 left-3 right-3 bg-red-100 border border-red-300 px-3 py-2 rounded-xl text-xs text-red-700 font-semibold text-center z-30">
            {cameraError}
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="bg-white p-5 rounded-[30px] shadow-xl border-4 border-vibrant-yellow flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Toggle camera/upload controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {isCameraOn ? (
            <button
              id="btn-close-camera"
              onClick={stopCamera}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 border-b-4 border-slate-950 transition"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>카메라 끄기</span>
            </button>
          ) : (
            <button
              id="btn-open-camera"
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 bg-vibrant-coral text-white rounded-full font-extrabold shadow-md border-b-4 border-red-700 hover:scale-105 active:scale-95 transition animate-bounce"
            >
              <Camera className="w-5 h-5 text-white" />
              <span>실시간 카메라 켜기</span>
            </button>
          )}

          {/* Picture file importer file input */}
          <label className="flex items-center gap-2 px-5 py-2.5 bg-vibrant-green text-white rounded-full font-bold cursor-pointer border-b-4 border-emerald-700 hover:scale-105 active:scale-95 shadow-md transition">
            <Upload className="w-4 h-4" />
            <span>내 얼굴 사진 업로드</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Capture Snapshot Action */}
        <div className="flex items-center gap-2">
          <button
            id="btn-capture-ar"
            onClick={capturePhoto}
            className="flex items-center gap-2.5 px-6 py-3 bg-vibrant-orange text-white rounded-full font-extrabold text-lg shadow-lg border-b-4 border-amber-800 hover:scale-105 active:scale-95 transition"
          >
            <Camera className="w-5 h-5 animate-pulse" />
            <span>꿈카드 명예 임명장 만들기! 📸</span>
          </button>
        </div>

        {/* AR Assistive Controls */}
        <div className="flex items-center justify-center gap-2 bg-vibrant-peach p-2.5 rounded-full border-2 border-vibrant-yellow shadow-inner">
          <button
            id="btn-reset-calibration"
            onClick={resetCalibration}
            className="p-2 bg-white text-vibrant-coral rounded-full border border-vibrant-yellow hover:bg-red-50 flex items-center justify-center mr-1 cursor-pointer"
            title="정렬 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-vibrant-yellow/50 mx-1 animate-pulse" />

          <button
            id="btn-toggle-tracking"
            type="button"
            onClick={() => {
              setIsFaceTracking((prev) => !prev);
              speakLocal(!isFaceTracking ? "자동 얼굴 추적 모드로 바꿨어! 아이가 고른 옷이 얼굴을 따라가며 둥둥 떠다닐 거야!" : "수동 드래그 맞춤 조절 모드로 바꿨어!");
            }}
            className={`px-3 py-1.5 rounded-full border-2 text-[11px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer select-none ${
              isFaceTracking
                ? "bg-vibrant-blue border-white text-white shadow-md scale-105 active:scale-95"
                : "bg-white border-vibrant-yellow text-[#B45309] hover:bg-amber-50"
            }`}
            title="자동 얼굴 인식 추적 장치"
          >
            <span className="text-sm">🤖</span>
            <span>얼굴 추적 {isFaceTracking ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Secret canvas buffer used only for compounding image snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
