import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eleven labs',
  description: 'Powered by acolyte health',
  generator: 'acolyte health',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
