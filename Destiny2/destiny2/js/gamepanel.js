$(function () {

    // 读取存档
    gameConfig = read();

    // 事件计时开始
    startGame();

    // 设置角色信息
    $(".name").text(gameConfig.roleName);
    $(".number").text(gameConfig.roleId + "号玩家");
    $(".money span").text(gameConfig.money);

    // 导航栏
    if (gameConfig.position == "captain") {
        $('.menu ul').prepend('<li class="menu-link"><a href="map.html" target="windows">地图</a></li>');
        $('.menu ul').append('<li class="menu-link"><a href="globalevent.html" target="windows">全局事件</a></li>');
    }

    // 添加操控面板
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

    if (gameConfig.roleName == "和泉纱雾") {
        $(".image").attr("style", "background-image: url(/destiny2/images/emblem/es-w.jpg);");
        $(".icon").attr("style", "background-image: url(/destiny2/images/emblem/es_icon.png);");
    }
    else if (gameConfig.position != "captain") {
        $(".image").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.role + "-w.jpg);");
        $(".icon").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.role + "_icon.png);");
    }
    else {
        $(".image").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.position + "-w.jpg);");
        $(".icon").attr("style", "background-image: url(/destiny2/images/emblem/" + gameConfig.position + "_icon.png);");
    }
});

// 事件开始计时
function startGame() {

    // 个人事件
    let eventAudio = parentJQuery("#gamepanel #event")[0];
    eventAudio.volume = 0.1;
    let eventNumbers = [1, 2, 3, 4, 5, 6];

    let eventAudioInterval = setInterval(() => {
        gameConfig = read();

        eventNumbers = shuffle(eventNumbers);
        console.log(eventNumbers);
        console.log("----个人事件-----");

        if (eventNumbers[0] == 1) {
            eventAudio.play();
            let event = lotteryByCount(gameConfig.playerevent);

            for (let i = 0; i < gameConfig.playerevent.length; i++) {
                if (event.id == gameConfig.playerevent[i].id) {
                    gameConfig.playerevent[i].count -= 1;
                    break;
                }
            }

            gameConfig.playereventlist.push(event);
            save(gameConfig);
        }

    }, 300000);

    console.log("个人事件检测");

    // 全局事件
    if (gameConfig.position == "captain") {
        let globalEventAudio = parentJQuery("#gamepanel #globalevent")[0];
        globalEventAudio.volume = 0.1;
        let globalEventNumbers = [1, 2, 3, 4];

        let globalEventAudioInterval = setInterval(() => {

            gameConfig = read();

            globalEventNumbers = shuffle(globalEventNumbers);
            console.log("----全局事件-----");
            console.log(globalEventNumbers);

            if (globalEventNumbers[0] == 1) {
                globalEventAudio.play();
                let globalEvent = lotteryByCount(gameConfig.globalevent);

                for (let i = 0; i < gameConfig.globalevent.length; i++) {
                    if (globalEvent.id == gameConfig.globalevent[i].id) {
                        gameConfig.globalevent[i].count -= 1;
                        break;
                    }
                }

                gameConfig.globaleventlist.push(globalEvent);
                save(gameConfig);
            }

        }, 300000);

        console.log("全局事件检测");
    }
}