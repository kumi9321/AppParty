# GitHub Pagesを使ったアプリサイト構築手順書

このドキュメントは、ローカルで開発した静的なウェブアプリケーションを、GitHub Pagesを利用して公開するまでの手順をまとめたものです。

---

## 1. ローカル環境のセットアップ

まず、プロジェクト用のディレクトリを作成し、Gitリポジトリとして初期化します。

```bash
# プロジェクト用のディレクトリを作成
mkdir AppParty

# 作成したディレクトリに移動
cd AppParty

# Gitリポジトリを初期化
git init
```

## 2. GitHubにリモートリポジトリを作成

次に、GitHubのウェブサイトで、ソースコードを保管するためのリモートリポジトリを作成します。

1.  [https://github.com/new](https://github.com/new) にアクセスします。
2.  **Repository name** に `AppParty` のように好きなリポジトリ名を入力します。
3.  リポジトリを **Public** に設定します。（GitHub Pagesを無料で利用するため）
4.  **Create repository** ボタンをクリックします。

## 3. ローカルとリモートリポジトリを接続

作成したリモートリポジトリのURLを、ローカルリポジトリに登録します。これにより、ローカルの変更をGitHubにプッシュできるようになります。

```bash
# リモートリポジトリを 'origin' という名前で登録
# git@github.com:<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git の部分を自分のものに置き換える
git remote add origin git@github.com:kumi9321/AppParty.git
```

## 4. 最初のファイルを作成してプッシュ

プロジェクトに最初のファイルを追加し、リモートリポジトリにプッシュして接続を確認します。

```bash
# README.md ファイルを作成
echo "# AppParty" > README.md

# ファイルをステージング
git add README.md

# 変更をコミット
git commit -m "Initial commit"

# デフォルトブランチ名を 'main' に変更
git branch -M main

# 'main' ブランチをリモートリポジトリにプッシュ
git push -u origin main
```

## 5. アプリケーションのファイルを作成

今回は、メインページとTodoアプリを作成しました。以下のようなファイル構成で作成します。

```
/AppParty
├── index.html       # アプリ一覧のメインページ
└── /todo
    ├── index.html   # TodoアプリのHTML
    ├── style.css    # TodoアプリのCSS
    └── script.js    # TodoアプリのJavaScript
```

この後、各ファイルにHTML、CSS、JavaScriptのコードを記述します。

## 6. アプリケーションをコミット＆プッシュ

作成したアプリケーションのファイルをリポジトリに追加して、変更をプッシュします。

```bash
# すべての変更をステージング
git add .

# 変更をコミット
git commit -m "feat: Add main page and todo list app"

# リモートリポジトリにプッシュ
git push origin main
```

## 7. GitHub Pagesの設定

いよいよ、サイトをインターネットに公開します。GitHub Pagesの設定を有効化します。

1.  GitHubのリポジトリページで **Settings** タブに移動します。
2.  左側のメニューから **Pages** を選択します。
3.  **Build and deployment** の下にある **Source** で、**Deploy from a branch** を選択します。
4.  **Branch** の項目で、ブランチを `main`、フォルダを `/(root)` に設定し、**Save** をクリックします。

設定後、デプロイが完了するまで数分かかります。

## 8. 公開URLをREADMEに記載

デプロイが完了すると、GitHub Pagesの設定画面に公開URLが表示されます。URLの形式は以下のようになります。

`https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`

このURLを `README.md` に記載しておくと、他の人がアクセスしやすくなります。

1.  `README.md` ファイルを開いて編集します。
2.  変更をコミットし、プッシュします。

```bash
git add README.md
git commit -m "docs: Add GitHub Pages URL to README"
git push origin main
```

以上で、開発から公開までの一連のプロセスは完了です。
