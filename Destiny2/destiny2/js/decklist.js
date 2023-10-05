$(function () {
    // 读取存档
    gameConfig = read();

    console.log(gameConfig.decklist);
    
    // 加载手牌
    loadDeck("MicroGain");
    loadDeck("StrongGain");
    loadDeck("Opportunity");
    loadDeck("MicroDiscomfort");
    loadDeck("StrongDiscomfort");
    loadDeck("Unacceptable");
    loadDeck("Technology");

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
        addLoadDeck("MicroGain");
        addLoadDeck("StrongGain");
        addLoadDeck("Opportunity");
        addLoadDeck("MicroDiscomfort");
        addLoadDeck("StrongDiscomfort");
        addLoadDeck("Unacceptable");
        addLoadDeck("Technology");

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
            
            loadDeck(type);
        });
    });

    // 打乱卡牌
    $(".take-button").click(function (e) {
        e.preventDefault();

        $(".take-item").remove();

        let cardNum = 0;

        let deckType = ["MicroGain", "StrongGain", "Opportunity", "StrongDiscomfort", "MicroDiscomfort", "Unacceptable", "Technology"];

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
                '<p class="card-name">' + allDeck[i].cardName + '</p>' +
                '<p class="card-name">- ' + ++cardNum + ' -</p>' +
                '</div>' +
                '</div>' +
                '</div>');
        }

    });
});

// 卡牌信息
function loadDeck(type) {
    let deckList = gameConfig.decklist[type];

    $("#" + type + " .count").text(deckList.length);

    $("#" + type + " .card-item").remove();

    for (let i = 0; i < deckList.length; i++) {
        $("#" + type).append('<div class="card-item" id="' + deckList[i].id + '">' +
            '<div class= "card" >' +
            '<div class="card-info">' +
            '<div>' + 
            '<p class="card-name">- ' + deckList[i].cardName + ' -</p>' +
            '<p class="card-sub">- ' + deckList[i].name + ' -</p>' +
            '</div>' +
            '<p class="card-text">' + deckList[i].description + '</p>' +
            '<button class="button delete-button" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">删除</button>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
}

// 添加卡牌信息
function addLoadDeck(type) {
    let deckList = gameConfig.deck[type];

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].count > 0) {
            $(".card-list-box").append('<div class="add-card-item" id="' + deckList[i].id + '">' +
                '<div class= "card" >' +
                '<div class="card-info">' +
                '<p class="card-id">' + deckList[i].name + '</p>' +
                '<p class="card-name">' + deckList[i].cardName + '</p>' +
                '<button class="button add-button" data-id="' + deckList[i].id + '" data-type="' + deckList[i].type + '">添加</button>' +
                '</div>' +
                '</div>' +
                '</div>');
        }
    }
}