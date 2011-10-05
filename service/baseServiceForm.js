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
			layout: 'hbox'
			,bodyStyle: 'background-color:#dfe8f5;'
			,labelWidth: 85
			,layoutConfig: { pack: 'start' }
			,items: [{
			////
				xtype: 'container'
				,width: 490
				,style: { padding: '2px' }			
				,defaultType: 'textfield'
			////
				,items: [{
			 		xtype: 'fieldset'			 	
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
						fieldLabel: 'Код убрать?'
						,name: 'code'
						,width: 70
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
					,labelWidth: 85					
					,defaults: {
						anchor: '-10'												
					}					
					,items:	[
					{
						xtype: 'container'
						//,width: 100
						,border: false
						,anchor: '-10'						
						,layout: 'hbox'
						,items: [ 
						{
							xtype: 'container'
							,width: 200
							,layout: 'form'
							,items:[this.MaterialCombo]							
						},{
							xtype: 'container'
							,width: 144
							,layout: 'form'
							,items:[
							{
								xtype: 'textfield'
								,fieldLabel: 'Станд. время выполнения'
								,name: 'execution_time'
								,anchor: '0'
								//,labelWidth: 50
							}]							
						}]											
					},{
						xtype: 'textarea'
						,fieldLabel: 'Общий рефер. интервал'						
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
		