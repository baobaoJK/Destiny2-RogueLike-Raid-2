$(function () {
    // 读取游戏存档
    gameConfig = read();

    // 音频
    let audio = $(".audio")[0];
    audio.volume = 0.2;

    const playerEventList = gameConfig.playerEventList;

    console.log(playerEventList);

    punishCount = 0;

    for (let i = 0; i < playerEventList.length; i++) {
        if (playerEventList[i].stage == "timeout") {
            punishCount += 1;
            showAlert("已有" + punishCount + "个事件超时");
        }
    }

    if (punishCount > 0) {
        $("#deck-model").modal("show");
        $(".deck-list-count").text("你需要抽取" + punishCount + "张卡牌，因为已有" + punishCount + "个事件超时未接受");

        setCardEvent();
    }

    if (playerEventList.length != 0) {

        $(".event-title").text("当前有新事件");
        $(".event-list .event-box").remove();

        for (let i = 0; i < playerEventList.length; i++) {

            let stage = playerEventList[i].stage;
            let confirmButton = (stage == "none" || stage == "timeout") ? "block" : "none";
            let finishButton = stage == "active" ? "block" : "none";

            $(".event-list").append('<div class="event-box">' +
                '<div class= "event-item" id="' + playerEventList[i].name + '">' +
                '<div class="event-card event-front">' +
                '<div class="event-info">' +
                '<div>' +
                '<p class="title">- ' + playerEventList[i].eventName + ' -</p>' +
                '<p class="sub-title">- ' + playerEventList[i].name + ' -</p>' +
                '</div>' +
                '<p class="text">' + playerEventList[i].description + '</p>' +
                '<div class="buttons">' +
                '<button class="button confirm ' + playerEventList[i].name + '" style="display: ' + confirmButton + ';" data-event="false" data-name="' + playerEventList[i].name + '">接受</button>' +
                '<button class="button finish ' + playerEventList[i].name + '" style="display: ' + finishButton + ';" data-event="false" data-name="' + playerEventList[i].name + '">完成</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="event-card event-back"></div>' +
                '</div>' +
                '<button class="button quit ' + playerEventList[i].name + '" data-event="false" data-name="' + playerEventList[i].name + '">放弃</button>' +
                '<p class="event-name">- 个人事件 -</p>' +
                '</div>');
        }

        $(".event-item").click(function (e) {
            e.preventDefault();

            // Aatrox
            if ($(this).attr("id") == "Aatrox") {
                audio.play();
            }

            $(this).addClass("flip");
            checkEventStage($(this).attr("id"));
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

            showAlert("已完成事件");
            deleteEvent(dataName);
            $("#" + $(this).attr("data-name")).parent().remove();
        });

        $(".quit").click(function (e) {
            e.preventDefault();

            let dataName = $(this).attr("data-name");

            punishCount += 2;
            
            $("#deck-model").modal("show");
            $(".deck-list-count").text("你需要抽取2次身不由己卡池，因为你放弃了该事件");

            setCardEvent();
            deleteEvent(dataName);
            $("#" + $(this).attr("data-name")).parent().remove();
        });
    }
});

let deck;
let punishCount = 0;

// 个人事件处理机制 ↓
function runEvent(eventName) {

    let playerEventList = gameConfig.playerEventList;

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
        gameConfig.drawCount += 2;
        save(gameConfig);
    }

    // 窃取
    if (eventName == "Steal") {
        gameConfig.refreshCount += 1;
        save(gameConfig);
    }

    // 改变事件状态
    for (let i = 0; i < playerEventList.length; i++) {
        if (eventName == playerEventList[i].name) {
            // showAlert("已接受事件 -" + gameConfig.playerEventList[i].eventName + "-");
            gameConfig.playerEventList[i].stage = "active";
            save(gameConfig);
            // break;
        }
    }
}

// 事件回收机制
function deleteEvent(eventName) {

    console.log("事件回收机制");

    let playerEventList = gameConfig.playerEvent;

    for (let i = 0; i < playerEventList.length; i++) {
        if (playerEventList[i].name == eventName) {
            gameConfig.playerEvent[i].count += 1;
            save(gameConfig);
            break;
        }
    }

    let playerEvent = gameConfig.playerEventList;

    for (let i = 0; i < playerEvent.length; i++) {
        if (playerEvent[i].name == eventName) {
            playerEvent[i] = null;
            break;
        }
    }

    let newEventlist = [];

    for (let i = 0; i < playerEvent.length; i++) {
        if (playerEvent[i] != null) {
            newEventlist.push(playerEvent[i]);
        }
    }

    gameConfig.playerEventList = newEventlist;
    save(gameConfig);
}

// 检测事件状态
function checkEventStage(eventName) {
    console.log(eventName);
}

