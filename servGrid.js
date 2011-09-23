Ext.ns('App.ServAdm');

App.ServAdm.servGrid = Ext.extend(Ext.grid.GridPanel, {
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
		{ name : 'parent'}
		,{ name: 'name' } 
		,{ name: 'short_name'}
		,{ name: 'code'}						
		,{ name : 'execution_time'}
		,{ name : 'version'}
		,{ name : 'material'}
		,{ name : 'gen_ref_interval'} 
	]);
		
	this.writer = new Ext.data.JsonWriter({
    	encode: false 
	});
	
	this.store = new Ext.data.Store({				
   		autoLoad:true
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
	
/*	this.store = new Ext.data.Store({
        proxy: new Ext.data.ScriptTagProxy({
            url: get_api_url('baseservice')
        }),
        autoLoad:true,
        reader: new Ext.data.JsonReader({
                    totalProperty: 'meta.total_count',
                    successProperty: 'success',
                    idProperty: 'id',
                    root: 'objects',
                    messageProperty: 'message'
                }, [
                    {name: 'id'},
                    {name: 'name'}
                ])
    }); */
	
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
			,bbar: new Ext.PagingToolbar({
	            pageSize: 20,
	            store: this.store,
	            displayInfo: true,
	            displayMsg: 'Показана запись {0} - {1} из {2}',
	            emptyMsg: "Нет записей"
	        })
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServAdm.servGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of servGrid

Ext.reg('servgrid', App.ServAdm.servGrid);

