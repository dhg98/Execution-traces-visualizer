function createLeftMenu(executionProperties, stateProperties, varsDict, maxLeaf) {
    // Div that will contain all the information of the left menu
    let leftMenuDiv = d3.select("body").append("div")
        .attr("class", "leftMenuDiv");

    createExecutionsSelections(leftMenuDiv, maxLeaf)
    createSelections(leftMenuDiv, executionProperties, stateProperties);
    // No vars -> don't create variable menu
    if (Object.keys(varsDict).length !== 0)
        createVariableMenu(leftMenuDiv, varsDict);
}

function createExecutionsSelections(leftMenuDiv, maxLeaf) {
    const execDiv = leftMenuDiv.append("div").attr("class", "execDiv");

    execDiv.append("p").text(`Select interval of execution traces that you want to be shown`);

    const inputDiv = execDiv.append("div").attr("class", "inputDiv");

    inputDiv.append("p").text("from");

    inputDiv.append("input")
        .attr('type', 'number')
        .attr("id", 'minimum')
        .attr("min", 1)
        .attr("max", maxLeaf)
        .attr("value", 1);

    inputDiv.append("p").text("to");

    inputDiv.append("input")
        .attr('type', 'number')
        .attr("id", 'maximum')
        .attr("min", 1)
        .attr("max", maxLeaf)
        .attr("value", maxLeaf);

    const buttonDiv = execDiv.append("div")
        .attr("class", "buttonDiv");

    buttonDiv.append("button")
        .attr("class", "resetButton")
        .text("Reset")
        .on("click", () => {
            const inputDiv = d3.selectAll(".inputDiv input").nodes();
            inputDiv[0].value = 1;
            inputDiv[1].value = maxLeaf;
        })

    buttonDiv.append("button")
        .attr("class", "acceptButton")
        .text("Accept")
        .on("click", () => {
            const inputDiv = d3.selectAll(".inputDiv input").nodes();
            let minValue = parseInt(inputDiv[0].value);
            let maxValue = parseInt(inputDiv[1].value);

            function cutNodes(node, minValue, maxValue) {
                let inInterval = false,
                    inFaded = false;
                for (let i = 0; i < node.data.executionNumbers.length; ++i) {
                    if (minValue <= node.data.executionNumbers[i] &&
                        node.data.executionNumbers[i] <= maxValue) {
                        inInterval = true;
                        break;
                    }
                    if (minValue - 1 == node.data.executionNumbers[i] || maxValue + 1 == node.data.executionNumbers[i])
                        inFaded = true;
                }
                if (inInterval) node.cut = false;
                else node.cut = true;

                if (inFaded && node.cut) node.faded = true;
                else node.faded = false;

                node._children && node._children.forEach(item =>
                    cutNodes(item, minValue, maxValue));

            }
            if (minValue > maxValue)
                alert(`Interval is empty. Please fill it correctly`);
            else if (minValue < 1 || maxValue > maxLeaf) {
                alert(`Inputted values are outside range [${1}, ${maxLeaf}]. Please fill it correctly`);
            } else {
                cutNodes(root, minValue, maxValue);
                collapse(root);
                resetLegend();
                update(root);
                centerNode(root);
            }
        });
}

function createSelections(
    leftMenuDiv, executionProperties, stateProperties) {
    if (executionProperties.length != 0 ||
        stateProperties.length != 0) {
        let selectionDiv = leftMenuDiv.append("div")
            .attr("class", "selectionDiv");

        let createSelection = function (properties, dropDownClass, word) {
            selectionDiv.append("p")
                .text(`Select ${word} property or none`);

            let select = selectionDiv.append("select")
                .attr("class", dropDownClass)
                .on("change", () => {
                    // In the case of the state selection, we disable the
                    // events and change the cursor depending on the value that
                    // has been selected
                    if (dropDownClass === STATE_CLASS) {
                        let selectedVal = d3.select(`.${STATE_CLASS}`)
                            .node().value;
                        let gLegend = d3.selectAll(`.${G_LEGEND_CLASS}`);
                        if (selectedVal === "None")
                            gLegend.style("pointer-events", "all")
                            .style("cursor", "pointer");
                        else {
                            gLegend.style("pointer-events", "none")
                                .style("cursor", "auto");
                            // We need to reset the legend. Nodes will change 
                            // their color automatically
                            resetLegend();
                        }
                    }
                    update(root);
                });

            select.append("option")
                .attr("value", "None")
                .attr("selected", "true")
                .text("None");

            properties.forEach(item => {
                select.append("option")
                    .attr("value", item)
                    .text(item);
            });
        }

        if (executionProperties.length != 0)
            createSelection(executionProperties, EXECUTION_CLASS, "execution");
        if (stateProperties.length != 0)
            createSelection(stateProperties, STATE_CLASS, "state");
    }
}

