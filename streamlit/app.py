
import os, re, json, sqlite3, hashlib
from pathlib import Path
import numpy as np
import streamlit as st
from PIL import Image
import tensorflow as tf

import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.append(str(ROOT / "backend"))

import model_utils
MODEL_DIR = ROOT / "models"
IMG_DIR = ROOT / "frontend" / "public" / "healthy_images"
DB = ROOT / "data" / "users.db"

st.set_page_config(page_title="PlantCare AI", page_icon="🌿", layout="wide")

@st.cache_data
def load_json(name):
    with open(ROOT / "frontend" / "public" / name, encoding="utf-8") as f:
        return json.load(f)

CLASSES = load_json("class_names.json")
INFO = load_json("plant_info.json")
RESULTS = load_json("model_results.json")

# Build healthy_names dict: plant_key -> [EN, HI, MR]
healthy_names = {
    k: [
        INFO[k]["name"]["en"],
        INFO[k]["name"]["hi"],
        INFO[k]["name"]["mr"],
    ]
    for k in CLASSES
    if k.endswith("___healthy")
}

def db():
    con=sqlite3.connect(DB)
    con.execute("CREATE TABLE IF NOT EXISTS users(username TEXT PRIMARY KEY, password TEXT)")
    con.commit()
    return con

def pw(x):
    return hashlib.sha256(x.encode()).hexdigest()

def login(username,password):
    con=db()
    row=con.execute("SELECT username FROM users WHERE username=? AND password=?", (username,pw(password))).fetchone()
    con.close()
    return row is not None

def signup(username,password):
    con=db()
    try:
        con.execute("INSERT INTO users VALUES (?,?)",(username,pw(password)))
        con.commit(); ok=True
    except sqlite3.IntegrityError:
        ok=False
    con.close()
    return ok

@st.cache_resource
def load_model(path):
    return model_utils.load_model(path)

def preprocess(img, model_name, model):
    shape=model.input_shape
    h,w=int(shape[1]),int(shape[2])
    x=img.convert("RGB").resize((w,h), Image.LANCZOS)
    arr=np.array(x,dtype=np.float32)
    if model_name=="CNN":
        arr=arr/255.0
    # Transfer models preprocess inside their graph (Rescaling/Normalization/
    # ResNetPreprocess/Lambda), so only raw RGB [0,255] is fed in.
    return np.expand_dims(arr,0)

def language_text(obj, lang):
    if lang=="All Languages":
        return None
    return obj[{"English":"en","हिन्दी":"hi","मराठी":"mr"}[lang]]

def disease_label(k):
    return INFO[k]["name"]

def available_models():
    out=[]
    for name in ["CNN","ResNet50","EfficientNetB0","MobileNetV2","VGG16"]:
        p=MODEL_DIR/f"{name}.keras"
        if p.exists(): out.append(name)
    return out

if "logged" not in st.session_state: st.session_state.logged=False
if "user" not in st.session_state: st.session_state.user=""

# Sidebar
st.sidebar.title("🌿 PlantCare AI")
lang=st.sidebar.selectbox("Language / भाषा / भाषा",["All Languages","English","हिन्दी","मराठी"])
page=st.sidebar.radio("Menu",["🏠 Home","🔍 Disease Detection","🌱 Healthy Plants","📚 38 Classes","📊 Model Comparison","ℹ️ About Project","👤 Login / Sign Up"])
if st.session_state.logged:
    st.sidebar.success(f"Logged in: {st.session_state.user}")
    if st.sidebar.button("Logout"):
        st.session_state.logged=False; st.session_state.user=""; st.rerun()

