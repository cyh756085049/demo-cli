const copydir = require('copy-dir');
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

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

/**
 * 获取动态模板内容
 * @param {string} path 动态模板文件的相对路径
 * @param {*} data 动态模板文件的配置数据
 * @returns 
 */
const readTemplate = (path, data = {}) => {
  //  Mustache.render 的第一个参数类型是个字符串，所以要指定 encoding 类型为 utf8，否则返回 Buffer 类型数据
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

exports.copyDir = copyDir;
exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.copyFile = copyFile;
exports.readTemplate = readTemplate;
exports.copyTemplate = copyTemplate;