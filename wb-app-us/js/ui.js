// ----- ----- ----- ----- ----- ----- ----- ----- ----- 

if (unit == 'MET') {
    var factor_weight = 1;
    var factor_volume = 1;
} else {
    // imperial unit correct
    var factor_weight = 1 / 0.45359237; //2.2046226218487757
    var factor_volume = 1 / 3.785411784; //0.26417205235814845
}

var emptyWeight = 330 * factor_weight;
var startCG = 15.0;
var fuelQuantityDefault = 150 * factor_volume;
var pilotWeightDefault = 0 * factor_weight;
var passengerWeightDefault = 0 * factor_weight;
var baggageWeightDefault = 0 * factor_weight;

var paxMaxWeight = 200 * factor_weight;
var occupantMaxWeight = 130 * factor_weight;
var twoOccupantWeight = 25 * factor_weight;

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

// var limiterBoxBaggage = document.getElementById('limiter-box-baggage');
// var limiterBoxFuel = document.getElementById('limiter-box-fuel');

// switch
// 1 front / 0 rear
var switchBallast = document.getElementById("switch-ballast");
switchBallast.checked = true;
var switchPosition = 0;
// labels
var switchFrontLabel = document.getElementById("front-label-ballast")
var switchRearLabel = document.getElementById("rear-label-ballast")

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// IMPORT STORED INPUTS
// Aircraft weight and cg
if (localStorage.getItem("EmptyWeight") != null && localStorage.getItem("StartCG") != null) {
    // inputEmptyWeight.value = localStorage.getItem("EmptyWeight") * factor_weight;
    inputEmptyWeight.value = parseFloat(localStorage.getItem("EmptyWeight") * factor_weight).toFixed(0);
    inputStartCG.value = localStorage.getItem("StartCG");
}

// Pilot
if (localStorage.getItem("PilotWeight")) {
    inputPilot.value = localStorage.getItem("PilotWeight") * factor_weight;
}

// Passenger
if (localStorage.getItem("PassengerWeight")) {
    inputPassenger.value = localStorage.getItem("PassengerWeight") * factor_weight;
}

// Baggage
if (localStorage.getItem("BaggageWeight")) {
    inputBaggage.value = localStorage.getItem("BaggageWeight") * factor_weight;
}

// Fuel
if (localStorage.getItem("FuelVolume")) {
    inputFuel.value = localStorage.getItem("FuelVolume") * factor_volume;
}

// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// CREATE SLIDERS

// pips

if (unit == 'MET') {
    var pips_pilot = [60, 70, 80, 90, 100, 110, 120, 130];
    var pips_passenger = [0, 20, 40, 60, 80, 100, 120];
    var pips_baggage = [0, 5, 10, 15, 20, 25];
    var pips_fuel = [0, 30, 60, 90, 120, 150];
    var density_pips_pilot = 6;
    var density_pips_passenger = 4;
    var density_pips_baggage = 4;
    var density_pips_fuel = 7;
} else {
    var pips_pilot = [140, 160, 180, 200, 220, 240, 260, 280];
    var pips_passenger = [0, 50, 100, 150, 200, 250];
    var pips_baggage = [0, 10, 20, 30, 40, 50];
    var pips_fuel = [0, 5, 10, 15, 20, 25, 30, 35, 40];
    var density_pips_pilot = 6;
    var density_pips_passenger = 3.5;
    var density_pips_baggage = 8;
    var density_pips_fuel = 2.5;
}


// PILOT 
noUiSlider.create(sliderPilot, {
    start: [inputPilot.value],
    connect: true,
    behaviour: 'snap',
    step: 1,
    range: {
        'min': Math.round(55 * factor_weight),
        'max': occupantMaxWeight
    },

    pips: {
        // mode: 'range',
        mode: 'values',
        values: pips_pilot,
        density: density_pips_pilot,
    },
});

// PASSENGER
noUiSlider.create(sliderPassenger, {
    start: [inputPassenger.value],
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
        values: pips_passenger,
        density: density_pips_passenger,
    },
});

// BAGGAGE
noUiSlider.create(sliderBaggage, {
    start: [inputBaggage.value],
    connect: true,
    behaviour: 'snap',
    step: 1,
    range: {
        'min': 0,
        'max': 25 * factor_weight
    },
    pips: {
        // mode: 'range',
        mode: 'values',
        values: pips_baggage,
        density: density_pips_baggage,
    },
});