function createVariableMenu(leftMenuDiv, varsDict) {
    // Inside this div we will include all the components that we want to have
    const variableMenu = leftMenuDiv.append("div")
        .attr("class", "variableMenu");

    // Button to show the variables
    variableMenu.append("button")
        .attr("class", "variablesButton")
        .text("Show variables")
        .on("click", () => {
            // Hide or show a pannel, and change text of button
            const showVariablesButton = d3.select(".variablesButton");
            const variableButtonDiv = d3.select(".variableButtonDiv");
            if (showVariablesButton.text() === "Hide variables") {
                showVariablesButton.text("Show variables");
                variableButtonDiv.style("display", "none");
            } else {
                showVariablesButton.text("Hide variables");
                variableButtonDiv.style("display", "block");
            }
        });

    // Component that will contain the list and the accept button
    const variableButtonDiv = variableMenu.append("div")
        .attr("class", "variableButtonDiv")
        // Initially hidden
        .style("display", "none");

    // Paragraph to let the user know what the program is expecting
    variableButtonDiv.append("p")
        .text(`Select at most ${MAX_VARIABLES} variables per actor and click 'Accept'`);

    // List that will contain all the variables 
    const checkboxList = variableButtonDiv.append("ul");

    // Iterate over each variable
    for (executor in varsDict) {
        varsDict[executor].forEach((variable, i) => {
            const item = checkboxList.append("li");
            // Every item contains a checkbox and a label
            item.append("input")
                .attr('type', 'checkbox')
                .attr("id", `${executor}-${i}`)

            item.append("label")
                .attr("for", `${executor}-${i}`)
                .text(`${executor} - ${variable}`);
        });
    }

    const buttonDiv = variableButtonDiv.append("div")
        .attr("class", "buttonDiv");

    buttonDiv.append("button")
        .attr("class", "clearAllButton")
        .text("Clear all")
        .on("click", () => {
            const itemList = d3.selectAll(".variableButtonDiv li").nodes();
            itemList.forEach(item => {
                item.children[0].checked = false;
            });
        })

    // The last component is the accept button
    buttonDiv.append("button")
        .attr("class", "acceptButton")
        .text("Accept")
        .on("click", () => {
            let selectedVariables = {};
            // Get all items in list
            const checkboxes = d3.selectAll(".variableButtonDiv li").nodes();
            checkboxes.forEach(item => {
                // Children contains checkbox and label
                // First one is checkbox and second one is label
                if (item.children[0].checked) { // Checked variable
                    // Split label by the hyphen. First part is
                    // actor and second is variable
                    const labelList = item.children[1].textContent
                        .split(/\s*\-\s*/g);
                    if (!selectedVariables[labelList[0]])
                        selectedVariables[labelList[0]] = [labelList[1]];
                    else selectedVariables[labelList[0]]
                        .push(labelList[1]);
                }
            });
            // There are actors with more variables than allowed
            let outError = "";
            for (let prop in selectedVariables)
                if (selectedVariables[prop].length > MAX_VARIABLES)
                    outError += `${' '.repeat(4)}- ${prop}\n`;
            if (outError.length != 0)
                alert(`There are actors with more than ${MAX_VARIABLES} variables:\n${outError}Last selected variables will remain.`);
            else { // Not an error. Update the tree
                // Pass selected variables to each node and change width
                let varWidth =
                    passVariablesComputeWidth(selectedVariables);
                if (varWidth == -Infinity) varWidth = 0;
                DX = Math.max(RECT_WIDTH + varWidth + NODE_SPACE,
                    2 * (linkWidth + LINK_TEXT_ESP));

                update(root);
            }
        });
}