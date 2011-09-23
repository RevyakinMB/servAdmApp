Ext.ns('App.service');

App.service.BaseServiceForm = Ext.extend(Ext.form.FormPanel, {
	initComponent : function(){
				
		this.ComboGroupStore = new Ext.data.Store({
        	proxy: new Ext.data.ScriptTagProxy({
            	url: get_api_url('baseservice')
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
			
		this.GroupCombo = new Ext.form.ComboBox({

			store: this.ComboGroupStore
			,displayField: 'name'
			,fieldLabel: 'Группа'
			,allowBlank: true			
			,valueField: 'id'
			,hiddenName: 'groupId'
			,loadingText: 'Загрузка...'
			//,lazyRender:true
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
					,allowBlank: false
				},
					this.GroupCombo
				,{
					fieldLabel: 'Код'
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
					,labelWidth: 50
				},{	
					//xtype: 'combo'
					fieldLabel: 'Материал'
					//store: this.comboGroupStore
					//,displayField: 'name'
					//,triggerAction: 'all'				
				},{				
					fieldLabel: 'Краткое наименование'
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
				},{
					fieldLabel: 'Общий рефер. интервал'
				}]
			}]
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.BaseServiceForm.superclass.initComponent.apply(this, arguments);
	}

}); //end of baseServiceForm

Ext.reg('baseserviceform', App.service.BaseServiceForm);
		