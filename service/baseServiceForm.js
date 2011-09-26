Ext.ns('App.service');

App.service.BaseServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
				
		this.ComboMaterialStore = new Ext.data.Store({
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
				,{name: 'id' }
			])
		});
			
		this.MaterialCombo = new Ext.form.ComboBox({

			store: this.ComboMaterialStore
			,displayField: 'name'
			,name: 'material'
			,fieldLabel: 'Материал'
			,allowBlank: true			
			,valueField: 'id'
			,hiddenName: 'materialId'
			,loadingText: 'Загрузка...'
			,triggerAction: 'all'     // Проблема решилась этим
			,typeAhead: true			
		});
		
/////////////////// Base Service's Common Info Tab configuration////////////////
		
		config = {		
			layout: 'hbox'
			,labelWidth: 85
			,frame: true
			,layoutConfig: {
				pack: 'start'
			}
			,items: [{
				xtype: 'container'
				,style: {
         	    	padding: '2px'
        		}
				,layout: 'form'
				,defaults: {
					width: 200					
				}
				,defaultType: 'textfield'
				,items:	[
				{
					fieldLabel: 'Наименование'
					,name: 'name'
					,allowBlank: false
				},{
					fieldLabel: 'Код'
					,name: 'code'
				}]	
			},{
				xtype: 'container'
				,layout: 'form'
				,defaults: {
					width: 200		
				}
				,style: {
         	    	padding: '2px'
        		}
				,defaultType: 'textfield'
				,items:	[
				{
					fieldLabel: 'Версия'
					,name: 'version'
					,labelWidth: 50
				},this.MaterialCombo
				,{				
					fieldLabel: 'Краткое наименование'
					,name: 'short_name'
				}]		
			},{
				xtype: 'container'
				,layout: 'form'
				,defaults: {
					width: 200
				}
				,style: {
         	    	padding: '2px'
        		}
				,defaultType: 'textfield'
				,items:	[
				{
					fieldLabel: 'Станд. время выполнения'
					,name: 'execution_time'
				},{
					fieldLabel: 'Общий рефер. интервал'
					,name: 'gen_ref_interval'
				},{
				   	xtype:'button',
				   	text:'Сохранить',
				   	handler:function(){
				   		//this.fireEvent('baseservicesave',this.record);
				   		if(this.record) { 
				   			this.getForm().updateRecord(this.record);				   			
				   		}
				   	},
				   	scope:this
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

}); //end of baseServiceForm

Ext.reg('baseserviceform', App.service.BaseServiceForm);
		