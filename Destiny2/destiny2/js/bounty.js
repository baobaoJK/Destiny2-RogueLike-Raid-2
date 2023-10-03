$(function () {
    gameConfig = read();

    $(".bounty-item").addClass("flip");

    const bountyList = gameConfig.bountylist;
    console.log(bountyList);
    if (bountyList.length != 0) {
        for (let i = 0; i < bountyList.length; i++) {
            if (bountyList[i] == null) {
                continue;
            }
            $("#bounty-" + (i + 1) + " .title").text(bountyList[i].name);
            $("#bounty-" + (i + 1) + " .text").text(bountyList[i].description);
            $("#bounty-" + (i + 1) + " .button").text("已完成");
            $("#bounty-" + (i + 1) + " .button").attr("data-id", i);
            $("#bounty-" + (i + 1) + " .button").attr("data-bounty", true);
        }
    }

    $(".bounty-item .button").click(function (e) {
        e.preventDefault();

        if ($(this).attr("data-bounty") == "false") {
            return;
        }

        let id = parseInt($(this).attr("data-id"));

        $("#bounty-" + (id + 1)).removeClass("flip");
        $("#bounty-" + (id + 1)).find(".title").text("当前没有赏金任务");
        $("#bounty-" + (id + 1)).find(".text").text("请过段时间再来");
        $(this).text("确认");
        $(this).attr("data-bounty", false);
        
        gameConfig.bountylist[id] = null;
        gameConfig.money += 3;
        save(gameConfig);

        parentElement = parentJQuery(".money span");
        parentElement.text(gameConfig.money);
    });
});