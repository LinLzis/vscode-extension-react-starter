import * as vscode from 'vscode';
import OverviewProvider from './overviewProvider';
import { init as initI18n, localize } from 'vscode-nls-i18n';
import WelcomePanel from './welcomePanel';

export function activate(context: vscode.ExtensionContext) {
    initI18n(context.extensionPath);

    const overviewProvider = new OverviewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(OverviewProvider.viewType, overviewProvider, {
            webviewOptions: { retainContextWhenHidden: true },
        })
    );

	context.subscriptions.push(
        vscode.commands.registerCommand('starter.web', () => {
            WelcomePanel.createOrShow(context.extensionPath);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('starter.welcome', () => {
            vscode.window.showInformationMessage(localize('welcomeMsg'));
        })
    );
}

export function deactivate() {}
