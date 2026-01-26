# actions-workflow-metrics

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

[English](README.md) | 日本語

<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->

ワークフロー実行中にシステムメトリクスを収集するGitHub Actionsカスタムアクションです。
CPU負荷とメモリ使用量を監視し、Mermaidチャートとして可視化します。

## 機能

- **システムメトリクス収集**: ワークフロー実行中のCPU負荷とメモリ使用量をリアルタイムで収集
- **Mermaidチャート生成**: 収集したメトリクスをMermaid形式の積み上げ棒グラフとして可視化
- **ジョブサマリー出力**: GitHub Actionsのジョブサマリーに自動的にチャートを表示

## 使い方

このアクションはワークフローの**先頭**で実行することを前提としています。

```yaml
name: Example Workflow

on: [push]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      # ワークフローの先頭でactions-workflow-metricsを実行
      - name: Start Workflow Telemetry
        uses: massongit/actions-workflow-metrics@v1

      # 以降の通常のステップ
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run tests
        run: npm test

      # ... その他のステップ
```

### 実行フロー

1. **main** (ワークフロー開始時): バックグラウンドでメトリクス収集サーバーを起動
2. **ワークフローの各ステップ**: 通常通り実行されながらバックグラウンドでメトリクスが収集される
3. **post** (ワークフロー終了時): 収集したメトリクスをMermaidチャートとして描画し、ジョブサマリーに出力

## 出力例

ジョブサマリーには次のようなチャートが表示されます。

- **CPU Loads**: システム/ユーザーCPU負荷の積み上げ棒グラフ
- **Memory Usages**: 使用中/空きメモリの積み上げ棒グラフ

## 技術スタック

- **Node.js**: 24.x
- **TypeScript**: 5
- **パッケージマネージャー**: Bun
- **主要ライブラリ**:
  - `systeminformation`: システムメトリクス収集
  - `zod`: スキーマバリデーション
  - `@actions/core`: GitHub Actions連携

## 開発セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. pre-commitのセットアップ（推奨）

セキュリティのため、[pre-commit](https://pre-commit.com/)をインストールしてください。コミット時にクレデンシャルが含まれていないか自動チェックされます。

```bash
# macOSの場合
brew install pre-commit

# またはpipを使用
pip install pre-commit

# pre-commitフックをインストール
pre-commit install
```

これにより、コミット時に自動的にgitleaksが実行されます。
APIキーやトークンなどの機密情報が含まれていないかチェックされます。

## 開発コマンド

```bash
# 型チェック + バンドル（dist/ディレクトリに出力）
bun run build

# ユニットテストの実行（Bunテストランナー）
bun test

# コードフォーマット（Prettier）
bun run fix
```

## プロジェクト構成

```text
src/
├── lib.ts                 # 共通スキーマとサーバー設定
├── main/
│   ├── index.ts           # mainエントリーポイント（サーバー起動）
│   ├── server.ts          # メトリクス収集HTTPサーバー
│   ├── metrics.ts         # Metricsクラス（メトリクス管理）
│   └── metrics.test.ts    # Metricsクラスのテスト
└── post/
    ├── index.ts           # postエントリーポイント（ジョブサマリー出力）
    ├── lib.ts             # メトリクスフェッチとレンダリング
    ├── lib.test.ts        # レンダリングロジックのテスト
    ├── renderer.ts        # Mermaidチャート生成
    └── renderer.test.ts   # Mermaidチャート生成のテスト
```

## アーキテクチャ

### main実行時

1. `src/main/index.ts`が実行される
2. Node.jsで`src/main/server.ts`をデタッチドプロセスとして起動
3. サーバーが`localhost:7777`でメトリクスJSONを配信開始
4. `Metrics`クラスが5秒ごとに`systeminformation`ライブラリを使ってCPU/メモリ情報を収集

### post実行時

1. `src/post/index.ts`が実行される
2. `localhost:7777`からメトリクスJSONを取得（タイムアウト： 10秒）
3. `Renderer`クラスがMermaidチャートを生成
4. `@actions/core`の`summary` APIでジョブサマリーに出力

## ライセンス

[MIT License](LICENSE)
