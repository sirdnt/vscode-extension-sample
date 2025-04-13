import * as vscode from 'vscode';

export class ChartTreeDataProvider implements vscode.TreeDataProvider<ChartItem> {
    private items: ChartItem[] = [];
    constructor(private readonly context: vscode.ExtensionContext) {
        this.items = [
            new ChartItem('Chart 1', this.context, 'add'),
            new ChartItem('Chart 2', this.context, 'edit'),
            new ChartItem('Chart 3', this.context, 'trash'),
        ];
    }

    getTreeItem(element: ChartItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<ChartItem[]> {
        return Promise.resolve(this.items);
    }
}

class ChartItem extends vscode.TreeItem {
    constructor(label: string, context: vscode.ExtensionContext, icon: string, command?: string) {
        super(label);
        this.tooltip = `This is ${label}`;
        this.description = `Sample Chart`;
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.command = {
            command: command || 'my-first-extension.show',  // Command to show the chart
            title: 'Show Chart',
            arguments: [label]  // Pass the label as an argument to the command
        };
        // const iconFile = label.toLowerCase().replace(/\s/g, '') + '.svg'; // "Chart 1" → "chart1.svg"
        // this.iconPath = {
        //     light: vscode.Uri.joinPath(context.extensionUri, 'media', iconFile),
        //     dark: vscode.Uri.joinPath(context.extensionUri, 'media', iconFile)
        // };
        this.iconPath = new vscode.ThemeIcon(icon);
    }
}