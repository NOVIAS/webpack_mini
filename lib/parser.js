const fs = require('fs');
const path = require('path');
const {parse} = require('@babel/parser');
const {transformFromAst} = require('@babel/core');
const traverse = require('@babel/traverse').default;

module.exports = {
    getAsts: (filename) => {
        const code = fs.readFileSync(filename, 'utf-8');
        return parse(code, {
            sourceType: 'module',
        })
    },

    getDependencies: (ast, filename) => {
        const dependencies = {};
        // 当前传入文件的目录
        const filePath = path.dirname(filename);
        // 获取其中的依赖路径
        traverse(ast, {
            ImportDeclaration: (code) => {
                dependencies[code.node.source.value] = path.join(`${filePath}`, code.node.source.value)
            }
        })
        return dependencies;
    },

    getCode: (ast) => {
        const {code} = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        })
        return code;
    }
};
