$(function () {
    gameConfig = read();

    const event = gameConfig.playerEvent;
    const eventTime = gameConfig.playerEventTime;

    console.log(event);

    let eventTimeInterval = setInterval(() => {
        if (eventTime) {
            showAlert("事件已超时需接受惩罚");
            gameConfig.playerEvent = null;
            gameConfig.playerEventShow = false;
            save(gameConfig);
            eventTimeInterval = null;
        }
    }, 500);

    if (event != null | event != undefined | eventTime) {

        if (eventTime) {
            $(".event-time").text("事件已超时需接受惩罚");
            return;
        }

        $(".event-title").text("当前有新事件");
        $(".title").text(event.name);
        $(".text").text(event.description);

        $(".event-item .event-card").click(function (e) {
            e.preventDefault();

            // Aatrox
            if (gameConfig.playerEvent.id == "PS2") {
                $("audio")[0].play();
            }

            gameConfig.playerEventShow = true;
            save(gameConfig);

            $(".event-item").addClass("flip");
        });


        $(".confirm").click(function (e) {
            e.preventDefault();
            runEvent();
            $(".event-title").text("当前没有新事件");

            gameConfig.playerEvent = null;
            gameConfig.playerEventTime = false;
            save(gameConfig);
        });
    }
});

// 个人事件处理机制 ↓
function runEvent() {
    let eventId = gameConfig.playerEvent.id;

    // PS2
    if (eventId == "PS2") {

        for (let i = 0; i < gameConfig.decklist.sd.length; i++) {
            if (gameConfig.decklist.sd[i].id == "Aatrox") {
                showAlert("卡牌 - 亚托克斯 - 已存在");
                return;
            }
        }

        let aatroxCard = {
            "id": "Aatrox",
            "type": "sd",
            "name": "亚托克斯",
            "description": "获得一把挽歌且绑定威能位无法更换，可被【贱卖】【重铸】和2阶圣水解除，前二者失去挽歌，后者保留",
            "weight": 0,
            "count": 0
        };
        gameConfig.decklist.sd.push(aatroxCard);

        showAlert("已添加卡牌 - 亚托克斯 - 至重度不适中");
    }

    // PS5
    if (eventId == "PS5") {
        let randomPlayer = Math.round(Math.random() * 5 + 1);

        while (randomPlayer == gameConfig.roleId) {
            randomPlayer = Math.round(Math.random() * 5 + 1)
        }

        showAlert("抽取 " + randomPlayer + " 号玩家的一张卡");
    }

    // PS9
    if (eventId == "PS9") {
        gameConfig.cardDrawsCount += 2;
        save(gameConfig);
    }

    // PS10
    if (eventId == "PS10") {
        gameConfig.refreshCount += 1;
        save(gameConfig);
    }
}