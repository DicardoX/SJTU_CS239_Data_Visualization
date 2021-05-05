function divide(arr, begin, end, pivot) {
    var beginIdx = begin;
    var endIdx = end;

    while (beginIdx < endIdx) {
        while (arr[endIdx] > pivot && beginIdx < endIdx) {
            endIdx -= 1;
        }
        if (beginIdx < endIdx) {
            arr[beginIdx] = arr[endIdx];
            beginIdx += 1;
        }
        while (arr[beginIdx] < pivot && beginIdx < endIdx) {
            beginIdx += 1;
        }
        if (beginIdx < endIdx) {
            arr[endIdx] = arr[beginIdx];
            endIdx -= 1;
        }
    }
    arr[beginIdx] = pivot;
    return beginIdx;
}

function QuickSort(arr, begin, end) {
    if (begin >= end) {
        return arr;
    }
    var size = arr.length;
    var pivot = arr[begin];
    var idx = divide(arr, begin, end, pivot);
    QuickSort(arr, begin, idx - 1);
    QuickSort(arr, idx + 1, end);
    return arr
}

function display() {
    var input = document.getElementById("myInput").value;
    var arr = input.split(",");
    var intArr = arr.map(function(data){
        return +data;
    });
    document.getElementById("myOutput").innerHTML = QuickSort(intArr, 0, intArr.length - 1);
}