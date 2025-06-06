sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, MessageToast, MessageBox, ODataModel, JSONModel) {
	"use strict";

	return Controller.extend("ZEC_MY_REQUIREMENTS.controller.BaseController", {

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		convPathToOrder: function(idx) {
			return idx.substring(idx.lastIndexOf("\/") + 1);
		},
		confirmNavBack: function(oCurrent, oOriginal) {
			if (JSON.stringify(oCurrent) !== JSON.stringify(oOriginal)) {
				MessageBox.show("数据已经变更，确定要退出吗？", {
					icon: MessageBox.Icon.WARNING,
					title: "退出确认",
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.OK) {
							this.onNavBack();
						}
					}.bind(this)
				});
			} else {
				this.onNavBack();
			}
		},
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("main", {}, bReplace);
			}
		},

		// Setter and getter Global variables
		getGlobalVar: function(sProperty) {
			var _Gvar;
			if (this.getOwnerComponent()) {
				_Gvar = this.getOwnerComponent().getModel("globalVar");
				return _Gvar.getProperty("/" + sProperty);
			} else {
				return this.getParentView(this.getView()).getController().getGlobalVar(sProperty);
				// getOwnerComponent().getModel("globalVar");
			}

		},
		setGlobalVar: function(sProperty, sValue) {
			var _Gvar;
			if (this.getOwnerComponent()) {
				_Gvar = this.getOwnerComponent().getModel("globalVar");
				return _Gvar.setProperty("/" + sProperty, sValue);
			} else {
				return this.getParentView(this.getView()).getController().setGlobalVar(sProperty, sValue);
				// getOwnerComponent().getModel("globalVar");
			}

		},
		handleComboChange: function(oControlEvent) {
			var oCombo = oControlEvent.getSource();
			var sMessage = oControlEvent.getSource().data("message");
			oCombo.setValueState("None");
			if (!oCombo.getSelectedKey() && oControlEvent.getParameters().value) {
				if (oCombo.getRequired) {
					oCombo.setValueState("Error");
					if (sMessage) {
						oCombo.setValueStateText(sMessage);
					}
				} else {
					oCombo.setValueState("Warning");
				}
			}
		},
		onMessagePopover: function(oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		onClearMessage: function() {
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		_getMessagePopover: function() {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				// create popover lazily (singleton)
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "ZEC_MY_REQUIREMENTS.view.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},
		showErrorMessage: function(oError) {
			if (oError.responseText) {
				if (oError.headers["Content-Type"].indexOf("application/json") > -1) {
					sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
				} else {
					var parser = new DOMParser();
					var xmldoc = parser.parseFromString(oError.responseText, "text/xml");
					var names = xmldoc.getElementsByTagName("message");
					// console.log(names);
					var arr = [];
					for (var i = 0; i < names.length; i++) {
						arr[arr.length] = names[i].innerHTML;
					}
					sap.m.MessageToast.show(arr);
				}
			}
		},
		getParentView: function(oElem) {
			var b = oElem;
			while (b && b.getParent) {
				b = b.getParent();
				if (b instanceof sap.ui.core.mvc.View) {
					// console.log(b.getMetadata()); //you have found the view
					return b;
					// break;
				}
			}
		},
		compareDate: function(date1, date2) {
			var result = false;
			if (date1.getFullYear() > date2.getFullYear()) {
				result = true;
			} else if (date1.getFullYear() == date2.getFullYear()) {
				if (date1.getMonth() > date2.getMonth()) {
					result = true;
				} else if (date1.getMonth() == date2.getMonth()) {
					if (date1.getDate() > date2.getDate()) {
						result = true;
					}
				}
			}
			return result;
		},
		convPicUrl: function(oData) {
			var Url;
			var Path = window.location.origin;
			if (Path.indexOf("localhost") !== -1) {
				Path = "http:///srmdevapp.kingfa.com.cn:8800";
			}
			if (oData.ProductId) {
				Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='',Lifnr='" + oData.Lifnr + "',Matnr='" +
					oData.ProductId + "',ZimageDesc='1')/$value";
			} else {
				Url = Path + "/sap/opu/odata/SAP/ZPO_ZCATELOG_MAINTAIN_SRV/ZCATELOG_IMAGESet(ZcatelogId='" + oData.CatalogGuid +
					"',Lifnr='',Matnr='',ZimageDesc='1')/$value";
			}
			return Url;
		}

	});
});