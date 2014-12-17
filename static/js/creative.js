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
    this.ToString = function()
    {
        var str = "";
        for(var i=0;i<_dt.length;i++)
        {
            str+=_tm[i]+":"+_dt[i]+",";
        }
        return str;
    }

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

var oprecorder = function(ctrl)
{
    var _txt_ctrl = ctrl;
    var _st=0;
    var _temp="";

    var _time=[];
    var _text=[];

    var checkTxt = function(b,a)
    {
        if(b==a){return "";}
        // handle delete
        if(b.length>= a.length){// deleted
            if(a.length==0){return "-"+b;}
            else{return "-"+b.slice(a.length, b.length)};
        }
        else if(b.length< a.length)
        {
            if(b.length==0){return a;}
            else{return a.slice(b.length, a.length);}
        }
        // handle add
    }

    var on_txt = function()
    {
        var new_text = ctrl.get_ctn();
        var time = (new Date()).getTime() - _st;
        var diff = checkTxt(_temp,new_text);
        _time.push(time/1000.0);
        _text.push(diff);

        _temp = new_text;

    }

    this.init = function()
    {
        if(window.addEventListener) {_txt_ctrl.ctrl.addEventListener("input", on_txt, false);}
        else if(window.attachEvent) {_txt_ctrl.ctrl.attachEvent("onpropertychange", on_txt);}

    if(window.VBArray && window.addEventListener) {
        _txt_ctrl.ctrl.attachEvent("onkeydown", function() {
        var key = window.event.keyCode;
        if ((key == 8 || key == 46) && _txt_ctrl.ctrl.value != '') {on_txt();} //handle backspace and delete
        });
        _txt_ctrl.ctrl.attachEvent("oncut", on_txt);//handle cut
    }

    }

    this.start = function()
    {
        var dt = new Date();
        _st = dt.getTime();

        _time = [];
        _text = [];

        var _temp="";

    }

    this.get_result = function()
    {
        return {"time":_time,"text":_text};
    }

    this.get_result_str = function()
    {
        var str = "";
        for(var i=0;i<_text.length;i++)
        {
            str+=_time[i]+":"+_text[i]+"#";
        }
        return str;
    }
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
    var _r = [];// recordresults
    var _end_callback = endcall;
    var ap = this;
    var _st = new Date();
    var _count_timer;
    var _recorder = new oprecorder(_a_ctrl);

    _recorder.init();

    this.start = function(){
        _cur_index = 0;
        _q_ctrl.set_ctn(_qlist[_cur_index]);
        _btn_ctrl.addEventListener("click",okclick);
        _count_timer = new timer(cfg.tt,cfg.tc,okclick)
        _count_timer.start();
        //_recorder properties might be changed in the future.
        _recorder.start();
    };

    this._save_result=function(ctn){
        var dt = new Date();
        _a.add_result(ctn,dt.getTime()-_st.getTime());
        _r.push(_recorder.get_result_str());
        };


    this.get_results = function(){return _a.get();};


    this.get_result_json = function(){
        var r_temp = ''
        for(var i=0;i<_r.length;i++)
        {
            r_temp+=i+"="+_r[i]+","

        }
        var str_json = '{"result":"'+_a.ToString()+'",'+'"operation":"'+ r_temp + '"}';

        return str_json;
    };

    var next = function(){
        _count_timer.cancel();
        ap._save_result(_a_ctrl.get_ctn());
        _cur_index +=1;
        if(_cur_index>_qcount-1){return false;}else{
            _q_ctrl.set_ctn(_qlist[_cur_index]);
            _count_timer.start();
            _recorder.start();
        }
        return true;
    };

    var dataSendCallBack = function(response,status)
    {
        if(response== "1" &&status == 200){alert("Success!");}
    }


    var okclick = function(){
        if(!next()){
            endcall();
            document.write("Result:");
            //Test Use
            sendJson(cfg.baseURI+"/result","POST",ap.get_result_json(),dataSendCallBack);//{"data":_r}  ap.get_result_json()
            //for(var i=0;i< r.data.length;i++){document.write(r.time[i]+':'+ r.data[i]+', &nbsp;');}
        }
    };

    this.start();

    return this;
};

var cfg = {baseURI:"",qc:"question",ac:"answer",btn:"button",tc:"timer",tt:600};

var app1 = new App(cfg,tasks,function(){alert("end!");});

//app1.start();