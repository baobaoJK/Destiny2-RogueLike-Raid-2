$(function () {
    // 读取存档
    gameConfig = read();

    console.log(gameConfig.deckList);

    // 加载手牌
    for (let i = 0; i < deckType.length; i++) {
        loadDeck(deckType[i]);
    }

    // 卡牌删除
    $(".delete-button").click(function (e) {
        e.preventDefault();
        delectCard(this);
    });

    // 卡牌添加
    $(".get-button").click(function (e) {
        e.preventDefault();
        addCard();
    });

    // 打乱卡牌
    $(".random-button").click(function (e) {
        e.preventDefault();
        randomCards();
    });
});

let deckType = ["MicroGain", "StrongGain", "Opportunity", "StrongDiscomfort", "MicroDiscomfort", "Unacceptable", "Technology", "Support"];

// 卡牌信息
function loadDeck(type) {
    let deckList = gameConfig.deckList[type];

    $("#" + type + " .count").text(deckList.length);

    $("#" + type + " .card-item").remove();

    for (let i = 0; i < deckList.length; i++) {
        $("#" + type).append('<div class="card-item" id="' + deckList[i].id + '">' +
            '<div class="card">' +
            '<div class="card-info">' +
            '<div>' +
            '<p class="card-name">- ' + deckList[i].cardName + ' -</p>' +
            '<p class="card-sub">- ' + deckList[i].name + ' -</p>' +
            '</div>' +
            '<p class="card-text">' + deckList[i].description + '</p>' +
            '</div>' +
            '</div>' +
            '<button class="button delete-button" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">删除</button>' +
            '</div>');
    }
}

// 添加卡牌信息
function addLoadDeck(type) {
    let deckList = gameConfig.deck[type];

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].count > 0) {
            $(".card-list-box").append('<div class="item add-card-item" id="' + deckList[i].id + '" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">' +
                '<div class="card" >' +
                '<div class="info card-info">' +
                '<p class="card-id">' + deckList[i].name + '</p>' +
                '<p class="card-name">' + deckList[i].cardName + '</p>' +
                '</div>' +
                '</div>' +
                // '<button class="button add-button" data-id="' + deckList[i]  .id + '" data-type="' + deckList[i].type + '">添加</button>' +
                '</div>');
        }
    }
}

// 删除卡牌
function delectCard(button) {

    const cardId = $(button).attr("data-id");
    const type = $(button).attr("data-type");
    const name = $("#" + cardId + " .card-name").text();

    let deckList = gameConfig.deckList[type];

    if (cardId == "Aatrox") {
        deleteAatroxCard();
        return;
    }

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].id == cardId) {
            deckList[i] = null;
            break;
        }
    }

    let tempDeck = gameConfig.deck[type];

    for (let j = 0; j < tempDeck.length; j++) {
        if (tempDeck[j].id == cardId) {
            gameConfig.deck[type][j].count += 1;
            break;
        }
    }

    let newDeckList = [];
    for (let k = 0; k < deckList.length; k++) {
        if (deckList[k] != null) {
            newDeckList.push(deckList[k]);
        }
    }

    gameConfig.deckList[type] = newDeckList;
    save(gameConfig);

    showAlert("你已删除 " + name + " 卡牌");

    $("#" + cardId).remove();
    $("#" + type + " .count").text(gameConfig.deckList[type].length);
}

// 打乱卡牌
function randomCards() {
    $(".random-item").remove();

    let cardNum = 0;

    let allDeck = [];

    for (let i = 0; i < deckType.length; i++) {

        let deckList = gameConfig.deckList[deckType[i]];

        $("#" + deckType[i] + " .count").text(deckList.length);
        for (let i = 0; i < deckList.length; i++) {
            allDeck.push(deckList[i]);
        }
    }

    if (allDeck.length == 0) {
        showAlert("你当前没有卡牌可以打乱");
        return;
    }

    $("#random-model").modal("show");

    allDeck = shuffle(allDeck);

    for (let i = 0; i < allDeck.length; i++) {

        $(".random-list-box").append('<div class="item random-item">' +
            '<div class="card">' +
            '<div class="info random-info">' +
            '<p class="card-id">' + allDeck[i].name + '</p>' +
            '<p class="card-name">' + allDeck[i].cardName + '</p>' +
            '<p class="card-name">- ' + ++cardNum + ' -</p>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
}

// 添加卡牌
function addCard() {
    $(".add-card-item").remove();

    for (let i = 0; i < deckType.length; i++) {
        addLoadDeck(deckType[i]);
    }

    $(".add-card-item").click(function (e) {
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
                gameConfig.deckList[type].push(card);
                save(gameConfig);
                break;
            }
        }

        showAlert("你已添加 " + name + " 卡牌");

        $("#" + cardId).remove();
        $("#" + type + " .count").text(gameConfig.deckList[type].length);

        loadDeck(type);
    });
}