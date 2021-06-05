/*
    Function that wraps the given text. If it receives the width, it should be
    refered to splitting by word. Otherwise, it wraps by end of line
*/
function wrap(text, width, splitStr = '\n') {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(splitStr).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = LINE_HEIGHT, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);
        // Go through all the words of the text
        while (word = words.pop()) {
            // Width is given only if we want to split by word
            if (width) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + "em")
                        .text(word);
                }
                // Width is not given if we want to split by end of line
            } else {
                tspan.text(word);
                // Create a new line
                tspan = text.append("tspan").attr("x", x).attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + "em");
            }
        }
    });
}

/*
    Function that applies zoom to all the needed divs given by their classes,
    and to a SVG g element given the class of it
*/
function zoom(zoomEvent) {
    const g = d3.select(`.${G_CLASS}`)
    g.attr('transform', zoomEvent.transform);
    // Apply zoom to all tree tooltips
    d3.selectAll(`.${TOOLTIP_VARS_CLASS}, .${TOOLTIP_SETS_CLASS},` +
            ` .${TOOLTIP_EXTRA_CLASS}, .${TOOLTIP_LINKS_CLASS}`)
        .style("transform", "scale(" + zoomEvent.transform.k + ")")
        // Change reference of the tooltip
        .style("transform-origin", "0px 0px");
}

/*
    Function that centers a given node in the screen
*/
function centerNode(source) {
    const svg = d3.select(`.${SVG_TREE_CLASS}`);
    const scale = d3.zoomTransform(svg.node()).k;
    const x = -source.x0 * scale + width / 2 - RECT_WIDTH / 2;
    const y = -source.y0 * scale + height / 2 - RECT_HEIGHT / 2;
    // Define the transition
    const transition = svg.transition().duration(TRANSITION_DURATION);
    // Move all the objects based on the previous parameters
    svg.transition(transition)
        .call(zoomBehaviours.transform,
            d3.zoomIdentity.translate(x, y).scale(scale));
}

/* 
    Function that creates the root of the tree in a way that is legible by D3
*/
function createTreeRoot(data) {
    // Data is already in JSON format
    let root = d3.hierarchy(data);
    root.x0 = 0;
    root.y0 = 0;

    // Object that will be used for asigning color nodes
    let dict = {};
    // Object that will be used to save all the variables in the tree
    let varsDict = {};

    root.descendants().forEach((d, i) => {
        d.id = i;
        d.vars = {};
        // Auxiliar variable. Copy of children array
        if (d.children) d._children = d.children.slice();
        // Only the root is displayed at first sight
        d.children = null;
        if (d.depth >= 1) d.visible = false;
        else d.visible = true;

        // By default nodes aren't cut nor faded
        d.cut = false;
        d.faded = false;

        if (!d._children) {
            d.realParent = d.parent;
            d.realDepth = d.depth;
            d.collapsed = false;
        }

        // Create color and executor attribute
        if (!d.data.link) { // Root has unique color
            d.color = colors[0];
            d.executor = null;
        } else {
            d.executor = getExecutor(d.data.link);
            if (!dict[d.executor]) // New color needs to be assigned
                dict[d.executor] = colors[Object.keys(dict).length + 1] ||
                colors[colors.length - 1];
            d.color = dict[d.executor];
        }

        // Get all vars in all the executors
        if (d.data.vars) {
            for (let variable in d.data.vars) {
                if (!varsDict[d.executor]) varsDict[d.executor] = [variable];
                else if (!varsDict[d.executor].includes(variable))
                    varsDict[d.executor].push(variable);
            }
        }
    });
    return [root, varsDict, dict];
}

/* 
    Function that handles the click event over a node
*/
function clickNode(event, d) {
    if (event.shiftKey) { // Show path (if crtl then show all)
        showPath(d) && event.ctrlKey && allPaths(d, showPath);
    } else if (event.altKey) { // Hide path (if ctrl then hide all)
        hidePath(d) && event.ctrlKey && allPaths(d, hidePath);
    } else if (event.ctrlKey) { // Collapse the path in the leaf
        collapsePathToLeaf(d);
    } else {
        toggle(d);
    }
}

