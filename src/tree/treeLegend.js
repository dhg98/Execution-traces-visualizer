/* 
    Function that adds the legend and appends it to the body. Returns all the 
    elements that have been created in order to link them to each node
*/
function createLegend(colorDict) {
    const legendContainer = d3.select("body").append("div")
        .attr("class", "legendContainer");

    const legendDiv = legendContainer.append("div")
        .attr("class", "legendDiv")
        .style("right", `${LEGEND_INNER_SEP}px`)
        .style("top", `${LEGEND_INNER_SEP}px`);

    const svg = legendDiv.append("svg")
        .attr("class", SVG_LEGEND_CLASS)
        .attr("xmlns", "http://www.w3.org/2000/svg");

    const g = svg.append("g");

    const entry = g.selectAll("g")
        .data(Object.keys(colorDict).map((key) => {
            return {
                label: key,
                actualColor: colorDict[key],
                enabledColor: colorDict[key]
            }
        }), d => d.label);

    const entryEnter = entry.enter().append("g")
        .attr("class", G_LEGEND_CLASS)
        .style("cursor", "pointer")
        // Events will be available if we are not selecting any state property
        .on("mouseover", mouseoverLegend)
        .on("mouseout", mouseoutLegend)
        .on("click", clickLegend);

    entryEnter.append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * (LEGEND_SQUARE_SIZE + LEGEND_SQUARE_SEP))
        .attr("width", LEGEND_SQUARE_SIZE)
        .attr("height", LEGEND_SQUARE_SIZE)
        .attr("fill", d => d.actualColor);

    entryEnter.append("text")
        .attr("x", LEGEND_SQUARE_SIZE + LEGEND_SQUARE_SEP)
        .attr("y", (d, i) =>
            i * (LEGEND_SQUARE_SIZE + LEGEND_SQUARE_SEP) +
            LEGEND_SQUARE_SIZE / 2)
        .style("font-weight", "bold")
        .text(d => d.label)
        .attr("fill", d => d.actualColor);

    // Get size of g group and resize components
    const dim = g.node().getBBox();
    // Max height is refered to only the legend, not the container
    const heightMax = MAX_LEGEND_HEIGHT / 100 * height - 2 * LEGEND_INNER_SEP;
    const heightLegend =
        dim.height > heightMax ? heightMax : dim.height;

    // Get size of scrollbar (if there was overflow)
    const scrollbarSize =
        dim.height > heightMax ? getScrollbarWidth() : 0;
    svg.attr("width", dim.width).attr("height", dim.height);
    // If there is not overflow, we change the positioning of the svg because
    // cointainer is not getting the correct height
    if (scrollbarSize == 0) svg.style("display", "block");
    legendContainer.style("height", heightLegend + 2 * LEGEND_INNER_SEP + "px")
        .style("width", dim.width + 2 * LEGEND_INNER_SEP + scrollbarSize + "px")
}

/*
    Function that handles mouseover event over legend
*/
function mouseoverLegend(_event, elem) {
    // Select all nodes to record the old color. Only change color of nodes that
    // don't match with legend mouseover event element
    d3.selectAll(".node")
        .filter(d => !d.executor || d.executor !== elem.label &&
            d.legend.actualColor === d.legend.enabledColor)
        .select("rect").attr("fill", OVER_LEGEND_COLOR);
}

/*
    Function that handles mouseout event over legend
*/
function mouseoutLegend() {
    // Select all nodes in canvas
    d3.selectAll(".node").select("rect")
        // Reset color of nodes to their legend color
        .attr("fill", d => !d.legend ? d.color : d.legend.actualColor);
}

/*
    Function that handles click event over legend
*/
function clickLegend(_event, elem) {
    // Select legend element over which we have clicked (we will change its
    // style)
    const gElem = d3.selectAll(`.${G_LEGEND_CLASS}`).filter(d => d === elem);

    elem.actualColor = elem.enabledColor === elem.actualColor ?
        CLICK_LEGEND_COLOR : elem.enabledColor;
    gElem.select('rect').attr("fill", elem.actualColor);
    gElem.select('text').attr("fill", elem.actualColor);

    d3.selectAll(".node").filter(d => d.executor && d.executor === elem.label)
        .select("rect").attr("fill", elem.actualColor);
}

/*
    Function that resets the legend to its original state
*/
function resetLegend() {
    d3.selectAll(`.${G_LEGEND_CLASS}`)
        .each(function (d) {
            // For each legend element, we reset rectangle and text color
            const gElem = d3.select(this);
            d.actualColor = d.enabledColor;
            gElem.select("rect").attr("fill", d.actualColor);
            gElem.select("text").attr("fill", d.actualColor);
        });
}