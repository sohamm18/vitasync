import { useState } from 'react';
import { Award, Activity, MapPin, Phone, Mail } from 'lucide-react';
// 👇 Fixed imports to relative paths
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { useAppContext } from './context/AppContext';
// At the top of Dashboard.tsx, BillsContent.tsx, etc.
import { patientService } from '../services/api';

export default function CertificatesContent() {
  const { doctorProfile } = useAppContext();
  const [certificateType, setCertificateType] = useState<'fitness' | 'unfitness'>('fitness');
  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [purpose, setPurpose] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [findings, setFindings] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const pronoun = gender === 'male' ? 'he' : 'she';
  const pronounCap = gender === 'male' ? 'He' : 'She';
  const possessive = gender === 'male' ? 'his' : 'her';
  const object = gender === 'male' ? 'him' : 'her';

  const handlePreview = () => {
    if (!patientName || !age) {
      alert('Please fill in required fields (Patient Name and Age)');
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-6 no-print">
        <h2 className="text-3xl font-semibold text-gray-900">Medical Certificates</h2>
        <p className="text-gray-600 mt-1">Issue fitness and unfitness certificates</p>
      </div>

      {!showPreview ? (
        <>
          {/* Certificate Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Certificate Type</CardTitle>
              <CardDescription>Select the type of certificate to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={certificateType === 'fitness' ? 'default' : 'outline'}
                  onClick={() => setCertificateType('fitness')}
                  className={certificateType === 'fitness' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Fitness Certificate
                </Button>
                <Button
                  variant={certificateType === 'unfitness' ? 'default' : 'outline'}
                  onClick={() => setCertificateType('unfitness')}
                  className={certificateType === 'unfitness' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Unfitness Certificate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {certificateType === 'fitness' ? 'Fitness' : 'Unfitness'} Certificate Details
              </CardTitle>
              <CardDescription>
                Fill in the patient information and examination details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePreview(); }}>
                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="certPatientName">Patient Name *</Label>
                      <Input
                        id="certPatientName"
                        placeholder="Enter patient full name"
                        value={patientName}
                        onChange={(e: any) => setPatientName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certAge">Age *</Label>
                      <Input
                        id="certAge"
                        type="number"
                        placeholder="Enter age"
                        value={age}
                        onChange={(e: any) => setAge(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certGender">Gender *</Label>
                      <select
                        id="certGender"
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Pronoun will be: {pronounCap}/{object}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="examDate">Examination Date</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={examDate}
                        onChange={(e: any) => setExamDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate Specific Fields */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Certificate Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of Certificate</Label>
                      <Input
                        id="purpose"
                        placeholder="e.g., Employment, Sports, Travel, etc."
                        value={purpose}
                        onChange={(e: any) => setPurpose(e.target.value)}
                      />
                    </div>

                    {certificateType === 'fitness' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="findings">Examination Findings</Label>
                          <textarea
                            id="findings"
                            className="w-full min-h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter examination findings (e.g., General physical examination within normal limits...)"
                            value={findings}
                            onChange={(e) => setFindings(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil">Valid Until</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={validUntil}
                            onChange={(e: any) => setValidUntil(e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="findings">Medical Condition/Findings</Label>
                          <textarea
                            id="findings"
                            className="w-full min-h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter medical condition or findings that make the patient unfit..."
                            value={findings}
                            onChange={(e) => setFindings(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recommendation">Recommendations</Label>
                          <textarea
                            id="recommendation"
                            className="w-full min-h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter recommendations (e.g., Rest advised for X days, Follow-up required, etc.)"
                            value={recommendation}
                            onChange={(e) => setRecommendation(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil">Unfit Until (Optional)</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={validUntil}
                            onChange={(e: any) => setValidUntil(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Award className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setPatientName('');
                    setAge('');
                    setGender('male');
                    setPurpose('');
                    setFindings('');
                    setRecommendation('');
                    setValidUntil('');
                  }}>
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Action Buttons - Shown above preview */}
          <div className="flex gap-3 justify-center mb-6 no-print">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              Print / Download Certificate
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Edit Certificate
            </Button>
            <Button variant="outline" onClick={() => {
              setShowPreview(false);
              setPatientName('');
              setAge('');
              setGender('male');
              setPurpose('');
              setFindings('');
              setRecommendation('');
              setValidUntil('');
            }}>
              Create New
            </Button>
          </div>

          {/* Certificate Preview - A5 Size */}
          <div className="certificate-container">
            <div className="certificate-page bg-white" id="certificate-preview">
              {/* Certificate Header */}
              <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctorProfile.firstName} {doctorProfile.lastName}</h1>
                <p className="text-sm text-gray-600">{doctorProfile.designation}</p>
                <p className="text-xs text-gray-500 mt-1">Reg. No: {doctorProfile.registrationNumber}</p>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 whitespace-pre-line">
                  {certificateType === 'fitness' ? 'चिकित्सा स्वास्थ्य प्रमाणपत्र\nMEDICAL FITNESS CERTIFICATE' : 'चिकित्सा अयोग्यता प्रमाणपत्र\nMEDICAL UNFITNESS CERTIFICATE'}
                </h2>
                <p className="text-xs text-gray-600">Certificate No: CERT-{new Date().getTime()}</p>
                <p className="text-xs text-gray-600">Date: {new Date(examDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
                <p>This is to certify that I have thoroughly examined:</p>
                
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>Name (नाम):</strong> {patientName}</p>
                  <p><strong>Age (आयु):</strong> {age} years</p>
                  <p><strong>Gender (लिंग):</strong> {gender === 'male' ? 'Male' : 'Female'}</p>
                  {purpose && <p><strong>Purpose (उद्देश्य):</strong> {purpose}</p>}
                </div>

                {certificateType === 'fitness' ? (
                  <>
                    <p>
                      After thorough clinical examination on {new Date(examDate).toLocaleDateString('en-IN')}, I hereby certify that {pronoun} is medically FIT and in good health{findings && `. ${findings}`}
                    </p>
                    <p>
                      {pronounCap} is fit to {purpose ? purpose.toLowerCase() : 'undertake normal activities'} and there are no medical contraindications or abnormalities observed during the physical examination.
                    </p>
                    {validUntil && (
                      <p className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                        <strong>Valid Until:</strong> {new Date(validUntil).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      After thorough clinical examination on {new Date(examDate).toLocaleDateString('en-IN')}, I hereby certify that {pronoun} is currently medically UNFIT.
                    </p>
                    {findings && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
                        <p><strong>Medical Findings (चिकित्सा निष्कर्ष):</strong></p>
                        <p className="mt-1">{findings}</p>
                      </div>
                    )}
                    {recommendation && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
                        <p><strong>Medical Advice (चिकित्सा सलाह):</strong></p>
                        <p className="mt-1">{recommendation}</p>
                      </div>
                    )}
                    <p>
                      {pronounCap} is advised to refrain from {purpose ? purpose.toLowerCase() : 'strenuous activities'} until {pronoun} receives proper medical clearance and treatment.
                    </p>
                    {validUntil && (
                      <p className="font-semibold">
                        <strong>Unfit Until:</strong> {new Date(validUntil).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Signature Section */}
              <div className="mt-8 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-600">Date of Issue:</p>
                    <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <div className="border-t-2 border-gray-400 pt-2 w-40">
                      <p className="text-sm font-semibold">{doctorProfile.firstName} {doctorProfile.lastName}</p>
                      <p className="text-xs text-gray-600">{doctorProfile.designation}</p>
                      <p className="text-xs text-gray-600">Reg: {doctorProfile.registrationNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Clinic Details */}
              <div className="certificate-footer">
                <div className="border-t-2 border-blue-600 pt-3">
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-blue-600 mb-2">{doctorProfile.clinicName}</h3>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p className="flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {doctorProfile.clinicAddress}, {doctorProfile.clinicCity}, {doctorProfile.clinicState} - {doctorProfile.clinicZip}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Mobile: {doctorProfile.mobile}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Landline: {doctorProfile.landline}
                        </p>
                      </div>
                      <p className="flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3" />
                        {doctorProfile.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-container,
          .certificate-container * {
            visibility: visible;
          }
          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .certificate-page {
            width: 148mm !important;
            height: 210mm !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            box-shadow: none !important;
            page-break-after: avoid;
          }
          @page {
            size: A5;
            margin: 0;
          }
        }
        
        @media screen {
          .certificate-container {
            display: flex;
            justify-content: center;
            padding: 20px;
            background: #f3f4f6;
          }
          .certificate-page {
            width: 148mm;
            min-height: 210mm;
            padding: 15mm;
            background: white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            position: relative;
            display: flex;
            flex-direction: column;
          }
          .certificate-footer {
            margin-top: auto;
            padding-top: 20px;
          }
        }
      `}</style>
    </div>
  );
}