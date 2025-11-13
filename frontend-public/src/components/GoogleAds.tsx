'use client';

import Script from 'next/script';

interface GoogleAdsProps {
  conversionId: string;
}

// Google Ads Global Tag (instala em todas as páginas)
export function GoogleAdsTag({ conversionId }: GoogleAdsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${conversionId}');
          `,
        }}
      />
    </>
  );
}

// Função para disparar conversão quando formulário for enviado
export const trackConversion = (conversionLabel: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: conversionLabel,
    });
  }
};
