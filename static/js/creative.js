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

var timer = function(tt,id,end_cb,update_cb)
{
    var _total_time = tt;
    var _cur_time = 0;
    var _tm_ctrl = new cq(id);
    var _tmer;

    var _set_time = function(seconds)
    {
        var min = parseInt(seconds/60);
        var sec = parseInt(seconds%60);
        _tm_ctrl.set_ctn("剩余时间："+min+":"+sec);
    }

    var _update = function()
    {
        if(_cur_time<=0){
            clearInterval(_tmer);
            if(end_cb){end_cb();}
        }
        if(update_cb){
            update_cb();
        }
        else{
            _cur_time -= 1;
            _set_time(_cur_time);
        }
    }

    this.start = function(){
        _cur_time = _total_time;
        _set_time(_cur_time);
        _tmer = setInterval(_update,1000)
    };

    this.cancel = function(){
        clearInterval(_tmer);
    };

}



// creativeApp create
var App = function(cfg,qs,endcall)
{

    var _q_ctrl = new cq(cfg.qc);
    var _a_ctrl = new ca(cfg.ac);
    var _qlist = qs;
    var _qcount = _qlist.length;
    var _cur_index = 0;
    var _btn_ctrl = document.getElementById(cfg.btn);
    var _a= new result();
    var _end_callback = endcall;
    var ap = this;
    var _st = new Date();
    var _count_timer;

    this.start = function(){
        _cur_index = 0;
        _q_ctrl.set_ctn(_qlist[_cur_index]);
        _btn_ctrl.addEventListener("click",okclick);
        _count_timer = new timer(cfg.tt,cfg.tc,okclick)
        _count_timer.start();
    };

    this._save_result=function(ctn){
        var dt = new Date();
        _a.add_result(ctn,dt.getTime()-_st.getTime());};

    this.get_results = function(){return _a.get();};


    var next = function(){
        _count_timer.cancel();
        ap._save_result(_a_ctrl.get_ctn());
        _cur_index +=1;
        if(_cur_index>_qcount-1){return false;}else{
            _q_ctrl.set_ctn(_qlist[_cur_index]);
            _count_timer.start();
        }
        return true;
    };

    var okclick = function(){
        if(!next()){
            endcall();
            document.write("Result:");
            var r = _a.get();
            //Test Use
            for(var i=0;i< r.data.length;i++){document.write(r.time[i]+':'+ r.data[i]+', &nbsp;');}
        }
    };

    this.start();

    return this;
};

var cfg = {qc:"question",ac:"answer",btn:"button",tc:"timer",tt:600};
var app1 = new App(cfg,tasks,function(){alert("end!");});

//app1.start();