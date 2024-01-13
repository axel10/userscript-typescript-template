/**
 * 将css写入js文件中的标识符位置
 * position:标识符
*/
import { Compiler } from 'webpack';

class InsertContentPlugin {
  constructor( position: string) {
    this.position = position;    // 要插入内容的位置
  }

  position: string

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('InsertContentPlugin', (compilation, callback) => {

      let cssContent:string
      for (const filename in compilation.assets) {
        if (filename.endsWith('.css')) {
          cssContent = compilation.assets[filename].source() as string
        }
      }
      if (!cssContent!) {
        callback()
        return
      }

      // 遍历生成的每个 JavaScript 文件
      for (const filename in compilation.assets) {

        if (filename.endsWith('.js')) {
          // 获取文件的源代码
          const source = compilation.assets[filename].source();

          // 在指定位置插入内容
          const modifiedSource = this.insertContent(source as string, cssContent);

          // 更新文件的源代码
          compilation.assets[filename] = {
            source: () => modifiedSource,
            size: () => modifiedSource.length
          } as any;
        }
      }

      callback();
    });
  }

  insertContent(source: string, contentToInsert: string) {
    // 将内容插入到指定位置
    const parts = source.split(this.position);

    if (parts[1]) {
      return parts[0] + contentToInsert + parts[1];
    } else {
      return parts[0] + contentToInsert
    }
  }
}

module.exports = InsertContentPlugin;