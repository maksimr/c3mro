/*global files, basePath, exclude, autoWatch, browsers, JASMINE, JASMINE_ADAPTER*/

basePath = '';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'js/**/*.js',
  'test/**/*.js'
];

exclude = [
  '**/*.swp'
];

autoWatch = false;

browsers = ['PhantomJS'];