# ---------- HOME ----------
if page=="🏠 Home":
    st.title("🌿 PlantCare AI")
    st.subheader("Plant Disease Classification using Deep Learning")
    st.write("Upload a plant-leaf image and get an AI-based class prediction with disease information, prevention steps and spray guidance.")
    c1,c2,c3,c4=st.columns(4)
    c1.metric("Disease Classes","38")
    c2.metric("Models","5")
    c3.metric("Dataset","PlantVillage")
    c4.metric("Best Accuracy","95.94%")
    st.info("AI result = screening support, not a final agricultural diagnosis. Confirm uncertain cases with a local agriculture officer/plant pathologist.")
    st.markdown("### Main features")
    st.write("• Image-based disease screening  • 5 deep learning models (CNN, ResNet50, EfficientNetB0, MobileNetV2, VGG16)  • English / Hindi / Marathi  • Healthy Plants gallery  • Disease information  • What to do  • Spray/active-ingredient guidance  • Model accuracy comparison")

# ---------- DETECTION ----------
elif page=="🔍 Disease Detection":
    st.title("🔍 Disease Detection")
    models=available_models()
    if not models:
        st.error("No .keras model found in models/")
        st.stop()
    model_name=st.selectbox("Choose model",models)
    if len(models)<5:
        st.caption("Other model files can be added later without changing the UI.")
    up=st.file_uploader("Upload leaf image",type=["jpg","jpeg","png"])
    if up:
        img=Image.open(up).convert("RGB")
        st.image(img,caption="Uploaded image",width=360)
        if st.button("🔎 Predict Disease",type="primary"):
            with st.spinner("Analyzing image..."):
                model=load_model(str(MODEL_DIR/f"{model_name}.keras"))
                x=preprocess(img,model_name,model)
                pred=model.predict(x,verbose=0)[0]
                idx=int(np.argmax(pred)); conf=float(pred[idx])*100
            key=CLASSES[idx]
            d=INFO[key]
            st.success(f"Prediction: {d['name']['en']}  |  Confidence: {conf:.2f}%")
            st.markdown("### Disease / Plant Name")
            st.write(f"**English:** {d['name']['en']}")
            st.write(f"**हिन्दी:** {d['name']['hi']}")
            st.write(f"**मराठी:** {d['name']['mr']}")
            st.markdown("### Symptoms")
            st.write("**English:** "+d["symptoms"]["en"])
            st.write("**हिन्दी:** "+d["symptoms"]["hi"])
            st.write("**मराठी:** "+d["symptoms"]["mr"])
            st.markdown("### What should you do?")
            st.write("**English:** "+d["what_to_do"]["en"])
            st.write("**हिन्दी:** "+d["what_to_do"]["hi"])
            st.write("**मराठी:** "+d["what_to_do"]["mr"])
            st.markdown("### Spray / Treatment guidance")
            st.write("**English:** "+d["spray"]["en"])
            st.write("**हिन्दी:** "+d["spray"]["hi"])
            st.write("**मराठी:** "+d["spray"]["mr"])
            st.warning(d["safety_note"]["en"])
            if conf<70:
                st.warning("Low confidence: retake the photo in good light, keep the leaf in focus, and confirm with an agriculture expert before treatment.")

# ---------- HEALTHY ----------
elif page=="🌱 Healthy Plants":
    st.title("🌱 Healthy Plants")
    st.caption("Separate gallery for healthy plant/leaf reference images. Names are shown in English, Hindi and Marathi.")
    cols=st.columns(3)
    for i,(plant,names) in enumerate(healthy_names.items()):
        fn=re.sub(r'[^A-Za-z0-9]+','_',plant).strip('_')+"_healthy.png"
        p=IMG_DIR/fn
        with cols[i%3]:
            if p.exists(): st.image(str(p),use_container_width=True)
            st.markdown(f"**{names[0]}**")
            st.write(f"हिन्दी: {names[1]}")
            st.write(f"मराठी: {names[2]}")
            st.divider()

