Ext.ns('App.service');

App.service.ServiceWindow = Ext.extend(Ext.Window, {
	initComponent : function() {
		
		this.MaterialCombo = new App.service.MaterialCombo({
		//width: 120
			anchor: '-5'
			,boxMaxWidth : 120
		});
		
		this.MainFormPanel = new Ext.form.FormPanel({ 
			//title: 'Основное'
			bodyStyle: 'padding: 5px'			
			,defaultType: 'textfield'
			,labelWidth: 85
			,bodyStyle: {
    			background: 'transparent'
    			,padding: '5px'
			}
			,defaults: {anchor: '-10'}
			,items:	[
			{
				fieldLabel: 'Наименование'
				,name: 'name'
				,allowBlank: false
				,emptyText: 'Введите наименование услуги'
			},{				
				fieldLabel: 'Кратко'
				,allowBlank: false
				,name: 'short_name'
				,emptyText: 'Введите краткое наименование'
			},{
				xtype: 'hidden'
				,name: 'parent'
			}]
		});
		
		this.AdditionalFormPanel = new Ext.form.FormPanel({					
			bodyStyle: 'padding: 5px'
			,defaultType: 'textfield'
			,labelWidth: 85
			,bodyStyle: {
    			background: 'transparent'
    			,padding: '5px'
			}			
			,items:	[
			{
				xtype: 'container'
				,border: false
				,anchor: '-10'						
				,layout: 'column'
				,items: [ 
				{
					xtype: 'container'
					//,width: 230
					,columnWidth: .5
					,layout: 'form'
					,items:[this.MaterialCombo]							
				},{
					xtype: 'container'
					//,width: 180
					,columnWidth: .5
					,layout: 'form'
					,items:[
					{
						xtype: 'textfield'
						,fieldLabel: 'Станд. время выполнения'
						,name: 'execution_time'
						,anchor: '0'
					}]							
				}]											
			},{
				fieldLabel: 'Код'
				,name: 'code'
				,width: 120
			},{
				xtype: 'textarea'
				,anchor: '-10'
				,fieldLabel: 'Общий рефер. интервал'
				,name: 'gen_ref_interval'
			}]
		});
				
		this.ParentChoiceFormPanel = new Ext.form.FormPanel({ 			
			labelWidth: 85
			,bodyStyle: {
    			background: 'transparent'
    			,padding: '5px'
			}
			,defaults: {anchor: '-10'}				
			,items:	[{    	            
				xtype: 'checkbox'
				,name: 'is_root'
				,boxLabel: 'Группа верхнего уровня'
				,labelSeparator: ''
				,checked: false
				,handler: function(el, checked) {
					var textF = this.ParentChoiceFormPanel.getForm().findField('name'); 
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
		
		config = {

			closable: true
			,title: 'Добавление новой услуги' 
			,height: 270
			,width: 470
			,border: true //check
			,layout: 'form'	
			,layoutConfig : {
				animate : true
			}
			,items : [
				this.MainFormPanel
				,this.AdditionalFormPanel
				,this.ParentChoiceFormPanel
				,new Ext.Container({
					layout: 'hbox'
					,style: {
			            padding: '5px'
			        }
					,layoutConfig:	{pack: 'end' }
					,items: [{
						xtype: 'button'	
						,text: 'Сохранить'
						,iconCls:'silk-add'
						,handler: function() {
							if (this.MainFormPanel.getForm().isValid() &&
							  this.AdditionalFormPanel.getForm().isValid() ) {
								this.action = 'add';
								this.close();
							}
						}				
						,scope: this
					},{
						xtype: 'button'	
						,text: 'Отмена'
						,iconCls:'silk-cancel'
						,handler: function() {
							this.action = 'cancel';
							this.close();
						}				
						,scope: this
					}]
				})
			]
		}		
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServiceWindow.superclass.initComponent.apply(this, arguments);	
	}
		
});

Ext.reg('servicewindow', App.service.ServiceWindow); 