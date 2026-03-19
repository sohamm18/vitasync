import axios from 'axios';

// 1. Setup the base configuration pointing to your Laravel engine
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 2. Clinical API Endpoints
export const patientService = {
    // Matches the Laravel Controller logic for searching IDs and Phones
    searchPatients: (query: string) => api.get(`/patients?query=${query}`),
    
    getPatientDetails: (id: number | string) => api.get(`/patients/${id}`),
    
    createPatient: (data: any) => api.post('/patients', data),
};

export const visitService = {
    createVisit: (data: any) => api.post('/visits', data),
    getPatientVisits: (patientId: number | string) => api.get(`/visits/patient/${patientId}`),
};

export const prescriptionService = {
    createPrescription: (data: any) => api.post('/prescriptions', data),
    getVisitPrescriptions: (visitId: number | string) => api.get(`/prescriptions/visit/${visitId}`),
};

export const reportService = {
    /**
     * Upload report image to local storage folder:
     * reports/{PatientID}_{Name}/{Date}/filename
     */
    uploadReport: (visitId: number | string, file: File) => {
        const formData = new FormData();
        formData.append('visit_id', String(visitId));
        formData.append('file', file);
        
        return api.post('/report-images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
