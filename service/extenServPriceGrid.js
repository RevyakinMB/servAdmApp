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
					,{ name : 'on_date'}//, type: 'date', dateFormat: 'd/m/Y'}
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
			,autoSave: false
		});
		
		/*Ext.util.Format.CurrencyFactory = function(c, d, t, s) {
			return function(n) {
				var m = (c = Math.abs(c) + 1 ? c : 2, d = d || ",", t = t || ".",/(\d+)(?:(\.\d+)|)/.exec(n + "")), x = m[1].length > 3 ? m[1].length % 3 : 0;
				return ((x ? m[1].substr(0, x) + t : "") + m[1].substr(x).replace(/(d{3})(?=d)/g,"$1" + t) + (c ? d + (+m[2] || 0).toFixed(c).substr(2) : ""))+" "+s;
			}
		}*/
		
		Ext.util.Format.CurrencyFactory = function(dp, dSeparator, tSeparator, symbol) {
		    return function(n) {
		        dp = Math.abs(dp) + 1 ? dp : 2;
		        dSeparator = dSeparator || ".";
		        tSeparator = tSeparator || ",";
		
		        var m = /(\d+)(?:(\.\d+)|)/.exec(n + ""),
		            x = m[1].length > 3 ? m[1].length % 3 : 0;
		
		        return (n < 0? '-' : '') // preserve minus sign
		                + (x ? m[1].substr(0, x) + tSeparator : "")
		                + m[1].substr(x).replace(/(\d{3})(?=\d)/g, "$1" + tSeparator)
		                + (dp? dSeparator + (+m[2] || 0).toFixed(dp).substr(2) : "")
		                + " " + symbol;
		    };
		};

		//var euroFormatter = Ext.util.Format.CurrencyFactory(2, ",", ".", "€")
		
		this.editor = new Ext.ux.grid.RowEditor({        	
        	saveText  : "Сохранить"
  			,cancelText: "Отменить"
  			,clicksToEdit: 1
  			,errorSummary: false 
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
	        dateFormat: 'j/n/Y'
	    },{
	        name: 'price_type',
	        type: 'string'
	    }]);

		
		config = {
			loadMask : {
				msg : 'Подождите, идет загрузка...'
			}
			,plugins: [this.editor]
			,padding: "0px 0px 0px 2px"
			,viewConfig: {
        		forceFit: true
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
		    	,width: 110
		    	,sortable: true 
		    	,sizeble: true
		    	,dataIndex: 'on_date'
		    	,renderer : Ext.util.Format.dateRenderer('d/m/Y')
		    	,editor : {
		    		xtype: 'datefield'
		    		,allowBlank: false
                	,format: 'd/m/Y'
		    		,maxValue: (new Date()).format('d/m/Y')
		    	}
		    },{
		    	header: "Цена"
		    	//,width: 60
				//,allowBlank: false
		    	,sortable: true
		    	,dataIndex: 'value'
		    	,renderer : Ext.util.Format.CurrencyFactory(2, ",", ".", "")
		    	,editor: {
		    		xtype: 'textfield'
		    		,allowBlank: false
		    	}
		    },{
		    	header: "Тип цены"
		    	,sortable: true
		    	,dataIndex: 'price_type'		    	
		    	,width: 80		    	
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
						value : "1000"
						,extended_service : "/api/v1/dashboard/extendedservice/" + this.store.baseParams.extended_service					
						,price_type : "r"
						,on_date: (new Date()).format('d/m/Y')
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
            	,handler: function () {
					Ext.MessageBox.show({
			           title:'Удалить запись?'
			           ,msg: 'Вы выбрали удаление цены. <br />Продолжить?'
			           ,buttons: Ext.MessageBox.YESNO
			           ,fn: function(btn) { 
			           		if (btn == "yes") {    
			           			this.removeButton.setDisabled(true);
			           			s = this.getSelectionModel().getSelected();           			
			                	this.store.remove(s);           			
			           		}
			           		this.store.save();
			           		this.store.on('save', function() {
			           			//this.getView().refresh();
								this.load();
							}); 
			           	}
			           	,scope: this
			         	,icon: Ext.MessageBox.QUESTION
			       });
				}
            	,scope:this
        	}]        	
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ExtenServPriceGrid.superclass.initComponent.apply(this, arguments);
		
		this.getSelectionModel().on('rowselect',this.onGridSelect,this);
		this.store.on('load',this.onStoreLoad,this);
		this.editor.on({
  			scope: this,
  			afteredit: function(roweditor, changes, record, rowIndex) {
				this.PriceGridStore.save();				
  			}
  			,canceledit: function() {
				this.editor.stopEditing();
				s = this.getSelectionModel().getSelected();
				if (s.phantom) {
					this.store.remove(s);
	                this.getView().refresh();
	                this.getSelectionModel().selectRow(0);
				}
  			}
		});
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

		
