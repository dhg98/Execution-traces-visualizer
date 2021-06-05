<h1>VISUALIZATION AND ANALYSIS OF EXECUTION TRACES OF CONCURRENT MODELS</h1>

<b>Index</b>
1. [Current appearance](#current-appearance)
2. [Motivation](#motivation)
3. [Installation](#installation)
    
    3.1. [Configuration of HTTP-Server](#config-http)
    
    3.2. [Configuration of visualizer tool](#configuration-visualizer-tool)

4. [Visualizer input](#input)
5. [Tool usage](#usage)

    5.1. [Standalone component](#standalone-component)

    5.2. [Aditional component of SYCO](#aditional-component)
6. [Tool features](#features)

    6.1. [Commands over nodes](#commands-nodes)

    6.2. [Tooltips over objects](#tooltips-objects)

    6.3. [Buttons for exploring the tree](#buttons-tree)

    6.4. [Zooming and panning](#zooming)

    6.5. [Property highlight](#property-highlight)

    6.6. [Variable display](#variable-display)

    6.7. [Legend for actors](#legend-actors)

    6.8. [Trace selector](#trace-selector)

7. [Project structure](#project-structure)
8. [License](#license)
9. [Credits](#credits)

----
<div id='current-appearance'></div>

# 1. Current appearance
The actual state of the visualizer can be seen in the following image
![visualizer](https://github.com/dhg98/Execution-traces-visualizer/blob/master/img/visualizer.png)

<div id='motivation'></div>

## 2. Motivation
SYCO (<i>Systematic texting tool for Concurrent Objects</i>) is a tool used to analyze concurrent programs based on specific execution parameters, and gives as output all the possible interleavings in the program (traces), together with the sequence of actions or tasks that are needed to reach each of the final states. These actions are executed by specific workers that could look alike objects in object oriented programming, and whose methods would be the tasks of which we spoke before.

This tool is very useful to analyze concurrent programs because the process of testing them is much more complicated than testing sequential programs (considering that there are lots of potential risks such as deadlocks, race conditions or livelocks), even more when the program grows because it becomes very difficult to consider all the possible interleavings of a concurrent program manually.

SYCO offers a web interface provided by EasyInterface to test concurrent programs, and allows to visualize the result of the execution of the program in the same interface. This output consists on sequence diagrams that are generated for each of the obtained executions, so that it is easy to understand the sequence of actions that we have taken to reach the final state.

Whenever the number of executions and the length of them increases, also the difficulty to understand all the different executions grows. In addition, most of them are superfluous for the user, because they don't provide new information to understand the functioning of the program. This high number of redundancies complicates the task of finding relevant executions. In fact, we are not only interested in analyzing the results of the program after it has been developed completely, but we also want to have a mechanism that makes the identification of bugs while developing the program easier. Finally, SYCO only shows information relative to final states (final values of each of the fields of the workers in the execution), but frequently there exist intermediate states where these bugs are more evident, which can help us understand where are the bugs in the program. 

For that reason, it is necessary to look for different options that facilitates this task, creating a graphical view of all the obtained executions and other important information that could be relevant in the visualization and analysis of the program (such as variable states of all the different workers that take part in the program, among others).

This project intends to display all of these execution traces based on SYCO output, so that it can be interpreted without too much effort. In order to do so, this JavaScript project uses [D3 library](https://d3js.org/) developed as well in JavaScript.

<div id='installation'></div>

## 3. Installation

<div id='config-http'></div>

### 3.1. Configuration of HTTP-Server
D3 way to read JSON file is by using promises (see [this link](https://www.w3schools.com/js/js_promise.asp)). For that reason, it needs to use HTTP protocol (otherwise, the file won't be opened), so we need to configure a HTTP Server. The steps are the following:

1. Install <b>Node.js</b> in your system following [this tutorial](https://www.geeksforgeeks.org/installation-of-node-js-on-linux/).

2. Install <b>HTTP-Server</b> in your system following [this tutorial](https://www.npmjs.com/package/http-server).

<div id='configuration-visualizer-tool'></div>

### 3.2. Configuration of visualizer tool

1. Go to the folder where you want to download the package to.

2. Download this package by running the command

    `git clone https://github.com/dhg98/Execution-traces-visualizer.git`

3. Give all permissions to `./tmp` folder by running

    `chmod 0777 /tmp`

4. Execute the command

    `http-server -p 5000`

    By doing so, we will create a HTTP server in port 5000.

5. Type `localhost:5000` in the search bar of your browser.

6. You should see a nice dynamic tree that can be expanded and collapsed, zoomed, etc. If not, that's because `data.json` in `./tmp` folder doesn't exist or has the wrong structure. Fix that issue and reload the page to see the tree.


<div id='input'></div>

## 4. Visualizer input
As it has already been said, input data is given by using a JSON file with a fixed structure. In this section we will try to explain a bit what's the structure of that JSON file. For real examples of JSON files, see `./examples` folder.

```
{
    "?sets": [
        {
            "nodeName": "node 1",
            "type": "backtrackSet" or "sleepSet",
            "content": [
                "element1_1",..., "elementN_1"
            ]
        },
        .
        .
        .
        {
            "nodeName": "node M",
            "type": "backtrackSet" or "sleepSet",
            "content": [
                "element1_M",..., "elementN_M"
            ]
        }
    ],
    "?states": [
        {
            "nodeName": "node 1",
            "?vars": {
                "var1_1": "value Var1_1",
                .
                .
                .
                "varN_1": "value VarN_1"
            },
            "?properties": [
                "property1_1",..., "propertyM_1"
            ],
            "?extra": "Extra information of the node 1"
        },
        .
        .
        .
        {
            "nodeName": "node K",
            "?vars": {
                "var1_K": "value Var1_K",
                .
                .
                .
                "varN_K": "value VarN_K"
            },
            "?properties": [
                "property1_K}",..., "propertyM_K"
            ],
            "?extra": "Extra information of the node K"
        }
    ],
    "edges": [
        {
            "parent": "node i",
            "child": "node j",
            "label": "Task in the form actor.task that needs to be executed from the parent to arrive to the child",
            "?extra": "Extra information of the link that connects node i to node j"
        }
    ],
    "executions": [
        {
            "executionName": "Execution 1",
            "?executionLabel": "label Execution 1",
            "executionLeaf": "leafNode name of Execution 1",
            "?properties": [
                "property1_1",..., "propertyM_1"
            ]
        },
        .
        .
        .
        {
            "executionName": "Execution L",
            "?executionLabel": "label Execution L",
            "executionLeaf": "leafNode name of Execution L",
            "?properties": [
                "property1_L",..., "propertyM_L"
            ]
        }
    ],
    "?info": "HTML formatted text"
}
```
where all the attributes that have question mark attached are optional.

After we have seen the complete structure of the file, we will explain further what's expected on each attribute.

- <b><i>Sets</i></b> field is composed of an optional list of objects. In case the list is not empty, each object of the list will consist on the fields <i>nodeName</i> that will identify uniquely the node we are referring to, <i>type</i>, that identifies the type of set we are handling, whether it is <i>backtrack set</i> or <i>sleep set</i> (or another one that we want to add in the future), and a non-empty list <i>content</i> where we will have the different strings that will compose the set we are handling.

- <b><i>States</i></b> field is composed of an optional list of objects. In case the list is not empty, each object of the list will consist on the fields <i>nodeName</i> that will identify uniquely the node we are referring to, <i>vars</i>, which is a key-value object where for each variable identifier we give the value at that point of time, and <i>properties</i>, a list that tells us which state properties hold in this node. These last two objects are optional, but every object in <i>states</i> should contain at least one of them. Last, we add a <i>extra</i> field, which is a string that contains additional information that we want to show in the node

- <b><i>Edges</i></b> is composed of a list of objects (edges). Each object of the list contains the fields <i>parent</i>, and identifier of the node, that will act as the parent of the node given in <i>child</i>. These two fields can't have the same value, and should have a coherent structure (we shouldn't have cycles, we should have only one root, etc.). Each edge has a <i>label</i> field, that will be shown in the line that joins both nodes. Finally, each object in <i>edges</i> has a <i>extra</i> attribute that allows us to add more information to the edge.

- <b><i>Executions</i></b> field is composed of a list of objects. Each object gives us one execution (path from the root to a leaf). That path can be identified by the leaf (<i>executionLeaf</i>). In addition, we provide a label for the execution <i>executionName</i> and an optional label (<i>executionLabel</i>) that can give more information about that execution (for example, it can tell if that execution has led to a <i>Deadlock</i> or other information that SYCO can tell). Finally, optionally we can provide a list of execution properties (<i>properties</i>) that hold for this execution. These properties hold for the whole execution, not only the leaf they are referencing.

- <b><i>Info</i></b> is an optional field. This field consists on a string in HTML format that gives general information about the tree exploration.

<div id='usage'></div>

## 5. Tool usage
There are two different ways of using the project. As a standalone component or as an aditional component for SYCO.

In both cases, our HTML recognizes an extra word that is introduced in the search bar after the direction, which is <i>token</i>. If this word is provided, the visualizer will try to open the `data.json` file that has as name suffix the provided token.

Please notice that the JSON file is expecting some fields, so everything different from the expected input will be ignored. For more information on the input, see the corresponding section.

<div id='standalone-component'></div>

### 5.1. Standalone component
After installation, just edit the `data.json` file with the corresponding suffix located in the `./tmp` folder and reload the browser. Check that the <i>token</i> field matches the suffix of the JSON file you have created. If not, please create it before trying reloading the browser again.

For example, if you add `?token=1234`, the visualizer will try to match that name with a JSON file inside `./tmp` folder named `data_1234.json`. If this file doesn't exist, nothing will be displayed. If no token is provided, the visualizer will use the `data.json` file.

<div id='aditional-component'></div>

### 5.2. Aditional component of SYCO
In order to combine SYCO with the visualizer, we will use Easy Interface (information about the project can be seen [here](https://github.com/abstools/easyinterface)). First of all, we need to install EI correctly following the steps of [this tutorial](https://github.com/abstools/easyinterface/blob/master/INSTALL.md). 

Once that is done, we need to enable Apache. To do so, we will do the following:

1. Enable <i>userdir</i> module executing the command

    `sudo a2enmod userdir`

2. Restart Apache server by executing

    `sudo service apache2 restart`

3. Create a <i>public_html</i> folder in <i>home</i>

    `mkdir ~/public_html`

4. Copy code folder to <i>public_html</i> folder.

5. Give all the permissions to <i>tmp</i> folder, executing
    
    `chmod 0777 ~/public_html/code/tmp`

Once all these steps have been followed, we should be ready to configure EI to execute SYCO and inmediately after be able to execute the visualizer. In order to do so, please visit memory project and follow steps detailed in section 5.2.2.

<div id='features'></div>

## 6. Tool features
As it has already been said, this project creates a visual view of trees using D3 with some remarkable features

<div id='commands-nodes'></div>

### 6.1. Commands over nodes
Each node has some commands available to explore the tree. They are:

* Hold <b>Shift</b> + <b>Click</b> over node: expand one path in the subtree generated by a given node (if there is any available).

* Hold <b>Shift</b> + <b>Control</b> + <b>Click</b> over node: expand all paths in the subtree generated by a given node.

* Hold <b>Alt</b> + <b>Click</b> over the node: collapse one path in the subtree generated by a given node (if there is any available).

* Hold <b>Alt</b> + <b>Control</b> + <b>Click</b> over node: collapse all paths in the subtree generated by a given node.

* Hold <b>Control</b> + <b>Click</b> over node: collapse path from a fiven node to a leaf. That is, the path will be hidden and leaf will be displayed.

* <b>Click</b> over node: this command has two different behaviours, deppending on the state of the tree.
    
    * If there is any visible descendant, <b>collapse</b> subtree from that node.

    * If all descendants are invisible, <b>show</b> direct descendants.

<div id='tooltips-objects'></div>

### 6.2. Tooltips over objects
Not all the information can be shown in the tree. For that reason, some information is hidden in tooltips, waiting for you to hover over with the right command. Note that if these fields are not provided in input file, no tooltip will be shown. Available tooltips are:

* <b>Hover over node</b>: show information about <i>backtrack set</i> and <i>sleep set</i> for that node.

* <b>Shift + hover over node</b>: show information about all variables attached to that node.

* <b>Alt + hover over node</b>: show <i>extra</i> field.

* <b>Alt + hover over link</b>: show <i>extra</i> field.

* <b>Hover over dashed link</b>: show all the labels for the collapsed links.

<div id='buttons-tree'></div>

### 6.3. Buttons for exploring the tree
Commands over nodes are very useful. But sometimes, it comes very difficult to use them over the right node. For that reason, we also added some buttons that achieve the same objective. These are:

* <b>Expand one path</b>: expands one path in the tree from the root.

* <b>Expand all paths</b>: expands all the paths in the tree from the root.

* <b>Expand tree</b>: expands the whole tree.

* <b>Collapse one path</b>: collapses one path in the tree.

* <b>Collapse all paths</b>: collapses all paths in the tree.

* <b>Collapse tree</b>: collapses the whole tree in the root.

<div id='zooming'></div>

### 6.4. Zooming and panning
Trees are arbitrarily big, so we need to have a way to take in and off the stage the nodes we want. For that reason, we have:

* Use <b>mousewheel</b> (pressing <i>Ctrl</i> key is optional, and will apply zoom faster): zooms in and out the tree.

* Use <b>mouse dragging</b>: shifts the tree.

* <b>Center of a node</b>: this is done automatically when node event occurs.

<div id='property-highlight'></div>

### 6.5. Property highlight
SYCO has a feature that tells us which are the nodes that hold some state property, and which are the executions that hold some execution property. For that reason, we allow the user to select these two different type of properties separately, by using a drop down box selection. In both cases, <i>None</i> represents that no property has been selected.

* In the case of the <b>execution property selection</b>, we will highlight the paths that hold a specific property by changing the color of the edges to red.

* In the case of the <b>state property selection</b>, we will highlight the nodes that hold a specific property by changing the color of all the nodes.

    * Nodes that hold the property will be painted in black, with white text.

    * Nodes that don't hold the property will be painted in light gray, with black text.

<div id='variable-display'></div>

### 6.6. Variable display
Tooltips for variables are not always sufficient, i.e. if we want to explore their values over different nodes at the same time. For that reason, we allow the user to select variables attached to each actor (up to 2) in a menu composed by checkboxes that is hidden and shown by clicking over a button that acts as a switch.

<div id='legend-actors'></div>

### 6.7. Legend for actors
When there are multiple actors, it becomes very difficult to differentiate all of them. For that reason, a legend has been added, just like we have in charts. It is interactive, so that we can hover or click over the boxes or the text to highlight or hide/show the nodes, respectively.

<div id='trace-selector'></div>

### 6.8. Trace selector
When there are a lot of executions, it becomes difficult for the browser to handle all of them, causing lag perceptible for the user. For that reason, it becomes extremely important to allow the user to limit the number of executions that are being shown, so that the experience of using the visualizer is improved. For that reason, at the top left of the screen we allow the user to select the interval of executions that it wants to be shown, and the one that's at the left and at the right of that interval (if they exist) will be shown more transparent.

<div id='project-structure'></div>

## 7. Project structure
The project is structured in the following folders and files:

* [examples](https://github.com/dhg98/Execution-traces-visualizer/tree/master/examples): folder that contains some JSON examples ready to use that have been outputted by SYCO.

* [img](https://github.com/dhg98/Execution-traces-visualizer/tree/master/img): folder that contains images that show the posibilities of the visualizer

* [src](https://github.com/dhg98/Execution-traces-visualizer/tree/master/src): folder that contains all the JavaScript code of the visualizer

* [style](https://github.com/dhg98/Execution-traces-visualizer/tree/master/style): folder that contains all the CSS code of the visualizer

* [tmp](https://github.com/dhg98/Execution-traces-visualizer/tree/master/tmp): folder that is used to integrate SYCO and the visualizer by using EasyInterface. EasyInterface will save in this folder the JSON with the information the visualizer will use to display the tree. This folder should have 0777 permissions to work as expected.

* [index.html](https://github.com/dhg98/Execution-traces-visualizer/blob/master/index.html): HTML file in which all the objects will be embedded.

* [README.md](https://github.com/dhg98/Execution-traces-visualizer/blob/master/README.md): Markdown file that contains all the project information.

* [LICENSE](https://github.com/dhg98/Execution-traces-visualizer/blob/master/LICENSE): Plain text file that contains the license statement for this project.

* [CREDITS.md](https://github.com/dhg98/Execution-traces-visualizer/blob/master/CREDITS.md): Markdown file that contains all the references I have used during the implementation of the visualizer, including tutorials and Stack Overflow questions, with the proper attributions.


<div id='license'></div>

## 8. License
See ![LICENSE](https://github.com/dhg98/Execution-traces-visualizer/blob/master/LICENSE) file for more information.



<div id='credits'></div>

## 9. Credits
See ![CREDITS.md](https://github.com/dhg98/Execution-traces-visualizer/blob/master/CREDITS.md) file for more information.
