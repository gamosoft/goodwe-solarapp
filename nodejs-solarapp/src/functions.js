class Functions {
    constructor() {
    }

    static hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
    
    static readPower(data, offset) {
        let val = data.slice(offset, offset + 4).readInt16BE()
        if (val > 32768) {
            val = val - 65535
        }
        return val
    }
    
    static readPower2(data, offset) {
        let val = data.slice(offset, offset + 2).readInt16BE()
        if (val > 32768) {
            val = val - 65535
        }
        return val
    }
    
    static readPowerK(data, offset) {
        const val = data.slice(offset, offset + 4).readInt16BE()
        return val / 10;
    }
    
    static readPowerK2(data, offset) {
        const val = data.slice(offset, offset + 2).readInt16BE()
        return val / 10;
    }
    
    static readFreq(data, offset) {
        const val = data.slice(offset, offset + 2).readInt16BE()
        return val / 100;
    }
    
    static readTemperature(data, offset) {
        const val = data.slice(offset, offset + 2).readInt16BE()
        return val / 10;
    }
    
    static readVoltage(data, offset) {
        const val = data.slice(offset, offset + 2).readInt16BE()
        return val / 10;
    }
    
    static readCurrent(data, offset) {
        let val = data.slice(offset, offset + 2).readInt16BE()
        if (val > 32768) {
            val = val - 65535
        }
        return val / 10;
    }
    
    static readPercentage(data, offset) {
        const val = data.slice(offset, offset + 1).readInt8()
        return val;
    }

    static readCode(data, offset) {
        const val = data.slice(offset, offset + 1).readInt8()
        return val;
    }
}

module.exports = Functions;