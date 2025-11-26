# lambda-express

AWS Lambda Function URLで動作するExpress APIサーバー

## 特徴

- TypeScript Express APIサーバー
- ローカル環境とAWS Lambda両方で動作
- 開発にはNode.js 24のネイティブTypeScriptサポートを使用
- AWS Lambda Function URLでサーバーレスデプロイ

## 開発

### 必要な環境

- Node.js 24以降
- npm

### インストール

```bash
npm install
```

### ローカル開発

```bash
# 自動リロード付きで起動
npm run dev

# またはNode.jsで直接実行
node --experimental-strip-types --watch src/index.ts
```

### ビルド

```bash
npm run build
```

## AWS Lambdaへのデプロイ

### クイックデプロイ

```bash
npm run deploy
```

このコマンドは以下を実行します：
1. TypeScriptコードをビルド
2. デプロイパッケージ（lambda.zip）を作成
3. AWS Lambda関数 `moto-test` にデプロイ

別の関数名にデプロイする場合：

```bash
LAMBDA_FUNCTION_NAME=your-function-name npm run deploy
```

### 初回セットアップ: Lambda関数の作成（AWSコンソール）

**ステップ1: 関数の作成**

1. AWS Lambda コンソールを開く
2. 「関数の作成」をクリック
3. 「一から作成」を選択
4. 関数名: `moto-test`（または任意の名前）
5. ランタイム: Node.js 20.x以降
6. 「関数の作成」をクリック

**ステップ2: ハンドラーの設定**

1. 「ランタイム設定」に移動
2. 「編集」をクリック
3. ハンドラーを `index.handler` に設定
4. 「保存」をクリック

**ステップ3: コードのデプロイ**

```bash
npm run deploy
```

**ステップ4: Function URLの有効化**

1. 「設定」→「関数 URL」に移動
2. 「関数 URL を作成」をクリック
3. 認証タイプ: `NONE`（または認証が必要な場合は `AWS_IAM`）
4. 「保存」をクリック
5. 関数 URL をコピー

**ステップ5: テスト**

ブラウザで関数URLを開くか、curlでテスト：

```bash
curl https://YOUR-FUNCTION-URL.lambda-url.REGION.on.aws/
curl https://YOUR-FUNCTION-URL.lambda-url.REGION.on.aws/api/health
curl https://YOUR-FUNCTION-URL.lambda-url.REGION.on.aws/api/users
```

### AWS CLIでの初回セットアップ

```bash
# 関数の作成（初回のみ）
aws lambda create-function \
  --function-name moto-test \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/YOUR-LAMBDA-ROLE \
  --handler index.handler \
  --zip-file fileb://lambda.zip

# Function URLの作成（初回のみ）
aws lambda create-function-url-config \
  --function-name moto-test \
  --auth-type NONE

# パブリックアクセスの許可設定（初回のみ）
aws lambda add-permission \
  --function-name moto-test \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
```

初回セットアップ後は、`npm run deploy` でコードを更新できます。

## APIエンドポイント

- `GET /` - Hello World
- `GET /api/health` - ヘルスチェック
- `GET /api/users` - ユーザー一覧の取得
- `POST /api/users` - 新しいユーザーの作成

## プロジェクト構造

```
.
├── src/
│   └── index.ts       # Lambdaハンドラー付きExpressアプリ
├── dist/              # コンパイル済みJavaScript（生成）
├── deploy.sh          # デプロイスクリプト
├── package.json       # 依存関係とスクリプト
├── tsconfig.json      # TypeScript設定
└── README.md          # このファイル
```
