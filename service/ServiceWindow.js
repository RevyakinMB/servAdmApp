Ext.ns('App.service');

App.service.ServiceWindow = Ext.extend(Ext.Window, {
	initComponent : function() {
		
		this.MaterialCombo = new App.service.MaterialCombo({});
		
		this.MainFormPanel = new Ext.form.FormPanel({ 
			title: 'Основное'
			,bodyStyle: 'padding: 5px'
			//,autoHeight: true
			,defaultType: 'textfield'
			,labelWidth: 85
			,frame: true
			,defaults: {
				anchor: '-10'				
				//,width: 150
			}				
			,items:	[
			{
				fieldLabel: 'Наименование'
				,name: 'name'
				,allowBlank: false
				,emptyText: 'required'
			},{				
				fieldLabel: 'Кратко'
				,name: 'short_name'
			},{
				fieldLabel: 'Код'
				,name: 'code'
			},{
				xtype: 'hidden'
				,name: 'parent'
			}]
		});
		
		this.AdditionalFormPanel = new Ext.form.FormPanel({					
			title: 'Дополнительно'
			,bodyStyle: 'padding: 5px'

			//,autoHeight: true
			,defaultType: 'textfield'
			,labelWidth: 85
			,frame: true
			,defaults: {
				anchor: '-10'				
				//,width: 100
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
		});
		
		config = {
			modal: true
			,title: 'Добавление новой услуги' 
			,height: 250
			,width: 250
			,border: false //check
			,layout: 'accordion'
			,layoutConfig : {
				animate : true
			}
			,items : [
				this.MainFormPanel
				,this.AdditionalFormPanel
			]
			,bbar: [{
				xtype: 'button'	
				,text: 'Сохранить'
				,iconCls:'silk-add'
				,handler: function() {
					if (this.MainFormPanel.getForm().isValid() &&
					  this.AdditionalFormPanel.getForm().isValid() ) {
						this.action = 'add';
						this.hide();
					}
				}				
				,scope: this
			},{
				xtype: 'button'	
				,text: 'Отмена'
				,iconCls:'silk-cancel'
				,handler: function() {
					this.action = 'cancel';
					this.hide();
				}				
				,scope: this
			}]
		}		
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServiceWindow.superclass.initComponent.apply(this, arguments);	
	}
	
});

Ext.reg('servicewindow', App.service.ServiceWindow); 