// main script for the web html
(function () {
    const vscode = acquireVsCodeApi();
    const button = document.getElementById('buttonId');
    button.addEventListener('click', () => {
        vscode.postMessage({ type: 'run', value: "aaaaaaa" });
    });
})();