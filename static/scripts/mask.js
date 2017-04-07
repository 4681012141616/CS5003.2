//Mask show when a popupWindow appears, hide when the popupWindow is closed
var $mask = $(".mask");

function showMask() {
    $mask.show();
}

function hideMask() {
    $mask.hide();
}

$mask.click(function () {
    $(".popupWindow").hide();
    $mask.hide();
});
