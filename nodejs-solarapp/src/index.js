const functions = require('./functions');
const express = require('express');
const cors = require('cors');
const dgram = require('dgram');
const port = process.env.PORT || 9876;

const inverterAddress = '192.168.1.150'; // Replace your IP address here
const message = functions.hexToBytes('aa55c07f0106000245');

const GridInOutMode = {
    0: "Idle",
    1: "Exporting",
    2: "Importing"
}

const BatteryMode = {
    0: "NoBattery",
    1: "Standby",
    2: "Discharging",
    3: "Charging",
    4: "ToBeCharged",
    5: "ToBeDischarged"
}

// Create an Express app
const app = express();

app.use(cors());

// Define the default route
app.get('/', (req, res) => {
    // Create a UDP socket
    const socket = dgram.createSocket('udp4');

    // Send the message to the multicast address
    socket.send(Buffer.from(message), 8899, inverterAddress, (err) => {
        // if (err) {
        //     console.error('Failed to send message:', err);
        // } else {
        //     console.log('Message sent to multicast address');
        // }
    });

    socket.on('message', (msg) => {
        // Close the socket
        socket.close();

        if (msg.length !== 149)
            return;

        const data = msg.slice(7);
        const batteryMode = functions.readCode(data, 30);
        const gridInOutMode = functions.readCode(data, 80);
        const now = Date.now();

        let runningInfo = {
            timestamp: now,
            timestampISO: new Date(now).toISOString(),
            vpv1: functions.readVoltage(data, 0),
            ipv1: functions.readCurrent(data, 2),
            vpv2: functions.readVoltage(data, 5),
            ipv2: functions.readCurrent(data, 7),
            batteryV: functions.readVoltage(data, 10),
            batteryTemperature: functions.readTemperature(data, 16),
            batteryI: functions.readCurrent(data, 18),
            batterySOC: functions.readPercentage(data, 26),
            batterySOH: functions.readPercentage(data, 29),
            batteryMode: batteryMode,
            batteryModeLabel: BatteryMode[batteryMode],
            gridV: functions.readVoltage(data, 34),
            gridI: functions.readCurrent(data, 36),
            gridP: functions.readPower(data, 38),
            loadV: functions.readVoltage(data, 43),
            loadI: functions.readCurrent(data, 45),
            loadP: functions.readPower(data, 47),
            inverterTemperature: functions.readTemperature(data, 53),
            todaysLoad: functions.readPowerK2(data, 69),
            todaysPVGeneration: functions.readPowerK2(data, 67),
            gridInOutMode: gridInOutMode,
            gridInOutModeLabel: GridInOutMode[gridInOutMode]
        };

        runningInfo.pv = Math.round(runningInfo.vpv1 * runningInfo.ipv1 + runningInfo.vpv2 * runningInfo.ipv2);
        runningInfo.batteryP = Math.round(runningInfo.batteryV * runningInfo.batteryI);
        runningInfo.houseConsumption = Math.round(runningInfo.pv
            + (runningInfo.batteryMode == 3 ? -1 : 1) * runningInfo.batteryP // 3 is charging
            - (runningInfo.gridInOutMode == 2 ? -1 : 1) * runningInfo.gridP); // 2 is importing

        res.setHeader('Content-Type', 'application/json');
        res.send(runningInfo);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`#############################################################`);
    console.log(`###### Service listening on port ${port}`);
    console.log(`#############################################################`);
});
