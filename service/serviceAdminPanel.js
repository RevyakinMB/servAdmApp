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
			,anchor: '100% 45%'
			,frame: true			
		});
		
		this.InfoTabPanel = new App.service.InfoTabPanel ({
			anchor: '100% 55%'			
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
            	callback: function(data) {
            		this.TreePanel.getRootNode().appendChild(data);
            	},
            	scope:this
			})            
		},this);
		
		this.TreePanel.on('nodeClick',this.onNodeClick,this);
		this.ServiceGrid.getSelectionModel().on('rowselect',this.onBaseServiceGridSelect,this);
	}
	
	,onBaseServiceGridSelect: function(selModel, rowIndex, rec) {
				
		this.InfoTabPanel.BaseServiceForm.setActiveRecord(rec);
		var data = rec.json.resource_uri;		
		this.InfoTabPanel.ExtendedServForm.CombOrganizationStore.load();		
    	this.InfoTabPanel.ExtendedServiceGrid.store.setBaseParam('base_service', App.uriToId(data));
    	this.InfoTabPanel.ExtendedServiceGrid.store.load();
    	this.InfoTabPanel.ExtendedServForm.getForm().findField('base_service').setValue(
    		this.ServiceGrid.getSelectionModel().getSelected().get('resource_uri'));
	}
	
	,onNodeClick : function(node,e) {
		this.ServiceGrid.store.setBaseParam('parent', node.id);
		this.ServiceGrid.store.load();
	}
});


Ext.reg('serviceadminpanel', App.service.ServiceAdminPanel);
