import * as vscode from 'vscode';
import * as path from 'path';
import { RpcExtension } from '@sap-devx/webview-rpc/out.ext/rpc-extension';
import { FuncObject, getNonce } from './common';

export default class OverviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'starter.overview';

    private _view?: vscode.WebviewView;
    private _rpc?: RpcExtension;

    constructor(private readonly _context: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this._view = webviewView;
        this._rpc = new RpcExtension(webviewView.webview);

        webviewView.webview.options = { enableScripts: true };

        webviewView.webview.html = this._getHtmlForWebview();

        for (const key of Object.keys(this.funcHander)) {
            this._rpc.registerMethod({ func: this.funcHander[key], name: key });
        }
    }

    private funcHander: FuncObject = {
        getVscodeEnv: () => {
            return vscode.env.language;
        },
        openWebLink: (link: string) => {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(link));
        },
        showAlert: (type: 'info' | 'error', msg: string) => {
            if (type === 'info') {
                vscode.window.showInformationMessage(msg);
            } else {
                vscode.window.showErrorMessage(msg);
            }
        },
        testCallView: () => {
            const message = 'just test';
            this._rpc?.invoke('testMessage', [message]);
        },
    };

    private _getHtmlForWebview() {
        // @ts-ignore
        const manifest = __non_webpack_require__(
            path.join(this._context.extensionPath, 'web', 'build', 'asset-manifest.json')
        );
        const mainScript = manifest.files['main.js'];
        const mainStyle = manifest.files['main.css'];

        const scriptPathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'web', 'build', mainScript));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const stylePathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'web', 'build', mainStyle));
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
                this._view?.webview.cspSource
            }; img-src vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-inline' https://www.google-analytics.com; style-src vscode-resource: 'unsafe-inline' http: https: data:;">
            <base href="${vscode.Uri.file(path.join(this._context.extensionPath, 'web', 'build')).with({
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
