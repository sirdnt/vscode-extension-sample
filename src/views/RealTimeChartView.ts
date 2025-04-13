import * as vscode from 'vscode';

export class RealTimeChartView implements vscode.WebviewViewProvider {

    private _view?: vscode.WebviewView;

    constructor(private context: vscode.ExtensionContext) {
        this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = getSidebarHtml(this.context, webviewView.webview);

        this._render();
    }

    public refresh() {
        this._view?.webview.postMessage({ type: 'refresh', time: new Date().toISOString() });
    }

    private _render() {
        if (!this._view) { return; }

        const webview = this._view.webview;

        this._view.webview.html = getSidebarHtml(this.context, webview);

        webview.onDidReceiveMessage(message => {
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
<!DOCTYPE html>
<html>

<head>
    <title>Real-Time Temperature Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <style>
        #update-indicator {
            font-family: sans-serif;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dot {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            display: inline-block;
        }

        /* Blinking: listening */
        .dot.listening {
            background-color: rgb(185, 139, 11);
            animation: blinking 1s infinite ease-in-out;
        }

        @keyframes blinking {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.3;
            }
        }

        /* Flash green: data received */
        .dot.flash {
            background-color: limegreen !important;
            animation: none;
            /* stop blinking */
            opacity: 1;
        }
    </style>
</head>

<body>
    <h3>🌡️ Real-Time Celsius Chart <span class="dot listening"></span></h3>
    <canvas id="realtimeChart" width="600" height="400"></canvas>

    <script>
        const ctx = document.getElementById('realtimeChart').getContext('2d');

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // times
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'yellow',
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        const dot = document.querySelector('.dot');
        function flashGreen() {
            dot.classList.remove('listening');
            dot.classList.add('flash');

            setTimeout(() => {
                dot.classList.remove('flash');
                dot.classList.add('listening');
            }, 500);
        }

        const socket = io("http://localhost:3000");

        socket.on('temperature', ({ temp, time }) => {
            flashGreen(); // blink green on new data
            if (chart.data.labels.length > 20) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }

            chart.data.labels.push(time);
            chart.data.datasets[0].data.push(temp);
            chart.update();
        });

        window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'refresh') {
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            chart.update();
            console.log('Chart refreshed at ' + message.time);
        }
        });
        
    </script>
</body>

</html>
    `;
}