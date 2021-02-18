;(function(win){
    $ = $||{};
    if(!$.each){
        $.each = function(arr,call){
            for(var i=0;i<arr.length;i++){
                if(call.call(arr[i],i,call[i])===false){
                    break;
                }
            }
        }
    }
    function fStruct(z,f,string){
        this.z = z;
        this.f = f;
        this.amt = false;
        this.tickerInt = 0;
        this.nowShow = "";
        //鏃嬭浆瑙掑害鐩稿叧
        this.zNowAng = 0;
        this.fNowAng = 0;
        this.zEndAng = 0;
        this.fEndAng = 0;
        //fps鐩稿叧
        this.fpsDemo = null;//鏄剧ずfps淇℃伅
        this.fps = 0;
        this.oldTime = Date.now();

        this.addVal = 9;//杞崲娆℃暟
        this.loop = 0;//寰幆娆℃暟
        this.nowLoop = 0;//褰撳墠寰幆娆℃暟

        this.string = string||"0,0,0";
        this.init();
    }
    fStruct.prototype = {
        constructor:fStruct,
        init:function(){
            this.z.style.transitionDuration = "0ms";
            this.f.style.transitionDuration = "0ms";
            this.f.style.transform = "rotateY(270deg) translate3D("+this.string+")";
            this.f.style.display = "none";
            this.z.style.transform = "rotateY(0deg) translate3D("+this.string+")";
            this.nowShow = "z";
            this.zNowAng = 0;
            this.fNowAng = 270;
        },
        change:function(){
            if(  this.amt == true){
                return;
            }
            this.zEndAng = this.zNowAng==0?90:360;
            this.fEndAng = this.fNowAng==0?90:360;
            this.amt = true;
            this.f.style.display = "";
            this.z.style.display = "";
            this.amtStart&&this.amtStart(this);
            this.tick();

        },
        //姣忎竴甯ц皟鐢�
        addZ:function(){
            if(this.zNowAng+this.addVal>this.zEndAng){
                this.zNowAng=this.zEndAng;
            }else{
                this.zNowAng+=this.addVal;
            }
            this.z.style.transform = "rotateY("+this.zNowAng+"deg) translate3D("+this.string+")";
        },
        addF:function(){
            if(this.fNowAng!=this.fEndAng){
                if(this.fNowAng+this.addVal>this.fEndAng){
                    this.fNowAng = this.fEndAng;
                }else{
                    this.fNowAng+=this.addVal;
                }
            }
            this.f.style.transform = "rotateY("+this.fNowAng+"deg) translate3D("+this.string+")";
        },
        frame:function(){
            if(Date.now()-this.oldTime>1000){
                this.fpsDemo&&(this.fpsDemo.innerHTML = this.fps);
                this.fps=0;
                this.oldTime = Date.now();

            }else{
                this.fps++;

            }
            if(this.nowShow=="z"){
                if(this.zNowAng!=this.zEndAng){
                    this.addZ();
                }else{
                    this.addF();
                }
            }else{
                if(this.fNowAng!=this.fEndAng){
                    this.addF();
                }else{
                    this.addZ();
                }
            }
        },
        //鍙栨秷鍔ㄧ敾
        cancelTick:function(){
            cancelAnimationFrame(this.tickerInt);
        },
        amtEnd:function(){
            this.fNowAng = this.fNowAng==90?270:0;
            this.zNowAng =this.zNowAng==90?270:0;
            this.amt = false;
            if(this.nowShow=="z"){
                this.z.style.display="none";
                this.nowShow = "f";
            }  else if(this.nowShow == "f"){
                this.f.style.display="none";
                this.nowShow ="z";
            }
            if(this.loop == "infinite"){
                this.change();
            }else{
                if(this.nowLoop == this.loop){
                    this.nowLoop = 0;
                }else{
                    this.change();
                    this.nowLoop++;
                }
            }
            this.endCall&&this.endCall(this);
        },
        //妯℃嫙缁ф柇鍣�
        tick:function(){
            var THIS = this;
            cancelAnimationFrame(this.tickerInt);
            this.tickerInt = requestAnimationFrame(function(){
                THIS.tick();
            });
            this.frame();
            if(this.fNowAng==this.fEndAng&&this.zNowAng==this.zEndAng){
                this.cancelTick();
                this.amtEnd();
            }
        }
    };
    //鏈€澶х埗鑺傜偣 绫绘暟缁� 瀛楃涓�(涓嶅甫鐐�) 瀛楃涓�(涓嶅甫鐐�) 姣斿垪 甯冨皵
    var rotateEx = function(allParent,parent,faceClass,backClass,Proportion,isInit){
        this.parentEles = parent;
        this.allParent = allParent;//鏈€澶х殑瀹瑰櫒鑺傜偣
        this.faceClass = faceClass||"face";
        this.backClass = backClass||"back";
        this.tickerInt = 0;
        this.faceEles = [];
        this.backEles = [];
        this.structArr = [];
        this.positionArr = [];
        this.errorMsg = -1;
        this.addXSpeed = 3;
        this.proportion = Proportion||1;//鍏冪礌涔嬮棿鐨勪袱涓棿闅斿拰鍏冪礌鏈€宸﹁竟鐨勪袱涓殑闂撮殧姣斾緥
        this.type = "allFace";
        this.amtType = "f";
        this.amtInt = 0;
        this.faceClassInfo = {
            arr:[],
            className:""
        };
        if(isInit){
            this.init();
        }

    };
    rotateEx.prototype = {
        constructor:win.rotateEx,
        //鍒濆鍖栫浉鍏�
        init:function(){
            this.dispose();
            this.initFace();
            this.initBack();
            if(this.errFun()){
                return;
            };
            this.initPositionArr();
            this.initParentPos();
            this.initStruct();
            this.allFace();
        },
        //鍒濆鍖栬儗閮ㄦ樉绀鸿妭鐐�
        initBack:function(){
            var THIS = this;
            $.each(this.parentEles,function(i,item){
                var ele = this.getElementsByClassName(THIS.backClass);
                if(ele.length == 1){
                    $.each(THIS.faceClassInfo.arr,function(i2){
                        if(i==this){
                            ele[0].setAttribute("class",ele[0].getAttribute("class")+" "+THIS.faceClassInfo.className);
                        }
                    });
                    THIS.backEles.push(ele[0]);
                }else{
                    THIS.errorMsg = "閿欒锛氭病鏈夎儗闈㈡樉绀鸿妭鐐规垨鑰呰儗闈㈡樉绀鸿妭鐐硅繃澶�";
                }
            });
        },
        //鍒濆鍖栫粨鏋勫彉閲�
        initStruct:function(){
            var THIS = this;
            $.each(this.parentEles,function(i,item){
                var struct = new fStruct(THIS.faceEles[i],THIS.backEles[i]);
                THIS.structArr.push(struct);
                struct.endCall=THIS.itemAmtEnd.bind(THIS);
                struct.amtStart = THIS.itemAmtStart.bind(THIS);
            });
        },
        //鍒濆鍖栨闈㈡樉绀鸿妭鐐�
        initFace:function(){
            var THIS = this;
            $.each(this.parentEles,function(i,item){
                var ele = this.getElementsByClassName(THIS.faceClass);
                if(ele.length == 1){
                    THIS.faceEles.push(ele[0]);
                }else{
                    THIS.errorMsg = "閿欒锛氭病鏈夋闈㈡樉绀鸿妭鐐规垨鑰呮闈㈡樉绀鸿妭鐐硅繃澶�";
                }
            });
        },
        //鍒濆鍖栧畾浣嶄俊鎭�
        initPositionArr:function(){
            var THIS = this;
            var apW = this.allParent.offsetWidth,apH = this.allParent.offsetHeight;
            THIS.positionArr = [];
            $.each(this.parentEles,function(i,item){
                var x = 0,
                    y = 0,
                    w = this.offsetWidth,
                    h = this.offsetHeight;

                var jg1 = (apW - w*3 )* THIS.proportion/(THIS.proportion+1)/2,
                    jg2 = (apW - w*3 )* 1/(THIS.proportion+1)/2,
                    jg3 = (apH - h*3)/2;
                var elePosX = apW/2 - w/2;
                var elePosY = apH/2 - h/2;

                if(i<=2){
                    x = w*i+jg2+jg1*(i) - elePosX;
                    y = 0 - elePosY;
                    THIS.positionArr.push({
                        x:x,
                        y:y,
                        nx:x,
                        ny:y,
                        b:Math.abs(y/x)==Infinity?h/w:Math.abs(y/x),
                        addX:x<0?THIS.addXSpeed:-THIS.addXSpeed,
                        translate3DStr:x+"px,"+y+"px,"+"0"
                    });
                }else if(i>2&&i<=4){
                    if(i==3){
                        x = w*(i-3)+jg2+jg1*(i-3) - elePosX;
                    }else if(i==4){
                        x = w*2+jg2+jg1*2 - elePosX;
                    }
                    y = h+jg3 - elePosY;
                    THIS.positionArr.push({
                        x:x,
                        y:y,
                        nx:x,
                        b:Math.abs(y/x)==Infinity?h/w:Math.abs(y/x),
                        ny:y,
                        addX:x<0?THIS.addXSpeed:-THIS.addXSpeed,
                        translate3DStr:x+"px,"+y+"px,"+"0"
                    });
                }else if(i>=5){
                    x = w*(i-5)+jg2+jg1*(i-5) - elePosX;
                    y = h*2+jg3*2 - elePosY;

                    THIS.positionArr.push({
                        x:x,
                        y:y,
                        nx:x,
                        ny:y,
                        b:Math.abs(y/x)==Infinity?h/w:Math.abs(y/x),
                        addX:x<0?THIS.addXSpeed:-THIS.addXSpeed,
                        translate3DStr:x+"px,"+y+"px,"+"0"
                    });
                }

            });
        },
        //鍒濆鍖杙arent瀹氫綅淇℃伅
        initParentPos:function(){
            var THIS = this;
            $.each(this.parentEles,function(i,item){

                this.style.transform = "translate3D("+THIS.positionArr[i].translate3DStr+")";
            });
        },
        //閿欒澶勭悊鍜岄攢姣佺浉鍏�
        errFun:function(){
            if(this.errorMsg!=-1){
                this.dispose();
                return true;
            }
        },
        itemAmtStart:function(){
            this.indexAmtStart&&this.indexAmtStart(this);
        },
        itemAmtEnd:function () {
            this.indexAmtEnd&&this.indexAmtEnd(this);
            var str = "f";
            var int = 0;
            var isZhong = -1;
            $.each(this.structArr,function(i,item){
                if(i==0){
                    if(this.nowShow=="z"){
                        str = "z";
                    }
                }
                if(str!=this.nowShow){
                    int++;
                }
                if(int>=1){
                    isZhong =1;
                }
            });
            if(isZhong==-1){
                if(str == "z"){isZhong = 2;}else if(str == "f"){isZhong = 0;}
            }

            if(isZhong==1){this.type="center"}else if(isZhong==0){this.type="allBack"}else if(isZhong == 2){this.type="allFace"}
            if(this.amtInt == this.parentEles.length-1){
                this.amtInt = 0;
                this.allTypeAmt&&this.allTypeAmt(this);
            }else{
                this.amtInt++;
            }

        },
        dispose:function(){
            this.faceEles = [];
            this.backEles = [];
            this.structArr = [];
            this.positionArr = [];
        },
        //鐘舵€佸垏鎹㈢浉鍏�
        faceIndex:function(index){
            if( this.structArr[index].nowShow == "f"){
                this.structArr[index].change();
            }
        },
        backIndex:function(index){
            if( this.structArr[index].nowShow == "z"){
                this.structArr[index].change();
            }
        },
        toggleIndex:function(index){
            this.structArr[index].change();
        },
        allBack:function(){
            var THIS = this;
            $.each(this.structArr,function(){
                if(this.nowShow == "z"){
                    this.change();
                }
            });
            this.type = "allBack";
        },
        allFace:function(){
            $.each(this.structArr,function(){
                if(this.nowShow == "f"){
                    this.change();
                }
            });
            this.type ="allFace";
        },
        toggle:function(){
            if(this.type == "allFace"){
                this.allBack();
            }else{
                this.allFace();
            }
        },
        //鍒濆鍔ㄧ敾
        //妯℃嫙缁ф柇鍣�
        amtEnd:function(){
        },
        cancelTick:function(){
            cancelAnimationFrame(this.tickerInt);
        },
        tick:function(){
            var THIS = this;
            cancelAnimationFrame(this.tickerInt);
            this.tickerInt = requestAnimationFrame(function(){
                THIS.tick();
            });
            this.frame();
        },
        changeX:function(o){
            if(this.amtType =="s"){
                if(o.x>0){
                    if(o.nx-this.addXSpeed<=0){
                        o.nx=0
                    }else{
                        o.nx-=this.addXSpeed;
                    }
                }else if(o.x<0){
                    if(o.nx+this.addXSpeed>=0){
                        o.nx=0
                    }else{
                        o.nx+=this.addXSpeed;
                    }
                }
            }else if(this.amtType == "f"){
                if(o.x>0){
                    if(o.nx+this.addXSpeed>=o.x){
                        o.nx=o.x
                    }else{
                        o.nx+=this.addXSpeed;
                    }
                }else if(o.x<0){
                    if(o.nx-this.addXSpeed<=o.x){
                        o.nx=o.x
                    }else{
                        o.nx-=this.addXSpeed;
                    }
                }
            }
        },
        changeY:function(o){
            if(this.amtType ==="s"){
                if(o.y>0){
                    if(o.ny-this.addXSpeed*o.b<=0){
                        o.ny=0
                    }else{
                        o.ny-=this.addXSpeed*o.b;
                    }
                }else if(o.y<0){
                    if(o.ny+this.addXSpeed*o.b>=0){
                        o.ny=0
                    }else{
                        o.ny+=this.addXSpeed*o.b;
                    }
                }
            }else if(this.amtType === "f"){
                if(o.y>0){
                    if(o.ny+this.addXSpeed*o.b>=o.y){
                        o.ny=o.y
                    }else{
                        o.ny+=this.addXSpeed*o.b;
                    }
                }else if(o.y<0){
                    if(o.ny-this.addXSpeed*o.b<=o.y){
                        o.ny=o.y
                    }else{
                        o.ny-=this.addXSpeed*o.b;
                    }
                }
            }
        },
        getZNum:function(){
            var fNum = 0;
            $.each(this.structArr,function(){
                if(this.nowShow=="z"){
                    fNum++;
                }
            });
            return fNum;
        },
        getFNum:function(){
            var fNum = 0;
            $.each(this.structArr,function(){
                if(this.nowShow=="f"){
                    fNum++;
                }
            });
            return fNum;
        },
        frame:function(){
            var THIS = this;
            var isCancel = true;
            $.each(this.parentEles,function(i,item){
                var o = THIS.positionArr[i];
                if(THIS.amtType =="s"){

                    if(o.nx!=0||o.ny!=0){
                        isCancel = false;
                        THIS.changeX(o);
                        THIS.changeY(o);
                    }
                }else if(THIS.amtType =="f"){
                    if(o.nx!=o.x||o.ny!=o.y){
                        isCancel = false;
                        THIS.changeX(o);
                        THIS.changeY(o);
                    }
                }
                THIS.positionArr[i].translate3DStr=THIS.positionArr[i].nx+"px,"+THIS.positionArr[i].ny+"px,"+"0px";
                this.style.transform = "translate3D("+THIS.positionArr[i].translate3DStr+")";
            });
            if(isCancel){
                THIS.cancelTick();
                THIS.amtEnd&&THIS.amtEnd();
            }
        },
        shrinkAmt:function(f){
            if(this.amtType!=="s"){
                this.amtType = "s";
                this.tick();
            }
            this.amtEnd = f;
        },
        enlargeAmt:function(f){
            if(this.amtType!=="f"){
                this.amtType = "f";
                this.tick();
            }
            this.amtEnd = f;
        }
    };
    function getFirstChild(ele){
        var ele2 = ele.firstChild;
        while(ele2){
            if(ele2.nodeType==1){
                return ele2;
            }
            ele2 = ele2.nextSibling;

        }
    }
    //jquery鐗堟湰
    $.fn.rotateEx =  function(opt){
        var o = {};
        var defOpt = {
            itemClass:"item",
            backClass:"back",//鑳岄潰class
            faceClass:"face",//姝ｉ潰class
            noFaceEle:[],//涓嶈兘缈荤殑鐗岀殑鑺傜偣绱㈠紩
            noFaceClass:"noFace",//涓嶈兘缈荤殑鐗岀殑class
            bz:27/30, //涓や釜鐗屽乏鍙充箣闂寸殑璺濈鍜岀涓€寮犵墝璺濈椤甸潰宸﹁竟鐨勬瘮渚�
            clickName:"click",//鐐瑰嚮浜嬩欢鐨勫悕绉�
            maxNum:1,//鏈€澶х炕鐗屾暟閲�
            changeAmtCall:function($this,rotateObj,allO){},//鐗屼粠姝ｉ潰鍒囨崲鍒板弽闈㈠姩鐢荤粨鏉熻皟鐢�
            init:function($this,rotateObj,allO){},//瀵硅薄鍒涘缓缁撴潫鐨勫洖璋冨嚱鏁�
            clickAmtStart:function($this,rotateObj,ele,allO){//缈荤墝鐨勬椂鍊欏姩鐢诲紑濮嬭皟鐢ㄥ洖璋�

            },
            clickAmtEnd:function($this,rotateObj,ele,allO){//缈荤墝鐨勬椂鍊欏姩鐢荤粨鏉熻皟鐢ㄥ洖璋�

            },
            maxNumCall:function($this,rotateObj,allO,num){} //杈惧埌鏈€澶х炕鐗屾暟鐨勫洖璋�
        };
        $.extend(defOpt,opt);

        var THIS = this;
        var rotateObj = new rotateEx(this[0],this.find("."+defOpt.itemClass),defOpt.faceClass,defOpt.backClass,defOpt.bz,false);
        o.option = defOpt;
        o.ele = this;
        o.rotate = rotateObj;
        window.addEventListener("resize",function(){

            rotateObj.initPositionArr();
            rotateObj.initParentPos();
        });
        rotateObj.faceClassInfo = {
            arr:defOpt.noFaceEle,
            className:defOpt.noFaceClass
        };
        rotateObj.init();
        rotateObj.indexAmtStart = function(){
            if(isClick){
                defOpt.clickAmtStart(THIS,rotateObj,clickEle,o);
            }
        };
        var isClick = false;
        var clickEle = null;
        rotateObj.indexAmtEnd = function(){
            if(isClick){
                isClick = false;
                defOpt.clickAmtEnd(THIS,rotateObj,clickEle,o);

            }
        };
        defOpt.init(this,rotateObj,o);
        rotateObj.allTypeAmt = function(){
            if(this.type === "allBack"){
                this.shrinkAmt(function(){
                    this.enlargeAmt(function(){
                        defOpt.changeAmtCall(THIS,rotateObj,o);
                    });
                });
            }
        };
        var tapEle = this.find(".selectBox");
        tapEle.on(defOpt.clickName,function(){
            if(rotateObj.type==="allFace"){
                rotateObj.allBack();
            }
        });
        var allEle = this.find("."+defOpt.itemClass);
        function testF(){

            if(rotateObj.getZNum()<defOpt.maxNum){
                return true;
            }else{
                defOpt.maxNumCall(THIS,rotateObj,o,rotateObj.getZNum());
                return false;
            }

        }
        allEle.on(defOpt.clickName,function(e){
            e.stopPropagation();

            if(rotateObj.type==="allFace"){
                return
            }
            var index = allEle.index(this);
            var bool = true;

            $.each(defOpt.noFaceEle,function(){
                if(index == this){
                    bool=false;
                }
            });
            if(bool&&isClick===false&&testF()){
                isClick = true;
                clickEle = this;
                rotateObj.faceIndex(index);
            }
        });
        //闅忔満鎵撲贡濂栭」
        o.reset = function(){
            var allEle = this.rotate.faceEles;
            var bufChild = null;
            var len = allEle.length;
            $.each(allEle,function(i,item){
                var s = parseInt(Math.random()*(len-i)) + i;
                var child = getFirstChild(this);
                bufChild= getFirstChild(allEle[s]);
                allEle[s].appendChild(child);
                this.appendChild(bufChild);
            })
        };
        o.toBack = function(){
            o.rotate.allBack();
        }
        return o;
    };
})(window);