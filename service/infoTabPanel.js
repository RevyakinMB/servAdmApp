Ext.ns('App.service');

App.service.InfoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.BaseServiceForm = new App.service.BaseServiceForm ({});		
		
		this.ExtendedServiceGrid = new App.service.ExtendedServiceGrid ({
			width: 170
			,height: 155
		});
		
		this.PriceGrid = new App.service.ExtenServPriceGrid ({
			width: 155
			,height: 155
		});	
		this.ExtendedServForm = new App.service.ExtenServiceForm({
			width: 240
			,height: 155
		});
		
		var config = {
			activeItem:0		
	   		,items:[{					
				title: 'Общая'
			 	,layout: 'anchor'
			 	,frame: true
			 	,items: [
			 		this.BaseServiceForm
			 	]			 		
		   	},{
		    	title: 'Расширенная'
		    	,layout: 'hbox'
				,frame: true
				,layoutConfig: {
					pack: 'start'
				}
				,items: [
					this.ExtendedServiceGrid
					,this.PriceGrid
					,this.ExtendedServForm
				]			    
		  	},{
		    	title: 'Операции'
	      }]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.InfoTabPanel.superclass.initComponent.apply(this, arguments);
			
		this.ExtendedServiceGrid.on('gridcellclick',this.onExtServGridCellClick,this);
	}
	,onExtServGridCellClick: function(grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);  // Get the Record
		var data = record.json.resource_uri;
    	this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
    	this.PriceGrid.store.load();
	}
		
});

Ext.reg('infotabpanel', App.service.InfoTabPanel);
