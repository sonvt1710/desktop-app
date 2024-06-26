require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  // AC_USERNAME is only filled in when we build production-ready artifacts
  const shouldNotarize = Boolean(process.env.AC_USERNAME);

  if (electronPlatformName !== 'darwin' || !shouldNotarize) {
    return;
  }

  const { id, productFilename } = context.packager.appInfo;

  return await notarize({
    appBundleId: id,
    appPath: `${appOutDir}/${productFilename}.app`,
    appleId: process.env.AC_USERNAME,
    appleIdPassword: process.env.AC_PASSWORD,
    // to find AC_TEAM_ID run 
    // xcrun altool --list-providers -u <email> -p <password>
    // AC_TEAM_ID=ProviderShortname from the output
    teamId: process.env.AC_TEAM_ID, 
  });
};
