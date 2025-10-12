import "./globals.css";
import { Fira_Sans, Alfa_Slab_One } from "next/font/google";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira",
  display: "swap",
});
const alfa = Alfa_Slab_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alfa",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fira.variable} ${alfa.variable}`}>
      <body>{children}</body>
    </html>
  );
}
