sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.sapcsr.laloProject.controller.Page1", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App6387da7586701601ceec87c3";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		createFiltersAndSorters: function() {
			this.mBindingOptions = {};
			var oBindingData, aPropertyFilters;
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("ANO", "EQ", "2021"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, true));

			this.updateBindingOptions("sap_m_Page_0-content-sap_chart_DonutChart-1669849908278", oBindingData);

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_m_Page_0-content-sap_chart_DonutChart-1669849908278"] = {};

			oData["sap_m_Page_0-content-sap_chart_DonutChart-1669849908278"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"__id": 4
			}];

			self.oBindingParameters['sap_m_Page_0-content-sap_chart_DonutChart-1669849908278'] = {
				"path": "/VentasSet",
				"parameters": {}
			};

			oData["sap_m_Page_0-content-sap_chart_DonutChart-1669849908278"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_m_Page_0-content-sap_chart_DonutChart-1669849908278").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			this.mAggregationBindingOptions = {};
			this.createFiltersAndSorters();

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oView.getModel(undefined).getMetaModel().loaded().then(function() {
				oChart = oView.byId("sap_m_Page_0-content-sap_chart_DonutChart-1669849908278");
				var oParameters = oBindingParameters['sap_m_Page_0-content-sap_chart_DonutChart-1669849908278'];

				self.applyFiltersAndSorters("sap_m_Page_0-content-sap_chart_DonutChart-1669849908278", "data", oBindingParameters['sap_m_Page_0-content-sap_chart_DonutChart-1669849908278']);

			});

		}
	});
}, /* bExport= */ true);
