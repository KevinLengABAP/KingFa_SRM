sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/ODataModel",
	"ZEC_CART_CREATE/utils/Validator",
	"ZEC_CART_CREATE/utils/ValueHelpHelper"
], function(BaseController, JSONModel, MessageToast, Filter, ODataModel, Validator, ValueHelpHelper) {
	"use strict";
	// var editItem = [];
	var jsonmodel = new JSONModel();
	return BaseController.extend("ZEC_CART_CREATE.controller.RequireDetailEdit", {
		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("requireEdit").attachPatternMatched(this._onRequestEditMatched, this);
			this.getView().setModel(jsonmodel, "RequireDetailEdit");
		},
		_onRequestEditMatched: function(oEvent) {

			// editItem = {};

			var sCurDat = new Date();
			var sCurrentData = {};
			$.extend(sCurrentData, sap.ui.getCore().edititem);

			// var oEkgrp = this.getView().byId("EKGRP");
			// oEkgrp.getBinding("items").attachEventOnce(
			// 	"dataReceived",
			// 	function(oData) {
			// 		var oFirstListItem = oEkgrp.getItems()[0];
			// 		if (oFirstListItem) {
			// 			oEkgrp.setSelectedItem(oFirstListItem);
			// 			oEkgrp.setEditable(false);
			// 		} else {
			// 			oEkgrp.setEditable(true);
			// 		}
			// 	}
			// );
			// if (!sCurrentData.Ekgrp) {
			// 	if (oEkgrp.getItems() && oEkgrp.getItems()[0]) {
			// 		sCurrentData.Ekgrp = oEkgrp.getItems()[0].getKey();
			// 		oEkgrp.setSelectedItem(oEkgrp.getItems()[0]);
			// 	}
			// }

			// if (oEkgrp._lastValue !== "") {
			// 	sCurrentData.Ekgrp = oEkgrp.getSelectedKey();
			// } else {
			// 	sCurrentData.Ekgrp = sCurrentData.Ekgrp;
			// }

			if(sCurrentData.Ekgrp){
				this.getView().byId("EKGRP").setEditable(false);
			}

			if (!sCurrentData.Knttp) {
				sCurrentData.Knttp = "I";
			}

			if (!sCurrentData.DelivDate) {
				sCurrentData.DelivDate = sCurDat;
			}

			jsonmodel.setData(sCurrentData);

			this.setFieldAttr(sCurrentData.Knttp);
			if (this.getGlobalVar("Bsart") === "KF30") {
				this.setFieldAttr("A");
				this.getView().byId("Knttp").setSelectedKey("A");
				this.getView().byId("Knttp").setEditable(false);
			} else {
				this.getView().byId("Knttp").setEditable(true);
			}

		},
		// onMengeChange: function(oEvent) {
		// 	var sValue = oEvent.getSource().getValue();

		// 	var oDetail = this.getModel("RequireDetailEdit").getData();
		// 	var s      
		// 	this.getModel("RequireDetailEdit").setProperty("Lgort", null);
		// },
		handleChangeKnttp: function(oEvent) {
			var oKey = oEvent.getParameter("selectedItem").getProperty("key");
			this.setFieldAttr(oKey);
		},

		handleLgortValueHelp: function(oEvent) {

			var oSource = oEvent.getSource();

			var oModel = this.getView().getModel("catalog");
			var sWerks = this.getView().byId("WERKS").getSelectedKey();
			var sPath = "ZshLgortSet";
			// var sPath = "ZshLgortSet( '" + sWerks + "')";
			var aFilters = [];
			aFilters = [
				new Filter("Werks", sap.ui.model.FilterOperator.EQ, sWerks)
			];

			this.valuehelp = new ValueHelpHelper(oModel);
			this.valuehelp.excludeFilters(["Werks"]);
			this.valuehelp.excludeColumns(["Werks"]);
			this.valuehelp.initFilters(aFilters);
			this.valuehelp.openValueHelp(sPath, "Lgort", "LgortTxt",

				function(k, t, oItem) {

					oSource.setValue(k);
				});
		},

		setFieldAttr: function(oKey) {
			// var sCurrentData = sap.ui.getCore().edititem;
			switch (oKey) {
				case "A":
					this.getView().byId("Label_Hkont").setVisible(false);
					this.getView().byId("Hkont").setVisible(false);
					this.getView().byId("Hkont").setValue("");
					
					this.getView().byId("Label_Kostl").setVisible(false);
					this.getView().byId("Kostl").setVisible(false);
					this.getView().byId("Kostl").setValue("");

					this.getView().byId("Label_Lgort").setVisible(false);
					this.getView().byId("Lgort").setVisible(false);
					this.getView().byId("Lgort").setValue("");
					
					break;
				case "I":
					this.getView().byId("Label_Hkont").setVisible(false);
					this.getView().byId("Hkont").setVisible(false);
					this.getView().byId("Hkont").setValue("");

					this.getView().byId("Label_Kostl").setVisible(false);
					this.getView().byId("Kostl").setVisible(false);
					this.getView().byId("Kostl").setValue("");

					this.getView().byId("Label_Lgort").setVisible(true);
					this.getView().byId("Lgort").setVisible(true);

					break;

				case "K":
					this.getView().byId("Label_Hkont").setVisible(true);
					this.getView().byId("Hkont").setVisible(true);

					this.getView().byId("Label_Kostl").setVisible(true);
					this.getView().byId("Kostl").setVisible(true);

					this.getView().byId("Label_Lgort").setVisible(false);
					this.getView().byId("Lgort").setVisible(false);
					this.getView().byId("Lgort").setValue("");
					
					break;
			}
		},

		onWerksChange: function(oEvent) {

			var oLgort = this.getView().byId("Lgort");

			this.getModel("RequireDetailEdit").setProperty("Lgort", null);
			oLgort.setValue("");

		},
		onApply: function(oEvent) {

			var validator = new Validator();
			var oChkContrl = this.byId("CheckLayout");
			if (validator.validate(oChkContrl)) {
				var sEditData = this.getView().getModel("RequireDetailEdit").getData();
				sEditData.Knttp = this.getView().byId("Knttp").getSelectedKey();
				var Quantity = sEditData.Menge;
				if (Quantity <= 0) {
					MessageToast.show("行" + sEditData.Posnr + "数量大于等于1");
					return;
				}
				if (Quantity.toString().length > 10) {
					MessageToast.show("行号" + sEditData.Posnr + "数量长度不得超过10位");
					return;
				}

				var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("applyChange", sEditData);

				this.onNavBack();
			}

		},
		onRequireDetailNavBack: function() {
			var sEditData = this.getView().getModel("RequireDetailEdit").getData();
			this.confirmNavBack(sEditData, sap.ui.getCore().edititem);
		}
	});
});