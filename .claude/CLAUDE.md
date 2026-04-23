# プロジェクト概要
SmartESG 管理画面のデザイン＆実装

## 技術スタック
- React + TypeScript
- MUIコンポーネントを使用する
- Pencil (.pen ファイルでUIを管理)

## デザインルール
- デザイントークンは tokens.json を必ず参照すること
- コンポーネントは src/components/ に配置
- 色は tokens.json の値のみ使用（独自の色を追加しない）

## 作業ルール
- 画面を作るときは screen-requirements.md を先に確認すること
- .pen ファイルと実装コードは必ずセットで変更すること
- コミットは .pen + コードを同じ変更セットにまとめること