$(function () {
    // 读取游戏存档
    gameConfig = read();

    // 初始化
    init();

    // 提示框
    let tooltip = $('#tooltip');

    $("#shop").mousemove(function (e) {
        // values: e.clientX, e.clientY, e.pageX, e.pageY
        let x = e.pageX + 8;
        let y = e.pageY + 8;

        tooltip.attr("style", "transform:translate(" + x + "px, " + y + "px)");
    });

    // 物品栏
    const items = $(".item");
    for (let i = 0; i < items.length; i++) {

        const itemType = $(items[i]).attr("data-type");
        const itemNumber = $(items[i]).attr("data-number");

        // 物品栏鼠标移入
        $(items[i]).mouseover(function () {
            tooltip.addClass("show");
            setToolTips(itemType, itemNumber);
        });

        // 物品栏鼠标移出
        $(items[i]).mouseleave(function () {
            tooltip.removeClass("show");
        });
    }

    // 圣水点击事件
    $(".water").click(function (e) {
        e.preventDefault();

        // 卡组类型
        const deckType = $(this).attr("data-deck");
        const decklist = gameConfig.decklist[deckType];

        // 物品属性
        let itemSell = 0;

        switch (deckType) {
            case "MicroDiscomfort":
                itemSell = 0;
                break;
            case "StrongDiscomfort":
                itemSell = 1;
                break;
            case "Unacceptable":
                itemSell = 2;
                break;
            default:
                break;
        }

        // 售价
        let sell = gameConfig.shop.fixedItems[itemSell].sell;

        if (profiteer) sell += 1;

        if (gameConfig.money < sell) {
            showAlert("货币不足无法购买");
            return;
        }

        // 判断
        if (decklist == null | decklist.length == 0) {
            showAlert("你当前没有可以消除的卡牌");
            return;
        }

        setCardItem(deckType, sell);

        $("#card-model").modal("show");
    });

    // 抽卡机会
    $(".draw-count").click(function (e) {
        e.preventDefault();

        let sell = gameConfig.shop.fixedItems[3].sell;

        if (gameConfig.money < sell) {
            showAlert("货币不足");
            return;
        }

        gameConfig.money -= gameConfig.shop.fixedItems[3].sell;
        gameConfig.drawCount += 1;
        save(gameConfig);

        showAlert("您已增加一次抽卡机会");

        setGamePanel();
    });

    // 随机售卖栏
    $(".random-list .item").click(function (e) {
        e.preventDefault();
        const itemType = $(this).attr("data-type");
        const itemNumber = $(this).attr("data-number");
        buyShopItem(itemType, itemNumber);
    });

    // 刷新商店按钮
    $(".refresh-button").click(function (e) {
        e.preventDefault();

        let refreshCount = gameConfig.refreshCount;

        let refreshMod = refreshCount == 1 ? "free" : "pay";

        switch (refreshMod) {
            case "free":
                $("#refresh-count span").text(refreshCount - 1);
                refreshShopItem();
                gameConfig.refreshCount--;
                save(gameConfig);
                break;
            case "pay":
                let money = gameConfig.money;
                if (money - gameConfig.refreshMoney < 0) {
                    showAlert("货币不足");
                    return;
                };

                gameConfig.money -= gameConfig.refreshMoney;
                gameConfig.refreshMoney += 1;

                $("#pay-count span").text(gameConfig.refreshMoney);

                refreshShopItem();
                save(gameConfig);

                setGamePanel();
                break;
            default:
                break;
        }

    });
});

// 武器列表1
let weapons1;

// 武器列表2
let weapons2;

// 武器列表3
let weapons3;

// 泰坦装备列表
let titanArmor;

// 猎人装备列表
let hunterArmor;

// 术士装备列表
let warlockArmor;

// 商店价格提高
let profiteer;

