
def get_patient_info(patient_id, age = False, gender = False):
    var1, var2 = "?age", "?gender"

    return f"""
    SELECT {var1 if age else ""} {var2 if gender else ""} WHERE {{
        ?person a schema:Patient .
        ?person schema:hasPatientID "{patient_id}"^^xsd:str .
        {f'?person schema:age {var1} .' if age else ""}
        {f'?person schema:gender {var2} .' if gender else ""}
    }}"""

def get_patient_list(age = "", age_comp = "=", gender = ""):
    var1, var2, var3 = "?patient_id", "?age", "?gender"

    return f"""
    SELECT {var1} {var2} {var3} WHERE {{
        ?person a schema:Patient .
        ?person schema:hasPatientID {var1} .
        ?person schema:age {var2} .
        ?person schema:gender {var3} .
        {f'FILTER ({var2} {age_comp} {age})' if age else ""}
        {f'FILTER ({var3} = "{gender}")' if gender else ""}
    }}
    """

def get_drug_info(snomed_id, route = False):
    var1, var2 = "?drug_name", "?route"

    return f"""
    SELECT {var1} {var2 if route else ""} WHERE {{
        ?drug a schema:Drug .
        ?drug schema:snomed_id "{snomed_id}"^^xsd:integer .
        ?drug rdfs:label {var1} .
    	?indDrug schema:drugType ?drug .
        {f'?indDrug schema:routeOfAdministration {var2} .' if route else ""}
    }}
    """

def get_drug_list(route = ""):
    var1, var2 = "?snomed_ID", "?drug_name"
    
    return f"""
    SELECT {var1} {var2} WHERE {{
        ?drug a schema:Drug .
        ?drug schema:snomed_id {var1} .
        ?drug rdfs:label {var2} .
    	?indDrug schema:drugType ?drug .
        ?indDrug schema:routeOfAdministration {route} .
    }}
    """

def get_disease(snomed_id):
    var1 = "?disease_name"

    return f"""
    SELECT {var1} WHERE {{
        ?disease a schema:Condition .
        ?disease schema:snomed_id "{snomed_id}"^^xsd:integer .
        ?disease rdfs:label {var1}
    }}
    """

def get_patient_drug_info(patient_id, dosage = False, route = False, date = False):
    var1, var2, var3, var4, var5, var6 = "?drug_name", "?dosageAmount", "?dosageUnit" , "?route", "?start", "?end"

    return f"""
    SELECT DISTINCT {var1} {var2 if dosage else ""} {var3 if dosage else ""} {var4 if route else ""} {var5 if date else ""} {var6 if date else ""} WHERE {{
        ?person a schema:Patient .
        ?person schema:hasPatientID "{patient_id}"^^xsd:str .
        ?person schema:drug_administered ?indDrug .
        ?indDrug schema:drugType ?drugID .
        {"?indDrug schema:patientDosage ?dosageAmount ." if dosage else ""}
        {"?indDrug schema:doseUnit ?dosageUnit ." if dosage else ""}
        {"?indDrug schema:routeOfAdministration ?route ." if route else ""}
        {"?indDrug schema:drug_adm_start ?start ." if date else ""}
        {"?indDrug schema:drug_adm_end ?end ." if date else ""}
        ?drugID rdfs:label ?drug_name .
    }}
    """

def get_patient_drug_list(age = "", age_comp = "=", gender = "", route = ""):
    var1, var2, var3, var4, var5, var6, var7 = "?patient_id", "?age", "?gender", "?drug_name", "?dosageAmount", "?dosageUnit", "?route"

    return f"""
    SELECT DISTINCT {var1} {var2} {var3} {var4} {var5} {var6} {var7 if not route else ""} WHERE {{
        ?person a schema:Patient .
        ?person schema:age {var2} .
        ?person schema:gender {var3} .
        {f'FILTER ({var2} {age_comp} {age})' if age else ""}
        {f'FILTER ({var3} = "{gender}")' if gender else ""}
        ?person schema:drug_administered ?indDrug .
        ?indDrug schema:drugType ?drugID .
        ?indDrug schema:patientDosage ?dosageAmount .
        ?indDrug schema:doseUnit ?dosageUnit .
        ?indDrug schema:routeOfAdministration {'"'+route+'"^^xsd:str' if route else var7} .
        ?drugID rdfs:label ?drug_name .
    }}
    """

def get_patient_disease_info(patient_id, date = False):
    var1, var2, var3 = "?disease", "?onSet", "?offSet"

    return f"""
    SELECT DISTINCT {var1} {var2 if date else ""} {var3 if date else ""} WHERE {{
        ?person a schema:Patient.
        ?person schema:hasPatientID "{patient_id}"^^xsd:str .
        ?person schema:hasCondition ?indCond .
        ?indCond a schema:IndividualCondition .
        ?indCond schema:dateOfOnset {var2} .
        ?indCond schema:dateOfOffset {var3} .
        ?indCond  schema:conditionType ?condition .
        ?condition rdfs:label {var1}  .
    }}
    """

def get_patient_disease_list(age = "", age_comp = "=", gender = ""):
    var1, var2, var3, var4 = "?patient_id", "?age", "?gender", "?disease"

    return f"""
    SELECT DISTINCT {var1} {var2} {var3} {var4} WHERE {{
        ?person a schema:Patient.
        ?person schema:hasPatientID {var1} .
        ?person schema:age {var2} .
        ?person schema:gender {var3} .
        {f'FILTER ({var2} {age_comp} {age})' if age else ""}
        {f'FILTER ({var3} = "{gender}")' if gender else ""}
        ?person schema:hasCondition ?indCond .
        ?indCond a schema:IndividualCondition .
        ?indCond  schema:conditionType ?condition .
        ?condition rdfs:label {var4}  .
    }}
    """