# ---------- CLASSES ----------
elif page=="📚 38 Classes":
    st.title("📚 All 38 PlantVillage Classes")
    search=st.text_input("Search plant or disease")
    for k in CLASSES:
        d=INFO[k]
        text=(d["name"]["en"]+" "+d["name"]["hi"]+" "+d["name"]["mr"]).lower()
        if search and search.lower() not in text and search.lower() not in k.lower(): continue
        with st.expander(f"{d['name']['en']}  |  {d['name']['hi']}  |  {d['name']['mr']}"):
            st.write("**Plant:**",d["plant"])
            st.write("**Symptoms (EN):**",d["symptoms"]["en"])
            st.write("**क्या करें:**",d["what_to_do"]["hi"])
            st.write("**काय करावे:**",d["what_to_do"]["mr"])

# ---------- COMPARISON ----------
elif page=="📊 Model Comparison":
    st.title("📊 Model Comparison")
    order=[("CNN","Custom CNN"),("VGG16","VGG16"),("MobileNetV2","MobileNetV2"),("ResNet50","ResNet50"),("EfficientNetB0","EfficientNetB0")]
    rows=[]
    for m,_disp in order:
        r=RESULTS.get(m,{})
        def f(x,plus=False):
            if x is None: return "N/R"
            return f"{x:.2f}%" if plus else f"{x:.2f}"
        rows.append({
            "Model":r.get("display_name",m),
            "Input":r.get("input_size","-"),
            "Training Acc":f(r.get("training_accuracy"),plus=True),
            "Validation Acc":f(r.get("validation_accuracy"),plus=True),
            "Macro Precision":f(r.get("macro_precision")),
            "Macro Recall":f(r.get("macro_recall")),
            "Macro F1":f(r.get("macro_f1")),
        })
    st.table(rows)
    st.caption("Macro Average = unweighted mean of per-class metrics from each model's official classification report. 'N/R' = not reported in the training records.")
    st.success("All 5 models loaded: Custom CNN (89.32%), VGG16 (90.15%), MobileNetV2 (92.47%), ResNet50 (94.91%), EfficientNetB0 (95.94%)")
    st.markdown("### Validation Accuracy Chart")
    import pandas as pd
    chart_data={r["display_name"]:r["validation_accuracy"] for m,r in RESULTS.items() if r.get("validation_accuracy") is not None}
    st.bar_chart(chart_data)

# ---------- ABOUT ----------
elif page=="ℹ️ About Project":
    st.title("ℹ️ About Project")
    st.write("PlantCare AI is a Deep Learning based plant-leaf classification project using the PlantVillage 38-class dataset (TensorFlow / Keras, trained on Google Colab).")
    st.markdown("### Project Team")
    team=[
        ("Vinay Yadav","23101B0020"),
        ("Akash Misale","23101B0013"),
        ("Jay Jangam","23101B0009"),
        ("Ishwar Garje","23101B0006"),
    ]
    for name,roll in team:
        st.write(f"• **{name}** — {roll}")
    st.markdown("**Guide:** Dr. Sushopti Gawade")
    st.markdown("**Department of Information Technology, Vidyalankar Institute of Technology, Mumbai — Academic Year 2026–27**")
    st.markdown("### Who is it for?")
    st.write("Farmers, students, agriculture learners, field staff and anyone who needs quick preliminary plant-disease screening.")
    st.markdown("### Important")
    st.write("The model can make mistakes because image appearance varies with lighting, camera quality, leaf age and disease stage. Chemical treatment must follow the current registered product label and local agricultural guidance.")

# ---------- AUTH ----------
elif page=="👤 Login / Sign Up":
    st.title("👤 Login / Sign Up")
    tab1,tab2=st.tabs(["Login","Create account"])
    with tab1:
        u=st.text_input("Username",key="lu"); p=st.text_input("Password",type="password",key="lp")
        if st.button("Login"):
            if login(u,p):
                st.session_state.logged=True; st.session_state.user=u; st.success("Login successful"); st.rerun()
            else: st.error("Invalid username or password")
    with tab2:
        u2=st.text_input("New username",key="su"); p2=st.text_input("New password",type="password",key="sp")
        if st.button("Sign Up"):
            if not u2 or not p2: st.error("Enter username and password")
            elif signup(u2,p2): st.success("Account created. Please login.")
            else: st.error("Username already exists.")
