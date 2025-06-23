const qr = /2fa_([0-9]+)/;

export function parseAuthLink(link: string): number[] {
  try {
    const url = new URL(link, 'tg://');
    const tgWebAppStartParam = decodeURIComponent(url.searchParams.get('startapp') || '');
    return parsetgWebAppStartParam(tgWebAppStartParam);
  } catch (error) {
    console.error('Failed to parse auth QR code:', error);
  }

  return [];
}

export function parsetgWebAppStartParam(tgWebAppStartParam: string): number[] {
  try {
    const match = qr.exec(tgWebAppStartParam);
    if (match) {
      return String(match[1]).split('').map(Number);
    }
    return [];
  } catch (error) {
    console.error('Failed to parse tgWebAppStartParam:', error);
    return [];
  }
}

export function generateAuthLink(botUsername: string, pin: string): string {
  try {
    return `tg://resolve?domain=${botUsername}&startapp=2fa_${pin}`;
  } catch {
    return '';
  }
}
