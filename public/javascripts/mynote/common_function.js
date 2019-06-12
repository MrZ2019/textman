/**
 * @author shadow
 * @filename
 */
function getDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
        var lessOne = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        var second = d.getSeconds();
        var day = lessOne < 10 ? ('0' + lessOne) : lessOne;
        var hour = hour < 10 ? ('0' + hour) : hour;
        var min = min < 10 ? ('0' + min) : min;
        var second = second < 10 ? ('0' + second) : second;
        return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + second;
    }
