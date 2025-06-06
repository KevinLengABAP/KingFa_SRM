sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem"
], function(BaseController, Device, JSONModel, MessageToast, Filter, FilterOperator, GroupHeaderListItem) {
	"use strict";
	var oMasterModel = new JSONModel();
	return BaseController.extend("ZEC_CART_CREATE.controller.Catalog", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZEC_CART_CREATE.view.Catalog
		 */

		onInit: function() {
			var oViewModel = new JSONModel({
				isOpen: false
			});
			this.getView().setModel(oViewModel, "search");
			this.getOwnerComponent().getRouter().getRoute("catalog").attachPatternMatched(this._onRouteMatched, this);
			this.getOwnerComponent().getRouter().getRoute("catalogSearchDetails").attachPatternMatched(this._onRouteMatched, this);

			this.getOwnerComponent().getModel("catalog").read("/Zcatalog_grpSet", {
				// filters: aFilters,
				success: function(oData, response) {
					this.setGrpList(oData);
				}.bind(this),
				error: function(oError) {}
			});

			this.getView().setModel(oMasterModel, "CatalogList");
			this.countCart();
		},
		setGrpList: function(oData) {
			var aData = [];
			for (var i = 0; i < oData.results.length; i++) {
				var data = {
					"Id": oData.results[i].Id,
					"Name": oData.results[i].Name,
					"GroupType": oData.results[i].GroupType,
					"Count": oData.results[i].Count
				};
				aData.push(data);
			}
			oMasterModel.setData(aData);
		},
		_onRouteMatched: function(oEvent) {
			
		},
		
		onOpenBtn: function(oEvent) {
			this.getView().getModel("search").setProperty("/isOpen", true);

		},
		onCloseBtn: function(oEvent) {
			this.getView().getModel("search").setProperty("/isOpen", false);

		},
		getGroupHeader: function(oGroup) {
			var sTitle = "";

			switch (oGroup.key) {
				case "TY":
					sTitle = "品类";
					break;
				case "LF":
					sTitle = "供应商";
					break;
				case "MF":
					sTitle = "制造商";
					break;
			}

			return new GroupHeaderListItem({
				title: sTitle,
				upperCase: false
			});
		},
		onItemPress: function(oEvent) {

			var sId, oGroupType;
			var aCategory, aLifnr, aManufacturer, aCategorydesc;
			var oContext = oEvent.getSource().getBindingContext("CatalogList").getObject();
			if (oContext) {

				sId = oContext.Id;
				aCategorydesc = oContext.Name;
				oGroupType = oContext.GroupType;
			}
			switch (oGroupType) {
				case "TY":
					aCategory = sId;
					this.getOwnerComponent().getRouter().navTo("catalogSearchDetails", {
						"?query": {
							Category: aCategory,
							Categorydesc: encodeURIComponent(aCategorydesc) //转换“/”
						}
					});
					break;
				case "LF":
					aLifnr = sId;
					this.getOwnerComponent().getRouter().navTo("catalogSearchDetails", {
						"?query": {
							Lifnr: aLifnr
						}
					});
					break;
				case "MF":
					aManufacturer = sId;
					this.getOwnerComponent().getRouter().navTo("catalogSearchDetails", {
						"?query": {
							Manufacturer: aManufacturer
						}
					});
					break;
			}
		},

		onDisplayCart: function(oEvent) {

			this.getOwnerComponent().getRouter().navTo("cart");

		},
		onSearchAll: function(oEvent) {

			var sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				this.getOwnerComponent().getRouter().navTo("catalogSearchDetails", {
					"?query": {
						SearchField: sQuery
					}
				});
			} else {
				this.getOwnerComponent().getRouter().navTo("catalog");
			}

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZEC_CART_CREATE.view.Catalog
		 */
			onBeforeRendering: function() {
		debugger
			},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZEC_CART_CREATE.view.Catalog
		 */
			onAfterRendering: function() {
				debugger
			},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZEC_CART_CREATE.view.Catalog
		 */
		onExit: function() {

		}

	});

});