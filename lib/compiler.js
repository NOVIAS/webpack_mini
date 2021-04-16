const parser = require('./parser.js');
const path = require('path');
const render = require('./render.js');
const fs = require('fs');

class Compiler {
    constructor(options) {
        this.options = options;
        this.modules = [];
    }

    run() {
        // 1: 分析入口文件, 转换代码, 得到文件转换后的内容
        const module = this.build(this.options.entry);
        this.modules.push(module);
        // 2: 循环依赖, 转换代码
        // 不能使用 forEach
        for (const module of this.modules) {
            if (module.dependencies !== {}) {
                // 查找循环依赖
                for (const key in module.dependencies) {
                    // 传入文件的真正路径
                    this.modules.push(this.build(module.dependencies[key]));
                }
            }
        }
        // 3: 生成浏览器执行 bundle
        this.generate();

    }

    build(filename) {
        const ast = parser.getAsts((filename));
        const dependencies = parser.getDependencies(ast, filename);
        const code = parser.getCode(ast);
        return {
            filePath: filename,
            dependencies,
            code,
        }
    }

    generate() {
        // 对模块进行改造
        const modulesObj = {};
        // 生成输出文件
        const targetFile = path.join(this.options.output.path, this.options.output.filename);
        this.modules.forEach(module => {
            modulesObj[module.filePath] = {
                dependencies: module.dependencies,
                code: module.code,
            }
        })
        // 在 render 中进行了 JSON.stringify, 这里为了对应 modulesObj 中入口路径, 也做一次序列化
        const bundle = render(modulesObj, JSON.stringify(this.options.entry));
        fs.writeFileSync(targetFile, bundle, 'utf-8');
    }
}

module.exports = Compiler;
