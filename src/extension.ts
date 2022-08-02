import * as vscode from 'vscode';
import OverviewProvider from './overviewProvider';
import { init as initI18n, localize } from 'vscode-nls-i18n';

export function activate(context: vscode.ExtensionContext) {
    initI18n(context.extensionPath);

    const overviewProvider = new OverviewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(OverviewProvider.viewType, overviewProvider, {
            webviewOptions: { retainContextWhenHidden: true },
        })
    );

    let disposable = vscode.commands.registerCommand('starter.welcome', () => {
        vscode.window.showInformationMessage(localize('welcomeMsg'));
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
