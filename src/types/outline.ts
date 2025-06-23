export interface IOutlineServer {
  id: string;
  title: Record<string, string> | null;
  description: Record<string, string> | null;
  country: string;
  slug: string;
  premium: boolean;
  enabled: boolean;
}
