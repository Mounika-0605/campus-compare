import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CampusCompare",
  description: "Discover and compare top colleges",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white min-h-screen relative`}
      >
        {/* 🔥 Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1f2937,_transparent_70%)]"></div>

        {/* 🔝 Navbar */}
        <nav className="flex justify-between items-center px-8 py-4 border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🎓 CampusCompare
          </h1>
          <span className="text-sm text-gray-400">
            Explore • Compare • Decide
          </span>
        </nav>

        {/* 📦 Main Content */}
        <main className="px-6 py-8 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
