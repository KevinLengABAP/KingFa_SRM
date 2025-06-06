sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem",
	"sap/ui/core/Priority",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, GroupHeaderListItem, Priority, MessageToast, History) {
	"use strict";
	var oCartModel = new JSONModel();
	return BaseController.extend("ZEC_CART_CREATE.controller.Cart", {
		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("cart").attachPatternMatched(this._onRouteMatched, this);
			this.getView().setModel(oCartModel, "cartHeader");
			this._oResourceBundle = this.getResourceBundle();

		},
		_onRouteMatched: function(oEvent) {
			this.setGlobalVar("purCate", null);
			this.setGlobalVar("Bsart", null);

			var oModel = this.getModel();
			var oTable = this.getView().byId("CartTable");

			oModel.refresh();
			this.countCart();
			oTable.getBinding("items").attachEvent(
				"change",
				function(oData) {
					var fTotal = 0,
						sCurrency;
					var sMenge,
						sNetpr,
						sPeinh;
					var aItems = oTable.getItems();
					for (var i = 0; i < aItems.length; i++) {
						sMenge = this.getView().getModel().getProperty("Menge", aItems[i].getBindingContext());
						sNetpr = this.getView().getModel().getProperty("Netpr", aItems[i].getBindingContext());
						sPeinh = this.getView().getModel().getProperty("Peinh", aItems[i].getBindingContext());
						fTotal = parseFloat(sMenge) * parseFloat(sNetpr) / parseFloat(sPeinh) + fTotal;

						if (i === aItems.length - 1) {
							sCurrency = oModel.getProperty("Waers", aItems[i].getBindingContext());
							this.getModel("cartHeader").setProperty("/currency", sCurrency);
						}
					}
					this.getModel("cartHeader").setProperty("/count", aItems.length);
					this.getModel("cartHeader").setProperty("/total", parseFloat(fTotal).toFixed(2));
					this.getView().getModel().submitChanges();
				}.bind(this)
			);

		},
		onDelete: function(oEvent) {

			var aPath = this.byId("CartTable").getSelectedItems();
			var _oResourceBundle = this.getResourceBundle();
			var iLength = aPath.length;
			if (iLength === 0) {
				MessageToast.show("请至少选择一行进行删除");
				return;
			}
			sap.m.MessageBox.show("确定要删除吗？", {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "删除",
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function(oAction) {

					if (oAction === sap.m.MessageBox.Action.OK) {
						for (var j = 0; j < aPath.length; j++) {
							this.getModel().remove(aPath[j].getBindingContextPath(), {
								groupId: "batch"
							});
						}
						this.setGlobalVar("busy", true);
						this.getModel().submitChanges({
							groupId: "batch",
							success: function(oData, response) {
								this.setGlobalVar("busy", false);
								if (oData.__batchResponses[0].__changeResponses) {
									if (iLength === oData.__batchResponses[0].__changeResponses.length) {
										MessageToast.show(_oResourceBundle.getText("mCarDelScuess", iLength));
									}
								} else {
									MessageToast.show(oData.__batchResponses[0].message);
								}

								this.countCart();
							}.bind(this),
							error: function(oError) {
								this.setGlobalVar("busy", false);
							}.bind(this)
						});
					}
				}.bind(this)
			});

		},
		onCreate: function(oEvent) {
			var oModel = this.getView().getModel();

			var aItems = this.byId("CartTable").getSelectedItems();
			var sPurCate,
				sCate,
				oItemData;
			var aItemData = [];
			for (var i in aItems) {
				oItemData = oModel.getObject(aItems[i].getBindingContextPath());
				aItemData.push(oItemData);

				sCate = oItemData.CategoryId;
				if (i === "0" && sCate) {
					sPurCate = sCate.substr(0, 1);
				} else if (sPurCate !== sCate.substr(0, 1)) {
					MessageToast.show("请选择一致的采购大类");
					return;
				}
			}
			if (sPurCate) {
				this.setGlobalVar("purCate", sPurCate);
			}

			var that = this;
			// if (oModel) {
			if (aItemData.length > 0) {

				//后端call function写自建表
				// this.getOwnerComponent().getModel("catalog").callFunction("/CheckUsercomp", {
				// 	"method": "GET",
				// 	urlParameters: {
				// 		"User": "123"
				// 	}, // function import parameters
				this.getOwnerComponent().getModel().callFunction("/getUserPara", {
					"method": "GET",
					// function import parameters
					success: function(oData, response) {
						var headermodel = new JSONModel(oData);
						var jsonmodel = new JSONModel(aItemData);
						that.getOwnerComponent().setModel(headermodel, "newHeader");

						that.getOwnerComponent().setModel(jsonmodel, "newReqItems");
						that.setHeaderBsart();
						// that.setGlobalVar("fromCart", true);
						// that.getOwnerComponent().getRouter().navTo("requirements", {
						// 	objectId: "0000000000"
						// });
					}, // callback function for success
					error: function(oError) {
						var error = JSON.parse(oError.responseText);
						var msg = error.error.message.value;
						MessageToast.show("创建失败" && msg);
					}
				}); // callback function for error

			} else {
				MessageToast.show("请先选中要创建的购物车信息");
			}
		},
		setHeaderBsart: function() {
			var sPurCate = this.getGlobalVar("purCate");
			var oHeaderModel = this.getOwnerComponent().getModel("newHeader");
			if (oHeaderModel) {
				this.getOwnerComponent().getModel("catalog").read(
					"/ZCDS_PUR_CATE('" + sPurCate + "')", {
						success: function(oData) {
							oHeaderModel.setProperty("/Bsart", oData.Bsart);
							this.setGlobalVar("Bsart", oData.Bsart);
							this.setGlobalVar("fromCart", true);
							 this.setGlobalVar("CurObjId",null);
							this.getOwnerComponent().getRouter().navTo("requirements", {
								objectId: "0000000000"
							});

						}.bind(this)
					}
				);
			}
		},
		onChange: function(oEvent) {
			var sValue;
			sValue = oEvent.getParameter("value");
			var oItem = oEvent.getSource().getParent().getBindingContext().getObject();
			oItem.value = sValue * oItem.Netpr;
		}
	});

});