// 设置默认信息
function init() {

    // 商店检测
    for (let i = 0; i < gameConfig.decklist["Unacceptable"].length; i++) {
        let card = gameConfig.decklist["Unacceptable"][i];

        if (card.name == "Stillwater-Prison") {
            showAlert("您的商店系统已被关闭！");
            $("body").append('<div class="shop-closed"><button class="button open-shop">开启商店</button></div>');

            $(".open-shop").click(function (e) {
                e.preventDefault();

                let sell = 12;

                if (profiteer) sell += 1;

                if (gameConfig.money < sell) {
                    showAlert("你需要 " + sell + " 货币才能解锁商店");
                }
                else {
                    let deck = gameConfig.deck["Unacceptable"];

                    let name = "Stillwater-Prison";

                    for (let i = 0; i < deck.length; i++) {
                        if (deck[i].name == name) {
                            deck[i].count += 1;
                            break;
                        }
                    }

                    let decklist = gameConfig.decklist["Unacceptable"];

                    for (let i = 0; i < decklist.length; i++) {
                        if (decklist[i].name == name) {
                            decklist[i] = null;
                            break;
                        }
                    }

                    let newDecklist = [];

                    for (let i = 0; i < decklist.length; i++) {
                        if (decklist[i] != null) {
                            newDecklist.push(decklist);
                        }
                    }

                    gameConfig.money -= sell;
                    gameConfig.decklist["Unacceptable"] = newDecklist;

                    save(gameConfig);

                    showAlert("你已重新开启商店系统");
                    $(".shop-closed").remove();
                    setGamePanel();
                }
            });
        }
    }

    // 价格检测
    for (let i = 0; i < gameConfig.decklist["StrongDiscomfort"].length; i++) {
        let card = gameConfig.decklist["StrongDiscomfort"][i];
        if (card.name == "Reicher-Playboy") {
            profiteer = true;
            showAlert("购买任意物品价格提高 1 货币！");
            break;
        }
        else {
            profiteer = false;
        }
    }

    // 恶魔契约检测
    if (gameConfig.devilspact != 0) {
        showAlert("恶魔契约已启用");
    }

    $("#pay-count span").text(gameConfig.refreshMoney);
    $("#refresh-count span").text(gameConfig.refreshCount);

    weapons1 = gameConfig.weapons1;
    weapons2 = gameConfig.weapons3;
    weapons2 = gameConfig.weapons3;
    titanArmor = gameConfig.titanArmor;
    hunterArmor = gameConfig.hunterArmor;
    warlockArmor = gameConfig.warlockArmor;

    setShopItem();
    randomShopItem();
}

// 获取商店类型
function getShopType(type, number) {
    let info = "";

    switch (type) {
        case "fixed":
            info = gameConfig.shop.fixedItems[number];
            break;
        case "random":
            info = gameConfig.shop.randomItems[number];
            break;
        default:
            break;
    }

    return info;
}

// 设置提示信息
function setToolTips(type, number) {

    // 获取信息
    let info = getShopType(type, number);

    // 修改 ToolTips 颜色
    const wrapper = $("#tooltip .wrapper");
    const header = $("#tooltip .header");

    switch (info.rarity) {
        case "异域":
            wrapper.css("background-color", "#2A271A");
            header.css("background-color", "#CFB444");
            break;
        case "传说":
            wrapper.css("background-color", "#262727");
            header.css("background-color", "#633F60");
            break;
        case "稀有":
            wrapper.css("background-color", "#262727");
            header.css("background-color", "#5F81AB");
            break;
        case "罕见":
            wrapper.css("background-color", "#262727");
            header.css("background-color", "#477B4D");
            break;
        case "无":
        default:
            wrapper.css("background-color", "#262727");
            header.css("background-color", "#C6C0B9");
            break;
    }

    const name = $("#tooltip .header .name");
    const kind = $("#tooltip .kind");
    const rarity = $("#tooltip .rarity");
    const description = $("#tooltip .description .type");
    const money = $("#tooltip .money");
    const sell = $("#tooltip .sell");
    const count = $("#tooltip .count");

    name.text(info.name);
    kind.text(info.kind);
    rarity.text(info.rarity);
    description.text(info.description);
    money.text(gameConfig.money);
    // sell.text(info.sell);

    if (profiteer) {
        sell.text(info.sell + 1);
    }
    else {
        sell.text(info.sell);
    }

    count.text(info.count);
}

// 设置商店信息
function setShopItem() {

    // 固定物品栏
    const fixedListItem = $(".fixed-list .item");

    for (let i = 0; i < fixedListItem.length; i++) {
        $(fixedListItem[i]).attr("data-name", gameConfig.shop.fixedItems[i].name);
        $(fixedListItem[i]).attr("data-number", i);
        $(fixedListItem[i]).attr("data-type", "fixed");
    }
}

