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

    new TestView(context);

    context.subscriptions.push(promptInputBox);
    context.subscriptions.push(statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() {}
