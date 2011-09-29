Ext.ns('App.service');

App.service.InfoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.BaseServiceForm = new App.service.BaseServiceForm ({});		
		
		this.ExtendedServiceGrid = new App.service.ExtendedServiceGrid ({
			width: 170
			,height: 195
			,layout: 'hbox'
		});
		
		this.PriceGrid = new App.service.ExtenServPriceGrid ({
			width: 155
			,height: 195
		});	
		this.ExtendedServForm = new App.service.ExtenServiceForm({
			width: 380
			,height: 195
		});
		
		var config = {
			activeItem:1
			//,forceLayout : true 
			//,deferredRender: false
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
		this.ExtendedServiceGrid.on('newrecordclick',this.onNewRecordClick,this);
		this.ExtendedServiceGrid.on('deleterecordclick',this.onDeleteRecordClick,this);
		
		this.ExtendedServForm.on('formsave',this.onFormSave,this);
		
		this.ExtendedServiceGrid.store.on('load', this.onExtendedServiceLoad, this);
		/*function() {
			this.ExtendedServiceGrid.addButton.setDisabled(false);
			this.PriceGrid.addButton.setDisabled(false);
			var sm = this.ExtendedServiceGrid.getSelectionModel();
			sm.selectFirstRow();
			if (sm.getCount() == 1 ) {
				var record = sm.getSelected()  // Get the Record
				var data = record.json.resource_uri;	
				this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
		    	this.PriceGrid.store.load();		    	
		    	this.ExtendedServForm.setActiveRecord(record);
		} 	
			
		},this); */
	}
	,onExtendedServiceLoad: function() {
		this.ExtendedServiceGrid.addButton.setDisabled(false);
		this.PriceGrid.addButton.setDisabled(false);
		var sm = this.ExtendedServiceGrid.getSelectionModel();
		sm.selectFirstRow();
		if (sm.getCount() == 1 ) {
			this.ExtendedServiceGrid.removeButton.setDisabled(false);
			var record = sm.getSelected()  // Get the Record
			var data = record.json.resource_uri;	
			this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
		   	this.PriceGrid.store.load();		    	
		   	this.ExtendedServForm.setActiveRecord(record);
		}
	}	
	,onDeleteRecordClick: function () {
		Ext.MessageBox.show({
           title:'Удалить запись?'
           ,msg: 'Вы выбрали удалить расширенную услугу. <br />Продолжить?'
           ,buttons: Ext.MessageBox.YESNO
           ,fn: function(btn) { 
           		if (btn == "yes") {
           			var price_sel = this.PriceGrid.getSelectionModel();           		
					for (var i=0; i < price_sel.getCount(); i++ ) {
						price_sel.selectFirstRow();					
           				var s = price_sel.getSelected();
               	    	this.PriceGrid.store.remove(s); //сначала удалить все записи в таблице цен
           			}           		
           			s = this.ExtendedServiceGrid.getSelectionModel().getSelections();
           			for(var i = 0, r; r = s[i]; i++){
                	    this.ExtendedServiceGrid.store.remove(r); //затем удалить и расширенную услугу
           			}
           		}
           		this.ExtendedServiceGrid.store.save();
           	}
           	,scope: this
         	,icon: Ext.MessageBox.QUESTION
       });
	}
	
	
	,onNewRecordClick: function() {
		this.ExtendedServForm.record = null;
		this.ExtendedServForm.clearFields();
		this.ExtendedServiceGrid.getSelectionModel().clearSelections();	
		
	}
	,onFormSave: function(rec) {
		if (rec) {
			this.ExtendedServForm.getForm().updateRecord(rec);
			this.ExtendedServiceGrid.store.save();
		} else {
	/*		this.extServiceModel = new Ext.data.Record.create([
				//{ name: 'id'}
				{name : 'is_active'}									
				,{name: 'is_manual'}
				,{name: 'state'}
				,{name: 'tube_count'}
	        ]);
 			//var record = new this.extServiceModel(); */
	        
 			var p = new this.ExtendedServiceGrid.store.recordType();
 			this.ExtendedServForm.getForm().updateRecord(p);
			this.ExtendedServiceGrid.store.insert(0,p);
			this.ExtendedServiceGrid.store.save();
			this.ExtendedServiceGrid.store.on('save', function() {
				this.ExtendedServiceGrid.store.load();
			},this);
		}				
	}
	
	,onExtServGridCellClick: function(grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);  // Get the Record
		var data = record.json.resource_uri;			
		
		this.ExtendedServForm.setActiveRecord(record);
		
    	this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
    	this.PriceGrid.store.load();
	}
		
});

Ext.reg('infotabpanel', App.service.InfoTabPanel);
