const inquirer = require('inquirer');

const inquirerPrompt = (argv) => {
    const { name } = argv || {};

    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input', // 提问的类型，常用的有： 输入框：input； 确认：confirm； 单选组：list；多选组：checkbox；
                name: 'name', // 存储当前问题答案的变量；
                message: 'template name', // 问题的描述；
                default: name, // 默认值；
                validate: val => { // 对用户的答案进行校验；
                    if (!/^[a-zA-Z]+$/.test(val)) {
                        return '模板名称只能含有英文';
                    }
                    if (!/^[A-Z]/.test(val)) {
                        return '模板名称首字母必须大写';
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'type',
                message: 'template type',
                choices: ['表单', '动态表单', '嵌套表单'], // 列表选项，在某些type下可用；
                filter: (value) => { // 对用户的答案进行过滤处理，返回处理后的值。
                    return {
                        '表单': 'form',
                        '动态表单': 'dynamicForm',
                        '嵌套表单': 'nestedForm',
                    }[value];
                },
            },
            {
                type: 'list',
                message: 'frame type',
                choices: ['react', 'vue'],
                name: 'frame',
            }
        ]).then(answers => {
            const { frame } = answers;
            if (frame === 'react') {
                inquirer.prompt([
                    {
                        type: 'list',
                        message: '使用什么UI组件库开发',
                        choices: ['Ant Design', 'x-render'],
                        name: 'library',
                    }
                ]).then(reactAnswers => {
                    resolve({
                        ...answers,
                        ...reactAnswers,
                    })
                }).catch(error => {
                    reject(error);
                })
            }

            if (frame === 'vue') {
                inquirer.prompt([
                    {
                        type: 'list',
                        message: '使用什么UI组件库开发',
                        choices: ['Element', 'iView'],
                        name: 'library',
                    }
                ]).then(vueAnswers => {
                    resolve({
                        ...answers,
                        ...vueAnswers,
                    })
                }).catch(error => {
                    reject(error);
                })
            }
        }).catch(error => {
            reject(error);
        })
    })
}

exports.inquirerPrompt = inquirerPrompt;