import * as vscode from 'vscode';
import * as path from 'path';
import { FuncObject, getNonce } from './common';
import { RpcExtension } from '@sap-devx/webview-rpc/out.ext/rpc-extension';

export default class WelcomePanel {
    public static currentPanel: WelcomePanel | undefined;

    private static readonly viewType = 'starter.welcome';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;

    private _disposables: vscode.Disposable[] = [];
    private _rpc?: RpcExtension;

    public static createOrShow(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (WelcomePanel.currentPanel) {
            WelcomePanel.currentPanel._panel.reveal(column);
        } else {
            WelcomePanel.currentPanel = new WelcomePanel(extensionPath, column || vscode.ViewColumn.One);
        }
    }

    private constructor(extensionPath: string, column: vscode.ViewColumn) {
        this._extensionPath = extensionPath;

        this._panel = vscode.window.createWebviewPanel(WelcomePanel.viewType, 'Welcome', column, {
            enableScripts: true,
        });

        this._panel.webview.html = this._getHtmlForWebview();

        this._rpc = new RpcExtension(this._panel.webview);
        for (const key of Object.keys(this.funcHander)) {
            this._rpc.registerMethod({ func: this.funcHander[key], name: key });
        }

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    private funcHander: FuncObject = {
        getVscodeEnv: () => {
            return vscode.env.language;
        },
        openWebLink: (link: string) => {
            console.log('into openWebLink func');
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(link));
        },
    };

    public dispose() {
        WelcomePanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview() {
        // @ts-ignore
        const manifest = __non_webpack_require__(path.join(this._extensionPath, 'web', 'build', 'asset-manifest.json'));
        const mainScript = manifest['welcome.js'];
        const mainStyle = manifest['welcome.css'];

        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'web', 'build', mainScript));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'web', 'build', mainStyle));
        const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <title>React App</title>
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <meta http-equiv="Content-Security-Policy" content="default-src *; font-src ${
                this._panel?.webview.cspSource
            }; img-src vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-inline' https://www.google-analytics.com; style-src vscode-resource: 'unsafe-inline' http: https: data:;">
            <base href="${vscode.Uri.file(path.join(this._extensionPath, 'web', 'build')).with({
                scheme: 'vscode-resource',
            })}/">
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>

            <script type="text/javascript" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}
