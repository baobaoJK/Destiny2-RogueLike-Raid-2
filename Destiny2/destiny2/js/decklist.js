$(function () {
    // 读取存档
    gameConfig = read();

    loadDeck("mg");
    loadDeck("sg");
    loadDeck("o");
    loadDeck("md");
    loadDeck("sd");
    loadDeck("u");
    loadDeck("t");


    // 卡牌删除
    $(".delete-button").click(function (e) {
        e.preventDefault();


        const cardId = $(this).attr("data-id");
        const type = $(this).attr("data-type");
        const name = $("#" + cardId + " .card-name").text();

        let deckList = gameConfig.decklist[type];

        if (cardId == "Aatrox") {
            deleteAatroxCard();
            return;
        }

        for (let i = 0; i < deckList.length; i++) {
            if (deckList[i].id == cardId) {
                deckList[i] = null;

                let tempDeck = gameConfig.deck[type];

                for (let j = 0; j < tempDeck.length; j++) {
                    if (tempDeck[j].id == cardId) {
                        gameConfig.deck[type][j].count += 1;

                        let newDeckList = [];
                        for (let k = 0; k < deckList.length; k++) {
                            if (deckList[k] != null) {
                                newDeckList.push(deckList[k]);
                            }
                        }
                        gameConfig.decklist[type] = newDeckList;
                        save(gameConfig);
                    }
                }
            }
        }

        showAlert("你已删除 " + name + " 卡牌");

        $("#" + cardId).remove();
        $("#" + type + " .count").text(gameConfig.decklist[type].length);
    });

    // 卡牌添加
    $(".get-button").click(function (e) {
        $(".add-card-item").remove();
        addLoadDeck("mg");
        addLoadDeck("sg");
        addLoadDeck("o");
        addLoadDeck("md");
        addLoadDeck("sd");
        addLoadDeck("u");
        addLoadDeck("t");

        $(".add-button").click(function (e) {
            e.preventDefault();
            const cardId = $(this).attr("data-id");
            const type = $(this).attr("data-type");
            const name = $("#" + cardId + " .card-name").text();

            let deck = gameConfig.deck[type];
            let card;

            for (let i = 0; i < deck.length; i++) {
                if (deck[i].id == cardId) {
                    gameConfig.deck[type][i].count -= 1;
                    card = deck[i];
                    gameConfig.decklist[type].push(card);
                    save(gameConfig);
                    break;
                }
            }

            showAlert("你已添加 " + name + " 卡牌");

            $("#" + cardId).remove();
            $("#" + type + " .count").text(gameConfig.decklist[type].length);
        });
    });

    // 顺手牵羊
    $(".take-button").click(function (e) {
        e.preventDefault();

        $(".take-item").remove();

        let cardNum = 0;

        let deckType = ["mg", "sg", "o", "sd", "md", "u", "t"];

        let allDeck = [];

        for (let i = 0; i < deckType.length; i++) {

            let deckList = gameConfig.decklist[deckType[i]];

            $("#" + deckType[i] + " .count").text(deckList.length);
            for (let i = 0; i < deckList.length; i++) {
                allDeck.push(deckList[i]);
            }
        }

        allDeck = shuffle(allDeck);

        for (let i = 0; i < allDeck.length; i++) {

            $(".take-list-box").append('<div class="take-item">' +
                '<div class="card">' +
                '<div class="take-info">' +
                '<p class="card-id">' + allDeck[i].id + '</p>' +
                '<p class="card-name">' + allDeck[i].name + '</p>' +
                '<p class="card-name">- ' + ++cardNum + ' -</p>' +
                '</div>' +
                '</div>' +
                '</div>');
        }

    });
});
// 洗牌
function shuffle(array) {
    let res = [], random;
    while (array.length > 0) {
        random = Math.floor(Math.random() * array.length);
        res.push(array[random]);
        array.splice(random, 1);
    }
    return res;
}

// 卡牌信息
function loadDeck(type) {
    let deckList;

    switch (type) {
        case "mg":
            deckList = gameConfig.decklist.mg;
            break;
        case "sg":
            deckList = gameConfig.decklist.sg;
            break;
        case "o":
            deckList = gameConfig.decklist.o;
            break;
        case "md":
            deckList = gameConfig.decklist.md;
            break;
        case "sd":
            deckList = gameConfig.decklist.sd;
            break;
        case "u":
            deckList = gameConfig.decklist.u;
            break;
        case "t":
            deckList = gameConfig.decklist.t;
            break;
        default:
            break;
    }

    $("#" + type + " .count").text(deckList.length);
    for (let i = 0; i < deckList.length; i++) {
        $("#" + type).append('<div class="card-item" id="' + deckList[i].id + '">' +
            '<div class= "card" >' +
            '<div class="card-info">' +
            '<p class="card-text">' + deckList[i].description + '</p>' +
            '<button class="button delete-button" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">删除</button>' +
            '</div>' +
            '</div>' +
            '<p class="card-name">- ' + deckList[i].name + ' -</p>' +
            '</div>');
    }
}

// 添加卡牌信息
function addLoadDeck(type) {
    let deckList;

    switch (type) {
        case "mg":
            deckList = gameConfig.deck.mg;
            break;
        case "sg":
            deckList = gameConfig.deck.sg;
            break;
        case "o":
            deckList = gameConfig.deck.o;
            break;
        case "md":
            deckList = gameConfig.deck.md;
            break;
        case "sd":
            deckList = gameConfig.deck.sd;
            break;
        case "u":
            deckList = gameConfig.deck.u;
            break;
        case "t":
            deckList = gameConfig.deck.t;
            break;
        default:
            break;
    }

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].count > 0) {
            $(".card-list-box").append('<div class="add-card-item" id="' + deckList[i].id + '">' +
                '<div class= "card" >' +
                '<div class="card-info">' +
                '<p class="card-id">' + deckList[i].id + '</p>' +
                '<p class="card-name">' + deckList[i].name + '</p>' +
                '<button class="button add-button" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">添加</button>' +
                '</div>' +
                '</div>' +
                '</div>');
        }
    }
}