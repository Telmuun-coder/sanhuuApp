var uiController = (function() {
  var stringOfDOM = {
    addType: ".add__type",
    addDesc: ".add__description",
    addVal: ".add__value",
    addbtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    budgetValue: ".budget__value",
    budgetInc: ".budget__income--value",
    budgetExp: ".budget__expenses--value",
    expPer: ".budget__expenses--percentage",
    containerDiv: ".container",
    percetage: ".item__percentage"
  };
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) callback(list[i], i);
  };
  return {
    changePercetages: function(allPercetanges) {
      var elements = document.querySelectorAll(stringOfDOM.percetage);
      nodeListForEach(elements, (el, index) => {
        el.textContent = allPercetanges[index] + "%";
      });
    },
    getInput: function() {
      return {
        inputType: document.querySelector(stringOfDOM.addType).value,
        inputDesc: document.querySelector(stringOfDOM.addDesc).value,
        inputVal: parseInt(document.querySelector(stringOfDOM.addVal).value)
      };
    },
    getDOM: function() {
      return stringOfDOM;
    },
    addItem: function(item, type) {
      var html, t;
      if (type === "inc") {
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$        </div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
        t = stringOfDOM.incomeList;
      } else {
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        t = stringOfDOM.expenseList;
      }
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.desc);
      html = html.replace("$$VALUE$$", item.value + "₮");
      document.querySelector(t).insertAdjacentHTML("afterbegin", html);
    },
    clearField: function() {
      fields = document.querySelectorAll(
        stringOfDOM.addDesc + "," + stringOfDOM.addVal
      );
      fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(element => {
        element.value = "";
      });
      fieldArr[0].focus();
    },
    showValues: function(tosov) {
      document.querySelector(stringOfDOM.budgetValue).textContent =
        tosov.tosov + "₮";
      document.querySelector(stringOfDOM.budgetExp).textContent =
        tosov.totalExp + "₮";
      document.querySelector(stringOfDOM.budgetInc).textContent =
        tosov.totalInc + "₮";
      document.querySelector(stringOfDOM.expPer).textContent = tosov.huvi + "%";
    },
    deleteListItem: id => {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    }
  };
})();

var financeController = (() => {
  var Income = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };
  var Expense = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.huvi = -1;
  };
  Expense.prototype.calcPercetage = function(totalInc) {
    if (totalInc > 0) {
      this.huvi = Math.round((this.value / totalInc) * 100);
    } else this.huvi = 0;
  };
  Expense.prototype.getPercentage = () => this.huvi;
  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    tosov: 0,
    huvi: 0
  };
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(Element => (sum += Element.value));
    data.totals[type] = sum;
  };
  return {
    calcPercetages: () => {
      data.allItems.exp.map(el => {
        el.calcPercetage(data.totals.inc);
      });
    },
    getPercentages: () => {
      var perces = data.allItems.exp.map(el => el.huvi);
      return perces;
    },
    tosovBodoh: () => {
      //niit orlogiig tootsno
      calculateTotal("inc");
      //niit zarlagiig tootsoolno
      calculateTotal("exp");
      // tosoviig chineer tsootsoolno.
      data.tosov = data.totals.inc - data.totals.exp;
      //huviig tootsoolno
      var e = data.totals.exp;
      var i = data.totals.inc;
      if ((e === 0 && i !== 0) || (e === 0 && i === 0)) data.huvi = 0;
      else if (i === 0 && e !== 0) data.huvi = -100;
      else data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      //console.log(data);
    },
    tosviigAvah: () => {
      return {
        tosov: data.tosov,
        huvi: data.huvi,
        totalExp: data.totals.exp,
        totalInc: data.totals.inc
      };
    },
    seeData: () => data,
    inputItems: function(type, desc, val) {
      var item, id;
      if (data.allItems[type].length === 0) id = 1;
      else id = data.allItems[type][data.allItems[type].length - 1].id + 1;

      if (type === "inc") item = new Income(id, desc, val);
      else item = new Expense(id, desc, val);
      data.allItems[type].push(item);
      return item;
    },
    deleteItem: (type, dId) => {
      var ids = data.allItems[type].map(El => El.id);
      var index = ids.indexOf(dId);
      if (index !== -1) data.allItems[type].splice(index, 1);
    }
  };
})();

var appController = (function(uiController, financeController) {
  var getListener = function() {
    var DOM = uiController.getDOM();
    function ctrAddInfo() {
      // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
      var items = uiController.getInput();
      var tmp = items.inputVal;
      if (items.inputDesc !== "" && tmp + "a" !== "NaNa") {
        // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
        var itemFromFinnance = financeController.inputItems(
          items.inputType,
          items.inputDesc,
          items.inputVal
        );
        // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
        uiController.addItem(itemFromFinnance, items.inputType);
        uiController.clearField();
        // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
        updateTusuv();
      }
      //console.log(financeController.seeData());
    }
    const updateTusuv = () => {
      // 4. Төсвийг тооцоолно
      financeController.tosovBodoh();
      // 5. Эцсийн үлдэгдэл
      var tosov = financeController.tosviigAvah();
      // 6. Төсвийн тооцоог дэлгэцэнд гаргана.
      uiController.showValues(tosov);
      // 7. Зарлага бүрийн хувийг бодно
      financeController.calcPercetages();
      // 8. Хувь агуулса арр-г авна
      var perces = financeController.getPercentages();
      // 9. Дэлгэцэнд зарлага болгоны хувийг харуулна
      console.log(perces);
      uiController.changePercetages(perces);
    };
    document.querySelector(DOM.addbtn).addEventListener("click", function() {
      ctrAddInfo();
    });
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) ctrAddInfo();
    });
    //Устгах eventListener
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", event => {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var arr = id.split("-");
        var type = arr[0];
        var dId = parseInt(arr[1]);
        financeController.deleteItem(type, dId);

        uiController.deleteListItem(id);
        updateTusuv();
      });
  };
  return {
    init: function() {
      console.log("Started bro...");
      uiController.showValues({
        tosov: 0,
        huvi: 0,
        totalExp: 0,
        totalInc: 0
      });
      getListener();
    }
  };
})(uiController, financeController);
appController.init();
