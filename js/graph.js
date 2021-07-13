// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// FIGURE
var dataEnvelope = [
    { x: 17.5, y: 385 }, { x: 17.7, y: 490 },
    { x: 22.9, y: 600 }, { x: 31.5, y: 600 },
    { x: 31.5, y: 487 }, { x: 27.7, y: 425 },
    { x: 17.5, y: 385 }
];

// Points
var pt_O = dataEnvelope[0];
var pt_P = dataEnvelope[1];
var pt_K = dataEnvelope[2];
var pt_L = dataEnvelope[3];
var pt_M = dataEnvelope[4];
var pt_N = dataEnvelope[5];

var dataResult = [
    { x: 20, y: 400 }, { x: 26, y: 500 },
];

const graph_domain = { x_min: 15, x_max: 33, y_min: 340, y_max: 650 };
const figure_size = { height: 350, x_margin: 40, y_margin: 30 };

var figure_area = document.getElementById('figure_area');
figure_size.width = Math.min(450, figure_area.offsetWidth);

// append the svg object to the body of the page
var svg = d3.select("#figure_area")
    .append("svg")
    .attr("width", figure_size.width)
    .attr("height", figure_size.height)

// X scale and Axis
var x_scale = d3.scaleLinear()
    .domain([graph_domain.x_min, graph_domain.x_max])
    .range([figure_size.x_margin, (figure_size.width - figure_size.x_margin)]);

var x_ticks = [16, 18, 20, 22, 24, 26, 28, 30, 32];
var x_axis = d3.axisBottom()
    .scale(x_scale)
    .tickValues(x_ticks);

svg.append("g")
    .attr("transform", "translate(0, " + (figure_size.height - figure_size.y_margin) + ")")
    .call(x_axis);
svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", figure_size.width - figure_size.x_margin)
    .attr("y", (figure_size.height - figure_size.y_margin - 6))
    .text("Centerage (%)");


// Y scale and Axis
var y_scale = d3.scaleLinear()
    .domain([graph_domain.y_min, graph_domain.y_max])
    .range([figure_size.height - figure_size.y_margin, figure_size.y_margin]);

var y_ticks = [350, 400, 450, 500, 550, 600, 650];
var y_axis = d3.axisLeft()
    .scale(y_scale)
    .tickValues(y_ticks);

svg.append("g")
    .attr("transform", "translate(" + figure_size.x_margin + ",0)")
    .call(y_axis);
svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -figure_size.x_margin + 10)
    .attr("y", figure_size.y_margin + 16)
    .attr("dy", ".75em")
    .text("Weight (kg)");

// Add envelope
var pathEnvelope = svg.append("path")
    .datum(dataEnvelope)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function (d) { return x_scale(d.x) })
        .y(function (d) { return y_scale(d.y) })
    );

// Add weight line
var lineResult = svg.append("line")
    .attr('x1', x_scale(dataResult[0].x))
    .attr('y1', y_scale(dataResult[0].y))
    .attr('x2', x_scale(dataResult[1].x))
    .attr('y2', y_scale(dataResult[1].y))
    .attr("stroke", 'black')
    .attr("stroke-width", 1.5)

// Add take off point
var pointTO = svg.append("circle")
    .attr("cx", x_scale(dataResult[0].x))
    .attr("cy", y_scale(dataResult[0].y))
    .attr("fill", 'black')
    .attr("r", 2.5);

// Add zero fuel point
var pointZF = svg.append("circle")
    .attr("cx", x_scale(dataResult[1].x))
    .attr("cy", y_scale(dataResult[1].y))
    .attr("fill", 'black')
    .attr("r", 2.5);

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// VARS 
//weight
const ballastWeight = 6;

// arms
const armFuel = 689; //mm
const armPilotLight = 369; //mm
const armPilotHeavy = 416; //mm
const armPassenger = 1273; //mm
const armBaggage = 1894; //mm
const armRearBallast = 2267; //mm
const armFrontBallast = -1403; //mm

