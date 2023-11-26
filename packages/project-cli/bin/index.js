#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const { inquirerPrompt } = require('./inquirer');
const { copyDir, checkMkdirExists, copyFile, copyTemplate } = require('./copy');
const { install } = require('./manager');

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
            const { name, type } = answers;
            // process.cwd() 当前 Node.js 进程执行时的文件所属目录的绝对路径，
            // const isMkdirExists = checkMkdirExists(path.resolve(process.cwd(), `./src/pages/${name}`));
            const isMkdirExists = checkMkdirExists(path.resolve(process.cwd(), `./src/pages/${name}/index.js`));
            if (isMkdirExists) {
                // console.log(`${name}文件夹已存在`);
                console.log(`${name}/index.js文件已存在`);
            } else {
                // 拷贝文件夹
                // copyDir(
                //     //  __dirname 是用来动态获取当前文件模块所属目录的绝对路径
                //     // 对应路径：...demo-cli/packages/project-cli/bin/template/${type}
                //     path.resolve(__dirname, `template/${type}`),
                //     // 对应路径：...demo-cli/examples/app/src/pages/${name}
                //     path.resolve(process.cwd(), `./src/pages/${name}`)
                // )
                // 拷贝文件：copyFile 和 copyDir 使用的区别在参数，copyFile 要求参数 from 和参数 to 都精确到文件路径
                // copyFile(
                //     path.resolve(__dirname, `template/${type}/index.js`),
                //     path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                // )
                // 拷贝模板文件，自定义模板内容标题
                copyTemplate(
                    path.resolve(__dirname, `template/${type}/index.tpl`),
                    path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                    { name },
                );
                install(process.cwd(), answers);
            }
        })
    }
).argv;