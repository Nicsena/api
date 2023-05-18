const si = require("systeminformation");

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


async function systemMemoryUsage() {

    const info = await si.mem()

    var total = info["total"]    
    var used = info["used"]
    var free = info["free"]

    var swaptotal = info["swaptotal"]
    var swapused = info["swapused"]
    var swapfree = info['swapfree']    

    
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
}


module.exports = {
    formatBytes: formatBytes,
    systemMemoryUsage: systemMemoryUsage
}