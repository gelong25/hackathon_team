import "../styles/globals.css"; // Tailwind CSS 적용

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* 배경을 적용할 컨테이너 추가 */}
        <div className="h-screen relative">
          {/* 배경 이미지 레이어 */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/background1.jpg')",
              opacity: 0.7, // 투명도 20%
            }}
          />
          {/* 콘텐츠 레이어 */}
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
