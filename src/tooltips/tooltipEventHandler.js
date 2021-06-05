/*
    Function that handles mousemove event over a node
*/
function mousemoveNode(event, d) {
    // Get node tooltips
    const divVars = d3.select(`.${TOOLTIP_VARS_CLASS}`);
    const divSets = d3.select(`.${TOOLTIP_SETS_CLASS}`);
    const divExtra = d3.select(`.${TOOLTIP_EXTRA_CLASS}`);

    if (event.shiftKey) { // Tooltip for vars
        if (d.data.vars) {
            divVars.transition().duration(TOOLTIP_TRANSTION_DURATION)
                .style("opacity", d.faded ? 0.3 : 1);
            divVars.style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .html(varsTooltipGenerator(d.data.vars));
        }
        // Hide other tooltips
        divSets.style("opacity", 0);
        divExtra.style("opacity", 0);
    } else if (event.altKey) { // Tooltip for extras
        if (d.data.nodeExtra) {
            divExtra.transition().duration(TOOLTIP_TRANSTION_DURATION)
                .style("opacity", d.faded ? 0.3 : 1);
            divExtra.style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .html(extraTooltipGenerator(d.data.nodeExtra));
        }
        // Hide other tooltips
        divVars.style("opacity", 0);
        divSets.style("opacity", 0);
    } else { // Tooltip for sets
        let htmlText = setsTooltipGenerator(
            d.data.backtrackSet, d.data.sleepSet);
        if (htmlText.length != 0) {
            divSets.transition().duration(TOOLTIP_TRANSTION_DURATION)
                .style("opacity", d.faded ? 0.3 : 1);
            divSets.style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .html(htmlText);
        }
        // Hide other tooltips
        divVars.style("opacity", 0);
        divExtra.style("opacity", 0);
    }
}

/*
    Function that handles mouseout event over a node
*/
function mouseoutNode() {
    // Get node tooltips
    d3.selectAll(`.${TOOLTIP_VARS_CLASS}, .${TOOLTIP_SETS_CLASS},` +
            ` .${TOOLTIP_EXTRA_CLASS}`)
        .transition().duration(TOOLTIP_TRANSTION_DURATION).style("opacity", 0);
}

/*
    Function that handles mousemove event over a link
*/
function mousemoveLink(event, d) {
    let tooltipOut = "";
    if (d.target.realParent &&
        d.target.realParent !== d.source) {
        let labels = getPathText(d.target, d.source);
        tooltipOut = labels.slice().reverse().join('<br>');
    } else if (d.target.data.linkExtra && event.altKey)
        tooltipOut = d.target.data.linkExtra;
    if (tooltipOut.length > 0) {
        const divLinks = d3.select(`.${TOOLTIP_LINKS_CLASS}`);
        divLinks.transition()
            .duration(TOOLTIP_TRANSTION_DURATION)
            .style("opacity", 1);
        divLinks.style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .html(linksTooltipGenerator(tooltipOut));
    }
}

/*
    Function that handles mouseout event over a link
*/
function mouseoutLink() {
    d3.select(`.${TOOLTIP_LINKS_CLASS}`).transition()
        .duration(TOOLTIP_TRANSTION_DURATION)
        .style("opacity", 0);
}