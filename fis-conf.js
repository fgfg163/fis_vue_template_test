/**
 * default settings. fis3 release
 */

var package = require('./fis-conf/package.js');
var deploy = require('./fis-conf/deploy.js');

// 模块名称
fis.set('namespace', 'template');
fis.set('project.static', '/static');
// 过滤掉上传的文件
fis.set('project.ignore', [
  '/components/**.MD',
  '/components/**.md',
  '.editorconfig',
  '.gitignore',
  'build.sh',
  'component.json',
  'fis-conf.js',
  'package.json',
]);

// 轮询检查项目文件更新
fis.config.set("project.watch.usePolling", true);

// 模块化方案modjs commonJS规范
fis.hook('module', {
  mode: 'commonjs'
});

fis.match('**/node_modules/**.js', {
  isMod: true,
  release: '${project.static}/${namespace}/$&'
});

fis.match('*.{js,css,png,gif}', {
  useHash: true  // 文件指纹
});

// 启用 es6-babel 插件，解析 .es6 后缀为 .js

fis.match('*.es6', {
  isMod: false,
  rExt: '.js',
  parser: fis.plugin('babel')
});

//component里的 .es6文件为组件
fis.match('*/component/**.es6', {
  isMod: true,
});

// 启用less-2.x 插件，解析.less 后缀为 .css
fis.match('*.less', {
  rExt: '.css',
  parser: fis.plugin('less-2.x')
});

//文件压缩
fis.match('*.{js,es6}', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});
fis.match('*.{css,less}', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

//开发环境不压缩
fis.media('dev').match('*.{js,es6}', {
  optimizer: null,
});
fis.media('dev').match('*.{css,less}', {
  optimizer: null,
});
fis.media('dev').match('*.png', {
  optimizer: null,
});

// 以纯前端（没有后端模板）的项目为例，对于依赖组件的加载就靠插件 fis3-postpackager-loader ,
// 其是一种基于构建工具的加载组件的方法，构建出的 html 已经包含了其使用到的组件以及依赖资源的引用。
fis.match('::package', {
  postpackager: fis.plugin('loader')
});


//// 打包压缩
fis.match('::package', {
  packager: fis.plugin('map', package)
});

console.log(fis);

// 部署
devDeploy();

function devDeploy() {

  function push(RD, to) {
    return fis.plugin('http-push', {
      receiver: RD.receiver,
      to: RD.root + to
    });
  }

  for (var k in deploy) {
    var RD = deploy[k];
    fis.media(k)
      .match('${namespace}-map.json', {
        deploy: push(RD, 'data/smarty')
      })
      .match('components/**', {
        deploy: push(RD, 'web/components')
      })
  }
}


