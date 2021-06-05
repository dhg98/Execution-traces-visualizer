/*
    Function that obtains the executor. The executor  is the part that is at the
    left of the first point found. If no point can be found, the executor will 
    be the complete word
*/
function getExecutor(label) {
    let index = label.indexOf('.');
    if (index == -1) index = label.length;
    return label.substring(0, index);
}

/* 
    Function that traverses past the tree updating all the selected variables
    for each node, and calculating the maximum width and height
*/
function passVariablesComputeWidth(selectedVariables) {
    let textData = [];

    function passVariables(node) {
        // Add variables to this node (name and value)
        node.vars = {};
        if (selectedVariables[node.executor]) {
            // There are selected variables for the actor of this node
            selectedVariables[node.executor].forEach(item => {
                node.vars[item] = node.data.vars[item];
                textData.push(`${item.length}: ${node.vars[item]}`);
            });
        }

        // Call for each child
        if (node._children) node._children.forEach(passVariables);
    }

    passVariables(root);
    return computeWidth(textData, "sans-serif", NODE_FONT_SIZE);
}

/* 
    Function that processes the data received in the JSON so that D3 tree can
    handle it. To do that, we need to create the table based on the link data,
    and then add it the misc information to every node (if there is any info)
*/
function processData(unprocessedData) {

    /*
        Function that processes the link data and creates the tree object. It 
        tries first to identify the root, and then it creates the tree 
        recursively, starting from the root
    */
    function processLinkData(data = []) {
        // Nodes will contain, for every node, the links in which it is the parent
        let nodes = {},
            // RootCandidates will contain the nodes that are still possible roots
            rootCandidates = new Set();
        // DiscardedRoos will contain the nodes that can't be roots
        // because in some link they are children
        discardedRoots = new Set();

        // Computation to get the root of the tree
        data.forEach(item => {
            let parent = item.parent.toString();
            let child = item.child.toString();
            (nodes[parent] = nodes[parent] || []).push(item);

            // Add child as a discarded root
            discardedRoots.add(child);

            if (rootCandidates.has(child)) rootCandidates.delete(child);
            if (!discardedRoots.has(parent)) rootCandidates.add(parent);
        });

        // We are not considering multitrees
        if (rootCandidates.size > 1) {
            let outStr = "Data is incorrect. The tree should contain only one" + " root, but more than one were found";
            alert(outStr);
            return [null, null];
        } else if (rootCandidates.size == 0) {
            let outStr = "Data is incorrect. The tree should contain only one" + " root, none were found";
            alert(outStr);
            return [null, null];
        }

        // Tree map will contain for each node, the generated subtree. This 
        // will be very useful when filling with misc information
        const treeMap = {};
        const createSubtree = function (root, linkLabel, extra, parent) {
            let tree = {
                name: root,
                // Reference to the parent
                parent: parent
            };
            if (linkLabel) tree.link = linkLabel;
            if (extra && extra.length > 0) tree.linkExtra = extra;

            if (nodes[root]) { // Internal node
                nodes[root].forEach(item => {
                    (tree.children = tree.children || [])
                    .push(createSubtree(item.child, item.label, item.extra, tree));
                });
                tree.executionNumbers = [];
                tree.children.forEach(item => {
                    tree.executionNumbers = [...new Set([...tree.executionNumbers, ...item.executionNumbers])];
                });
            } else { // Leaf
                tree.executionNumbers = [++leafNumber];
            }

            // Add created object to treeMap
            treeMap[root] = tree;
            return tree;
        };
        // Variable that contains the number of found leaves at the moment (we find them from left to right)
        let leafNumber = 0;
        let root = rootCandidates.values().next().value;
        let tree = createSubtree(root, null, null, null);
        return [tree, treeMap];
    };

    /*
        Function that adds misc information of the execution to the tree object.
        In order to do that, it uses a treeMap, which has for every node, a
        reference to the subtree that has been created for it
    */
    function addMiscInformation(treeMap, executions, states, sets) {
        // Function that will pass the properties up in the tree
        let passProperties = function (node, properties) {
            node.executionProperties =
                (node.executionProperties = node.executionProperties || []);

            // Check duplicates. Properties array will tell us if there is any
            // execution passing from that node that holds it
            properties.forEach(item => {
                if (!node.executionProperties.includes(item))
                    node.executionProperties.push(item);
                if (!executionProperties.includes(item))
                    executionProperties.push(item);
            })

            if (node.parent) passProperties(node.parent, properties);
        }

        // Add execution information
        executions.forEach(item => {
            treeMap[item.executionLeaf].executionName = item.executionName;
            if (item.executionLabel)
                treeMap[item.executionLeaf].label = item.executionLabel;
            if (item.properties && item.properties.length > 0) {
                // Need to pass execution properties up in the tree
                passProperties(treeMap[item.executionLeaf], item.properties);
            }
        });

        // Add states information
        if (states && states.length > 0) {
            states.forEach(item => {
                if (item.vars) treeMap[item.nodeName].vars = item.vars;
                if (item.properties && item.properties.length > 0) {
                    treeMap[item.nodeName].stateProperties = item.properties;

                    item.properties.forEach(itemP => {
                        if (!stateProperties.includes(itemP))
                            stateProperties.push(itemP);
                    });
                }
                if (item.extra && item.extra.length > 0)
                    treeMap[item.nodeName].nodeExtra = item.extra;
            });
        }

        // Add sets information
        if (sets && sets.length > 0) {
            sets.forEach(item => {
                treeMap[item.nodeName][item.type] =
                    (treeMap[item.nodeName][item.type] =
                        treeMap[item.nodeName][item.type] || [])
                    .concat(item.content);
            });
        }
    };

    let [data, treeMap] = processLinkData(unprocessedData.edges);
    let executionProperties = [],
        stateProperties = [];
    if (data)
        addMiscInformation(treeMap, unprocessedData.executions,
            unprocessedData.states, unprocessedData.sets);

    return [data, stateProperties, executionProperties];
}

