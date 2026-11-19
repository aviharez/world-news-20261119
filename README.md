# world-news-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/aviharez/world-news-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/aviharez/world-news-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A one-page front page of the world's news of Thursday 19 November 2026: the Trump-Xi-Putin summit at APEC in Shenzhen, the World Court's Rohingya genocide judgment and the US-Iran war. `draw.mjs` draws it as SVG, and `main.ts` writes the rendered PNG to `/output/entry.png`.

## Run it

```sh
node draw.mjs && rsvg-convert -w 1024 -h 1024 front.svg -o entry.png   # redraw (optional)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=cfngrw1d&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
