# 競馬研究アプリ「競馬ラボ」

中央競馬のデータを多角的に分析し、馬券的中率の向上をサポートするために開発した研究アプリです。  

## 主な機能

### ホーム画面
<img width="312" height="515" alt="image" src="https://github.com/user-attachments/assets/7ae38d37-bf7e-46e6-8763-4434a1f30b33" />


### 1. 収支登録機能
- 中央競馬の開催日程、開催場所、レース回に対応  
- 券種・賭け額を入力することで、日別・開催別の収支を管理可能  
- 累計収支の可視化により、自身の投資傾向を分析  

<img width="383" height="684" alt="image" src="https://github.com/user-attachments/assets/3e654e4b-1246-4063-90ec-c7a6bbbf3b2d" />
<img width="391" height="617" alt="image" src="https://github.com/user-attachments/assets/f8d4c2e5-4524-42b0-8b64-a947112e2b47" />



- ハンバーガメニューのダッシュボードから年度別の収支を確認できます。

<img width="308" height="671" alt="image" src="https://github.com/user-attachments/assets/c7a56679-c452-47f7-923d-3b6280e86d99" />





### 2. 血統検索機能
- 任意の競走馬を検索すると、**五代血統表**を自動生成  
- 父系・母系の血統傾向を確認し、得意条件の予測に活用可能  

<img width="505" height="568" alt="image" src="https://github.com/user-attachments/assets/51cb1e4c-f264-49c8-9741-37ef4f275eed" />


### 3. 重賞研究機能
- 各重賞レースごとに、コース形態・特徴・ラップ傾向を表示  
- 過去データに基づき、レースごとの傾向分析を実施  
- 研究結果を馬券検討に直結させることが可能  

<img width="380" height="681" alt="image" src="https://github.com/user-attachments/assets/29778a15-123e-481f-9a59-b17d9e907724" />
<img width="380" height="682" alt="image" src="https://github.com/user-attachments/assets/c62395e2-7ca3-4fb1-a752-1b005d93365c" />

### 4.条件戦分析
開発中

### 使用技術

- フロントエンド：React / TypeScript / React Native / Next.js / Tailwind CSS

- バックエンド：Flask / Python / JWT認証 / BeautifulSoup（スクレイピング）

- DB：MySQL

- インフラ：AWS（EC2, Route 53） / Vercel（フロント公開）

### インフラ構成図
<img width="762" height="523" alt="image" src="https://github.com/user-attachments/assets/8ffaa01e-509e-48df-988a-e9340c18fe0e" />


### 4.URL
https://horse-racing-react.vercel.app/

### 4.課題
・入力バリデーション

　パスワードの桁数チェック、メールアドレス形式チェックの強化
 
・セキュリティ強化

  同一アカウントでの同時ログイン防止機能
  
・UI/UX改善

　血統検索画面を中心としたレイアウト整形

・競走馬データの管理

　pickleファイルに競走馬をまとめて登録しているが、すべての競走馬を登録できておらず、管理方法模索中

### 4.今後、追加したい機能
・競馬予想AIを用いたデータ分析機能
・IPAT（JRAネット投票）との連携
