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
					{ name : 'id'}
					,{ name : 'value'}
					,{ name : 'extended_service'}					
					,{ name : 'price_type'}
					,{ name : 'on_date'}
				]
			)
			,writer: new Ext.data.JsonWriter({
				encode: false
				,writeAllFields: true
			})
			,proxy: new Ext.data.HttpProxy({ //ScriptTagProxy({
				url: get_api_url('price')
			})
			,restful: true
		});
		
		this.editor = new Ext.ux.grid.RowEditor({
        	saveText: 'Save'
    	});    	    	
    	
    	this.priceModel = Ext.data.Record.create([{
        	name: 'value',
        	type: 'float'
	    }, {
	        name: 'extended_service',
	        type: 'string'
	    }, {
	        name: 'on_date',
	        type: 'date',
	        dateFormat: 'n/j/Y'
	    },{
	        name: 'price_type',
	        type: 'string'
	    }]);

		
		config = {
			plugins: [this.editor]
			,padding: "0px 0px 0px 2px"
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
		    	,editor : {
		    		xtype: 'datefield'
		    		,maxValue: (new Date()).format('m/d/Y')
		    	}
		    },{
		    	header: "Цена"
		    	,width: 50
				//,allowBlank: false
		    	,sortable: true
		    	,dataIndex: 'value'
		    	,editor: {
		    		xtype: 'textfield'
		    	}
		    },{
		    	header: "Тип цены"
		    	,sortable: true
		    	,dataIndex: 'price_type'		    	
		    	,width: 70		    	
 				,editor : new Ext.form.ComboBox({ 					 					
					allowBlank : false,
					displayField : 'name'
					,valueField : 'short'
					,fieldLabel : 'Тип цены'
					,emptyText : 'укажите тип цены...'
					,triggerAction : 'all'
					,mode : 'local'
					,store : new Ext.data.ArrayStore({
						data : [ ['Розничная','r'], ['Закупочная','z']]
						,fields : ['name', 'short']
					})
					//,name : 'reference'
					//,typeAhead : true
					//,forceSelection : true
					//,lazyRender : true					
				})
		    	,renderer : function(val) {
		    		return val=='r' ? 'розничная' : 'закупочная'
		    	}
		    }]
			,tbar:[{
            	text:'Добавить'
            	,tooltip:'Новая цена'
            	,iconCls:'silk-add'
            	,ref: '../addButton'
            	,disabled: true
            	,handler: function() {					
					var priceRec = new this.priceModel ({
						value : ""
						,extended_service : "/api/v1/dashboard/extendedservice/" + this.store.baseParams.extended_service					
						,price_type : "r"
						,on_date: (new Date()).format('m/d/Y')
					})
					this.editor.stopEditing();
					this.store.insert(0, priceRec);
	                this.getView().refresh();
	                this.getSelectionModel().selectRow(0);
	                this.editor.startEditing(0);
	                this.removeButton.setDisabled(true);
				}
				,scope:this
        	}, '-', {
            	text:'Удалить'
            	,tooltip:'Удалить выбранную запись'
            	,iconCls:'silk-delete'
            	,ref: '../removeButton'
            	,disabled: true
            	/*,handler: function() {
            		// ДОБАВИТЬ УДАЛЕНИЕ ЦЕНЫ!!!!!!!!
            	}
            	,scope:this*/
        	}]        	
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtenServPriceGrid.superclass.initComponent.apply(this, arguments);
		
		this.getSelectionModel().on('rowselect',this.onGridSelect,this);
		this.store.on('load',this.onStoreLoad,this);
	}
	
	,onGridSelect: function() {
		this.removeButton.setDisabled(false);
	}
	,onStoreLoad:  function() {
		this.addButton.setDisabled(false);
		var sm = this.getSelectionModel();
		sm.selectFirstRow();
		if (sm.getCount() == 0 ) { 
			this.removeButton.setDisabled(true);
		}
	}

}); //end of ExtenServPriceGrid

Ext.reg('extenservpricegrid', App.service.ExtenServPriceGrid);

		
