
// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// VAR

var emptyWeight = 330;
var startCG = 15.0;
var fuelQuantityDefault = 150;
var pilotWeightDefault = 75;
var passengerWeightDefault = 0;
var baggageWeightDefault = 0;

var paxMaxWeight = 200;
var occupantMaxWeight = 110;
var twoOccupantWeight = 25;

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// GET ID
// Input
var inputEmptyWeight = document.getElementById('input-empty-weight');
var inputStartCG = document.getElementById('input-start-cg');
var inputFuel = document.getElementById('input-fuel');
var inputPilot = document.getElementById('input-pilot');
var inputPassenger = document.getElementById('input-passenger');
var inputBaggage = document.getElementById('input-baggage');

// sliders
var sliderFuel = document.getElementById('slider-fuel');
var sliderPilot = document.getElementById('slider-pilot');
var sliderPassenger = document.getElementById('slider-passenger');
var sliderBaggage = document.getElementById('slider-baggage');

var limiterBoxBaggage = document.getElementById('limiter-box-baggage');
var limiterBoxFuel = document.getElementById('limiter-box-fuel');

// switch
// 1 front / 0 rear
var switchBallast = document.getElementById("switch-ballast");
switchBallast.checked = false;
var switchPosition = 0;
// labels
var switchFrontLabel = document.getElementById("front-label-ballast")
var switchRearLabel = document.getElementById("rear-label-ballast")

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// INPUTS
if (localStorage.getItem("EmptyWeight") != null && localStorage.getItem("StartCG") != null) {
    inputEmptyWeight.value = localStorage.getItem("EmptyWeight");
    inputStartCG.value = localStorage.getItem("StartCG");
}
// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// CREATE SLIDERS

// PILOT 
noUiSlider.create(sliderPilot, {
    start: [pilotWeightDefault],
    connect: true,
    behaviour: 'snap',
    step: 1,
    padding: [55, 0],
    range: {
        'min': 0,
        'max': occupantMaxWeight
    },

    pips: {
        // mode: 'range',
        mode: 'values',
        values: [60, 70, 80, 90, 100, 110],
        density: 5,
    },
});

// PASSENGER
noUiSlider.create(sliderPassenger, {
    start: [passengerWeightDefault],
    connect: true,
    behaviour: 'snap',
    step: 1,
    range: {
        'min': 0,
        'max': occupantMaxWeight
    },
    pips: {
        // mode: 'range',
        mode: 'values',
        values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
        density: 5,
    },
});

// BAGGAGE
noUiSlider.create(sliderBaggage, {
    start: [baggageWeightDefault],
    connect: true,
    behaviour: 'snap',
    step: 1,
    range: {
        'min': 0,
        'max': 25
    },
    pips: {
        // mode: 'range',
        mode: 'values',
        values: [0, 5, 10, 15, 20, 25],
        density: 4,
    },
});


// FUEL
noUiSlider.create(sliderFuel, {
    start: [fuelQuantityDefault],
    connect: true,
    behaviour: 'snap',
    step: 1,
    range: {
        'min': 0,
        'max': fuelQuantityDefault
    },
    pips: {
        // mode: 'range',
        mode: 'values',
        values: [0, 30, 60, 90, 120, 150],
        density: 7,
    },
});


// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// ON UPDATE SLIDERS
// PILOT
sliderPilot.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    inputPilot.value = Math.round(value);
    updateFigure()
});


// PASSENGER 
sliderPassenger.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    inputPassenger.value = Math.round(value);
    // if two occupants
    if (value > twoOccupantWeight) {
        // move ballast to front
        // change font size and color for the adviced value
        switchFrontLabel.style.fontWeight = "bold";
        switchFrontLabel.style.color = "black";
        switchRearLabel.style.fontWeight = "normal";
        switchRearLabel.style.color = "grey";
        // move switch
        switchBallast.checked = true;
        switchPosition = 1;


    } else {
        // move ballast to rear
        // change font size and color for the adviced value
        switchRearLabel.style.fontWeight = "bold";
        switchRearLabel.style.color = "black";
        switchFrontLabel.style.fontWeight = "normal";
        switchFrontLabel.style.color = "grey";
        // move switch
        switchBallast.checked = false;
        switchPosition = 0;
    }
    updateFigure()
});

// BAGGAGE
sliderBaggage.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    inputBaggage.value = Math.round(value);
    updateFigure()
});

// FUEL
sliderFuel.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    inputFuel.value = Math.round(value);
    updateFigure();
});


// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// ON UPDATE INPUTS
// EMPTY WEIGHT
inputEmptyWeight.addEventListener('change', function () {
    localStorage.setItem("EmptyWeight", this.value);
    updateFigure();
});

// START MOMENT
inputStartCG.addEventListener('change', function () {
    localStorage.setItem("StartCG", this.value);
    updateFigure();
});

// PILOT
inputPilot.addEventListener('change', function () {
    sliderPilot.noUiSlider.set([this.value, null]);
});

// PASSENGER
inputPassenger.addEventListener('change', function () {
    sliderPassenger.noUiSlider.set([this.value, null]);
});

// BAGGAGE
inputBaggage.addEventListener('change', function () {
    sliderBaggage.noUiSlider.set([this.value, null]);
});

// FUEL 
inputFuel.addEventListener('change', function () {
    sliderFuel.noUiSlider.set([this.value, null]);
});

// BALLAST
style = getComputedStyle(document.body)
switchBallast.addEventListener('change', function () {
    if (switchBallast.checked) {
        switchPosition = 1;
        switchFrontLabel.style.fontWeight = "bold";
        switchFrontLabel.style.color = "black";
        switchRearLabel.style.fontWeight = "normal";
        switchRearLabel.style.color = style.getPropertyValue('--third');
        updateFigure()
    } else {
        switchPosition = 0;
        switchRearLabel.style.fontWeight = "bold";
        switchRearLabel.style.color = "black";
        switchFrontLabel.style.fontWeight = "normal";
        switchFrontLabel.style.color = style.getPropertyValue('--third');
        updateFigure()
    }
});