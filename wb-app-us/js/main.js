// Load JS files depending on unit system

var head = document.getElementsByTagName('head')[0];

var js_graph = document.createElement("script");
var js_ui = document.createElement("script");

js_graph.type = "text/javascript";
js_ui.type = "text/javascript";

// TODO call it imperial
if (unit == 'IMP') {
    js_ui.src = "js/ui_us.js";
    js_graph.src = "js/graph_us.js";
    console.log('Load imperial version')
} else {
    js_ui.src = "js/ui.js";
    js_graph.src = "js/graph.js";
    console.log('Load metric version')
}

head.appendChild(js_ui);
head.appendChild(js_graph);