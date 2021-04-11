export class CopyState {
    constructor() {}

    private absolutePath: string | undefined;
    private isCutActive: boolean = false;

    public copy(absolutePath: string) {
        this.isCutActive = false;

        this.absolutePath = absolutePath;
    }

    public cut(absolutePath: string) {
        this.absolutePath = absolutePath;

        this.isCutActive = true;
    }

    public readClipboard(): any | undefined {
        if(!this.absolutePath) {
            return undefined;
        }

        if(!this.isCutActive) {
            return {
                "absolutePath": this.absolutePath,
                "wasCut": false
            };
        }

        let temporary = this.absolutePath;

        this.absolutePath = undefined;
        this.isCutActive = false;
        
        return {
            "absolutePath": temporary,
            "wasCut": true
        };
    }
}