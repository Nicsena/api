function formatBytes(bytes, decimals = 2) {
    if (typeof(bytes) !== "number") return "";
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function simplifiedMilliseconds(milliseconds) {

    if(typeof(milliseconds) !== "number") return ""

    const totalSeconds = parseInt(Math.floor(milliseconds / 1000));
    const totalMinutes = parseInt(Math.floor(totalSeconds / 60));
    const totalHours = parseInt(Math.floor(totalMinutes / 60));
    const days = parseInt(Math.floor(totalHours / 24));
  
    const seconds = parseInt(totalSeconds % 60);
    const minutes = parseInt(totalMinutes % 60);
    const hours = parseInt(totalHours % 24);
  
    let time = '1s';
    if (days > 0) {
      time = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      time = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      time = `${minutes}m ${seconds}s`;
    } else if (seconds > 0) {
      time = `${seconds}s`;
    }
    return time;
  }


  function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





module.exports = {
    formatBytes: formatBytes,
    simplifiedMilliseconds: simplifiedMilliseconds,
    generateRandomString: generateRandomString
}