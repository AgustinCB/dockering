import { Option } from 'npm-monads';
export interface Instruction {
    toString: () => string;
}
export interface Label {
    key: string;
    value: string;
}
export interface Env {
    key: string;
    value: string;
}
export declare class From implements Instruction {
    image: string;
    name: Option<string>;
    constructor(image: string, name?: Option<string>);
    toString(): string;
}
export declare class Arg implements Instruction {
    key: string;
    value: Option<string>;
    constructor(key: string, value?: Option<string>);
    toString(): string;
}
export declare class Run implements Instruction {
    command: string | Array<string>;
    constructor(command: string | Array<string>);
    toString(): string;
}
export declare class Cmd implements Instruction {
    command: string | Array<string>;
    constructor(command: string | Array<string>);
    toString(): string;
}
export declare class Labels implements Instruction {
    labels: Array<Label>;
    constructor(labels: Array<Label>);
    toString(): string;
}
export declare class Expose implements Instruction {
    ports: Array<number>;
    constructor(ports: Array<number>);
    toString(): string;
}
export declare class Envs implements Instruction {
    envs: Array<Env>;
    constructor(envs: Array<Env>);
    toString(): string;
}
export declare class Add implements Instruction {
    srcs: Array<string>;
    dst: string;
    constructor(srcs: Array<string>, dst: string);
    toString(): string;
}
export declare class Copy implements Instruction {
    srcs: Array<string>;
    dst: string;
    constructor(srcs: Array<string>, dst: string);
    toString(): string;
}
export declare class Entrypoint implements Instruction {
    command: string | Array<string>;
    constructor(command: string | Array<string>);
    toString(): string;
}
export declare class Volume implements Instruction {
    volumes: Array<string>;
    constructor(volumes: Array<string>);
    toString(): string;
}
export declare class User implements Instruction {
    user: string;
    constructor(user: string);
    toString(): string;
}
export declare class Workdir implements Instruction {
    path: string;
    constructor(path: string);
    toString(): string;
}
export declare class Onbuild implements Instruction {
    instruction: Instruction;
    constructor(instruction: Instruction);
    toString(): string;
}
export declare class Stopsignal implements Instruction {
    signal: string;
    constructor(signal: string);
    toString(): string;
}
export interface HealthcheckOptions {
    options: Array<string>;
    instruction: Cmd;
}
export declare class Healthcheck implements Instruction {
    options: Option<HealthcheckOptions>;
    constructor(options: Option<HealthcheckOptions>);
    toString(): string;
}
export declare class Shell implements Instruction {
    cmd: Array<string>;
    constructor(cmd: Array<string>);
    toString(): string;
}
