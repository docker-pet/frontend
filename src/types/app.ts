export interface IApp {
  id: string;
  appDomain: string;
  telegramChannelInviteLink: string;
  telegramPremiumChannelInviteLink: string;
  authPinLength: number;

  collectionId: string;
  collectionName: string;
}