// 随机商店物品
function randomShopItem() {
    // 固定物品栏
    const randomListItem = $(".random-list .item");

    for (let i = 0; i < randomListItem.length; i++) {
        $(randomListItem[i]).attr("data-name", gameConfig.shop.randomItems[i].name);
        $(randomListItem[i]).attr("data-number", i);
        $(randomListItem[i]).attr("data-type", "random");

        if (gameConfig.shop.randomItems[i].name == "空物品") continue;

        switch (i) {
            case 0:
                $(randomListItem[i]).attr("style", "background-image:url('images/shop/1/" + gameConfig.shop.randomItems[i].name + ".jpg')");
                break;
            case 1:
                $(randomListItem[i]).attr("style", "background-image:url('images/shop/2/" + gameConfig.shop.randomItems[i].name + ".jpg')");
                break;
            case 2:
                $(randomListItem[i]).attr("style", "background-image:url('images/shop/3/" + gameConfig.shop.randomItems[i].name + ".jpg')");
                break;
            case 3:
                $(randomListItem[i]).attr("style", "background-image:url('images/weapons/" + gameConfig.shop.randomItems[i].name + ".jpg')");
                break;
            case 4:
                $(randomListItem[i]).attr("style", "background-image:url('images/" + gameConfig.role + "/" + gameConfig.shop.randomItems[i].name + ".jpg')");
                break;
            default:
                break;
        }
    }
}

// 刷新商店
function refreshShopItem() {
    let randomItems = gameConfig.shop.randomItems;
    randomItems[0] = lotteryByCount(gameConfig.weapons1);
    randomItems[1] = lotteryByCount(gameConfig.weapons2);
    randomItems[2] = lotteryByCount(gameConfig.weapons3);
    randomItems[3] = lotteryByCount(gameConfig.exotic);

    // 检测角色类型
    switch (gameConfig.role) {
        case "titan":
            randomItems[4] = lotteryByCount(gameConfig.titanArmor);
            break;
        case "hunter":
            randomItems[4] = lotteryByCount(gameConfig.hunterArmor);
            break;
        case "warlock":
            randomItems[4] = lotteryByCount(gameConfig.warlockArmor);
            break;
        default:
            break;
    }

    randomShopItem();
}

// 购买物品
function buyShopItem(type, number) {
    // 获取商店类型
    const shopList = getShopType(type, number);

    // 货币
    let money = gameConfig.money;
    let sell = shopList.sell;

    if (profiteer) sell += 1;

    // 货币不足
    if (money < sell) {
        showAlert("货币不足无法购买");
        return;
    }

    // 购买成功
    gameConfig.money = money - sell;

    shopList.count--;

    // 恶魔契约
    if (gameConfig.devilspact != 0) {
        gameConfig.devilspact -= 1;
        gameConfig.drawCount += 1;
    }

    save(gameConfig);

    showAlert("购买 " + shopList.name + " 成功");

    setGamePanel();
}

// 设置卡牌信息
function setCardItem(type, sell) {
    let deckList = gameConfig.decklist[type];

    $(".card-item").remove();
    for (let i = 0; i < deckList.length; i++) {
        $(".card-list-box").append('<div class="card-item" data-id="' + deckList[i].id + '">' +
            '<div class="card">' +
            '<div class="card-info">' +
            '<p class="card-id">' + deckList[i].id + '</p>' +
            '<p class="card-name">' + deckList[i].cardName + '</p>' +
            '</div>' +
            '</div>' +
            '</div>');
    }

    // 删除卡牌
    // 需要优化
    $(".card-item").click(function (e) {
        e.preventDefault();

        const cardId = $(this).attr("data-id");
        let card;

        if (cardId == "Aatrox") {
            deleteAatroxCard();
            $("#card-model").modal("hide");
            return;
        }

        for (let i = 0; i < deckList.length; i++) {
            if (deckList[i].id == cardId) {
                card = deckList[i];
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

        showAlert("你已删除 - " + card.cardName + " - 卡牌");

        gameConfig.money -= sell;

        save(gameConfig);

        setGamePanel();

        $("#card-model").modal("hide");
    });
}