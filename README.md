# Imgturn
Imgturn is a simple server-based Web Proxy

## 仕組み
Playwrightで取得したChromium上の画像をPollingで取得するめっちゃ帯域消費するであろうWebプロキシです。
サーバーに負荷がかかる設計で、複数人がアクセスすることは推奨できません

## 使い方
```ts
bun i
bun run build
bun start
```