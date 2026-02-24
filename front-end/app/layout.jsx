import './globals.css'

export const metadata = {
  title: 'Precision Resume',
  description: 'AI-powered resume refinement tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}

