sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	var oProductsModel = new JSONModel();
	return BaseController.extend("ZEC_CART_CREATE.controller.CatalogDetailPages", {
		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("catalog").attachPatternMatched(this._onRouteMatched, this);
			// var iPagesCount = 1;
			// if (Device.system.desktop) {
			// 	iPagesCount = 3;
			// } else if (Device.system.tablet) {
			// 	iPagesCount = 2;
			// }
			// var oSettingsModel = new JSONModel({
			// 	pagesCount: iPagesCount
			// });
			// // oProductsModel.setSizeLimit(6);

			// this.getView().setModel(oSettingsModel, "settings");
			this.getView().setModel(oProductsModel, "products");
		},
		_onRouteMatched: function(oEvent) {

			this.getModel("catalog").read("/ZcatalogSet", {
				success: function(oData, response) {
					var aProducts = [];
					var oProduct;
					var Path = window.location.origin;
					if (Path.indexOf("localhost") !== -1) {
						Path = "http:///srmdevapp.kingfa.com.cn:8800";
					}
					if (oData.results) {

						for (var i in oData.results) {

							// var Url = "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='1',Lifnr='" + oData.results[i].Lifnr + "',Matnr='" + oData.results[i].Matnr +
							// 		"'')/$value";

							if (oData.results[i].Matnr !== undefined && oData.results[i].Matnr !== "") {
								var Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='',Lifnr='" + oData.results[i].Lifnr +
									"',Matnr='" + oData.results[i].Matnr +
									"',ZimageDesc='1')/$value";
							} else {
								Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='" + oData.results[i].Guid +
									"',Lifnr='',Matnr='',ZimageDesc='1')/$value";
							}
							oProduct = {
								ProductId: oData.results[i].Matnr,
								Description: oData.results[i].Maktx,
								SupplierName: oData.results[i].NameGp,
								Category: oData.results[i].ZcommodityDes,
								Meins: oData.results[i].Meins,
								Netpr: oData.results[i].Netpr,
								Waers: oData.results[i].Waers,
								DeliveryDay: oData.results[i].DeliveryDay,
								Peinh: oData.results[i].Peinh,
								Quantity: 0,
								Dmbtr: 0,
								ProductPicUrl: Url

							};
							aProducts.push(oProduct);
						}

					}
					oProductsModel.setData(aProducts);

					// that.setGlobalVar("busy", false);

				},
				error: function(oError) {
					// that.setGlobalVar("busy", false);
				}
			});
			// var aCategory, aLifnr, aManufacturer;
			// aCategory = oEvent.getParameter("arguments").aCategory;
			// aLifnr = oEvent.getParameter("arguments").aLifnr;
			// aManufacturer = oEvent.getParameter("arguments").aManufacturer;

		}

	});

});