export declare class Permission {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly resource: string;
    readonly action: string;
    constructor(id: string, name: string, description: string, resource: string, action: string);
    get canonical(): string;
    toJSON(): {
        id: string;
        name: string;
        description: string;
        canonical: string;
    };
}
