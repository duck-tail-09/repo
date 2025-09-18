from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Swastrix API – Easy Mode")

# Allow all origins (so frontend can call)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Database setup -------------------
conn = sqlite3.connect("swastrix_easy.db", check_same_thread=False)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    mrn TEXT UNIQUE
)
""")
conn.commit()

# ------------------- Schemas -------------------
class Patient(BaseModel):
    name: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    mrn: Optional[str] = None

class PatientRead(Patient):
    id: int

# ------------------- Endpoints -------------------
@app.get("/patients", response_model=List[PatientRead])
def get_patients():
    cur.execute("SELECT id, name, dob, gender, mrn FROM patients")
    rows = cur.fetchall()
    return [PatientRead(id=r[0], name=r[1], dob=r[2], gender=r[3], mrn=r[4]) for r in rows]

@app.post("/patients", response_model=PatientRead, status_code=201)
def add_patient(patient: Patient):
    try:
        cur.execute(
            "INSERT INTO patients (name, dob, gender, mrn) VALUES (?, ?, ?, ?)",
            (patient.name, patient.dob, patient.gender, patient.mrn),
        )
        conn.commit()
        patient_id = cur.lastrowid
        return PatientRead(id=patient_id, **patient.dict())
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="MRN already exists")
