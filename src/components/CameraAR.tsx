import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Upload, Image as ImageIcon, RotateCcw } from "lucide-react";
import { HatRenderer, TopRenderer, BottomRenderer, ShoesRenderer } from "./JobSVGRenderers";
import { Job } from "../types";

interface CameraARProps {
  topJob: Job;
  bottomJob: Job;
  onSnapshot: (imageUri: string) => void;
  voiceSettings: {
    countdownPhrase: string;
    shutterPhrase: string;
    savedPhrase?: string;
  };
  hasCaptured?: boolean;
  onOpenCertificate?: () => void;
}

export const CameraAR: React.FC<CameraARProps> = ({
  topJob,
  bottomJob,
  onSnapshot,
  voiceSettings,
  hasCaptured = false,
  onOpenCertificate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string | null>("dodam"); // default avatar fallback
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AR Costume fitting manual adjustments
  const [scale, setScale] = useState(1.1); // default slightly larger for 4:3 frame fit
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(-5);
  const [rotation, setRotation] = useState(0);

  // Auto face tracking configurations
  const [isFaceTracking, setIsFaceTracking] = useState(true);

  // Secondary interactive breathing & sway motion
  const [sway, setSway] = useState(0);
  const [bounce, setBounce] = useState(0);

  // Take photo countdown states
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Baseline calibration parameters for motion tracking
  const skinTrackerBase = useRef({ cx: 20, cy: 12 });
  const geminiAnchorRef = useRef({ x: 0, y: -5 });

  // Initialize camera detection and automatically start the camera
  useEffect(() => {
    const init = async () => {
      await checkCameraAvailability();
      // Auto-start camera stream on load to make fitting immediate!
      await startCamera();
    };
    init();
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

  // Real-time Skin Centroid Detection / Face Follower (interpolator)
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

            // Compute delta shift relative to our calibrated Gemini base (or default center)
            const dx = cx - skinTrackerBase.current.cx;
            const dy = cy - skinTrackerBase.current.cy;

            // Map centroid movement with smooth scaling factor
            const targetX = geminiAnchorRef.current.x + (dx * 5.8);
            const targetY = geminiAnchorRef.current.y + (dy * 3.8);

            // Smooth interpolation (prevent jitter)
            setOffsetX((prev) => prev + (targetX - prev) * 0.16);
            setOffsetY((prev) => prev + (targetY - prev) * 0.16);
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

  // Gemini AI face detection routines for high-accuracy clothing fit
  const performGeminiFaceDetection = async () => {
    if (!videoRef.current || !isCameraOn || isCalibrating) return;
    setIsCalibrating(true);
    try {
      const offscreen = document.createElement("canvas");
      offscreen.width = 320;
      offscreen.height = 240;
      const octx = offscreen.getContext("2d");
      if (!octx) {
        setIsCalibrating(false);
        return;
      }

      octx.drawImage(videoRef.current, 0, 0, 320, 240);
      const dataUrl = offscreen.toDataURL("image/jpeg", 0.65);

      const res = await fetch("/api/detect-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!res.ok) throw new Error("API call returned error status");
      const data = await res.json();

      if (data.success && data.faceX !== undefined) {
        const fx = data.faceX;     // 0 to 100
        const fy = data.faceY;     // 0 to 100
        const fWidth = data.faceWidth || 25;
        const nY = data.noseY || fy;

        // Since web feed is scale-x-[-1] on CSS mirror view:
        const mirroredFx = 100 - fx;

        // Map relative offsets inside viewBox (-160 to 160)
        const targetX = (mirroredFx - 50) * 2.8;
        const targetY = (nY - 45) * 2.8;

        // Scale proportionately to detected face bounds relative to optimal size
        const targetScale = Math.min(Math.max((fWidth / 22) * 1.05, 0.65), 1.6);

        // Calibrate real-time tracker benchmark anchor points
        geminiAnchorRef.current = { x: targetX, y: targetY };
        skinTrackerBase.current = {
          cx: mirroredFx * 0.4,
          cy: fy * 0.3,
        };

        setScale(targetScale);
        setOffsetX(targetX);
        setOffsetY(targetY);
        console.log("Gemini AI Face Anchor Locked:", { fx, fy, targetScale, targetX, targetY });
      }
    } catch (e) {
      console.warn("Face calibration skipped:", e);
    } finally {
      setIsCalibrating(false);
    }
  };

  const performGeminiFaceOnUploaded = async () => {
    if (!uploadedImage || isCalibrating) return;
    setIsCalibrating(true);
    try {
      const res = await fetch("/api/detect-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage }),
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      if (data.success && data.faceX !== undefined) {
        const fx = data.faceX;
        const fy = data.faceY;
        const fWidth = data.faceWidth || 25;
        const nY = data.noseY || fy;

        // Manual photo uploads do not have CSS horizontal flip (mirror scale-x-[-1]),
        // so we coordinate direct alignment (no mirrored translation).
        const targetX = (fx - 50) * 2.8;
        const targetY = (nY - 45) * 2.8;
        const targetScale = Math.min(Math.max((fWidth / 22) * 1.05, 0.65), 1.6);

        setScale(targetScale);
        setOffsetX(targetX);
        setOffsetY(targetY);

        // Lock these as baseline anchors in case they toggle manual drag shifts
        geminiAnchorRef.current = { x: targetX, y: targetY };

        console.log("Uploaded Image Face Alignment Success:", { fx, fy, targetScale });
      }
    } catch (e) {
      console.warn("Manual uploaded photo face detection failed:", e);
    } finally {
      setIsCalibrating(false);
    }
  };

  // Trigger calibration when camera switches on, and execute periodic correction loop
  useEffect(() => {
    if (!isCameraOn || !isFaceTracking) return;

    // Run first calibration right after camera stream launches and starts feeding frames
    const initialCalibrate = setTimeout(() => {
      performGeminiFaceDetection();
    }, 1500);

    const interval = setInterval(() => {
      performGeminiFaceDetection();
    }, 5000);

    return () => {
      clearTimeout(initialCalibrate);
      clearInterval(interval);
    };
  }, [isCameraOn, isFaceTracking]);

  // Run automatically when portrait photo image is manually registered
  useEffect(() => {
    if (uploadedImage) {
      const timer = setTimeout(() => {
        performGeminiFaceOnUploaded();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage]);

  // Idle organic breathing physics sway (simulating child movement/AR swaying)
  useEffect(() => {
    let animationFrameId: number;
    let tick = 0;

    const updateSway = () => {
      tick += 0.04;
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
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch (innerErr) {
        console.warn("Higher resolution constraints failed, falling back to basic video...", innerErr);
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

  // Dragging logic for kids manual adjustment option override
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
    // Lock manual coordinates as baseline so motion continues smoothly around user-desired coordinate
    geminiAnchorRef.current = { x: offsetX, y: offsetY };
  };

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

  const resetCalibration = () => {
    setScale(1.1);
    setOffsetX(0);
    setOffsetY(-5);
    setRotation(0);
    geminiAnchorRef.current = { x: 0, y: -5 };
    skinTrackerBase.current = { cx: 20, cy: 12 };
  };

  const capturePhoto = () => {
    if (countdown !== null) return;

    let count = 3;
    setCountdown(count);

    const rawCountdown = voiceSettings?.countdownPhrase || "찰칵 사진 찍기 {count}초 전!";
    speakLocal(rawCountdown.replace("{count}", String(count)));

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        const tickText = voiceSettings?.countdownPhrase && voiceSettings.countdownPhrase.includes("{count}")
          ? voiceSettings.countdownPhrase.replace("{count}", String(count))
          : String(count);
        speakLocal(tickText);
      } else {
        clearInterval(interval);
        setCountdown(null);
        performShutterFlash();
      }
    }, 1000);
  };

  const performShutterFlash = () => {
    setIsFlashing(true);
    speakLocal(voiceSettings?.shutterPhrase || "치~즈! 찰칵! 📸");

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

  const speakLocal = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderCompositeImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isVid = isCameraOn && video;
    const isImg = uploadedImage;

    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    if (isVid) {
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
      // Offline model template drawing fallback
      ctx.fillStyle = activeAvatar === "dodam" ? "#E0F2FE" : activeAvatar === "seoyeon" ? "#FFF1F2" : "#F0FDF4";
      ctx.fillRect(0, 0, width, height);
      
      // Draw a beautiful sunny background circle
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 170, 0, Math.PI * 2);
      ctx.fill();

      // Let's draw the stylized selected vector model head & shoulders centered exactly
      // Face center is mapped around (320, 240) in this viewport
      ctx.save();
      ctx.translate(320 + (offsetX * 1.5), 240 + (offsetY * 1.5));
      ctx.scale(scale * 1.8, scale * 1.8);

      // Neck
      ctx.fillStyle = "#FFE4E6";
      ctx.fillRect(-10, -5, 20, 20);

      // Torso shoulders
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.moveTo(-42, 15);
      ctx.lineTo(42, 15);
      ctx.lineTo(32, 80);
      ctx.lineTo(-32, 80);
      ctx.closePath();
      ctx.fill();

      // Hands
      ctx.fillStyle = "#FFE4E6";
      ctx.beginPath();
      ctx.arc(-42, 18, 7, 0, Math.PI * 2);
      ctx.arc(42, 18, 7, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = "#FFE4E6";
      ctx.strokeStyle = "#FDA4AF";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -30, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks blushes
      ctx.fillStyle = "rgba(248, 113, 113, 0.4)";
      ctx.beginPath();
      ctx.arc(-18, -20, 5, 0, Math.PI * 2);
      ctx.arc(18, -20, 5, 0, Math.PI * 2);
      ctx.fill();

      if (activeAvatar === "dodam") {
        // Cap & Hair back
        ctx.fillStyle = "#3B82F6";
        ctx.beginPath();
        ctx.arc(0, -35, 37, Math.PI, 0);
        ctx.fill();
        
        ctx.strokeStyle = "#1D4ED8";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -30, 31, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        // Eyes
        ctx.strokeStyle = "#1E293B";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(-11, -34, 5, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(11, -34, 5, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();

        // Smile
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, -18, 9, 0.1, Math.PI - 0.1);
        ctx.stroke();
      } else if (activeAvatar === "seoyeon") {
        // Brown buns hair
        ctx.fillStyle = "#78350F";
        ctx.beginPath();
        ctx.arc(-38, -20, 11, 0, Math.PI * 2);
        ctx.arc(38, -20, 11, 0, Math.PI * 2);
        ctx.fill();
        // Pink buns clips
        ctx.fillStyle = "#EC4899";
        ctx.beginPath();
        ctx.arc(-38, -20, 5, 0, Math.PI * 2);
        ctx.arc(38, -20, 5, 0, Math.PI * 2);
        ctx.fill();

        // Front bangs
        ctx.fillStyle = "#78350F";
        ctx.beginPath();
        ctx.arc(0, -32, 35, Math.PI * 1.1, Math.PI * 1.9);
        ctx.fill();

        ctx.strokeStyle = "#451A03";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(-11, -34, 5, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();

        // Wink eye
        ctx.beginPath();
        ctx.moveTo(6, -35);
        ctx.lineTo(16, -33);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, -33);
        ctx.lineTo(16, -35);
        ctx.stroke();

        // Smile
        ctx.fillStyle = "#E11D48";
        ctx.beginPath();
        ctx.arc(0, -20, 7, 0, Math.PI);
        ctx.fill();
      } else {
        // Gaon curly hair
        ctx.fillStyle = "#1A0D05";
        ctx.beginPath();
        ctx.arc(-34, -38, 9, 0, Math.PI * 2);
        ctx.arc(34, -38, 9, 0, Math.PI * 2);
        ctx.arc(0, -56, 13, 0, Math.PI * 2);
        ctx.fill();

        // Yellow Spectacles
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-14, -32, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(14, -32, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-3, -32);
        ctx.lineTo(3, -32);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = "#1E293B";
        ctx.beginPath();
        ctx.arc(-14, -32, 3, 0, Math.PI * 2);
        ctx.arc(14, -32, 3, 0, Math.PI * 2);
        ctx.fill();

        // Dimple smile
        ctx.strokeStyle = "#1A0D05";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, -18, 7, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (isVid || (!isVid && !isImg)) {
      drawSVGOverlays(ctx, width, height);
    }
  };

  const drawSVGOverlays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 1. First, serialize and draw the SVG overlays (including clothes, accessories, and avatar models) on canvas!
    const svgEl = document.getElementById("ar-costume-svg");
    if (svgEl) {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        // Draw the outfit and model figure onto the top layer
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        // 2. Now overlay administrative headers, badges, and textual credentials
        ctx.save();

        ctx.fillStyle = topJob.accentColor;
        ctx.fillRect(20, 20, 180, 40);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`${topJob.emoji} ${topJob.title}`, 30, 46);

        ctx.fillStyle = bottomJob.accentColor;
        ctx.fillRect(20, 68, 180, 40);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${bottomJob.emoji} ${bottomJob.title}`, 30, 94);

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 2;
        ctx.fillRect(width - 150, 20, 130, 40);
        ctx.strokeRect(width - 150, 20, 130, 40);
        ctx.fillStyle = "#1E2937";
        ctx.font = "12px sans-serif";
        ctx.fillText("📸 AR 체험 임명장", width - 140, 44);

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

        // 3. Extract final fused base64 image data and report upstream to form certificate!
        const dataUri = canvasRef.current!.toDataURL("image/png");
        onSnapshot(dataUri);
      };

      img.onerror = () => {
        console.error("Failed to load serialized costume SVG on canvas, falling back.");
        const dataUri = canvasRef.current!.toDataURL("image/png");
        onSnapshot(dataUri);
      };
    } else {
      // Direct backup draw response
      const dataUri = canvasRef.current!.toDataURL("image/png");
      onSnapshot(dataUri);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Video / AR Screen viewport - Sized beautifully at 4:3 ratio */}
      <div
        id="ar-screen-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full aspect-[4/3] rounded-[45px] overflow-hidden bg-[#E0F2FE] shadow-2xl border-8 ${
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
            <p className="text-white font-bold mt-4 text-xl">치~즈 해봐요! 예쁜 각도로!</p>
          </div>
        )}

        {/* Live Camera Video stream */}
        <video
          id="ar-webcam-feed"
          ref={videoRef}
          aria-label="AR Webcam Live Feed"
          className={`w-full h-full object-cover scale-x-[-1] absolute inset-0 ${isCameraOn ? "block" : "hidden"}`}
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

        {/* Playful background for offline dressing studio (when camera is off and no user image is uploaded) */}
        {!isCameraOn && !uploadedImage && (
          <div className="absolute inset-x-0 bottom-0 top-0 bg-linear-to-b from-[#E0F2FE] via-[#F0FDF4] to-[#FFF1F2] flex flex-col justify-between p-6">
            {/* Top title bar */}
            <div className="text-center mt-12 select-none pointer-events-none">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-200 animate-pulse">
                ⭐ 꿈 친구 꾸미기 스튜디오 ⭐
              </span>
              <h3 className="text-[#1E1B4B] text-lg font-black mt-1">우리동네 꿈 요술옷장 💖</h3>
            </div>
            
            {/* Advice statement at bottom */}
            <div className="text-center mb-10 pointer-events-none">
              <p className="text-[11px] text-[#475569] font-extrabold max-w-sm mx-auto leading-normal bg-white/70 backdrop-blur-xs py-2 px-3.5 rounded-2xl border border-slate-200 shadow-xs">
                상단의 <span className="text-pink-600">카메라 단추 📸</span>로 실제 내 모습을 비추거나 <span className="text-emerald-600">얼굴 사진 📂</span>을 등록할 수 있어요! 권한 요청 창이 나오면 꼭 허용 단추를 눌러주세요!
              </p>
            </div>
          </div>
        )}

        {/* Floating Model Character Selection controls inside fitting booth */}
        {!isCameraOn && !uploadedImage && (
          <div className="absolute top-4 left-4 bg-white/95 border-2 border-indigo-200 px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg z-20 pointer-events-auto">
            <span className="text-[10px] font-black text-indigo-900 block mr-1 select-none">모델 친구:</span>
            <button
              type="button"
              onClick={() => {
                setActiveAvatar("dodam");
                setScale(1.15);
                setOffsetX(0);
                setOffsetY(-10);
              }}
              className={`px-2 py-0.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                activeAvatar === "dodam" ? "bg-vibrant-blue text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              👦 도담
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveAvatar("seoyeon");
                setScale(1.15);
                setOffsetX(0);
                setOffsetY(-10);
              }}
              className={`px-2 py-0.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                activeAvatar === "seoyeon" ? "bg-pink-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              👧 서연
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveAvatar("gaon");
                setScale(1.15);
                setOffsetX(0);
                setOffsetY(-10);
              }}
              className={`px-2 py-0.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                activeAvatar === "gaon" ? "bg-vibrant-orange text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              🧑 가온
            </button>
          </div>
        )}

        {/* Helper overlays floating cleanly at boundaries inside the viewer screen */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto z-20">
          {/* Real-time Camera Feed toggler icon widget */}
          <button
            type="button"
            onClick={isCameraOn ? stopCamera : startCamera}
            className={`p-3 bg-white text-slate-800 rounded-full shadow-lg border-2 border-blue-150 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex justify-center items-center ${
              isCameraOn ? "bg-slate-800 text-white border-slate-900" : "bg-vibrant-coral text-white border-red-700 animate-pulse"
            }`}
            title={isCameraOn ? "실시간 카메라 끄기" : "실시간 카메라 켜기"}
          >
            {isCameraOn ? (
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Picture manual portrait files dispatcher badge */}
          <label className="p-3 bg-vibrant-green text-white rounded-full shadow-lg border-2 border-emerald-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex justify-center items-center">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Align reset button on bottom right */}
        <div className="absolute bottom-4 right-4 pointer-events-auto z-20">
          <button
            onClick={resetCalibration}
            className="p-2.5 bg-white text-vibrant-coral rounded-full border-2 border-vibrant-yellow hover:bg-rose-50 flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition cursor-pointer"
            title="코디 정렬 초기화"
          >
            <RotateCcw className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic automatic tracking status overlays on bottom left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto z-20">
          <button
            type="button"
            onClick={() => setIsFaceTracking((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full border-2 text-[10px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer select-none shadow-md ${
              isFaceTracking
                ? "bg-vibrant-blue border-white text-white hover:bg-sky-600 duration-200 scale-105"
                : "bg-white border-vibrant-yellow text-[#B45309] hover:bg-amber-50"
            }`}
          >
            <span>🤖</span>
            <span>얼굴 추적 {isFaceTracking ? "ON" : "OFF"}</span>
          </button>

          {isCalibrating && (
            <span className="bg-indigo-600/90 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin text-[10px]" />
              <span>AI 센서 매칭 중...</span>
            </span>
          )}
        </div>

        {/* Floating guidance text badge */}
        <div className="absolute top-4 left-4 bg-black/60 px-3.5 py-1.5 rounded-full text-[10px] text-white backdrop-blur-md flex items-center gap-1.5 z-20 font-bold select-none">
          <span>🖐️ 화면을 누르고 움직여 직접 옷을 조절할 수도 있어요!</span>
        </div>

        {/* Layer 2: Live Costume AR Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 select-none">
          <div className="relative w-full h-full">
            <svg
              id="ar-costume-svg"
              viewBox="-160 -190 320 380"
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Costume adjustments applied here */}
              <g
                transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
                className="transition-all duration-75"
              >
                {/* 0. Fallback Digital Characters (drawn behind the clothes when camera is off and no photo uploaded) */}
                {!isCameraOn && !uploadedImage && activeAvatar && (
                  <g id="fallback-vector-avatar" className="opacity-95">
                    {/* Neck Area */}
                    <rect x="-10" y="-85" width="20" height="25" fill="#FFE4E6" rx="4" />
                    
                    {/* Torso Shoulder Line and Arms */}
                    <path d="M -42 -25 L 42 -25 L 32 60 L -32 60 Z" fill="#E2E8F0" />
                    {/* Soft Hands */}
                    <circle cx="-42" cy="-20" r="7" fill="#FFE4E6" />
                    <circle cx="42" cy="-20" r="7" fill="#FFE4E6" />
                    
                    {/* Torso Hip Line / Legs */}
                    <rect x="-24" y="60" width="16" height="80" fill="#CBD5E1" rx="4" />
                    <rect x="8" y="60" width="16" height="80" fill="#CBD5E1" rx="4" />

                    {/* Main Child Round Face */}
                    <circle cx="0" cy="-110" r="36" fill="#FFE4E6" stroke="#FDA4AF" strokeWidth="2.5" />
                    
                    {/* Rosy Cheeks */}
                    <circle cx="-20" cy="-100" r="5" fill="#F87171" opacity="0.4" />
                    <circle cx="20" cy="-100" r="5" fill="#F87171" opacity="0.4" />

                    {/* Dodam Details */}
                    {activeAvatar === "dodam" && (
                      <g id="avatar-dodam">
                        {/* Hair and Cute Cap back */}
                        <path d="M -37 -115 Q 0 -150 37 -115 Q 25 -135 -25 -135 Z" fill="#3B82F6" />
                        <path d="M -30 -124 C -15 -142 15 -142 30 -124" stroke="#1D4ED8" strokeWidth="2" fill="none" />
                        {/* Friendly happy eyes */}
                        <path d="M -16 -114 Q -11 -119 -6 -114" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M 6 -114 Q 11 -119 16 -114" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
                        {/* Big bright smile */}
                        <path d="M -10 -96 Q 0 -83 10 -96" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {activeAvatar === "seoyeon" && (
                      <g id="avatar-seoyeon">
                        {/* Long brown hair twin pigtail side buns */}
                        <circle cx="-38" cy="-100" r="12" fill="#78350F" />
                        <circle cx="38" cy="-100" r="12" fill="#78350F" />
                        <circle cx="-38" cy="-100" r="6" fill="#EC4899" />
                        <circle cx="38" cy="-100" r="6" fill="#EC4899" />
                        {/* Front fringe */}
                        <path d="M -37 -115 C -25 -138 25 -138 37 -115 C 20 -128 -20 -128 -37 -115 Z" fill="#78350F" />
                        {/* Cute winking eyes */}
                        <path d="M -16 -114 Q -11 -119 -6 -114" stroke="#451A03" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M 6 -115 L 16 -113" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 6 -113 L 16 -115" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
                        {/* Friendly happy open mouth */}
                        <path d="M -8 -98 Q 0 -84 8 -98 Z" fill="#E11D48" />
                      </g>
                    )}

                    {activeAvatar === "gaon" && (
                      <g id="avatar-gaon">
                        {/* Curly dark hair puffs */}
                        <circle cx="-34" cy="-118" r="9" fill="#1A0D05" />
                        <circle cx="34" cy="-118" r="9" fill="#1A0D05" />
                        <circle cx="0" cy="-136" r="13" fill="#1A0D05" />
                        <path d="M -34 -126 Q -17 -142 0 -134 Q 17 -142 34 -126" stroke="#1A0D05" strokeWidth="6" fill="none" strokeLinecap="round" />
                        
                        {/* Smart spectacles */}
                        <circle cx="-15" cy="-112" r="11" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                        <circle cx="15" cy="-112" r="11" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                        <line x1="-4" y1="-112" x2="4" y2="-112" stroke="#F59E0B" strokeWidth="2.5" />
                        
                        {/* Happy eyes */}
                        <circle cx="-15" cy="-112" r="3" fill="#1E293B" />
                        <circle cx="15" cy="-112" r="3" fill="#1E293B" />
                        
                        {/* Cute cheek dimple smiles */}
                        <path d="M -7 -96 Q 0 -86 7 -96" stroke="#1A0D05" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </g>
                    )}
                  </g>
                )}

                {/* 1. SHOES footer layer - drawn first, positioned appropriately to fit shorter length */}
                <ShoesRenderer
                  jobId={bottomJob.id}
                  x={0}
                  y={145}
                  scale={0.58}
                  rotation={0}
                />

                {/* 2. BOTTOM Pants/Skirt on lower torso */}
                <BottomRenderer
                  jobId={bottomJob.id}
                  x={0}
                  y={85}
                  scale={0.58}
                  rotation={0}
                />

                {/* 3. TOP Jacket aligned to chest, pushed down to prevent covering chin/cheeks/face */}
                <TopRenderer
                  jobId={topJob.id}
                  x={0}
                  y={15 + bounce}
                  scale={0.58}
                  rotation={sway * 0.4}
                />

                {/* 4. HAT item aligned to high head coordinate, scaled and shifted up to make sure it doesn't drape over the eyes */}
                <HatRenderer
                  jobId={topJob.id}
                  x={0}
                  y={-190 + bounce}
                  scale={0.72}
                  rotation={rotation + sway}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Error notice banner */}
        {cameraError && (
          <div className="absolute bottom-3 left-3 right-3 bg-red-100 border border-red-305 px-3 py-2 rounded-xl text-xs text-red-700 font-semibold text-center z-30 animate-bounce">
            {cameraError}
          </div>
        )}
      </div>

      {/* Primary Action Console with only the requested photo capturing button */}
      <div className="mt-2 flex justify-center w-full max-w-2xl mx-auto">
        {/* Button 1: 사진찍기 */}
        <button
          id="btn-capture-ar"
          type="button"
          onClick={capturePhoto}
          disabled={countdown !== null}
          className="w-full flex items-center justify-center gap-3.5 px-10 py-5 bg-vibrant-orange hover:bg-amber-600 active:translate-y-0.5 text-white rounded-full font-black text-lg md:text-xl shadow-xl border-b-6 border-amber-800 transition-all cursor-pointer select-none"
        >
          <Camera className="w-6 h-6 animate-pulse" />
          <span>예쁜 포즈로 사진찍기 📸</span>
        </button>
      </div>

      {/* Secret canvas buffer used only for compounding image snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
