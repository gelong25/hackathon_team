import Footer from "@/component/footer";

export default function Home() {
  // 더미 데이터 (경험치 및 레벨)
  const level = 5;
  const experience = 65; // % 값 (0~100)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {/* 경험치 바 */}
      <div 
        style={{
          width: "1000px",
          height: "20px",
          backgroundColor: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
          border: "2px solid #ccc",
          marginTop: "50px",
          position: "relative"
        }}
      >
        <div 
          style={{
            width: `${experience}%`, 
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>

      {/* 레벨 표시 */}
      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginTop: "10px" }}>
        Lv. {level}
        </div>

      {/* 원 모양 (이미지 대체) */}
      <div 
        style={{
          width: "400px",
          height: "400px",
          backgroundColor: "#ddd", 
          borderRadius: "50%", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "16px",
          color: "#555",
          marginTop: "20px"
        }}
      >
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
