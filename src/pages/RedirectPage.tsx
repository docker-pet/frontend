import { useEffect, useState, type FC } from 'react';

import { AnimatedBanner, BannerType } from '@/components/AnimatedBanner';

const destanations: Record<string, {
  header?: string;
  description: string;
  button?: string;
  url?: (params: URLSearchParams) => string;
}> = {
  "error": {
    description: 'Ссылка не найдена или недействительна',
  },
  "outline": {
    header: "Outline",
    description: "Сейчас вы будете перенаправлены в приложение Outline.",
    button: "Перейти",
    url: (params) => `https://${location.hostname}/api/outline/${params.get('id')}/${params.get('token')}#${encodeURIComponent(params.get('title') || 'Outline VPN')}`
  },
  "github": {
    header: "GitHub",
    description: "Сейчас вы будете перенаправлены на страницу проекта Docker Pet на GitHub.",
    url: () => "https://github.com/docker-pet"
  },
  "lampa:testflight": {
    header: "Lampa для Apple TV",
    description: "Сейчас вы будете перенаправлены в TestFlight для установки Lampa.",
    url: () => "https://testflight.apple.com/join/4xqg1q15"
  },
  "lampa:apk": {
    header: "Lampa для Android TV",
    description: "Сейчас вы будете перенаправлены на страницу загрузки APK файла Lampa.",
    url: () => "https://github.com/lampa-app/LAMPA/releases/latest/download/app-lite-release.apk",
  },
  "lampa:media-station-x": {
    header: "Media Station X",
    description: "Сейчас вы будете перенаправлены на видео инструкцию по установке Lampa через Media Station X.",
    url: () => "https://youtu.be/z4QJ5c4aR54"
  },
  "outline:play-market": {
    description: "Сейчас вы будете перенаправлены в Play Market для установки Outline.",
    url: () => "https://play.google.com/store/apps/details?id=org.outline.android.client"
  },
  "outline:apk": {
    description: "Сейчас вы будете перенаправлены на страницу загрузки APK файла Outline.",
    url: () => "https://s3.amazonaws.com/outline-releases/client/android/stable/Outline-Client.apk"
  },
  "outline:app-store": {
    description: "Сейчас вы будете перенаправлены в App Store для установки Outline.",
    url: () => "https://itunes.apple.com/us/app/outline-app/id1356177741"
  },
  "outline:windows": {
    description: "Сейчас вы будете перенаправлены на страницу загрузки Outline для Windows.",
    url: () => "https://s3.amazonaws.com/outline-releases/client/windows/stable/Outline-Client.exe"
  },
  "outline:macos": {
    description: "Сейчас вы будете перенаправлены в Mac App Store для установки Outline.",
    url: () => "https://itunes.apple.com/us/app/outline-app/id1356178125",
  },
  "outline:other": {
    description: "Сейчас вы будете перенаправлены на страницу загрузки Outline для других платформ.",
    url: () => "https://getoutline.org/ru/home"
  }
}

export const RedirectPage: FC = () => {
  const [params] = useState(() => new URLSearchParams(window.location.search))
  const type = params.get('type') || 'error';
  const destination = destanations[type] || destanations['error'];
  const url = destination.url ? destination.url(params) : '';

  useEffect(() => {
    if (!url) return;

    // Check if the link is a Telegram link
    if (url.startsWith('https://t.me/') || url.startsWith('tg://')) {
      // Try to open via tg:// protocol
      const tgUrl = url.startsWith('https://t.me/')
        ? url.replace('https://t.me/', 'tg://resolve?domain=')
        : url;

      // Open tg://, fallback to browser after 1 second
      const timeout = setTimeout(() => {
        window.location.href = url;
      }, 1000);

      // Attempt to open the Telegram app
      window.location.href = tgUrl;

      // Clear the timer if the user leaves the page
      return () => clearTimeout(timeout);
    }

    // Check if the link is an Outline link (type === 'outline')
    if (type === 'outline' && url.startsWith('https://')) {
      // Try to open via ssconf:// protocol
      const ssconfUrl = url.replace(/^https:/, 'ssconf:');

      // Open ssconf://, fallback to browser after 1 second
      const timeout = setTimeout(() => {
        window.location.href = url;
      }, 1000);

      // Attempt to open the Outline app
      window.location.href = ssconfUrl;

      // Clear the timer if the user leaves the page
      return () => clearTimeout(timeout);
    }

    // Regular redirect after 1 second
    const timeout = setTimeout(() => {
      window.location.href = url;
    }, 1000);
    return () => clearTimeout(timeout);

  }, [url, type]);

  return (
    <AnimatedBanner
      type={BannerType.loading}
      header={destination.header || "Перенаправление"}
      description={<>
        <p>{destination.description}</p>

      </>}
    />
  );
};
