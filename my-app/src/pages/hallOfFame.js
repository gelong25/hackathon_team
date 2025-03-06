import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// import { db } from "@/firebase"; 
// import { collection, getDocs } from "firebase/firestore";

export default function HallOfFame() {
  const dummyImages = [
    "/images/dummy1.jpeg",
    "/images/dummy2.jpeg",
    "/images/dummy3.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nicknames, setNicknames] = useState(["닉네임1", "닉네임2", "닉네임3"]); // 기본값 설정

  // Firestore에서 닉네임 데이터를 가져오는 함수 
  // useEffect(() => {
  //   const fetchNicknames = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "hallOfFame"));
  //       const fetchedNicknames = querySnapshot.docs.map(doc => doc.data().nickname);
  //       setNicknames(fetchedNicknames); // Firestore에서 가져온 닉네임으로 업데이트
  //     } catch (error) {
  //       console.error("Error fetching nicknames:", error);
  //     }
  //   };

  //   fetchNicknames();
  // }, []);

  // 다음 이미지로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyImages.length);
  };

  // 이전 이미지로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyImages.length) % dummyImages.length);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* 이미지 슬라이드 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {/* 이전 버튼 */}
        <button 
          onClick={prevSlide} 
          style={{ position: "absolute", left: "10px", fontSize: "24px", cursor: "pointer", background: "none", border: "none" }}
        >
          ⬅
        </button>

        {/* 이미지 */}
        <Image 
          src={dummyImages[currentIndex]}
          alt={`캐릭터 ${currentIndex + 1}`}
          width={300}
          height={300}
          priority
        />

        {/* 다음 버튼 */}
        <button 
          onClick={nextSlide} 
          style={{ position: "absolute", right: "10px", fontSize: "24px", cursor: "pointer", background: "none", border: "none" }}
        >
          ➡
        </button>
      </div>

      {/* 닉네임 (이미지와 매핑된 닉네임 표시) */}
      <h2>{nicknames[currentIndex]}</h2>

      {/* 홈 버튼 */}
      <Link href="/home">
        <button>홈</button>
      </Link>
    </div>
  );
}
