$(function () {
    // 读取存档
    gameConfig = read();

    // 初始化
    init();

    // 抽卡次数
    $("#deck .chance").text(gameConfig.drawCount);

    // 卡组点击事件
    $(".deck div").click(function (e) {

        if (gameConfig.drawCount <= 0) {
            showAlert("你没有抽卡次数")
            return;
        };

        let microGainCount = 0;
        let strongGainCount = 0;
        let opportunityCount = 0;
        let microDiscomfortCount = 0;
        let strongDiscomfortCount = 0;
        let unacceptableCount = 0;
        let technologyCount = 0;
        let supportCount = 0;

        const deckType = $(this).attr("id");

        switch (deckType) {
            case "safe":
                $(".deck-list-box").addClass("deck-1");
                deck = getSafeDeck();
                microGainCount = getDeckListTypeCount(deck, "MicroGain");
                strongGainCount = getDeckListTypeCount(deck, "StrongGain");
                microDiscomfortCount = getDeckListTypeCount(deck, "MicroDiscomfort");
                $(".deck-list-count").text("微弱增益：" + microGainCount + "张 | 强大增益：" + strongGainCount + "张 | 微弱不适：" + microDiscomfortCount + "张");
                break;
            case "notself":
                $(".deck-list-box").addClass("deck-2");
                deck = getNotSelfDeck();
                microDiscomfortCount = getDeckListTypeCount(deck, "MicroDiscomfort");
                strongDiscomfortCount = getDeckListTypeCount(deck, "StrongDiscomfort");
                unacceptableCount = getDeckListTypeCount(deck, "Unacceptable");
                $(".deck-list-count").text("微弱不适：" + microDiscomfortCount + "张 | 重度不适：" + strongDiscomfortCount + "张 | 反人类：" + unacceptableCount + "张");
                break;
            case "gambit":
                $(".deck-list-box").addClass("deck-3");
                deck = getGambitDeck();
                strongGainCount = getDeckListTypeCount(deck, "StrongGain");
                opportunityCount = getDeckListTypeCount(deck, "Opportunity");
                strongDiscomfortCount = getDeckListTypeCount(deck, "StrongDiscomfort");
                unacceptableCount = getDeckListTypeCount(deck, "Unacceptable");
                $(".deck-list-count").text("强大增益：" + strongGainCount + "张 | 欧皇增益：" + opportunityCount + "张 | 重度不适：" + strongDiscomfortCount + "张 | 反人类：" + unacceptableCount + "张");
                break;
            case "luck":
                $(".deck-list-box").addClass("deck-4");
                deck = getLuckDeck();
                strongGainCount = getDeckListTypeCount(deck, "StrongGain");
                opportunityCount = getDeckListTypeCount(deck, "Opportunity");
                strongDiscomfortCount = getDeckListTypeCount(deck, "StrongDiscomfort");
                unacceptableCount = getDeckListTypeCount(deck, "Unacceptable");
                technologyCount = getDeckListTypeCount(deck, "Technology");
                $(".deck-list-count").text("强大增益：1张 | 欧皇增益：1张 | 重度不适：1张 | 反人类：1张 | 特殊卡牌：8张");
                break;
            case "devote":
                $(".deck-list-box").addClass("deck-5");
                deck = getDevoteDeck();
                microGainCount = getDeckListTypeCount(deck, "MicroGain");
                supportCount = getDeckListTypeCount(deck, "Support");
                strongDiscomfortCount = getDeckListTypeCount(deck, "StrongDiscomfort");
                $(".deck-list-count").text("微弱增益：" + microGainCount + "张 | 辅助卡牌：" + supportCount + "张 | 重度不适：" + strongDiscomfortCount + "张");
                break;
            default:
                break;
        }

        if (deck == undefined || deck.length != 12) {
            showAlert("卡牌数量不够无法抽取");
            return
        };

        $("#deck-model").modal("show");

        console.log(deck);

        // 存卡
        pushDeck(deck);
    });

    // 关闭按钮
    $(".deck-close").click(function (e) {
        e.preventDefault();

        setTimeout(() => {
            $(".deck-list-box").removeClass("deck-1");
            $(".deck-list-box").removeClass("deck-2");
            $(".deck-list-box").removeClass("deck-3");
            $(".deck-list-box").removeClass("deck-4");
            $(".deck-list-box").removeClass("deck-5");
            $(".card-item").removeClass("flip");
        }, 300);

    });

    // 翻牌
    $(".card-item").click(function (e) {
        e.preventDefault();

        let flip = $(this).hasClass("flip");
        if (!flip) {

            if (gameConfig.drawCount <= 0) {
                showAlert("你没有抽卡机会！");
                return
            }

            $(this).addClass("flip");

            let cardId = $(this).attr("data-id") - 1;

            saveDeck(deck[cardId]);

            $("#deck .chance").text(gameConfig.drawCount);

            setCardCount();
        }
    });
});

