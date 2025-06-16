import { type FC } from 'react';
import { InlineButtons } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { LampaBanner } from '@/components/LampaBanner/LampaBanner';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { LampaIcon } from '@/components/Icons/LampaIcon';
import { FingerprintIcon, AcornIcon } from '@phosphor-icons/react';
import { openLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { openAuthConfirm } from '@/store/authConfirmStore';

export const LampaPage: FC = () => {
  return (
    <Page>
      <LampaBanner />

      <div style={{ padding: '12px 24px' }}>
        <InlineButtons mode="bezeled">
          <InlineButtonsItem
            text="Открыть"
            onClick={() => {
              openLink(`https://lampa.${app.value.appDomain}`, {
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
              openAuthConfirm();
            }}
          >
            <FingerprintIcon size="24" />
          </InlineButtonsItem>
          <InlineButtonsItem text="Premium">
            <AcornIcon size={24} />
          </InlineButtonsItem>
        </InlineButtons>
      </div>

      {/* <List>
        <Section
          header="История просмотров"
          footer="Для не premium пользователей доступно 10 последних просмотров"
        >
          <Link to="/init-data">
            <Cell subtitle="User data, chat information, technical data">Init Data</Cell>
          </Link>
        </Section>
      </List> */}
    </Page>
  );
};
