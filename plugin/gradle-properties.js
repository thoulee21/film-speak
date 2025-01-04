const ExpoConfigPlugins = require("@expo/config-plugins");

// 定义要修改的属性
const CUSTOM_CONFIG = [
  {
    key: 'org.gradle.parallel',
    value: 'true'
  },
  {
    key: 'reactNativeArchitectures',
    value: 'arm64-v8a'
  }
]

const withCustomGradlePropertiesConfig = config => {
  // 使用withGradleProperties修改gradle.properties文件
  return ExpoConfigPlugins.withGradleProperties(config, config => {
    // 过滤掉已有的属性
    config.modResults = config.modResults.filter(item => {
      return !CUSTOM_CONFIG.some(target => {
        return item.type === 'property' && item.key === target.key;
      });
    });

    // 添加新的属性
    CUSTOM_CONFIG.forEach(target => {
      config.modResults.push({
        type: 'property',
        key: target.key,
        value: target.value
      });
    });
    return config;
  });
};

exports.default = withCustomGradlePropertiesConfig;