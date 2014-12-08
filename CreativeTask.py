from flask import Flask,render_template,request
import json
import traceback

app = Flask(__name__)


@app.route('/')
def welcome():
    return render_template("welcome.html")

@app.route('/task')
def task():
    return render_template("taskMain.html")

@app.route('/result', methods=['POST'])
def result():
    #ajson = request.json
    data = request.data
    print data
    #ans = ajson if ajson != None else data
    #ans = ''.join(request.environ['wsgi.input'].readlines()) if ans==None else ans
    try:

        a = json.loads(data)
        a = json.dumps(a, ensure_ascii=False)
        print a

        return "1"
    except:
        traceback.print_exc()
        return "0"

if __name__ == '__main__':
    app.run()
