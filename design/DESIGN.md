# DESIGN.md — SmartESG Reporting

> このファイルはデザインシステムの定義書です。
> Claude Code はコード生成・UI修正の際に必ずこのファイルを参照してください。

---

## 1. コンセプト

**キーワード**: `document-first`, `editorial`, `trustworthy`, `professional`, `ESG reporting`

SmartESG Reporting は、企業の ESG レポートを作成・編集・出力するためのツールです。
主なアクションは「長文テキストの編集」と「テーブル・指標の管理」であり、
ダッシュボード型ではなく **Word ライクなドキュメント編集体験** が中心になります。

### デザイン原則
- **読みやすさ最優先**: 長文を扱うため、行間・フォントサイズは広めに設定する
- **操作の明確さ**: 編集中・プレビュー・出力の状態が常に明確に区別できること
- **ブランドの信頼感**: エメラルドグリーンを primary として、SmartESGの中のプロダクトであること、誠実・環境・信頼を表現する

---

## 2. カラーパレット

### Primary（エメラルドグリーン）
| Token | Hex | 用途 |
|---|---|---|
| `primary.dark` | `#235749` | ホバー・アクティブ状態 |
| `primary.main` | `#35836d` | メインボタン・アクセント・リンク |
| `primary.selected` | `#a8cac0` | 選択状態・チェック |
| `primary.background` | `#e2edea` | 軽いハイライト・選択行背景 |

### Semantic（状態色）
| Token | Hex | 用途 |
|---|---|---|
| `danger.main` | `#d32f2f` | エラー・削除 |
| `danger.dark` | `#b71c1c` | エラーホバー |
| `danger.background` | `#feebee` | エラー背景 |
| `info.main` | `#03a9f4` | 情報・リンク補助 |
| `info.background` | `#e1f5fe` | 情報バナー背景 |

### ニュートラル
| Token | Hex | 用途 |
|---|---|---|
| `text.black` | `#212121` | 本文・見出し |
| `text.gray` | `#616161` | サブテキスト・ラベル |
| `text.disabled` | `#9e9e9e` | 非活性テキスト |
| `text.white` | `#ffffff` | 反転テキスト |
| `component.background` | `#fafafa` | ページ背景 |
| `component.head` | `#eeeeee` | テーブルヘッダー・セクション区切り |
| `component.border` | `#e0e0e0` | 罫線・区切り線 |
| `component.white` | `#ffffff` | カード・モーダル背景 |

---

## 3. タイポグラフィ

フォント: **Roboto** （日本語フォールバック: `sans-serif`）

> 編集エリアは行間を広くとり、長文読解の疲労を軽減する。

| 用途 | サイズ | ウェイト | 行高 |
|---|---|---|---|
| ページタイトル（レポート名） | 24px (XL) | Bold | 1.5 |
| セクション見出し（H2） | 20px (L) | Bold | 1.5 |
| 小見出し（H3） | 16px (M) | Medium | 1.5 |
| 本文（編集エリア） | 16px (M) | Regular | 1.8 ※広めに設定 |
| ラベル・キャプション | 14px (S) | Regular | 1.5 |
| バッジ・補助テキスト | 12px (SS) | Regular | 1.5 |

---

## 4. スペーシング

8px グリッドベース。

| Token | 値 | 主な用途 |
|---|---|---|
| `spacing.x3s` | 4px | アイコンとテキストの間隔 |
| `spacing.xxs` | 8px | インライン要素間 |
| `spacing.xs` | 12px | コンパクトな内部余白 |
| `spacing.s` | 16px | 標準内部余白（パディング基本単位） |
| `spacing.m` | 24px | カード・セクション間隔 |
| `spacing.l` | 32px | セクション間余白 |
| `spacing.xl` | 40px | ページ上下余白 |
| `spacing.xxl` | 48px | 大きなセクション区切り |

---

## 5. ボーダー・シャドウ

| Token | 値 | 用途 |
|---|---|---|
| `radius.s` | 4px | ボタン・バッジ・小コンポーネント |
| `radius.m` | 8px | カード・モーダル・入力フィールド |
| `radius.l` | 16px | 大きなカード・ダイアログ |
| `radius.full` | 9999px | ピル型バッジ |
| `shadow.xs` | `0 1px 2px rgba(0,0,0,0.15)` | インライン要素 |
| `shadow.s` | `0 2px 4px rgba(0,0,0,0.15)` | カード・ヘッダー |
| `shadow.m` | `0 4px 8px rgba(0,0,0,0.15)` | ドロップダウン・メニュー |
| `shadow.l` | `0 8px 16px rgba(0,0,0,0.15)` | モーダル・ダイアログ |

---

## 6. コンポーネント定義

### ヘッダー
- 高さ: 64px
- 背景: `#ffffff`
- 影: `shadow.s`
- 左: SmartESG ロゴ + "Reporting" サブタイトル（14px, `primary.main`）
- 右: アクションボタン群（状態によって変わる）
  - レポート一覧: `+ 新規レポート作成`（primary ボタン）
  - 編集中: `バージョンを保存` / `編集履歴` / `プレビュー`（primary ボタン）
  - プレビュー: `編集履歴` / `出力`（primary ボタン）
- パンくずリスト: ヘッダー下部に表示（14px, `text.gray`）

### ボタン
| バリアント | 背景 | テキスト | 用途 |
|---|---|---|---|
| Primary | `primary.main` | `#ffffff` | メインアクション |
| Primary Hover | `primary.dark` | `#ffffff` | ホバー状態 |
| Outlined | `#ffffff` | `primary.main` | サブアクション |
| Text | transparent | `primary.main` | 軽微なアクション・リンク |
| Danger | `danger.main` | `#ffffff` | 削除・破壊的操作 |
| Disabled | `component.head` | `text.disabled` | 非活性 |

