$(function () {
    init();

    // 提示框
    let tooltip = $('#tooltip');

    $("#shop").mousemove(function (e) {
        // values: e.clientX, e.clientY, e.pageX, e.pageY
        let x = e.pageX + 8;
        let y = e.pageY + 8;

        tooltip.attr("style", "transform:translate(" + x + "px, " + y + "px)");
    });

    // 圣水1 点击事件
    $(".water-1").click(function (e) {
        e.preventDefault();
        const decklist = gameConfig.decklist.md;
        console.log(decklist);
        if (gameConfig.money < gameConfig.shop.fixedItems[0].sell) {
            alert("货币不足无法购买");
            return;
        }

        if (decklist == null | decklist.length == 0) {
            alert("你当前没有可以消除的卡牌");
            return;
        }

        $("#card-model").modal("show");

        setCardItem("md");

        if (gameConfig.profiteer) {
            gameConfig.money -= (gameConfig.shop.fixedItems[0].sell + 1);
        }
        else {
            gameConfig.money -= gameConfig.shop.fixedItems[0].sell;
        }
        save(gameConfig);
        parentElement = parentJQuery(".money span");
        parentElement.text(gameConfig.money);
        $("#tooltip .money").text(gameConfig.money);
    });

    // 圣水2 点击事件
    $(".water-2").click(function (e) {
        e.preventDefault();
        const decklist = gameConfig.decklist.sd;
        console.log(decklist);
        if (gameConfig.money < gameConfig.shop.fixedItems[1].sell) {
            alert("货币不足无法购买");
            return;
        }

        if (decklist == null | decklist.length == 0) {
            alert("你当前没有可以消除的卡牌");
            return;
        }

        $("#card-model").modal("show");

        setCardItem("sd");

        if (gameConfig.profiteer) {
            gameConfig.money -= (gameConfig.shop.fixedItems[1].sell + 1);
        }
        else {
            gameConfig.money -= gameConfig.shop.fixedItems[1].sell;
        }
        save(gameConfig);
        parentElement = parentJQuery(".money span");
        parentElement.text(gameConfig.money);
        $("#tooltip .money").text(gameConfig.money);
    });

    // 圣水3 点击事件
    $(".water-3").click(function (e) {
        e.preventDefault();
        const decklist = gameConfig.decklist.u;
        if (gameConfig.money < gameConfig.shop.fixedItems[2].sell) {
            alert("货币不足无法购买");
            return;
        }

        if (decklist == null | decklist.length == 0) {
            alert("你当前没有可以消除的卡牌");
            return;
        }

        $("#card-model").modal("show");

        setCardItem("u");

        if (gameConfig.profiteer) {
            gameConfig.money -= (gameConfig.shop.fixedItems[2].sell + 1);
        }
        else {
            gameConfig.money -= gameConfig.shop.fixedItems[2].sell;
        }

        save(gameConfig);
        parentElement = parentJQuery(".money span");
        parentElement.text(gameConfig.money);
        $("#tooltip .money").text(gameConfig.money);
    });

    // 抽卡机会
    $(".draw-count").click(function (e) {
        e.preventDefault();

        if (gameConfig.money < gameConfig.shop.fixedItems[3].sell) {
            alert("货币不足");
            return;
        }

        gameConfig.money -= gameConfig.shop.fixedItems[3].sell;
        gameConfig.cardDrawsCount += 1;
        save(gameConfig);
        parentElement = parentJQuery(".money span");
        parentElement.text(gameConfig.money);
        $("#tooltip .money").text(gameConfig.money);
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
                    alert("货币不足");
                    return;
                };

                gameConfig.money -= gameConfig.refreshMoney;
                gameConfig.refreshMoney += 1;
                parentElement = parentJQuery(".money span");
                parentElement.text(gameConfig.money);

                $("#pay-count span").text(gameConfig.refreshMoney);

                refreshShopItem();
                save(gameConfig);
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

// 设置默认信息
function init() {
    gameConfig = read();

    // 商店检测
    for (let i = 0; i < gameConfig.decklist.u.length; i++) {
        let card = gameConfig.decklist.u[i];

        if (card.id == "U2") {
            showAlert("您的商店系统已被关闭！");
            $("body").append('<div class="shop-closed"></div>');
            return;
        }
    }

    // 价格检测
    for (let i = 0; i < gameConfig.decklist.sd.length; i++) {
        let card = gameConfig.decklist.sd[i];
        if (card.id == "SD2") {
            showAlert("购买任意物品价格提高 1 货币！");
            gameConfig.profiteer = true;
        }
        else {
            gameConfig.profiteer = false;
        }
    }

    $("#pay-count span").text(gameConfig.refreshMoney);
    $("#refresh-count span").text(gameConfig.refreshCount);

    weapons1 = gameConfig.weapons1;
    weapons2 = gameConfig.weapons3;
    weapons2 = gameConfig.weapons3;
    titanArmor = gameConfig.titanArmor;
    hunterArmor = gameConfig.hunterArmor;
    warlockArmor = gameConfig.warlockArmor;

    setFristShop();
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

    if (gameConfig.profiteer) {
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

    if (gameConfig.profiteer) {
        sell += 1;
    }

    // 货币不足
    if (money < sell) {
        alert("货币不足无法购买");
        return;
    }

    // 购买成功
    gameConfig.money = money - sell;
    shopList.count--;
    save(gameConfig);
    alert("购买 " + shopList.name + " 成功");
    parentElement = parentJQuery(".money span");
    parentElement.text(gameConfig.money);
}

// 第一次加载商店
function setFristShop() {
    let refreshMoney = gameConfig.refreshMoney;

    if (refreshMoney > 0) {
        return;
    }

    gameConfig.refreshMoney = 2;

    refreshShopItem();
    randomShopItem();

    save(gameConfig);
}

// 设置卡牌信息
function setCardItem(type) {
    let deckList = gameConfig.decklist[type];

    $(".card-item").remove();
    for (let i = 0; i < deckList.length; i++) {
        $(".card-list-box").append('<div class="card-item" data-id="' + deckList[i].id + '">' +
            '<div class="card">' +
            '<div class="card-info">' +
            '<p class="card-id">' + deckList[i].id + '</p>' +
            '<p class="card-name">' + deckList[i].name + '</p>' +
            '</div>' +
            '</div>' +
            '</div>');
    }

    // 删除卡牌
    // 需要优化
    $(".card-item").click(function (e) {
        e.preventDefault();

        const cardId = $(this).attr("data-id");

        if (cardId == "Aatrox") {
            deleteAatroxCard();
            $("#card-model").modal("hide");
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

        console.log(deckList.length);
        $("#card-model").modal("hide");
    });
}