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

        // 物品栏点击事件
        $(items[i]).click(function (e) {
            e.preventDefault();

            buyShopItem(itemType, itemNumber);
        });
    }

    // 刷新商店按钮
    $(".refresh-button").click(function (e) {
        e.preventDefault();

        refreshShopItem();
    });
});

// 武器列表1
let weapons1 = "";

// 武器列表2
let weapons2 = "";

// 武器列表3
let weapons3 = "";

// 泰坦装备列表
let titanArmor = "";

// 猎人装备列表
let hunterArmor = "";

// 术士装备列表
let warlockArmor = "";

// 设置默认信息
function init() {
    gameConfig = read();
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
    sell.text(info.sell);
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
    let refreshCount = gameConfig.refreshCount;

    if (refreshCount <= 0) {
        alert("暂无刷新次数");
        return;
    }

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

    gameConfig.refreshCount--;
    $("#refresh-count span").text(refreshCount - 1);
    save(gameConfig);
}

// 购买物品
function buyShopItem(type, number) {
    // 获取商店类型
    const shopList = getShopType(type, number);

    // 货币
    let money = gameConfig.money;
    let sell = shopList.sell;

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