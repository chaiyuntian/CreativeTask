from flask import Flask,render_template

app = Flask(__name__)


@app.route('/')
def welcome():
    return render_template("welcome.html")

@app.route('/task')
def task():
    return render_template("taskMain.html")

@app.route('/result')
def result():
    success = 1
    return success


if __name__ == '__main__':
    app.run()
