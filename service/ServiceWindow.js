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
				,allowBlank: false
				,name: 'short_name'
				,emptyText: 'required'
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
				
		this.ParentChoiceForm = new Ext.form.FormPanel({ 			
			bodyStyle: 'padding: 5px'
			,labelWidth: 85
			,frame: true
			,defaults: {anchor: '-10'}				
			,items:	[{    	            
				xtype: 'checkbox'
				,name: 'is_root'
				,boxLabel: 'Группа верхнего уровня'
				,labelSeparator: ''
				,checked: false
				,handler: function(el, checked) {
					var textF = this.ParentChoiceForm.getForm().findField('name'); 
					if (checked) {
						textF.disable()
					} else {
						textF.enable()
					}
				}
				,scope: this
			},{
				xtype: 'textfield'
				,name: 'name'
				,fieldLabel: 'Группа'				
			},{
				xtype: 'hidden'
				,name: 'parent_group'				
			}]
		});
		
		this.ParentChoicePanel = new Ext.Panel ({			
			title: 'Выберите родительскую группу'
			,frame: true
			,items: [this.ParentChoiceForm]			
		});		
		
		config = {

			closable: false
			,title: 'Добавление новой услуги' 
			,height: 280
			,width: 270
			,border: true //check
			,layout: 'accordion'
			//,modal: true			
			,layoutConfig : {
				animate : true
			}
			,items : [
				this.MainFormPanel
				,this.AdditionalFormPanel
				,this.ParentChoicePanel
			]
			,tbar: [{
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
			},'-',{
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