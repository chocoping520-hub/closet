import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server parsing limits for handling base64 photos from canvases
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Shared server-side Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Server: Gemini API client successfully initialized.");
  } catch (error) {
    console.error("Server: Failed to prioritize Gemini API setup:", error);
  }
} else {
  console.log("Server: GEMINI_API_KEY is not set or is using placeholder. Using fallbacks.");
}

// 1. API: Analyze costume and generate a wonderful Neighborhood Career Certificate
app.post("/api/analyze-costume", async (req, res) => {
  try {
    const { image, topJob, bottomJob, userName, customText } = req.body;

    const recipient = userName ? userName.trim() : "자랑스러운 어린이";
    const topName = topJob ? topJob.title : "꼬마 영웅";
    const bottomName = bottomJob ? bottomJob.title : "꿈나무";
    const mergedJob = topJob?.id === bottomJob?.id ? topName : `${topName} ${bottomName}`;

    // If Gemini client is not initialized, we generate a high-quality, personalized template locally!
    if (!ai) {
      console.log("Server: Gemini API not available, generating offline certificate.");
      const offlineStories = [
        `${recipient} 대원님은 오늘 멋진 ${topName} 상의와 신나는 ${bottomName} 하의를 멋지게 완성하여 우리 동네의 소중한 명예 영웅이 되었습니다!`,
        `동네 주민들이 모두 모여 박수를 쳤어요! ${recipient}님이 ${topName} 장비로 어려운 문제를 해결하고, ${bottomName}의 멋진 신발을 신고 신나게 뛰어다니는 모습이 정말 뭉클했답니다.`,
        `언제나 큰 꿈을 마음에 품고 주변 이웃을 돕는 다정하고 용감한 어린이로 자라나기를 우리동네 이웃들이 온 힘을 다해 응원할게요!`
      ];

      return res.json({
        recipientName: recipient,
        jobTitle: `명예 ${mergedJob}`,
        accomplishmentStory: offlineStories.join(" "),
        encouragement: `${recipient}님의 활기찬 미소가 우리 동네를 더욱 환하게 만들어 주었답니다! 오늘부터 정식 명예 ${mergedJob}으로 임명합니다!`,
        audioText: `안녕 ${recipient}! 멋진 ${topName} 옷을 골라 입은 너의 모습이 정말 특별하고 비장하구나! 우리 동네를 지키는 멋진 ${mergedJob} 대원이 된 것을 진심으로 축하해! 앞으로도 많은 꿈을 펼치길 바랄게!`,
        isOfflineMode: true
      });
    }

    // Prepare content for Gemini analysis
    let contents: any[] = [];
    let prompt = `
      어린이 직업 체험 앱('우리동네 직업체험')이며, 아이가 선택한 직업 옷을 입은 사진 또는 선택한 조합에 대한 '꿈 명예 임명장'을 작성해주려고 합니다.
      
      [정보]
      어린이 이름: "${recipient}"
      선택한 상의 직업: "${topName}" (설명: ${topJob?.description || ""})
      선택한 하의 직업: "${bottomName}" (설명: ${bottomJob?.description || ""})
      아이가 좋아하는 가치/한마디: "${customText || "튼튼하고 씩씩하게 사람들을 돕고 싶어요"}"
      
      위 정보를 분석하여 한국어로 아주 귀엽고, 따뜻하고, 격려가 넘치는 임명장 및 직업 스토리를 지어주세요.
      만약 상의와 하의 직업이 다르다면, 두 직업의 멋진 점을 유쾌하게 결합해서(예: 경찰 가운을 입은 발레리나 -> "발레하듯 우아하게 순찰하며 평화를 지키는 발레 경찰관") 적어주시면 아이들이 더욱 즐거워합니다.
      
      JSON 형식으로 다음 필드를 정확히 지켜서 반환해주세요:
      - recipientName: 어린이 이름 (예: "지우 대원" 또는 "자랑스러운 지우 어린이")
      - jobTitle: 임명되는 새로운 직업 이름 (예: "명예 숲속 사육사 경찰관", "명예 셰프 발레리나")
      - accomplishmentStory: 이 어린이가 동네에서 어떻게 큰 활약과 도움을 주었는지에 대한 귀여운 스토리 (3문장 분량)
      - encouragement: 꿈을 향해 나아가는 어린이를 응원하는 감동적이고 예쁜 메시지 (1문장 분량)
      - audioText: 오디오로 읽어줄 수 있도록 마스코트 친구가 아주 다정하고 활기차게 말하는 한마디 대사이며, 30~50단어로 완성해주세요. (반말/존댓말 믹스해서 아이에게 친근한 느낌으로)
    `;

    if (image && image.includes("base64,")) {
      const base64Data = image.split("base64,")[1];
      const mimeType = image.split(";")[0].split(":")[1] || "image/png";
      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      contents = [
        imagePart,
        { text: prompt + "\n제공된 이미지는 아이가 AR 카메라로 직업 옷을 착용한 모습입니다. 얼굴 표정과 분위기, 착용한 옷의 색감을 보고 'accomplishmentStory'나 'audioText'에 아이의 미소나 표정을 구체적으로 칭찬하는 디테일을 추가해 주세요." }
      ];
    } else {
      contents = [prompt];
    }

    console.log("Server: Querying Gemini model for custom certificate...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipientName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            accomplishmentStory: { type: Type.STRING },
            encouragement: { type: Type.STRING },
            audioText: { type: Type.STRING },
          },
          required: ["recipientName", "jobTitle", "accomplishmentStory", "encouragement", "audioText"],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json({
      ...parsedData,
      isOfflineMode: false
    });

  } catch (error: any) {
    console.error("Server: Error during costume analysis:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 2. API: Detect face bounding box using Gemini Vision
app.post("/api/detect-face", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image field is required" });
    }

    if (!ai) {
      console.log("Server: Gemini API client not available for face detection; returning fallback coordinate.");
      return res.json({
        success: false,
        faceX: 50,
        faceY: 35,
        faceWidth: 25,
        faceHeight: 25,
        noseY: 38,
        message: "Gemini server client not authorized"
      });
    }

    const base64Data = image.split("base64,")[1] || image;
    const mimeType = image.split(";")[0]?.split(":")[1]?.split(";")[0] || "image/jpeg";

    console.log(`Server: Detecting face with ${mimeType} via gemini-3.5-flash...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `You are an expert human face locator AI helper.
Analyze this video snapshot frame from our child-friendly AR dressing room.
Detect the MAIN human face (typically a child's face) present in the frame.
Identify its center coordinate and physical size.

Return JSON in this EXACT schema format:
{
  "success": true,
  "faceX": <number, 0 to 100, representing the horizontal center X of the face, where 0 is left and 100 is right>,
  "faceY": <number, 0 to 100, representing the vertical center Y of the face, where 0 is top and 100 is bottom>,
  "faceWidth": <number, 0 to 100, width of the face in percentage of overall image width>,
  "faceHeight": <number, 0 to 100, height of the face in percentage of overall image height>,
  "noseY": <number, 0 to 100, vertical coordinate of the nose/lips boundary to anchor neckwear perfectly>
}

If no human face is detected or you are unsure, set success to false and return placeholders:
{"success": false, "faceX": 50, "faceY": 35, "faceWidth": 25, "faceHeight": 25, "noseY": 38}

Do not include other text, explanation, or markdown backticks inside your answer. Output MUST be pure JSON.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            faceX: { type: Type.NUMBER },
            faceY: { type: Type.NUMBER },
            faceWidth: { type: Type.NUMBER },
            faceHeight: { type: Type.NUMBER },
            noseY: { type: Type.NUMBER }
          },
          required: ["success", "faceX", "faceY", "faceWidth", "faceHeight", "noseY"]
        }
      }
    });

    const textOutput = response.text || "{}";
    const parsedData = JSON.parse(textOutput.trim());
    return res.json({
      ...parsedData,
      success: parsedData.success !== false
    });

  } catch (error: any) {
    console.error("Server: Error during face detection:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. API: Generate cheerful, high-quality audio using Gemini TTS
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    if (!ai) {
      return res.status(400).json({ error: "Gemini server client not available. Please use browser speech synthesis." });
    }

    console.log("Server: Generating TTS audio using gemini-3.1-flash-tts-preview...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with a highly cheerful, energetic, warm, and cute voice in Korean for a young child: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }, // Warm family speaker
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    } else {
      throw new Error("No audio content returned from the model.");
    }
  } catch (error: any) {
    console.error("Server: Error during TTS generation:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Setup Express+Vite integration based on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Server: Vite middleware registered for development.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Server: Serving static build files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: Running our friendly Kids AR App at http://localhost:${PORT}`);
  });
}

startServer();
