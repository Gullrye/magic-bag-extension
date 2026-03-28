import React from 'react';
import { t } from '~/utils/i18n';

export function EmptyState() {
  return (
    <div className="magic-bag-empty">
      <p className="magic-bag-empty__title">{t('contentEmptyTitle')}</p>
      <p className="magic-bag-empty__body">
        {t('contentEmptyBody')}
      </p>
    </div>
  );
}
