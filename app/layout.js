import { Geist, Quicksand } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata = {
  title: "Asteroid Finder",
  description: "Find Asteroid by discovery or first obs date",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${quicksand.variable} font-quicksand antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
