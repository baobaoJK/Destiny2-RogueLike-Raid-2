$(function () {

    // 属性
    let outTime = 11000;
    let mapName = "";
    let mapRoll = false;

    setMapRollList(maps);

    // 抽取 地图 按钮
    // -----------------------------------------------------------------------------------------------
    $(".map-button").click(function (e) {
        rollMapList(mapRoll, outTime);
        mapRoll = true;
        $(this).attr("disabled", true);
    });
});

// 设置 地图 信息
function setMapRollList(maps) {
    // 数量
    let lotteryCount = 50;

    // 添加 地图 信息
    for (let i = 0; i < lotteryCount; i++) {
        let lotterys;
        if (i == lotteryCount - 7) {
            lotterys = lotteryByCount(maps);
            lotterys.count -= 1;
            mapName = lotterys.name;

            // 数据操作
            let gameConfig = read();
            gameConfig.map = mapName;
            save(gameConfig);
        }
        else {
            lotterys = lottery(maps);
        }
        $(".map-list").append("<img src='images/maps/" + lotterys.name
            + ".jpg' alt='" + lotterys.name + ".jpg' class='mapImg'>");
    }
}
// 抽取 地图
function rollMapList(mapRoll, outTime) {
    if (!mapRoll) {
        // 倒数第 7 个
        // 7 -> 40126
        $(".map-list").css({
            "transform": "translateX(-" + getLocation() + "rem)",
            "transition": "all 10s cubic-bezier(0.1, 0.4, 0.25, 1)"
        });

        setTimeout(function () {
            $(".map-text").css("opacity", 1);
            $(".map-text h1").text(mapName);
        }, outTime);
    }
}

// 位置
function getLocation() {
    let width = document.body.clientWidth;
    let size = 16;

    if (width >= 1600) {
        size = 16;
    }
    else if (1200 >= width && width < 1600) {
        size = 12;
    }
    else if (width < 1200) {
        size = 10;
    }

    return 40126 / 16;
}

// 地图 列表
// -----------------------------------------------------------------------------------------------
let maps = [
    { id: 1, name: "最后一愿", weight: 0.125, count: 1, level: 5 },
    { id: 2, name: "救赎花园", weight: 0.125, count: 1, level: 4 },
    { id: 3, name: "深岩墓室", weight: 0.125, count: 1, level: 4 },
    { id: 4, name: "玻璃拱顶", weight: 0.125, count: 1, level: 5 },
    { id: 5, name: "门徒誓约", weight: 0.125, count: 1, level: 4 },
    { id: 6, name: "国王的陨落", weight: 0.125, count: 1, level: 5 },
    { id: 7, name: "梦魇根源", weight: 0.125, count: 1, level: 4 },
    { id: 8, name: "克洛塔的末日", weight: 0.125, count: 1, level: 4 }
];