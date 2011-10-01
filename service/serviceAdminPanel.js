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
		this.ServiceGrid.on('newrecordclick', this.onNewServiceClick, this);
		this.ServiceGrid.store.on('load', function() {				
				this.ServiceGrid.getSelectionModel().selectFirstRow();
		}, this);
		
	}
	
	,onNewServiceClick: function() {
		if (!this.ServiceWindow) {
			this.ServiceWindow = new App.service.ServiceWindow ();
		}
		this.ServiceWindow.show();
		this.ServiceWindow.on('hide', function() {
			if (this.ServiceWindow.action == "add") {
				var a = this.ServiceGrid.store.baseParams.parent;
				this.ServiceWindow.MainFormPanel.
							getForm().findField('parent').setValue(
								"/api/v1/dashboard/baseservice/" + a);									
				var p = new this.ServiceGrid.store.recordType();
				this.ServiceWindow.MainFormPanel.getForm().updateRecord(p);
				this.ServiceWindow.AdditionalFormPanel.getForm().updateRecord(p);
				this.ServiceGrid.store.insert(0,p);
				this.ServiceGrid.store.save();
				this.ServiceGrid.store.on('save', function() {
					this.ServiceGrid.store.load();
				},this);
			}
		},this);
	}
	
	,onBaseServiceGridSelect: function(selModel, rowIndex, rec) {				
		this.ServiceGrid.removeButton.setDisabled(false);
		this.InfoTabPanel.BaseServiceForm.setActiveRecord(rec);
		var data = rec.json.resource_uri;		
		this.InfoTabPanel.ExtendedServForm.CombOrganizationStore.load();		
    	this.InfoTabPanel.ExtendedServiceGrid.store.setBaseParam('base_service', App.uriToId(data));
    	this.InfoTabPanel.ExtendedServiceGrid.store.load();
    	this.InfoTabPanel.ExtendedServForm.getForm().findField('base_service').setValue(
    		this.ServiceGrid.getSelectionModel().getSelected().get('resource_uri'));
	}
	
	,onNodeClick : function(node,e) {
		this.ServiceGrid.removeButton.setDisabled(true);
		this.ServiceGrid.store.setBaseParam('parent', node.id);
		this.ServiceGrid.store.load();
		this.ServiceGrid.addButton.setDisabled(false);
	}
});


Ext.reg('serviceadminpanel', App.service.ServiceAdminPanel);
