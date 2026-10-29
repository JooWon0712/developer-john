export const analytics = {
  measurementId: "G-17PE2KX72Q",
  allowedOrigins: ["https://developer-john.com", "https://www.developer-john.com"],
} as const;

export function shouldLoadAnalytics(origin: string, isProduction: boolean): boolean {
  return isProduction && analytics.allowedOrigins.some(allowed => origin === allowed);
}

export const analyticsInitialization = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(analytics.measurementId)});
`;
