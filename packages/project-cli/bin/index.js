#!/usr/bin/env node
const yargs = require('yargs');
const { inquirerPrompt } = require('./inquirer');

console.log('name', yargs.argv.name);

yargs.command(
    ['create', 'c'], // cmd：字符串，子命令名称，也可以传递数组，如 ['create', 'c']，表示子命令叫 create，其别名是 c；
    'create a template', // desc：字符串，子命令描述信息；
    (yargs) => { // builder：一个返回数组的函数，子命令参数信息配置，可以设置参数
        return yargs.option('name', {
            alias: 'n', // 别名；
            demand: true, // 是否必填
            description: 'template name', // 描述信息
            type: 'string', // 参数类型 string | boolean | number
        })
    },
    (argv) => { // handler: 函数，可以在这个函数中专门处理该子命令参数
        console.log('argv', argv);
        inquirerPrompt(argv).then(answers => {
            console.log(answers);
        })
    }
).argv;