let deck;
let deckType = ["MicroGain", "StrongGain", "Opportunity", "MicroDiscomfort", "StrongDiscomfort", "Unacceptable", "Technology", "Support"];

// 初始化
function init() {
    // 戒赌
    for (let i = 0; i < gameConfig.deckList["Unacceptable"].length; i++) {
        let card = gameConfig.deckList["Unacceptable"][i];

        if (card.name == "Quit-Gambling") {
            showAlert("您的抽卡系统已被关闭！请前往商店进行清除卡片");
            $("body").append('<div class="deck-closed"></div>');
        }
    }

    // 设置卡牌数量
    setCardCount();
}

// 稳妥起见
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
function getSafeDeck() {
    let safeDeck = [];

    let microGainCount = getCardCount("MicroGain");
    let stringGainCount = getCardCount("StrongGain");
    let microDiscomfortCount = getCardCount("MicroDiscomfort");

    if (microGainCount < 7 || stringGainCount < 1 || microDiscomfortCount < 4) return;

    let microGainList = getDeckList("MicroGain", 7);
    let strongGainList = getDeckList("StrongGain", 1);
    let microDiscomfortList = getDeckList("MicroDiscomfort", 4);

    safeDeck = safeDeck.concat(microGainList).concat(strongGainList).concat(microDiscomfortList);

    return safeDeck;
}

// 身不由己
// 卡池2 身不由己 notself 6张微弱不适 5张重度不适 1张反人类
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

// 赌徒对弈
// 卡池3 对赌博弈 gambit 5张强大增益 1张欧皇增益 5张重度不适 1张反人类
function getGambitDeck() {
    let gambitDeck = [];

    let strongGainCount = getCardCount("StrongGain");
    let opportunityCount = getCardCount("Opportunity");
    let strongDiscomfortCount = getCardCount("StrongDiscomfort");
    let unacceptableCount = getCardCount("Unacceptable");

    if (strongGainCount < 5 || strongDiscomfortCount < 5) return;

    let strongGainList = getDeckList("StrongGain", 5);
    let strongDiscomfortList = getDeckList("StrongDiscomfort", 5);

    gambitDeck = gambitDeck.concat(strongGainList).concat(strongDiscomfortList);

    let card;
    let cardType;

    if (opportunityCount != 0) {
        cardType = "Opportunity";
    }
    else {
        if (strongGainCount < 6) return;

        cardType = "StrongGain";
    }

    while (gambitDeck.length != 11) {
        card = lotteryByCount(gameConfig.deck[cardType]);
        if (checkDeck(gambitDeck, card) && card != undefined) {
            gambitDeck.push(card);
        }
    }

    if (unacceptableCount != 0) {
        cardType = "Unacceptable";
    }
    else {
        if (strongDiscomfortCount < 6) return;

        cardType = "StrongDiscomfort";
    }

    while (gambitDeck.length != 12) {
        card = lotteryByCount(gameConfig.deck[cardType]);
        if (checkDeck(gambitDeck, card) && card != undefined) {
            gambitDeck.push(card);
        }
    }

    return gambitDeck;
}

