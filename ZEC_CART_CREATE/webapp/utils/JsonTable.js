sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel"
], function(Object, Filter, FilterOperator, ODataModel, JSONModel) {
	"use strict";
	// var oJsonModel = new JSONModel();
	var sContextPath = "contextPath";
	// var sEntitySet ;
	return Object.extend("ZEC_CART_CREATE.utils.JsonTable", {

		constructor: function(sEntitySet, oModel) {
			//= sap.ui.getCore().getOwnComponent().getModel() 
			// if(oModel)
			// {
			this.oDataModel = oModel;
			// }
			// else{
			// 	this.oDataModel = sap.ui.getCore().getOwnComponent().getModel("shComm");
			// }
			this.sEntitySet = sEntitySet;

			var oSchema = this.oDataModel.getServiceMetadata().dataServices.schema[0];

			var oEntitySet = oSchema.entityContainer[0].entitySet.find(function(x) {
				return x.name === sEntitySet;
			});
			var iBegin = oEntitySet.entityType.lastIndexOf(".") + 1;

			var oEntity = oSchema.entityType.find(function(x) {
				return x.name === oEntitySet.entityType.substring(iBegin);
			});
			this.aProperties = oEntity.property;

			this.aKeys = oEntity.key.propertyRef;

			var aDel = [];
			this.oDelModel = new JSONModel();
			this.oDelModel.setData(aDel);
			var aJson = [];
			this.oJsonModel = new JSONModel();
			this.oJsonModel.setData(aJson);
		},
		getJsonModel: function() {
			return this.oJsonModel;
		},
		setJsonModel: function(oModel) {
			// clear cache
			oModel.setData([]);
			this.oJsonModel = oModel;
			this.oJsonModel.setSizeLimit(1000);
		},

		setDefaultRow: function(oRow) {
			this.oDefaultRow = {};
			if (oRow) {
				this.oDefaultRow = {};
				$.extend(this.oDefaultRow, oRow);
				// this.oDefaultRow = JSON.parse(JSON.stringify(oRow));
				for (var j = 0; j < this.aProperties.length; j++) {
if (this.oDefaultRow[this.aProperties[j].name] === undefined) {
						this.oDefaultRow[this.aProperties[j].name] = undefined;
					}

				}
			}
		},
		getDefaultRow: function() {
			return this.oDefaultRow;
		},
		read: function(sPath, mParameters) {
			// var that = this;
			var oRequest, mUrlParams, fnSuccess, fnError,
				aFilters, 
				that = this;
			
			var aSorters, sFilterParams, sSorterParams,
				oFilter, oEntityType, sNormalizedPath,
				aUrlParams, mHeaders, sMethod,
				sGroupId, sETag,
				mRequests;
			// The object parameter syntax has been used.
			if (mParameters) {
				mUrlParams = mParameters.urlParameters;
				fnSuccess = mParameters.success;
				fnError = mParameters.error;
				aFilters = mParameters.filters;
				aSorters = mParameters.sorters;
				sGroupId = mParameters.groupId || mParameters.batchGroupId;
				mHeaders = mParameters.headers;
			}
			var sUrl = this.oDataModel.sServiceUrl;

			this.oDataModel.read(sPath, {

				filters: aFilters,
				success: function(oData, response) {

					var arr = [],
						aData = [];
					arr = oData.results;
					for (var i = 0; i < arr.length; i++) {
						var data = {};
						for (var j = 0; j < that.aProperties.length; j++) {
							data[that.aProperties[j].name] = arr[i][that.aProperties[j].name];
						}
						var iBegin = arr[i].__metadata.id.lastIndexOf(sUrl) + sUrl.length;
						var oContext = {
							bCreated: false,
							sPath: arr[i].__metadata.id.substring(iBegin)
						};
						data[sContextPath] = oContext;
						aData.push(data);
					}
					that.getJsonModel().setData(aData);
					// that.getView().setModel(glbzModel, "GlbzList");
					if (fnSuccess) {
						var oNewData = {};
						oNewData.results = aData;
						fnSuccess(oNewData, response);
					}

				},
				error: function(oError) {
						if (fnError) {
							fnError(oError);
						}

					}
					// fnError
			});
		},
		addRow: function(iIndex) {
			if (!this.oDefaultRow) {
				this.oDefaultRow = {};
				for (var j = 0; j < this.aProperties.length; j++) {
						this.oDefaultRow[this.aProperties[j].name] = undefined;
				}
			}
			var oNew = {};
			$.extend(oNew, this.oDefaultRow);
			// //Copy Undefined properties
			// for (var i = 0; i < this.aProperties.length; i++) {
			// 	oNew[this.aProperties[i].name] = this.oDefaultRow[this.aProperties[i].name];
			// }
			// var oNew = JSON.parse(JSON.stringify(this.oDefaultRow));
			// var oRow = this.oDefaultRow.clone();
			var aJson = this.oJsonModel.getData();
			if (aJson.constructor != Array) {
				aJson = [];
			}
			if (iIndex) {
				aJson.splice(iIndex, 0, oNew);
			} else {
				aJson.push(oNew);
			}
			this.oJsonModel.setData(aJson);
		},
		copyRows: function(aIndices) {
			var aJson = this.oJsonModel.getData();
			for (var j = aIndices.length - 1; j >= 0; j--) {
				var iIndex = aIndices[j];
				// var oNew = JSON.parse(JSON.stringify(aJson[iIndex]));
				var oNew = {};
				$.extend(oNew, aJson[iIndex]);
				// //Copy Undefined properties
				// for (var i = 0; i < this.aProperties.length; i++) {
				// 	oNew[this.aProperties[i].name] = aJson[iIndex][this.aProperties[i].name];
				// }
				if (oNew[sContextPath]) {
					oNew[sContextPath] = undefined;
				}
				aJson.splice(iIndex, 0, oNew);
			}

			this.oJsonModel.setData(aJson);
		},
		removeRows: function(aIndices) {
			// if (aIndices.length > 1) {
			var oJsonModel = this.getJsonModel();
			for (var j = aIndices.length - 1; j >= 0; j--) {
				var iIndex = aIndices[j];
				var oItem = oJsonModel.getData()[iIndex];
				var oContext = oItem[sContextPath];
				if (oContext) {
					if (oContext.bCreated) {
						this.oDataModel.deleteCreatedEntry(oContext);
						// oJsonModel.getData().splice(iIndex, 1);
					} else {
						var oDel = {};
						for (var i = 0; i < this.aKeys.length; i++) {
							oDel[this.aKeys[i].name] = oItem[this.aKeys[i].name];
						}

						var oDelContext = {
							sPath: oContext.sPath
						};
						oDel[sContextPath] = oDelContext;

						var oDelData = this.oDelModel.getData();
						//去重
						for (var k in oDelData) {
							if (oDel === oDelData[k]) {
								oDelData.splice(k, 1);
							}
						}
						oDelData.push(oDel);
						// this.oDataModel.remove(oContext.sPath, {
						// 	success: function(oData, response) {
						// 		oJsonModel.getData().splice(iIndex, 1);
						// 		sap.m.MessageToast.show("删除成功");
						// 	},
						// 	error: function(oError) {
						// 		sap.m.MessageToast.show("删除失败");
						// 	},
						// 	// groupId: "batch"
						// });
						// this.oDataModel.setRefreshAfterChange(false);
						// }
					}
					// else {

				}
				oJsonModel.getData().splice(iIndex, 1);
			}
			// oJsonModel.getData().push(this.oDefaultRow);
			// }
			// else
			// {

			// }
		},
		compareKey: function(oDel, oData) {
			for (var i = 0; i < this.aKeys.length; i++) {
				if (oDel[this.aKeys[i].name] !== oData[this.aKeys[i].name]) {
					return false;
				}
			}
			return true;
		},
		exchangePath: function(oDel, oData) {
			var sPath = sContextPath;
			if (oDel[sPath]) {
				var oContext = oDel[sPath];
				oDel[sPath] = oData[sPath];
				oData[sPath] = oContext;
				if (oDel[sPath]) {
					var oItem = this.oDataModel.getOriginalProperty(oDel[sPath].sPath);
					if (oItem !== undefined) {
						for (var i = 0; i < this.aKeys.length; i++) {
							oDel[this.aKeys[i].name] = oItem[this.aKeys[i].name];
						}
					}

				}
			}
		},
		saveData: function() {
			// var that = this;
			// that.sEntry = sEntry;
			// var sEntityType = this.oDataModel.getServiceMetadata().dataServices.schema[0].entityType;
			// var oEntity = sEntityType.filter(function(p) {
			// 	return p.name === that.sEntry;
			// });
			var oData = this.getJsonModel().getData();
			var sPath = sContextPath;
			var sEntrySet = "/" + this.sEntitySet;
			var oDelData = this.oDelModel.getData();
			if (oDelData.length) {
				for (var i in oDelData) {
					for (var j in oData) {
						if (oDelData[i][sPath] && this.compareKey(oDelData[i], oData[j])) {
							this.exchangePath(oDelData[i], oData[j]);
						}
					}
				}
				for (var k = oDelData.length - 1; k >= 0; k--) {
					if (oDelData[k][sPath]) {
						if (oDelData[k][sPath].bCreated) {
							this.oDataModel.deleteCreatedEntry(oDelData[k][sPath]);
						} else {
							this.oDataModel.remove(oDelData[k][sPath].sPath, {
								// success: function(oData, response) {
								// 	// sap.m.MessageToast.show("删除成功");
								// },
								// error: function(oError) {
								// 	// sap.m.MessageToast.show("删除失败");
								// },
								groupId: "batch"
							});
							this.oDataModel.bDelete = true;
						}
					}
					//从待删除表中去掉删除的记录
					oDelData.splice(k, 1);
				}
			}

			for (var i = 0; i < oData.length; i++) {
				if (!oData[i][sPath]) {
					var oRow = {};
					for (var j = 0; j < this.aProperties.length; j++) {
							oRow[this.aProperties[j].name] = oData[i][this.aProperties[j].name];
					}
					var oContext = this.oDataModel.createEntry(sEntrySet, {
						properties: oRow,
						success: function(oData, response) {
							var sUrl = this.oDataModel.sServiceUrl;
							var iBegin = oData.__metadata.id.lastIndexOf(sUrl) + sUrl.length;
							var sPath = oData.__metadata.id.substring(iBegin);
							var aData = this.getJsonModel().getData();
							var oItem = aData.find(function(x) {
								if (x[sContextPath]) {
									return x[sContextPath].sPath === sPath;
								}
							}.bind(this));
							for (var i = 0; i < this.aProperties.length; i++) {
								oItem[this.aProperties[i].name] = oData[this.aProperties[i].name];
							}
						}.bind(this),
						groupId: "batch",
						refreshAfterChange: true
					});
					oData[i][sPath] = oContext;
				} else {

					var oContextPath = oData[i][sPath];

					if (this.aProperties) {
						for (var j = 0; j < this.aProperties.length; j++) {
							// data[this.aProperties[j].name] = arr[i][this.aProperties[j].name];
							this.oDataModel.setProperty(oContextPath.sPath + "/" + this.aProperties[j].name, oData[i][this.aProperties[j].name]);

						}
					}
				}
			}

		}

	});
});