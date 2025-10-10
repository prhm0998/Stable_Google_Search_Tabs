import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['**/.output/**', '**/.wxt/**', '**/node_modules/**'],
  },
  // 共通設定: JS/TS/Vue全般
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // JSルール
      'comma-dangle': [ // 末尾のカンマに関するルール設定
        'error',
        {
          'arrays': 'always-multiline', // 配列では複数行の場合に末尾のカンマを必須にする
          'objects': 'always-multiline', // オブジェクトでは複数行の場合に末尾のカンマを必須にする
          'imports': 'always-multiline', // インポートでは複数行の場合に末尾のカンマを必須にする
          'exports': 'always-multiline', // エクスポートでは複数行の場合に末尾のカンマを必須にする
          'functions': 'never', // 関数呼び出しや定義では末尾のカンマを禁止する
        },
      ],
      'brace-style': ['error', 'stroustrup'], // 波括弧のスタイルをStroustrupスタイル（elseなどを同じ行に書く）にする
      'no-unused-vars': 'off', // 未使用の変数のチェックを無効にする（TS側でチェックすることが多いため）
      'no-undef': 'off', // 未定義の変数のチェックを無効にする（TS側でチェックすることが多いため）
      'no-trailing-spaces': 'warn', // 行末の不要な空白を警告する
      'quotes': ['error', 'single'], // 文字列にシングルクォート（'）の使用を必須にする
      'function-paren-newline': ['error', 'consistent'], // 関数の引数に改行を入れる場合は一貫したスタイル（全て入れるか全て入れないか）を必須にする
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }], // 連続する空行を最大1行、ファイルの末尾と先頭の空行を禁止する
      'semi': ['error', 'never', { 'beforeStatementContinuationChars': 'never' }], // セミコロンの使用を禁止する（JavaScriptの自動セミコロン挿入に依存する）
      'semi-spacing': ['error', { 'after': true, 'before': false }], // セミコロンの後にスペースを必須、前にスペースを禁止する（セミコロンを許可する場合の設定だが、上記で禁止されているため保険的な設定）
      'semi-style': ['error', 'first'], // セミコロンのスタイル（行の先頭にセミコロンを置くことを禁止）を必須にする（セミコロンを許可する場合の設定）
      'no-extra-semi': 'error', // 不要なセミコロンを禁止する
      'no-unexpected-multiline': 'error', // 複数行にまたがる意図しない式を禁止する
      'no-unreachable': 'error', // 到達できないコード（return後のコードなど）を禁止する
    },
  },

  // TypeScript推奨ルール
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  // Vue推奨ルール (Flat Config 対応)
  pluginVue.configs['flat/recommended'],

  // Vueファイル専用のparser設定
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Vueカスタムルール
      'vue/no-root-v-if': 'warn', // ルート要素での `v-if` の使用を警告する
      'vue/no-multiple-template-root': 'off', // 単一ファイルコンポーネントで複数のルート要素を持つことを許可する（Vue 3では通常許可されるため）
      'vue/multi-word-component-names': 'off', // コンポーネント名に複数の単語を必須としない（単語一つでも許可）
      'vue/require-v-for-key': 'error', // `v-for` ディレクティブに `key` 属性を必須にする
      'vue/no-use-v-if-with-v-for': 'error', // `v-if` と `v-for` を同じ要素で使用することを禁止する
      'vue/no-parsing-error': 'off', // Vueテンプレートのパースエラーのチェックを無効にする（他のツールとの競合を避けるためなど）
      'vue/block-tag-newline': 'off', // `<template>` などのブロックタグの内容の改行スタイルチェックを無効にする
      'vue/singleline-html-element-content-newline': 'off', // 単一行のHTML要素の内容の改行に関するチェックを無効にする
      'vue/no-irregular-whitespace': 'error', // テンプレート内の不規則な空白文字を禁止する
      'vue/require-default-prop': 'warn', // Propに `default` がない場合に警告する
      'vue/html-indent': 'off', // HTMLインデントのチェックを無効にする（PrettierなどFormatterに任せるため）
      'vue/multiline-html-element-content-newline': 0, // 複数行のHTML要素の内容の改行に関するチェックを無効にする
      'vue/html-closing-bracket-newline': 0, // HTMLの閉じ括弧の前の改行に関するチェックを無効にする
      'vue/max-attributes-per-line': 'off', // 1行あたりの属性の最大数のチェックを無効にする
      'vue/html-self-closing': 'off', // HTMLタグのセルフクロージングに関するチェックを無効にする
      'vue/first-attribute-linebreak': 'off', // 属性が複数行になる場合の最初の属性の改行に関するチェックを無効にする
      'vue/static-class-names-order': 'error', // `<template>` 内の静的なクラス名の順序を必須にする（可読性のため）
    },
  },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
])