// Size of available screen
const width = window.innerWidth;
const height = window.innerHeight;

// New tree layout with default settings
let tree = d3.tree(),
    // Link width will be obtained when tree is created, based on all the link 
    // labels
    linkWidth,
    // Root recognizable by D3 created by D3 hierarchy
    root,
    // Zoom behaviours to control zooming in the tree
    zoomBehaviours = d3.zoom().scaleExtent([MIN_ZOOM, MAX_ZOOM])
    .on('zoom', zoom),
    // Space between nodes in X-axis will be defined based on node text, 
    // variables text and link text
    DX,
    // Rectangle width will be obtained based on the lenght of the actors of the
    // different tasks
    RECT_WIDTH;

function visualize(path) {
    d3.json(path).then(function (unprocessedData) {
        // Unflatten the data structure
        const [data, stateProperties, executionProperties] =
        processData(unprocessedData);

        const rootRet = createTreeRoot(data);
        root = rootRet[0];
        varsDict = rootRet[1];
        colorDict = rootRet[2];

        let maxLeaf = root.data.
        executionNumbers[root.data.executionNumbers.length - 1];

        // Create HTML elements
        createLeftMenu(executionProperties, stateProperties, varsDict, maxLeaf);
        createButtonTraversals();
        createBottomRightIcons([
            createBottomRightElement(
                "infoTooltip", unprocessedData.info, "infoSvg", INFO_ICON_URL),
            createBottomRightElement(
                "helpTooltip", HELP_MESSAGE, "helpSvg", QUESTION_MARK_ICON_URL)
        ]);

        // Create SVG legend and link them to each node of the tree
        createLegend(colorDict);
        passLegend();

        // Create HTML tree tooltips
        createTreeTooltips();

        // SVG that will contain the tree
        const svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", SVG_TREE_CLASS)
            .attr("xmlns", "http://www.w3.org/2000/svg");

        // SVG definition for the arrows
        svg.append("defs").attr("class", DEFS_CLASS);

        // SVG group that will contain two groups declared below
        const g = svg.append("g").attr("class", G_CLASS);

        // Two groups: One of links (and link labels) and another of nodes
        g.append("g").attr("class", G_LINK_CLASS);
        g.append("g").attr("class", G_NODE_CLASS);

        // Add the zoom so that svg knows that it is available
        svg.call(zoomBehaviours);

        // Get the text width of the node
        RECT_WIDTH = computeNodeLinkTextWidth(true) + 2 * MARGIN_SIDES;
        linkWidth = computeNodeLinkTextWidth(false);
        DX = Math.max(RECT_WIDTH + NODE_SPACE, 2 * (linkWidth + LINK_TEXT_ESP));
        root.x0 = DX / 2;

        // Generate the first tree and center it
        update(root);
        centerNode(root);
    });
}