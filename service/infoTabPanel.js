Ext.ns('App.service');

App.service.InfoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.BaseServiceForm = new App.service.BaseServiceForm ({});		
		
		this.ExtendedServiceGrid = new App.service.ExtendedServiceGrid ({
			width: 190
			,height: 170
			,layout: 'hbox'
		});
		
		this.PriceGrid = new App.service.ExtenServPriceGrid ({
			width: 245
			,height: 170
		});	
		this.ExtendedServForm = new App.service.ExtenServiceForm({
			width: 300
			,height: 170
			,bodyStyle: 'background-color:#dfe8f5;'
		});
		
		var config = {
			activeItem:1
	   		,items:[{					
				title: 'Общая информация'
				,id: 'commonTab'
			 	,layout: 'anchor'
			 	,bodyStyle: 'background-color:#dfe8f5;'			 	
			 	,items: [
			 		this.BaseServiceForm
			 	]			 		
		   	},{
		    	title: 'Расширенные услуги'
		    	,id: 'extendedTab'
		    	,layout: 'hbox'
		    	,bodyStyle: 'background-color:#dfe8f5;'
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
						]					
					}
				]			    
		  	},{
		    	title: 'Операции'		    	
		    	,bodyStyle: 'background-color:#dfe8f5;'
	      }]
	      ,bbar: ['->',{
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
			this.ExtendedServiceGrid.removeButton.setDisabled(true);
			//this.ExtendedServForm.getForm().findField('saveButton').setDisabled(true); // WHY?! this "is null"???
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
		this.newServiceForm = new App.service.ExtenServiceForm({
			width: 385
			,height: 170
			,bodyStyle: 'background-color:#dfe8f5;'							
		});
		var a = this.ExtendedServiceGrid.store.baseParams.base_service;
		this.newServiceForm.getForm().findField('base_service').setValue("/api/v1/dashboard/extendedservice/" + a);		

		this.newServiceWindow = new Ext.Window ({
			width: 400
			,height : 235
			,title: 'Новая расширенная услуга'
			,items: [this.newServiceForm
			,new Ext.Container({
				layout: 'hbox'
				,style: {
		            padding: '5px'
		        }
				,layoutConfig:	{pack: 'end' }
				,items: [{
					xtype: 'button'
					,text: 'Создать'
					,iconCls:'silk-add'
					,handler: function() {
						if ( this.newServiceForm.getForm().isValid() ) {							
							var p = new this.ExtendedServiceGrid.store.recordType();
							this.newServiceForm.getForm().updateRecord(p);
							this.ExtendedServiceGrid.store.insert(0,p);
							this.newServiceWindow.close();
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
						this.newServiceWindow.close();
					}
					,scope: this
				}]
			})]
			,modal: true
		});								
		this.newServiceWindow.show();		
	}
	
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
