Ext.ns('App');
Ext.ns('App.service');

App.ServCentralPanel = Ext.extend(Ext.Panel, {
	
	initComponent: function(){
		this.mainPanel = new App.ServMainPanel({});
		
		/*this.cmb = new Ext.form.ComboBox({
    		id:'profile-cmb-exam',
			fieldLabel:'Профиль',
			name:'payment_type',
			store:new Ext.data.ArrayStore({
				fields:['id','title'],
				data: profiles
			}),
			listeners:{
				select: function(c, rec, i){
					var p = rec.data.id;
					window.location.href = '/webapp/setactiveprofile/'+p+'/?redirect_to=/webapp/registry/';
				}
			},
			width:300,
			typeAhead: true,
			triggerAction: 'all',
			valueField:'id',
			displayField:'title',
			mode: 'local',
			forceSelection:true,
			selectOnFocus:true,
			editable:false
    	});*/
	
		//this.cmb.setValue(active_profile);

		config = {
			region:'center',
			border:false,
			layout:'border',
			items:[this.mainPanel],
			tbar:[ {
				xtype: 'buttongroup'
				,title: 'Кнопки'
				,items: [{
					text: 'Услуги'
					,scale:'medium'
					,handler: function(){
                    	this.launchApp('serviceadminpanel');
                    },
                    scope:this
                }]				
			}
			
				/*{
				xtype: 'buttongroup',
				title: '№ заказа или фамилия',
				padding:5,
				items:[{
					xtype:'gsearchfield'
					
				}]
			},{
                xtype: 'buttongroup',
                title: 'Журналы',
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                items: [{
                    text: 'Заказы',
                    scale:'medium',
                    iconAlign: 'top',
                    handler: function(){
                    	this.launchApp('examordergrid');
                    },
                    scope:this
                },{
                    text: 'Обследования',
                    scale:'medium',
                    iconAlign: 'top',
                    handler: function(){
                    	this.launchApp('allexamgrid');
                    },
                    scope:this
                }]
            },{
                xtype: 'buttongroup',
                title: 'Шаблоны',
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                items: [{
                    text: 'Список шаблонов',
                    scale:'medium',
                    iconAlign: 'top',
                    handler: function(){
                    	this.launchApp('templateglobalgrid');
                    },
                    scope:this
                },{
                    text: 'Группы',
                    scale:'medium',
                    iconAlign: 'top',
                    handler: function(){
                    	this.launchApp('groupgrid');
                    },
                    scope:this
                }]
            },'->',this.cmb,{
            	text:'Выход',
            	handler:function(){
            		window.location.href = '/webapp/logout/';
            	}
            }*/]
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServCentralPanel.superclass.initComponent.apply(this, arguments);
		//App.eventManager.on('launchapp', this.launchApp, this);
		//App.eventManager.on('closeapp', this.closeApp, this);
	},
	
	closeApp: function(appId) {
		this.mainPanel.remove(appId);
	},
	
	launchApp: function(appId,config) {
        var app_config = {
            xtype:appId
        };
        config = config || {};
		Ext.apply(app_config, config);
		var new_app = this.mainPanel.add(app_config);
		this.mainPanel.setActiveTab(new_app);
	}
});

Ext.reg('servcentralpanel', App.ServCentralPanel);
