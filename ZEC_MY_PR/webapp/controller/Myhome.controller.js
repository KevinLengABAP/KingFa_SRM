sap.ui.define([
	"ZEC_MY_REQUIREMENTS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem",
	"sap/ui/core/Priority",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/mvc/Controller",
	"ZEC_MY_REQUIREMENTS/utils/Validator"
], function(BaseController, JSONModel, GroupHeaderListItem, Priority, MessageToast, History ,Controller,Validator) {
	"use strict";
	var oCartModel = new JSONModel([]);
	var sItem = [];
	var sDisItem = [];
	var cartheadjson = new JSONModel([]);
	return BaseController.extend("ZEC_MY_REQUIREMENTS.controller.Myhome", {
		onInit: function() {
			
			this.getOwnerComponent().getRouter().getRoute("Myhome").attachPatternMatched(this._onRequestMatched, this);

			// this.getView().setModel(cartheadjson, "RequireHead");
			// this.getView().setModel(oCartModel, "PrList");


		},
		_onRequestMatched: function(oEvent) {
			 
			
			// var oBukrs = this.getView().byId("Bukrs");
			// oBukrs.getBinding("items").attachEventOnce(
			// 	"dataReceived",
			// 	function(oData) {
			// 		var oFirstListItem = oBukrs.getItems()[0];

			// 		if (oFirstListItem) {
			// 			oBukrs.setSelectedItem(oFirstListItem);
			// 			oBukrs.setEditable(false);
			// 		} else {
			// 			oBukrs.setEditable(true);
			// 		}
			// 	}

			// );
			
			// var Ekorg = this.getView().byId("Ekorg");
			// Ekorg.getBinding("items").attachEventOnce(
			// 	"dataReceived",
			// 	function(oData) {
			// 		var oFirstListItem = Ekorg.getItems()[0];
			// 		if (oFirstListItem) {
			// 			Ekorg.setSelectedItem(oFirstListItem);
			// 			Ekorg.setEditable(false);
			// 		} else {
			// 			Ekorg.setEditable(true);
			// 		}
			// 	}

			// );
			debugger;
			var sHead = this.getView().getModel("requirementsPo");
			var objectid = oEvent.getParameters()["arguments"].ObjectId;
				cartheadjson = {
				ObjectId: objectid
			   };
			var jsonmodel = new JSONModel(cartheadjson);
			this.getView().setModel(jsonmodel, "RequireHead");
			// var that = this;
			// this.getModel().read("/CartSet('" + objectid + "')",{
			// 	async: false,
			// 	success: function(oData, response) {
			// 		 
			// 		that.getView().byId("ObjectId").setText(oData.ObjectId);
			// 		this.getView().getModel("PrList").getData();

			// 		// that.getView().byId("Ernam").setText(oData.Ernam);
			// 		// that.getView().byId("GrAddr").setText(oData.GrAddr);
			// 		// that.getView().byId("Bsart").setText(oData.Bsart);
			// 		// that.getView().byId("Remark").setText(oData.Remark);
			// 		// MessageToast.show("PR号" + oData.ObjectId + msg);
			// 	},
			// 	error: function(oError) {
					
			// 	 //    var error = JSON.parse(oError.responseText);
			// 	 //    var msg = error.error.message.value;
			// 		// MessageToast.show("PR号创建失败,消息:"&&msg);
			// 	}
			// });
			
			// this.getView().getParent().getParent().setMode("HideMode");
			// var sCart = [];
			// // var aData = this.getView().getModel("PrList").getData();
			// // sap.ui.getCore().cartmodel = this.getView().getModel("PrList");

			// // if (sap.ui.getCore().cartmodel !== undefined) {
			// 	var aData = sap.ui.getCore().cartmodel.getData();
		
			// 	aData.forEach(function(item, index, arr) {
				
			// 		item.Posnr = index + 1;
			// 		item.Dmbtr = item.Quantity * item.Price;
			// 		item.Matnr = item.ProductId;
			// 		item.Maktx = item.Maktx;
			// 		item.Meins = item.UoM;
			// 		item.Peinh = item.Peinh;
			// 		item.Lifnr_nam = item.NameGp;
			// 		// item.Matkl = item.Matkl;
			// 		// item.ProductPicUrl = item.ProductPicUrl;
			// 		sCart.push(item);
			// 	});
			// 	oCartModel.setData(sCart);
			// 	this.getView().setModel(oCartModel, "PrList");
			// 	this.getView().byId("text").setText("总共" + sCart.length + "个项目");
			// 	this.calculateTotal(sCart);
			// }
// }
		},
		onEditPress: function(oEvent) {
		
			// var sObject = this.getView().getModel("PrList").getData();
			var sObject = oEvent.getSource().getParent().getBindingContext("PrList").getObject();
			sItem.push(sObject);

			this.onItemDisData(sItem, sObject);
			
			if(sObject.ProductId.length <= 0){
				this.getOwnerComponent().getRouter().navTo("requireEdit", {
					ProductId: sObject.Maktx
				});	
			}else{
				this.getOwnerComponent().getRouter().navTo("requireEdit", {
					ProductId: sObject.ProductId
				});
			}

		},
		onItemDisData: function(sItem, sObject) {
			if (sap.ui.getCore().requireDetailEdit) {
				for (var i = 0; i < sap.ui.getCore().requireDetailEdit.length; i++) {
					if (sObject.Posnr === sap.ui.getCore().requireDetailEdit[i].Posnr) {
						for (var s = 0; s < sItem.length; s++) {
							for (var t = s + 1; t < sItem.length; t++) {
								if (sItem[s].Posnr === sItem[t].Posnr) {
									sItem.splice(i, 1);
								}
							}
						}
						sItem.forEach(function(item, index, arr) {
							if (item.Posnr === sap.ui.getCore().requireDetailEdit[i].Posnr) {
								sItem[index]["DelivDate"] = sap.ui.getCore().requireDetailEdit[i].DelivDate;
								sItem[index]["Ekorg"] = sap.ui.getCore().requireDetailEdit[i].Ekorg;
								sItem[index]["Matkl"] = sap.ui.getCore().requireDetailEdit[i].Matkl;
								sItem[index]["Note"] = sap.ui.getCore().requireDetailEdit[i].Note;
								sItem[index]["Werks"] = sap.ui.getCore().requireDetailEdit[i].Werks;
								sItem[index]["Ekgrp"] = sap.ui.getCore().requireDetailEdit[i].Ekgrp;
								sItem[index]["Knttp"] = sap.ui.getCore().requireDetailEdit[i].Knttp;
								sItem[index]["Asset"] = sap.ui.getCore().requireDetailEdit[i].Asset;
								sItem[index]["Hkont"] = sap.ui.getCore().requireDetailEdit[i].Hkont;
								sItem[index]["Kostl"] = sap.ui.getCore().requireDetailEdit[i].Kostl;
								sItem[index]["wbs"] = sap.ui.getCore().requireDetailEdit[i].wbs;
								sItem[index]["Lgort"] = sap.ui.getCore().requireDetailEdit[i].Lgort;
								sap.ui.getCore().edititem = item;
							}
						});
					} else {
						sap.ui.getCore().edititem = sObject;
					}
				}

			} else {
				sap.ui.getCore().edititem = sObject;
			}
		},
		calculateTotal: function(oCart) {

			var oAmount = 0,
				oCurrency;
			if (oCart.length > 0) {
				for (var i = 0; i < oCart.length; i++) {
					oAmount = oAmount + oCart[i].Price * oCart[i].Quantity;
					oCurrency = oCart[i].CurrencyCode;
				}
				this.getView().byId("sum").setText(oAmount + oCurrency);
			} else {
				this.getView().byId("sum").setText(oAmount);
			}

		},
		onChange: function(oEvent) {
			var data = oEvent.getSource().getParent().getBindingContext("PrList").getObject();
			data.Dmbtr = data.Quantity * data.Price;
			var cart = this.getView().getModel("PrList").getData();
			this.calculateTotal(cart);
			sap.ui.getCore().cartmodel = this.getView().getModel("PrList");
		},
		onAfterRendering: function() {

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
					sap.ui.getCore().cartmodel.setData([]);
					that.getModel().refresh();
				},
				error: function(oError) {
					MessageToast.show("删除失败");
				}
			});

		},

		onMultipleDelete: function(oEvent) {
			
			var that = this;
			var oCartNo = this.getView().byId("ObjectId").getText();
			
			var index = this.byId("PrTable").getSelectedIndices();

			if (index.length === 0) {
				MessageToast.show("请至少选择一行进行删除");
				return;
			}
			
			if(oCartNo !== undefined && oCartNo !== ""){
				this.getModel().callFunction("/DeleteCartItemData", {
					"method": "POST",
					urlParameters: {
						"ObjectId": oCartNo,
						"Posnr": index
					}, // function import parameters	
					success: function(oData, response) {
					
					    var oItem = sap.ui.getCore().cartmodel.getData();

						if(index.length === oItem.length){
							oItem.splice(0,oItem.length);
						}else{
							for (var j = 0; j < index.length; j++) {
							 oItem.splice(index[j],1);
							}				
						}
						oCartModel.setData(oItem);
						sap.ui.getCore().cartmodel = this.getView().getModel("PrList");
						that.getModel().refresh();
						MessageToast.show("行项目删除成功");
					},
					error: function(oError) {
						MessageToast.show("行项目删除失败");
					}
				});
				}else{
					MessageToast.show("请先保存数据");
				}
		},
		onSubmit: function(oEvent) {

			// this.onSave();
			var oCartNo = this.getView().byId("ObjectId").getText();
			var that = this;
			if(oCartNo !== undefined){
				this.getModel().callFunction("/SubmitCartData", {
					"method": "POST",
					urlParameters: {
						"ObjectId": oCartNo
					}, // function import parameters	
					success: function(oData, response) {
						MessageToast.show("提交OA成功");
						that.getModel().refresh();
					},
					error: function(oError) {
						var error = JSON.parse(oError.responseText);
					    var msg = error.error.message.value;
						MessageToast.show("提交失败,消息:"&& msg);
					}
				});
			}else{
				MessageToast.show("请先保存");
			}

		},
		onContinue: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("catalogSearchDetails", {});
		},
		onBatchUpdate: function(oEvent) {
			
			var index = this.byId("PrTable").getSelectedIndices();

			if (index.length === 0) {
				MessageToast.show("请至少选择一行进行批量修改");
				return;
			}else{
				this.getOwnerComponent().getRouter().navTo("BatchEdit", {});
			}

		},
		onItemPress: function(oEvent) {
			var sObject = oEvent.getSource().getBindingContext("PrList").getObject();
			sDisItem.push(sObject);
			this.onItemDisData(sDisItem, sObject);
			this.getOwnerComponent().getRouter().navTo("requireDetail", {
				ProductId: sObject.ProductId
			});

		},
		onSave: function(oEvent) {
			 
			var validator = new Validator( );
			var oChkContrl = this.byId("ObjectPageLayout");
			if ( validator.validate(oChkContrl)) {

			var sHead = this.getView().getModel("RequireHead").getData();
			// var ItemDetial = this.getView().getModel("RequireDetailEdit").getData();
			var ItemData = [];

			if (this.getView().getModel("PrList") !== undefined) {
				
			var aData = sap.ui.getCore().cartmodel.getData();
			var oItem = this.getView().getModel("PrList").getData();
			var oItemDetial = sap.ui.getCore().requireDetailEdit;
			
			if(aData === undefined && oItemDetial === undefined){
				MessageToast.show("请先编辑明细数据");
				return;
			}else if(oItemDetial !== undefined){
				for (var i = 0; i < oItem.length; i++) {
					var sKnValue;
					var sKnttp = oItemDetial[i].Knttp;
					if (sKnttp === "A") {
						sKnValue = oItemDetial[i].Asset;
					} else if (sKnttp === "K") {
						sKnValue = oItemDetial[i].Kostl;
					} else if (sKnttp === "P") {
						sKnValue = oItemDetial[i].wbs;
					}
					
					 
					var item = {
						Posnr: oItem[i].Posnr.toString(),
						ProductId: oItem[i].Matnr,
						Description: oItem[i].Maktx,
						Menge: oItem[i].Quantity.toString(),
						Meins: oItem[i].Meins,
						Netpr: oItem[i].Price,
						Lifnr: oItem[i].Lifnr,
						LifnrNam: oItem[i].NameGp,
						Value: oItem[i].Dmbtr.toString(),
						Waers: oItem[i].CurrencyCode,
						CategoryId: oItem[i].CategoryId,
						CategoryTxt: oItem[i].Category,
						Matkl: oItem[i].Matkl,
						Hkont: oItemDetial[0].Hkont,
					    DelivDate: oItemDetial[0].DelivDate,	
						Ekgrp: oItemDetial[0].Ekgrp,	
						Werks: oItemDetial[0].Werks,	
						Note: oItemDetial[0].Note,	
						Knttp: oItemDetial[0].Knttp,	
						Lgort: oItemDetial[0].Lgort,	
						KnValue: sKnValue,
						Mwskz:  oItem[i].Mwskz,
						Peinh:  oItem[i].Peinh.toString(),
						Ekorg: sHead.Ekorg,
						Bukrs: sHead.Bukrs
					};
			
	
					ItemData.push(item);
				}
			}else if(aData !== undefined){
				for (var i = 0; i < aData.length; i++) {
					if(aData[i].DelivDate === undefined || aData[i].Werks === undefined){
						MessageToast.show("请先输入必输项");
						return;
					}
					var sKnValue;
					var sKnttp = aData[i].Knttp;
					if (sKnttp === "A") {
						sKnValue = aData[i].Asset;
					} else if (sKnttp === "K") {
						if(aData[i].Kostl === undefined ){
							MessageToast.show("请先输入必输项");
							return;
						}
						sKnValue = aData[i].Kostl;
					} 
					
					var item = {
						Posnr: aData[i].Posnr.toString(),
						ProductId: aData[i].Matnr,
						Description: aData[i].Maktx,
						Menge: aData[i].Quantity.toString(),
						Meins: aData[i].Meins,
						Netpr: aData[i].Price,
						Lifnr: aData[i].Lifnr,
						LifnrNam: aData[i].NameGp,
						Value: aData[i].Dmbtr.toString(),
						Waers: aData[i].CurrencyCode,
						CategoryId: aData[i].CategoryId,
						CategoryTxt: aData[i].Category,
						Matkl: aData[i].Matkl,
						Hkont: aData[i].Hkont,
					    DelivDate: aData[i].DelivDate,	
						Ekgrp: aData[i].Ekgrp,	
						Werks: aData[i].Werks,	
						Note: aData[i].Note,	
						Knttp: aData[i].Knttp,	
						Lgort: aData[i].Lgort,	
						KnValue: sKnValue,
						Mwskz:  aData[i].Mwskz,
						Peinh:  aData[i].Peinh.toString(),
						Ekorg: sHead.Ekorg,
						Bukrs: sHead.Bukrs
					};
			
	
					ItemData.push(item);
				}			
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
				Bsart: sHead.Bsart,
				CartItemSet: ItemData
			};
			var that = this;
			var Objectid =  this.getView().byId("ObjectId").getText();
			if(Objectid === ""){
				var msg = "创建成功";
			}
			else{
				var msg = "更新成功";
			}
			
			this.getModel().create("/CartSet", sData, {
				async: false,
				success: function(oData, response) {

					that.getView().byId("ObjectId").setText(oData.ObjectId);
					that.getView().byId("Ernam").setText(oData.Ernam);
					MessageToast.show("PR号" + oData.ObjectId + msg);
				},
				error: function(oError) {
					
				     var error = JSON.parse(oError.responseText);
				     var msg = error.error.message.value;
					MessageToast.show("PR号创建失败,消息:"&&msg);
				}
			});
		}
			}
		},
		onRequestNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			// if (sPreviousHash !== undefined) {
			// 	// The history contains a previous entry
			// 	history.go(-1);
			// } else {
			// 	// Otherwise we go backwards with a forward history
			// 	var bReplace = true;
			// 	this.getRouter().navTo("Home", {}, bReplace);
			// }
			

			var sObject = new JSONModel([]);
			var sPreviousHash = History.getInstance().getPreviousHash();
			var requireDetailEdit = sap.ui.getCore().requireDetailEdit;

			var that = this;
			var sHead = this.getView().getModel("RequireHead").getData();
			//清理缓存
			if(sHead.ObjectId !== undefined){
				sap.ui.getCore().cartmodel.setData([]); //清理购物车
				if( requireDetailEdit !== undefined){
					for(var i = 0;i<requireDetailEdit.length;i++){
						requireDetailEdit[i].Werks = "";
						requireDetailEdit[i].Lgort = "";
						requireDetailEdit[i].Kostl = "";
						requireDetailEdit[i].Hoknt = "";
						requireDetailEdit[i].Note = "";
						sap.ui.getCore().requireDetailEdit = requireDetailEdit;
					}				
				}

				var data = {
					Bukrs : sHead.Bukrs,
					Ekorg : sHead.Ekorg 
				};
				sObject.setData(data);
				this.getView().setModel(sObject, "RequireHead");
				this.getView().setModel(sObject, "PrList");
				this.getView().setModel(sObject, "BatchEdit");

			}
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("Home", {}, bReplace);
			}
		
		}

	});
});