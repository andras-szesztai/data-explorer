const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#017CB7', '@error-color': '#f5222d' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};