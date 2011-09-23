Ext.ns('App.ServAdm');

App.ServAdm.extendedServiceGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function(){
///////////////////// Extended Service GRID configuration////////////////				
		this.extendedGridStore = new Ext.data.Store ({
			reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{ name : 'state_name'}
					,{ name : 'is_active'}
				]
			)
			,writer: new Ext.data.JsonWriter({encode: false})
			,proxy: new Ext.data.ScriptTagProxy({
				url: get_api_url('extendedservice')
			})
			,restful: true
			,autoload: true
		});	
		config = {
			//width: 170
			//,height: 230
			loadMask : {	msg : 'Подождите, идет загрузка...' }			
			,store: this.extendedGridStore
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
		    	header: "Организация"
		    	,width: 100
		    	,sortable: true 
		    	,sizeble: true
		    	,dataIndex: 'state_name'
		    },{
		    	header: "Активно"
		    	,width: 50
		    	,sortable: true
		    	,dataIndex: 'is_active' 
		    	,renderer: function(val) {
		    		flag = val ? 'yes' : 'no';
		    		return "<img src='/media/app/servAdmApp/resources/images/icon-"+flag+".gif'>"
		    	}
		    }]			
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServAdm.extendedServiceGrid.superclass.initComponent.apply(this, arguments);
	}

}); //end of extendedServiceGrid

Ext.reg('extendedservicegrid', App.ServAdm.extendedServiceGrid);

		
