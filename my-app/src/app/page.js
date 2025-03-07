"use client"; // 👈 클라이언트 컴포넌트로 설정

import { useRouter } from "next/navigation";
import Image from "next/image";
import Title from "@/component/Title"; 
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <Title>포비야</Title>
      <p className="text-lg text-green-600 mb-6" style={{ fontWeight: "800", fontSize: "24px" }}>함께 두려움을 극복해요!</p>

      <div 
        className="mb-6 bg-white p-4 rounded-full shadow-xl transition-transform duration-300"
        style={{ transform: isHovered ? "scale(1.03)" : "scale(1)" }} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image 
          src="/images/pobby.png" 
          alt="포비야 로고"
          width={300}            
          height={300}
          className="rounded-full"
          priority
        />
      </div>

      <button
        className="bg-green-500/80 hover:bg-green-600/80 text-white px-8 py-3 rounded-full text-lg 
                shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
        onClick={() => router.push("/categorySelect")}
      >
        시작하기
      </button>
    </div>
  );
}