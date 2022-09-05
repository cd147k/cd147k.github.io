/**
 * 公共部分js.
 */

//收藏本站
function AddFavorite(title, url) {
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}
//保存到桌面
function createDesktop(sUrl, sName) {
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var shell = new ActiveXObject("WScript.Shell");
        var folderPath = shell.SpecialFolders("Desktop");//获取桌面本地桌面地址
        if (!fso.FolderExists(folderPath)) {
            fso.CreateFolder(folderPath);
        }
        if (!fso.FileExists(folderPath + "//" + sName + ".lnk")) {
            //在指定的文件夹下创建名为sName的快捷方式
            var shortLink = shell.CreateShortcut(folderPath + "//" + sName + ".lnk"); //相应的描述信息
            shortLink.Description = "shortcut for " + sName; //快捷方式指向的链接
            shortLink.TargetPath = sUrl; //激活链接并且窗口最大化
            shortLink.WindowStyle = 3;
            shortLink.Save();
            alert('桌面快捷方式创建成功！');
        }
    } catch (e) {
        doSave("<script>location.href='" + sUrl + "'</sc" + "ript>", "text/html", "147k导航网.html");
    }
}
function doSave(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}


//向上滑动
//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $(".slide-up").fadeIn(1000);
    } else {
        $(".slide-up").fadeOut(1000);
    }
});
$(".slide-up").click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});
$('.we-public').hover(function () {
    $('.kdb-wx').show();
}, function () {
    $('.kdb-wx').hide();
});

// 下拉菜单背景显示
$('.has-item-list').hover(function () {
    $('.nav-box').slideDown();
}, function () {
    $('.nav-box').slideUp();
});

// 图片放大功能
$(document).on('mouseover', '.showImg', function () {
    var elem = $(this).siblings('.show_box');
    elem.show();
    if (elem.find('img').length == 0) {
        var src = $(this).attr('rel');
        $(this).siblings('.show_box').html('<img class="img-thumb" src="' + src + '" />');
    }
});
$(document).on('mouseout', '.showImg', function () {
    $(this).siblings('.show_box').hide();
});

// 输出标准化的日期
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// cookie操作方法
var cookie = {
    set: function (key, val, time, domain) {//设置cookie方法
        var date = new Date();
        var today = new Date().setHours(0, 0, 0, 0); //获取当天0点时间
        date.setTime(today + time * 24 * 3600 * 1000); //格式化为cookie识别的时间
        if(!domain) {
            document.cookie = key + "=" + val + "; path=/; expires=" + date.toGMTString();  //设置cookie
        } else {
            document.cookie = key + "=" + val + "; domain=" + domain + "; path=/; expires=" + date.toGMTString();  //设置cookie
        }
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; path=/; expires =" + date.toGMTString();//设置cookie
    }
};


