import "./globals.css"

export const metadata = {
  title: {
    default: "Mate Study Room",
    template: "%s | Mate Study Room",
  },
  description: "A private chess study room for games, playlists, and analysis.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1c18",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
