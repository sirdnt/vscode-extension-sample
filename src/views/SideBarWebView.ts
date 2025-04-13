import * as vscode from 'vscode';

export class SideBarWebView implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) {
        this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = getSidebarHtml(this.context, webviewView.webview);

        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'run':
                    vscode.window.showInformationMessage(`You clicked ${message.value}`);
                    console.log(`You clicked ${message.value}`);
                    break;
            }
        });
    }
}

function getSidebarHtml(context: vscode.ExtensionContext, webview: vscode.Webview): string {
    const scriptPathOnDisk = webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js')
    );
    console.log(`scriptPathOnDisk: ${scriptPathOnDisk}`);

    return `
      <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    padding: 10px;
                }

                .container {
                    border: 1px solid var(--vscode-editorWidget-border);
                    padding: 1em;
                    border-radius: 6px;
                    background-color: var(--vscode-editorWidget-background);
                }

                button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 0.5em 1em;
                    cursor: pointer;
                }

                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
            </style>
        </head>
        <body>
          <h2>Log chart</h2>
          <canvas id="myChart" width="200" height="200"></canvas>
          <div>
            <button id="buttonId">Click me</button>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
            const ctx = document.getElementById('myChart');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['A', 'B', 'C'],
                datasets: [{
                  label: 'Demo',
                  data: [10, 20, 30],
                  backgroundColor: 'steelblue'
                }]
              }
            });
          </script>
          <script src="${scriptPathOnDisk}"></script>
        </body>
      </html>
    `;
}