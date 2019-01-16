module ImagesLayout{

    export interface IImageDescription{
        src:string;
        width:number;
        height:number;
    };

    interface IImagesWithinRow{
        start: number;               //
        end :number;                 //  [start,end]
        accWidths:number;
        images: IImageDescription[],
        widthPercentages:number[]; 
    }

    export class RowLayout{

        images: IImageDescription[];
        stdLineHeight: number;
        totalLineWidth:number;
        segments: number[]; // segments that are rendered every time

        constructor(images: IImageDescription[], totalLineWidth:number, LineHeight:number=250){
            this.images=images;
            this.stdLineHeight=LineHeight;
            this.totalLineWidth = totalLineWidth;
            this.segments=[this.images.length];
        }

        // create images as row
        private _createImageContainer(renderedHeight:number, widthPercentage:number){
            var div = document.createElement("div");
            div.style.boxSizing="border-box";
            div.style.height = `${renderedHeight}px`;
            // itemElement.style.width = `${Math.floor(this.totalLineWidth * widthPercentage)}px`;
            div.style.width = `${Math.floor(widthPercentage*10000)/100}%`;
            div.style.cssFloat=`left`;
            div.style.border="1px solid gray";
            return div;
        }

        // create images
        private _createImageElement(image:IImageDescription){
            var imageElement = document.createElement("img");
            imageElement.src= image.src;
            imageElement.style.height = "100%";
            imageElement.style.width = "100%";
            return imageElement;
        }

        // search a range like [start,end] that image between [start,end] will be rendered within same row
        private _findRowRange(idx:number = 0) : IImagesWithinRow{

            var result:IImagesWithinRow ={ start:idx, end :idx, accWidths:0, widthPercentages:[], images:[]}; 

            while(idx < this.images.length){
                let image = this.images[idx];
                var alpha = image.height / this.stdLineHeight; // scale this image to standard height
                let imageWidth = image.width / alpha;          // get the width if scaling to the standard height

                // when this image's size is greater than the required row width
                //     , this image should be treated as a single row
                if(imageWidth > this.totalLineWidth){  
                    result.end =  idx > result.start ? idx-1: idx; 
                    break; 
                }

                // when (this image + previous accumulated) has reached the width limit 
                //     , this image should be placed within next row
                if( result.accWidths + imageWidth > this.totalLineWidth ){ 
                    result.end = idx -1 ; 
                    break;
                }

                // else : eat current image
                result.accWidths = result.accWidths + imageWidth;
                //     and try next image
                idx=idx+1;
            }
            result.end= idx;

            result.images= this.images.filter((img,idx)=>idx>=result.start && idx<=result.end);
            
            result.widthPercentages= result.images.map(img=>{
                var alpha = img.height / this.stdLineHeight; // scale this image to standard height
                let imageWidth = img.width / alpha;          // the width when scaling to the standard height
                return imageWidth/result.accWidths;
            })

            return result;
        }

        // render one row starting from idx
        private _renderOneRow(idx:number){

            var rowRange=this._findRowRange(idx);
            var accWidths = rowRange.accWidths;

            var omiga = accWidths/this.totalLineWidth;  // ω : used to scale these images to 100% width
            var renderedHeight = Math.ceil(this.stdLineHeight / omiga ); // the rendered height when scale these images with ω 

            var images =rowRange.images.map((img,idx) => {
                var widthPercentage = rowRange.widthPercentages[idx] ;
                var itemElement = this._createImageContainer(renderedHeight,widthPercentage);
                var imageElement = this._createImageElement(img);
                itemElement.appendChild(imageElement);
                return itemElement;
            });
            var row = document.createElement("div");
            images.forEach(i=>row.appendChild(i));
            return {row, range: rowRange};
        }

        public render():HTMLElement[]{
            var rows : HTMLElement[] = [];
            let idx = 0;
            while(idx< this.images.length){
                const {range,row}=this._renderOneRow(idx);
                rows.push(row);
                idx = range.end+1;
            }
            return rows;
        }
        public renderMoreImages(images:IImageDescription[]){
            var newRowLayout= new RowLayout(this.images,this.totalLineWidth,this.stdLineHeight);
            var rows= newRowLayout.render();
            this.images = this.images.concat(images);
            this.segments .push(images.length);
            return rows;
        }
    }
}