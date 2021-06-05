/*
    Function that groups all the information of one icon that will  be placed at
    the bottom right corner of the screen
*/
function createBottomRightElement(tooltipClass, text, svgClass, svgUrl) {
    return {
        message: text,
        tooltipClass: tooltipClass,
        svgClass: svgClass,
        svgUrl: svgUrl
    }
}

/*
    Function that creates the icons for the help and the info
*/
function createBottomRightIcons(icons) {
    let bottomRightDiv = d3.select("body").append("div")
        .attr("class", "bottomRightIconsDiv");

    let addSvg = function (tooltipClass, text, svgClass, svgUrl) {
        const tooltip = d3.select("body").append("div")
            .attr("class", tooltipClass)
            .style("opacity", 0);

        bottomRightDiv.append("svg")
            .attr("class", svgClass)
            .attr("width", SVG_ICON_SIZE)
            .attr("height", SVG_ICON_SIZE)
            .append("image")
            .attr("xlink:href", svgUrl)
            .attr("width", SVG_ICON_SIZE)
            .attr("height", SVG_ICON_SIZE)
            .on("mousemove", (event, d) => {
                tooltip.transition().duration(TOOLTIP_TRANSTION_DURATION)
                    .style("opacity", 1);

                tooltip.style("z-index", 1)
                    .style("right", width - event.pageX + "px")
                    .style("bottom", height - event.pageY + "px")
                    .html(`<div style='font:16px sans-serif; text-align: left'>${text}</div>`);
            })
            .on("mouseout", d => {
                tooltip.transition().duration(TOOLTIP_TRANSTION_DURATION)
                    .style("opacity", 0)
                    // Bug fix: prevents tree drag where tooltip was
                    .style("z-index", -1);
            });
    }

    icons.forEach(item => {
        if (item["message"])
            addSvg(item["tooltipClass"], item["message"], item["svgClass"],
                item["svgUrl"]);
    });
}