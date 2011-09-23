Ext.ns('App.service');

App.service.ExtenServPriceGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function(){
///////////////////// Extended Service Prices GRID configuration////////////////		
		this.PriceGridStore = new Ext.data.Store ({
			reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{ name : 'value'}
					,{ name : 'on_date'}
				]
			)
			,writer: new Ext.data.JsonWriter({encode: false})
			,proxy: new Ext.data.ScriptTagProxy({
				url: get_api_url('price')
			})
			,restful: true
		});
		
		config = {	
			padding: "0px 0px 0px 2px"
			,loadMask : {
				msg : 'Подождите, идет загрузка...'
			}
			,store: this.PriceGridStore
			,sm : new Ext.grid.RowSelectionModel({
				singleSelect : true
			})
			,paramNames: {
		 		 start : 'offset'
				,limit : 'limit'
				,sort : 'sort'
				,dir : 'dir'
			}	
			,columns:[
			{
		    	header: "Дата"
		    	,width: 70
		    	,sortable: true 
		    	,sizeble: true
		    	,dataIndex: 'on_date'
		    	,renderer : Ext.util.Format.dateRenderer('m/d/Y') 
		    },{
		    	header: "Цена"
		    	,width: 70
		    	,sortable: true
		    	,dataIndex: 'value' 
		    }]			
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtenServPriceGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of ExtenServPriceGrid

Ext.reg('extenservpricegrid', App.service.ExtenServPriceGrid);

		
