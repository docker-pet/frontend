import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { LampaIcon } from '@/components/Icons/LampaIcon';

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <List>
        <Section header="Сервисы" footer="Функционал будет расширен в ближайшем будущем">
          <Link to="/lampa">
            <Cell before={<LampaIcon />} subtitle="Кино, сериалы и аниме">
              Lampa
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
