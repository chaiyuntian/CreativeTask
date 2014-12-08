/**
 * Created by Yuntian Chai on 14-12-8.
 */

var createXHR = function()
  {
      if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      return new  ActiveXObject("Microsoft.XMLHTTP");
  }
  }

var sendJson = function(url,method,data,send_callback)
  {
       var xmlHttp = createXHR();

        method = method||"POST";
        xmlHttp.open(method,url,true);

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                try {
                    if (xmlHttp.status == 200 && typeof (send_callback) == 'function') {
                        send_callback(xmlHttp.responseText,xmlHttp.status);
                    }
                    else if ((xmlHttp.status / 100 == 4 || xmlHttp.status / 100 == 5) && typeof (send_callback) == 'function') {
                        send_callback(xmlHttp.responseText, xmlHttp.status);
                    }
                    else if (xmlHttp.status / 100 == 200 && typeof (send_callback) == 'function') {
                        send_callback(xmlHttp.responseText, xmlHttp.status);
                    }
                    else if (typeof (send_callback) == 'function') {
                        send_callback(xmlHttp.responseText, xmlHttp.status);
                    }
                }
                catch (e) {
                }
            }
        }

        xmlHttp.setRequestHeader('Content-Type', 'application/json');//application/json;charset=utf-8
        xmlHttp.send(data);
  }



