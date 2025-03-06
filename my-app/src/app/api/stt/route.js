import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { execSync } from "child_process"; // FFmpeg 실행을 위한 모듈 추가

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // ElevenLabs에서 사용할 음성 ID
const MAX_DURATION = 5; // 최대 허용 녹음 길이 (초)

export async function POST(req) {
  try {
    // (A) FormData에서 파일 가져오기
    const formData = await req.formData();
    const file = formData.get("audioFile");
    const messagesRaw = formData.get("messages"); 
    const messages = messagesRaw ? JSON.parse(messagesRaw) : [];

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // (B) Blob -> Buffer 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // (C) 임시 파일 저장 (Whisper API는 파일을 직접 읽어야 함)
    const tempDir = "/tmp";
    const tempPath = path.join(tempDir, "temp-audio.webm");
    const trimmedPath = path.join(tempDir, "trimmed-audio.webm"); // 🔹 잘린 오디오 파일

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(tempPath, buffer);
    console.log("✅ 파일 생성 완료:", tempPath);

    // (D) FFmpeg로 오디오 길이 확인
    let duration = 0;
    try {
      duration = parseFloat(
        execSync(`ffprobe -i ${tempPath} -show_entries format=duration -v quiet -of csv="p=0"`).toString().trim()
      );
      console.log(`🎵 오디오 길이: ${duration.toFixed(2)}초`);
    } catch (err) {
      console.error("❌ FFmpeg 분석 오류:", err);
    }

    // (E) 5초 초과 시 자동으로 잘라서 저장
    if (duration > MAX_DURATION) {
      console.log(`✂️ 5초 초과! 처음 5초만 잘라서 저장합니다.`);
      try {
        execSync(`ffmpeg -i ${tempPath} -t ${MAX_DURATION} -c copy ${trimmedPath} -y`);
        fs.unlinkSync(tempPath); // 원본 삭제
      } catch (err) {
        console.error("❌ FFmpeg 트리밍 오류:", err);
      }
    } else {
      fs.renameSync(tempPath, trimmedPath); // 5초 이하라면 파일 이름만 변경
    }

    // (F) Whisper API 호출 (음성 → 텍스트 변환)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(trimmedPath), 
      model: "whisper-1",
      language: "ko",
    });

    console.log("📝 Whisper 변환 결과:", transcription.text);
    const userText = transcription.text;

    // (G) **파일 삭제**
    if (fs.existsSync(trimmedPath)) {
      fs.unlinkSync(trimmedPath);
    }

    // (H) GPT로 응답 생성
    messages.push({ role: "user", content: userText });

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `너는 중국집 '용궁반점'의 사장이다. 20년 전통의 가게이며, 인기 메뉴는 짜장면, 짬뽕, 탕수육이다.`,
        },
        ...messages,
      ],
    });

    const gptReply = gptResponse.choices[0].message.content;
    console.log("🤖 GPT 응답:", gptReply);

    // (I) 응답을 대화 기록에 추가
    messages.push({ role: "system", content: gptReply });

    // (J) ElevenLabs TTS API 호출
    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const ttsHeaders = {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    };

    const ttsPayload = {
      text: gptReply,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 1.0,
      },
    };

    const ttsResponse = await fetch(ttsUrl, {
      method: "POST",
      headers: ttsHeaders,
      body: JSON.stringify(ttsPayload),
    });

    if (!ttsResponse.ok) {
      return NextResponse.json({ error: `TTS API Error: ${ttsResponse.status}` }, { status: ttsResponse.status });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    console.log("✅ TTS 변환 완료");

    // (K) 최종 응답 반환
    return NextResponse.json({ userText, gptReply, audio: base64Audio, messages });

  } catch (error) {
    console.error("❌ Transcribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
