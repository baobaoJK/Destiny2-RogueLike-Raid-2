$(function () {
    startGame();
    // 设置角色信息
    gameConfig = read();

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

// 开始计时
function startGame() {
    gameConfig = read();

    // 个人事件
    let eventAudio = parentJQuery("#gamepanel #event")[0];
    let eventNumbers = [1, 2, 3, 4, 5, 6];

    eventAudio.addEventListener('ended', () => {
        if (gameConfig.playerEventShow == false) {
            gameConfig.playerEventTime = true;
            save(gameConfig);
        }
    });

    let eventAudioInterval = setInterval(() => {
        eventNumbers = shuffle(eventNumbers);
        console.log(eventNumbers);
        if (eventNumbers[0] == 1) {
            eventAudio.play();
            let event = lottery(gameConfig.event);
            gameConfig.playerEvent = event;
            gameConfig.playerEventTime = false;
            gameConfig.playerEventShow = false;
            save(gameConfig);
        }

    }, 300000);

    console.log("个人事件检测");

    // 全局事件
    if (gameConfig.position == "captain") {
        let globalEventAudio = parentJQuery("#gamepanel #globalevent")[0];
        let globalEventNumbers = [1, 2, 3, 4, 5, 6];

        globalEventAudio.addEventListener('ended', () => {
            if (gameConfig.globalEventShow == false) {
                gameConfig.globalEventTime = true;
                save(gameConfig);
            }
        });

        let globalEventAudioInterval = setInterval(() => {
            globalEventNumbers = shuffle(globalEventNumbers);
            console.log(globalEventNumbers);
            if (globalEventNumbers[0] == 1) {
                globalEventAudio.play();
                let globalEvent = lottery(gameConfig.globalevent);
                gameConfig.globalEvent = globalEvent;
                gameConfig.globalEventTime = false;
                gameConfig.globalEventShow = false;
                save(gameConfig);
            }

        }, 300000);

        console.log("全局事件检测");
    }
}
// 
function shuffle(array) {
    let res = [], random;
    while (array.length > 0) {
        random = Math.floor(Math.random() * array.length);
        res.push(array[random]);
        array.splice(random, 1);
    }
    return res;
}