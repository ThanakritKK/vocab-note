import { ImageResponse } from 'next/og';

// ตั้งค่าขนาดรูป (มาตรฐาน Facebook)
export const runtime = 'edge';
export const alt = 'Vocab Note App';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      // CSS-in-JS: เขียน HTML/CSS เพื่อวาดรูป
      <div
        style={{
          background: 'linear-gradient(to bottom right, #2563eb, #1e40af)', // สีฟ้าไล่เฉด
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 128, fontWeight: 'bold', marginBottom: 20 }}>
          📚 VocabNote
        </div>
        <div style={{ fontSize: 48, opacity: 0.8 }}>
          Your AI Vocabulary Coach
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}