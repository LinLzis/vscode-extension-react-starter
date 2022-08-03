# VSCode Extension React Starter

[![VSCode Extension](https://img.shields.io/badge/Framework-VSCode-0066b8)](https://code.visualstudio.com/api)
[![React](https://img.shields.io/badge/Framework-React-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6)](https://www.typescriptlang.org/)
[![Webpack 5](https://img.shields.io/badge/Develop-webpack-eaf8ff)](https://webpack.js.org/concepts/)

VSCode extension template of webview using React(CRA) 🚀

## Feature

-   [x] [React](https://reactjs.org/)
-   [x] [Create React App](https://github.com/facebook/create-react-app)
-   [x] [TypeScript](https://www.typescriptlang.org/)
-   [x] [React Intl](https://formatjs.io/docs/react-intl/) React i18n library
-   [x] [Ant Design](https://ant.design/components/overview-cn/) Ant Design with React
-   [x] [webview-rpc](https://vitejs.dev/) Communication tool for VSCode extension with its webviews
-   [x] [vscode-nls-i18n](https://github.com/axetroy/vscode-nls-i18n) VSCode library for supporting i18n
-   [x] [ESLint](https://eslint.org/)
-   [x] [Prettier](https://prettier.io/)

## Multiple webivew entry
If your extension have multiple webview provider, need to build multiple js&css, so that provid the `multi-entry` branch to handle this case. 

> This branch modifies the build configuration of CRA through the `eject` command.

```bash
git checkout -b multi-entry origin/multi-entry
```

## Start

```bash
# 0. Clone project
git clone https://github.com/LinLzis/vscode-extension-react-starter.git

# 1. Install dependencies
yarn

# 2. build webview
yarn build-webview

# 3. Extension package
npx vsce package
```


## License

[MIT @AvrilLi](./LICENSE)
