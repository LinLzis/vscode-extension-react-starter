import React, { useEffect, useState } from 'react';
import './App.css';
import { SmileOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

// @ts-ignore
import { RpcBrowser } from '@sap-devx/webview-rpc/out.browser/rpc-browser';
// @ts-ignore
import '@sap-devx/webview-rpc/out.browser/rpc-common';

// @ts-ignore
const vscode = acquireVsCodeApi();
const rpc = new RpcBrowser(window, vscode);

export const App = () => {
    const [language, setLanguage] = useState<string>('zh-cn');

    const linkToGithub = () => {
        rpc.invoke('openWebLink', ['https://github.com/LinLzis/vscode-extension-react-starter']);
    };

    useEffect(() => {
        const init = async () => {
            const languageRes = await rpc.invoke('getVscodeEnv');
            setLanguage(languageRes);
        };

        init();
    }, []);

    return (
        <div className='App'>
            <Result
                icon={<SmileOutlined />}
                title='Welcome to my starter!'
                subTitle={`Current language: ${language}`}
                extra={
                    <Button type='primary' icon={<StarOutlined />} onClick={linkToGithub}>
                        Star it!
                    </Button>
                }
            />
        </div>
    );
};
