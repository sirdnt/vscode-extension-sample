import * as vscode from 'vscode';

export class ChartViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly context: vscode.ExtensionContext) {}
  
    resolveWebviewView(
      view: vscode.WebviewView,
      _context: vscode.WebviewViewResolveContext,
      _token: vscode.CancellationToken
    ) {
      view.webview.options = {
        enableScripts: true
      };
  
      view.webview.html = this.getHtml(view.webview);
    }
  
    private getHtml(webview: vscode.Webview): string {
      const chartJsUri = webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, 'media', 'chart.min.js')
      );
  
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
            canvas { width: 100%; height: 100%; }
            button { padding: 10px; margin: 20px; background-color: #007ACC; color: white; border: none; border-radius: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          <canvas id="chart"></canvas>
          <div>
            <button id="buttonId">Click me</button>
          </div>
          <script src="${chartJsUri}"></script>
          <script>
            new Chart(document.getElementById('chart').getContext('2d'), {
              type: 'bar',
              data: {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [{
                  label: 'Demo',
                  data: [12, 19, 3, 5],
                  backgroundColor: ['red', 'blue', 'green', 'orange']
                }]
              }
            });
          </script>
        </body>
        </html>
      `;
    }
  }