export interface Args {
    cmd?: string;
    project?: string;
    name?: string;
    tag?: string;
    port?: string;
}
export interface Package {
    name: string;
}
export default function (args: Args): Promise<{}>;
