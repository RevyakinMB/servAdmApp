Ext.ns('App.service');

App.service.InfoTabPanel = Ext.extend(Ext.TabPanel, {
	initComponent : function() {
			
		this.BaseServiceForm = new App.service.BaseServiceForm ({});		
		
		this.ExtendedServiceGrid = new App.service.ExtendedServiceGrid ({
			height: 170
			,border: false			
		});
		
		this.PriceGrid = new App.service.ExtenServPriceGrid ({
			height: 170
			,border: false
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
		    	,layout: 'column'
		    	,bodyStyle: 'background-color:#dfe8f5;'
				,items: [
					{
						xtype: 'container'
						,columnWidth: .5 
						,style: { padding: '0px 0px 0px 3px' }
						,items: [this.ExtendedServiceGrid]
					},{
						xtype: 'container'
						,columnWidth: .5
						,style: { padding: '0px 0px 0px 3px' }
						,items: [this.PriceGrid]
					},{
						xtype: 'container'
						,width: 300
						,style: { padding: '0px 0px 0px 3px' }
						,items: [
							this.ExtendedServForm
						]					
					}
				]			    
		  	},{
		    	title: 'Операции'		    	
		    	,bodyStyle: 'background-color:#dfe8f5;'
		    	,id: 'operationTab'
	      }]
	      ,bbar: ['->',{
	      	xtype: 'button'
	      	,iconCls:'silk-cancel'
	      	,ref: '../cancelButton'
	      	,text: 'Отменить изменения'
	      	,width: 150
	      	,disabled: true
	      	,handler: function() {
	      		this.fireEvent('cancelformchanges');	
	      	}
	      	,scope: this
	      },{
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
		this.ExtendedServForm.on('staffmanageclick', this.onStaffManageBtnClick,this);		
		
	}
	
	,onStaffSourceLoaded: function(records) {
		var resultRecords = this.staffWindow.resultStore.getRange();
		this.staffWindow.sourceRecords = this.staffWindow.sourceStore.getRange();
        for (var i = 0; i < resultRecords.length; i++) {	        	
        	var rec_number = this.staffWindow.sourceStore.find("name",resultRecords[i].data.name);  				
            this.staffWindow.sourceStore.remove(this.staffWindow.sourceStore.getAt(rec_number));	            
        } 	        
        this.staffWindow.show()		
	}
	
	,onStaffWindowClose: function() {
		if (this.staffWindow.action == 'save') {
			
			var uri;
			var resultRecords = this.staffWindow.resultStore.getRange();
			for (var i = 0; i < resultRecords.length; i++) {
				for (var j=0; j < this.staffWindow.sourceRecords.length; j++ ) {
					if (this.staffWindow.sourceRecords[j].get('id') == resultRecords[i].get('id')) {
						uri = this.staffWindow.sourceRecords[j].get('resource_uri');
					}
				}						
				resultRecords[i].set('resource_uri',uri);
			}			
			
			var datArray = new Array();
	        for (var i = 0; i < resultRecords.length; i++) {
	        	//var ar = Array (resultRecords[i].get('resource_uri') , resultRecords[i].get('name') );
	            datArray.push(   resultRecords[i].get('resource_uri') );
	        }
//	        var aa = this.ExtendedServiceGrid.getSelectionModel().getSelected();
	        this.ExtendedServiceGrid.getSelectionModel().getSelected().set('staff', datArray);
//	        var aaa = this.ExtendedServiceGrid.store.save();	        
		}
	}
	
	,onStaffManageBtnClick: function() {
		if (this.ExtendedServiceGrid.getSelectionModel().getSelected()) {
			this.staffWindow = new App.service.StaffWindow();
			var staffArray = this.ExtendedServiceGrid.getSelectionModel().getSelected().get('staff');
			if (staffArray) {
				this.staffWindow.resultStore.loadData( staffArray );
			}
			this.staffWindow.sourceStore.load({
				callback: function(records) {
					this.onStaffSourceLoaded (records);
				}
				,scope: this
			});			
						
			this.staffWindow.on('beforeclose', this.onStaffWindowClose, this);						
		}
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
           		/*this.ExtendedServiceGrid.store.on('save', function() {
					this.ExtendedServiceGrid.store.load();
				},this);*/ 
           	}
           	,scope: this
         	,icon: Ext.MessageBox.QUESTION
       });
	}
	
	
	,onNewRecordClick: function() {			
		this.newServiceForm = new App.service.ExtenServiceForm({
			//width: 385
			anchor: '-10'			
			,height: 170
			,bodyStyle: 'background-color:#dfe8f5;'							
		});
		var a = this.ExtendedServiceGrid.store.baseParams.base_service;
		this.newServiceForm.getForm().findField('base_service').setValue("/api/v1/dashboard/extendedservice/" + a);		
		this.newServiceForm.staffBtn.setVisible(false);
		this.newServiceForm.CombOrganizationStore.storeUpdate = false;
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
							/*this.ExtendedServiceGrid.store.on('save', function() {
								this.ExtendedServiceGrid.store.load();
							},this);							*/
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
