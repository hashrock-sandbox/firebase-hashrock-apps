# hashrock-apps

- Firebaseは1プロジェクトで複数サイトの運用ができるらしい
- 実際1プロジェクトにたくさん詰め込む方式のほうが、スニペットの共有もできて楽なのでは
- 同時接続数に問題が出てきたらもうBlazeにお金払おう

# アプリの増やし方

- firebase target:apply hosting blog hashrock-apps-blog
  - .firebasercにtargetが書き込まれる
- firebase.jsonのhostingに追記する
- firebase consoleからデプロイ先のサイトを追加する（これをしないとentityが見つからず404になる）

多分だけど、別Repoに分けることもできそう。デプロイ速度とかに関わるようなら分けたほうがいいかも

# parcelと使おうとした記録

- parcelはそもそもCDNとの相性が悪そう（firebaseをCDN経由で読み込もうとするとbundleしようとする。無視もできない）
- firebaseはCDNから読み込むのが一番ラクそう（Configを全部入れておいてくれる）
- というわけでこのプロジェクト全体は「ビルドを諦める」でいい気がするなー。本気PJはconfig直書きにして。

# リンク

- https://hashrock-apps-blog.web.app/
- https://hashrock-apps-text.web.app/

# 参考ページ

- https://medium.com/google-cloud-jp/firestore2-920ac799345c