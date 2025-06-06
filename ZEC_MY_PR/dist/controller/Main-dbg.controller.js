sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ZEC_MY_REQUIREMENTS.controller.Main", {
		handleLinkPress: function(oEvent) {

			var cartid = oEvent.getSource().getText();

			sap.ui.getCore().cartmodel = undefined;

			// this.getOwnerComponent().getRouter().navTo("Myhome", {
			// 	ObjectId: cartid
			// });
			this.getOwnerComponent().getRouter().navTo("requirementsPo", {
				ObjectId: cartid
			});
		}
	});
});