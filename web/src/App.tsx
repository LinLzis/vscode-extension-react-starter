import React, { useEffect, useState } from 'react';
import { Button, Input, Tag } from 'antd';
import './App.css';

// @ts-ignore
import { RpcBrowser } from '@sap-devx/webview-rpc/out.browser/rpc-browser';
// @ts-ignore
import '@sap-devx/webview-rpc/out.browser/rpc-common';

// @ts-ignore
const vscode = acquireVsCodeApi();
const rpc = new RpcBrowser(window, vscode);

export const App = () => {
    const [language, setLanguage] = useState<string>('zh-cn');
    const [message, setMessage] = useState<string>('Demo');
    const [content, setContent] = useState<string>();

    rpc.registerMethod({ func: (msg: string) => setMessage(msg), name: 'testMessage' });

    const sendMessageToExtension = () => {
        rpc.invoke('showAlert', ['info', content]);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
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
            <p style={{ margin: '30px 0' }}>VSCode Display Language: {language}</p>
            <Input.Group compact>
                <Input
                    allowClear
                    style={{ width: 'calc(100% - 100px)' }}
                    placeholder='input message to send'
                    value={content}
                    onChange={onChange}
                />
                <Button type='primary' onClick={sendMessageToExtension}>
                    Send
                </Button>
            </Input.Group>
            <p style={{ margin: '30px 0' }}>Received message: {message}</p>
            <div>
                <Tag color='red'>red</Tag>
                <Tag color='orange'>orange</Tag>
                <Tag color='gold'>gold</Tag>
                <Tag color='lime'>lime</Tag>
                <Tag color='cyan'>cyan</Tag>
                <Tag color='blue'>blue</Tag>
            </div>
        </div>
    );
};
