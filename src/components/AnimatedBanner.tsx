import Lottie from 'lottie-react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import GooseSecretariatHoleAnimation from '../animations/GooseSecretariatHoleAnimation.json';
import GooseSecretariatDieAnimation from '../animations/GooseSecretariatDieAnimation.json';
import GooseSecretariatSleepAnimation from '../animations/GooseSecretariatSleepAnimation.json';
import GooseSecretariatChairAnimation from '../animations/GooseSecretariatChairAnimation.json';
import GooseSecretariatPopcornAnimation from '../animations/GooseSecretariatPopcornAnimation.json';
import { ReactNode } from 'react';

export enum BannerType {
  'loading' = 'loading',
  'unsupported' = 'unsupported',
  'unauthorized' = 'unauthorized',
  'chair' = 'chair',
  'popcorn' = 'popcorn',
}

export const animations = {
  [BannerType.loading]: GooseSecretariatHoleAnimation,
  [BannerType.unsupported]: GooseSecretariatDieAnimation,
  [BannerType.unauthorized]: GooseSecretariatSleepAnimation,
  [BannerType.chair]: GooseSecretariatChairAnimation,
  [BannerType.popcorn]: GooseSecretariatPopcornAnimation,
};

interface IProps {
  type: BannerType;
  header?: ReactNode;
  description?: ReactNode;
}

export function AnimatedBanner({ type, header, description }: IProps) {
  return (
    <Placeholder header={header} description={description}>
      <Lottie loop animationData={animations[type]} style={{ width: '144px', height: '144px' }} />
    </Placeholder>
  );
}
