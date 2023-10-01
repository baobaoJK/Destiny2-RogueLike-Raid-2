$(function () {

    $(".deck div").click(function (e) {
        const deckType = $(this).attr("id");
        let deck;

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

        $(this).addClass("flip");
    });
});

// 抽取卡池
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
// 卡池2 险中求胜 dange  1张微弱增益 3张强大增益 7张微弱不适 1张重度不适
// 卡池3 对赌博弈 gambit 5张强大增益 1张欧皇增益 5张重度不适 1张反人类
// 卡池4 时来运转 luck   1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌
// 卡池5 身心奉献 devote 2张微弱增益 4张强大增益 6张重度不适
function drawDeck(mg, sg, o, md, sd, u, t) {
    let tempDeck = [];
    let card;

    // 微弱增益
    while (tempDeck.length != mg) {
        card = lotteryByCount(gameConfig.deck.mg);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 强大增益
    while (tempDeck.length != (mg + sg)) {
        card = lotteryByCount(gameConfig.deck.sg);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 欧皇增益
    while (tempDeck.length != (mg + sg + o)) {
        card = lotteryByCount(gameConfig.deck.o);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 微弱不适
    while (tempDeck.length != (mg + sg + o + md)) {
        card = lotteryByCount(gameConfig.deck.md);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 强大不适
    while (tempDeck.length != (mg + sg + o + md + sd)) {
        card = lotteryByCount(gameConfig.deck.sd);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 反人类
    while (tempDeck.length != (mg + sg + o + md + sd + u)) {
        card = lotteryByCount(gameConfig.deck.u);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
    }

    // 特殊
    while (tempDeck.length != (mg + sg + o + md + sd + u + t)) {
        card = lotteryByCount(gameConfig.deck.t);
        if (checkDeck(tempDeck, card)) {
            tempDeck.push(card);
        };
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

// 存卡
function pushDeck(deck) {
    for (let i = 1; i < deck.length + 1; i++) {
        $("#card-" + i + " .card-id").text(deck[i - 1].id);
        $("#card-" + i + " .card-name").text(deck[i - 1].name);
    }

    let cards = $(".card-item");
    for (let i = 0; i < deck.length; i++) {
        let randomPos = Math.floor(Math.random() * deck.length);
        // order 顺序
        cards[i].style.order = randomPos;
    }
}