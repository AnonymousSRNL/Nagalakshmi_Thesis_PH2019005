#!/usr/bin/env node
const { Fuzzer } = require('./fuzzer');
const yargs = require('yargs');

function startFuzzer(argv) {
    const fuzzer = new Fuzzer(
        argv.target,
        argv.dir,
        argv.exactArtifactPath,
        argv.rssLimitMb,
        argv.timeout,
        argv.regression,
        argv.onlyAscii
    );
    fuzzer.start();
}

yargs
    .scriptName("jsfuzz")
    .command('$0 <target> [dir..]', 'start the fuzzer', (yargs) => {
        yargs.positional('target', {
            describe: 'Path to file containing the fuzz target function',
            type: 'string'
        });
        yargs.positional('dir', {
            describe: `Pass zero or more corpus directories as command line arguments. The fuzzer will read test inputs from each of these corpus directories, and any new test inputs that are generated will be written back to the first corpus directory. Single files can be passed as well and will be used as seed files.`,
            type: 'string'
        });
    }, (argv) => startFuzzer(argv))
    .option('regression', {
        type: 'boolean',
        description: 'Run the fuzzer through set of files for regression or reproduction',
        default: false
    })
    .option('exact-artifact-path', {
        type: 'string',
        description: 'Set exact artifact path for crashes/ooms'
    })
    .option('rss-limit-mb', {
        type: 'number',
        description: 'Memory usage limit in MB',
        default: 2048,
    })
    .option('timeout', {
        type: 'number',
        description: 'If input takes longer than this timeout (in seconds), the process is treated as a failure case',
        default: 30,
    })
    .option('worker', {
        type: 'boolean',
        description: 'Run fuzzing worker',
        default: false,
        hidden: true
    })
    .option('only-ascii', {
        type: 'boolean',
        description: 'Generate only ASCII (isprint+isspace) inputs',
        default: false,
    })
    .help()
    .argv;
