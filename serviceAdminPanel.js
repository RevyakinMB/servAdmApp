Ext.ns('App.ServAdm');
Ext.ns('Ext.ux');

App.ServAdm.serviceAdminPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {

		this.treePanel = new App.ServicePanel.Tree({
			layout: 'fit'
			,region:'west'
			,width:220 
			,collapsible:true
			,collapseMode:'mini'
			,split:true
		})
				
		this.serviceGrid = new App.ServAdm.servGrid ({
			id:'grid'
			,anchor: '100% 40%'
			,frame: true			
		});
		
		this.infoTabPanel = new App.ServAdm.infoTabPanel ({
			anchor: '100% 60%'			
		});
		
		var config = {
			id: 'serviceAdminPanel_id'
			,frame: true
			,title: 'Управление услугами'
			,layout: 'border'	
     		,items: [
				this.treePanel,
				{
				xtype: 'panel'
				,region:'center'
     			,border:false
				,layout: 'anchor'
	    		,items: [
	    			this.serviceGrid
	    			,this.infoTabPanel
	    		]}
			]
		}
								
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServAdm.serviceAdminPanel.superclass.initComponent.apply(this, arguments);
		
		this.on('afterrender', function(){
			Ext.ux.JSONP.request('http://dev.medhq.ru/webapp/service/groups/', {
            	callbackKey: 'cb',
            //params: {
            //},
            	callback: function(data) {
            		this.treePanel.getRootNode().appendChild(data);
            	},
            	scope:this
			})
            
		},this);
		
		this.treePanel.on('nodeClick',this.onNodeClick,this);		
		
	}
	,onNodeClick : function(node,e) {
		//Ext.Msg.alert('msg',node.id)
		this.serviceGrid.store.setBaseParam('id', node.id);
		this.serviceGrid.store.load();
	}
});


Ext.reg('serviceadminpanel', App.ServAdm.serviceAdminPanel);
