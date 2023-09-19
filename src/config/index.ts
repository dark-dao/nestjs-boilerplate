import developmentConfig from './env.development';
import productionConfig from './env.production';

const currentConfig =
  process.env.NODE_ENV === 'production'
    ? productionConfig()
    : developmentConfig();

export default () => ({
  ...currentConfig,
  // тут можно переопределить любой ключ в конфиге при разработке
});
