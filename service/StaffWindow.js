Ext.ns('App.service');
Ext.ns('Ext.ux.form.ItemSelector');

App.service.StaffWindow = Ext.extend(Ext.Window, {
	initComponent : function() {
		
		this.ds = new Ext.data.ArrayStore({
	        data: [[123,'One Hundred Twenty Three'],
	            ['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
	            ['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
	        fields: ['value','text'],
	        sortInfo: {
	            field: 'value',
	            direction: 'ASC'
	        }
	    });
	    
	    this.sourceStore = new Ext.data.RESTStore({
			autoSave: false
			,autoLoad: false
			,apiUrl: get_api_url('position')
			,model: [
				{ name : 'id'}
				,{ name: 'name'}
			//	,{ name: 'resource_uri'}
			]
/*			,sortInfo: {
         		field: 'id'
            	,direction: 'ASC'
	        }*/
		});
		
		this.resultStore = new Ext.data.ArrayStore({
		    fields: ['id','name']
		    ,autoLoad: false
		});      
		
	    this.itemSelect = new Ext.ux.form.ItemSelector ({
    	    name: 'itemselector'
            ,fieldLabel: 'Врачи клиники'
	        ,imagePath: 'resources/images'
            ,multiselects: [{
                width: 250
                ,height: 200
                ,store: this.sourceStore
                ,displayField: 'name'
                ,valueField: 'id'
            },{
                width: 250
                ,height: 200
                ,displayField: 'name'
                ,valueField: 'id'
                ,store: this.resultStore           
                ,tbar:[{
                    text: 'Очистить список'
                    ,handler:function(){
	                    this.isForm.getForm().findField('itemselector').reset();
	                }
	                ,scope: this
                }]
            }]
	    })
	    
		this.isForm = new Ext.form.FormPanel({
	        width:650
	        ,bodyStyle: 'padding:10px;'	        
	        ,items:[this.itemSelect]
	
	        ,buttons: [{
	            text: 'Сохранить'
	            ,iconCls:'silk-accept'
	            ,handler: function(){	      
	            	this.action = 'save';
	            	this.close();
	            }	           
	            ,scope: this
	        },{
	            text: 'Отменить'
	            ,iconCls:'silk-cancel'
	            ,handler: function(){
	            	this.action = 'cancel';
	                this.close();
	            }
	            ,scope: this
	        }]
		});							
		
		config = {
			closable: true
			,is: 'staffwindow'
			,title: 'Выбор врачей, ответственных за выполнение услуги' 
			,height: 310
			,width: 680
			,border: true
			,layout: 'form'	
			,layoutConfig : {
				animate : true
			}
			,items : [this.isForm]			
		}		
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.StaffWindow.superclass.initComponent.apply(this, arguments);	
	}
		
});

Ext.reg('staffwindow', App.service.StaffWindow); 