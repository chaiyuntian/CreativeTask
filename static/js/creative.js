/**
 * Created by Yuntian Chai on 14-11-30.
 */

// content control
var cq = function(id)
{
    this.ctrl = document.getElementById(id);
    this.set_ctn = function(ctn){this.ctrl.innerHTML = ctn;}
    this.get_ctn = function(){return this.ctrl.innerHTML;}
    return this;
};

var ca = function(id)
{
    this.ctrl = document.getElementById(id);
    this.set_ctn = function(ctn){this.ctrl.innerHTML = ctn;}
    this.get_ctn = function(){return this.ctrl.value;}
    return this;
};

var result = function()
{
    var _dt = [];
    var _tm = [];
    // input data and time
    this.add_result = function(d,t){
        _dt.push(d);
        _tm.push(t);
    }

    this.get = function(){return {"data":_dt,"time":_tm};}
    this.num = function(){return _dt.length;}
}

var welcome = function(config)
{
    var instruction = config.instruction;
}


// creativeApp create
var App = function(qId,tId,btnId,qs,endcall)
{
    var _q_ctrl = new cq(qId);
    var _a_ctrl = new ca(tId);
    var _qlist = qs;
    var _qcount = _qlist.length;
    var _cur_index = 0;
    var _btn_ctrl = document.getElementById(btnId);
    var _a= new result();
    var _end_callback = endcall;
    var ap = this;
    var _st = this;

    this.start = function(){
        _cur_index = 0;
        _q_ctrl.set_ctn(_qlist[_cur_index]);
        _btn_ctrl.addEventListener("click",okclick);
    };

    this._save_result=function(ctn){
        var dt = new Date();

        _a.add_result(ctn,dt.getTime()-_st.getTime());};

    this.get_results = function(){return _a.get();};

    var next = function(){
        ap._save_result(_a_ctrl.get_ctn());
        _cur_index +=1;
        if(_cur_index>_qcount-1){return false;}else{_q_ctrl.set_ctn(_qlist[_cur_index]);}
        return true;
    };

    var okclick = function(){
        if(!next()){
            endcall();
            document.write("Test");
            var r = _a.get();
            //Test Use
            for(var i=0;i< r.data.length;i++){document.write(r.time[i]);}
        }
    };

    this.start();

    return this;
};




var app1 = new App("question","answer","button",tasks,function(){alert("end!");});

//app1.start();