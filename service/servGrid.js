Ext.ns('App.service');

App.service.ServGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function() {

	/*this.proxy = new Ext.data.HttpProxy({  //ScriptTagProxy({
			url: get_api_url('baseservice')
		});
	
	this.reader = new Ext.data.JsonReader({
		totalProperty: 'meta.total_count'
		,successProperty: 'success'
		,messageProperty: 'message'
		,idProperty: 'id'
	  ,root: 'objects'
	},[
		{ name : 'parent'}
		,{ name : 'resource_uri'}
		,{ name: 'name', allowBlank: false }  // !!!!
		,{ name: 'short_name' }
		,{ name: 'code'}						
		,{ name : 'execution_time'}
		,{ name : 'version'}
		,{ name : 'is_group'}
		,{ name : 'material'}
		,{ name : 'material_name'}			
		,{ name : 'gen_ref_interval'} 
	]);
		
	this.writer = new Ext.data.JsonWriter({
    	encode: false 
    	,writeAllFields: true
	});
	
	this.store = new Ext.data.Store({	
  		autoSave: true  		
		,restful: true
		,proxy: this.proxy
    	,reader: this.reader
    	,writer: this.writer    
	  	//,baseParams:  {format:'json' }   //ЗДЕСЬ БЫЛА ПРОБЛЕМА С ЗАГРУЗКОЙ ДАННЫХ
		,paramNames: {
		  start : 'offset'
			,limit : 'limit'
			,sort : 'sort'
			,dir : 'dir'
		}
	});	*/
	
	//this.store = this.store || new App.service.ServiceGridStore({});
		
	this.store = this.store || new Ext.data.RESTStore({
		autoSave: false
		,autoLoad: false
		,apiUrl: get_api_url('baseservice')
		,model: [
			{ name : 'parent'}
			,{ name: 'resource_uri'}
			,{ name: 'name', allowBlank: false }  
			,{ name: 'short_name' }
			,{ name: 'code'}						
			,{ name : 'execution_time'}
			,{ name : 'version'}
			,{ name : 'is_group'}
			,{ name : 'material'}
			,{ name : 'material_name'}			
			,{ name : 'gen_ref_interval'} 
		]
		/*,listeners: {
			save: function() {
				if (this.reloadNeeded) {
					this.store.load();
				}
			}
			,write: function() {
				if (this.reloadNeeded) {
					this.store.load();
				}
			}
			,scope: this
		}*/
	});
	
	//this.reloadNeeded = false;
	
	this.selM = new Ext.grid.CheckboxSelectionModel();
	
	this.columns =  [
				this.selM
			,{
		    	header: "Код", 
		    	width: 50, 
		    	dataIndex: 'code' 		    	
			},{
		    	header: "Наименование", 
		    	width: 450, 
		    	sortable: true, 
		    	dataIndex: 'name'
		    },{
		    	header: "Время выполнения", 
		    	width: 100, 
		    	dataIndex: 'execution_time' 
		    },{   
		     	header: "Материал", 
		    	width: 80, 		 
		    	dataIndex: 'material_name'		    			    	
		    },{
		    	header: "Версия" 
		    	,width: 45
		    	,dataIndex: 'version'
		    	,align: 'right'
		    }/*,{
		    	header: "Краткое наименование", 
		    	width: 80, 
		    	sortable: true,
		    	hidden: true,
		    	dataIndex: 'short_name'
		    } */
		];

		var config = {			
			id: 'serviceAdm-grid'
			,loadMask : {
				msg : 'Подождите, идет загрузка...'
			}			
			,store: this.store
			,columns:this.columns
			,sm : this.selM
			,viewConfig: {
        		forceFit: true
        		,emptyText: 'Нет данных для текущей группы услуг'
			}		 
			/*,bbar: new Ext.PagingToolbar({
	            pageSize: 20,
	            store: this.store,
	            displayInfo: true,
	            displayMsg: 'Показана запись {0} - {1} из {2}',
	            emptyMsg: "Нет записей"
	        })*/
	        ,tbar: [{
	        	xtype: 'button'
	        	,text: 'Новая услуга'
	        	,tooltip:'Добавить новую запись'
            	,iconCls:'silk-add'
            	,ref: '../addButton'
            	,disabled: true
            	,handler: function() {            		
            		this.fireEvent('newrecordclick');
            	}
            	,scope: this	        	
	        },'-',{	        	
				xtype: 'button'
	        	,text: 'Удалить услугу'
	        	,tooltip:'Удалить выбранную запись'
            	,iconCls:'silk-delete'
            	,ref: '../removeButton'
            	,disabled: true
            	,handler: function() {            			
					Ext.MessageBox.show({
			           title:'Удалить запись?'
			           ,width: 300
			           ,msg: 'Вы выбрали удаление услуги. <br />Продолжить?'
			           ,buttons: Ext.MessageBox.YESNO
			           ,fn: function(btn) { 
			           		if (btn == "yes") {    
			           			this.removeButton.setDisabled(true);
			           			//s = this.getSelectionModel().getSelected();           			
			           			s = this.getSelectionModel().getSelections();
			                	this.store.remove(s);           			
			           		}
			           		this.store.save();
			           		this.store.on('save', function() {
								this.load();
							}); 
			           	}
			           	,scope: this
			         	,icon: Ext.MessageBox.QUESTION
			       });
				}
            	//this.fireEvent('deleterecordclick');            	
            	,scope: this	        		        
	        },'-',{
	        	xtype: 'button'
	        	,text: ''
	        	,tooltip:'Переместить услугу выше по таблице'
            	,iconCls:'silk-arrow-up'            	
            	,ref: '../moveHigherBtn'
            	,disabled: true
            	,handler: function() {            		
            		
            	}
            	,scope: this	        	
	        },'-',{
	        	xtype: 'button'
	        	,text: ''
	        	,tooltip:'Переместить услугу ниже по таблице'
            	,iconCls:'silk-arrow-down'
            	,ref: '../moveBelowBtn'
            	,disabled: true
            	,handler: function() {
            		
            	}
            	,scope: this	        	
	        }]
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of ServGrid

Ext.reg('servgrid', App.service.ServGrid);

