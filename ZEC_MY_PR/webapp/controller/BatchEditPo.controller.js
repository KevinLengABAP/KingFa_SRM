sap.ui.define([
	"ZEC_MY_REQUIREMENTS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"ZEC_MY_REQUIREMENTS/utils/Validator",
	"ZEC_MY_REQUIREMENTS/utils/ValueHelpHelper"
], function(BaseController, JSONModel, MessageToast, History, Filter, Validator, ValueHelpHelper) {
	"use strict";
	var batchModel = new JSONModel([]);
	return BaseController.extend("ZEC_PO_CATALOG.controller.BatchEditPo", {
		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("batchEdit").attachPatternMatched(this._onRequestEditMatched, this);

			this.getView().setModel(batchModel, "BatchEdit");
		},
		_onRequestEditMatched: function(oEvent) {
			batchModel.setData({});
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

			if (this.getGlobalVar("Bsart") === "KF30") {
				this.setFieldAttr("A");
				this.getView().byId("Knttp").setSelectedKey("A");
				this.getView().byId("Knttp").setEditable(false);
			} else {
				this.setFieldAttr("I");
				this.getView().byId("Knttp").setSelectedKey("I");
				this.getView().byId("Knttp").setEditable(true);
			}
		},
		handleChangeKnttp: function(oEvent) {
			var oKey = oEvent.getParameter("selectedItem").getProperty("key");
			this.setFieldAttr(oKey);
		},
		setFieldAttr: function(oKey) {

			switch (oKey) {
				case "A":
					this.getView().byId("Label_Hkont").setVisible(false);
					this.getView().byId("Hkont").setVisible(false);
					this.getView().byId("Label_Kostl").setVisible(false);
					this.getView().byId("Kostl").setVisible(false);
					this.getView().byId("Label_Lgort").setVisible(false);
					this.getView().byId("Lgort").setVisible(false);
					break;
				case "I":
					this.getView().byId("Label_Lgort").setVisible(true);
					this.getView().byId("Lgort").setVisible(true);
					this.getView().byId("Label_Hkont").setVisible(false);
					this.getView().byId("Hkont").setVisible(false);
					this.getView().byId("Label_Kostl").setVisible(false);
					this.getView().byId("Kostl").setVisible(false);
					break;
				case "K":
					this.getView().byId("Label_Lgort").setVisible(false);
					this.getView().byId("Lgort").setVisible(false);
					this.getView().byId("Label_Hkont").setVisible(true);
					this.getView().byId("Hkont").setVisible(true);
					this.getView().byId("Label_Kostl").setVisible(true);
					this.getView().byId("Kostl").setVisible(true);
					break;
			}
		},
		onWerksChange: function(oEvent) {

			var oLgort = this.getView().byId("Lgort");

			this.getModel("BatchEdit").setProperty("Lgort", null);
			oLgort.setValue("");

		},
		handleLgortValueHelp: function(oEvent) {

			var oSource = oEvent.getSource();
			var oModel = this.getView().getModel();
			var sWerks = this.getView().byId("WERKS").getSelectedKey();
			var sPath = "ZshLgortSet";
			var aFilters = [
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
		onApply: function(oEvent) {

			var validator = new Validator();
			var oChkContrl = this.byId("CheckLayout");
			var sEditData = this.getView().getModel("BatchEdit").getData();
			if (sEditData.Menge !== undefined) {
				if (isNaN(sEditData.Menge)) {
					MessageToast.show("数量请输入数字类型");
					return;
				}

				if (sEditData.Menge.toString().length > 10) {
					MessageToast.show("数量长度不得超过10位");
					return;
				}
			}
			if (validator.validate(oChkContrl)) {
				// 	sap.m.MessageBox.show("确定要更新为同一数据吗？", {
				// 		icon: sap.m.MessageBox.Icon.WARNING,
				// 		title: "批量更新",
				// 		actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				// 		onClose: function(oAction) {
				// 			if (oAction === sap.m.MessageBox.Action.OK) {

				var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("applyChange", sEditData);

				this.onNavBack();
				// 			}
				// 		}.bind(this)
				// 	});
			}

		},
		onRequireDetailNavBack: function() {
			var sEditData = this.getView().getModel("BatchEdit").getData();
			this.confirmNavBack(sEditData, {});
		}
	});
});