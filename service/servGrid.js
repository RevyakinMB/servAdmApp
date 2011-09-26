Ext.ns('App.service');

App.service.ServGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function() {

	this.proxy = new Ext.data.ScriptTagProxy({
			url: get_api_url('baseservice')
		});

	this.selM = new Ext.grid.CheckboxSelectionModel();	
	
	this.reader = new Ext.data.JsonReader({
		totalProperty: 'meta.total_count'
		,successProperty: 'success'
		,messageProperty: 'message'
		,idProperty: 'id'
	  ,root: 'objects'
	},[
		{ name : 'parent', allowBlank: true}
		,{ name: 'name', allowBlank: true } 
		,{ name: 'short_name', allowBlank: true}
		,{ name: 'code', allowBlank: true}						
		,{ name : 'execution_time', allowBlank: true}
		,{ name : 'version', allowBlank: true}
		,{ name : 'material', allowBlank: true}
		,{ name : 'gen_ref_interval', allowBlank: true} 
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
	});	
	
	this.columns =  [
				this.selM
				,{
		    	header: "Наименование", 
		    	width: 200, 
		    	sortable: true, 
		    	dataIndex: 'name'
		    },{
		    	header: "Краткое наименование", 
		    	width: 80, 
		    	sortable: true,
		    	hidden: true,
		    	dataIndex: 'short_name'
		    },{   
		     	header: "Материал", 
		    	width: 80, 		 
		    	dataIndex: 'material'		    			    	
		    },{
		    	header: "Код", 
		    	width: 50, 
		    	dataIndex: 'code' 		    	
		    },{
		    	header: "Стандартное время выполнения", 
		    	width: 70, 
		    	dataIndex: 'execution_time' 
		    },{
		    	header: "Версия", 
		    	width: 50, 
		    	dataIndex: 'version' 
		    },{
		    	header: "Общий референсный интервал", 
		    	width: 75, 
		    	sortable: true, 
		    	dataIndex: 'gen_ref_interval' 
		    }
		];

		var config = {			
			id: 'serviceAdm-grid'
			
			,loadMask : {
				msg : 'Подождите, идет загрузка...'
			}
			//,border : false
			,store: this.store
			,columns:this.columns
			,sm : this.selM
	//		,rowselect: function(sm, row, rec) {
    //                	this.fireEvent('serviceselect', rec); }
			,tbar: [new Ext.Button({
				text: "save it"
				,handler: function() {
					this.store.save();
				}
				,scope: this
			})]
			,bbar: new Ext.PagingToolbar({
	            pageSize: 20,
	            store: this.store,
	            displayInfo: true,
	            displayMsg: 'Показана запись {0} - {1} из {2}',
	            emptyMsg: "Нет записей"
	        })	        
	        ,listeners: {
	        	cellclick: function(grid, rowIndex, columnIndex, e) {
	        		this.fireEvent ('gridcellclick',grid, rowIndex, columnIndex, e);	        	
	        	}	        	
	        }
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of ServGrid

Ext.reg('servgrid', App.service.ServGrid);