/* 
    Function that updates all the nodes and links in a tree according 
    to the click event over source
*/
function update(source) {
    // Get all nodes and links that are being shown
    const nodes = root.descendants().reverse();
    const links = root.links();

    tree = tree.nodeSize([DX, DY]);
    // Compute the new tree layout
    tree(root);

    /* =================================NODE SECTION========================= */
    updateNodes(source, nodes, d3.select(`.${G_NODE_CLASS}`));

    /* ============================LINK SECTION============================== */
    const gLink = d3.select(`.${G_LINK_CLASS}`);
    updateLinkLines(source, links, gLink);
    updateLinkText(source, links, gLink);
    updateLinkArrows(links, d3.select(`.${DEFS_CLASS}`));

    // Stash the old positions for transition
    root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

/* 
    Function that updates the appearance of nodes
*/
function updateNodes(source, nodes, gNode) {
    // All nodes in canvas
    const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position
    const nodeEnter = node.enter().append("g")
        .attr("class", d => !d.faded ? "node" : "fadedNode")
        .attr("transform", d => `translate(${source.x0},${source.y0})`)
        .on("click", clickNode)
        .on("mousemove", mousemoveNode)
        .on("mouseout", mouseoutNode);

    nodeEnter.append("rect")
        .attr("height", RECT_HEIGHT)
        .attr("width", RECT_WIDTH)
        .attr("rx", RECTANGLE_RADIUS)
        .attr("ry", RECTANGLE_RADIUS);

    // Inside node text
    nodeEnter.append("text")
        .attr("class", "nodeText")
        // The position of the text is at the top
        .attr("x", RECT_WIDTH / 2)
        .attr("y", RECT_HEIGHT / 2)
        .text(d => d.executor ? d.executor : "");

    // Execution text
    nodeEnter.append("text")
        .attr("class", "execution")
        .attr("x", RECT_WIDTH / 2)
        .attr("y", RECT_HEIGHT + EXECUTION_FONT_SIZE / 2)
        .text(d => {
            if (!d._children && !d.children && d.data.executionName)
                return d.data.executionName;
        }).attr("font-size", EXECUTION_FONT_SIZE);

    // Execution label text
    nodeEnter.append("text")
        .attr("class", "executionLabel")
        .attr("x", RECT_WIDTH / 2)
        .attr("y", RECT_HEIGHT + EXECUTION_FONT_SIZE +
            EXECUTION_LABEL_FONT_SIZE / 2)
        .text(d => {
            if (!d._children && !d.children && d.data.label)
                return d.data.label;
        }).attr("font-size", EXECUTION_LABEL_FONT_SIZE)
        .call(wrap, RECT_WIDTH + NODE_SPACE / 2, /\s+/);

    // Variables text
    nodeEnter.append("text")
        .attr("class", "varsText")
        // x-position of text is at the right of the node
        // y-position is set later for new nodes and updated nodes
        .attr("x", RECT_WIDTH + VARS_PADDING)
        .attr("font-size", NODE_FONT_SIZE);

    // Transition nodes to their new position
    var nodeUpdate = node.merge(nodeEnter).transition()
        .duration(TRANSITION_DURATION)
        .attr("transform", d => `translate(${d.x},${d.y})`)
        // Smooth transition when expanding/collapsing
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Update class of rectangles
    nodeUpdate.select("rect")
        // Nodes completely expanded or leaves have one class, and nodes not
        // completely expanded have another one
        .attr("class", d => {
            // Leaf
            if (!d._children) return "expanded";
            else if (d.children && d.children.length == d._children.length)
                return "expanded";
            else return "notExpanded";
        })
        // Property selected -> Change color
        .attr("fill", d => {
            let selectedVal =
                d3.select(`.${STATE_CLASS}`).node() ?
                d3.select(`.${STATE_CLASS}`).node().value : null;
            if (!selectedVal || selectedVal === "None")
                return !d.legend ? d.color : d.legend.actualColor;
            else if (d.data.stateProperties &&
                d.data.stateProperties.includes(selectedVal))
                return STATE_COLOR;
            else return NOT_STATE_COLOR;
        });

    nodeUpdate.select(".nodeText")
        .attr("fill", d => {
            if (d.data.stateProperties &&
                d.data.stateProperties.includes(
                    d3.select(`.${STATE_CLASS}`).node().value))
                return STATE_NODE_TEXT_COLOR;
            else return NON_STATE_NODE_TEXT_COLOR;
        });

    // Select all varsText
    gNode.selectAll(".varsText")
        .attr("y", d => {
            let nVars = d.vars ? Object.keys(d.vars).length : 0;
            return RECT_HEIGHT / 2 - (LINE_HEIGHT * NODE_FONT_SIZE * ((nVars - 1) / 2));
        }).text(d => {
            let oStr = "";
            if (d.vars) {
                for (let variable in d.vars)
                    oStr += `${variable}: ${d.vars[variable]}\n`
                oStr = oStr.substring(0, oStr.length - 1);
            }
            return oStr;
        }).call(wrap);

    // Transition exiting nodes to the parent's new position
    node.exit().transition().duration(TRANSITION_DURATION).remove()
        .attr("transform", d => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
}

/* 
    Function that updates the appearance of link lines
*/
function updateLinkLines(source, links, gLink) {
    // Visualize links in a tree diagram rooted at the top
    diagonal = d3.linkVertical()
        .x(d => d.x + RECT_WIDTH / 2)
        .y(d => d.y + RECT_HEIGHT / 2);

    // All links in canvas
    const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position
    const linkEnter = link.enter().append("path")
        .attr("x", RECT_WIDTH / 2)
        .attr("y", RECT_HEIGHT / 2)
        // d attribute defines a path to be drawn
        .attr("d", d => {
            const o = {
                x: source.x0,
                y: source.y0
            };
            // Diagonal paints a curve between source and target
            return diagonal({
                source: o,
                target: o
            });
        })
        // Mousemove event
        .on("mousemove", mousemoveLink)
        .on("mouseout", mouseoutLink);

    // Transition links to their new position
    link.merge(linkEnter).transition().duration(TRANSITION_DURATION)
        .attr("d", d => diagonal({
            source: d.source,
            target: {
                x: d.target.x,
                y: d.target.y - RECT_HEIGHT
            }
        })).attrs(d => {
            let cond = d.target.data.executionProperties &&
                d.target.data.executionProperties.includes(
                    d3.select(`.${EXECUTION_CLASS}`).node().value);
            return {
                "class": d.target.faded ? "faded-link" :
                    !d.target.realParent || d.target.realParent === d.source ?
                    "link" : "dashed-link",
                "stroke": cond ? EXECUTION_COLOR : "black",
                "stroke-opacity": cond ? 1 : 0.5,
                "stroke-width": cond ? 2 : 1.5,
                "marker-end": `url(#marker_${d.target.id})`
            }
        })

    // Transition exiting nodes to the parent's new position
    link.exit().transition().duration(TRANSITION_DURATION).remove()
        .attr("d", d => {
            const o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        });
}

/* 
    Function that updates the appearance of link text
*/
function updateLinkText(source, links, gLink) {
    // Link text object
    const linkText = gLink.selectAll("g")
        .data(links, d => d.target.id);

    // Link label enters hidden in the middle of the father rectangle
    const linkTextEnter = linkText.enter().append("g")
        .attr("transform", `translate(${source.x0 + RECT_WIDTH / 2},${source.y0 + RECT_HEIGHT / 2})`)

    linkTextEnter.append("text")
        .attr("class", d => d.target.faded ? "faded-linkLabel" : "linkLabel");

    // Link label centered between source and target nodes
    const linkTextUpdate = linkText.merge(linkTextEnter)
        .transition().duration(TRANSITION_DURATION)
        .attr("transform", d =>
            `translate(${(d.source.x + d.target.x + RECT_WIDTH) / 2},${(d.source.y + d.target.y) / 2})`)
        // Smooth transition when expanding/collapsing
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    linkTextUpdate.select("text")
        .text(d => !d.target.realParent ||
            d.target.realParent === d.source ?
            d.target.data.link : "∗")
        .attr("font-size", d => !d.target.realParent ||
            d.target.realParent === d.source ? LINK_LABEL_FONT_SIZE : STAR_LINK_FONT_SIZE);

    // Link labels are removed to the parent new position
    linkText.exit().transition().duration(TRANSITION_DURATION).remove()
        .attr("transform", `translate(${source.x + RECT_WIDTH / 2},${source.y + RECT_HEIGHT / 2})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
}

/* 
    Function that updates the appearance of link arrows
*/
function updateLinkArrows(links, defs) {
    const arrows = defs.selectAll("marker")
        .data(links, d => d.target.id);

    const arrowsEnter = arrows.enter().append("marker")
        .attr("id", d => `marker_${d.target.id}`)
        .attr("viewBox", `0 -5 10 10`)
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("orient", "auto");

    arrowsEnter.append("path")
        .attr("d", "M0,-5L10,0L0,5");

    const arrowsUpdate = arrows.merge(arrowsEnter).transition()
        .duration(TRANSITION_DURATION)
        .attr("markerHeight", d => {
            if (d.target.data.executionProperties &&
                d.target.data.executionProperties.includes(
                    d3.select(`.${EXECUTION_CLASS}`).node().value))
                return 3.75;
            else return 5;
        });

    arrowsUpdate.select("path")
        .attr("fill", d => {
            if (d.target.data.executionProperties &&
                d.target.data.executionProperties.includes(
                    d3.select(`.${EXECUTION_CLASS}`).node().value)) {
                return EXECUTION_COLOR;
            } else return "black";
        });

    arrows.exit().transition().duration(TRANSITION_DURATION).remove();
}