sap.ui.define([
	"ZEC_CART_CREATE/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("ZEC_CART_CREATE.controller.App", {
	onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oODataModel.setDeferredGroups(["batch"]);
			// disable busy indication when the metadata is loaded and in case of errors
			this._oODataModel.metadataLoaded().then(fnSetAppNotBusy);
			this._oODataModel.attachMetadataFailed(fnSetAppNotBusy);
			// apply content density mode to root view
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
		}
	});
});