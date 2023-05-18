const si = require("systeminformation");

async function MemoryUsage() {

    const info = await si.mem();

    var total = info["total"];    
    var used = info["used"];
    var free = info["free"];

    var swaptotal = info["swaptotal"];
    var swapused = info["swapused"];
    var swapfree = info['swapfree'];    
    
    return {
        total: total,
        used: used,
        free: free,
        swap: {
            swaptotal: swaptotal,
            swapused: swapused,
            swapfree: swapfree

        }
    }

};


module.exports = {
    MemoryUsage: MemoryUsage
}