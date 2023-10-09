$(function () {
    // 读取游戏信息
    gameConfig = read();

    // 设置游戏地图信息
    setMapInfo();

    // 选择地图
    $(".map-item").click(function (e) {
        e.preventDefault();

        // 地图id
        let mapId = $(this).attr("id");

        showAlert("您的游戏地图已被设置为 " + gameConfig.maps[mapId - 1].name);
        gameConfig.map = gameConfig.maps[mapId - 1].name;
        gameConfig.mapId = mapId - 1;
        gameConfig.levelPoint = 1;
        gameConfig.chestPoint = 1;
        save(gameConfig);

        $('#map-model').modal('hide');
        setMapInfo();
    });

    // 遭遇战插旗点
    $("#map-door").click(function (e) {
        e.preventDefault();
        if (gameConfig.map == "") return;

        // 赏金任务
        let bountyList = [];
        let bounty;

        // 循环抽取赏金任务
        while (bountyList.length != 3) {
            bounty = lottery(gameConfig.bounty);
            if (checkBounty(bountyList, bounty)) {
                bountyList.push(bounty);
            };
        }

        // 设置赏金任务 与 添加抽卡次数
        gameConfig.bountylist = bountyList;
        gameConfig.drawCount += 2;

        // 刷新商店次数
        if (gameConfig.refreshCount != 1) gameConfig.refreshCount = 1;

        save(gameConfig);

        showAlert("已为你添加了新的赏金任务，2次抽卡机会，1次免费刷新商店机会");

        $(this).attr("disabled", "true");
        setTimeout(() => {
            $(this).removeAttr("disabled");
        }, 1000);
    });

    // 遭遇战完成按钮
    mapNext.click(function (e) {
        e.preventDefault();
        if (gameConfig.map == "") return;

        if (mapStepNum < mapSteps.length) {
            mapStepNum++;
            update(mapSteps, mapStepNum, mapBar, mapStepWidth);
            if (mapStepNum == 2) {
                gameConfig.levelPoint = mapStepNum;

                save(gameConfig);
                return;
            };
            nextLevel();
        }

        showAlert("已为你添加了3货币");

        $(this).attr("disabled", "true");
        setTimeout(() => {
            $(this).removeAttr("disabled");
        }, 1000);
    });

    // 获取隐藏箱事件
    chestNext.click(function (e) {
        e.preventDefault();
        if (gameConfig.map == "") return;

        if (chestStepNum < chestSteps.length) {
            chestStepNum++;
            update(chestSteps, chestStepNum, chestBar, chestStepWidth);
            nextChest();
        }

        showAlert("已获取隐藏箱子，获得3货币");

        $(this).attr("disabled", "true");
        setTimeout(() => {
            $(this).removeAttr("disabled");
        }, 1000);
    });

    // 更改货币数量按钮
    $("#money-button").click(function (e) {
        e.preventDefault();
        $("#money-model").modal("show");
    });
    $(".money-confirm").click(function (e) {
        e.preventDefault();

        const moneyInput = $("#money");
        gameConfig.money = Number(moneyInput.val());
        save(gameConfig);

        showAlert("已更改货币数量为 " + moneyInput.val());
        gamepaneMoney.text(gameConfig.money);
        moneyInput.val("");
    });

    // 更改抽卡次数按钮
    $("#card-button").click(function (e) {
        e.preventDefault();
        $("#card-model").modal("show");
    });
    $(".card-confirm").click(function (e) {
        e.preventDefault();
        const cardInput = $("#card");

        gameConfig.drawCount = Number(cardInput.val());
        save(gameConfig);

        showAlert("已更抽卡次数为 " + cardInput.val());
        cardInput.val("");
    });

    // 无暇按钮
    $("#flawless").click(function (e) {
        e.preventDefault();

        // 添加货币
        gameConfig.money += 6;
        gamepaneMoney.text(gameConfig.money);
        save(gameConfig);
        showAlert("已增加6货币");
        
        $(this).attr("disabled", "true");
        setTimeout(() => {
            $(this).removeAttr("disabled");
        }, 1000);
    });
});

// 地图步骤条
// -----------------------------------------------------
// 步骤条
var mapBar = $(".map-bar");
// 步骤
var mapSteps;
// 步骤数
var mapStepNum;
// 步骤条每一步长度
var mapStepWidth;
// 下一关按钮
var mapNext = $("#map-next");

// 隐藏箱进度条
// -----------------------------------------------------
// 步骤条
var chestBar = $(".chest-bar");
// 步骤
var chestSteps;
// 步骤数
var chestStepNum;
// 步骤条每一步长度
var chestStepWidth;
// 下一步按钮
var chestNext = $("#chest-next");

// 函数
// -----------------------------------------------------------------
// 赏金去重
function checkBounty(bountyList, bounty) {
    for (let i = 0; i < bountyList.length; i++) {
        if (bountyList[i] == bounty) {
            return false;
        }
    }

    return true;
}

// 更新进度条样式
function update(steps, stepNum, bar, stepWidth,) {
    // 设置步骤条样式
    for (let i = 0; i < steps.length; i++) {
        if (i < stepNum) {
            steps[i].classList.add('active');
        }
    }

    bar.attr("style", "width:" + stepWidth * (stepNum - 1) + "%");
}

// 设置地图信息
function setMapInfo() {
    $(".map-img").attr("src", "/destiny2/images/maps/raid/" + gameConfig.map + ".jpg");
    $(".map-text").text("-" + gameConfig.map + "-");
    $(".map-bar").attr("style", "width:0%");
    $(".chest-bar").attr("style", "width:0%");

    // 地图进度条
    $(".map-step").remove();

    for (let i = 0; i < gameConfig.maps[gameConfig.mapId].level + 1; i++) {
        if (i == 0) {
            $(".map-step-bar").append('<div class="step map-step active">' + i + '</div>');
        }
        else {
            $(".map-step-bar").append('<div class="step map-step">' + i + '</div>');
        }
    }

    mapSteps = $(".map-step");
    mapStepNum = gameConfig.levelPoint;
    mapStepWidth = (100 / (mapSteps.length - 1));
    update(mapSteps, mapStepNum, mapBar, mapStepWidth);

    // 箱子进度条
    $(".chest-step").remove();

    for (let i = 0; i < gameConfig.maps[gameConfig.mapId].chest + 1; i++) {
        if (i == 0) {
            $(".chest-step-bar").append('<div class="step chest-step active">' + i + '</div>');
        }
        else {
            $(".chest-step-bar").append('<div class="step chest-step">' + i + '</div>');
        }
    }

    chestSteps = $(".chest-step");
    chestStepNum = gameConfig.chestPoint;
    chestStepWidth = (100 / (chestSteps.length - 1));
    update(chestSteps, chestStepNum, chestBar, chestStepWidth);
}

// 下一关事件
function nextLevel() {
    gameConfig.money += 3;
    gameConfig.levelPoint = mapStepNum;
    gamepaneMoney.text(gameConfig.money);

    save(gameConfig);
}

// 隐藏箱事件
function nextChest() {
    gameConfig.money += 3;
    gamepaneMoney.text(gameConfig.money);
    gameConfig.chestPoint = chestStepNum;
    save(gameConfig);
}

