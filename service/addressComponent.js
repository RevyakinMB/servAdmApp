Ext.ns('App.service');

App.service.line = Ext.extend(Ext.Component, {
  autoEl: 'hr'
});

Ext.reg('line', App.service.line);

App.service.AddressComponent = Ext.extend(Ext.Window, {
	initComponent : function() {
		
		
		this.subjectListViewStore = this.subjectListViewStore || new Ext.data.RESTStore({
			autoSave: false
			,autoLoad: false
			,apiUrl: get_api_url('state')
			,model: [	
				{name: 'name'}
	        	,{name: 'resource_uri'}
				,{name: 'id' }
			]
		});
		
		this.regionListViewStore = this.regionListViewStore || new Ext.data.RESTStore({
			autoSave: false
			,autoLoad: false
			,apiUrl: get_api_url('state')
			,model: [	
				{name: 'name'}
	        	,{name: 'resource_uri'}
				,{name: 'id' }
			]
		});
		
		this.placeListViewStore = this.placeListViewStore || new Ext.data.RESTStore({
			autoSave: false
			,autoLoad: false
			,apiUrl: get_api_url('state')
			,model: [	
				{name: 'name'}
	        	,{name: 'resource_uri'}
				,{name: 'id' }
			]
		});
		
		this.countryCombo = new Ext.form.ComboBox({ 					 					
			allowBlank : false
			,name: 'country'
			,displayField : 'name'
			,valueField : 'id'			
			,fieldLabel : 'Страна'
			,anchor: '0'
			,value: 0
			,minChars: 2
			,autoComplete: true
			,typeAhead: true
			,emptyText : 'Выберите страну...'
			,triggerAction : 'all'
			,mode : 'local'
			,store : new Ext.data.ArrayStore({
				data : [ ['Россия',0], ['Страна1',1], ['Страна2',2]]
				,fields : ['name', 'id']
			})
			,listeners: {
				select: function(selfEl, record, number) {
					this.addrPreview[0] = record.get("name");
					this.addrPreviewReDraw();
				}
				,scope: this
			}
		});
		
		this.streetCombo = new Ext.form.ComboBox({ 					 					
			allowBlank : false		
			,name: 'street'
			,displayField : 'name'
			,valueField : 'id'			
			,fieldLabel : 'Улица'
			,anchor: '0'
			,value: 0			
			,autoComplete: true
			,typeAhead: true
			,minChars: 3
			,emptyText : 'Выберите улицу...'
			,triggerAction : 'all'
			,mode : 'local'
			,store : new Ext.data.ArrayStore({
				data : [ ['Тургенева',0], ['Суворова',1], ['Селезнева',2],['Селедочная',3],['Селезенная',4]]
				,fields : ['name', 'id']
			})
			,listeners: {
				select: function(selfEl, record, number) {
					this.addrPreview[4] = record.get("name");
					this.addrPreviewReDraw();
				}
				,scope: this
			}
		});
		
		
		this.regionListView = new Ext.list.ListView({
	        store: this.regionListViewStore
	        ,width: 200
	        ,height: 150
	        ,multiSelect: true
	        ,emptyText: 'Проблемы...'
	        ,hideHeaders: true
	        ,columns: [{
	            //header: 'Регион'
	            dataIndex: 'name'
	        }]
	        ,listeners: {
	        	selectionchange: function(view, selections) {
	        		this.addrPreview[2] = selections[0].textContent;;
					this.addrPreviewReDraw();	
	        		this.placeListViewStore.load();
	        	}
	        	,scope: this
	        }
	    });
	    
	    
	    
	    this.placeListView = new Ext.list.ListView({
	        store: this.placeListViewStore
	        ,width: 200	        
	        ,height: 150
	        ,multiSelect: true
	        ,emptyText: 'Проблемы...'
	        ,hideHeaders: true
	        ,columns: [{
	            //header: 'Город'
	            dataIndex: 'name'
	        }]
	        ,listeners: {
	        	selectionchange: function(view, selections) {
	        		this.addrPreview[3] = selections[0].textContent;;
					this.addrPreviewReDraw();	
	        		//this.streetCombo.store.load();
	        	}
	        	,scope: this
	        }
	        
	    });
	    
		this.subjectListView = new Ext.list.ListView({
	        store: this.subjectListViewStore
	        ,width: 200
	        ,height: 150
	        ,multiSelect: false
	        ,singleSelect: true
	        ,emptyText: 'Проблемы...'
	        //,reserveScrollOffset: true// ??
	        ,hideHeaders: true
	        ,columns: [{
	            //header: 'Субъект'
	            dataIndex: 'name'	            
	        }]
	        ,listeners: {
	        	selectionchange: function(thisView, selections) {
	        		this.addrPreview[1] = selections[0].textContent;;
					this.addrPreviewReDraw();					
	        		this.regionListViewStore.load();	        		
	        	}
	        	,scope: this
	        }
	    });
	    
	    this.addrPreview = new Array(); // [0] - страна. [1] - 1 список. [2] - 2 список. [3] - 3 список.    
										// [4] - улица.  [5] - доп. информация.
	    for (i=0; i<6; i++) {
	    	this.addrPreview[i]="";
	    }
	    this.addrPreview[0] ='Россия';
	    
	    this.addressForm = new Ext.form.FormPanel({
	    	border: false
	    	,bodyStyle:'padding: 2px; background-color:#dfe8f5;'		
			,defaultType: 'textfield'
			,layout: 'form'
			,labelWidth : 100
			,items: [{
				fieldLabel: 'Предпросмотр'	
				,name: 'preview'
				,cls: 'grey-textfield-background'
				,emptyText: 'Начните выбор адреса...'
				,anchor: '-10'
			},{
			    xtype: 'line'
			},{
				xtype: 'container'
				,width: 300
				,border: false				
				,layout: 'form'
				,items: [this.countryCombo]
			},{
				xtype: 'container'
				,id: 'listsontainer'
				,layout: 'hbox'
				,items: [{
					xtype: 'panel'
					,style: { padding: '0px 0px 0px 3px' }
					,layout: 'fit'
					,border: false
					,items: [this.subjectListView]
					,tbar: [new Ext.form.TextField({
			    		id:'subject-view-filter'	    		
			    	    ,width: 175
						,emptyText:'Поиск...'						
				    })
		    		,'->'
		    		,{
			    		iconCls:'x-tbar-loading'
			    		,handler: function() {}
			    		,scope: this
		    		}]
				},{
					xtype: 'panel'
					,style: { padding: '0px 0px 0px 3px' }
					,border: false
					,layout: 'fit'
					,items: [this.regionListView]
					,tbar: [new Ext.form.TextField({
			    		id:'region-view-filter'	    		
			    	    ,width: 175
						,emptyText:'Поиск...'	        		
				    })
		    		,'->'
		    		,{
			    		iconCls:'x-tbar-loading'
			    		,handler: function() {}
			    		,scope: this
		    		}]
				},{
					xtype: 'panel'
					,style: { padding: '0px 0px 0px 3px' }
					,border: false
					,layout: 'fit'
					,items: [this.placeListView]
					,tbar: [new Ext.form.TextField({
			    		id:'place-view-filter'	    		
			    	    ,width: 175
						,emptyText:'Поиск...'	        		
				    })
		    		,'->'
		    		,{
			    		iconCls:'x-tbar-loading'
			    		,handler: function() {}
			    		,scope: this
		    		}]
				}]
			},{
				xtype: 'container'
				,id: 'streetcontainer'
				,width: 300				
				,border: false
				,style: { padding: '3px 0px 0px 0px' }
				,layout: 'form'
				,items: [this.streetCombo]
			},{
				xtype: 'textarea'
				,fieldLabel: 'Дополнительно'
				,name: 'more'								
				,emptyText: 'Введите остальную информацию'
				,anchor: '-10'
				,enableKeyEvents: true
				,listeners: {
					keyup:	function(field, e) { 	
						this.addrPreview[5] = this.addressForm.getForm().findField('more').getValue();
						this.addrPreviewReDraw();
					}
					,scope: this
				}
			}]
			,buttons: [{
	            text: 'Сохранить'
	            ,iconCls:'silk-accept'
	            ,handler: function(){	      
	            	this.action = 'save';
	            	this.close();
	            }	           
	            ,scope: this
	        },{
	            text: 'Отменить'
	            ,iconCls:'silk-cancel'
	            ,handler: function(){
	            	this.action = 'cancel';
	                this.close();
	            }
	            ,scope: this
	        }]
	    });	    	    
	    
		var config = {
			title: 'Выбор адреса'
			,id: 'addressComponentID'
			,border: false
			,layout: 'form'
			,width: 637
			,height: 400	
			,items: this.addressForm
		}
		this.on('afterrender', function(){
			this.subjectListViewStore.load();
		});
		
		this.countryCombo.on('select', function(combo, record) {
			if (record.get('id') != 0 ) {
				Ext.getCmp("listsontainer").disable();
				Ext.getCmp("streetcontainer").disable();				
			} else {
				Ext.getCmp("listsontainer").enable();
				Ext.getCmp("streetcontainer").enable();
			}
			
		})
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.AddressComponent.superclass.initComponent.apply(this, arguments);
				
	}
	,setActiveAddress: function(rec) {
		//
	}
	
	,addrPreviewReDraw: function() {
		var str="";
		if ( this.addrPreview[0] == 'Россия') {
			for (i=0; i<6; i++) {
				if (this.addrPreview[i] != "" ){
					if (str != "") {
						str = str + ", " + this.addrPreview[i];
					} else {
						str = str + this.addrPreview[i];
					}
				}					
			}
		} else {
			str = this.addrPreview[0] + ", " + this.addrPreview[5];
		}
		this.addressForm.getForm().findField('preview').setValue(str);		
	}
});
	
Ext.reg('addresspanel', App.service.AddressComponent);
