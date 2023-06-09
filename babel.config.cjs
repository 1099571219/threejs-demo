module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    [
      "@vue/babel-preset-jsx",
      {
        injectH: false,
      },
    ],
  ],
  "plugins": [
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": true }] // `style: true` 会加载 less 文件
  ]
};
