/*
    Function that creates four buttons with all the posibilities to 
    expand and collapse nodes
*/
function createButtonTraversals() {
    const btnGroup = d3.select("body").append("div")
        .attr("class", "btn-group");

    btnGroup.append("button")
        .text("Expand one path")
        .on("click", () => showPath(root));

    btnGroup.append("button")
        .text("Expand all paths")
        .on("click", () => {
            showPath(root) && allPaths(root, showPath);
        });

    btnGroup.append("button")
        .text("Expand tree")
        .on("click", () => {
            expandAll(root);
            update(root);
        });

    btnGroup.append("button")
        .text("Collapse one path")
        .on("click", () => hidePath(root));

    btnGroup.append("button")
        .text("Collapse all paths")
        .on("click", () => {
            hidePath(root) && allPaths(root, hidePath);
        });

    btnGroup.append("button")
        .text("Collapse tree")
        .on("click", () => {
            collapse(root);
            update(root);
            centerNode(root);
        });
}