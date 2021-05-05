


function deDuplication(arr){
    var ret = [];
    var hashTable = {};
    for (var i = 0; i < arr.length; i++)
    {
        var item = arr[i];
        if (!hashTable[item]) {
            hashTable[item] = true;
            ret.push(item);
        }
    }
    return ret;
}

function display() {
    var input = document.getElementById("myInput").value;
    var arr = input.split(",");
    var intArr = arr.map(function(data){
        return +data;
    });
    document.getElementById("myOutput").innerHTML = deDuplication(intArr);
}