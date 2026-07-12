// ─────────────────────────────────────────────
// App Configuration
// ─────────────────────────────────────────────

import { Random } from "@/lib/utilities/Random";

const bgs: Record<string, string> = {
  bg: "/backgrounds/bgg.jpg",
};

for (let i = 0; i < 8; i++) {
  bgs[`bg${i + 1}`] = `/backgrounds/bg${i + 1}.jpg`;
}

const appConfig = {
  appName: "Vocab Adventure",
  tagline: "Learn Yoruba through interactive games and videos!",

  logos: {
    // I know green maps to purple, leave it like that.
    hue: "/app-logos/logo-black.png",
    dark: "/app-logos/logo-black.png",
    white: "/app-logos/logo-white.png",
    grey: "/app-logos/logo-grey.png",
    hue_svg: "/app-logos/logo-purple.svg",
    dark_svg: "/app-logos/logo-black.svg",
    white_svg: "/app-logos/logo-white.svg",
    grey_svg: "/app-logos/logo-grey.svg",
    favicons: {
      hue: "/app-logos/favicons/favicon-main.ico",
      green: "/app-logos/favicons/logo-purple.ico",
      dark: "/app-logos/favicons/logo-black.ico",
      white: "/app-logos/favicons/logo-white.ico",
    },
  },

  media: {
    avatarExample: "/media/avatars/samuraicoderr.png",
    defaultAvatar: "/media/avatars/default-avatar.png",
  },

  fonts: {
    logoFont: "/fonts/Bobbleboddy.ttf",
  },

  backgrounds: <Record<string, string>>{
    ...bgs,
  },

  soundEffects: {
    kidsCheer:
      "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783820040/kids_screeming_yaay_ldgmea.mp3",
    fireworks:
      "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783820039/fireworks_effect_h1vgvs.mp3",
    disappointedCrowd:
      "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783820732/disappointed_crowd_kyibxq.wav",
  },
} as const;

export default appConfig;

export const randomBG: () => string = () =>
  appConfig.backgrounds[Random.choice(Object.keys(appConfig.backgrounds))];