// FUEL
noUiSlider.create(sliderFuel, {
    start: [inputFuel.value],
    connect: true,
    behaviour: 'snap',
    step: 0.1,
    range: {
        'min': 0,
        'max': fuelQuantityDefault
    },
    pips: {
        // mode: 'range',
        mode: 'values',
        values: pips_fuel,
        density: density_pips_fuel,
    },
});


// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// ON UPDATE SLIDERS
function updateFigure() {
    //dummy function,
    //updateFigure redefined later 
}

// PILOT
sliderPilot.noUiSlider.on('update', function(values, handle) {
    var value = values[handle];
    inputPilot.value = Math.round(value);
    localStorage.setItem("PilotWeight", value / factor_weight);
    updateFigure()
});


// PASSENGER 
sliderPassenger.noUiSlider.on('update', function(values, handle) {
    var value = values[handle];
    inputPassenger.value = Math.round(value);
    localStorage.setItem("PassengerWeight", value / factor_weight);
    // if two occupants
    if (value > twoOccupantWeight) {
        // move ballast to front
        // change font size and color for the adviced value
        switchFrontLabel.style.fontWeight = "bold";
        switchFrontLabel.style.color = "black";
        switchRearLabel.style.fontWeight = "normal";
        switchRearLabel.style.color = "grey";
        // move switch
        switchBallast.checked = false;
        switchPosition = 1;


    } else {
        // move ballast to rear
        // change font size and color for the adviced value
        switchRearLabel.style.fontWeight = "bold";
        switchRearLabel.style.color = "black";
        switchFrontLabel.style.fontWeight = "normal";
        switchFrontLabel.style.color = "grey";
        // move switch
        switchBallast.checked = true;
        switchPosition = 0;
    }
    updateFigure()
});

// BAGGAGE
sliderBaggage.noUiSlider.on('update', function(values, handle) {
    var value = values[handle];
    inputBaggage.value = Math.round(value);
    localStorage.setItem("BaggageWeight", value / factor_weight);
    updateFigure()
});

// FUEL
sliderFuel.noUiSlider.on('update', function(values, handle) {
    var value = values[handle];
    inputFuel.value = Math.round(value * 10) / 10;
    localStorage.setItem("FuelVolume", value / factor_volume);
    updateFigure();
});


// ----- ----- ----- ----- ----- ----- ----- ----- ----- 
// ON UPDATE INPUTS
// EMPTY WEIGHT
inputEmptyWeight.addEventListener('change', function() {
    this.value = Math.min(this.value, 999)
    localStorage.setItem("EmptyWeight", this.value / factor_weight);
    updateFigure();
});

// START MOMENT
inputStartCG.addEventListener('change', function() {
    this.value = parseFloat(Math.min(this.value, 99)).toFixed(2)
    localStorage.setItem("StartCG", this.value);
    updateFigure();
});

// PILOT
inputPilot.addEventListener('change', function() {
    sliderPilot.noUiSlider.set([this.value, null]);
});

// PASSENGER
inputPassenger.addEventListener('change', function() {
    sliderPassenger.noUiSlider.set([this.value, null]);
});

// BAGGAGE
inputBaggage.addEventListener('change', function() {
    sliderBaggage.noUiSlider.set([this.value, null]);
});

// FUEL 
inputFuel.addEventListener('change', function() {
    sliderFuel.noUiSlider.set([this.value, null]);
});

// BALLAST
style = getComputedStyle(document.body)
switchBallast.addEventListener('change', function() {
    if (switchBallast.checked) {
        switchPosition = 0;
        switchRearLabel.style.fontWeight = "bold";
        switchRearLabel.style.color = "black";
        switchFrontLabel.style.fontWeight = "normal";
        switchFrontLabel.style.color = style.getPropertyValue('--third');
        updateFigure()
    } else {
        switchPosition = 1;
        switchFrontLabel.style.fontWeight = "bold";
        switchFrontLabel.style.color = "black";
        switchRearLabel.style.fontWeight = "normal";
        switchRearLabel.style.color = style.getPropertyValue('--third');
        updateFigure()
    }
});