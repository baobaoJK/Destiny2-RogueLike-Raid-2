let gameConfig = read();

// 设置游戏默认信息
function setGameConfig() {
    $.getJSON("js/GameConfig.json", function (data) {
        console.log(data);
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
