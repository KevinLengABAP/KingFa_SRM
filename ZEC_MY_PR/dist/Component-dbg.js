sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZEC_MY_REQUIREMENTS/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZEC_MY_REQUIREMENTS.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set message model
			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// 初始化 路由
			this.getRouter().initialize();
		}
	});
});