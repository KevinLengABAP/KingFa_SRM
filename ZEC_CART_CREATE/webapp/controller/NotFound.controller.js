sap.ui.define([
		"ZEC_CART_CREATE/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZEC_CART_CREATE.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("ywlx");
			}

		});

	}
);