Ext.ns('App.ServAdm'); 

App.ServAdm.surveyPanel = Ext.extend(Ext.Panel, {
  layout: 'anchor'
  ,initComponent:function(){
    var config = {
    	items: [{
				xtype: 'servgrid'
				,anchor: '90% 50%'
				,frame: true
			},{
				xtype: 'tabpanel'
				,anchor: '90% 50%'
				,frame: true
				,activeItem:0
      	,items:[{					
      		title: 'Общая'
      	},{
	      	title: 'Расширенная'
	     	},{
	      	title: 'Операции'
      	}]
			}] 
    } //end of config 

    Ext.apply(this, Ext.apply(this.initialConfig, config))
 		App.ServAdm.surveyPanel.superclass.initComponent.apply(this, arguments);
 	} //end of initComponent
});
Ext.reg('surveypanel', App.ServAdm.surveyPanel); 
