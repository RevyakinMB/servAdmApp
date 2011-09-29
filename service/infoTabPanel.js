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
			width: 195
			,height: 195
		});	
		this.ExtendedServForm = new App.service.ExtenServiceForm({
			width: 380
			,height: 195
			,frame: true
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
			
		this.ExtendedServiceGrid.getSelectionModel().on('rowselect',this.onExtendedServiceGridSelect,this);
		this.ExtendedServiceGrid.on('newrecordclick',this.onNewRecordClick,this);
		this.ExtendedServiceGrid.on('deleterecordclick',this.onDeleteRecordClick,this);
		
		this.ExtendedServForm.on('formsave',this.onFormSave,this);
		
		this.ExtendedServiceGrid.store.on('load', this.onExtendedServiceLoad, this);
		
	}
	
	,onExtendedServiceLoad: function() {
		this.ExtendedServiceGrid.addButton.setDisabled(false);		
		var sm = this.ExtendedServiceGrid.getSelectionModel();
		sm.selectFirstRow();
		if (sm.getCount() == 0 ) { 
			this.ExtendedServiceGrid.removeButton.setDisabled(true);
			//this.ExtendedServForm.getForm().findField('saveButton').setDisabled(true); // WHY?! this "is null"???
			Ext.getCmp("extendedFormsaveBtn").setDisabled(true);
		}		
	}	
	
	,onDeleteRecordClick: function () {
		Ext.MessageBox.show({
           title:'Удалить запись?'
           ,msg: 'Вы выбрали удаление расширенной услуги. <br />Продолжить?'
           ,buttons: Ext.MessageBox.YESNO
           ,fn: function(btn) { 
           		if (btn == "yes") {    
           			this.ExtendedServiceGrid.removeButton.setDisabled(true);
           			s = this.ExtendedServiceGrid.getSelectionModel().getSelected();           			
                	this.ExtendedServiceGrid.store.remove(s);           			
           		}
           		this.ExtendedServiceGrid.store.save();
           		this.ExtendedServiceGrid.store.on('save', function() {
					this.ExtendedServiceGrid.store.load();
				},this); 
           	}
           	,scope: this
         	,icon: Ext.MessageBox.QUESTION
       });
	}
	
	
	,onNewRecordClick: function() {
		/*this.ExtendedServForm.record = null;
		this.ExtendedServForm.clearFields();
		this.ExtendedServiceGrid.getSelectionModel().clearSelections();*/
		this.new_form =  new App.service.ExtenServiceForm({
			width: 380
			,height: 195
			,frame: true
		});
		if (!this.winForm) {
			this.winForm = new Ext.Window ({
				width: 500
				,height : 350
				,title: 'Новая расширенная услуга'
				//,layout: 'fit'
				,items: [this.new_form,{
					xtype: 'button'
					,text: 'Save'
					,handler: function() {
						this.winForm.close();
					}
					,scope: this
				}]
				,modal: true
			});						
		}
		//winForm.ExtendedServForm.getForm().findField('base_service').setValue();
		//updateRecord(this.ExtendedServiceGrid.getSelectionModel().getSelected());
		this.winForm.show();
		this.winForm.on('close', function() {
			var p = new this.ExtendedServiceGrid.store.recordType();
			this.new_form.getForm().updateRecord(p);
			this.ExtendedServiceGrid.store.insert(0,p);
			this.ExtendedServiceGrid.store.save();
			this.ExtendedServiceGrid.store.on('save', function() {
				this.ExtendedServiceGrid.store.load();
			},this);
		},this );
		
		
	}
	,onFormSave: function(rec) {
		if (rec) {
			this.ExtendedServForm.getForm().updateRecord(rec);
			this.ExtendedServiceGrid.store.save();
		} else {
 			var p = new this.ExtendedServiceGrid.store.recordType();
 			this.ExtendedServForm.getForm().updateRecord(p);
			this.ExtendedServiceGrid.store.insert(0,p);
			this.ExtendedServiceGrid.store.save();
			this.ExtendedServiceGrid.store.on('save', function() {
				this.ExtendedServiceGrid.store.load();
			},this);
		}				
	}	
	
	,onExtendedServiceGridSelect: function(selModel, rowIndex, rec) {
		this.ExtendedServiceGrid.removeButton.setDisabled(false);
		var data = rec.json.resource_uri;					
		this.ExtendedServForm.setActiveRecord(rec);		
    	this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
    	this.PriceGrid.store.load();
    	//this.ExtendedServForm.getForm().findField('saveButton').setDisabled(false); // WHY?! this "is null"???    	
    	Ext.getCmp("extendedFormsaveBtn").setDisabled(false);
	}
		
});

Ext.reg('infotabpanel', App.service.InfoTabPanel);
