Ext.ns('App.service');

App.service.ExtenServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
		
		this.CombOrganizationStore = new Ext.data.Store({
        	proxy: new Ext.data.ScriptTagProxy({
            	url: get_api_url('state')
        	})
        	,reader: new Ext.data.JsonReader({
	            root: 'objects'
            	,totalProperty: 'meta.total_count'
            	,id: 'id'
        	}, [
	        	{name: 'name'}
				,{name: 'id' }
			])
		});
			
		this.OrganizationCombo = new Ext.form.ComboBox({

			store: this.CombOrganizationStore
			,displayField: 'name'
			,fieldLabel: 'Организация'		
			,valueField: 'id'
			,hiddenName: 'organizId'
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     
			,typeAhead: true			
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
				,{name: 'id' }
			])
		});
			
		this.TubeCombo = new Ext.form.ComboBox({

			store: this.ComboTubeStore
			,displayField: 'name'
			,fieldLabel: 'Тара'
			,allowBlank: true			
			,valueField: 'id'
			,hiddenName: 'tubeId'
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     
			,typeAhead: true			
		});
		
		config = {
			labelWidth: 85
			,frame: true
			,defaults: {
					width: 130
			}
			,items: [this.OrganizationCombo
				,this.TubeCombo
			,{
				xtype: 'textfield'
				,fieldLabel: 'Количество тары'
				,allowBlank: true
			},{	
				xtype: 'checkbox',
				checked: true,
                labelSeparator: '',
                boxLabel: 'Активно',
                name: 'serv_active'
			},{	
				xtype: 'checkbox',
				checked: false,
                labelSeparator: '',
                boxLabel: 'Ручной метод',
                name: 'serv_manual'
			}]
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtenServiceForm.superclass.initComponent.apply(this, arguments);
	}

}); //end of ExtenServiceForm

Ext.reg('extenserviceform', App.service.ExtenServiceForm);
		