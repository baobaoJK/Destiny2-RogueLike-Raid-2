$(function () {
    // 读取游戏存档
    gameConfig = read();

    const globalEvent = gameConfig.globalEventList;

    console.log(globalEvent);

    let punishCount = 0;

    for (let i = 0; i < globalEvent.length; i++) {
        if (globalEvent[i].stage == "timeout") {
            punishCount += 1;
            showAlert("已有" + punishCount + "个事件超时");
        }
    }

    if (globalEvent.length != 0) {

        $(".event-title").text("当前有新事件");
        $(".event-list .event-box").remove();

        for (let i = 0; i < globalEvent.length; i++) {

            let stage = globalEvent[i].stage;
            let confirmButton = (stage == "none" || stage == "timeout") ? "block" : "none";
            let finishButton = stage == "active" ? "block" : "none";

            $(".event-list").append('<div class="event-box">' +
                '<div class= "event-item" id="' + globalEvent[i].name + '">' +
                '<div class="event-card event-front">' +
                '<div class="event-info">' +
                '<div>' +
                '<p class="title">- ' + globalEvent[i].eventName + ' -</p>' +
                '<p class="sub-title">- ' + globalEvent[i].name + ' -</p>' +
                '</div>' +
                '<p class="text">' + globalEvent[i].description + '</p>' +
                '<div class="buttons">' +
                '<button class="button confirm ' + globalEvent[i].name + '" style="display: ' + confirmButton + ';" data-event="false" data-name="' + globalEvent[i].name + '">接受</button>' +
                '<button class="button finish ' + globalEvent[i].name + '" style="display: ' + finishButton + ';" data-event="false" data-name="' + globalEvent[i].name + '">完成</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="event-card event-back"></div>' +
                '</div>' +
                '<p class="event-name">- 全局事件 -</p>' +
                '</div>');
        }

        $(".event-item").click(function (e) {
            e.preventDefault();

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
});

// 全局事件处理机制 ↓
function runEvent(eventName) {

    let globalEvent = gameConfig.globalEventList;

    let players = shuffle([1, 2, 3, 4, 5, 6]);

    // 紧急支援
    if (eventName == "MAYDAY") {
        let dungeon = lottery(gameConfig.dungeons);
        showAlert("玩家 " + players[0] + " | " + players[1] + " | " + players[2] + " 需前往 - " + dungeon.name + " -");
    }

    // 五谷丰登
    if (eventName == "Bumper-Harvest") {
        $("#deck-model").modal("show");

        let deck = [];

        // 微弱增益
        while (deck.length != 6) {
            card = lottery(gameConfig.deck.MicroGain);
            if (checkDeck(deck, card)) {
                deck.push(card);
            };
        }

        for (let i = 0; i < deck.length; i++) {
            $("#card-" + (i + 1) + " .card-id").text("-" + deck[i].name + "-");
            $("#card-" + (i + 1) + " .card-name").text("-" + deck[i].cardName + "-");
            $("#card-" + (i + 1)).attr("data-id", (i + 1));
        }

        $(".players").text("抽取顺序为" + players[0] + " | " + players[1] + " | " + players[2] + " | " + players[3] + " | " + players[4] + " | " + players[5]);

        console.log(deck);
        setTimeout(() => {
            $(".card-item").addClass("flip");
        }, 500);
    }

    // 各自为营
    if (eventName == "Split-Up") {
        showAlert(players[0] + " | " + players[1] + " | " + players[2] + " 需要做为1队，" + players[3] + " | " + players[4] + " | " + players[5] + " 需要做为2队 分别完成此次遭遇战");
    }

    // 改变事件状态
    for (let i = 0; i < globalEvent.length; i++) {
        if (eventName == globalEvent[i].name) {
            // showAlert("已接受事件 -" + gameConfig.playereventlist[i].eventName + "-");
            gameConfig.globalEventList[i].stage = "active";
            save(gameConfig);
            // break;
        }
    }
}

// 事件回收机制
function deleteEvent(eventName) {

    console.log("事件回收机制");

    let event = gameConfig.globalEvent;

    for (let i = 0; i < event.length; i++) {
        if (event[i].name == eventName) {
            gameConfig.globalEvent[i].count += 1;
            save(gameConfig);
            break;
        }
    }

    let globalEvent = gameConfig.globalEventList;

    for (let i = 0; i < globalEvent.length; i++) {
        if (globalEvent[i].name == eventName) {
            globalEvent[i] = null;
            break;
        }
    }

    let newEventlist = [];

    for (let i = 0; i < globalEvent.length; i++) {
        if (globalEvent[i] != null) {
            newEventlist.push(globalEvent[i]);
        }
    }

    gameConfig.globalEventList = newEventlist;
    save(gameConfig);
}

// 卡牌去重
function checkDeck(deck, card) {
    for (let i = 0; i < deck.length; i++) {
        if (deck[i] == card) {
            return false;
        }
    }

    return true;
}