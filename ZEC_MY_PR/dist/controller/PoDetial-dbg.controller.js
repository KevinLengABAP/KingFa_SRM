sap.ui.define([
	"ZEC_MY_REQUIREMENTS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem",
	"sap/ui/core/Priority",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	// "ZEC_MY_REQUIREMENTS/utils/Validator"
], function(BaseController, JSONModel, GroupHeaderListItem, Priority, MessageToast, History, Filter, FilterOperator) {
	"use strict";
	var oPoDataModel = new JSONModel();
	var oPoDetialModel = new JSONModel();
	return BaseController.extend("ZEC_MY_REQUIREMENTS.controller.PoDetial", {
		onInit: function() {

			this.getRouter().getRoute("PoDetial").attachPatternMatched(this._onRequestMatched, this);
			// this.getRouter().getRoute("Myhome").attachPatternMatched(this._onRequestMatched, this);
			// this._onRequestMatched();

			// var oSettingModel = new JSONModel({
			// 	isEdit: false
			// });
			// oSettingModel.setDefaultBindingMode("OneWay");
			// this.getView().setModel(oSettingModel, "podetial");
			this.getView().setModel(oPoDataModel, "ZPoList");
			this.getView().setModel(oPoDetialModel, "PoDetial");

		},
		_onRequestMatched: function(oEvent) {

			var sObjectid = oEvent.getParameters()["arguments"].ObjectId;
			//var sHead = this.getView().getModel("RequireHead").getData();
			var aFilter = [];
			aFilter.push(new Filter("ObjectId", FilterOperator.EQ, sObjectid));
			var oModel = this.getOwnerComponent().getModel();

			oModel.setUseBatch(false);
			var aData = [];
			var that = this;
			oModel.read("/Zpo_listSet", {
				filters: aFilter,
				success: function(oData, response) {
					for (var i = 0; i < oData.results.length; i++) {

						var data = {
							"ObjectId": oData.results[i].ObjectId,
							"Ebeln": oData.results[i].Ebeln,
							"Bukrs": oData.results[i].Bukrs,
							"Ekorg": oData.results[i].Ekorg,
							"Ekgrp": oData.results[i].Ekgrp,
							"Wgbez": oData.results[i].Wgbez,
							"Lifnr": oData.results[i].Lifnr,
							"LifnrNam": oData.results[i].LifnrNam,
							"PoStat": oData.results[i].PoStat,
							"PoStatTxt": oData.results[i].PoStatTxt,
							"Value": oData.results[i].Value,
							"Waers": oData.results[i].Waers,
							"Eindt": oData.results[i].Eindt,
							"MengeSh": oData.results[i].MengeSh,
							"MsgTxt": oData.results[i].MsgTxt
						};
						aData.push(data);

						var Stat = that.getGlobalVar("Stat"); //sap.ui.getCore().Stat;
						if (oData.results[i].Ebeln.indexOf("#TMP") !== -1 && Stat !== "30") {
							that.byId("OnRegeneratePo").setEnabled(true);
						}
					}
					oPoDataModel.setData(aData);
					// var oMoreinfoModel = new JSONModel(sData);
					// that.getView().setModel(oMoreinfoModel, "ZPoList");

				},
				error: function(oError) {}
			});

		},

		onGeneratePo: function(oEvent) {

			var aData = this.getView().getModel("ZPoList").getData();
			var index = this.byId("PolistTable").getSelectedIndex();
			if (index < 0) {
				MessageToast.show("请至少选择一行进行采购订单生成");
				return;
			}

			var oModel = this.getOwnerComponent().getModel();

			var that = this;
			oModel.setUseBatch(false);
			oModel.callFunction("/onGeneratePo", {
				// this.getModel().callFunction("/OnRegeneratePo", {
				"method": "POST",
				urlParameters: {
					"Ebeln": aData[index].Ebeln,
					"ObjectId": aData[index].ObjectId
				}, // function import parameters	
				success: function(oData, response) {

					for (var i = 0; i < aData.length; i++) {

						if (i === index) {
							aData[index].Ebeln = oData.Ebeln;
						}

					}

					oPoDataModel.setData(aData);
					that.onSelectionChange(oEvent);
					that.getModel().refresh();
					MessageToast.show("采购订单重新生成成功!");
				},
				error: function(oError) {
					var error = JSON.parse(oError.responseText);
					var msg = error.error.message.value;
					MessageToast.show("失败,消息:" && msg);
				}
			});

		},

		// onReqDisplay: function(oEvent) {
		// 	var data = this.getView().getModel("ZPoList").getData();
		// 	var index = this.byId("PolistTable").getSelectedIndex();
		// 	var ObjectIdval = data[index].ObjectId;
		// 	this.getRouter().navTo("requirements", { ObjectId:ObjectIdval });
		// },
		onSelectionChange: function(oEvent) {

			var data = this.getView().getModel("ZPoList").getData();
			var index = this.byId("PolistTable").getSelectedIndex();
			var aFilters = [];
			var sQuery1 = data[index].Ebeln;
			if (sQuery1.length > 0) {
				aFilters.push(new Filter("Ebeln", FilterOperator.EQ, sQuery1));
				aFilters.push(new Filter("ObjectId", FilterOperator.EQ, data[index].ObjectId));
			}
			var oModel = this.getOwnerComponent().getModel();
			var aData = [];
			var that = this;
			oModel.setUseBatch(false);
			oModel.read("/Zpo_detialSet", {
				filters: aFilters,
				success: function(oData, response) {
					for (var i = 0; i < oData.results.length; i++) {
						var oItem = {
							"Ebelp": oData.results[i].Ebelp,
							"Loekz": oData.results[i].Loekz,
							"Knttp": oData.results[i].Knttp,
							"Werks": oData.results[i].Werks,
							"Matnr": oData.results[i].Matnr,
							"Maktx": oData.results[i].Maktx,
							"Matkl": oData.results[i].Matkl,
							"Wgbez": oData.results[i].Wgbez,
							"MengeDd": oData.results[i].MengeDd,
							"MengeSh": oData.results[i].MengeSh,
							"Meins": oData.results[i].Meins,
							"Netpr": oData.results[i].Netpr,
							"Peinh": oData.results[i].Peinh,
							"Value": oData.results[i].Value.toString(),
							"Waers": oData.results[i].Waers,
							"Eindt": oData.results[i].Eindt,
							"Lgort": oData.results[i].Lgort,
							"PoStat": oData.results[i].PoStat,
							"PoStatTxt": oData.results[i].PoStatTxt
						};
						aData.push(oItem);
					}
					oPoDetialModel.setData(aData);

				},
				error: function(oError) {}
			});
			// MessageToast.show(data[index].Ebeln);
		}

	});
});