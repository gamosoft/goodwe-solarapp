const uri = 'http://localhost:9876/';

let stats = ko.mapping.fromJS({});

stats.batteryModeIcon = ko.pureComputed(() => {
    switch (stats.batteryMode()) {
        case 1:
        case 'Standby':
            return '';
        case 2:
        case 'Discharging':
            return 'red';
        case 3:
        case 'Charging':
            return 'green';
        case 2:
        case 'Importing':
            return 'fa-plug-circle-minus red';
        default:
            return '';
    }
});

stats.batterySOCIcon = ko.pureComputed(() => {
    if (stats.batterySOC() > 98)
        return 'fa-battery-full';
    if (stats.batterySOC() > 70)
        return 'fa-battery-three-quarters green';
    if (stats.batterySOC() > 40)
        return 'fa-battery-half yellow';
    if (stats.batterySOC() > 25)
        return 'fa-battery-quarter orange';
    return 'fa-battery-empty red';
});

stats.gridStatusIcon = ko.pureComputed(() => {
    switch (stats.gridInOutMode()) {
        case 0:
        case 'Idle':
            return 'fa-plug';
        case 1:
        case 'Exporting':
            return 'fa-plug-circle-plus green';
        case 2:
        case 'Importing':
            return 'fa-plug-circle-minus red';
        default:
            return '';
    }
});

function getStats(applyBindings) {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            _bindData(data, applyBindings);
        })
        .catch(error => console.error('Unable to get items.', error));
}

function _bindData(data, applyBindings) {
    ko.mapping.fromJS(data, stats); // Update model
    if (applyBindings) // Only the first time
        ko.applyBindings(stats, document.getElementById("content"));
}

$(() => {
    getStats(applyBindings=true);
});