define("layerBox", ["jquery", "layer"], function ($, layer) {
    var layerBox = {
        showMsg: function (txt,time) {
            var obj = {};
            if(time){
                obj.time = time;
            }
            layer.msg(txt,obj);
        },
        showConfirm: function (title, content, btns, fuc, fuc2) {
            var fuc = fuc || false;
            var fuc2 = fuc2 || false;
            layer.confirm(content, {
                title: title,
                closeBtn: 0,
                shade: 0.6,
                anim: 0,
                move: false,
                resize:false,
                btn: btns,
                btnAlign: "c",
                success: function (layero, index) {
                    this.enterEsc = function (event) {
                        if (event.keyCode === 13) {
                            layer.close(index);
                            if (fuc) {
                                fuc()
                            }
                            return false
                        }
                        if (event.keyCode === 27) {
                            layer.close(index);
                            if (fuc2) {
                                fuc2()
                            }
                            return false
                        }
                    };
                    $(document).on("keydown", this.enterEsc)
                },
                end: function () {
                    $(document).off("keydown", this.enterEsc)
                }
            }, function (index) {
                layer.close(index);
                if (fuc) {
                    fuc()
                }
            }, function (index) {
                layer.close(index);
                if (fuc2) {
                    fuc2()
                }
            })
        },
        showLoading: function (txt) {
            if (txt != "") {
                var layindex = layer.msg(txt, {
                    icon: 16,
                    shade: 0.5,
                    time: 0,
                    resize:false,
                    skin: "zam-layer-loading"
                })
            } else {
                var layindex = layer.load(1);
            }
            return layindex;
        },
        showImgpreview: function (src, area, imgcss) {
            var imgcss = imgcss || false;
            var imgObj = {
                type: 1,
                shade: false,
                title: false,
                move: false,
                resize:false,
                closeBtn: 0,
                area: area,
            };
            if (imgcss) {
                imgObj.content = "<img src='" + src + "' style=" + imgcss + " />"
            } else {
                imgObj.content = "<img src='" + src + "'  />"
            }
            layer.open(imgObj)
        },
        showTips: function (txt, dom, direction, func) {
            var func = func || false;
            var layindex = layer.tips(txt, dom, {
                tips: direction || 1,
                time: -1,
                success: function (e, a) {
                    func && func(e, a)
                }
            });
            $(dom).data("index", layindex)
        },
        showHtml:function(html,success,cancel){
            layer.open({
                type: 1,
                closeBtn:2,
                shade: false,
                title: false,
                resize:false,
                content:html,
                success: function(e, index){
                    success&&success(e,index)
                },
                cancel:function(index,e){
                    cancel&&cancel(e,index);
                },
            });
        },
        closeLayer: function () {
            layer.closeAll()
        },
        close: function (index) {
            layer.close(index)
        },
    };
    return layerBox
});