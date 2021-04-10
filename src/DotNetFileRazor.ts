import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';

export class DotNetFileRazor extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        let createdFile = new DotNetFileRazor(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
        
        if(!parent) {
            return createdFile;
        }

        let fosteredChild: DotNetFile | undefined = await parent.tryFosterChild(`${filename}.cs`);

        if(!fosteredChild) {
            return createdFile;
        }

        let createdFilesChildren: DotNetFile[] = await createdFile.getChildren();

        createdFilesChildren.push(fosteredChild);

        return createdFile;
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];
            return Promise.resolve(this.children);
        }
    }
}
