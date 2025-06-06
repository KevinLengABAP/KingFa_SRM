sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, MessageToast, Filter, FilterOperator, Fragment, History) {
	"use strict";
	var oProductsModel = new JSONModel();
	var searchall;
	return BaseController.extend("ZEC_CART_CREATE.controller.CatalogSearchDetails", {
		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("catalogSearchDetails").attachPatternMatched(this._onRouteMatched, this);

			// this.getView().byId("Table").attachItemPress(this.handleItemPress, this);

			this.getView().setModel(oProductsModel, "products");

		},
		// current value or min/max values change handler
		currentChangeHandler: function() {

			var sValue = 0,
				sTabix = 0;
			var oCartModel = this.getView().getModel("ShopCart");
			if (oCartModel) {
				var oCart = oCartModel.getData();
				if (oCart) {
					var oButtonBadgeCustomData = this.byId("cartButton").getBadgeCustomData();
					oCart.forEach(function(item, index, arr) {
						sTabix = sTabix + 1;
						sValue = sTabix;
					});

					if (!oButtonBadgeCustomData) {
						return;
					}
					oButtonBadgeCustomData.setValue(sValue.toString());
				}
			}

		},
		_onRouteMatched: function(oEvent) {

			this.byId("Table").removeSelections();

			this.getFilterData(oEvent);

		},
		getFilterData: function(oEvent) {

			var aCategory, aCategorydesc, aLifnr, aManufacturer, aSearchField, aFilters = [];
			var arr1, arr2, arr3, arr4, arr5;
			var aTitle;
			if (oEvent.getParameter("arguments")["?query"]) {

				aCategory = oEvent.getParameter("arguments")["?query"].Category;
				aCategorydesc = decodeURIComponent(oEvent.getParameter("arguments")["?query"].Categorydesc);
				aLifnr = oEvent.getParameter("arguments")["?query"].Lifnr;
				aManufacturer = oEvent.getParameter("arguments")["?query"].Manufacturer;
				aSearchField = oEvent.getParameter("arguments")["?query"].SearchField;

				if (aSearchField !== undefined) {
					var sQuery = aSearchField;
					aFilters = [
						new Filter("Matnr", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("ZcommodityDes", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("NameGp", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("Zstatus", sap.ui.model.FilterOperator.EQ, "1"),
						new Filter("Zflag", sap.ui.model.FilterOperator.EQ, true) //判断是否全局搜索
					];
					this.getView().byId("searchDetailsPage").setTitle(arr4);
					searchall = true;
				} else {
					if (aCategory !== "undefined" && aCategory !== undefined) {
						arr1 = aCategory.split(",");
						aTitle = "类别" + "-" + aCategory;
						this.getView().byId("searchDetailsPage").setTitle(aTitle);
						for (var i = 0; i < arr1.length; i++) {
							aFilters.push(new Filter("ZcommodityId", FilterOperator.EQ, arr1[i]));
						}
					}
					if (aCategorydesc !== "undefined" && aCategorydesc !== undefined) {
						arr5 = aCategorydesc.split(",");
						aTitle = "类别名称" + "-" + aCategorydesc;
						this.getView().byId("searchDetailsPage").setTitle(aTitle);
						for (var i = 0; i < arr5.length; i++) {
							aFilters.push(new Filter("ZcommodityDes", FilterOperator.EQ, arr5[i]));
						}
					}
					if (aLifnr !== "undefined" && aLifnr !== undefined) {
						arr2 = aLifnr.split(",");
						aTitle = "供应商" + "-" + aLifnr;
						this.getView().byId("searchDetailsPage").setTitle(aTitle);
						for (var i = 0; i < arr2.length; i++) {
							aFilters.push(new Filter("Lifnr", FilterOperator.EQ, arr2[i]));
						}
					}
					if (aManufacturer !== "undefined" && aManufacturer !== undefined) {
						arr3 = aManufacturer.split(",");
						aTitle = "制造商" + "-" + aManufacturer;
						this.getView().byId("searchDetailsPage").setTitle(aTitle);
						for (var i = 0; i < arr3.length; i++) {
							aFilters.push(new Filter("ZmanuName", FilterOperator.EQ, arr3[i]));
						}
					}
					aFilters.push(new Filter("Zstatus", FilterOperator.EQ, "1"));
					aFilters.push(new Filter("ZdescKey", FilterOperator.EQ, "1")); //As flag for get Products based on purchase org
				}

			}

			this._readCatalogSet(aFilters);

		},

		_readCatalogSet: function(aFilters) {
			this.setGlobalVar("busy", true);
			this.getModel("catalog").read("/ZcatalogSet", {
				filters: aFilters,

				success: function(oData, response) {
					this.setGlobalVar("busy", false);
					var aProducts = [];
					var oProduct;
					var Path = window.location.origin;
					if (Path.indexOf("localhost") !== -1) {
						Path = "http:///srmdevapp.kingfa.com.cn:8800";
					}
					if (oData.results) {

						for (var i = 0; i < oData.results.length; i++) {
							var Peinhval = parseInt(oData.results[i].Peinh, 10);

							if (oData.results[i].Matnr !== undefined && oData.results[i].Matnr !== "") {
								var Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='',Lifnr='" + oData.results[i].Lifnr +
									"',Matnr='" + oData.results[i].Matnr + "',ZimageDesc='1')/$value";
							} else {
								Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='" + oData.results[i].Guid +
									"',Lifnr='',Matnr='',ZimageDesc='1')/$value";
							}

							oProduct = {
								ProductId: oData.results[i].Matnr,
								Description: oData.results[i].Maktx,
								Guid: oData.results[i].Guid,
								Lifnr: oData.results[i].Lifnr,
								LifnrNam: oData.results[i].NameGp,
								CategoryId: oData.results[i].ZcommodityId,
								Matkl: oData.results[i].Matkl,
								CategoryTxt: oData.results[i].ZcommodityDes,
								Meins: oData.results[i].Meins,
								Netpr: oData.results[i].Netpr,
								Waers: oData.results[i].Waers,
								Quantity: 1,
								Peinh: Peinhval,
								Dmbtr: 0,
								ProductPicUrl: Url,
								Ekorg: oData.results[i].Ekorg
							};

							aProducts.push(oProduct);
						}

					}

					// this.getView().getModel("products").setData(aProducts);
					// that.setGlobalVar("busy", false);
					oProductsModel.setData(aProducts);
					// oProductsModel.refresh();
				}.bind(this),
				error: function(oError) {
					this.setGlobalVar("busy", false);
				}.bind(this)
			});

			// var oBinding = this.byId("Table").getBinding("items");
			// oBinding.filter(aFilters, "Application");

		},
		onUpdateFinished: function(oEvent) {

			var aFilter = [];

			// var sQuery = this.getView().byId("search").getValue();

			var currentlyLoadedNumber = oEvent.getParameter("actual");
			this.getView().byId("Title").setText("找到" + currentlyLoadedNumber + "个项目");
			var oContext = this.byId("Table").getBinding("items").getCurrentContexts();
			if (oContext.length > 0) {
				for (var i = 0; i < oContext.length; i++) {
					var oItem = oContext[i].getProperty();
					oItem.Dmbtr = parseFloat(oItem.Quantity * oItem.Netpr / oItem.Peinh).toFixed(2);
					aFilter.push(new Filter("Guid", FilterOperator.EQ, oItem.Guid));

				}
			}
			this.getView().getModel("products").refresh();

			if (searchall === true) {
				// var that = this;
				// var oModel = this.getView().getParent().getParent().getMasterPages()[0].getModel("CatalogList");
				searchall = false;
				this.setGlobalVar("busy", true);
				this.getModel("catalog").read("/Zcatalog_grpSet", {
					filters: aFilter,
					success: function(oData, response) {
						this.setGlobalVar("busy", false);
						this.getParentView(this.getView()).getController().setGrpList(oData);
						// var sData = [];
						// for (var i = 0; i < oData.results.length; i++) {
						// 	var data = {
						// 		"Id": oData.results[i].Id,
						// 		"Name": oData.results[i].Name,
						// 		"GroupType": oData.results[i].GroupType,
						// 		"Count": oData.results[i].Count
						// 	};
						// 	sData.push(data);
						// }
						// var oPoDetialModel = new JSONModel(sData);
						// that.getView().getParent().getParent().getMasterPages()[0].setModel(oPoDetialModel, "CatalogList");

					}.bind(this),
					error: function(oError) {
						this.setGlobalVar("busy", false);
					}.bind(this)
				});

			}

		},
		onAddCart: function(oEvent) {

			var aSelectedItems = this.byId("Table").getSelectedItems();
			var _oResourceBundle = this.getResourceBundle();
			var iLength = aSelectedItems.length;
			if (iLength > 0) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					// aData = aSelectedItems[i].getBindingContext("products").getData();
					// aData = aSelectedItems[i].getBindingContext("products").getObject();
					var aData = {};
					$.extend(aData, aSelectedItems[i].getBindingContext("products").getObject());
					// var Quantity = parseInt(aData.Quantity);
					// var Quantity2 ;
					// var Peinh =	parseInt(aData.Peinh);
					if (aData.Quantity === "0") {
						MessageToast.show("添加商品数量不允许为空");
						return;
					} else {
						var oGuid = new sap.ui.model.odata.type.Guid();
						var sItem = {
							CatalogGuid: oGuid.parseValue(aData.Guid.toLowerCase(), "string"),
							CategoryId: aData.CategoryId,
							CategoryTxt: aData.CategoryTxt,
							ProductId: aData.ProductId,
							Description: aData.Description,
							Value: aData.Dmbtr.toString(),
							Ekorg: aData.Ekorg,
							Lifnr: aData.Lifnr,
							LifnrNam: aData.LifnrNam,
							Matkl: aData.Matkl,
							Meins: aData.Meins,
							Menge: aData.Quantity.toString(),
							Netpr: aData.Netpr,
							Waers: aData.Waers,
							Peinh: aData.Peinh.toString()
						};

						this.getModel().create("/ZCDS_I_CART", sItem, {
							async: false,
							groupId: "batch",
							success: function(oData, response) {
								this.countCart();
								// debugger
								// // that.getView().byId("ObjectId").setText(oData.ObjectId);
								// // that.getView().byId("Ernam").setText(oData.Ernam);
								// MessageToast.show("PR号" + oData.ObjectId);
							}.bind(this),
							error: function(oError) {

								// var error = JSON.parse(oError.responseText);
								// var msg = error.error.message.value;
								// MessageToast.show("PR号创建失败,消息:" && msg);
							}.bind(this)
						});

					}
				}

				this.setGlobalVar("busy", true);
				this.getModel().submitChanges({
					groupId: "batch",
					success: function(oData, response) {
						this.setGlobalVar("busy", false);
						if (oData.__batchResponses[0].__changeResponses) {
							if (iLength === oData.__batchResponses[0].__changeResponses.length) {
								MessageToast.show(_oResourceBundle.getText("mCarCreScuess", iLength));
							}
						} else {
							MessageToast.show(oData.__batchResponses[0].message);
						}
					}.bind(this),
					error: function(oError) {
						this.setGlobalVar("busy", false);
					}.bind(this)
				});

			}
		},
		onChange: function(oEvent) {
			var data = oEvent.getSource().getParent().getBindingContext("products").getObject();
			data.Dmbtr = data.Quantity * data.Netpr / data.Peinh;
		},

		onSearch: function(oEvent) {

			var sQuery = oEvent.getParameter("query");
			// sQuery.replace(//g, "");
			var aFilters1, aFilters2, aFilters3, aFilters4, aFilters5;
			var oFilterGroup1;

			if (sQuery && sQuery.length > 0) {
				aFilters1 = new Filter("ProductId", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters2 = new Filter("Description", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters3 = new Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters4 = new Filter("LifnrNam", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters5 = new Filter("CategoryTxt", sap.ui.model.FilterOperator.Contains, sQuery);
				oFilterGroup1 = new Filter([aFilters1, aFilters2, aFilters3, aFilters4, aFilters5], false);
			}

			var oBinding = this.byId("Table").getBinding("items");
			oBinding.filter(oFilterGroup1, "Application");

		},
		onSearchAll: function(oEvent) {

			var sQuery = oEvent.getParameter("query");
			var aFilters = [];
			searchall = true;
			if (sQuery && sQuery.length > 0) {

				aFilters = [
					new Filter("ProductId", sap.ui.model.FilterOperator.Contains, sQuery),
					new Filter("Description", sap.ui.model.FilterOperator.Contains, sQuery),
					new Filter("CategoryTxt", sap.ui.model.FilterOperator.Contains, sQuery),
					new Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sQuery),
					new Filter("NameGp", sap.ui.model.FilterOperator.Contains, sQuery),
					new Filter("Zstatus", sap.ui.model.FilterOperator.EQ, "1"),
					new Filter("Zflag", sap.ui.model.FilterOperator.EQ, true) //判断是否全局搜索
				];

			} else {

				aFilters = [
					new Filter("Zstatus", sap.ui.model.FilterOperator.EQ, "1")
				];
				// aFilters = aFilters_gb;
			}

			this._readCatalogSet(aFilters);

		}

	});
});