// 身不由己
function getNotSelfDeck() {
    let notSelfDeck = [];

    let microDiscomfortCount = getCardCount("MicroDiscomfort");
    let strongDiscomfortCount = getCardCount("StrongDiscomfort");
    let unacceptableCount = getCardCount("Unacceptable");

    if (microDiscomfortCount < 6 || strongDiscomfortCount < 5) return;

    let microDiscomfortList = getDeckList("MicroDiscomfort", 6);
    let strongDiscomfortList = getDeckList("StrongDiscomfort", 5);

    notSelfDeck = notSelfDeck.concat(microDiscomfortList).concat(strongDiscomfortList);

    let card;
    let cardType;

    if (unacceptableCount != 0) {
        cardType = "Unacceptable";
    } else {
        if (strongDiscomfortCount < 6) return;

        cardType = "StrongDiscomfort";
    }

    while (notSelfDeck.length != 12) {
        card = lotteryByCount(gameConfig.deck[cardType]);
        if (checkDeck(notSelfDeck, card) && card != undefined) {
            notSelfDeck.push(card);
        }
    }

    return notSelfDeck;
}

// 获取卡牌列表
function getDeckList(type, number) {
    let deckList = [];
    let card;

    while (deckList.length != number) {
        card = lotteryByCount(gameConfig.deck[type]);
        if (checkDeck(deckList, card) && card != undefined) {
            deckList.push(card);
        };
    }

    return deckList;
}

// 获取卡牌数量
function getCardCount(cardType) {
    let cardCount = 0;

    for (let i = 0; i < gameConfig.deck[cardType].length; i++) {
        if (gameConfig.deck[cardType][i].count != 0) {
            cardCount += 1;
        }
    }

    return cardCount;
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

// 手卡
function saveDeck(card) {
    console.log(card);
    gameConfig.deckList[card.type].push(card);
    specialCard(card);

    let deck = gameConfig.deck[card.type];

    for (let i = 0; i < deck.length; i++) {
        if (deck[i].id == card.id) {
            gameConfig.deck[card.type][i].count -= 1;
            break;
        }
    }

    updateCount();
    save(gameConfig);
    console.log(gameConfig.deckList);
}

// 删除卡片
function delectCard(card) {
    console.log("卡牌回收机制");
    let deckList = gameConfig.deckList[card.type];

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].id == card.id) {
            deckList[i] = null;
            break;
        }
    }

    let tempDeck = gameConfig.deck[card.type];

    for (let j = 0; j < tempDeck.length; j++) {
        if (tempDeck[j].id == card.id) {
            gameConfig.deck[card.type][j].count += 1;
            break;
        }
    }

    let newDeckList = [];

    for (let k = 0; k < deckList.length; k++) {
        if (deckList[k] != null) {
            newDeckList.push(deckList[k]);
        }
    }

    gameConfig.deckList[card.type] = newDeckList;
    save(gameConfig);
}

// 特殊卡牌处理机制 ↓
function specialCard(card) {
    // 卧槽我钱包呢
    if (card.name == "Lost-Wallet") {
        delectCard(card);

        gameConfig.money = 0;
        save(gameConfig);

        gamepaneMoney.text(gameConfig.money);
        showAlert("杂鱼~你的货币全没了哦~");
    }

}

// 更改数量
function updateCount() {
    let playerEventList = gameConfig.playerEventList;

    for (let i = 0; i < playerEventList.length; i++) {
        if (playerEventList[i].stage == "timeout") {
            playerEventList[i].stage = "none";
            break;
        }
    }

    save(gameConfig);
}

// 设置卡牌事件
function setCardEvent() {

    $(".card-item").removeClass("flip");

    deck = getNotSelfDeck();
    console.log(deck);

    for (let i = 0; i < deck.length; i++) {
        $("#card-" + (i + 1) + " .card-id").text(deck[i].name);
        $("#card-" + (i + 1) + " .card-name").text(deck[i].cardName);
        $("#card-" + (i + 1)).attr("data-id", (i + 1));
    }

    let cards = $(".card-item");
    for (let i = 0; i < deck.length; i++) {
        let randomPos = Math.floor(Math.random() * deck.length);
        // order 顺序
        cards[i].style.order = randomPos;
    }

    // 翻牌
    $(".card-item").click(function (e) {
        e.preventDefault();
        let flip = $(this).hasClass("flip");
        if (!flip) {

            console.log();
            if (punishCount <= 0) {
                showAlert("抽卡次数已用完");
                return
            }

            $(this).addClass("flip");

            let cardId = $(this).attr("data-id") - 1;

            console.log(cardId);
            saveDeck(deck[cardId]);
            punishCount -= 1;
        }
    });
}