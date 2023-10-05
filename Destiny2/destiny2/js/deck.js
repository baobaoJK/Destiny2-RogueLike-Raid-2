let deck;

$(function () {

    // 读取存档
    gameConfig = read();

    // 抽卡次数
    $("#deck .chance").text(gameConfig.drawCount);

    // 卡组点击事件
    $(".deck div").click(function (e) {

        if (gameConfig.drawCount <= 0) {
            showAlert("你没有抽卡次数")
            return;
        };

        const deckType = $(this).attr("id");

        switch (deckType) {
            case "safe":
                $(".deck-list-box").addClass("deck-1");
                deck = drawDeck(7, 1, 0, 4, 0, 0, 0);
                break;
            case "danger":
                $(".deck-list-box").addClass("deck-2");
                deck = drawDeck(1, 3, 0, 7, 1, 0, 0);
                break;
            case "gambit":
                $(".deck-list-box").addClass("deck-3");
                deck = drawDeck(0, 5, 1, 0, 5, 1, 0);
                break;
            case "luck":
                $(".deck-list-box").addClass("deck-4");
                deck = drawDeck(0, 1, 1, 0, 1, 1, 8);
                break;
            case "devote":
                $(".deck-list-box").addClass("deck-5");
                deck = drawDeck(2, 4, 0, 0, 6, 0, 0);
                break;
            default:
                break;
        }

        console.log(deck);

        $("#deck-model").modal("show");

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

            gameConfig.drawCount -= 1;
            save(gameConfig);

            $("#deck .chance").text(gameConfig.drawCount);
            $(this).addClass("flip");

            let cardId = $(this).attr("data-id") - 1;

            saveDeck(deck[cardId]);
            removerCard(deck[cardId]);
        }
    });
});

// 抽取卡池
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
// 卡池2 险中求胜 dange  1张微弱增益 3张强大增益 7张微弱不适 1张重度不适
// 卡池3 对赌博弈 gambit 5张强大增益 1张欧皇增益 5张重度不适 1张反人类
// 卡池4 时来运转 luck   1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌
// 卡池5 身心奉献 devote 2张微弱增益 4张强大增益 6张重度不适
function drawDeck(MicroGain, StrongGain, Opportunity, MicroDiscomfort, StrongDiscomfort, Unacceptable, Technology) {
    let tempDeck = [];
    let card;

    // 微弱增益
    while (tempDeck.length != MicroGain) {
        card = lotteryByCount(gameConfig.deck.MicroGain);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 强大增益
    while (tempDeck.length != (MicroGain + StrongGain)) {
        card = lotteryByCount(gameConfig.deck.StrongGain);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 欧皇增益
    while (tempDeck.length != (MicroGain + StrongGain + Opportunity)) {
        card = lotteryByCount(gameConfig.deck.Opportunity);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 微弱不适
    while (tempDeck.length != (MicroGain + StrongGain + Opportunity + MicroDiscomfort)) {
        card = lotteryByCount(gameConfig.deck.MicroDiscomfort);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 强大不适
    while (tempDeck.length != (MicroGain + StrongGain + Opportunity + MicroDiscomfort + StrongDiscomfort)) {
        card = lotteryByCount(gameConfig.deck.StrongDiscomfort);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 反人类
    while (tempDeck.length != (MicroGain + StrongGain + Opportunity + MicroDiscomfort + StrongDiscomfort + Unacceptable)) {
        card = lotteryByCount(gameConfig.deck.Unacceptable);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 特殊
    while (tempDeck.length != (MicroGain + StrongGain + Opportunity + MicroDiscomfort + StrongDiscomfort + Unacceptable + Technology)) {

        let cardSum = 0;
        for (let i = 0; i < gameConfig.deck.Technology.length; i++) {
            cardSum += gameConfig.deck.Technology[i].count;
        }

        if (cardSum >= Technology) {
            card = lotteryByCount(gameConfig.deck.Technology);
            if (checkDeck(tempDeck, card)) {
                tempDeck.push(card);
            };
        }
        else {

            for (let i = 0; i < gameConfig.deck.Technology.length; i++) {
                if (gameConfig.deck.Technology[i].count != 0) {
                    tempDeck.push(gameConfig.deck.Technology[i]);
                };
            }

            for (let i = 0; i < Technology - cardSum; i++) {
                let tempCard = lotteryByCount(gameConfig.deck.StrongGain);

                if (checkDeck(tempDeck, tempCard)) {
                    tempDeck.push(tempCard);
                };
            }
        }
    }

    // console.log(tempDeck);
    return tempDeck;
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

// 卡牌数量减少
function removerCard(card) {
    const cardId = card.id;
    const cardType = card.type;

    let deck = gameConfig.deck[cardType];

    let i = 0;
    for (; i < deck.length; i++) {
        if (deck[i].id == cardId) {
            break;
        }
    }

    gameConfig.deck[cardType][i].count -= 1;
    save(gameConfig);
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

    switch (card.type) {
        case "MicroGain":
            gameConfig.decklist.MicroGain.push(card);
            break;
        case "StrongGain":
            gameConfig.decklist.StrongGain.push(card);
            break;
        case "Opportunity":
            gameConfig.decklist.Opportunity.push(card);
            break;
        case "MicroDiscomfort":
            gameConfig.decklist.MicroDiscomfort.push(card);
            specialCard(card);
            break;
        case "StrongDiscomfort":
            gameConfig.decklist.StrongDiscomfort.push(card);
            specialCard(card);
            break;
        case "Unacceptable":
            gameConfig.decklist.Unacceptable.push(card);
            specialCard(card);
            break;
        case "Technology":
            gameConfig.decklist.Technology.push(card);
            specialCard(card);
            break;
        default:
            break;
    }

    save(gameConfig);
    console.log(gameConfig.decklist);
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

        gameConfig.money += 6;
        gamepaneMoney.text(gameConfig.money);
        save(gameConfig);
    }

    // 起手换牌
    if (card.name == "Change-Card") {
        delectCard(card);
        let cardNum = 0;
        let drawsCount = 0;

        let deckType = ["MicroGain", "StrongGain", "Opportunity", "MicroDiscomfort", "StrongDiscomfort", "Unacceptable", "Technology"];

        for (let i = 0; i < deckType.length; i++) {

            let deckList = gameConfig.decklist[deckType[i]];

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

        showAlert("恶魔契约触发");
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

    // 鱿鱼游戏
    if (card.name == "Squid-Game") {
        return;
    }

    // 等价交换
    if (card.name == "Equivalent-Exchange") {
        showAlert("当队伍里有两名玩家抽到这此卡时，将你们的所有手牌互相交换");
    }

    // 赌徒
    if (card.name == "Gambler") {
        return;
    }

    // 微弱不适

    // 取舍
    if (card.name == "Trade-Off") {

    }

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

// 删除卡片
function delectCard(card) {
    console.log("卡牌回收机制");
    let deckList = gameConfig.decklist[card.type];

    for (let i = 0; i < deckList.length; i++) {

        if (deckList[i].id == card.id) {
            deckList[i] = null;

            let tempDeck = gameConfig.deck[card.type];

            for (let j = 0; j < tempDeck.length; j++) {

                if (tempDeck[j].id == card.id) {
                    gameConfig.deck[card.type][j].count += 1;

                    let newDeckList = [];

                    for (let k = 0; k < deckList.length; k++) {
                        if (deckList[k] != null) {
                            newDeckList.push(deckList[k]);
                        }
                    }

                    gameConfig.decklist[card.type] = newDeckList;
                    save(gameConfig);
                }
            }

        }
        break;
    }
}