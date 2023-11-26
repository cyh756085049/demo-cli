const path = require('path');
const { exec } = require('child_process');
const ora = require('ora');

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
    const spinner = ora();
    spinner.start('正在安装依赖，请稍候...');
    exec(
      // pnpm 安装依赖命令，安装多个依赖时使用 && 拼接
      command,
      {
        // 所安装依赖工程的 package.json 文件路径
        cwd: path.resolve(cmdPath),
      },
      (error, stdout, stderr) => {
        // console.log('error', error, 'stdout', stdout, 'stderr', stderr);
        if (error) {
          reject();
          spinner.fail('依赖安装失败');
          return;
        }
        spinner.succeed('依赖安装成功~');
        resolve();
      }
    )
  })
}

exports.install = install;
