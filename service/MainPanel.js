Ext.ns('App');


App.ServMainPanel = Ext.extend(Ext.TabPanel, {
	
	initComponent: function(){
		config = {
			region:'center',
			margins:'5 0 5 5'
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServMainPanel.superclass.initComponent.apply(this, arguments);
	}

});

Ext.reg('mainpanel',App.ServMainPanel);