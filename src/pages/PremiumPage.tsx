import { Section, Cell, List, IconContainer } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { StarIcon } from '@phosphor-icons/react';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { user } from '@/store/userStore';

export const PremiumPage: FC = () => {
  return (
    <Page>
      <List>
        <Section
          header="Premium"
          footer={
            user.value.premium
              ? 'Спасибо за вашу поддержу, вы уже используете премиум подписку!'
              : 'Совсем скоро здесь появится красивое описание какие возможности открывает премиум подписка. А пока вы просто можете оформить подписку и поддержать разработку приложения.'
          }
        >
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              openTelegramLink(app.value.telegramPremiumChannelInviteLink);
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <StarIcon size={28} weight={user.value.premium ? 'fill' : 'regular'} />
                </IconContainer>
              }
              subtitle="Telegram канал для Premium подписчиков"
              multiline
            >
              {user.value.premium ? 'Управление подпиской' : 'Оформить подписку'}
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