/*
    Function that computes the width of the text of links and nodes, depending 
    on if node is true (computes node text) or is false (computes link text). 
    To do so, it creates dummy invisible text inside the tree svg to compute 
    the width, and removes it inmediately
*/
function computeNodeLinkTextWidth(nodeBool = true) {
    let textData = [];

    let compute = function (node) {
        textData.push((nodeBool ? node.executor : node.data.link) || "");
        if (!node._children) return;
        node._children.forEach(compute);
    };

    compute(root);
    return computeWidth(textData, "sans-serif", NODE_FONT_SIZE);
}

/*
    Function that creates dummy text inside svg to obtain the width of it
*/
function computeWidth(textData, fontFamily, fontSize) {
    const svg = d3.select(`.${SVG_TREE_CLASS}`);

    let textWidth = []
    svg.append('g')
        .selectAll('.dummyText') // declare a new CSS class 'dummyText'
        .data(textData)
        .enter() // create new element
        .append("text") // add element to class
        .attr("font-family", fontFamily)
        .attr("font-size", fontSize)
        .text(d => d)
        .each(function (d, i) {
            let thisWidth = this.getComputedTextLength();
            textWidth.push(thisWidth);
            this.remove(); // remove them just after displaying them
        });
    return Math.ceil(Math.max.apply(Math, textWidth));
}

/*
    Function that gets all the labels of a given path bounded by leaf and 
    ancestor
*/
function getPathText(leaf, ancestor) {
    let textLabels = [];

    let getPathTextHelper = function (node) {
        if (node === ancestor) return;
        textLabels.push(node.data.link);
        getPathTextHelper(node.realParent || node.parent);
    }
    getPathTextHelper(leaf);
    return textLabels;
}

/*
    Helper function that gets the scrollbar width (dependent of browser)
*/
function getScrollbarWidth() {
    // Invisible container
    const outerDiv = d3.select("body").append("div")
        .style("visibility", "hidden")
        .style("overflow", "scroll")
        .style("msOverflowStyle", "scrollbar");

    const innerDiv = outerDiv.append("div");

    const scrollbarWidth =
        outerDiv.node().offsetWidth - innerDiv.node().offsetWidth;

    outerDiv.remove();

    return scrollbarWidth;
}

/*
    Function that finds the value of the given name in the given url (if 
    exists). If it's not provided, it takes the whole url
*/
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = `[\\?&]${name}=([^&#]*)`;
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

/*
    Function that passes to each node, its corresponding link to the legend item
*/
function passLegend() {
    const gElems = {};
    d3.selectAll(`.${G_LEGEND_CLASS}`).each(d => gElems[d.label] = d);

    function passLegendHelper(node) {
        node.legend = node.executor ? gElems[node.executor] : null;
        node._children && node._children.forEach(passLegendHelper);
    }
    passLegendHelper(root);
}