// moment
const ballastFrontMoment = armFrontBallast * ballastWeight;
const ballastRearMoment = armRearBallast * ballastWeight;

// Default centrage
const refmac = 114; //mm
const mac = 1237; //mm

// arm pilot linear
var coef_a = ((armPilotHeavy - armPilotLight) / (110 - 55));
var coef_b = (armPilotLight - coef_a * 55);

// id text output
var idWeightOutputTO = document.getElementById('weightTO-output');
var idCenterageOutputTO = document.getElementById('centerageTO-output');
var idWeightOutputZF = document.getElementById('weightZF-output');
var idCenterageOutputZF = document.getElementById('centerageZF-output');
var idWeightFuel = document.getElementById('fuel-output');

// id icons
var idWarningPax = document.getElementById('warning-pax');
var idWarningBaggage = document.getElementById('warning-baggage');
var idWarningFuel = document.getElementById('warning-fuel');
var idIconPax = document.getElementById('icon-pax');
var idIconBaggage = document.getElementById('icon-baggage');
var idIconFuel = document.getElementById('icon-fuel');

// id limiter boxes
var idLimiterBoxBaggage = document.getElementById('limiter-box-baggage');
var idLimiterBoxFuel = document.getElementById('limiter-box-fuel');

// id warings
var idWarningTextPax = document.getElementById('warning-text-pax');
var idWarningTextBaggage = document.getElementById('warning-text-baggage');
var idWarningTextFuel = document.getElementById('warning-text-fuel');
var idWarningTextEnvelope = document.getElementById('warning-text-envelope');

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// UPDATE FIGURE

