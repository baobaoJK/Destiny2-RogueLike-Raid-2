$(function () {
    setGameConfig();

    // 角色选择
    const roleEmblem = $(".emblems .role");

    for (let i = 0; i < roleEmblem.length; i++) {
        $(roleEmblem[i]).click(function (e) {

            let position = $(this).attr("id");
            let role = $(this).attr("id");

            let number = '';
            do {
                number = prompt("请输入游戏编号");
            } while (number == '' || number == ' ' || number == null);

            let roleName = '';
            do {
                roleName = prompt("请输入游戏名称");
            } while (roleName == '' || roleName == ' ' || roleName == null);

            if (position == 'captain') {
                do {
                    role = prompt("请输入游玩角色英文(泰坦：titan，猎人：hunter，术士：warlock)")
                } while (role == '' || role == ' ' || role == null);
            }

            setRole(position, role, roleName, number);
        });
    }
});

// 设置角色
function setRole(position, role, roleName, number) {
    gameConfig.position = position;
    gameConfig.role = role;
    gameConfig.roleName = roleName;
    gameConfig.number = number;
    save(gameConfig);
}

// 清除游戏数据
$("#delete-button").click(function (e) {
    e.preventDefault();

    deleteSave(read());
    alert("删除成功！");
});