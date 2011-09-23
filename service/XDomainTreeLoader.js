Ext.tree.XDomainTreeLoader = function(config){
  Ext.tree.XDomainTreeLoader.superclass.constructor.call(this, config);
};

Ext.extend(Ext.tree.XDomainTreeLoader, Ext.tree.TreeLoader, {
    getParams: function(node){
      var bp = this.baseParams;
      bp.node = node.id;
      return bp;
    },

    requestData: function(node, callback){
      var url = this.url || this.dataUrl;
      if(url && !this.proxy) {
        this.proxy = new Ext.data.ScriptTagProxy({url: this.url}); 
      }
      this.proxy.url = url;
      
      if(this.fireEvent("beforeload", this, node, callback) !== false) { 
        var p = this.getParams(node);
        var reader = new Ext.data.JsonReader({root:'children'}, ['text', 'id', 'cls', 'href', 'leaf']);
        this.proxy.doRequest('load',p, reader, this.handleResponse, this, {cb:callback,node:node});
      }
      else{
        // if the load is cancelled, make sure we notify the node that we are done
        if(typeof callback == "function"){
          callback();
        }
      }
    },

    processResponse: function(data, node, callback){
      try {
        var o = data;
        node.beginUpdate();
        for(var i = 0, len = o.length; i < len; i++) {
          var n = this.createNode(o[i].data);
          if(n){
            node.appendChild(n);
          }
        }
        node.endUpdate();
        if(typeof callback == "function") {
          callback(this, node);
        }
      }
      catch(e) {
        this.handleFailure(data);
      }
    },

    handleResponse: function(data, arg, isSuccess) {
      console.log("data: %o\narg: %o\nisSuccess: %o", data, arg, isSuccess);
      data = data.records;
      var o;
      if(this.rootField) {
        o = data[this.rootField];
      }
      else {
        o = data;
      }
      this.processResponse(o, arg.node, arg.cb);
      this.fireEvent("load", this, arg.node, data);
    },

    handleFailure: function(data, node, callback){
      this.transId = false;
      this.fireEvent("loadexception", this, node, data);
      if(typeof callback == "function"){
        callback(this, node);
      }
    }
});
