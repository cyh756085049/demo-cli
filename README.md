# 搭建一个 `monorepo` 风格的脚手架工程

## `Monorepo` 了解

### `Monorepo` 介绍

`Monorepo` 是一种项目代码管理方式，指单个仓库中管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。

### `Monorepo` 演进

单仓库巨石应用【Monolith】 -> 多仓库多模块应用【MultiRepo】 -> 单仓库多模块应用【MonoRepo】

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14ba61eb924c4411bc4ff102f8f3f530~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

### `Monorepo` 优劣

![image-20231125170204741](https://p.ipic.vip/k7o5s2.png)

## 基础脚手架项目工程

如果你熟悉 `react/vue`， 那肯定了解 `react-cli/vue-cli` 脚手架，我们可以直接运行 `create-react-app 项目名称 / vue create 项目名称`  命令快速创建一个 `react/vue` 项目工程。

但运行以上脚手架命令快速创建命令之前，需要先使用命令 `npm install -g create-react-app/npm install -g vue-cli` 安装 `react-cli/vue-cli` 脚手架。如果没有安装直接使用脚手架命令创建就会报错无法找到 `create-react-app/vue` 命令。由此可见 `create-react-app/vue` 不是系统命令， 它只是 `react-cli/vue-cli` 脚手架声明的一个命令。

### 初始化

```bash
mkdir demo-cli # 创建一个脚手架项目文件夹
cd demo-cli # 进入到创建的脚手架项目文件夹中
git init # 初始化一个新的Git仓库
npm init # 初始化脚手架工程项目
```

初始化项目运行成功后，会在该文件夹中生成一个 `pakeage.json` 文件，我们在该文件中添加 `bin` 字段来声明一个命令，添加后的代码如下所示：

```diff
{
  "name": "demo-cli",
  "version": "1.0.0",
  "description": "测试脚手架项目",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "cyh756085049"
  },
  "author": "Ramona Chen",
  "license": "ISC",
+ "bin": {
+		"create-demo-app": "./bin/index.js"
+	}  
}
```

这样我们就声明了一个 `create-demo-app` 的命令，另外 `./bin/index.js` 是运行 `create-demo-app` 命令后会运行的 `js` 文件的相对路径。

所以接下来我们需要在项目文件夹下，创建一个 `bin` 文件夹，在 `bin` 文件夹中创建一个 `index.js` 文件，并在文件中添加如下代码：

```js
#!/usr/bin/env node
console.log('welcome to create demo app');
```

这样就完成了一个最基础的脚手架工程，接下来在命令行窗口输入 `create-demo-app` 命令，运行该命令，会发现报错信息如下：

![image-20231125181447123](https://p.ipic.vip/7krddy.png)

```bash
  ~/L/Mo/com~apple~CloudDocs/github.com/demo-cli  main ?1 
❯ create-demo-app                                              
zsh: command not found: create-demo-app
```

但如果把这个脚手架发布到 `npm` 上，由于脚手架项目 `create-demo-app/pakeage.json`  中 `name` 的值为 `demo-cli`，当我们运行 `npm install -g demo-cli` 将脚手架安装到本地后，再运行 `create-demo-app` 命令，就会发现运行成功。

在实际开发脚手架过程中不可能这么做，所以我们还要实现本地调试脚手架的能力，实现起来也非常简单，一个命令搞定。

### 本地调试脚手架

这个命令就是 `npm link`，输入 `npm link` 命令运行后，再输入 `create-demo-app` 命令，回车运行，看到的结果如下图所示。

![image-20231125183929044](https://p.ipic.vip/zv0prh.png)

到此，我们成功的声明了一个 `create-demo-app` 脚手架创建命令。

### npm link 的弊端

我们在本地有多个版本的脚手架仓库，当我们已经在仓库B的脚手架工程中运行 `npm link`，在仓库A中修改代码后，运行 `create-demo-app` 命令后，发现更改的代码不生效。这是因为我们在运行命令后执行仓库B中的代码。因此需要先在仓库B的脚手架工程中运行 `npm unlink` 后，然后在仓库A中的脚手架工程中运行 `npm link` 后，修改仓库A中的代码才能生效。

为了解决这个弊端，我们使用 `pnpm` 来搭建 `monorepo` 风格的脚手架工程。

在 `monorepo` 风格的工程中可以含有多个子工程，且每个子工程都可以独立编译打包后将产物发成 `npm` 包，故又称 `monorepo` 为多包工程。

由于脚手架发布到 `npm` 上的包名为 `demo-cli` ，首先修改调试子工程的 `package.json` 文件中的代码，代码修改部分如下所示：

## `monorepo` 风格的脚手架工程

接下来开始使用 **pnpm** 搭建 **monorepo** 风格的脚手架工程，首先安装 **pnpm** 。

```bash
npm install -g pnpm # 通过 npm 安装 pnpm
```

> [pnpm 安装文档](https://www.pnpm.cn/installation)

### 项目初始化

```bash
mkdir demo-cli # 创建一个脚手架项目文件夹
cd demo-cli # 进入到创建的脚手架项目文件夹中
git init # 初始化一个新的Git仓库
pnpm init # 初始化脚手架工程项目
```

`pnpm` 是使用 `workspace` (工作空间) 来搭建一个 `monorepo` 风格的工程，所以我们要在项目根目录下创建一个 `pnpm-workspace.yaml` 工作空间配置文件，并在文件中添加如下配置代码：

```yaml
packages:
- 'packages/*'
- 'examples/*'
```

配置后，声明了 `packages` 和 `examples` 文件夹中子工程是同属一个工作空间的，工作空间中的子工程编译打包的产物都可以被其它子工程引用。同时需要创建配置文件中设置的 `packages` 文件夹和 `examples` 文件夹。

### `pacakges` 工程

在 `packages` 文件夹下新建 `project-cli` 文件夹，作为脚手架工程，在该文件夹下再通过 `pnpm init` 初始化，执行成功后，会在该文件夹下生成一个 `package.json` 文件。

```bash
mkdir project-cli
pnpm init
```

我们在 `pakeage.json` 中添加 `bin` 字段，来声明 `create-project` 命令，添加后的代码如下所示:

```diff
{
  "name": "project-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
+  "bin": {
+    "create-project": "./bin/index.js"
+  }
}
```

在 `packages/project-cli` 文件夹中新建 `bin` 文件夹，在 `bin` 文件夹中新建 `index.js` 文件，用于存放声明命令执行的信息。

```js
#!/usr/bin/env node
console.log('welcome to create project');
```

### `examples` 工程

在 `examples` 文件夹中新建 `app` 文件夹，并在该文件夹下运行 `pnpm init` 命令来初始化一个工程，运行成功后，会在该文件夹中生成一个 `pakeage.json` 文件。

```bash
mkdir app
pnpm init
```

我们在 `pakeage.json` 中添加 `dependencies` 字段，来添加 `project-cli` 依赖。再给 `scripts` 增加一条自定义脚本命令。添加后的代码如下所示：

```diff
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
+    "start": "create-project"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
+  "dependencies": {
+    "project-cli": "workspace:*"
+  }
}
```

然后在最外层根目录 `demo-cli` 文件夹下运行 `pnpm i` 命令，安装依赖。安装成功后，在 `app` 文件夹目录下运行 `pnpm start`，会发现命令行窗口打印出 `Welcome to Mortal World`，此时最基础的 `monorepo` 风格的脚手架工程搭建完成。

```bash
# demo-cli/examples/app
> pnpm start                                                       

> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project

welcome to create project
```

此时整个工程的目录结构如下所示:

```js
|-- demo-cli
      |-- package.json
      |-- pnpm-lock.yaml
      |-- pnpm-workspace.yaml
      |-- examples
      |   |-- app
      |       |-- package.json
      |-- packages
          |-- project-cli
              |-- package.json
              |-- bin
                  |-- index.js
```

## 脚手架必备模块

### 命令参数模块

`Node.js` 中的 `process` 模块提供了当前 `Node.js` 进程相关的全局环境信息，比如命令参数、环境变量、命令运行路径等等。

```js
const process = require('process');

// 获取命令参数
console.log(process.argv);
```

脚手架提供的命令后面还可以设置参数，标准的脚手架命令参数需要支持两种格式，比如：

```bash
$ create-project --name=commonPage
$ create-project --name commonPage
```

如果通过 `process.argv` 来获取，要额外处理两种不同的命令参数格式，不方便。可以使用 `yargs` 开源库来解析命令参数。运行以下命令安装 `yargs` ：

```bash
$ pnpm add yargs --F project-cli # 将指定依赖安装到 project-cli 子工程中
```

>  `--F project-cli` 是取 `project-cli` 子工程中 `package.json` 中 `name` 字段的值，而不是 `project-cli` 子工程文件夹的名称。

#### 获取命令参数

在 `project-cli/bin/index.js` 中添加如下代码：

```js
#!/usr/bin/env node
const yargs = require('yargs');

console.log('name', yargs.argv.name);
```

在 `app` 文件目录下运行命令：

```bash
$ pnpm start --name commonPage
```

结果显示如下：

```bash
❯ pnpm start --name commonPage                             

> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project "--name" "commonPage"

name commonPage
```

#### 设置子命令

如果脚手架要对外提供多个功能，不能将所有的功能都集中在命令中实现，可以通过 `yargs` 提供的 `command` 方法来设置一些子命令，让每个子命令对应各自功能，各司其职。

接下来设置一个用来生成一个模板的子命令，在 `bin/index.js` 中修改代码：

```js
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
    }
).argv;
```

在 `app` 文件目录下运行命令：

```bash
$ pnpm start create --name commonPage # 或者 pnpm start c --name commonPage
```

结果显示如下：

```bash
>pnpm start create --name commonPage                                

> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project "create" "--name" "commonPage"

name commonPage
argv {
  _: [ 'create' ],
  name: 'commonPage',
  n: 'commonPage',
  '$0': 'node_modules/project-cli/bin/index.js'
}
```

如果我们输入的命令参数有误，则会在窗口中显示这些参数信息，示例如下：

```bash
❯ pnpm start create commonPage                                     
> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project "create" "commonPage"

name undefined
index.js create

create a template

选项：
      --help     显示帮助信息                                        		[布尔]
      --version  显示版本号                                            [布尔]
  -n, --name     template name                               	[字符串] [必需]

缺少必须的选项：name
 ELIFECYCLE  Command failed with exit code 1.
```

### 用户交互模块

比如我们在运行 `npm init`，通过询问式的交互完成 `package.json` 文件内容的填充，交互方式比较友好，那我们可以使用 `inquirer` 开源库来实现询问式交互。

安装：

```bash
$ pnpm add inquirer@8.2.5 --F project-cli
```

比如我们创建一个模板文件，大概会询问用户：模板文件名称、模板类型、使用什么框架开发、使用框架对应的哪个组件库开发等等。下面我们来实现这个功能。在 `bin` 文件夹中新建 `inquirer.js` 文件夹，在里面添加如下代码：

```js
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
```

其中 `inquirer.prompt()` 返回的是一个 `Promise`，我们可以用 `then` 获取上个询问的答案，根据答案再发起对应的内容。

在 `bin/index.js` 中引入 `inquirer.js` 中的 `inquirerPrompt`。

```js
#!/usr/bin/env node
const yargs = require('yargs');
const { inquirerPrompt } = require('./inquirer');
// import { inquirerPrompt } from "./inquirer";

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
```

在 `app` 文件目录下运行命令：

```bash
$ pnpm start create --name CommonPage
```

执行结果如下：

```bash
❯ pnpm start create --name CommonPage                                2.52G 😅

> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project "create" "--name" "CommonPage"

name CommonPage
argv {
  _: [ 'create' ],
  name: 'CommonPage',
  n: 'CommonPage',
  '$0': 'node_modules/project-cli/bin/index.js'
}
? template name CommonPage
? template type 表单
? frame type react
? 使用什么UI组件库开发 Ant Design
{
  name: 'CommonPage',
  type: 'form',
  frame: 'react',
  library: 'Ant Design'
}
```

### 文件(夹)拷贝模块

要生成一个模板文件，最简单的做法就是执行脚手架提供的命令后，把脚手架中的模板文件，拷贝到对应的地方。模板文件可以是单个文件，也可以是一个文件夹。

在 `Node.js` 中拷贝文件夹并不简单，需要用到递归，这里推荐使用开源库 `copy-dir` 来实现拷贝文件。

安装 `copy-dir` :

```bash
$ pnpm add copy-dir --F project-cli
```

在 `bin` 文件夹中新建 `copy.js` 文件，在里面添加如下代码：

```js
const copydir = require('copy-dir');
const fs = require('fs');
const path = require('path');

/**
 * 拷贝文件夹
 * @param {string} from 要拷贝文件的路径
 * @param {string} to 把文件拷贝到目标位置的路径
 * @param {*} options 
 */
const copyDir = (from, to, options) => {
  mkdirGuard(to);
  copydir.sync(from, to, options);
}

// 判断文件夹是否存在
const checkMkdirExists = (path) => {
  return fs.existsSync(path);
}

// 创建不存在的目录文件夹
const mkdirGuard = (target) => {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (error) { // 要创建的目录 target 父级目录不存在时
    mkdirp(target); // 递归创建父级目录
    const mkdirp = (dir) => {
      if (fs.existsSync(dir)) {
        return true;
      }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

/**
 * 拷贝文件
 * @param {string} from 要拷贝文件的路径
 * @param {string} to 把文件拷贝到目标位置的路径
 */
const copyFile = (from ,to) => {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);
  mkdirGuard(parentPath);
  fs.writeFileSync(to, buffer);
}

exports.copyDir = copyDir;
exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.copyFile = copyFile;
```

接下来在 `bin` 文件夹中新建 `template` 文件夹，用来存放模板文件，比如在 `template` 文件夹中创建一个 `form` 文件夹来存放表单模板，我们随意在 `form` 文件夹中创建一个 `index.js`，在里面随便写些内容。其目录结构如下所示：

```js
|-- demo-cli
      |-- package.json
      |-- pnpm-lock.yaml
      |-- pnpm-workspace.yaml
      |-- examples
      |   |-- app
      |       |-- package.json
      |-- packages
          |-- project-cli
              |-- package.json
              |-- bin
                  |-- template
                      |-- form
                          |-- index.js
                  |-- copy.js
                  |-- index.js
                  |-- inquirer.js
```

下面来实现把 `packages/mortal/bin/template/form` 这个文件夹拷贝到 `examples/app/src/pages/OrderPage` 中 。

在 `bin/index.js` 修改代码，修改后的代码如下所示：

```js
#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const { inquirerPrompt } = require('./inquirer');
const { copyDir, checkMkdirExists } = require('./copy');

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
            const isMkdirExists = checkMkdirExists(path.resolve(process.cwd(), `./src/pages/${name}`));
            if (isMkdirExists) {
                console.log(`${name}文件夹已存在`);
            } else {
               // copyDir(
                    //  __dirname 是用来动态获取当前文件模块所属目录的绝对路径
                    // 对应路径：...demo-cli/packages/project-cli/bin/template/${type}
                //    path.resolve(__dirname, `template/${type}`),
                    // 对应路径：...demo-cli/examples/app/src/pages/${name}
                 //   path.resolve(process.cwd(), `./src/pages/${name}`)
                //)
              	// 拷贝文件：copyFile 和 copyDir 使用的区别在参数，copyFile 要求参数 from 和参数 to 都精确到文件路径
                copyFile(
                    path.resolve(__dirname, `template/${type}/index.js`),
                    path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                )
            }
        })
    }
).argv;
```

在 `app` 文件夹目录下运行命令： 

```bash
$ pnpm start create --name CommonPage
```

执行完成后，再次执行会进行如下提示，说明文件夹已拷贝成功。

```bash
❯ pnpm start create --name CommonPage                            

> app@1.0.0 start /Users/cyh/Library/Mobile Documents/com~apple~CloudDocs/github.com/demo-cli/examples/app
> create-project "create" "--name" "CommonPage"

name CommonPage
argv {
  _: [ 'create' ],
  name: 'CommonPage',
  n: 'CommonPage',
  '$0': 'node_modules/project-cli/bin/index.js'
}
? template name CommonPage
? template type 表单
? frame type react
? 使用什么UI组件库开发 Ant Design
{
  name: 'CommonPage',
  type: 'form',
  frame: 'react',
  library: 'Ant Design'
}
CommonPage文件夹已存在
```

### 动态文件生成模块

假设脚手架中提供的模板文件中某些信息需要根据用户输入的命令参数来动态生成对应的模板文件。

比如下面模板文件中 `App` 要动态替换成用户输入的命令参数 `name` 的值，该如何实现呢？这里推荐使用开源库`mustache` 来实现。

`mustache` 安装：

```bash
$ pnpm add mustache --F project-cli
```

我们在 `packages/mortal-cli/bin/template/form` 文件夹中创建一个 `index.tpl` 文件，内容如下：

```js
import React from 'react';
const {{name}} = () => {
  return (
    <div></div>
  );
};

export default {{name}};
```

在 `bin/copy.js` 文件，创建 `readTemplate` 方法读取 `index.tpl` 动态模板文件内容， 创建 `copyTemplate` 方法 拷贝模板文件内容，如下代码：

```js
const fs = require('fs');
const Mustache = require('mustache');

/**
 * 获取动态模板内容
 * @param {string} path 动态模板文件的相对路径
 * @param {*} data 动态模板文件的配置数据
 * @returns 
 */
const readTemplate = (path, data = {}) => {
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return Mustache.render(str, data);
}

/**
 * 拷贝模板文件内容
 * @param {string} from 
 * @param {string} to 
 * @param {*} data 
 * @returns 
 */
const copyTemplate = (from, to, data = {}) => {
  // path.extname(from) 返回文件扩展名
  if (path.extname(from) !== '.tpl') {
    return copyFile(from, to);
  }
  const parentToPath = path.dirname(to);
  mkdirGuard(parentToPath);
  fs.writeFileSync(to, readTemplate(from, data));
}

exports.readTemplate = readTemplate;
exports.copyTemplate = copyTemplate;
```

最后在 `bin/index.js` 中修改代码如下：

```js
#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const { inquirerPrompt } = require('./inquirer');
const { copyDir, checkMkdirExists, copyFile, copyTemplate } = require('./copy');

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
            const isMkdirExists = checkMkdirExists(path.resolve(process.cwd(), `./src/pages/${name}/index.js`));
            if (isMkdirExists) {
                console.log(`${name}/index.js文件已存在`);
            } else {
                // 拷贝模板文件，自定义模板内容标题
                copyTemplate(
                    path.resolve(__dirname, `template/${type}/index.tpl`),
                    path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                    { name },
                )
            }
        })
    }
).argv;
```

在 `app` 文件夹目录下运行命令： 

```bash
$ pnpm start create --name CommonPage
```

执行完成后，在 `app/src/pages/CommonPage/index.js` 的内容如下，自定义模板内容成功。

```js 
import React from 'react';
const CommonPage = () => {
  return (
    <div></div>
  );
};

export default CommonPage;
```

### 自动安装依赖模块

假设模板是这样的：

```js
import React from 'react';
import { Button, Form, Input } from 'antd';

const App = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  return (
    <Form onFinish={onFinish} autoComplete="off">
      <Form.Item label="Username" name="username">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};
export default App;
```

可以看到模板中使用了 `react` 和 `antd` 这两个第三方依赖，假如使用模板的工程中没有安装这两个依赖，我们要实现在生成模板过程中就自动安装这两个依赖。

我们可以使用 `Node` 中 `child_process` 子进程这个模块来实现。

在 `bin` 文件夹中新建 `manager` 文件夹，在里面添加如下代码：

```js
const path = require('path');
const { exec } = require('child_process');

const LibraryMap = {
  'Ant Design': 'antd',
  'iView': 'view-ui-plus',
  'Ant Design Vue': 'ant-design-vue',
  'Element': 'element-plus',
};

/**
 * 自动安装模板依赖
 * @param {string} cmdPath 所安装依赖工程的 package.json 文件路径
 * @param {*} options 用户询问交互选择信息
 */
const install = (cmdPath, options) => {
  const { frame, library } = options || {};
  const command = `pnpm add ${frame} && pnpm add ${LibraryMap[library]}`;
  return new Promise((resolve, reject) => {
    exec(
      // pnpm 安装依赖命令，安装多个依赖时使用 && 拼接
      command,
      {
        // 所安装依赖工程的 package.json 文件路径
        cwd: path.resolve(cmdPath),
      },
      (error, stdout, stderr) => {
        console.log('error', error, 'stdout', stdout, 'stderr', stderr);
      }
    )
  })
}

exports.install = install;
```

接下来使用，在 `bin/index.js` 修改代码，修改后的代码如下所示：

```js
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
            const isMkdirExists = checkMkdirExists(path.resolve(process.cwd(), `./src/pages/${name}/index.js`));
            if (isMkdirExists) {
                console.log(`${name}/index.js文件已存在`);
            } else {
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
```

在 `app` 文件夹目录下运行命令： 

```bash
$ pnpm start create --name CommonPage
```

执行完成后，观察 `examples/app/package.json` 文件中的 `dependencies` 值是不是添加了 `antd` 和 `react` 依赖。

![image-20231126155843519](https://p.ipic.vip/2guk84.png)

此外，我们在执行命令中会发现，如下图所示的现象，光标一直在闪烁，好像卡住了，其中是依赖在安装。这里我们要引入一个加载动画，来解决这个不友好的现象。这里推荐使用开源库 `ora` 来实现加载动画,先安装 `ora` ：

```bash
$ pnpm add ora@5.4.1 --F project-cli
```

然后在 `bin/manager.js` 中修改代码：

```diff
const path = require('path');
const { exec } = require('child_process');
+const ora = require('ora');

const LibraryMap = {
  'Ant Design': 'antd',
  'iView': 'view-ui-plus',
  'Ant Design Vue': 'ant-design-vue',
  'Element': 'element-plus',
};

/**
 * 自动安装模板依赖
 * @param {string} cmdPath 所安装依赖工程的 package.json 文件路径
 * @param {*} options 用户询问交互选择信息
 */
const install = (cmdPath, options) => {
  const { frame, library } = options || {};
  console.log(LibraryMap[library]);
  const command = `pnpm add ${frame} && pnpm add ${LibraryMap[library]}`;
  return new Promise((resolve, reject) => {
+    const spinner = ora();
+    spinner.start('正在安装依赖，请稍候...');
    exec(
      // pnpm 安装依赖命令，安装多个依赖时使用 && 拼接
      command,
      {
        // 所安装依赖工程的 package.json 文件路径
        cwd: path.resolve(cmdPath),
      },
      (error, stdout, stderr) => {
        console.log('error', error, 'stdout', stdout, 'stderr', stderr);
+        if (error) {
+         reject();
+          spinner.fail('依赖安装失败');
+          return;
+        }
+        spinner.succeed('依赖安装成功~');
+        resolve();
      }
    )
  })
}

exports.install = install;
```

执行过程如下：

![安装依赖](https://p.ipic.vip/ailf6o.png)

![依赖安装完成](https://p.ipic.vip/31c9br.png)

### 发布与安装

在 `packages/demo-cli` 文件夹目录下运行以下命令将脚手架发布到 **`npm`** 上。

```bash
pnpm publish --F project-cli
```

发布成功后。我们在一个任意工程中，执行 `pnpm add project-cli -D` 安装脚手架依赖成功后，在工程中执行 `pnpm start create --name projectName` 命令即可。

### 参考资料

* [带你了解更全面的 Monorepo - 优劣、踩坑、选型](https://juejin.cn/post/7215886869199896637#heading-18)
* [写给5年前端妹子的三万字脚手架教程](https://mp.weixin.qq.com/s/A6z3m6F8sKE-b7Do_aBpTw)

