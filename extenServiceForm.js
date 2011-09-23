Ext.ns('App.ServAdm');

App.ServAdm.extenServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
		
		this.combOrganizationStore = new Ext.data.Store({
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
			
		this.organizationCombo = new Ext.form.ComboBox({

			store: this.combOrganizationStore
			,displayField: 'name'
			,fieldLabel: 'Организация'		
			,valueField: 'id'
			,hiddenName: 'organizId'
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     
			,typeAhead: true			
		});
		
		this.comboTubeStore = new Ext.data.Store({
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
			
		this.tubeCombo = new Ext.form.ComboBox({

			store: this.comboTubeStore
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
			,items: [this.organizationCombo
				,this.tubeCombo
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
		App.ServAdm.extenServiceForm.superclass.initComponent.apply(this, arguments);
	}

}); //end of extenServiceForm

Ext.reg('extenserviceform', App.ServAdm.extenServiceForm);
		