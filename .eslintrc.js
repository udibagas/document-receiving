// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'indent': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-multi-str': 'off',
    'quotes': 'off',
    'camelcase': 'off',
    'eqeqeq': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'

  }
}
