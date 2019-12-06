var uiController = (function() {
  var x = 100;

  function add(y) {
    return x + y;
  }

  return {
    publicAdd: function(a) {
      a = add(a);
      console.log("Боловсруулсан утга : " + a);
    }
  };
})();

var financeController = (function() {})();

var appController = (function(uiController, financeController) {
  //uiController.publicAdd(150);
  function ctrAddInfo() {
    console.log("ta darjiin hooy hha");
  }
  document.querySelector(".add__btn").addEventListener("click", function() {
    ctrAddInfo();
  });
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) ctrAddInfo();
  });
})(uiController, financeController);