// 时来运转
// 卡池4 时来运转 luck   1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌
function getLuckDeck() {
    let luckDeck = [];

    let strongGainCount = getCardCount("StrongGain");
    let opportunityCount = getCardCount("Opportunity");
    let strongDiscomfortCount = getCardCount("StrongDiscomfort");
    let unacceptableCount = getCardCount("Unacceptable");
    let technologyCount = getCardCount("Technology");

    if (strongGainCount < 1 || strongDiscomfortCount < 1 || technologyCount < 8) return;

    let strongGainList = getDeckList("StrongGain", 1);
    let strongDiscomfortList = getDeckList("StrongDiscomfort", 1);
    let technologyList = getDeckList("Technology", 8);

    luckDeck = luckDeck.concat(strongGainList).concat(strongDiscomfortList).concat(technologyList);

    let card;
    let cardType;

    if (opportunityCount != 0) {
        cardType = "Opportunity";
    }
    else {
        if (strongGainCount < 1) return;

        cardType = "StrongGain";
    }

    while (luckDeck.length != 11) {
        card = lotteryByCount(gameConfig.deck[cardType]);
        if (checkDeck(luckDeck, card) && card != undefined) {
            luckDeck.push(card);
        }
    }

    if (unacceptableCount != 0) {
        cardType = "Unacceptable";
    }
    else {
        if (strongDiscomfortCount < 6) return;

        cardType = "StrongDiscomfort";
    }

    while (luckDeck.length != 12) {
        card = lotteryByCount(gameConfig.deck[cardType]);
        if (checkDeck(luckDeck, card) && card != undefined) {
            luckDeck.push(card);
        }
    }

    return luckDeck;
}

