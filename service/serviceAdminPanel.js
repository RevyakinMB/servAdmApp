Ext.ns('App.ServicePanel');
Ext.ns('App.service');
Ext.ns('Ext.ux');

App.service.ServiceAdminPanel = Ext.extend(Ext.Panel, {
	initComponent : function() {

		this.TreePanel = new App.ServicePanel.Tree({
			layout: 'fit'
			,region:'west'
			,width:250 
			,collapsible:true
			,collapseMode:'mini'
			,split:true
		})
				
		this.ServiceGrid = new App.service.ServGrid ({
			id:'grid'
			,anchor: '100% 51%'
			,frame: true			
		});
		
		this.InfoTabPanel = new App.service.InfoTabPanel ({
			anchor: '100% 49%'			
		});
		
		this.TreePanelManageStore = this.TreePanelManageStore || new Ext.data.RESTStore({
			autoSave: false
			,autoLoad: false
			,apiUrl: get_api_url('baseservice')
			,model: [
				{ name : 'parent'}
				,{ name: 'resource_uri'}
				,{ name: 'name', allowBlank: false }  // !!!!
				,{ name: 'short_name' }
				,{ name: 'code'}						
				,{ name : 'execution_time'}
				,{ name : 'version'}
				,{ name : 'is_group'}
				,{ name : 'material'}
				,{ name : 'material_name'}			
				,{ name : 'gen_ref_interval'} 
			]
		});
		
		var config = {
			id: 'ServiceAdminPanel_id'
			,title: 'Управление услугами'
			,layout: 'border'	
     		,items: [
				this.TreePanel,
				{
				xtype: 'panel'
				,id: 'servicecenterpanel'
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
		this.TreePanel.on('servicegroupadd',this.onServiceGroupAddClick,this);
		this.ServiceGrid.getSelectionModel().on('selectionchange',this.onBaseServiceGridSelect,this);
		this.ServiceGrid.on('newrecordclick', this.onNewServiceClick, this);
		this.ServiceGrid.store.on('load', function() {				
				this.ServiceGrid.getSelectionModel().selectFirstRow();
				if (this.ServiceGrid.getSelectionModel().getCount() == 0 ) {
					this.InfoTabPanel.setActiveTab(0);
					this.InfoTabPanel.disable();
				} else {
					this.InfoTabPanel.enable();
				}
				
		}, this);
		this.InfoTabPanel.on('formsave',this.onFormSave,this);				
	}
	
	,onFormSave: function () {
		if (this.InfoTabPanel.getActiveTab().title == 'Расширенные услуги') {
			if ( this.InfoTabPanel.ExtendedServForm.record && 
			  this.InfoTabPanel.ExtendedServForm.getForm().isValid() ) { 
			   	this.InfoTabPanel.ExtendedServForm.getForm().updateRecord(this.InfoTabPanel.ExtendedServForm.record);
				this.InfoTabPanel.ExtendedServiceGrid.store.save();
			}			
		} else {
			if (this.InfoTabPanel.BaseServiceForm.record && 
			  this.InfoTabPanel.BaseServiceForm.getForm().isValid() ) { 
			   	this.InfoTabPanel.BaseServiceForm.getForm().updateRecord(this.InfoTabPanel.BaseServiceForm.record);
				this.ServiceGrid.store.save();
			}
		}				
	}
	
	,onServiceGroupAddClick : function () {
		this.TreePanel.addButton.setDisabled(true);
		this.ServiceWindow = new App.service.ServiceWindow ();
		this.ServiceWindow.AdditionalFormPanel.setVisible(false);
		if (this.TreePanel.activeNode) {
			this.ServiceWindow.ParentChoiceFormPanel.getForm().
					findField('name').setValue(this.TreePanel.activeNode.text);
			this.ServiceWindow.ParentChoiceFormPanel.getForm().
					findField('parent_group').setValue("/api/v1/dashboard/baseservice/" + this.TreePanel.activeNode.id);
		}							
		Ext.getCmp("servicecenterpanel").disable();
		this.ServiceWindow.setTitle('Добавление новой группы услуг');
		this.ServiceWindow.show();
		this.ServiceWindow.on('beforeclose', function() {
			Ext.getCmp("servicecenterpanel").enable();
			this.TreePanel.addButton.setDisabled(false);
			if (this.ServiceWindow.action == "add") {
				
				var p = new this.ServiceGrid.store.recordType();
				this.ServiceWindow.MainFormPanel.getForm().updateRecord(p);
				
				if (!this.ServiceWindow.ParentChoiceFormPanel.getForm().findField('is_root').getValue()) {								
					p.set('parent', this.ServiceWindow.ParentChoiceFormPanel.getForm().
							findField('parent_group').getValue() );
				}
				p.set('is_group', true); 
				this.TreePanelManageStore.insert(0,p);							
				this.TreePanelManageStore.save();
			}
		},this);
		
	}
	
	,onNewServiceClick: function() {
		this.ServiceWindow = new App.service.ServiceWindow ();
		this.ServiceWindow.ParentChoiceFormPanel.setVisible(false);
		this.disable();
		this.TreePanel.addButton.setDisabled(true);
		 		
		this.ServiceWindow.setTitle('Добавление новой услуги');		
		this.ServiceWindow.show();
		this.ServiceWindow.on('beforeclose', function() {
			this.enable();
			this.TreePanel.addButton.setDisabled(false);
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
					this.load();
				});				
			}
		},this);
	}
	
	,onBaseServiceGridSelect: function(selModel) {     //selModel, rowIndex, rec) {		
		if (selModel.getCount() == 1) {	
			Ext.getCmp("extendedTab").enable();
			Ext.getCmp("commonTab").enable();
			this.InfoTabPanel.setActiveTab(1);
			
			this.InfoTabPanel.saveButton.setDisabled(false);
			this.ServiceGrid.removeButton.setDisabled(false);
			this.InfoTabPanel.BaseServiceForm.setActiveRecord(selModel.getSelected());
			var data = selModel.getSelected().json.resource_uri;		
			this.InfoTabPanel.ExtendedServForm.CombOrganizationStore.load();		
	    	this.InfoTabPanel.ExtendedServiceGrid.store.setBaseParam('base_service', App.uriToId(data));
	    	this.InfoTabPanel.ExtendedServiceGrid.store.load();
	    	this.InfoTabPanel.ExtendedServForm.getForm().findField('base_service').setValue(
	    		this.ServiceGrid.getSelectionModel().getSelected().get('resource_uri'));
		
		} else {
			this.InfoTabPanel.setActiveTab(2);
			Ext.getCmp("extendedTab").disable();
			Ext.getCmp("commonTab").disable();
			
		}
	}
	
	,onNodeClick : function(node,e) {
		if (this.ServiceWindow && this.ServiceWindow.isVisible() ) {
			this.ServiceWindow.ParentChoiceFormPanel.getForm().findField('parent_group').setValue("/api/v1/dashboard/baseservice/" + node.id);
			this.ServiceWindow.ParentChoiceFormPanel.getForm().findField('name').setValue(node.text);
		} else {
			this.ServiceGrid.removeButton.setDisabled(true);
			this.ServiceGrid.store.setBaseParam('parent', node.id);
			this.ServiceGrid.store.setBaseParam('is_group', false);
			this.ServiceGrid.store.load();
			this.ServiceGrid.addButton.setDisabled(false);
		}
	}
});


Ext.reg('serviceadminpanel', App.service.ServiceAdminPanel);
