Ext.ns('App.ServicePanel');
Ext.ns('Ext.ux');

App.ServicePanel.Tree = Ext.extend(Ext.tree.TreePanel,{

	initComponent:function(){
		this.hiddenPkgs = [];
		config = {
			
		    rootVisible: false
		    ,enableDD:true
			,ddGroup:'grid2tree'		    
		    ,lines: false
		    ,header: false
	        ,animCollapse:false
	        ,animate: false
	        ,containerScroll: true
	        ,autoScroll: true
	        ,baseAttrs: {
			    allowChildren: true
			    ,leaf: false
			}
	        ,root:{
		        nodeType: 'async'
		        //,expanded: true	
		        ,text: 'Услуги клиники'
		        ,draggable: false
		        ,id: 'source'	        	
	        }
	        ,listeners:{
				beforenodedrop: function(e) {
					this.fireEvent('changeservicesgroup',e);
				}
     			        	
	        	,click:function(node,e){
	        		this.activeNode = node;
	        		this.editButton.setDisabled(false);
	        		this.fireEvent('nodeClick',node,e);
	        	}
	        }
	        ,keys:{
	        	key:Ext.EventObject.F3
	        	,fn:function(){
	        		console.dir(arguments);
	        	}
	        }
	    	,tbar: [new Ext.form.TextField({
	    		id:'service-tree-filter'
	    	    ,width: 175
				,emptyText:'Поиск по названию'
        		,enableKeyEvents: true
				,listeners:{
					render: function(f){						
          				this.filter = new Ext.tree.TreeFilter(this, {
          					clearBlank: true
           					,autoClear: true
           				});
					}
                	,keydown: {
              			fn: this.filterTree
                		,buffer: 350
                		,scope: this
              		}
              		,scope: this
				}
		    })
	    	,'->'
	    	,{
		    	iconCls:'silk-application-form-edit'
		    	,ref:'../editButton'
		    	,disabled: true
		    	,handler:function(){
		    		this.fireEvent('servicegroupedit');
			   	}
		    	,scope:this
			},{
		    	iconCls:'silk-add'
		    	,ref:'../addButton'
		    	,handler:function(){
		    		this.fireEvent('servicegroupadd');
			   	}
		    	,scope:this
			},{
		    	iconCls:'x-tbar-loading'
		    	,handler: function(){
				   	Ext.ux.JSONP.request('http://dev.medhq.ru/webapp/service/groups/', {
			        	callbackKey: 'cb',
			        	callback: function(data) {
			        		this.getRootNode().removeAll();
			        		this.getRootNode().appendChild(data);
			        		this.activeNode = null; //change
			        		this.editButton.setDisabled(true);
			        	},
			        	scope:this
					})	    	
		    	}
		    	,scope:this
			}]
		};

		Ext.apply(this, Ext.apply(this.initialConfig, config));
		App.ServicePanel.Tree.superclass.initComponent.apply(this, arguments);
		
		/*this.getSelectionModel().on('beforeselect', function(sm, node){
	  		return node.isLeaf();
	  	});*/
	}
	
	,updateTreeData: function(){
	   	Ext.ux.JSONP.request('http://dev.medhq.ru/webapp/service/groups/', {
        	callbackKey: 'cb',
        	callback: function(data) {
        		this.getRootNode().removeAll();
        		this.getRootNode().appendChild(data);
        		this.activeNode = null; 
        		this.editButton.setDisabled(true);
        	},
        	scope:this
		})
	}
	
	,filterTree: function(t, e){
		var text = t.getValue();
		Ext.each(this.hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			this.filter.clear();
			return;
		}
		this.expandAll();
		
		var re = new RegExp(Ext.escapeRe(text), 'i');
		this.filter.filterBy(function(n){
			//console.log(n.text,re.test(n.text));
			return !n.isLeaf() || re.test(n.text); //!n.attributes.isClass || 
		});
		
		// hide empty packages that weren't filtered
		this.hiddenPkgs = [];
		var me = this;
		this.root.cascade(function(n){
			if(!n.isLeaf() && n.ui.ctNode.offsetHeight < 1){ 
				n.ui.hide();
				me.hiddenPkgs.push(n);
			}
		});
	}
});

Ext.reg('servicetreepanel', App.ServicePanel.Tree);
