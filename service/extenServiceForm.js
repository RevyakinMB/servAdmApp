Ext.ns('App.service');

App.service.ExtenServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
		
		this.CombOrganizationStore = new Ext.data.Store({
			autoload: true
			,storeUpdate: true
        	,proxy: new Ext.data.ScriptTagProxy({
            	url: get_api_url('state')
        	})
        	,reader: new Ext.data.JsonReader({
	            root: 'objects'
            	,totalProperty: 'meta.total_count'
            	,id: 'id'
        	}, [
	        	{name: 'name'}
	        	,{name: 'resource_uri'}
				,{name: 'id' }
			])
		});
		this.OrganizationCombo = new Ext.form.ComboBox({

			store: this.CombOrganizationStore
			,displayField: 'name'
			,valueField: 'resource_uri'		
			,fieldLabel: 'Организация'	
			,name: 'state'			
			,allowBlank: false
			,emptyText: 'Выберите организацию' 	
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     
			,typeAhead: true	
			,anchor: '-10'
			,listeners: {
				select: function() {
					if (this.CombOrganizationStore.storeUpdate) {
						if (this.getForm().isValid()) {
		            		this.getForm().updateRecord(this.record);	           
		            		var a1 = this.OrganizationCombo.getValue();				        
		            		var a = this.OrganizationCombo.findRecord('resource_uri',a1);	            			            		
		            		var rec_number = this.record.store.find("id",this.record.get("id"));          		
						   	var rec = this.record.store.getAt(rec_number);
						   	rec.set('state_name',a.get("name"));
		            	}	
					}
				}				
				,scope: this
			}
		});
		
		this.ComboTubeStore = new Ext.data.Store({
        	proxy: new Ext.data.ScriptTagProxy({
            	url: get_api_url('tube')
        	})
        	,reader: new Ext.data.JsonReader({
	            root: 'objects'
            	,totalProperty: 'meta.total_count'
            	,id: 'id'
        	}, [
	        	{name: 'name'}
	        	,{name: 'resource_uri'}
				,{name: 'id' }				
			])
		});
			
		this.TubeCombo = new Ext.form.ComboBox({

			store: this.ComboTubeStore
			,displayField: 'name'			
			,valueField: 'resource_uri'
			,fieldLabel: 'Тара'			
			,name: 'tube'			
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     
			,typeAhead: true	
			,anchor: '-10'
		});			
		
		this.checkNStaffForm = new Ext.form.FormPanel({
			border: false
			//,margins: "0 0 0 0"
			,bodyStyle: 'background-color:#dfe8f5;'			
			,defaultType: 'textfield'
			,layout: 'hbox'
			,labelWidth : 1
			,items: [{
				xtype: 'container'
				,border: false								
				,layout: 'form'
				,items: [ 
				{	
					xtype: 'checkbox',
					checked: true,
	    	        labelSeparator: '',
	        	    boxLabel: 'Активно',
	            	name: 'is_active'
	            	,handler: function() {
	            		if (this.CombOrganizationStore.storeUpdate) {
		            		if (this.getForm().isValid()) {
		            			this.getForm().updateRecord(this.record);
		            		}
	            		}
	            	}
	            	,scope: this
				},{	
					xtype: 'checkbox',
					checked: false,
	        	    labelSeparator: '',
	            	boxLabel: 'Ручной метод',
		            name: 'is_manual'
				}]	
			},{
				xtype: 'button'
				,text: 'Кем выполняется'
				,ref: '../../staffBtn'
				//,iconCls:'silk-???'
				,handler: function() {
					this.fireEvent('staffmanageclick');
				}
				,scope: this				
			}]
		});
		
		config = {	
			border: false
			,storeUpdate: true
			,items: [{
			 	xtype: 'fieldset'			 	
				,title: 'Расширенная услуга'
				,defaultType: 'textfield'
				,border: false
				,anchor: '-5'
				,labelWidth: 96
				,items: [this.OrganizationCombo
					,this.TubeCombo
				,{
					fieldLabel: 'Количество тары'
					,name: 'tube_count'
					,allowBlank: true					
					,width: 50
				},this.checkNStaffForm
				,{	
					xtype: 'hidden'
					,name:'base_service'
				}]
			}]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtenServiceForm.superclass.initComponent.apply(this, arguments);
		this.on('afterrender', function(){
			this.CombOrganizationStore.load();
		},this);
	}
			
	,setActiveRecord: function(record) {
		this.record = record;
		this.getForm().loadRecord(this.record);
		this.checkNStaffForm.getForm().loadRecord(this.record);
	}
		
}); //end of ExtenServiceForm

Ext.reg('extenserviceform', App.service.ExtenServiceForm);
		