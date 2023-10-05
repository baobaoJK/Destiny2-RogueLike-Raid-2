$(function () {
    // 读取游戏存档
    gameConfig = read();

    // 音频
    let audio = $(".audio")[0];
    audio.volume = 0.1;

    const event = gameConfig.playereventlist;

    console.log(event);

    if (event.length != 0) {

        $(".event-title").text("当前有新事件");
        $(".event-list .event-box").remove();

        for (let i = 0; i < event.length; i++) {

            let stage = event[i].stage;
            let confirmButton = stage == "none" ? "block" : "none";
            let finishButton = stage == "active" ? "block" : "none";

            $(".event-list").append('<div class="event-box">' +
                '<div class= "event-item" id="' + event[i].name + '">' +
                '<div class="event-card event-front">' +
                '<div class="event-info">' +
                '<div>' +
                '<p class="title">- ' + event[i].eventName + ' -</p>' +
                '<p class="sub-title">- ' + event[i].name + ' -</p>' +
                '</div>' +
                '<p class="text">' + event[i].description + '</p>' +
                '<div class="buttons">' +
                '<button class="button confirm ' + event[i].name + '" style="display: ' + confirmButton + ';" data-event="false" data-name="' + event[i].name + '">接受</button>' +
                '<button class="button finish ' + event[i].name + '" style="display: ' + finishButton + ';" data-event="false" data-name="' + event[i].name + '">完成</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="event-card event-back"></div>' +
                '</div>' +
                '<p class="event-time"></p>' +
                '<p class="event-name">- 个人事件 -</p>' +
                '</div>');

            $(".event-item").click(function (e) {
                e.preventDefault();

                // Aatrox
                if ($(this).attr("id") == "Aatrox") {
                    audio.play();
                }

                $(this).addClass("flip");
            });


            $(".confirm").click(function (e) {
                e.preventDefault();

                $(this).remove();
                $("." + $(this).attr("data-name")).attr("style", "display:block");

                runEvent($(this).attr("data-name"));

            });

            $(".finish").click(function (e) {
                e.preventDefault();

                let dataName = $(this).attr("data-name");

                // let title = $("#" + dataName + " .title").text();

                showAlert("已完成事件");
                deleteEvent(dataName);
                $("#" + $(this).attr("data-name")).parent().remove();
            });
        }
    }
});

// 个人事件处理机制 ↓
function runEvent(eventName) {

    let event = gameConfig.playereventlist;

    // for (let i = 0; i < event.length; i++) {
    //     if (event[i].stage == "active") return;
    // }

    // 亚托克斯
    if (eventName == "Aatrox") {
        for (let i = 0; i < gameConfig.decklist.StrongDiscomfort.length; i++) {
            if (gameConfig.decklist.StrongDiscomfort[i].id == "Aatrox") {
                showAlert("卡牌 - 亚托克斯 - 已存在");
                return;
            }
        }

        let aatroxCard = {
            "id": "Aatrox",
            "type": "StrongDiscomfort",
            "name": "Aatrox",
            "cardName": "亚托克斯",
            "description": "获得一把挽歌且绑定威能位无法更换，可被【贱卖】【重铸】和2阶圣水解除，前二者失去挽歌，后者保留",
            "illustrate": "无",
            "priority": 0,
            "weight": 0,
            "count": 0
        };
        gameConfig.decklist.StrongDiscomfort.push(aatroxCard);

        save(gameConfig);

        showAlert("已添加卡牌 - 亚托克斯 - 至重度不适中");
    }

    // 顺手牵羊
    if (eventName == "Take-Others") {
        let randomPlayer = Math.round(Math.random() * 5 + 1);

        while (randomPlayer == gameConfig.roleId) {
            randomPlayer = Math.round(Math.random() * 5 + 1)
        }

        showAlert("抽取 " + randomPlayer + " 号玩家的一张卡");
    }

    // 无中生有
    if (eventName == "Create-Nothing") {
        gameConfig.cardDrawsCount += 2;
        save(gameConfig);
    }

    // 窃取
    if (eventName == "Steal") {
        gameConfig.refreshCount += 1;
        save(gameConfig);
    }

    // 改变事件状态
    for (let i = 0; i < event.length; i++) {
        if (eventName == event[i].name) {
            // showAlert("已接受事件 -" + gameConfig.playereventlist[i].eventName + "-");
            gameConfig.playereventlist[i].stage = "active";
            save(gameConfig);
            // break;
        }
    }
}

// 事件回收机制
function deleteEvent(eventName) {

    console.log("事件回收机制");

    let event = gameConfig.playerevent;

    for (let i = 0; i < event.length; i++) {
        if (event[i].name == eventName) {
            gameConfig.playerevent[i].count += 1;
            save(gameConfig);
            break;
        }
    }

    let playerevent = gameConfig.playereventlist;

    for (let i = 0; i < playerevent.length; i++) {
        if (playerevent[i].name == eventName) {
            playerevent[i] = null;
            break;
        }
    }

    let newEventlist = [];

    for (let i = 0; i < playerevent.length; i++) {
        if (playerevent[i] != null) {
            newEventlist.push(playerevent[i]);
        }
    }

    gameConfig.playereventlist = newEventlist;
    save(gameConfig);
}