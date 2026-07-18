import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#0F0F0F',
        color: 'white',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 24,
          textTransform: 'uppercase',
          letterSpacing: 4,
          color: '#34d399',
        }}
      >
        Blogify
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          Insights, stories, and ideas
        </div>
        <div style={{ fontSize: 28, color: '#d1d5db', maxWidth: 860 }}>
          Discover thoughtful articles and curated posts from the Blogify
          archive.
        </div>
      </div>
    </div>,
    size,
  )
}
