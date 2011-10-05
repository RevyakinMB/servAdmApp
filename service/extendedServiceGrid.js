Ext.ns('App.service');

App.service.ExtendedServiceGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function(){
///////////////////// Extended Service GRID configuration////////////////				
		this.ExtendedGridStore = new Ext.data.Store ({
			reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{ name: 'id'}
					,{name : 'state_name'}
					,{name : 'base_service'}
					,{name : 'state', allowBlank: false}
					,{name : 'is_active'}									
					,{name: 'is_manual'}
					,{name: 'state'}
					,{name: 'tube_count'}					
				]
			)
			,writer: new Ext.data.JsonWriter({
				encode: false
				,writeAllFields: true
			})
			,proxy: new Ext.data.HttpProxy({ //ScriptTagProxy({
				url: get_api_url('extendedservice')
			})
			,restful: true
			,autoSave: false
		});	
		config = {											
			store: this.ExtendedGridStore
			,viewConfig: {
        		forceFit: true
			}
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
		    	,width: 150
		    	,sortable: true 
		    	,sizeble: true
		    	,dataIndex: 'state_name'
		    },{
		    	header: "Активно"
		    	,width: 60
		    	,sortable: true
		    	,dataIndex: 'is_active' 
		    	,renderer: function(val) {
		    		flag = val ? 'yes' : 'no';
		    		return "<img src='/media/app/servAdmApp/resources/images/icon-"+flag+".gif'>"
		    	}
		    }]
	    	,tbar:[{
            	text:'Добавить'
            	,tooltip:'Новая расш. услуга'
            	,iconCls:'silk-add'
            	,ref: '../addButton'
            	,disabled: true
            	,handler: function() {				
					this.fireEvent ('newrecordclick');
				}
				,scope:this
        	}, '-', {
            	text:'Удалить'
            	,tooltip:'Удалить выбранную запись'
            	,iconCls:'silk-delete'
            	,ref: '../removeButton'
            	,disabled: true
            	,handler: function() {				
					this.fireEvent ('deleterecordclick');
				}
				,scope:this
        	}]

		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtendedServiceGrid.superclass.initComponent.apply(this, arguments);
				
	}

}); //end of ExtendedServiceGrid

Ext.reg('extendedservicegrid', App.service.ExtendedServiceGrid);

		
