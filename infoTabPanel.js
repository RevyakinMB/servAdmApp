Ext.ns('App.ServAdm');

App.ServAdm.infoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.baseServiceForm = new App.ServAdm.baseServiceForm ({});		
		
		this.extendedServiceGrid = new App.ServAdm.extendedServiceGrid ({
			width: 170
			,height: 225
		});
		
		this.priceGrid = new App.ServAdm.extenServPriceGrid ({
			width: 155
			,height: 225
		});	
		this.ExtendedServForm = new App.ServAdm.extenServiceForm({
			width: 240
			,height: 225
		});
		
		var config = {
			activeItem:1		
	   		,items:[{					
				title: 'Общая'
			 	,layout: 'anchor'
			 	,frame: true
			 	,items: [
			 		this.baseServiceForm
			 	]			 		
		   	},{
		    	title: 'Расширенная'
		    	,layout: 'hbox'
				,frame: true
				,layoutConfig: {
					pack: 'start'
				}
				,items: [
					this.extendedServiceGrid
					,this.priceGrid
					,this.ExtendedServForm
				]			    
		  	},{
		    	title: 'Операции'
	      }]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServAdm.infoTabPanel.superclass.initComponent.apply(this, arguments);
		
		this.extendedServiceGrid.on('afterrender', function(){
			this.extendedServiceGrid.store.load();
		},this);
		
		this.priceGrid.on('afterrender', function(){
			this.priceGrid.store.load();
		},this);
	}
	
	
});

Ext.reg('infotabpanel', App.ServAdm.infoTabPanel);
