import { Jersey_25 } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bobbleboddy = localFont({
  src: "../public/fonts/Bobbleboddy.ttf",
  variable: "--font-bobbleboddy",
  display: "swap",
});


export const jersey = Jersey_25({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
});


export const playwrite = localFont({
  src: "../public/fonts/playwrite/PlaywriteDESAS-VariableFont_wght.ttf",
  variable: "--font-playwrite",
  display: "swap",
})


export const pixelifySans = localFont({ 
  src: "../public/fonts/pixelifysans/PixelifySans-Regular.ttf",
  variable: "--font-logo",
  display: "swap",
})


const _fontVariables = [
    geistSans.variable,
    geistMono.variable,
    bobbleboddy.variable,
    jersey.variable,
    playwrite.variable,
    pixelifySans.variable,
]

export const fontVariables: string = _fontVariables.join(" ");