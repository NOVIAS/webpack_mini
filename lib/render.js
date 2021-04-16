function render(modules, entry) {
    modules = JSON.stringify(modules);
    return `(function (graph) {
        function require(filePath) {
            function localRequire(relativePath) {
                // 得到对应的带有根目录的相对路径
                // 返回 exports;
                return require(graph[filePath].dependencies[relativePath]);
            }
            // 定义 exports
            let exports = {};
            (function (require, exports, code) {
                eval(code);
            })(localRequire, exports, graph[filePath].code)
            return exports;
        }
        // 从入口文件开始
        require(${entry});
    })(${modules})`;
}

module.exports = render;