高さ: 36px / パディング: 8px 16px / 角丸: `radius.s`（4px）

### サイドパネル（レポート編集画面）
- 幅: 240px
- 背景: `#ffffff`
- 右ボーダー: 1px `component.border`
- アイテム: セクション名一覧（14px）
- 選択状態: `primary.background` 背景 + `primary.main` テキスト
- 下部: `+ セクション追加` ボタン（text バリアント）

### レポート編集エリア
- 最大幅: 800px（中央揃え）
- 背景: `#ffffff`
- パディング: 40px 48px
- セクションタイプ:
  - **テキスト**: Roboto 16px / line-height 1.8
  - **テーブル**: ヘッダー背景 `component.head` / 行ボーダー `component.border` / セル 12px
  - **グラフ**: （要件定義中）
- 未選択時: 右パネル非表示
- 選択時: 右にプロパティパネルが出現（幅 320px）

### レポート一覧カード
- 背景: `#ffffff`
- ボーダー: 1px `component.border` / 角丸: `radius.m`（8px）
- 影: `shadow.xs`
- 構成: レポートタイトル（16px Bold）/ 作成者・更新日（12px, `text.gray`）/ バッジ
- ホバー: 影が `shadow.s` に変わる

### バッジ
- 角丸: `radius.full`
- パディング: 2px 8px
- フォント: 12px
- バリアント: primary / danger / info（各 main 色背景 + white テキスト）

### テーブル
- ヘッダー: 背景 `component.head` / フォント 14px Medium
- ボディ: 行ボーダー 1px `component.border` / フォント 14px
- 行ホバー: 背景 `primary.background`
- セル内パディング: 12px 16px

### スナックバー（Toast通知）
- 幅: 400px / 中央上部固定
- 角丸: `radius.m`
- 影: `shadow.m`
- バリアント: success（`primary.main`） / error（`danger.main`） / info（`info.main`）

### モーダル・ダイアログ
- オーバーレイ: `rgba(0,0,0,0.5)`
- ダイアログ幅: 480px（小） / 640px（中）
- 角丸: `radius.l`（16px）
- 影: `shadow.l`
- 破壊的操作: 確認ボタンを `danger` バリアントで表示

---

## 7. 画面構成・レイアウト

### レポート一覧画面
```
[ヘッダー: ロゴ | + 新規レポート作成]
[コンテンツエリア]
  [フィルター・ソート]
  [レポートカード一覧（グリッド）]
  [Empty State: 初回またはゴミ箱が空の場合]
```

### レポート編集画面
```
[ヘッダー: ロゴ + パンくず | バージョンを保存 / 編集履歴 / プレビュー]
[サイドパネル: セクション一覧 | + セクション追加]
[編集エリア: レポートタイトル / セクションコンテンツ（テキスト・テーブル）]
[右パネル: セクション選択時のみ表示（プロパティ・指標連携）]
```

### プレビュー画面
```
[ヘッダー: ロゴ + パンくず | 編集履歴 / 出力]
[プレビューエリア: 印刷イメージに近い表示]
```

---

## 8. インタラクション・状態定義

| 状態 | 表現 |
|---|---|
| ホバー | 影・背景色が1段階濃くなる |
| フォーカス | `primary.main` の 2px outline |
| 選択（サイドパネル） | `primary.background` 背景 + `primary.main` テキスト |
| 非活性 | `text.disabled` テキスト + `component.head` 背景 |
| エラー | `danger.main` のボーダー + `danger.background` 背景 + エラーメッセージ（12px） |
| ローディング | スケルトンスクリーン（`component.head` ベース） |
| Empty State | イラスト + 説明テキスト + 主要アクションボタン |

---

## 9. CSS 変数マッピング

```css
:root {
  /* Primary */
  --color-primary-dark:       #235749;
  --color-primary-main:       #35836d;
  --color-primary-selected:   #a8cac0;
  --color-primary-bg:         #e2edea;

  /* Danger */
  --color-danger-dark:        #b71c1c;
  --color-danger-main:        #d32f2f;
  --color-danger-bg:          #feebee;

  /* Info */
  --color-info-main:          #03a9f4;
  --color-info-bg:            #e1f5fe;

  /* Text */
  --color-text-black:         #212121;
  --color-text-gray:          #616161;
  --color-text-disabled:      #9e9e9e;
  --color-text-white:         #ffffff;

  /* Component */
  --color-bg-page:            #fafafa;
  --color-bg-card:            #ffffff;
  --color-bg-head:            #eeeeee;
  --color-border:             #e0e0e0;

  /* Typography */
  --font-family-base:         'Roboto', sans-serif;
  --font-size-ss:             12px;
  --font-size-s:              14px;
  --font-size-m:              16px;
  --font-size-l:              20px;
  --font-size-xl:             24px;
  --font-size-xxl:            28px;
  --line-height-normal:       1.5;
  --line-height-relaxed:      1.8;

  /* Spacing */
  --space-x3s:  4px;
  --space-xxs:  8px;
  --space-xs:   12px;
  --space-s:    16px;
  --space-m:    24px;
  --space-l:    32px;
  --space-xl:   40px;
  --space-xxl:  48px;

  /* Border Radius */
  --radius-s:   4px;
  --radius-m:   8px;
  --radius-l:   16px;
  --radius-full:9999px;

  /* Shadow */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.15);
  --shadow-s:   0 2px 4px rgba(0,0,0,0.15);
  --shadow-m:   0 4px 8px rgba(0,0,0,0.15);
  --shadow-l:   0 8px 16px rgba(0,0,0,0.15);
}
```