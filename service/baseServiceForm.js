Ext.ns('App.service');

App.service.MaterialCombo = Ext.extend(Ext.form.ComboBox, {
	
	initComponent : function(){
		
		this.MaterialComboStore = new Ext.data.Store({
	       	proxy: new Ext.data.ScriptTagProxy({
	           	url: get_api_url('material')
	       	})
	       	,autoLoad: true
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
		config = {
			store: this.MaterialComboStore
			,displayField: 'name'
			,valueField: 'resource_uri'
			,fieldLabel: 'Материал' 
			,name: 'material'	
			,allowBlank: true						
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     // Проблема решилась этим
			,typeAhead: true		
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.MaterialCombo.superclass.initComponent.apply(this, arguments);
		
	}
});

Ext.reg('materialcombo', App.service.MaterialCombo);


App.service.BaseServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
				
		this.MaterialCombo = new App.service.MaterialCombo({width: 95});
		
		config = {		
			layout: 'column'
			,bodyStyle: 'background-color:#dfe8f5;'
			,labelWidth: 85
			,border: false
			,items: [{
			////
				xtype: 'container'
				,columnWidth: .6
				//,style: { padding: '2px 2px 2px 21px' }			
				,defaultType: 'textfield'
			////
				,items: [{
			 		xtype: 'fieldset'	
			 		,border: false
					,title: 'Основное'
					,autoHeight: true				
					,defaultType: 'textfield'
					,labelWidth: 85
					,bodyStyle: 'background-color:#dfe8f5;'			
					,items:	[
					{
						fieldLabel: 'Наименование'
						,name: 'name'
						,allowBlank: false
						,emptyText: 'Введите наименование услуги'
						,anchor: '-10'
					},{				
						fieldLabel: 'Кратко'
						,allowBlank: false
						,name: 'short_name'
						,emptyText: 'Введите краткое наименование'
						,anchor: '-10'						
					},{
						xtype: 'container'						
						,layout: 'column'
					    ,defaults: {					       
					        xtype: 'container'
					        ,layout: 'form'
					        ,columnWidth: 0.5					       
					    }
					    ,items: [{
					    	items: {
								xtype: 'textfield'
								,fieldLabel: 'Код'
								,name: 'code'
								,anchor: '-10'
					    	}
						},{
							items: {
								xtype: 'textfield'
								,fieldLabel: 'Станд. время выполнения'
								,name: 'execution_time'
								,anchor: '-10'
							}
						}]																										
					}]
				}]				
			},{
				////
				xtype: 'container'
				,columnWidth: .4
				,style: { padding: '2px' }
				,items: [{
				////
					xtype: 'fieldset'			 	
					,title: 'Дополнительно'
					,autoHeight: true
					,border: false
					,defaultType: 'textfield'
					,labelWidth: 85					
					,defaults: {anchor: '-10'}
					,items:	[
						this.MaterialCombo							
					,{
						xtype: 'textarea'
						,fieldLabel: 'Общий рефер. интервал'						
						,name: 'gen_ref_interval'
					}]
				}] 
			}]	
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.BaseServiceForm.superclass.initComponent.apply(this, arguments);
	},
	
	setActiveRecord: function(record) {
		this.record = record;
		this.getForm().loadRecord(this.record);
	}

});

Ext.reg('baseserviceform', App.service.BaseServiceForm);
		