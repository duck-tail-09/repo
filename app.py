from flask import Flask, request, redirect, url_for, send_from_directory
import pandas as pd
import os

app = Flask(__name__)

EXCEL_FILE = 'patients.xlsx'

if not os.path.exists(EXCEL_FILE):
    df = pd.DataFrame(columns=["name","age","weight","sex","blood_group","symptoms",
                               "blood_pressure","heart_rate","temperature","last_visit"])
    df.to_excel(EXCEL_FILE, index=False)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/style.css')
def css():
    return send_from_directory('.', 'style.css')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.form.to_dict()
    df = pd.read_excel(EXCEL_FILE)
    df = df.append(data, ignore_index=True)
    df.to_excel(EXCEL_FILE, index=False)
    patient_name = data.get('name')
    return redirect(url_for('profile', name=patient_name))

@app.route('/profile/<name>')
def profile(name):
    df = pd.read_excel(EXCEL_FILE)
    patient = df[df['name'] == name]
    if patient.empty:
        return f"No data found for patient '{name}'", 404
    patient = patient.iloc[0]
    html = f"""
    <h1>Patient Profile: {patient['name']}</h1>
    <ul>
        <li>Age: {patient['age']}</li>
        <li>Weight: {patient['weight']} kg</li>
        <li>Sex: {patient['sex']}</li>
        <li>Blood Group: {patient['blood_group']}</li>
        <li>Symptoms: {patient['symptoms']}</li>
        <li>Blood Pressure: {patient['blood_pressure']}</li>
        <li>Heart Rate: {patient['heart_rate']} bpm</li>
        <li>Temperature: {patient['temperature']} °C</li>
        <li>Last Visit: {patient['last_visit']}</li>
    </ul>
    <a href='/'>Add another patient</a>
    """
    return html

if __name__ == '__main__':
    app.run(debug=True)