function updateFigure() {
    // get weights
    var emptyWeight = parseFloat(inputEmptyWeight.value);
    var fuelVolume = parseFloat(inputFuel.value);
    var fuelWeight = fuelVolume * 0.72;
    var pilotWeight = parseFloat(inputPilot.value);
    var passengerWeight = parseFloat(inputPassenger.value);
    var baggageWeight = parseFloat(inputBaggage.value);

    // warnings 
    // pax weight > 200kg
    if (pilotWeight + passengerWeight > 200) {
        idWarningPax.style.visibility = "visible"
        idWarningTextPax.style.display = ""
        idIconPax.style.visibility = "hidden"
    } else {
        idWarningPax.style.visibility = "hidden"
        idIconPax.style.visibility = "visible"
        idWarningTextPax.style.display = "none"
    }
    // 2 occupants 
    if (passengerWeight > 25) {
        // fuel > 100l
        limiterBoxBaggage.style.display = "block"
        limiterBoxFuel.style.display = "block"

        if (fuelVolume > 100) {
            idWarningFuel.style.visibility = "visible"
            idWarningTextFuel.style.display = ""
            idIconFuel.style.visibility = "hidden"
        } else {
            idWarningFuel.style.visibility = "hidden"
            idWarningTextFuel.style.display = "none"
            idIconFuel.style.visibility = "visible"
        }
        // baggage > 15l
        if (baggageWeight > 15) {
            idWarningBaggage.style.visibility = "visible"
            idWarningTextBaggage.style.display = ""
            idIconBaggage.style.visibility = "hidden"
        } else {
            idWarningBaggage.style.visibility = "hidden"
            idWarningTextBaggage.style.display = "none"
            idIconBaggage.style.visibility = "visible"
        }
    } else {
        idWarningBaggage.style.visibility = "hidden"
        idWarningTextBaggage.style.display = "none"
        idWarningFuel.style.visibility = "hidden"
        idWarningTextFuel.style.display = "none"
        idIconBaggage.style.visibility = "visible"
        idIconFuel.style.visibility = "visible"

        limiterBoxBaggage.style.display = ""
        limiterBoxFuel.style.display = ""
    }
    // empty / start moment
    var startMoment = (parseFloat(inputStartCG.value) / 100 * mac + refmac) * emptyWeight

    // ballast position
    ballastMoment = switchPosition * ballastFrontMoment + (1 - switchPosition) * ballastRearMoment;

    // pilot local arm
    localArmPilot = coef_a * pilotWeight + coef_b;

    // takeoff weight
    var weightTO = emptyWeight + pilotWeight + passengerWeight + baggageWeight + ballastWeight + fuelWeight;
    // zero fuel weight
    var weightZF = emptyWeight + pilotWeight + passengerWeight + baggageWeight + ballastWeight;

    // takeoff moment
    var momentTO = startMoment + fuelWeight * armFuel + pilotWeight * localArmPilot +
        passengerWeight * armPassenger + baggageWeight * armBaggage + ballastMoment;
    // zero fuel moment
    var momentZF = startMoment + pilotWeight * localArmPilot +
        passengerWeight * armPassenger + baggageWeight * armBaggage + ballastMoment;

    // take off centerage
    var armTO = momentTO / weightTO;
    var centerageTO = (armTO - refmac) / mac;

    // zero fuel centerage
    var armZF = momentZF / weightZF;
    var centerageZF = (armZF - refmac) / mac;

    // console.log(TOweight);
    idWeightOutputTO.innerHTML = "Take-off weight: " + weightTO.toFixed(0) + " kg";
    idCenterageOutputTO.innerHTML = "Take-off centerage: " + (centerageTO * 100).toFixed(1) + " %";

    idWeightOutputZF.innerHTML = "Zero-fuel weight: " + weightZF.toFixed(0) + " kg";
    idCenterageOutputZF.innerHTML = "Zero-fuel centerage: " + (centerageZF * 100).toFixed(1) + " %";

    idWeightFuel.innerHTML = "Fuel weight: " + fuelWeight.toFixed(0) + " kg";

    dataResult = [{ x: centerageZF * 100, y: weightZF },
    { x: centerageTO * 100, y: weightTO }];

    // Update points and line 
    lineResult
        .attr('x1', x_scale(dataResult[0].x))
        .attr('y1', y_scale(dataResult[0].y))
        .attr('x2', x_scale(dataResult[1].x))
        .attr('y2', y_scale(dataResult[1].y))

    pointZF
        .attr("cx", x_scale(dataResult[0].x))
        .attr("cy", y_scale(dataResult[0].y))

    pointTO
        .attr("cx", x_scale(dataResult[1].x))
        .attr("cy", y_scale(dataResult[1].y))

    // Check configuration
    if (checkConfig(dataResult[1].y, dataResult[1].x) && checkConfig(dataResult[0].y, dataResult[0].x)) {
        pathEnvelope.attr("stroke", "black")
        .attr("stroke-width", 1.5)
        idWarningTextEnvelope.style.display = "none"
    } else {
        pathEnvelope.attr("stroke", "red")
        .attr("stroke-width", 2.0)
        idWarningTextEnvelope.style.display = "block"
    }

}

function checkConfig(weight, cg) {

    // check line KL
    if (weight > pt_K.y) {
        return false
    }

    // check line LM
    if (cg > pt_L.x) {
        return false
    }

    // check line NM
    var a_MN = (pt_M.y - pt_N["y"]) / (pt_M.x - pt_N.x);
    var b_MN = pt_N.y - pt_N.x * a_MN;
    if (weight < cg * a_MN + b_MN) {
        return false
    }

    // check line NO
    var a_NO = (pt_N.y - pt_O.y) / (pt_N.x - pt_O.x);
    var b_NO = pt_O.y - pt_O.x * a_NO;
    if (weight < cg * a_NO + b_NO) {
        return false
    }

    // check line OP
    var a_OP = (pt_O.y - pt_P.y) / (pt_O.x - pt_P.x);
    var b_OP = pt_P.y - pt_P.x * a_OP;
    if (weight > cg * a_OP + b_OP) {
        return false
    }

    // check line PK
    var a_PK = (pt_P.y - pt_K.y) / (pt_P.x - pt_K.x);
    var b_PK = pt_K.y - pt_K.x * a_PK;
    if (weight > cg * a_PK + b_PK) {
        return false
    }

    return true
}