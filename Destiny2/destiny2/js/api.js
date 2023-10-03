let gameConfig;

// 父类数据
// 步骤一：获取当前iframe的window对象
// var parentWindow = $(window.parent);

// 步骤二：通过window对象获取父级页面的jQuery对象
var parentJQuery = window.parent.$;

// 步骤三：使用jQuery对象选择父级元素
// var parentElement;

let gamepaneMoney = parentJQuery(".money span");

// 设置游戏默认信息
function setGameConfig() {
    $.getJSON("js/GameConfig.json", function (data) {
        gameConfig = data;
    });
}

// 存档
function save(gameConfig) {
    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
}

// 读档
function read() {
    return JSON.parse(localStorage.getItem("gameConfig"));
}

// 删档
function deleteSave() {
    localStorage.removeItem('gameConfig');
}

// 警告框
function showAlert(text) {
    $(".alert-custom").remove();
    $("body").append('<div class="alert alert-dark alert-custom" role="alert">' +
        text +
        '<a data-dismiss="alert" aria-label="Close">&times;' +

        '</a>' +
        '</div>');
}

// 删除亚托克斯卡牌
function deleteAatroxCard() {

    let deckList = gameConfig.decklist.sd;
    let newDeckList = [];

    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].id == "Aatrox") {
            deckList[i] = null;
            break;
        }
    }

    for (let i = 0; i <deckList.length; i++) {
        if (deckList[i] != null) {
            newDeckList.push(deckList[i]);
        }
    }

    gameConfig.decklist.sd = newDeckList;
    save(gameConfig);

    showAlert("已删除 - 亚托克斯 - 卡牌");
    $("#Aatrox").remove();
    $("#sd .count").text(gameConfig.decklist.sd.length);
}