sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/m/Input",
	"sap/m/SearchField"
], function(Object, ValueHelpDialog, Filter, FilterOperator, ODataModel, JSONModel, FilterBar, FilterGroupItem,
	Input, SearchField) {
	"use strict";

	return Object.extend("ZEC_CART_CREATE.utils.ValueHelpHelper", {

		onInit: function() {

		},

		constructor: function(model) {
			this.model = model;
		},
		initFilters: function(aFilters) {
			this._aInitFilters = aFilters;
		},
		excludeFilters: function(aFields) {
			this._aFilterFields = aFields;
		},
		excludeColumns: function(aFields) {
			this._aColumnsFields = aFields;
		},
		setModel: function(sBinding, sKey) {
			var oSchema = this.model.getServiceMetadata().dataServices.schema[0];

			var oEntitySet = oSchema.entityContainer[0].entitySet.find(function(x) {
				return x.name === sBinding;
			});
			var iBegin = oEntitySet.entityType.lastIndexOf(".") + 1;

			var oEntity = oSchema.entityType.find(function(x) {
				return x.name === oEntitySet.entityType.substring(iBegin);
			});

			this.oColModel = {
				cols: []
			};

			this.aFilterGroup = [];
			var i;

			for (i = 0; i < oEntity.property.length; i++) {
				
				if (this._aColumnsFields) {
					if (this._aColumnsFields.indexOf(oEntity.property[i].name) >= 0) {
						continue;
					}
				}				
				
				var oLabel = oEntity.property[i].extensions.find(function(x) {
					return x.name === "label";
				});
				var col = {
					label: oLabel.value,
					template: oEntity.property[i].name
				};
				if(oEntity.property[i].type === "Edm.DateTime"){
					col.type="date";
					col.oType= new sap.ui.model.odata.type.Date();
				}
				this.oColModel.cols.push(col);

				if (sKey === oEntity.property[i].name) {
					this.sTitle = oLabel.value;
				}

				if (this._aFilterFields) {
					if (this._aFilterFields.indexOf(oEntity.property[i].name) >= 0) {
						continue;
					}
				}
				this.aFilterGroup.push(new FilterGroupItem({
					groupTitle: "More Fields",
					groupName: "gn1",
					name: oEntity.property[i].name,
					label: oLabel.value,
					control: new Input(oEntity.property[i].name),
					visibleInFilterBar: true
				}));
			}

		},
		openValueHelp: function(binding, sKey, sKeyDes, onOk) {

			var that = this;

			this.binding = "/" + binding; // table model

			this.col = {}; // culomn
			this.setModel(binding, sKey);

			var oValueHelpDialog = new ValueHelpDialog({

				// basicSearchText: "search",
				title: this.sTitle || "Search",
				supportMultiselect: false,
				supportRanges: false,
				supportRangesOnly: false,
				key: sKey,
				descriptionKey: sKeyDes || "",
				ok: function(oEvent) {
					var oTaken = oEvent.getParameter("tokens")[0];
					var sReKey = oTaken.getProperty("key");
					var sText = oTaken.getProperty("text");
					// var sPath = oEvent.getSource()._oSelectedItems.getItems()[0];
					// var oItem = oEvent.getSource()._oSelectedItems.items[sPath];
					var oItem = oTaken.data("row");
					oValueHelpDialog.close();
					onOk.call(this, sReKey, sText, oItem);
				},
				cancel: function(oControlEvent) {
					oValueHelpDialog.close();
				},
				afterClose: function() {
					oValueHelpDialog.destroy();
				}

			});

			// bind table
			oValueHelpDialog.getTableAsync().then(function(oTable) {
				oTable.setModel(new JSONModel(that.oColModel), "columns");
				oTable.setModel(that.model);
				var filters = [];
				if (that._aInitFilters) {
					filters = that._aInitFilters;
				}
				if (oTable.bindRows) {
					// oTable.bindRows(that.binding);
					oTable.bindRows({
						path: that.binding,
						filters: filters
					});
				}
				if (oTable.bindItems) {
					oTable.bindAggregation("items", that.binding,
						function(sId, oContext) {
							var aCols = oTable.getModel("columns").getData().cols;

							return new sap.m.ColumnListItem({
								cells: aCols.map(function(column) {
									var colname = column.template;
									return new sap.m.Label({
										text: "{" + colname + "}"
									});
								})
							});
						},
						"", filters
					);
				}
				// });
				// if (oTable instanceof sap.m.Table) {
				// 	oTable.bindItems({
				// 		path: that.binding,
				// 		filters: filters
				// 	});
				// } else {
				// 	oTable.bindRows({
				// 		path: that.binding,
				// 		filters: filters
				// 	});
				// }
			});

			// oValueHelpDialog.setRangeKeyFields(this.aRange);

			var oFilterBar = new FilterBar({
				advancedMode: true,
				filterBarExpanded: true, // Device.system.phone,
				//showGoOnFB: !Device.system.phone,
				filterGroupItems: this.aFilterGroup,
				search: function(oEvent) {
					//	var aSearchItems = oEvent.mParameters.selectionSet;
					var filters = [];
					if (that._aInitFilters) {
						for (var element in that._aInitFilters) {
							filters[element] = that._aInitFilters[element];
						}
					}
					$.each(arguments[0].getParameter("selectionSet"), function(key, value) {
						if (value.getValue()) {
							filters.push(new Filter(value.getId(), FilterOperator.Contains, value.getValue()));
						}
					});

					if (oValueHelpDialog.getTable() instanceof sap.m.Table) {
						// oValueHelpDialog.getTable().bindItems({
						// 	path: that.binding,
						// 	filters: filters,
						// 	and: true
						// });
						oValueHelpDialog.getTable().bindAggregation("items", that.binding, function(sId, oContext) {
								var aCols = oValueHelpDialog.getTable().getModel("columns").getData().cols;

								return new sap.m.ColumnListItem({
									cells: aCols.map(function(column) {
										var colname = column.template;
										return new sap.m.Label({
											text: "{" + colname + "}"
										});
									})
								});
							},
							"", filters
						);
					} else {
						oValueHelpDialog.getTable().bindRows({
							path: that.binding,
							filters: filters,
							and: true
						});
					}

				},
				clear: function(oEvent) {
					sap.m.MessageToast.show("Clear pressed");
				}
			});

			// oFilterBar.setBasicSearch(new SearchField({
			// 	showSearchButton: true,
			// 	placeholder: "Search",
			// 	search: function(oEvent) {
			// 		var filters = [];
			// 		var sValue = oEvent.getSource().getValue();
			// 		// filters.push(new Filter(value.getId(), FilterOperator.Contains, value.getValue()));

			// 		filters.push(new Filter("Kosar", FilterOperator.Contains, sValue));

			// 		// oValueHelpDialog.getFilterBar().search();
			// 		oValueHelpDialog.getTable().bindRows({
			// 			path: that.binding,
			// 			filters: filters,
			// 			and: false

			// 		});
			// 	}
			// }));

			oValueHelpDialog.setFilterBar(oFilterBar);

			// oValueHelpDialog.oSelectionTitle.setText("Select Search");
			// oValueHelpDialog.oSelectionTitle.setVisible(true);
			// oValueHelpDialog.oSelectionButton.setVisible(true);

			oValueHelpDialog.open();

		}

	});

});