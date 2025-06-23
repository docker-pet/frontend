export interface IApp {
  id: string;
  appDomain: string;
  appTitle: string;
  telegramChannelInviteLink: string;
  telegramPremiumChannelInviteLink: string;
  supportLink: string;
  authPinLength: number;

  collectionId: string;
  collectionName: string;

  botUsername: string;

  version?: IAppVersion;
}

export interface IAppVersion {
  version: string;
  commit: string;
  build_time: string;
}
