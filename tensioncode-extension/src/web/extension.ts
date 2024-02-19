import * as vscode from 'vscode';
import { TestView } from './testView';

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "tensioncode" is now active in the web extension host!'
    );

    let promptInputBox = vscode.commands.registerCommand(
        'tensioncode.testCommand',
        async () => {
            const result = await vscode.window.showInputBox({
                value: 'Generate code for: ',
                valueSelection: [19, 19],
                placeHolder: 'Enter your request',
            });
            vscode.window.showInformationMessage(`Got: ${result}`);
        }
    );

    let statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        0
    );
    statusBarItem.text = 'TensionCode';
    statusBarItem.show();

    context.subscriptions.push(
        vscode.commands.registerCommand('tensioncode.start', () => {
            const panel = vscode.window.createWebviewPanel(
                'webview',
                'TenionCode Webview',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                }
            );

            panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body style="height:100vh;">
                <iframe src="http://localhost:3000" width="100%" height="100%" />
            </body>
            </html>`;
        })
    );

    context.subscriptions.push(promptInputBox);
    context.subscriptions.push(statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() {}
