from flask import Flask,render_template,request,json

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
    data = request.get_json()
    try:
        print data
        return "1"
    except:
        traceback.print_exc()
        return "0"

if __name__ == '__main__':
    app.run()
