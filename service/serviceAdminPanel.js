Ext.ns('App.ServicePanel');
Ext.ns('App.service');
Ext.ns('Ext.ux');

App.service.ServiceAdminPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {

		this.TreePanel = new App.ServicePanel.Tree({
			layout: 'fit'
			,region:'west'
			,width:220 
			,collapsible:true
			,collapseMode:'mini'
			,split:true
		})
				
		this.ServiceGrid = new App.service.ServGrid ({
			id:'grid'
			,anchor: '100% 55%'
			,frame: true			
		});
		
		this.InfoTabPanel = new App.service.InfoTabPanel ({
			anchor: '100% 45%'			
		});
		
		var config = {
			id: 'ServiceAdminPanel_id'
			,frame: true
			,title: 'Управление услугами'
			,layout: 'border'	
     		,items: [
				this.TreePanel,
				{
				xtype: 'panel'
				,region:'center'
     			,border:false
				,layout: 'anchor'
	    		,items: [
	    			this.ServiceGrid
	    			,this.InfoTabPanel
	    		]}
			]
		}
								
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.ServiceAdminPanel.superclass.initComponent.apply(this, arguments);
		
		this.on('afterrender', function(){
			Ext.ux.JSONP.request('http://dev.medhq.ru/webapp/service/groups/', {
            	callbackKey: 'cb',
            //params: {
            //},
            	callback: function(data) {
            		this.TreePanel.getRootNode().appendChild(data);
            	},
            	scope:this
			})
            
		},this);
		
		this.TreePanel.on('nodeClick',this.onNodeClick,this);
		this.ServiceGrid.on('gridcellclick',this.onBaseServGridCellClick,this);
//		this.InfoTabPanel.BaseServiceForm.on('baseservicesave',this.onBaseServiceSave,this);
	}
	,onBaseServGridCellClick: function(grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);  // Get the Record
		
		this.InfoTabPanel.BaseServiceForm.setActiveRecord(record);
		
		var data = record.json.resource_uri;
    	this.InfoTabPanel.ExtendedServiceGrid.store.setBaseParam('base_service', App.uriToId(data));
    	this.InfoTabPanel.ExtendedServiceGrid.store.load();
	}
/*	,onBaseServiceSave: function(rec) {
		if(rec) { 
			this.InfoTabPanel.BaseServiceForm.getForm().updateRecord(rec);
			this.ServiceGrid.store.save();
		} 
	} */
	
	,onNodeClick : function(node,e) {
		this.ServiceGrid.store.setBaseParam('parent', node.id);
		this.ServiceGrid.store.load();
	}
});


Ext.reg('serviceadminpanel', App.service.ServiceAdminPanel);
