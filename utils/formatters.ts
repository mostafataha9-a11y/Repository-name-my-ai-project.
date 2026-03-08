
import { Language, Region } from '../types';

export const formatCurrency = (amount: number, lang: Language, region: Region): string => {
  const currencyMap: Record<Region, { code: string; symbol: string; locale: string }> = {
    [Region.GULF]: { code: 'SAR', symbol: 'ر.س', locale: 'ar-SA' },
    [Region.EUROPE]: { code: 'EUR', symbol: '€', locale: 'de-DE' },
    [Region.AMERICA]: { code: 'USD', symbol: '$', locale: 'en-US' },
    [Region.ASIA]: { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  };

  const config = currencyMap[region];
  
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : config.locale, {
    style: 'currency',
    currency: config.code,
    currencyDisplay: 'symbol',
  }).format(amount);
};

export const formatNumber = (num: number, lang: Language): string => {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(num);
};

export const formatArea = (area: number, lang: Language): string => {
  const unit = lang === 'ar' ? 'متر مربع' : 'sqm';
  return `${formatNumber(area, lang)} ${unit}`;
};
