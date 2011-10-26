Ext.ns('App.service');

App.service.AddressComponent = Ext.extend(Ext.Window, {
	initComponent : function() {
		
		
		this.subjectListViewStore = new Ext.data.Store({
			autoSave: false
			,autoLoad: false
			,proxy: new Ext.data.HttpProxy({
				url: get_api_url('state')
			})
			,reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{name: 'name'}
	        		,{name: 'resource_uri'}
					,{name: 'id' }
				]
			)									
		});
		
		this.regionListViewStore = new Ext.data.Store({
			autoSave: false
			,autoLoad: false
			,proxy: new Ext.data.HttpProxy({
				url: get_api_url('state')
			})
			,reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{name: 'name'}
	        		,{name: 'resource_uri'}
					,{name: 'id' }
				]
			)									
		});
		this.placeListViewStore = new Ext.data.Store({
			autoSave: false
			,autoLoad: false
			,proxy: new Ext.data.HttpProxy({
				url: get_api_url('state')
			})
			,reader: new Ext.data.JsonReader ({
				totalProperty: 'meta.total_count'
				,successProperty: 'success'
				,messageProperty: 'message'
				,idProperty: 'id'
	  			,root: 'objects'
				},[
					{name: 'name'}
	        		,{name: 'resource_uri'}
					,{name: 'id' }
				]
			)									
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
				data : [ ['Россия',0,0], ['Страна1',1,1], ['Страна2',2,1]]
				,fields : ['name', 'id','level']
			})
			,listeners: {
				select: function(selfEl, record, number) {					
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
				data : [ ['Тургенева',0,0,0], ['Суворова',1,0,0], ['Селезнева',2,0,0],['Селедочная',3,0,0],['Селезенная',4,0,0]]
				,fields : ['name', 'id','code', 'adrtype']
			})
			,listeners: {
				select: function(selfEl, record, number) {
					this.addrPreviewReDraw();
				}
				,scope: this
			}
		});
		
		this.subjectListView = new Ext.list.ListView({
	        store: this.subjectListViewStore
	        ,height: 150
	        ,multiSelect: false
	        ,singleSelect: true
	        ,hideHeaders: true
	        ,columns: [{	            
	            dataIndex: 'name'	            
	        }]
	        ,listeners: {
	        	selectionchange: function(thisView, selections) {	        		
					this.placeListViewStore.loadData(
						{"meta": {"limit": 0, "offset": 0, "total_count": 0}, "objects": []},false);
					this.regionListViewStore.loadData(
						{"meta": {"limit": 0, "offset": 0, "total_count": 0}, "objects": []},false);					
	        		this.regionListViewStore.load();
					this.addrPreviewReDraw();	        		
	        	}
	        	,scope: this
	        }
	    });
		
		
		this.regionListView = new Ext.list.ListView({
	        store: this.regionListViewStore
	        ,height: 150
	        ,multiSelect: true
	        ,hideHeaders: true
	        ,columns: [{
	            dataIndex: 'name'
	        }]
	        ,listeners: {
	        	selectionchange: function(view, selections) {
					this.placeListViewStore.loadData(
						{"meta": {"limit": 0, "offset": 0, "total_count": 0}, "objects": []},false);
	        		this.placeListViewStore.load();
					this.addrPreviewReDraw();	        		
	        	}
	        	,scope: this
	        }
	    });
	    	    	   
	    this.placeListView = new Ext.list.ListView({
	        store: this.placeListViewStore
	        ,height: 150
	        ,multiSelect: true
	        ,hideHeaders: true
	        ,columns: [{
	            dataIndex: 'name'
	        }]
	        ,listeners: {
	        	selectionchange: function(view, selections) {
					this.addrPreviewReDraw();	
	        	}
	        	,scope: this
	        }
	        
	    });	    			    	   
	    
	    this.addressForm = new Ext.form.FormPanel({
	    	border: false
	    	,bodyStyle:'padding: 2px; background-color:#dfe8f5;'		
			,defaultType: 'container'
			,layout: 'form'
			,labelWidth : 100
			,items: [{
				fieldLabel: ''
				,xtype: 'textfield'
				,readOnly: true
				,style: 'margin-left: -105px'
				,name: 'preview'
				,cls: 'grey-textfield-background'
				,emptyText: 'Начните выбор адреса...'
				,anchor: '210'
			},
				new Ext.Component({autoEl: 'hr'})  			    
			,{
				width: 300
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
					,flex:1
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
					,flex:1
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
					,flex:1
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
				,anchor: '-1'
				,enableKeyEvents: true
				,listeners: {
					keyup:	function(field, e) { 	
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
			,modal: true
			,layout: 'form'
			,width: 637
			,height: 400	
			,items: this.addressForm
		}
		this.on('afterrender', function(){
			this.subjectListViewStore.load();
		});
		
		this.countryCombo.on('select', function(combo, record) {
			if (record.get('level') != 0 ) {
				this.subjectListView.hide();
				this.regionListView.hide();
				this.placeListView.hide();
				this.streetCombo.hide();				
			} else {
				this.subjectListView.show();
				this.regionListView.show();
				this.placeListView.show();
				this.streetCombo.show();
			}
			
		},this)
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.service.AddressComponent.superclass.initComponent.apply(this, arguments);
				
	}
	,setActiveAddress: function(rec) {
		// for callback call
	}
	
	,addrPreviewReDraw: function() {
		var addrPreview = new Array();		
		addrPreview.push(this.countryCombo.findRecord('id',this.countryCombo.getValue()).get('name'))
		var cntrLevel = this.countryCombo.findRecord('id',this.countryCombo.getValue()).get('level');
		if (cntrLevel == 0) {
			if (this.subjectListView.getSelectedRecords()[0]) 
				{ addrPreview.push(this.subjectListView.getSelectedRecords()[0].get("name")); }
			if (this.regionListView.getSelectedRecords()[0]) 
				{ addrPreview.push(this.regionListView.getSelectedRecords()[0].get("name")); }
			if (this.placeListView.getSelectedRecords()[0]) 
				{ addrPreview.push(this.placeListView.getSelectedRecords()[0].get("name")); }
			
			addrPreview.push(this.streetCombo.findRecord('id',this.streetCombo.getValue()).get('name'));
		}
		addrPreview.push(this.addressForm.getForm().findField('more').getValue());
		
		var str = addrPreview.join(', ');
		this.addressForm.getForm().findField('preview').setValue(str);		
	}
});
	
Ext.reg('addresspanel', App.service.AddressComponent);
