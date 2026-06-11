export interface Job {
  id: string;
  title: string;
  emoji: string;
  color: string;
  accentColor: string;
  topCap: string;     // 상의 이름
  topDesc: string;    // 상의 장식물 설명 (모자 등)
  bottomCap: string;  // 하의 이름
  bottomDesc: string; // 하의 신발 설명
  description: string; // 직업 한줄 설명

  // React-based SVG paths or elements for rendering
  topId: string;      // Identifier for conditional layer logic
}

export interface DreamCertificate {
  id: string;
  recipientName: string;
  jobTitle: string;
  accomplishmentStory: string;
  encouragement: string;
  audioText: string;
  topJobId: string;
  bottomJobId: string;
  capturedImage?: string; // Captured AR snapshot
  timestamp: number;
}
