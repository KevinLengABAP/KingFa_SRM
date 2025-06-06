sap.ui.define([
	"ZEC_MY_REQUIREMENTS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/mvc/Controller",
	"ZEC_MY_REQUIREMENTS/utils/Validator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/ColumnListItem"
], function(BaseController, JSONModel, MessageToast, History, Controller, Validator, Filter, FilterOperator, ColumnListItem) {
	"use strict";
	var oCartModel = new JSONModel([]);
	var aEditItems = [];
	var cartheadModel = new JSONModel();
	return BaseController.extend("ZEC_MY_REQUIREMENTS.controller.RequirementsPo", {
		onInit: function() {

			this.getRouter().getRoute("requirementsPo").attachPatternMatched(this._onRequestMatched, this);
			// this.getRouter().getRoute("Myhome").attachPatternMatched(this._onRequestMatched, this);
			// this._onRequestMatched();

			// get the EventBus
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.subscribe("applyChange", this.applyChange, this);

			this.getView().setModel(cartheadModel, "RequireHead");
			this.getView().setModel(oCartModel, "PrList");

		},
		_onRequestMatched: function(oEvent) {

			var sObjectid = oEvent.getParameters().arguments.ObjectId;
			var that = this;
			var oBsart = this.getView().byId("Bsart");
			var sCurObjId = this.getGlobalVar("CurObjId");
			if (!sCurObjId || sCurObjId !== sObjectid) {
				this.setGlobalVar("CurObjId", sObjectid);

				this.getModel().read("/CartSet('" + sObjectid + "')", {
					async: false,
					success: function(oData, response) {
						cartheadModel.setData(oData);
						// Stat = oData.Stat;
						// sap.ui.getCore().Stat = oData.Stat;
						// that.getView().byId("ObjectId").setText(oData.ObjectId);
						// that.getView().byId("Ernam").setText(oData.Ernam);
						// that.getView().byId("Description").setValue(oData.Description);
						// that.getView().byId("Bsart").setSelectedKey(oData.Bsart);
						// that.getView().byId("Bukrs").setSelectedKey(oData.Bukrs);
						// that.getView().byId("Ekorg").setSelectedKey(oData.Ekorg);
						// that.getView().byId("GrTel").setValue(oData.GrTel);
						// that.getView().byId("GrAddr").setValue(oData.GrAddr);
						// that.getView().byId("Remark").setValue(oData.Remark);
						// that.getView().byId("Comments").setValue(oData.Comments);
						that.setGlobalVar("Stat", oData.Stat);
						that.getGlobalVar("Bsart", oData.Bsart);
						//不满足条件灰掉
						var sBsart = that.getGlobalVar("Bsart");
						if (sBsart) {
							oBsart.setSelectedKey(sBsart);
							oBsart.setEditable(false);
						}
						//that.byId("PrTable").setEditable(false); 
						if (oData.Stat !== "10" && oData.Stat !== "20") {
							that.setGlobalVar("isEdit", false);
							// that.getView().byId("Description").setEditable(false);
							// that.getView().byId("GrTel").setEditable(false);
							// that.getView().byId("GrAddr").setEditable(false);
							// that.getView().byId("Remark").setEditable(false);
							// that.byId("delbtn").setEnabled(false);
							// that.byId("savebtn").setEnabled(false);
							// that.byId("submitbtn").setEnabled(false);
							// that.byId("batupdatebtn").setEnabled(false);
							// that.byId("batdelbtn").setEnabled(false);
						} else {
							that.setGlobalVar("isEdit", true);
							// that.getView().byId("Description").setEditable(true);
							// that.getView().byId("GrTel").setEditable(true);
							// that.getView().byId("GrAddr").setEditable(true);
							// that.getView().byId("Remark").setEditable(true);
							// that.byId("delbtn").setEnabled(true);
							// that.byId("savebtn").setEnabled(true);
							// that.byId("submitbtn").setEnabled(true);
							// that.byId("batupdatebtn").setEnabled(true);
							// that.byId("batdelbtn").setEnabled(true);
						}
					},
					error: function(oError) {

						//    var error = JSON.parse(oError.responseText);
						//    var msg = error.error.message.value;
						// MessageToast.show("PR号创建失败,消息:"&&msg);
					}
				});

				var aFilter = [];
				var aProducts = [];

				var emptyall = true;
				aFilter.push(new Filter("ObjectId", FilterOperator.EQ, sObjectid));

				// if(sap.ui.getCore().cartmodel !== undefined){
				// 	oCartModel = sap.ui.getCore().cartmodel;
				// 	var oData = oCartModel.getData();

				// 	aProducts.push(oData);
				// 	that.getView().setModel(oCartModel, "PrList");
				// 	that.getView().byId("text").setText("总共" + aProducts.length + "个项目");
				// 	that.calculateTotal(oData);
				// 	that.getModel("PrList").refresh();
				// 	if(Stat === "25" && emptyall === true){
				//                that.byId("delbtn").setEnabled(true);
				//              }

				// }else{

				this.getModel().read("/CartItemSet", {
					filters: aFilter,
					success: function(oData, response) {
						if (oData.results) {
							var oItemData = {};
							var sKnValue;
							for (var i in oData.results) {
								// that.getView().byId("Ekorg").setSelectedKey(oData.results[i].Ekorg);
								if (oData.results[i].Ebeln !== undefined && oData.results[i].Ebeln !== "") {
									emptyall = false;
								}

								oItemData = oData.results[i];
								// $.extend(oItemData, oData.CartItemSet.results[i]);
								if (oItemData.Knttp === "A") {
									oItemData.Asset = oItemData.KnValue;
								} else if (oItemData.Knttp === "K") {

									oItemData.Kostl = oItemData.KnValue;
								}

								aProducts.push(oItemData);
							}

						}

						oCartModel.setData(aProducts);
						that.getView().byId("text").setText("总共" + aProducts.length + "个项目");
						that.calculateTotal(aProducts);
						that.getModel("PrList").refresh();
						sap.ui.getCore().cartmodel = oCartModel;
						if (that.getGlobalVar("Stat") === "25" && emptyall === true) {
							that.byId("delbtn").setEnabled(true);
						}

					},
					error: function(oError) {
						// that.setGlobalVar("busy", false);
					}
				});
			} else {

				var aItem = oCartModel.getData();
				this.byId("PrTable").removeSelections();
				aEditItems = [];
				this.getModel().refresh();
				this.getView().byId("text").setText("总共" + aItem.length + "个项目");
				this.calculateTotal(aItem);

			}
			this.byId("PrTable").removeSelections();
			//}

		},
		// convItem: function(oItem) {
		// 	var Path = window.location.origin;
		// 	if (Path.indexOf("localhost") !== -1) {
		// 		Path = "http:///srmdevapp.kingfa.com.cn:8800";
		// 	}
		// 	if (oItem.ProductId !== undefined && oItem.ProductId !== "") {
		// 		var Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='',Lifnr='" + oItem
		// 			.Lifnr + "',Matnr='" + oItem.ProductId +
		// 			"',ZimageDesc='1')/$value";
		// 	} else {
		// 		Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='" + oItem.CatalogGuid +
		// 			"',Lifnr='',Matnr='',ZimageDesc='1')/$value";
		// 	}

		// 	var value = oItem.Menge * oItem.Netpr / oItem.Peinh;
		// 	var oProduct = {
		// 		Posnr: oItem.Posnr,
		// 		ProductPicUrl: Url,
		// 		Matnr: oItem.ProductId,
		// 		Maktx: oItem.Description,
		// 		Quantity: oItem.Menge,
		// 		Meins: oItem.Meins,
		// 		Lifnr: oItem.Lifnr,
		// 		LifnrNam: oItem.LifnrNam,
		// 		Price: oItem.Netpr,
		// 		Dmbtr: value,
		// 		Peinh: oItem.Peinh,
		// 		CurrencyCode: oItem.Waers,
		// 		// Bsart: "",
		// 		GuidI: oItem.GuidI,
		// 		GuidH: oItem.GuidH,
		// 		CatalogGuid: oItem.CatalogGuid,
		// 		Werks: oItem.Werks,
		// 		Lgort: oItem.Lgort,
		// 		Note: oItem.Note,
		// 		Hkont: oItem.Hkont,
		// 		Kostl: oItem.KnValue,
		// 		Matkl: oItem.Matkl,
		// 		Knttp: oItem.Knttp,
		// 		Ekgrp: oItem.Ekgrp,
		// 		CategoryId: oItem.CategoryId,
		// 		CategoryTxt: oItem.CategoryTxt,
		// 		DelivDate: oItem.DelivDate
		// 	};
		// 	return oProduct;
		// },

		onEditPress: function(oEvent) {

			var oContext = oEvent.getSource().getBindingContext("PrList");
			var sObject = oContext.getObject();

			var sPath = oContext.getPath();
			aEditItems = [];
			aEditItems.push(this.convPathToOrder(sPath));

			sap.ui.getCore().edititem = sObject;

			this.getOwnerComponent().getRouter().navTo("requireEditPo", {
				guid: sObject.GuidI
			});

		},
		calculateTotal: function(oCart) {

			var oAmount = 0,
				oCurrency;
			if (oCart.length > 0) {
				for (var i = 0; i < oCart.length; i++) {
					oAmount = oAmount + parseFloat(oCart[i].Value);
					oCurrency = oCart[i].Waers;
				}
				this.getView().byId("sum").setText(parseFloat(oAmount).toFixed(2) + oCurrency);
			} else {
				this.getView().byId("sum").setText(parseFloat(oAmount).toFixed(2));
			}

		},
		onDelete: function(oEvent) {
			var that = this;
			var oCartNo = this.getView().byId("ObjectId").getText();
			this.getModel().callFunction("/DeleteCartData", {
				"method": "POST",
				urlParameters: {
					"ObjectId": oCartNo
				}, // function import parameters	
				success: function(oData, response) {
					MessageToast.show("删除成功");
					// sap.ui.getCore().cartmodel.setData([]);
					that.getModel().refresh();
					that.onNavBack();
				},
				error: function(oError) {
					MessageToast.show("删除失败");
				}
			});

		},
		onGoPO: function(oEvent) {

			var cartid = this.getView().byId("ObjectId").getText();
			if (cartid) {
				this.getOwnerComponent().getRouter().navTo("PoDetial", {
					ObjectId: cartid
				});
			}
		},
		onMultipleDelete: function(oEvent) {
			var that = this;
			var sCartNo = this.getView().byId("ObjectId").getText();
			var sCart = [],
				sPath,
				sPosnr,
				adbIndex = [], //add by ibm05 20220110
				aIndex = [];
			var aSelect = this.byId("PrTable").getSelectedItems();

			if (aSelect.length === 0) {
				MessageToast.show("请至少选择一行进行删除");
				return;
			}
			//change begin of ibm05 20220110
			for (var i = 0; i < aSelect.length; i++) {
				sPath = aSelect[i].getBindingContext("PrList").getPath();
				aIndex.push(this.convPathToOrder(sPath));
			}
			for (var k = 0; k < aSelect.length; k++) {
				sPosnr = aSelect[k].getBindingContext("PrList").getObject().Posnr;
				adbIndex.push(sPosnr);
			}
			// aIndex.sort();
			adbIndex.sort();
			//change end of ibm05 20220110

			if (sCartNo !== undefined && sCartNo !== "") {
				this.getModel().callFunction("/DeleteCartItemData", {
					"method": "POST",
					urlParameters: {
						"ObjectId": sCartNo,
						// "Posnr": aIndex
						"Posnr": adbIndex //change by ibm05 20220110
					}, // function import parameters	
					success: function(oData, response) {
						var oItem = that.getView().getModel("PrList").getData();
						if (aIndex.length === oItem.length) {
							oItem.splice(0, oItem.length);
							sCart.push(oItem);
						} else {
							for (var j = aIndex.length - 1; j >= 0; j--) {
								sCart.push(oItem[aIndex[j]]);
								oItem.splice(aIndex[j], 1);
							}
						}
						oCartModel.setData(oItem);
						that.getModel().refresh();
						MessageToast.show("行项目删除成功");
					},
					error: function(oError) {
						MessageToast.show("行项目删除失败");
					}
				});

			} else {

				var oItem = this.getView().getModel("PrList").getData();

				if (aIndex.length === oItem.length) {
					oItem.splice(0, oItem.length);
				} else {
					for (var j = aIndex.length - 1; j >= 0; j--) {
						oItem.splice(aIndex[j], 1);
					}
				}
				oCartModel.setData(oItem);
				that.getModel().refresh();
				MessageToast.show("行项目删除成功");
				// MessageToast.show("请先保存数据");
			}

		},
		applyChange: function(sChannelId, sEvent, oDetail) {
			var aItem = oCartModel.getData();
			var j;
			for (var i = 0; i < aEditItems.length; i++) {
				j = aEditItems[i];
				for (var a in oDetail) {
					aItem[j][a] = oDetail[a];
				}
				if (oDetail.Menge) {
					aItem[j].Value = aItem[j].Menge * aItem[j].Netpr / aItem[j].Peinh;
				}
			}
			oCartModel.setData(aItem);
			this.calculateTotal(aItem);
			this.byId("PrTable").removeSelections();
			aEditItems = [];
		},

		onBatchUpdate: function(oEvent) {
			var aSelect = this.byId("PrTable").getSelectedItems();

			// var index = this.byId("PrTable").getSelectedIndices();
			// var Bsart = this.getView().byId("Bsart").getSelectedKey();

			if (aSelect.length === 0) {
				MessageToast.show("请至少选择一行进行批量修改");
				return;
			} else {
				var sPath;
				for (var i = 0; i < aSelect.length; i++) {
					sPath = aSelect[i].getBindingContext("PrList").getPath();
					aEditItems.push(this.convPathToOrder(sPath));
				}
				this.getOwnerComponent().getRouter().navTo("batchEdit", {});
			}

		},
		onSave: function(oEvent) {
			this.onSaveandsubmit(false);
		},
		onSubmit: function(oEvent) {
			this.onSaveandsubmit(true);
		},
		onSaveandsubmit: function(bSubmitflg) {
			var validator = new Validator();
			var oChkContrl = this.byId("CheckLayout");
			if (validator.validate(oChkContrl)) {

				var sHead = this.getView().getModel("RequireHead").getData();

				//表头check
				var ItemData = [];

				var oItem = this.getView().getModel("PrList").getData();
				var sCurDat = new Date();

				if (oItem && oItem.length > 0) {
					var sKnttp;
					var sKnValue;
					var sWerks;
					for (var i = 0; i < oItem.length; i++) {

						if (!oItem[i].Werks) {
							MessageToast.show("行号" + oItem[i].Posnr + "输入必输项,工厂必输");
							return;
						}
						if (!sWerks) {
							sWerks = oItem[i].Werks;
						} else
						if (sWerks !== oItem[i].Werks) {
							MessageToast.show("行号" + oItem[i].Posnr + "工厂不一致");
							return;
						}

						if (oItem[i].Menge.length > 10) {
							MessageToast.show("行号" + oItem[i].Posnr + "数量长度不得超过10位");
							return;
						}
						if (!oItem[i].DelivDate) {
							MessageToast.show("行号" + oItem[i].Posnr + "维护交货日期");
							return;
						}
						if (this.compareDate(sCurDat, oItem[i].DelivDate)) {
							MessageToast.show("行号" + oItem[i].Posnr + "交货日期不能是在过去");
							return;
						}
						if (!oItem[i].Knttp) {
							MessageToast.show("行号" + oItem[i].Posnr + "维护账户分配");
							return;
						}
						if (!sKnttp) {
							sKnttp = oItem[i].Knttp;
						} else
						if (sKnttp !== oItem[i].Knttp) {
							MessageToast.show("需求明细账户分配(库存/成本中心)不一致!");
							return;
						}

						if (sKnttp === "A") {
							sKnValue = oItem[i].Asset;
						} else if (sKnttp === "K") {
							if (!oItem[i].Kostl || !oItem[i].Hkont) {
								MessageToast.show("请先输入必输项,成本中心和科目必输");
								return;
							}
							sKnValue = oItem[i].Kostl;
						}

						var item = {
							Posnr: oItem[i].Posnr.toString(),
							ProductId: oItem[i].ProductId,
							Description: oItem[i].Description,
							Menge: oItem[i].Menge.toString(),
							Meins: oItem[i].Meins,
							Netpr: oItem[i].Netpr,
							Lifnr: oItem[i].Lifnr,
							LifnrNam: oItem[i].LifnrNam,
							GuidH: oItem[i].GuidH ? oItem[i].GuidH.toUpperCase().replaceAll("-", "") : "",
							GuidI: oItem[i].GuidI ? oItem[i].GuidI.toUpperCase().replaceAll("-", "") : "",
							CatalogGuid: oItem[i].CatalogGuid ? oItem[i].CatalogGuid.toUpperCase().replaceAll("-", "") : "",
							Value: oItem[i].Value.toString(),
							Waers: oItem[i].Waers,
							CategoryId: oItem[i].CategoryId,
							CategoryTxt: oItem[i].CategoryTxt,
							Matkl: oItem[i].Matkl,
							Hkont: oItem[i].Hkont,
							DelivDate: oItem[i].DelivDate,
							Ekgrp: oItem[i].Ekgrp,
							Werks: oItem[i].Werks,
							Note: oItem[i].Note,
							Knttp: oItem[i].Knttp,
							Lgort: oItem[i].Lgort,
							KnValue: sKnValue,
							Mwskz: oItem[i].Mwskz,
							Peinh: oItem[i].Peinh.toString(),
							Ekorg: sHead.Ekorg,
							Bukrs: sHead.Bukrs
						};

						ItemData.push(item);
					}
				}

				if (!ItemData || ItemData.length === 0) {
					MessageToast.show("保存行项目数据不能为空!");
					return;
				}

				var sData = {
					ObjectId: sHead.ObjectId,
					Description: sHead.Description,
					Ernam: sHead.Ernam,
					Bukrs: sHead.Bukrs,
					Ekorg: sHead.Ekorg,
					Remark: sHead.Remark,
					Stat: "10",
					GrAddr: sHead.GrAddr,
					GrTel: sHead.GrTel,
					Bsart: sHead.Bsart,
					CartItemSet: ItemData
				};

				var that = this;
				if (!sHead.ObjectId) {
					var msg = "创建成功";
				} else {
					msg = "更新成功";
				}

				this.setGlobalVar("busy", true);
				this.getModel().create("/CartSet", sData, {
					async: false,
					success: function(oData, response) {

						that.getView().byId("ObjectId").setText(oData.ObjectId);
						that.getView().byId("Ernam").setText(oData.Ernam);

						// oCartModel.setData(oData.CartItemSet.results);
						var oItemData = {};
						var aItem = [];
						for (i = 0; i < oData.CartItemSet.results.length; i++) {
							// $.extend(oItemData, oData.CartItemSet.results[i]);
							oItemData = oData.CartItemSet.results[i];
							if (oItemData.Knttp === "A") {
								oItemData.Asset = oItemData.KnValue;
							} else if (oItemData.Knttp === "K") {

								oItemData.Kostl = oItemData.KnValue;
							}
							aItem.push(oItemData);
						}
						oCartModel.setData(aItem);

						MessageToast.show("PR号" + oData.ObjectId + msg);

						if (bSubmitflg) {
							var oCartNo = that.getView().byId("ObjectId").getText();
							if (oCartNo) {
								that.getModel().callFunction("/SubmitCartData", {
									"method": "POST",
									urlParameters: {
										"ObjectId": oCartNo
									}, // function import parameters	
									success: function(oData, response) {
										MessageToast.show("提交OA成功");
										that.getModel().refresh();
										that.setGlobalVar("busy", false);
										that.onNavBack();
									},
									error: function(oError) {
										that.setGlobalVar("busy", false);
										var error = JSON.parse(oError.responseText);
										var msg = error.error.message.value;
										MessageToast.show("提交失败,消息:" && msg);
									}
								});
							}
						} else {
							that.setGlobalVar("busy", false);
						}

					}.bind(this),
					error: function(oError) {
						that.setGlobalVar("busy", false);
						var error = JSON.parse(oError.responseText);
						var msg = error.error.message.value;
						MessageToast.show("PR号创建失败,消息:" && msg);
					}
				});
			}

		},
		onExit: function() {
			// get the EventBus
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.unsubscribe("applyChange");
		}

	});
});