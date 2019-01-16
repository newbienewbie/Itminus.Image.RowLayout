

### How to use

```javascript
// raw images
var images= [
    {src:"http://1.jpg",width:100 , height:100},
    {src:"http://2.jpg",width:200 , height:200},
    {src:"http://3.jpg",width:300 , height:300},
    {src:"http://4.jpg",width:400 , height:200},
    {src:"http://5.jpg",width:500 , height:300},
    {src:"http://6.jpg",width:600 , height:300},
    {src:"http://7.jpg",width:100 , height:300},
    {src:"http://8.jpg",width:200 , height:300},
];

var app = document.getElementById("app");
var rowlayout= new ImagesLayout.RowLayout(images,app.clientWidth,240);
rowlayout.render().forEach(r => app.appendChild(r));

// load more
setTimeout(() => {
    rowlayout.renderMoreImages(images).forEach(r=>app.appendChild(r))
}, 8000);
```