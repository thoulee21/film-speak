const ExpoConfigPlugins = require("@expo/config-plugins");

const withCustomAndroidManifest = config => {
  return ExpoConfigPlugins.withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;
    if (!manifest.application) {
      console.warn(
        'AndroidManifest.xml is missing an <application> element - skipping adding notification controls related config.'
      );
      return config;
    }

    manifest.application.map(application => {
      const mainActivity = application.activity.find(activity => {
        return activity.$['android:name'] === '.MainActivity';
      });

      mainActivity['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        data: [{ $: { 'android:mimeType': 'video/*' } }]
      });
      return application;
    });
    return config;
  });
};

exports.default = withCustomAndroidManifest;