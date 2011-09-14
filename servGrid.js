Ext.ns('App.ServAdm');

var myData = [
	['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am']
	,['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am']
	,['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am']
	,['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am']
	];
	var sm = 
	App.ServAdm.servGrid = Ext.extend(Ext.grid.GridPanel, {
		initComponent : function() {
		this.id = Ext.id();
		var selM = new Ext.grid.CheckboxSelectionModel();
		var config = {	    
			store : new Ext.data.Store({
				reader : new Ext.data.ArrayReader({}, [
	      	{name: 'company' }
	        ,{name: 'price', type: 'float'}
	        ,{name: 'change', type: 'float'}
	        ,{name: 'pctChange', type: 'float'}
	        ,{name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
	    	])
			,proxy: new Ext.data.MemoryProxy(myData) 
			}) 
			,cm: new Ext.grid.ColumnModel({
				columns: [
					selM
					,{id :'company', header : 'Company', width : 160, sortable : true, dataIndex: 'company'	}
					,{header : 'Price', width : 75, sortable : true,  dataIndex: 'price'}
					,{header : 'Change',width : 75,	sortable : true,	dataIndex: 'change'	}
					,{header : '% Change',	width : 75,	sortable : true,dataIndex: 'pctChange'}
					,{header : 'Last Updated',width : 85,	sortable : true,renderer : Ext.util.Format.dateRenderer('m/d/Y'),	dataIndex: 'lastChange'	}] 
			}) // end of ColumnModel
			,sm: selM
			,title: 'Examp Grid'
			,iconCls:'icon-grid'	
      ,columnLines: true
		}; //end of config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServAdm.servGrid.superclass.initComponent.apply(this, arguments);
	} //end of initComponent
	,onRender:function() {
		this.store.load();
		App.ServAdm.servGrid.superclass.onRender.apply(this, arguments);
	} 
}); //end of servGrid

Ext.reg('servgrid', App.ServAdm.servGrid);
