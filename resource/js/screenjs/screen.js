define('screenbigcj', ['screencore', 'layerBox', 'template'], function (screencore, layerBox, template) {
    var screenbigcj = {
        alluser: [],
        currentIndex: 2,
        currentImg: '',
        currentUid: 0,
        flsh: true,
        roundThree: 0,
        prizeList: [],
        round: 0,
        end: false,
        prize: [
            {
                prize: '一等奖',
                level: 1,
                num: 3,
                need: 4,
                txt: '一等奖中奖名单'
            },
            {
                prize: '三等奖',
                level: 3,
                num: 13,
                need: 5,
                txt: '三等奖中奖名单'
            },
            {
                prize: '四等奖',
                level: 4,
                num: 20,
                need: 10,
                txt: '四等奖中奖名单'
            }
        ],
        maxid: 0,
        init: function () {
            var self = this;
            if (self.currentIndex == 2 && !self.end && self.round < 2) {
                layerBox.showImgpreview('./resource/imgs/four' + (self.round + 1) + '.png', ['400px', '400px'], 'width:400px;height:400px')
            }
            self.ajaxusers(function () {
                self.createwall();
                self.getPrize();
                self.bindevent();
                setTimeout(function () {
                    // self.getnewUser();
                }, 10e3);
            });
        },
        ajaxusers: function (fn) {
            var self = this;
            screencore.ajaxSubmit('/api/gp').then(function (e) {
                if (e.code == 1) {
                    self.alluser = e.data;
                    fn && fn();
                } else {
                    layerBox.showMsg(e.msg);
                }
            });
        },
        getPrize: function () {
            var self = this;
            var html = '';
            $.each(self.prize, function (i, v) {
                html += '<li data-onceout="' + v.need + '" data-index="' + i + '">' + v.prize + '</li>'
            })
            $(".bigcj-prizelist").html(html);
        },
        chunk: function (arr, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(arr.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(arr.slice(start, end));
            }
            return result;
        },
        createwall: function () {
            var self = this;
            var f = true;
            for (var i = 0; i < bigcj.cols; i++) {
                var colrow = '<div class="avatarcols">';
                for (var j = 0; j < bigcj.colrows; j++) {
                    var key = (i * bigcj.colrows + j);
                    var uavatar = self.alluser[key] ? self.alluser[key].img_url : (self.alluser.length > 0 ? self.alluser[Math.floor(Math.random() * self.alluser.length)].img_url : bigcj.defaultavatar);
                    if (uavatar == 'http://cj.jm.cc/upload/20210206/141421601e33bd70d34DymTHB.jpg') {
                        if (f) {
                            f = false;
                        } else {
                            uavatar = 'http://cj.jm.cc/upload/20210204/201503601be5478c38bGrlNrq.jpg';
                        }
                    }
                    colrow += template("oneavatar-tpl", {avatar: uavatar, isyes: (self.alluser[key] ? true : false)});
                }
                colrow += '</div>';
                $('.bigcj-avatarBox').append(colrow);
            }
            $('.bigcj-avatarBox .avatarbox').height($('.bigcj-avatarBox .avatarbox').eq(0).width() * 1.593);
            var q = Math.pow, screenW = $('body').width(), colnums = $('.avatarcols').length;
            for (var n = 0; n < colnums; n++) {
                var h = (colnums + 1) / 2, i = Math.abs(n + 1 - h), j = screenW / 2,
                    k = Math.sqrt(q(j, 2) - q(i / h * j, 2));
                var l = bigcj.shape == '1' ? (1 - 0.3 * ((k - j / 3) / (j - j / 3))) : bigcj.shape == '2' ? (0.56 + 0.4 * ((k - j / 4) / (j - j / 4))) : 0.8;
                $('.avatarcols').eq(n).css({
                    transform: 'scale(' + l * 1.1 + ')',
                    margin: '0 ' + (l / 2 - 0.4) * 56 + 'px'
                })
            }
        },
        bindevent: function () {
            var self = this;
            $(window).on('resize', function () {
                $('.bigcj-avatarBox .avatarbox').height($('.bigcj-avatarBox .avatarbox').eq(0).width());
            });
            $('.start_btn').on('click', function () {
                layerBox.closeLayer();

                var $this = $(this), btntxt = $this.text();
                if ($this.hasClass('isining')) return;
                if (btntxt == '开始抽奖') {
                    $('.bigcj-prizeusers').hide();
                    var json = json1 = {};
                    json.all = 0
                    json1.level = self.prize[self.currentIndex].level
                    json.num = $(".cz_input").val();
                    $(".back_btn").hide()
                    $(".popBox-ul2").css({
                        'z-index': 0,
                        'opacity': 0,
                        '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,-180deg)',
                        'box-shadow': 'none'
                    })
                    $(".popBox-ul1").css({
                        'z-index': 1,
                        'opacity': 1,
                        '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,0deg)'
                    })
                    var f = self.currentIndex == 0 || self.currentIndex == 1;
                    // 获取奖品
                    f && screencore.ajaxSubmit('/api/get_prize_list', json1).then(function (e) {
                        if (e.code == 1) {

                            self.prizeList = e.data;
                            if (self.currentIndex == 1) {
                                var outluckerRender = template('outlucker-tpl2');
                                var html = '';
                                $.each(self.chunk(self.prizeList, 5)[self.roundThree], function (i1, v1) {
                                    html += outluckerRender(v1);
                                })
                                self.roundThree = self.roundThree + 1;

                                // $(".bigcj-popBox .popBox-ul2").css('width', '45%');
                                // $(".back_btn").css('bottom', '20px')
                                // $(".popBox-ul2 li,.popBox-ul2 li .face,.popBox-ul2 li .face img").css({
                                //     'height': '150px',
                                //     'width': '93px'
                                // })
                                // $(".popBox-ul2 .parent,.popBox-ul2 .face,.popBox-ul2 .back").css('height', 150)
                                // $(".popBox-ul2 .back").css('height', 150)
                            } else if (self.currentIndex == 0) {
                                // $(".bigcj-popBox .popBox-ul2").css('width', '75%');
                                var outluckerRender = template('outlucker-tpl2');
                                var html = '';
                                $.each(e.data, function (i1, v1) {
                                    html += outluckerRender(v1);
                                })

                            }
                            $(".bigcj-popBox .popBox-ul2").html(html);
                            $(".bigcj-popBox .popBox-ul2 li").hover(function () {
                                if ($(this).find('.back').css('z-index') == 1) {
                                    $(this).addClass('animate__headShake')
                                }
                            }, function () {
                                $(this).removeClass('animate__headShake')
                            })
                            $(".bigcj-popBox .popBox-ul2 li").click(function () {
                                var that = $(this)
                                if (that.hasClass('hasSelect')) {
                                    return false;
                                }
                                var url = '/api/draw';
                                var json = {};
                                json.level = self.prize[self.currentIndex].level
                                json.mid = self.currentUid
                                json.pos = that.index('.bigcj-popBox .popBox-ul2 li')
                                screencore.ajaxSubmit(url, json).then(function (e) {
                                    if (e.code == 1) {
                                        if (e.data.prize.length > 0) {
                                            that.addClass('hasSelect')
                                            var imgsrc = e.data.prize[0].img;
                                            that.find('.face img').attr('src', imgsrc);
                                            self.currentImg = imgsrc;
                                            $(".cj" + self.currentUid).addClass('yc')
                                            $(".cj" + self.currentUid).find(".face img").attr('src', imgsrc)
                                            $(".cj" + self.currentUid).find('.parent_zz').hide();
                                            that.find('.back').css({
                                                'z-index': 0,
                                                '-webkit-transform': 'rotate3d(0,1,0,-180deg)',
                                                'box-shadow': 'none'
                                            })
                                            that.find('.face').css({
                                                'z-index': 1,
                                                '-webkit-transform': 'rotate3d(0,1,0,0deg)'
                                            })
                                        }

                                    } else {
                                        layerBox.showMsg(e.msg);
                                    }
                                })

                            })
                        } else {
                            layerBox.showMsg(e.msg);
                        }
                    }, function () {
                        $(".bigcj-popBox .popBox-ul1").empty();
                        layerBox.showMsg('网络异常，抽奖出错');
                    });

                    screencore.ajaxSubmit('/api/rand_mem', json).then(function (e) {
                        if (e.code == 1) {
                            screencore.hideFootAndQr();
                            $(".bigcj-cubebox .bigcj-awardbox,.bigcj-cubebox .bigcj-cube,.bigcj-cubebox .bigcj-sex").css({"opacity": "0"});//隐藏立体盒子
                            $('.bigcj-avatarBox .avatarbox').removeClass('avatar_shadow');
                            $('.bigcj-mask1, .bigcj-mask2').addClass('maskopen');
                            setTimeout(function () {
                                $('.bigcj-mask1, .bigcj-mask2').width(0), $('.bigcj-mask1, .bigcj-mask2').removeClass('maskopen')
                            }, 1e3);
                            for (var b = 0; b < $('.bigcj-avatarBox .avatarbox').length / 2; b++) {
                                $('.bigcj-avatarBox .avatarbox').eq(b).addClass('avatar_rotate' + Math.ceil(Math.random() * 5));
                                $('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay', b / 40 + 's');
                            }
                            for (var c = $('.bigcj-avatarBox .avatarbox').length; c >= $('.bigcj-avatarBox .avatarbox').length / 2; c--) {
                                $('.bigcj-avatarBox .avatarbox').eq(c).addClass('avatar_rotate' + Math.ceil(Math.random() * 5));
                                $('.bigcj-avatarBox .avatarbox').eq(c).css('animation-delay', ($('.bigcj-avatarBox .avatarbox').length - c) / 40 + 's')
                            }
                            // setInterval(function () {
                            //     for (var c = 0; c < $('.bigcj-avatarBox .avatarbox').length ; c++) {
                            //         $('.bigcj-avatarBox .avatarbox').eq(c).find('img').attr('src',$('.bigcj-avatarBox .avatarbox').eq(Math.floor(Math.random()*$('.bigcj-avatarBox .avatarbox').length)).find('img').attr('src'))
                            //     }
                            // },500)
                            $("#bgmusic").length > 0 && $("#bgmusic").get(0).pause();
                            $("#cjing").get(0).play();
                            $this.text('发牌中..').addClass('isining');
                            var outluckerRender = template('outlucker-tpl');
                            var html = '';
                            e.data.users = typeof e.data.users == 'string' ? e.data.users.split(',') : e.data.users
                            $.each(e.data.users, function (i1, v1) {
                                $.each(self.alluser, function (i, v) {
                                    if (v.uid == v1) {
                                        v.current = self.currentIndex;
                                        v.end = self.end
                                        html += outluckerRender(v);
                                    }
                                });
                            })
                            if (self.currentIndex == 0) {
                                self.end = true;
                                self.round = 0
                                self.roundThree = 0
                            }
                            $(".bigcj-popBox .popBox-ul1").html(html);
                            if (self.currentIndex == 2) {
                                self.round = self.round + 1;
                                $(".bigcj-popBox .popBox-ul1").css('width', '68%');
                                if(!self.end){
                                    $(".back_btn").show().css('bottom', '20px');
                                }
                            } else {
                                $(".bigcj-popBox .popBox-ul1").css('width', '75%');
                                $(".back_btn").hide().css('bottom', '80px');
                            }
                            $(".bigcj-popBox .popBox-ul1 li").hover(function () {
                                if (!$(this).hasClass('yc')) {
                                    $(this).find('.parent_zz').show();
                                }
                            }, function () {
                                $(this).find('.parent_zz').hide();
                            })
                            $(".bigcj-popBox .popBox-ul1 .b_btn").click(function () {
                                var that = $(this)
                                var dom = $(this).parents('li');
                                dom.addClass('qy');
                                dom.find('.face').css({
                                    'z-index': 0,
                                    '-webkit-transform': 'rotate3d(0,1,0,-180deg)',
                                    'box-shadow': 'none'
                                })
                                dom.find('.back').css({
                                    'z-index': 1,
                                    '-webkit-transform': 'rotate3d(0,1,0,0deg)'
                                })
                                dom.find('.parent_zz').hide();
                            })
                            $(".back_btn").unbind('click').click(function () {
                                if (self.currentIndex == 2) {
                                    var arr = [];
                                    for (var i = 0; i < $(".popBox-ul1 li").length; i++) {
                                        if (!$(".popBox-ul1 li").eq(i).hasClass('qy')) {
                                            arr.push($(".popBox-ul1 li").eq(i).attr('data-uid'))
                                        }
                                    }
                                    var json2 = {}
                                    if (self.end) {
                                        json2.is_last = 1;
                                    }
                                    json2.round = self.round;
                                    json2.mids = arr.join(',');

                                    screencore.ajaxSubmit('/api/draw4', json2).then(function (e) {
                                        if (e.code == 1) {
                                            $(".bigcj-popBox").removeClass('bigcj-popBox-ani');
                                            bigcj.hideavatarwall == '1' && $(".bigcj-avatarBox").css({'opacity': '1'});
                                            $('.bigcj-setbox').show();
                                            $(".bigcj-cubebox .bigcj-awardbox,.bigcj-cubebox .bigcj-cube,.bigcj-cubebox .bigcj-sex").css({"opacity": "1"});
                                            $("#bgmusic").length > 0 && $("#bgmusic").get(0).play();
                                            if (self.currentIndex == 2 && !self.end && self.round < 2) {
                                                layerBox.showImgpreview('./resource/imgs/four' + (self.round + 1) + '.png', ['400px', '400px'], 'width:400px;height:400px')
                                            }
                                            $(".back_btn").hide();
                                            if (self.end) {
                                                $(".bigcj-setname2").html('剩余奖品');

                                                screencore.ajaxSubmit('/api/sy', {level: self.prize[self.currentIndex].level}).then(function (e) {
                                                    if (e.code == 1) {
                                                        $(".cz_input").val(e.data.total);
                                                        $(".add").attr('data-total', e.data.total);
                                                    } else {
                                                        layerBox.showMsg(e.msg);
                                                    }
                                                });
                                            }
                                        } else {
                                            layerBox.showMsg(e.msg);
                                        }
                                    })

                                } else {
                                    $(".popBox-ul2").css({
                                        'z-index': 0,
                                        'opacity': 0,
                                        '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,-180deg)',
                                        'box-shadow': 'none'
                                    })
                                    $(".popBox-ul1").css({
                                        'z-index': 1,
                                        'opacity': 1,
                                        '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,0deg)'
                                    })
                                    $(".back_btn").hide();

                                }
                                $(".bigcj-popBox-close").show();
                            })
                            $(".bigcj-popBox .popBox-ul1 .t_btn").click(function () {
                                $(".back_btn").show()
                                self.currentUid = $(this).attr('data-uid');
                                $(".bigcj-popBox-close").hide();
                                $(".popBox-ul1").css({
                                    'z-index': 0,
                                    'opacity': 0,
                                    '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,-180deg)',
                                    'box-shadow': 'none'
                                })
                                $(".popBox-ul2").css({
                                    'z-index': 1,
                                    'opacity': 1,
                                    '-webkit-transform': 'translate(-50%, -50%) rotate3d(0,1,0,0deg)'
                                })
                            })
                            setTimeout(function () {
                                $this.text('停止抽奖').removeClass('isining');
                            }, 3e3);
                        } else {
                            layerBox.showMsg(e.msg);
                        }
                    }, function () {
                        $(".bigcj-popBox .popBox-ul1").empty();
                        layerBox.showMsg('网络异常，抽奖出错');
                    });
                } else {
                    var popBoxprize = $(".bigcj-popBox-prize").find('span'), selprize = $(".bigcj-prizelist li.issel");
                    popBoxprize.eq(0).text(self.prize[self.currentIndex].txt);
                    bigcj.hideavatarwall == '1' && $(".bigcj-avatarBox").css({'opacity': '0'});
                    $(".bigcj-popBox").addClass('bigcj-popBox-ani');
                    $('.bigcj-avatarBox .avatarbox').removeClass().addClass('avatarbox');
                    $('.bigcj-avatarBox .avatarbox').addClass('avatar_scale ');
                    for (var g = 0; g < $('.bigcj-avatarBox .avatarbox').length; g++) {
                        (function (b) {
                            setTimeout(function () {
                                $('.bigcj-avatarBox .avatarbox').eq(b).removeClass('avatar_scale');
                                $('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay', '0s');
                                $('.bigcj-avatarBox .avatarbox').eq(b).addClass('avatar_shadow');
                            }, 1e3 * parseFloat($('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay')) + 400)
                        })(g);
                    }
                    $('.bigcj-mask1, .bigcj-mask2').addClass('maskclose');
                    setTimeout(function () {
                        $('.bigcj-mask1, .bigcj-mask2').width('50%'), $('.bigcj-mask1, .bigcj-mask2').removeClass('maskclose')
                    }, 1e3);
                    $("#cjing").get(0).pause();
                    $("#cjend").get(0).play();
                    $this.text('开始抽奖');
                    $(".bigcj-setbox").hide();
                }
            });
            $(".bigcj-popBox .bigcj-popBox-close").on('click', function () {
                $(".bigcj-popBox").removeClass('bigcj-popBox-ani');
                if (self.currentIndex == 2 && !self.end && self.round < 2) {
                    layerBox.showImgpreview('./resource/imgs/four' + (self.round + 1) + '.png', ['400px', '400px'], 'width:400px;height:400px')
                }
                bigcj.hideavatarwall == '1' && $(".bigcj-avatarBox").css({'opacity': '1'});
                $('.bigcj-setbox').show();
                if (self.currentIndex == 2 && !self.end && self.round < 2) {
                    layerBox.showImgpreview('./resource/imgs/four' + (self.round + 1) + '.png', ['400px', '400px'], 'width:400px;height:400px')
                }
                $(".bigcj-cubebox .bigcj-awardbox,.bigcj-cubebox .bigcj-cube,.bigcj-cubebox .bigcj-sex").css({"opacity": "1"});
                $("#bgmusic").length > 0 && $("#bgmusic").get(0).play();
                if (self.end) {
                    $(".bigcj-setname2").html('剩余奖品');
                    var url = '';
                    var json2 = {}
                    json2.is_last = 1;
                    var arr = [];
                    for (var i = 0; i < $(".popBox-ul1 li").length; i++) {
                        if (!$(".popBox-ul1 li").eq(i).hasClass('qy')) {
                            arr.push($(".popBox-ul1 li").eq(i).attr('data-uid'))
                        }
                    }
                    if (self.currentIndex == 2) {
                        url = '/api/draw4'
                        json2.mids = arr.join(',');
                        json2.round = self.round;
                    } else {
                        url = '/api/draw'
                        json2.mid = arr.join(',');
                        json2.level = self.prize[self.currentIndex].level
                    }

                    if(self.flsh){
                        self.flsh = false
                        screencore.ajaxSubmit('/api/sy', {level: self.prize[self.currentIndex].level}).then(function (e) {
                            if (e.code == 1) {
                                $(".cz_input").val(e.data.total);
                                $(".add").attr('data-total', e.data.total);
                            } else {
                                layerBox.showMsg(e.msg);
                            }
                        });
                    } else {
                        screencore.ajaxSubmit(url, json2).then(function (e) {
                            $(".back_btn").hide();
                            screencore.ajaxSubmit('/api/sy', {level: self.prize[self.currentIndex].level}).then(function (e) {
                                if (e.code == 1) {
                                    $(".cz_input").val(e.data.total);
                                    $(".add").attr('data-total', e.data.total);
                                } else {
                                    layerBox.showMsg(e.msg);
                                }
                            });

                        })
                    }

                }

            });
            $(".bigcj-prizeusers .bigcj-user-close").on('click', function () {
                $('.bigcj-prizeusers').hide();
            });
            //切换奖品
            $('.bigcj-prizename').on('click', function () {
                if ('show' == bigcj.arraowflag) {
                    var b = 4 < bigcj.prizenum ? 4 : bigcj.prizenum;
                    $(this).nextAll('.bigcj-prizelist').animate({
                        height: 40 * b + 'px'
                    }, 500), bigcj.arraowflag = 'hide', $('.bigcj-setarrow').css('transform', 'rotate(180deg)')
                } else {
                    $(this).nextAll('.bigcj-prizelist').animate({
                        height: 0
                    }, 500);
                    bigcj.arraowflag = 'show';
                    $('.bigcj-setarrow').css('transform', 'rotate(0)');
                }
            });

            $("body").on('click', '.bigcj-prizelist li', function () {
                $('.bigcj-prizename').text($(this).text());
                self.currentIndex = $(this).attr('data-index');

                $(this).addClass('issel').siblings().removeClass('issel');
                $('.bigcj-prizelist').animate({height: 0}, 500);
                bigcj.arraowflag = 'show';
                $('.bigcj-setarrow').css('transform', 'rotate(0)');
                if (self.end) {

                    screencore.ajaxSubmit('/api/sy', {level: self.prize[self.currentIndex].level}).then(function (e) {
                        if (e.code == 1) {
                            $(".cz_input").val(e.data.total);
                            $(".add").attr('data-total', e.data.total);
                        } else {
                            layerBox.showMsg(e.msg);
                        }
                    });
                } else {
                    $('.bigcj-numbox input').val($(this).attr('data-onceout'));
                }
            });
        },
    };
    return screenbigcj;
});
