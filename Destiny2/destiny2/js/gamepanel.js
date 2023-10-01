$(function () {

    // 设置角色信息
    const gameConfig = read();
    $(".name").text(gameConfig.roleName);
    $(".number").text(gameConfig.number + "号玩家");
    $(".money span").text(gameConfig.money);

    // 导航栏
    if (gameConfig.position == "captain") {
        $('.menu ul').prepend('<li class="menu-link"><a href="map.html" target="windows">地图</a></li>');
        $('.menu ul').append('<li class="menu-link"><a href="globalevent.html" target="windows">全局事件</a></li>');
    }

    $('.menu ul').append('<li class="menu-link"><a href="options.html" target="windows">操作面板</a></li>');


    // 导航栏切换
    let menuList = $(".menu-link");
    for (let i = 0; i < menuList.length; i++) {
        $(menuList[i]).click(function (e) {
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
        });
    }

    // 名片设置
    $(".image").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.position + "-w.jpg);");
    $(".icon").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.position + "_icon.png);");
});