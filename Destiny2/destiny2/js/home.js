$(function () {
    // 角色选择
    $(".emblems .role").click(function (e) {

        setGameConfig();

        let role = $(this).attr("id");

        if (role != "captain") {

            let roleId = 0;

            $(".role-id").click(function (e) {
                roleId = $(this).val();
            });

            $(".role-confirm").click(function (e) {
                e.preventDefault();

                let roleName = $("#role-name").val();

                if (roleId == 0) {
                    showAlert("请选择游戏编号");
                }
                else if (roleName == "" || roleName == null || roleName == undefined) {
                    showAlert("请输入游戏名称 / 游戏ID");
                }
                else {
                    setRole("player", role, roleId, roleName);
                }
            });
        }
        else {
            let roleId = 1;
            let role = null;

            $(".captain-position").click(function (e) {
                role = $(this).val();
            });

            $(".captain-confirm").click(function (e) {
                e.preventDefault();

                let roleName = $("#captain-name").val();

                if (roleName == "" || roleName == null || roleName == undefined) {
                    showAlert("请输入游戏名称 / 游戏ID");
                }
                else if (role != "titan" && role != "hunter" && role != "warlock") {
                    showAlert("请选择游玩角色");
                }
                else {
                    setRole("captain", role, roleId, roleName);
                }
            });
        }
    });
});

// 设置角色
function setRole(position, role, roleId, roleName) {
    gameConfig.position = position;
    gameConfig.role = role;
    gameConfig.roleId = roleId;
    gameConfig.roleName = roleName;
    save(gameConfig);
    window.location.href = $(".role").attr("href");
}

// 清除游戏数据
$("#delete-button").click(function (e) {
    e.preventDefault();

    deleteSave(read());
    showAlert("删除成功！");
});