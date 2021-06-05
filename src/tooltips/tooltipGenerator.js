function linksTooltipGenerator(content) {
    return `<p style='font: ${LINK_LABEL_FONT_SIZE}px sans-serif; margin:0;` + `padding:0;'>${content}</p>`;
}

function extraTooltipGenerator(content) {
    return `<p style='font:10px sans-serif;margin:0;padding:0;'>${content}</p>`;
}

function varsTooltipGenerator(vars) {
    let content = "";
    for (let prop in vars)
        // Var: value
        content += `<tr><td>${prop}: </td><td>${vars[prop]}</td></tr>`;

    let header = "<div style='font: 10px sans-serif; text-align: center'>" +
        "<b>Variables</b></div>";
    let table = `<table style='font: 10px sans-serif;'>${content}</table>`;
    return `${header}${table}`;
}

function setsTooltipGenerator(...sets) {
    let content = "";
    sets.forEach(set => {
        if (set)
            content += "<tr><td><strong>back</strong>: " +
            `</td><td>{${set.join(', ')}}</td></tr>`;
    })
    if (content.length == 0) return content;
    else return "<table style='font:10px sans-serif;text-align:left;'>" +
        `${content}</table>`;
}

function createTreeTooltips() {
    divsClasses = [TOOLTIP_SETS_CLASS, TOOLTIP_LINKS_CLASS, TOOLTIP_VARS_CLASS, TOOLTIP_EXTRA_CLASS];

    divsClasses.forEach(item => {
        d3.select("body").append("div")
            .attr("class", item)
            .style("opacity", 0);
    });
}