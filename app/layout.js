import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "中国传统色和日本传统色,Chinese traditional colors and Japanese traditional colors",
  description: "中国传统色｜日本传统色｜传统色｜颜色, Chinese Traditional Colors | Japanese Traditional Colors | Traditional Colors | Colors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
