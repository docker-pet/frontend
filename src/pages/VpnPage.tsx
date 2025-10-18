import { useState, type FC } from 'react';
import {
  Button,
  Cell,
  Checkbox,
  IconButton,
  Input,
  List,
  Section,
  Select,
  Snackbar,
} from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import {
  AndroidLogoIcon,
  GooglePlayLogoIcon,
  AppleLogoIcon,
  WindowsLogoIcon,
  AppStoreLogoIcon,
  LinuxLogoIcon,
  ClipboardTextIcon,
} from '@phosphor-icons/react';
import { copyTextToClipboard, openLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { Link } from '@/components/Link/Link';
import { user } from '@/store/userStore';
import { outline, saveSettings } from '@/store/outlineStore';
import emojiFlags from 'emoji-flags';
import { usePickedServer } from '@/helpers/usePickedServer';

const links: Array<{
  title: string;
  redirect: string;
  Icon: FC<{ size?: number }>;
}> = [
  {
    title: 'Android (Play Market)',
    redirect: 'outline:play-market',
    Icon: GooglePlayLogoIcon,
  },
  {
    title: 'Android (APK файл)',
    redirect: 'outline:apk',
    Icon: AndroidLogoIcon,
  },
  {
    title: 'IOS (App Store)',
    redirect: 'outline:app-store',
    Icon: AppStoreLogoIcon,
  },
  {
    title: 'Windows',
    redirect: 'outline:windows',
    Icon: WindowsLogoIcon,
  },
  {
    title: 'MacOS',
    redirect: 'outline:macos',
    Icon: AppleLogoIcon,
  },
  {
    title: 'Другие системы',
    redirect: 'outline:other',
    Icon: LinuxLogoIcon,
  },
];

export const VpnPage: FC = () => {
  const appDomain = user.value.outlineReverseServerEnabled ? app.value.appDomainReverse : app.value.appDomain;
  const configTitle = encodeURIComponent(`${app.value.appTitle}${user.value.outlineReverseServerEnabled ? ` • DNS-цензура 🥷` : ''}`)
  const link = `ssconf://${appDomain}/api/outline/${user.value.id}/${user.value.outlineToken}#${configTitle}`;
  const redirectLink = `https://${appDomain}/redirect?type=outline&id=${encodeURIComponent(user.value.id)}&token=${encodeURIComponent(user.value.outlineToken)}&title=${configTitle}`;
  const [copiedNotification, setCopiedNotification] = useState(false);
  const pickedServer = usePickedServer();

  return (
    <Page>
      <List>
        <Section
          header="Outline VPN"
          footer="Добавьте ключ в Outline один раз — при смене сервера достаточно просто переподключиться, новые ключи добавлять не нужно."
        >
          <Input
            header="Ключ доступа"
            value={link}
            readOnly
            after={
              <IconButton
                mode="bezeled"
                size="s"
                onClick={() => {
                  void copyTextToClipboard(link);
                  setCopiedNotification(true);
                }}
              >
                <ClipboardTextIcon size="20" />
              </IconButton>
            }
          />

          <Select
            header="Предпочительная локация"
            onChange={(e) => {
              void saveSettings({
                outlineServer: e.target.value
              });
            }}
          >
            <option value="" selected={!pickedServer}>
              🎲 Случайный сервер (EU)
            </option>
            {Object.values(outline.value).map((server) => (
              <option
                key={server.id}
                value={server.id}
                selected={user.value.outlineServer === server.id}
                disabled={!user.value.premium && server.premium}
              >
                {emojiFlags.countryCode(server.country).emoji} {server.title?.ru || server.slug}
                {server.premium ? ' • Premium ⭐️' : ''}
              </option>
            ))}
          </Select>

          {/* <Cell
            Component="label"
            before={<Checkbox
              name="checkbox"
              value="true"
              checked={user.value.outlineReverseServerEnabled}
              onChange={(e) => {
                void saveSettings({
                  outlineReverseServerEnabled: e.target.checked,
                });
              }}
            />}
            description="🥷 Альтернативное подключение через домен внутри зоны с ограничениями доступа. Потребует повторного добавления Outline конфигурации."
            multiline
          >
            Обход DNS-цензуры
          </Cell> */}

          <div style={{ padding: 16 }}>
            <Button
              mode="bezeled"
              size="m"
              style={{ width: '100%' }}
              onClick={() => {
                openLink(redirectLink, {
                  tryInstantView: true,
                });
              }}
            >
              Перейти в Outline
            </Button>
          </div>
        </Section>

        <Section
          header="Скачать Outline VPN клиент"
          footer={
            'После установки клиента, вы можете подключиться к VPN серверу, используя ключ доступа, указанный выше.'
          }
        >
          {links.map(({ title, redirect, Icon }) => (
            <Link
              key={redirect}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                openLink(`https://${appDomain}/redirect?type=${encodeURIComponent(redirect)}`, {
                  tryInstantView: false,
                });
              }}
            >
              <Cell before={<Icon size={28} />}>{title}</Cell>
            </Link>
          ))}
        </Section>
      </List>

      {copiedNotification && (
        <Snackbar
          before={<ClipboardTextIcon size={32} />}
          description={'Ключ доступа скопирован в буфер обмена, продолжите в приложении Outline.'}
          onClose={() => setCopiedNotification(false)}
        />
      )}
    </Page>
  );
};
