const pkg = require('./package.json');

module.exports = {
  branches: 'main',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'yarn set-plugin-version ${nextRelease.version}',
      },
    ],
    [
      '@amille/semantic-release-plugins/archive',
      {
        output: './' + pkg['streamdeck-plugin'].namespace + '.streamDeckPlugin',
        assets: [
          {
            pattern: 'dist/' + pkg['streamdeck-plugin'].namespace + '.sdPlugin/**',
            relative: 'dist',
          },
        ],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: './' + pkg['streamdeck-plugin'].namespace + '.streamDeckPlugin',
          },
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'yarn.lock'],
      },
    ],
  ],
};
