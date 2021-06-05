// Tooltip classes
const TOOLTIP_SETS_CLASS = "tooltipSets";
const TOOLTIP_LINKS_CLASS = "tooltipLinks";
const TOOLTIP_VARS_CLASS = "tooltipVars";
const TOOLTIP_EXTRA_CLASS = "tooltipExtra";

// Transition duration for tooltips
const TOOLTIP_TRANSTION_DURATION = 300;

// Message that will be shown when hovering over question mark image
const HELP_MESSAGE =
    "<h2 style ='margin-top: 5px'>" +
    "Visualizer of execution traces and concurrent models <i>how-to</i> guide" +
    "</h2>" +
    "<p style='margin:15px 0 5px 0;'><b>Left menu</b></p>" +
    `There is some information that is hidden by default, but can be shown easily. You can select the variables you want to be shown in the tree (up to ${MAX_VARIABLES} per actor), the execution and state properties or the interval of traces you want to display.` +
    "<p style='margin:15px 0 5px 0;'><b>Node border</b></p>" +
    "Node border is very useful to know what will be the behavior when clicking over it. If there is not a border, it means that all the paths from that node to a leaf are expanded. If not, it means that there is at least one path that is not expanded, and therefore, it can be expanded." +
    "<p style='margin:15px 0 5px 0;'><b>Available commands over nodes</b></p>" +
    "<ul style= 'margin: 0; list-style: circle; text-align: left;'>" +
    "<li><b>Shift + Click</b>: Expand one path from that node (if there is any available).</li> " +
    "<li><b>Shift + Control + Click</b>: Expand all paths from that node (if there is any available).</li>" +
    "<li><b>Alt + Click</b>: Collapse one path from that node (if there is any available).</li>" +
    "<li><b>Alt + Control + Click</b>: Collapse all paths from that node (if there is any available).</li>" +
    "<li><b>Control + Click</b>: Collapse one path from that node (if there is any available) and show leaf.</li>" +
    "<li><b>Click</b>:" +
    "<ul style= 'margin: 0; list-style: disc; text-align: left;'>" +
    "<li>If there is any visible descendant, <b>collapse</b> subtree from that node.</li>" +
    "<li>If all descendants are invisible, <b>show</b> direct descendants.</li>" +
    "</ul>" +
    "</ul>" +
    "<p style='margin:15px 0 5px 0;'><b>Available tooltips</b>" +
    " (shows information if it was provided)</p>" +
    "<ul style= 'margin: 0; list-style: circle; text-align: left;'>" +
    "<li><b>Hover over node</b>: show information about <i>backtrack set</i> and <i>sleep set</i> for that node.</li>" +
    "<li><b>Shift + hover over node</b>: show information about all variables attached to that node.</li>" +
    "<li><b>Alt + hover over node</b>: show <i>extra</i> field.</li>" +
    "<li><b>Alt + hover over link</b>: show <i>extra</i> field.</li>" +
    "<li><b>Hover over dashed link</b>: show all the labels for the collapsed links.</li>" +
    "</ul>";