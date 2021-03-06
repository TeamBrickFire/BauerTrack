let goalPos = null;
let curPos = null;
const toRadians = Math.PI / 180;
const R = 6371e3; // metres
let watch_ID = -1;
let positions = []

function getLocation() {
    writeLocationToCord(setPos)
    return curPos;
}

function writeLocationToCord(func) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(func, showError, {
            enableHighAccuracy: true});
    }
}

//This function gets called when the position updates
function trackPosition() {
    writeLocationToCord(setPos)
    savePos();
}

function savePos() {

    if(positions.length > 1) {
        if(calcDiff(positions[positions.length-1], curPos) >300) {
            positions.push(curPos)
        }
    } else {
        positions.push(curPos)
    }
}

function posToCords(pos) {
    return {lat: pos.coords.latitude, lon: pos.coords.longitude}
}

// Setters for positions
function setGoalPos(pos) {
    goalPos = pos;
}

function setPos(pos) {
    curPos = pos;
}



function cordsToPos(lat, lon) {
    return {coords:{latitude: lat, longitude: lon, accuracy:0}, timestamp:0};
}

// Returns distance between goal and current position
function distToGoal() {
    //writeLocationToCord(setPos)
    return calcDiff(goalPos, curPos)
}

function getCurLat() {
    if(curPos != null) {
        return curPos.coords.latitude;
    } else {
        return 0;
    }
}

function getCurLon() {
    if(curPos != null) {
        return curPos.coords.longitude;
    } else {
        return 0;
    }
}

function getGoalLat() {
    if(goalPos != null) {
        return goalPos.coords.latitude;
    } else {
        return 0;
    }
}

function getGoalLon() {
    if(goalPos != null) {
        return goalPos.coords.longitude;
    } else {
        return 0;
    }
}

// Returns distance between two points (Format: {coords:{latitude:x, longitude:y}})
function calcDiff(pos1, pos2) {
    if(pos1 == null || pos2 == null) {
        return 0;
    }
    const lat1 = pos1.coords.latitude * toRadians;
    const lon1 = pos1.coords.longitude * toRadians;
    const lat2 = pos2.coords.latitude * toRadians;
    const lon2 = pos2.coords.longitude * toRadians;

    const delLat = lat2-lat1;
    const delLon = lon2-lon1;

    const a = Math.sin(delLat/2) * Math.sin(delLat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(delLon/2) * Math.sin(delLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// Change whether position gets tracked
function changeWatchingMode() {
    if(watch_ID < 0) {
        watch_ID = navigator.geolocation.watchPosition(trackPosition);
    } else {
        navigator.geolocation.clearWatch(watch_ID);
        watch_ID = -1;
    }
}

// Set whether position gets tracked
function setWatchingMode(doWatching) {
    if(doWatching && watch_ID < 0) {
        watch_ID = navigator.geolocation.watchPosition(trackPosition);
    } else if(!doWatching && watch_ID >= 0) {
        navigator.geolocation.clearWatch(watch_ID);
        watch_ID = -1;
    }
}

function getHeadingDirection() {
    if(curPos != null) {
        return curPos.coords.heading;
    } else {
        return 0;
    }
}

function showError(error) {
    console.log(error);
}



