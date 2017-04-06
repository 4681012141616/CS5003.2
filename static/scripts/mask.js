var $mask = $(".mask");

function showMask() {
  $mask.show();
}

function hideMask() {
  $mask.hide();
}

$mask.click(function(){
  $(".popupWindow").hide();
  $mask.hide();
});