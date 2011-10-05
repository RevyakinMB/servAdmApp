Ext.ns('App.service');

App.service.ExtenServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
		
		this.CombOrganizationStore = new Ext.data.Store({
			autoload: true
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
		
		config = {			
			items: [{
			 	xtype: 'fieldset'			 	
				,title: 'Расширенная услуга'
				,defaultType: 'textfield'
				,anchor: '-5'
				,labelWidth: 85
				,items: [this.OrganizationCombo
					,this.TubeCombo
				,{
					fieldLabel: 'Количество тары'
					,name: 'tube_count'
					,allowBlank: true
					,width: 50
				},{	
					xtype: 'checkbox',
					checked: true,
        	        labelSeparator: '',
            	    boxLabel: 'Активно',
                	name: 'is_active'
				},{	
					xtype: 'checkbox',
					checked: false,
            	    labelSeparator: '',
                	boxLabel: 'Ручной метод',
    	            name: 'is_manual'
				},{	
					xtype: 'hidden'
					,name:'base_service'
				}]
			}/*,{
				xtype:'button'
				,name: 'saveButton'
				//,ref: '../saveButton'
				,text:'Сохранить изменения'
				,id: 'extendedFormsaveBtn'
				,disabled: true
				,handler:function(but){				 
					//but.setDisabled(true);
					if ( this.getForm().isValid() ) { 
			   			this.fireEvent('formsave',this.record);
					}
				}
				,scope:this			
			}*/]
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
	}
	
	,clearFields: function() {
		this.getForm().findField('tube_count').setValue("");
		this.getForm().findField('is_active').setValue(true);
		this.getForm().findField('is_manual').setValue(false);
		this.getForm().findField('state').reset();
		this.getForm().findField('tube').reset();		
	}

}); //end of ExtenServiceForm

Ext.reg('extenserviceform', App.service.ExtenServiceForm);
		