// 身心奉献
// 卡池5 身心奉献 devote 6张辅助卡牌 6张重度不适
function getDevoteDeck() {
    let devoteDeck = [];

    let microGainCount = getCardCount("MicroGain");
    let supportCount = getCardCount("Support");
    let StrongDiscomfortCount = getCardCount("StrongDiscomfort");

    if (StrongDiscomfortCount < 6) return;

    let StrongDiscomfortList = getDeckList("StrongDiscomfort", 6);

    devoteDeck = devoteDeck.concat(StrongDiscomfortList);

    let card;
    let cartType;
    let deckLength = devoteDeck.length + supportCount;

    while (devoteDeck.length != deckLength) {
        cartType = "Support";
        card = lotteryByCount(gameConfig.deck[cartType]);
        if (checkDeck(devoteDeck, card) && card != undefined) {
            devoteDeck.push(card);
        }
    }

    if (microGainCount < (6 - supportCount)) return;

    while (devoteDeck.length != 12) {
        cartType = "MicroGain";
        card = lotteryByCount(gameConfig.deck[cartType]);
        if (checkDeck(devoteDeck, card) && card != undefined) {
            devoteDeck.push(card);
        }
    }

    return devoteDeck;
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

// 获取卡牌列表卡牌数量
function getDeckListTypeCount(deck, type) {
    let count = 0;

    for (let i = 0; i < deck.length; i++) {
        if (deck[i].type == type) {
            count += 1;
        }
    }

    return count;
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

// 存卡
function pushDeck(deck) {
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

    gameConfig.drawCount -= 1;
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

// 随机卡牌
function getRandomCard() {
    let card = null;

    while (card == null) {
        let index = Math.round(Math.random() * (deckType.length - 1));
        console.log(deckType[index]);
        card = lotteryByCount(gameConfig.deck[deckType[index]]);
        console.log(card);
    }

    return card;
}

// 获取卡牌总数量
function getAllCardCount() {
    let cardCount = 0;

    for (let i = 0; i < deckType.length; i++) {
        let cardType = deckType[i];

        for (let j = 0; j < gameConfig.deck[cardType].length; j++) {
            if (gameConfig.deck[cardType][j].count != 0) {
                cardCount += 1;
            }
        }
    }

    return cardCount;
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

// 设置卡牌数量
function setCardCount() {
    $(".micro-gain-count").text(getCardCount(deckType[0], "micro-gain-count"));
    $(".strong-gain-count").text(getCardCount(deckType[1], "strong-gain-count"));
    $(".opportunity-count").text(getCardCount(deckType[2], "opportunity-count"));
    $(".micro-discomfort-count").text(getCardCount(deckType[3], "micro-discomfort-count"));
    $(".strong-discomfort-count").text(getCardCount(deckType[4], "strong-discomfort-count"));
    $(".unacceptable-count").text(getCardCount(deckType[5], "unacceptable-count"));
    $(".technology-count").text(getCardCount(deckType[6], "technology-count"));
    $(".support-count").text(getCardCount(deckType[7], "support-count"));
}

// 特殊卡牌处理机制 ↓
function specialCard(card) {
    // 特殊卡牌
    // ---------------------------------

    // 资本主义
    if (card.name == "Capitalism") {
        delectCard(card);

        showAlert("获得你序号+2和序号-2玩家的一半货币（5号玩家则1号和3号获得，6号玩家则2号和4号获得）");
    }

    // 生财有道
    if (card.name == "Make-Wealth") {
        delectCard(card);

        showAlert("货币+6")
        gameConfig.money += 6;
        gamepaneMoney.text(gameConfig.money);
        save(gameConfig);
    }

    // 起手换牌
    if (card.name == "Change-Card") {
        delectCard(card);
        let cardNum = 0;
        let drawsCount = 0;

        for (let i = 0; i < deckType.length; i++) {

            let deckList = gameConfig.deckList[deckType[i]];

            for (let j = 0; j < deckList.length; j++) {
                delectCard(deckList[j]);
                cardNum += 1;
                drawsCount += 1;
            }

        }

        gameConfig.drawCount += drawsCount;
        save(gameConfig);

        $("#deck .chance").text(gameConfig.drawCount);
        showAlert("回收了 " + cardNum + " 张卡牌 已兑换成 " + drawsCount + " 次抽卡机会");
    }

    // 恶魔契约
    if (card.name == "Devils-Pact") {
        delectCard(card);
        gameConfig.devilspact = 2;

        showAlert("每在商店购买一次装备就获得一次抽卡机会（至多触发两次）");
    }

    // 上贡
    if (card.name == "Tribute") {
        delectCard(card);

        showAlert("从你的增益卡牌中挑选一张送给1号玩家");
    }

    // 决斗
    if (card.name == "Duel") {
        delectCard(card);

        showAlert("与你的序号+3的玩家签订决斗协议，你们立即前往私人熔炉竞技场的生存使用当前拥有的武器技能决斗，获得第一个回合胜利的玩家得到失败者的全部货币，认输则给对方一半金币");
    }

    // 等价交换
    if (card.name == "Equivalent-Exchange") {
        delectCard(card);

        let players = [1, 2, 3, 4, 5, 6];

        do {
            players = shuffle(players);
        } while (players[0] == gameConfig.roleId);

        showAlert("你需要和 " + players[0] + "号 玩家进行所有卡牌交换");
    }

    // 有福同享
    if (card.name == "Blessed-To-Share") {
        delectCard(card);

        let players = [1, 2, 3, 4, 5, 6];

        do {
            players = shuffle(players);
        } while (players[0] == gameConfig.roleId);

        showAlert("你需要和 " + players[0] + "号 玩家进行增益卡牌共享");
    }

    // 有难同当
    if (card.name == "Share-The-Difficulties") {
        delectCard(card);

        let players = [1, 2, 3, 4, 5, 6];

        do {
            players = shuffle(players);
        } while (players[0] == gameConfig.roleId);

        showAlert("你需要和 " + players[0] + "号 玩家进行减益卡牌共享");
    }

    // 微弱不适

    // 强烈不适

    // 卧槽我钱包呢
    if (card.name == "Lost-Wallet") {
        delectCard(card);

        gameConfig.money = 0;
        save(gameConfig);

        gamepaneMoney.text(gameConfig.money);
        showAlert("杂鱼~你的货币全没了哦~");
    }

}
