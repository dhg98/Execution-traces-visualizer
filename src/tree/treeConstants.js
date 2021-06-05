/* =============================NODE APPEARANCE============================= */
// Space between nodes in Y-axis
const DY = 60;

// Space left at both sides of the rectangle
const MARGIN_SIDES = 5;

// Height of the node rectangle (in px)
const RECT_HEIGHT = 15;

// Minimum separation between two nodes (in px)
const NODE_SPACE = 50;

/* ================================VARIABLES================================ */
// Number of variables that we will show at most per node
const MAX_VARIABLES = 2;

// Space between node rectangle and var text (in px)
const VARS_PADDING = 5;

// Line height for vars text (default is 1)
const LINE_HEIGHT = 1.1;

/* ===================================ZOOM=================================== */
// Minimum zoom that can be applied to the tree. 0 is not usable because if we 
// reach 0 the node will not be shown again
const MIN_ZOOM = 0.01;

// Maximum zoom that can be applied to the tree. We can zoom to the infinity
// That is, we can zoom the number of times we want
const MAX_ZOOM = Infinity;

/* ================================FONT SIZE================================ */
// Font size of text inside nodes (in px)
const NODE_FONT_SIZE = 10;

// Font size of name of executions (in px)
const EXECUTION_FONT_SIZE = 11;

// Font size of execution label (if it's provided) (in px)
const EXECUTION_LABEL_FONT_SIZE = 9;

// Font size of link label (in px)
const LINK_LABEL_FONT_SIZE = 9;

// Font size of asterisk of collapsed paths to leaves. It is bigger in order for
// it to be visible
const STAR_LINK_FONT_SIZE = 11;

// Radius for the border of the node rectangles
const RECTANGLE_RADIUS = 3;

/* ==============================TRACE ANALYZER============================== */
// Coloring for nodes that fulfill state property
const STATE_COLOR = "#000000"; // black

// Text coloring for nodes that fulfill state property
const STATE_NODE_TEXT_COLOR = "#FFFFFF"; // white

// Coloring for nodes that don't fulfill state property
const NOT_STATE_COLOR = "#EAEAEA"; // near white

// Text coloring for nodes that don't fulfill state property
const NON_STATE_NODE_TEXT_COLOR = "#000000"; // black

// Coloring for links and markers that fulfill execution property
const EXECUTION_COLOR = "#FF0000"; // red

/* ==================================LEGEND================================== */
// Size of the squares that appear in legend (in px)
const LEGEND_SQUARE_SIZE = 20;

// Separation between squares in legend (in px)
const LEGEND_SQUARE_SEP = 5;

// Maximum height of the legend (in %)
const MAX_LEGEND_HEIGHT = 50;

// Space between boxes and outline in legend (in px)
const LEGEND_INNER_SEP = 4;

// Color when click over element in legend
const CLICK_LEGEND_COLOR = NOT_STATE_COLOR;

// Color when over element in legend
const OVER_LEGEND_COLOR = "#828282"; // gray

/* ==========================TREE COMPONENT CLASSES========================== */
const SVG_TREE_CLASS = "treeSVG";
const SVG_LEGEND_CLASS = "legendSVG";
const DEFS_CLASS = "defs";
const G_CLASS = "gLinkgNode";
const G_LINK_CLASS = "gLink";
const G_NODE_CLASS = "gNode";
const G_LEGEND_CLASS = "gLegend"

/* ==================================OTHER================================== */
// Minimum separation between two link labels (in px)
const LINK_TEXT_ESP = 4;

// Time that takes to complete a change of state
const TRANSITION_DURATION = 700;

// 67 colors palette
const colors = [
    "#B8860B", // darkgoldenrod
    "#1E90FF", // dodgerblue
    "#FF69B4", // hotpink
    "#00FFFF", // aqua
    "#FFD700", // gold
    "#CD853F", // peru
    "#4169E1", // royalblue
    "#FA8072", // salmon
    "#008080", // teal
    "#8B008B", // darkmagenta
    "#DCDCDC", // gainsboro
    "#7CFC00", // lawngreen
    "#9ACD32", // yellowgreen
    "#FFC0CB", // pink
    "#2F4F4F", // darkslategray
    "#FF9F9F", // lightred
    "#8B4513", // saddlebrown
    "#EE82EE", // violet
    "#C71585", // mediumvioletred
    "#5F9EA0", // cadetblue
    "#ADFF2F", // greenyellow
    "#6A5ACD", // slateblue
    "#BC8F8F", // rosybrown
    "#FF6347", // tomato
    "#4B0082", // indigo
    "#BA55D3", // mediumorchild
    "#483D8B", // darkslateblue
    "#6B8E23", // olivedrab
    "#AFAFAF",
    "#20B2AA", // lightseagreen
    "#006400", // darkgreen
    "#AFEEEE", // paleturquoise
    "#00BFFF", // deepskyblue
    "#2E8B57", // seagreen
    "#FF8C00", // darkorange
    "#DDA0DD", // plum
    "#191970", // midnightblue
    "#228B22", // forestgreen
    "#F0E68C", // khaki
    "#90EE90", // lightgreen
    "#FFFF54", // laserlemon
    "#DB7093", // palevioletred
    "#D2B48C", // tan
    "#87CEFA", // lightskyblue
    "#DC143C", // crimson
    "#556B2F", // darkolivegreen
    "#00FF00", // lime
    "#FF00FF", // fuchsia
    "#FF4500", // orangered
    "#4682B4", // steelblue
    "#708090", // slategray
    "#FFFF00", // yellow
    "#32CD32", // limegreen
    "#FFA500", // orange
    "#696969", // dimgray
    "#8FBC8F", // darkseagreen
    "#0000CD", // mediumblue
    "#A020F0", // purple3
    "#F4A460", // sandybrown
    "#7FFFD4", // aquamarine
    "#3CB371", // mediumseagreen
    "#D2691E", // chocolate
    "#6495ED", // cornflower
    "#9370DB", // mediumpurple
    "#9932CC", // darkorchild
    "#7F007F", // purple2
    "#008000" // green
]