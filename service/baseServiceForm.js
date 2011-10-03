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
			,valueField: 'resource_uri' // имя поля, данные из которого подгружаюся в combo для хранения
			,fieldLabel: 'Материал' 
			,name: 'material' //имя поля, данные из которого подгружаюся в combo для отображения	
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
				
		/*this.ComboMaterialStore = new Ext.data.Store({
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
			
		this.MaterialCombo = new Ext.form.ComboBox({

			store: this.ComboMaterialStore
			,displayField: 'name'
			,valueField: 'resource_uri'
			,fieldLabel: 'Материал'
			,name: 'material'		
			,allowBlank: true						
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     // Проблема решилась этим
			,typeAhead: true			
		});
*/		
		this.MaterialCombo = new App.service.MaterialCombo({});
		
		config = {		
			layout: 'hbox'
			,labelWidth: 85
			,layoutConfig: { pack: 'start' }
			,items: [{
			////
				xtype: 'container'
				,width: 380
				,style: { padding: '2px' }			
				,defaultType: 'textfield'
			////
				,items: [{
			 		xtype: 'fieldset'			 	
					,title: 'Основное'
					,autoHeight: true
					,defaultType: 'textfield'
					,labelWidth: 135
					,defaults: {
						anchor: '-10'
						,frame: true
						,width: 150
					}				
					,items:	[
					{
						fieldLabel: 'Наименование'
						,name: 'name'
						,allowBlank: false
						,emptyText: 'required'
					},{				
						fieldLabel: 'Кратко'
						,allowBlank: false
						,name: 'short_name'
					},{
						fieldLabel: 'Код'
						,name: 'code'
					}]
				}]				
			},{
				////
				xtype: 'container'
				,width: 380
				,style: { padding: '2px' }
				,items: [{
				////
					xtype: 'fieldset'			 	
					,title: 'Дополнительно'
					,autoHeight: true
					,defaultType: 'textfield'
					,labelWidth: 135
					,defaults: {
						anchor: '-10'
						,frame: true
						,width: 150
					}					
					,items:	[
					{
						fieldLabel: 'Версия'
						,name: 'version'
						,labelWidth: 50
					}
						,this.MaterialCombo						
					,{
						fieldLabel: 'Станд. время выполнения'
						,name: 'execution_time'
					},{
						fieldLabel: 'Общий рефер. интервал'						
						,name: 'gen_ref_interval'
					}]
				}] 
			}/*,{
				xtype:'button',
				text:'Сохранить (tmp)',
				handler:function(){
					if(this.record) {
						if ( this.getForm().isValid() ) {
							this.getForm().updateRecord(this.record);
						}
					}
				},
				scope:this
			}*/]	
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.BaseServiceForm.superclass.initComponent.apply(this, arguments);
	},
	
	setActiveRecord: function(record) {
		this.record = record;
		this.getForm().loadRecord(this.record);
	}

}); //end of baseServiceForm

Ext.reg('baseserviceform', App.service.BaseServiceForm);
		