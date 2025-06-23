import { Fragment, type FC } from 'react';
import {
  Cell,
  IconContainer,
  InlineButtons,
  Input,
  List,
  Section,
} from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { LampaBanner } from '@/components/LampaBanner/LampaBanner';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { LampaIcon } from '@/components/Icons/LampaIcon';
import {
  FingerprintIcon,
  AndroidLogoIcon,
  GooglePlayLogoIcon,
  AppleLogoIcon,
  StarIcon,
} from '@phosphor-icons/react';
import { openLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/components/Link/Link';
import { user } from '@/store/userStore';

export const LampaPage: FC = () => {
  const navigate = useNavigate();
  const link = `https://lampa.${app.value.appDomain}`;

  return (
    <Page>
      <LampaBanner />

      <div style={{ padding: '12px 24px' }}>
        <InlineButtons mode="bezeled">
          <InlineButtonsItem
            text="Открыть"
            onClick={() => {
              openLink(link, {
                tryBrowser: 'chrome',
                tryInstantView: false,
              });
            }}
          >
            <LampaIcon size="24" />
          </InlineButtonsItem>
          <InlineButtonsItem
            text="Войти"
            onClick={() => {
              void navigate('/2fa');
            }}
          >
            <FingerprintIcon size="24" />
          </InlineButtonsItem>
          {!user.value.premium ? (
            <InlineButtonsItem text="Premium">
              <StarIcon size={28} />
            </InlineButtonsItem>
          ) : (
            <Fragment />
          )}
        </InlineButtons>
      </div>

      <List>
        <Section
          header="Просмотр в браузере"
          footer="Пожалуйста, обратите внимание: единственным официальным ресурсом является наш сайт. Мы не разрабатываем приложение Lampa и не несем ответственности за сторонние или кастомные версии, ссылки на которые приведены ниже."
        >
          <Input header="Адрес" value={link} readOnly />
        </Section>

        <Section
          header="Установка на AppleTV"
          footer={`После установки вам потребуется указать адрес сервера — ${link}`}
        >
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              openLink(`https://testflight.apple.com/join/4xqg1q15`, {
                tryBrowser: 'chrome',
                tryInstantView: false,
              });
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <AppleLogoIcon size={28} />
                </IconContainer>
              }
              subtitle="Официальный клиент Lampa для Apple TV"
              multiline
            >
              Testflight
            </Cell>
          </Link>
        </Section>

        <Section
          header="Установка Android TV и других телевизорах"
          footer={`После установки вам потребуется указать адрес сервера — ${link}. Следуя инструкциям пропустите шаг с настройкой плагинов, так как они уже настроены.`}
        >
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              // TODO from backend
              openLink(
                `https://github.com/lampa-app/LAMPA/?tab=readme-ov-file#last-release-links`,
                {
                  tryBrowser: 'chrome',
                  tryInstantView: false,
                },
              );
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <AndroidLogoIcon size={28} />
                </IconContainer>
              }
              subtitle="Вам потребуется вручную установить APK-файл"
              multiline
            >
              Официальный клиент
            </Cell>
          </Link>

          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              openLink(`https://youtu.be/z4QJ5c4aR54`, {
                tryBrowser: 'chrome',
                tryInstantView: false,
              });
            }}
          >
            <Cell
              before={
                <IconContainer>
                  <GooglePlayLogoIcon size={28} />
                </IconContainer>
              }
              subtitle="Инструкция на YouTube по установке из магазина приложений на любых TV системах"
              multiline
            >
              Media Station X
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
