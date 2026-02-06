#!/usr/bin/env node
export declare function runCommand(): {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
} | Promise<{
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
}>;
