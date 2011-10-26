Ext.ns('App.service');

App.service.ExtendedServiceGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function(){
///////////////////// Extended Service GRID configuration////////////////
		this.positionStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: get_api_url('position')
			})					
			,reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
			},[
				{ name : 'id'}
				,{ name: 'name'}
				,{ name: 'resource_uri'}
			])
			,autoSave: false
			,autoLoad: true
			
		});
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
					,{name : 'staff'}
					,{name : 'tube'}
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
			,listeners: {
				save: function() {
					this.ExtendedGridStore.load()
				}
        		,beforesave: function(store,data) {        			
        			if (data.update) {	        			
	        			var staff = data.update[0].get("staff");
	        			var i = 0;	        			
	        			if (staff[0].constructor == Array) {
		        			var uriArray = Array();
		        			while (staff[i]) {	        					        				
		        				var ind = this.positionStore.find("id",staff[i][0]);
		        				uriArray.push(this.positionStore.getAt(ind).get("resource_uri"));	        				        					        			
		        				i++;
		        			}
		        			var recNumb = store.find("id",data.update[0].get("id"));
		        			store.getAt(recNumb).set('staff',uriArray);
	        			}
        			}
        		}
				,scope: this
        	}							
		});	
		config = {	
			loadMask : {
				msg : 'Подождите, идет загрузка...'
			}
			,store: this.ExtendedGridStore
			//,layout: 'fit'
			//,anchor: '-1'
			,viewConfig: {
				getRowClass: function(rec, rowIdx, params, store) {
				    return rec.data.is_active ? '' : 'grey-row-background'
				}
				/*
				getRowClass: (function(rec, rowIdx, params, store) {
					if (this.getSelectionModel().getSelected()) {						
						return rec.get("id") != this.getSelectionModel().getSelected().get("id") ? 'grey-row-background' : 'x-grid3-row-selected';
					} else 
						{return 'grey-row-background'}
			    }).createDelegate(this)*/
			    ,forceFit: true
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

		
