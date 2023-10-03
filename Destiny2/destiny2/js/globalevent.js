$(function () {
    gameConfig = read();

    const globalEvent = gameConfig.globalEvent;
    const globalEventTime = gameConfig.globalEventTime;

    console.log(globalEvent);

    let globalEventTimeInterval = setInterval(() => {
        if (globalEventTime) {
            showAlert("事件已超时需接受惩罚");
            gameConfig.globalEvent = null;
            gameConfig.globalEventShow = false;
            save(gameConfig);
            globalEventTimeInterval = null;
        }
    }, 500);

    if (globalEvent != null | globalEvent != undefined | globalEventTime) {

        if (globalEventTime) {
            $(".event-time").text("事件已超时需接受惩罚");
            return;
        }

        $(".event-title").text("当前有新事件");
        $(".title").text(globalEvent.name);
        $(".text").text(globalEvent.description);

        $(".event-item .event-card").click(function (e) {
            e.preventDefault();

            gameConfig.globalEventShow = true;
            save(gameConfig);

            $(".event-item").addClass("flip");
        });


        $(".confirm").click(function (e) {
            e.preventDefault();
            runEvent();
            $(".event-title").text("当前没有新事件");

            gameConfig.globalEvent = null;
            gameConfig.globalEventTime = false;
            save(gameConfig);
        });
    }
});

// 全局事件处理机制 ↓
function runEvent() {
    let globalEventId = gameConfig.globalEvent.id;
    let players = shuffle([1, 2, 3, 4, 5, 6]);

    // 紧急支援
    if (globalEventId == "QS1") {
        let dungeon = lottery(gameConfig.dungeon);
        showAlert("玩家 " + players[0] + " | " + players[1] + " | " + players[2] + " 需前往 - " + dungeon.name + " -");
    }

    // 五谷丰登
    if (globalEventId == "QS9") {
        $("#deck-model").modal("show");

        let deck = [];

        // 微弱增益
        while (deck.length != 6) {
            card = lottery(gameConfig.deck.mg);
            if (checkDeck(deck, card)) {
                deck.push(card);
            };
        }

        for (let i = 0; i < deck.length; i ++) {
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

function shuffle(array) {
    let res = [], random;
    while (array.length > 0) {
        random = Math.floor(Math.random() * array.length);
        res.push(array[random]);
        array.splice(random, 1);
    }
    return res;
}
