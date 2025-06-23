import { Section, Cell, List, IconContainer } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import {
  BugBeetleIcon,
  DoorOpenIcon,
  FlyingSaucerIcon,
  GitForkIcon,
  HeadsetIcon,
  MailboxIcon,
  NewspaperIcon,
  PopcornIcon,
  StarIcon,
} from '@phosphor-icons/react';
import { openLink, openTelegramLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { user } from '@/store/userStore';
import { usePickedServer } from '@/helpers/usePickedServer';
import { outline } from '@/store/outlineStore';
import emojiFlags from 'emoji-flags';

export const IndexPage: FC = () => {
  const pickedServer = usePickedServer();

  return (
    <Page back={false}>
      <List>
        <Section header="Сервисы" footer="">
          <Link to="/lampa">
            <Cell
              before={
                <IconContainer>
                  <PopcornIcon size={28} weight="fill" />
                </IconContainer>
              }
              subtitle="Кино, сериалы и аниме"
            >
              Lampa
            </Cell>
          </Link>
          <Link to="/vpn">
            <Cell
              before={
                <IconContainer>
                  <FlyingSaucerIcon size={28} weight="fill" />
                </IconContainer>
              }
              subtitle={
                !pickedServer
                  ? `Сервера в ${outline.length} локациях`
                  : `Текущий сервер: ${emojiFlags.countryCode(pickedServer.country).emoji} ${pickedServer.title?.ru || pickedServer.slug}`
              }
            >
              Outline VPN
            </Cell>
          </Link>
          <Link
            to="/"
            style={{ opacity: 0.5, pointerEvents: 'none' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <MailboxIcon size={28} />
                </IconContainer>
              }
              subtitle="Скоро... Временная почта для регистрации на сайтах без спама"
              multiline
            >
              Anti-SPAM
            </Cell>
          </Link>
        </Section>

        <Section
          header="Аккаунт"
          footer={
            user.value.premium
              ? 'Благодаря вам приложение остаётся бесплатным для всех. Поддержка таких пользователей, как вы, даёт силы развивать проект дальше.'
              : 'Приложение остаётся бесплатным благодаря вашей поддержке. Если вам нравится то, что я делаю, и вы хотите помочь покрыть расходы на серверы — оформите премиум-подписку 💙'
          }
        >
          <Link to="/premium">
            <Cell
              before={
                <IconContainer>
                  <StarIcon size={28} weight={user.value.premium ? 'fill' : 'regular'} />
                </IconContainer>
              }
              subtitle={
                !user.value.premium
                  ? 'Подписка активана'
                  : 'Дополнительные VPN локации, дополнительные источники в Lampa (скоро)'
              }
              multiline
            >
              Premium
            </Cell>
          </Link>
          <Link
            to="/"
            style={{ opacity: 0.5, pointerEvents: 'none' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <BugBeetleIcon size={28} />
                </IconContainer>
              }
              subtitle="Скоро будет доступно..."
            >
              Сбросить настройки
            </Cell>
          </Link>
        </Section>

        <Section
          header="Справка"
          footer={`Version ${app.value.version?.version ?? 'unknown'} (${app.value.version?.commit.slice(0, 7) ?? 'unknown'}). Build time: ${app.value.version?.build_time ?? 'unknown'}`}
        >
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              openTelegramLink(app.value.telegramChannelInviteLink);
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <NewspaperIcon size={28} />
                </IconContainer>
              }
            >
              Новости проекта
            </Cell>
          </Link>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              if (app.value.supportLink === '') {
                openTelegramLink(app.value.telegramChannelInviteLink);
              } else if (
                app.value.supportLink.startsWith('tg://') ||
                app.value.supportLink.startsWith('https://t.me/')
              ) {
                openTelegramLink(app.value.supportLink);
              } else {
                openLink(app.value.supportLink);
              }
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <HeadsetIcon size={28} weight="fill" />
                </IconContainer>
              }
              subtitle="Напишите нам через кнопку чата в канале"
              multiline
            >
              Поддержка
            </Cell>
          </Link>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              openLink('https://github.com/docker-pet');
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <GitForkIcon size={28} />
                </IconContainer>
              }
              subtitle="Проект с открытым исходным кодом на GitHub"
              multiline
            >
              Исходный код
            </Cell>
          </Link>
          <Link
            to="/"
            style={{ opacity: 0.5, pointerEvents: 'none' }}
            className="danger-area"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <DoorOpenIcon size={28} />
                </IconContainer>
              }
              subtitle="Скоро будет доступно..."
            >
              Удалить аккаунт
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
