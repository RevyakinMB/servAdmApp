Ext.ns('App.service');

App.service.InfoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.BaseServiceForm = new App.service.BaseServiceForm ({});		
		
		this.ExtendedServiceGrid = new App.service.ExtendedServiceGrid ({
			width: 170
			,height: 175
			,layout: 'hbox'
		});
		
		this.PriceGrid = new App.service.ExtenServPriceGrid ({
			width: 195
			,height: 175
		});	
		this.ExtendedServForm = new App.service.ExtenServiceForm({
			width: 380
			,height: 175
			,frame: true
		});
		
		var config = {
			activeItem:1
	   		,items:[{					
				title: 'Общая информация'
				,id: 'commonTab'
			 	,layout: 'anchor'
			 	,frame: true
			 	,items: [
			 		this.BaseServiceForm
			 	]			 		
		   	},{
		    	title: 'Исполнители'
		    	,id: 'extendedTab'
		    	,layout: 'hbox'
				,frame: true
				,layoutConfig: {
					pack: 'start'
				}
				,items: [
					this.ExtendedServiceGrid
					,this.PriceGrid
					,{
						xtype: 'container'
						,style: { padding: '0px 0px 0px 3px' }
						,items: [
							this.ExtendedServForm
						/*,{
							xtype:'button'
							,name: 'saveButton'							
							,text:'Сохранить изменения'
							,id: 'extendedFormsaveBtn'
							,disabled: true
							,handler:function(but){				 
								if ( this.getForm().isValid() ) { 
						   			this.fireEvent('formsave',this.record);
								}
							}
							,scope:this.ExtendedServForm			
						}*/]					
					}
				]			    
		  	},{
		    	title: 'Операции'
		    	,frame: true
	      }]
	      ,bbar: [{
	      	xtype: 'button'
	      	,iconCls:'silk-accept'
	      	,ref: '../saveButton'
	      	,text: 'Сохранить изменения'
	      	,width: 150
	      	,disabled: true
	      	,handler: function() {
	      		this.fireEvent('formsave');	
	      	}
	      	,scope: this
	      }]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.InfoTabPanel.superclass.initComponent.apply(this, arguments);
			
		this.ExtendedServiceGrid.getSelectionModel().on('rowselect',this.onExtendedServiceGridSelect,this);
		this.ExtendedServiceGrid.on('newrecordclick',this.onNewRecordClick,this);
		this.ExtendedServiceGrid.on('deleterecordclick',this.onDeleteRecordClick,this);
		
		/*this.ExtendedServForm.on('formsave',this.onFormSave,this);*/
		
		this.ExtendedServiceGrid.store.on('load', this.onExtendedServiceLoad, this);
		
	}
	
	,onExtendedServiceLoad: function() {
		this.ExtendedServiceGrid.addButton.setDisabled(false);
		this.PriceGrid.enable();
		this.ExtendedServForm.enable();
		var sm = this.ExtendedServiceGrid.getSelectionModel();
		sm.selectFirstRow();
		if (sm.getCount() == 0 ) { 
			this.PriceGrid.disable();
			this.ExtendedServForm.disable();
			/*this.ExtendedServForm.getForm().findField('base_service').setValue(
					this.ExtendedServiceGrid.getSelectionModel().getSelected().get('base_service'));*/
			this.ExtendedServiceGrid.removeButton.setDisabled(true);
			//this.ExtendedServForm.getForm().findField('saveButton').setDisabled(true); // WHY?! this "is null"???
			//Ext.getCmp("extendedFormsaveBtn").setDisabled(true);
		}		
	}	
	
	,onDeleteRecordClick: function () {
		Ext.MessageBox.show({
           title:'Удалить запись?'
           ,width: 340
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
		if (!this.newServiceForm) {
			this.newServiceForm =  new App.service.ExtenServiceForm({
				width: 380
				,height: 195
				,frame: true
				,bbar: [{
					xtype: 'button'
					,text: 'Создать'
					,iconCls:'silk-add'
					,handler: function() {
						if ( this.newServiceForm.getForm().isValid() ) {
							this.newServiceWindow.hide();
							var p = new this.ExtendedServiceGrid.store.recordType();
							this.newServiceForm.getForm().updateRecord(p);
							this.ExtendedServiceGrid.store.insert(0,p);
							this.ExtendedServiceGrid.store.save();
							this.ExtendedServiceGrid.store.on('save', function() {
								this.ExtendedServiceGrid.store.load();
							},this);
						}
					}
					,scope: this
				},{
					xtype: 'button'
					,text: 'Отмена'
					,iconCls:'silk-cancel'
					,handler: function() {
						this.newServiceWindow.hide();
					}
					,scope: this
				}]									
			});
		};
		var a = this.ExtendedServiceGrid.store.baseParams.base_service;
		this.newServiceForm.getForm().findField('base_service').setValue("/api/v1/dashboard/extendedservice/" + a);
		/*var a = this.ExtendedServiceGrid.getSelectionModel().getSelected().get('base_service');
		*/			
		
		if (!this.newServiceWindow) {
			this.newServiceWindow = new Ext.Window ({
				width: 396
				,height : 222
				,title: 'Новая расширенная услуга'
				,items: [this.newServiceForm]
				,modal: true
			});						
		}
		this.newServiceWindow.show();		
	}
	/*,onFormSave: function(rec) {
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
	}*/	
	
	,onExtendedServiceGridSelect: function(selModel, rowIndex, rec) {
		this.ExtendedServiceGrid.removeButton.setDisabled(false);
		var data = rec.json.resource_uri;					
		this.ExtendedServForm.setActiveRecord(rec);		
    	this.PriceGrid.store.setBaseParam('extended_service', App.uriToId(data));
    	this.PriceGrid.store.load();
    	//this.ExtendedServForm.getForm().findField('saveButton').setDisabled(false); // WHY?! this "is null"???    	
    	//Ext.getCmp("extendedFormsaveBtn").setDisabled(false);
	}
		
});

Ext.reg('infotabpanel', App.service.InfoTabPanel);
