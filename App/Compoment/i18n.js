import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import English from '.././language/en.json';
import Albanian from '.././language/al.json';
import Greek from '.././language/gk.json';
import Italian from '.././language/il.json';
import 'intl-pluralrules';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    English: English,
    Albanian: Albanian,
    Greek: Greek,
    Italian: Italian,
  },
  // react: {
  //   useSuspense: false,
  // },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
