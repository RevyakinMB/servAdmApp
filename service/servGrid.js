Ext.ns('App.service');

App.service.ServGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function() {

	this.proxy = new Ext.data.HttpProxy({  //ScriptTagProxy({
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
		{ name : 'parent'}
		,{ name : 'resource_uri'}
		,{ name: 'name', allowBlank: false }  // !!!!
		,{ name: 'short_name' }
		,{ name: 'code'}						
		,{ name : 'execution_time'}
		,{ name : 'version'}
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
	});	
	
	this.columns =  [
				this.selM
			,{
		    	header: "Код", 
		    	width: 50, 
		    	dataIndex: 'code' 		    	
			},{
		    	header: "Наименование", 
		    	width: 300, 
		    	sortable: true, 
		    	dataIndex: 'name'
		    },{
		    	header: "Время выполнения", 
		    	width: 100, 
		    	dataIndex: 'execution_time' 
		    },{
		    	header: "Версия", 
		    	width: 50, 
		    	dataIndex: 'version' 
		    },{   
		     	header: "Материал", 
		    	width: 80, 		 
		    	dataIndex: 'material_name'		    			    	
		    }/*,{
		    	header: "Краткое наименование", 
		    	width: 80, 
		    	sortable: true,
		    	hidden: true,
		    	dataIndex: 'short_name'
		    },{
		    	header: "Общий референсный интервал", 
		    	width: 95, 
		    	sortable: true, 
		    	hidden: true,
		    	dataIndex: 'gen_ref_interval' 
		    }*/
		];

		var config = {			
			id: 'serviceAdm-grid'
			,forceFit:true
			,loadMask : {
				msg : 'Подождите, идет загрузка...'
			}			
			,store: this.store
			,columns:this.columns
			,sm : this.selM
			,viewConfig: {
        		forceFit: true
			}
		 
			,bbar: new Ext.PagingToolbar({
	            pageSize: 20,
	            store: this.store,
	            displayInfo: true,
	            displayMsg: 'Показана запись {0} - {1} из {2}',
	            emptyMsg: "Нет записей"
	        })
	   /*     ,listeners: {
	        	cellclick: function(grid, rowIndex, columnIndex, e) {
	       			this.fireEvent ('gridcellclick',grid, rowIndex, columnIndex, e);	        	
	      		}	        	
	     	}*/
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of ServGrid

Ext.reg('servgrid', App.service.ServGrid);

