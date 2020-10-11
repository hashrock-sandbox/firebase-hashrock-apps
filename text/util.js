export function compile(input) {
    return input.split("```").map((block, index) => {
        //必ず奇数indexがcode blockになる
        let type = "markdown";
        if (index % 2 === 1) {
            if (block.indexOf("kanban") === 0) {
                type = "kanban";
            }
            if (block.indexOf("gantt") === 0) {
                type = "gantt";
            }
            if (block.indexOf("csv") === 0) {
                type = "csv";
            }
            if (block.indexOf("block") === 0) {
                type = "block";
            }
            if (block.indexOf("\n") === 0) {
                type = "plain";
            }
        }
        return {
            text: block,
            type: type,
            id: index
        };
    })
}


export function getYMD() {
    const dt = new Date();
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1).toString().padStart(2, "0");
    const d = dt
        .getDate()
        .toString()
        .padStart(2, "0");
    const ho = dt.getHours().toString().padStart(2, "0");
    const mi = dt.getMinutes().toString().padStart(2, "0");
    const result = `${y}-${m}-${d} ${ho}:${mi}`;
    return result;
}