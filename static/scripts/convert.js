function initialUppercase (string) {
    var array = string.split("_");
    var newArray =[];
    $.each(array, function(i, val) {
        newArray.push(val[0].toUpperCase().concat(val.substr(1,val.length)));
    })
    return newArray.join(" ");
}
