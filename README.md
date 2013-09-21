## peep.carousel

### 対応内容

* レスポンシブ
* CSS3 3d Transitions
* 表示件数指定
* 前、次にカルーセル候補がある場合のチラ見せ
* ナビゲーション
* マウスイベントによるスライド(対応予定)
* タッチイベントによるスライド(対応予定)

### 検証済み端末

* Chrome
* iPhone
* Android of some

### デモ

http://bossato.github.io/peep.carousel/

### 1.設置方法

jQueryとpeep.carouselのJS、CSSファイルを読み込みます。

```html
<link rel="stylesheet" type="text/css" href="peep.carousel/peep.carousel.css">
<script type="text/javascript" src="js/query-2.0.0.min.js"></script>
<script type="text/javascript" src="peep.carousel/peep.carousel.js"></script>
```

### 2.HTMLコーディング

カルーセル領域を`div`で囲み、クラスに`peep-carousel`、idに任意のIDを振ります。

```html
<div id="peep1" class="peep-carousel">
  <ul>
    <li><img src="img/sample01.jpg" width="94" height="94"></li>
    <li><img src="img/sample02.jpg" width="94" height="94"></li>
    <li><img src="img/sample03.jpg" width="94" height="94"></li>
    .
    .
    .
  </ul>
</div>  
``` 

### 3.プラグイン呼び出し

任意のIDを指定してpeep.carouselを呼びます。 

```html
<script type="text/javascript">
$(function() {
  $('#peep1').peepCarousel();
}); 
</script>
```

### オプション

| オプション | 項目名 | デフォルト値 |
|:------|:------|:------|
| displayImageNum | 表示件数 | 3 |
| displayPagination | ページング表示フラグ | true |
| displaySide | チラ見せ表示フラグ | true |
| sidePercent | チラ見せ領域比率 | 1 |

### License

MIT License
