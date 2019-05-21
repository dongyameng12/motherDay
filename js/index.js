(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})
(document, window);
$(document).ready(function () {
    //是否关注公众号
    var attention = true;
    // 是否绑定手机号
    var binding = true;
    //是否转增
    var increase;
    // var firstLoading = true;
    // 定时器变量（为了清除定时器）
    var nextPage;
    // 是否第一次进入
    var firstLoading = false;
    (function () {
        var first_login = localStorage.getItem('firstLoading')
        if (first_login == null) {
            localStorage.setItem('firstLoading',true)
            $('#return').hide()
        } else {
            firstLoading = true
        }
    })()

    // 背景音乐和声音的处理start
    var music = document.getElementById('music'),
        ms1 = document.getElementById('ms1'),
        ms2 = document.getElementById('ms2'),
        ms3 = document.getElementById('ms3'),
        ms4 = document.getElementById('ms4'),
        ms5 = document.getElementById('ms5');
    music.load();
    ms1.load();
    ms2.load();
    ms3.load();
    ms4.load();
    ms5.load();
    // music.play();
    // music.pause();
    //bgMusic
    wx.config({
    });
    wx.ready(function () {
        function audioAutoPlay(id){
            var audio = document.getElementById(id),
                play = function(){
                    audio.play();
                    audio.pause();
                    document.removeEventListener("touchstart",play, false);
                };
            audio.play();
            audio.pause();
            document.addEventListener("WeixinJSBridgeReady", function () {
                play();
                music.play();
            }, false);
            document.addEventListener('YixinJSBridgeReady', function() {
                play();
                music.play();
            }, false);
            document.addEventListener("touchstart",play, false);
        }
        // music.pause()
        audioAutoPlay('ms1');
        audioAutoPlay('ms2');
        audioAutoPlay('ms3');
        audioAutoPlay('ms4');
        audioAutoPlay('ms5');
    });
    ~function () {
        var musicMenu = document.getElementById('musicMenu'),
            musicAudio = document.getElementById('music');

        musicMenu.addEventListener('click', function () {
            if (musicAudio.paused) {//->暂停
                musicAudio.play();
                musicMenu.className = 'music move';
                return;
            }
            musicAudio.pause();
            musicMenu.className = 'music';
        }, false);

        function controlMusic() {
            musicAudio.volume = 0.5;
            // musicAudio.pause();
            musicAudio.addEventListener('canplay', function () {
                musicMenu.style.display = 'block';
                musicMenu.className = 'music move';
            }, false);
        }
        window.setTimeout(controlMusic, 1000);
    }();
    // 背景音乐和声音的处理end

    // 翻页turn
    // 初始化turn容器
    function init_turn() {
        function loadApp() {
            var w = $(window).width();
            var h = $(window).height();
            // var h =300;
            //判断是否是移动端
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                //书本初始化
                $('.flipbook').turn({
                    width: w,
                    height: h,//书本的大小
                    direction: "ltr",//书本翻动方向
                    elevation: 50, //在转换期间设置页面的标高。
                    display: "single",//display("double"  "single")  展示一页或者两页，默认double
                    duration: 1000,// 设置翻页动画持续时间即翻页的快慢，默认600(毫秒)
                    gradients: true,//翻页阴影
                    acceleration: true,// 硬件加速，对于触摸设备，一定要设置true
                    autoCenter: false //是否居中 默认false
                });
            } else {
                //书本初始化
                $('.flipbook').turn({
                    width: w,
                    height: h,
                    direction: "ltr",
                    elevation: 50,
                    display: "double",
                    duration: 1000,
                    gradients: true
                });
                var $pages = $(".page");
                if ($pages.length > 0) {
                    for (var i = 0; i < $pages.length; i++) {
                        $pages.eq(i).css("width", w / 2);
                    }
                }
            }
        }
        yepnope({
            test: Modernizr.csstransforms,
            yep: ['js/turn.js'],
            nope: ['js/turn.html4.min.js'],
            both: ['css/basic.css'],
            complete: loadApp
        });
    }
    init_turn();
    //  start：页面启动时触发
    // 当翻动左角和右角时，禁止启动动画
    $(".flipbook").bind("start", function (event, pageobject, corner) {
        if (corner == "tl" || corner == "tr") {
            event.preventDefault();
        }
    })
    // 首次（定时器控制自动翻页）
    function time_auto() {
        nextPage = setInterval(function () {
            next_page();
        }, 2000);
    }
    // 第一页
    $('.flipbook').bind("first", function () {
        clearInterval(nextPage);
    })
    // 最后一页（当到达最后一页的时候，清楚定时器）
    $('.flipbook').bind("last", function () {
        clearInterval(nextPage);
    })
    //上一页
    function pre_page() {
        $('.flipbook').turn("previous");
        if ($(".flipbook").turn("animating")) {
            currPage();
        } else {
            // pauseMusic()
            $('.list').hide()
            $('.phdisplay').show()
        }
    }
    // 下一页
    function next_page() {
        $('.flipbook').turn("next");
        if ($(".flipbook").turn("animating")) {
            currPage()
        } else {
            // pauseMusic()
            $('.list').hide()
            $('.end').show()
        }
    };
    
    // 当前页内容的效果
    function currPage() {
        $(".flipbook").bind("turned",function(event,page,view){
            if (page == 1) {
            }
            if (page == 9) {
                if (firstLoading) {
                } else {
                    setTimeout(function(){
                        // pauseMusic()
                        $('.list').hide()
                        $('.end').show()
                    },2000)
                }
                
            }
        })
    }
    // 跳转到指定页面
    function jumpPage(index) {
        $(".flipbook").turn("page", index)
        currPage();
    }
    // 翻页end
    


    // 首页翻书
    count_number = 0
    function flipbook () {
        var bgCounter = 0,
            backgrounds = [
                "images/homex_02.png",
                "images/homex_03.png",
                "images/homex_04.png",
            ];
        function changeBackground() {
            bgCounter = bgCounter % backgrounds.length;
            $('#change').css('background', 'url(' + backgrounds[bgCounter] + ') no-repeat ');
            $('#change').css('background-size', 'cover');
            if (count_number == 0) {
                bgCounter++
                if (bgCounter == 3) {
                    count_number++ 
                    setTimeout(function(){
                        $('.home').hide();
                        if (firstLoading) {
                            // $('#play_memories').removeClass('bScale');
                            againEnter()
                        }else{
                            // $('#play_memories').addClass('bScale');
                        }
                        $('.phdisplay').show();
                    },800)
                } else {
                    setTimeout(changeBackground, 400);
                }
            }
        }
        changeBackground();
    };
    // 开启回忆
    $('#start_memories').on('click', function () {
        flipbook ();
    });
    //照片展示(播放回忆) 
    $('#play_memories').on('click', function () {
        $('.phdisplay').hide();
        if (!firstLoading) {
            time_auto();
        }else{
          $('#return').show();
        }
        playMusic ();
        $('.list').show();
        currPage();
    })
    // 照片展示（点击所有的照片跳转到对应场景）
    function againEnter(){
        $('.ph_list li').each(function(){
            $(this).click(function() {
                var ph_index = $(this).index();
                $('.phdisplay').hide();
                $('#return').show();
                playMusic ();
                $('.list').show();
                jumpPage(ph_index+1);
            })
        });
    }

    
    // 回忆录中的上一页和下一页
    $('.prev').on('click',function(){
        pre_page();
    })
    $('.next').on('click',function(){
        next_page();
    })
    // 结束页
    // 送她520MB
    $('#givebtn').on('click',function(){
        var input_val = $('#inputTel').val();
        if (istel(input_val)) {
            $('.phone_text').text(input_val);
            jiangli();
        } else {
           alert('请输入正确的北京移动号'); 
        }
    });
 
    // 点击再看相册
    $('#again_look').on('click',function(){
        firstLoading = localStorage.getItem('firstLoading')
        $('.end').hide();
        $('#change').css('background-image', 'url(./images/homex_01.png)');
        // 重置首页
        count_number = 0;
        // 重置第一个场景
        $(".flipbook").turn("page",1);
        // 重置音乐
        // pauseMusic ();
        $('.home').show();
    });
    // 判断关注，绑定等
    function jiangli() {
        if (attention) {
            // 已关注
            if (binding) {
                showMask();
                $('.tc_01').show();
            } else {
                // 未绑定手机号
                alert('你还没绑定手机号');
            }
        } else {
            // 未关注
            alert('未关注');
            // window.location.href = "https://mp.weixin.qq.com/s/FDD5Q57SnOrWAiYkfyzLFQ";
        }
    };
    // (修改和确认)
    function Transfcancel() {
        if (increase) {
            //转增
            $('.tc_01').hide();
            $('.tc_02').show();
        } else {
            //  取消
            hideMask();
            $('.tc_01').hide();
        }
    };
    // 信息确认（修改）
    $('#modify').on('click', function () {
        increase = false;
        Transfcancel();
    })
    // 信息确认（确认）
    $('#givebtn_01').on('click', function () {
        increase = true;
        Transfcancel();
    })
    // 点击温馨提示（确认）
    $('#givebtn_02').on('click', function () {
        hideMask();
        $('.tc_02').hide();
    })
    //移动手机号码验证
    function istel(tel) {
        var rtn = false;
        //移动号段验证
        // var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
        var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(17[2|8])|(165)|(147)|198)[\d]{8}$/;
        if (regtel.test(tel)) {
            rtn = true;
        }
        return rtn;
    }
    // 测试
    // 没有关注
    $('.test2').on('click',function(){
        attention = false;
    });
      // 没有关注
    $('.test3').on('click',function(){
        binding = false;    
    });
    // 恢复首次登录
    $('.test4').on('click',function(){
        localStorage.clear()
        window.location.href="index.html?time="+((new Date()).getTime());
    });
});
function playMusic (){
    // 播放
    $('#musicMenu').addClass('move');
    $('#musicMenu').show();
    music.play();
}
function pauseMusic (){
    // 暂停
    $('#musicMenu').hide();
    $('#musicMenu').removeClass('move');
    music.pause();
}
//显示遮罩层
function showMask() {
    $("#mask").css("height", $(document).height());
    $("#mask").css("width", $(document).width());
    $("#mask").show();
    $('body').css('position', 'fixed');
}
//隐藏遮罩层
function hideMask() {
    $("#mask").hide();
    $('body').css('position', 'unset');
}

