gettimestamp = function () {
    var curti = new Date();
    var year = (curti.getYear() + 1900);
    var month = (curti.getMonth() + 1).toString().padStart(2, '0');
    var day = curti.getDate().toString().padStart(2, '0');
    var hour = curti.getHours().toString().padStart(2, '0');
    var minute = curti.getMinutes().toString().padStart(2, '0');
    var second = curti.getSeconds().toString().padStart(2, '0');
    var ts = year + month + day + "-" + hour + minute + second;
    return ts;
};

module.exports = gettimestamp;

