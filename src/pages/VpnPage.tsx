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
  link: string;
  Icon: FC<{ size?: number }>;
}> = [
  {
    title: 'Android (Play Market)',
    link: 'https://play.google.com/store/apps/details?id=org.outline.android.client',
    Icon: GooglePlayLogoIcon,
  },
  {
    title: 'Android (APK файл)',
    link: 'https://s3.amazonaws.com/outline-releases/client/android/stable/Outline-Client.apk',
    Icon: AndroidLogoIcon,
  },
  {
    title: 'IOS (App Store)',
    link: 'https://itunes.apple.com/us/app/outline-app/id1356177741',
    Icon: AppStoreLogoIcon,
  },
  {
    title: 'Windows',
    link: 'https://s3.amazonaws.com/outline-releases/client/windows/stable/Outline-Client.exe',
    Icon: WindowsLogoIcon,
  },
  {
    title: 'MacOS',
    link: 'https://itunes.apple.com/us/app/outline-app/id1356178125',
    Icon: AppleLogoIcon,
  },
  {
    title: 'Другие системы',
    link: 'https://getoutline.org/ru/get-started/#step-3',
    Icon: LinuxLogoIcon,
  },
];

export const VpnPage: FC = () => {
  const link = `ssconf://${app.value.appDomain}/api/outline/${user.value.id}/${user.value.outlineToken}#${encodeURIComponent(app.value.appTitle)}`;
  const redirectLink = `https://${app.value.appDomain}/api/outline/redirect/${user.value.id}/${user.value.outlineToken}`;
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

          <Cell
            Component="label"
            before={<Checkbox
              name="checkbox"
              value="true"
              checked={user.value.outlinePrefixEnabled}
              onChange={(e) => {
                void saveSettings({
                  outlinePrefixEnabled: e.target.checked,
                });
              }}
            />}
            description="🕵️‍♂️ Все TCP/UDP-пакеты будут маскироваться под трафик популярных приложений."
            multiline
          >
            Маскировать трафик
          </Cell>

          <Cell
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
            description="🥷 Включает точку входа в России. Используйте только при блокировке прямого подключения провайдером."
            multiline
          >
            Обход цензуры
          </Cell>

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
          {links.map(({ title, link, Icon }) => (
            <Link
              key={title}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                openLink(link, {
                  tryBrowser: 'chrome',
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
