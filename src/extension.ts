// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChartViewProvider } from './views/ChartView';
import { ChartTreeDataProvider } from './views/ChartTreeView';
import { SideBarWebView } from './views/SideBarWebView';
import { RealTimeChartView } from './views/RealTimeChartView';


let helloWebview: vscode.WebviewPanel | undefined;
let realTimeChartView: RealTimeChartView | undefined;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "my-first-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('my-first-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from my-first-extension!');
	});

	const showWeb = vscode.commands.registerCommand('my-first-extension.show', (chartName: string) => {
		const column = vscode.ViewColumn.Beside;
		if (helloWebview) {
			helloWebview.reveal(column);
			console.log('Webview already exists, revealing it.');
			helloWebview.webview.html = getWebviewContent(chartName);
			return;
		}
		// Create and show a new webview panel
		helloWebview = vscode.window.createWebviewPanel(
			'helloWebview',
			'Hello Webview',
			column,
			{
				enableScripts: true
			}
		);

		helloWebview.webview.html = getWebviewContent(chartName);
		helloWebview.onDidDispose(() => {
			helloWebview = undefined;
		});
		helloWebview.onDidChangeViewState((e) => {
			if (helloWebview) {
				console.log('Webview state changed');
			}
		}
		);
		helloWebview.webview.onDidReceiveMessage((message) => {
			switch (message.command) {
				case 'alert':
					vscode.window.showInformationMessage(message.text);
					break;
				default:
					console.log('Unknown command');
			}
		}
		);
	});

	const refreshCommand = vscode.commands.registerCommand('my-first-extension.refresh', () => {
		vscode.window.showInformationMessage('Refresh command executed');
		if (realTimeChartView) {
			console.log('Refreshing real-time chart view');
			realTimeChartView.refresh();
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(showWeb);
	context.subscriptions.push(refreshCommand);

	const treeDataProvider = new ChartTreeDataProvider(context);
	vscode.window.registerTreeDataProvider('chartTreeViewer', treeDataProvider);

	realTimeChartView = new RealTimeChartView(context);
	vscode.window.registerWebviewViewProvider(
		'sideBarWebView',
		realTimeChartView
	);

	vscode.window.registerWebviewViewProvider(
		'chartSidebarView',
		new SideBarWebView(context)
	);

}

function getWebviewContent(chartName: string): string {
	return `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<title>Hello Webview</title>
	  </head>
	  <body>
		<h1>Hello from Webview 👋</h1>
		<h2>${chartName}</h2>
		<p>This is a simple Webview panel.</p>
	  </body>
	  </html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
