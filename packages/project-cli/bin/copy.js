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