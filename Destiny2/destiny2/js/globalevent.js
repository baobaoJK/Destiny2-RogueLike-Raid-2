$(function () {
    // 读取游戏存档
    gameConfig = read();

    const globalEvent = gameConfig.globaleventlist;

    console.log(globalEvent);

    if (globalEvent.length != 0) {

        $(".event-title").text("当前有新事件");
        $(".event-list .event-box").remove();

        for (let i = 0; i < globalEvent.length; i++) {

            let stage = globalEvent[i].stage;
            let confirmButton = stage == "none" ? "block" : "none";
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
                '<p class="event-time"></p>' +
                '<p class="event-name">- 个人事件 -</p>' +
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

    let globalEvent = gameConfig.globaleventlist;

    let players = shuffle([1, 2, 3, 4, 5, 6]);

    // 紧急支援
    if (eventName == "QS1") {
        let dungeon = lottery(gameConfig.dungeon);
        showAlert("玩家 " + players[0] + " | " + players[1] + " | " + players[2] + " 需前往 - " + dungeon.name + " -");
    }

    // 五谷丰登
    if (eventName == "QS9") {
        $("#deck-model").modal("show");

        let deck = [];

        // 微弱增益
        while (deck.length != 6) {
            card = lottery(gameConfig.deck.mg);
            if (checkDeck(deck, card)) {
                deck.push(card);
            };
        }

        for (let i = 0; i < deck.length; i++) {
            $("#card-" + (i + 1) + " .card-id").text(deck[i].id);
            $("#card-" + (i + 1) + " .card-name").text(deck[i].name);
            $("#card-" + (i + 1)).attr("data-id", (i + 1));
        }

        $(".players").text("抽取顺序为" + players[0] + " | " + players[1] + " | " + players[2] + " | " + players[3] + " | " + players[4] + " | " + players[5]);

        console.log(deck);
        setTimeout(() => {
            $(".card-item").addClass("flip");
        }, 500);
    }

    // 改变事件状态
    for (let i = 0; i < globalEvent.length; i++) {
        if (eventName == globalEvent[i].name) {
            // showAlert("已接受事件 -" + gameConfig.playereventlist[i].eventName + "-");
            gameConfig.globaleventlist[i].stage = "active";
            save(gameConfig);
            // break;
        }
    }
}

// 事件回收机制
function deleteEvent(eventName) {

    console.log("事件回收机制");

    let event = gameConfig.globalevent;

    for (let i = 0; i < event.length; i++) {
        if (event[i].name == eventName) {
            gameConfig.globalevent[i].count += 1;
            save(gameConfig);
            break;
        }
    }

    let globalevent = gameConfig.globaleventlist;

    for (let i = 0; i < globalevent.length; i++) {
        if (globalevent[i].name == eventName) {
            globalevent[i] = null;
            break;
        }
    }

    let newEventlist = [];

    for (let i = 0; i < globalevent.length; i++) {
        if (globalevent[i] != null) {
            newEventlist.push(globalevent[i]);
        }
    }

    gameConfig.globaleventlist = newEventlist;
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