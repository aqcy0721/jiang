define('screencore',['jquery','layerBox'],function($,layerBox){
    var screencore = {
        debug:false,
        getQueryString:function(key){
            return this.getParas(key);
        },
        getParas: function(name){
            var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
            if (result == null || result.length < 1){
                return "";
            }
            return result[1];
        },
        ajaxSubmit: function(url,params,tips){
            var self = this;
            if ( typeof(tips) != "undefined" ) {
                var layindex = layerBox.showLoading(tips);
            }
            var ajaxObj = $.Deferred();
            $.ajax({
                url:'http://cj.jm.cc'+url,
                type: 'post',
                data:params,
                dataType: 'json'
            }).then(function(json){
                if ( typeof(tips) != "undefined" ) {
                    layerBox.close(layindex);
                }
                ajaxObj.resolve(json);
            }, function(json){
                if ( typeof(tips) != "undefined" ) {
                    layerBox.close(layindex);
                }
                self.alert(json);
                ajaxObj.reject(json);
            });
            return ajaxObj.promise();
        },
        anicss:function(element, animationName, callback){
            var e = this;
            if(!animationName){
                animationName = e.anicssArr();
            }
            $(element).addClass('animated ' + animationName).one('animationend webkitAnimationEnd', function() {
                $(element).removeClass('animated ' + animationName);
                if (typeof callback === 'function') {
                    callback();
                }
            });
            return $(element);
        },
        anicssArr:function(){
            var arr = ['bounceInDown','bounceInLeft','bounceInUp','bounceInRight'];
            var key = Math.floor(Math.random()*arr.length);
            return arr[key];
        },
        alert:function(data){
            if(this.debug){
                alert(JSON.stringify(data));
            }
        },
        hideFootAndQr:function(){
            !$(".hdQrbox").is(':hidden') && $(".control-normal-list .openqr").trigger('click',['1']);
            !$(".footer-controlBox").hasClass('down') && $('.footer-controlBox').trigger('mouseleave');
        },
    };
    return screencore;
});
