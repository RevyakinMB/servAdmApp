Ext.ns('App.ServAdm');

Ext.onReady(function() {
	var rootNode = {
		text: 'Root Node'
		,expanded : true
		,children : [
		{
			text : 'Child 1'
			,leaf : true	
		},{
			text : 'Child 2'
			,leaf : true	
		},{
			text: 'Child 3'
			,children : [
			{
				text: 'Grand Child 1'
				,children : [
				{
					text : 'Grandgrandchild'
					,leaf : true
				}]
			}]
		}]
	}; // end of rootNode


	
	Ext.QuickTips.init();  
	
	new Ext.Viewport({
		layout:'border'
		,defaults: {
			frame: true	
		}
		,items:[{
			xtype: 'servicetreepanel'
      ,layout: 'fit'
      ,region:'west'
      ,width:200
      ,collapsible:true
      ,collapseMode:'mini'
      ,split:true
/*
			xtype: 'treepanel'	
			,autoScroll: true
			,root: rootNode */
    },{
      xtype:  'surveypanel'
      ,region:'center'
      ,border:false
    }]
	}); 	
});

//Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';


///////////////////////
/*var myData = [
['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am']
,['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am']
,['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am']
,['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am']
];
App.ServAdm.servGrid = Ext.extend(Ext.grid.GridPanel, {
initComponent : function() {
var config = {
store : new Ext.data.ArrayStore({
fields: [
{name: 'company'},
{name: 'price', type: 'float'},
{name: 'change', type: 'float'},
{name: 'pctChange', type: 'float'},
{name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
]
,proxy: new Ext.data.MemoryProxy(myData)
})
,columns: [
{
id :'company',
header : 'Company',
width : 160,
sortable : true,
dataIndex: 'company'
},
{
header : 'Price',
width : 75,
sortable : true,
dataIndex: 'price'
},
{
header : 'Change',
width : 75,
sortable : true,
dataIndex: 'change'
},
{
header : '% Change',
width : 75,
sortable : true,
dataIndex: 'pctChange'
},
{
header : 'Last Updated',
width : 85,
sortable : true,
renderer : Ext.util.Format.dateRenderer('m/d/Y'),
dataIndex: 'lastChange'
}] //end of columns
,title: 'Examp Grid'
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

///////////////////////////////////////////////


Ext.ns('App.ServAdm'); */

/*App.ServAdm.surveyPanel = Ext.extend(Ext.Panel, {
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
Ext.reg('surveypanel', App.ServAdm.surveyPanel); */
