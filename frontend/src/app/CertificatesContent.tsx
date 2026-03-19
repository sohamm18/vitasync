import { useState } from 'react';
import { Award } from 'lucide-react';
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
  const [bedrestDays, setBedrestDays] = useState('');
  const [isolationDetails, setIsolationDetails] = useState('');
  const [noHistoryNotes, setNoHistoryNotes] = useState('');
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

  const formattedExamDate = examDate
    ? new Date(examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  const formattedIssueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedValidUntil = validUntil
    ? new Date(validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  // Shared generic input style
  const inputStyle = "bg-white border border-green-600 text-gray-600 focus-visible:ring-1 focus-visible:ring-green-600 focus-visible:ring-offset-0 focus:outline-none placeholder:text-gray-400";
  const cardStyle = "border-green-600 shadow-sm bg-white";

  return (
    <div>
      <div className="mb-6 no-print">
        <h2 className="text-3xl font-semibold text-gray-600">Medical Certificates</h2>
        <p className="text-gray-500 mt-1">Issue fitness and unfitness certificates</p>
      </div>

      {!showPreview ? (
        <>
          {/* Certificate Type Selection */}
          <Card className={`mb-6 ${cardStyle}`}>
            <CardHeader>
              <CardTitle className="text-gray-600">Certificate Type</CardTitle>
              <CardDescription className="text-gray-500">Select the type of certificate to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={certificateType === 'fitness' ? 'default' : 'outline'}
                  onClick={() => setCertificateType('fitness')}
                  className={certificateType === 'fitness' 
                    ? 'bg-green-600 hover:bg-green-700 text-white font-bold' 
                    : 'bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold'}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Fitness Certificate
                </Button>
                <Button
                  variant={certificateType === 'unfitness' ? 'default' : 'outline'}
                  onClick={() => setCertificateType('unfitness')}
                  className={certificateType === 'unfitness' 
                    ? 'bg-green-600 hover:bg-green-700 text-white font-bold' 
                    : 'bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold'}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Unfitness Certificate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Form */}
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-gray-600">
                {certificateType === 'fitness' ? 'Fitness' : 'Unfitness'} Certificate Details
              </CardTitle>
              <CardDescription className="text-gray-500">
                Fill in the patient information and examination details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePreview(); }}>
                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="certPatientName" className="text-gray-600">Patient Name *</Label>
                      <Input
                        id="certPatientName"
                        placeholder="Enter patient full name"
                        value={patientName}
                        onChange={(e: any) => setPatientName(e.target.value)}
                        required
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certAge" className="text-gray-600">Age *</Label>
                      <Input
                        id="certAge"
                        type="number"
                        placeholder="Enter age"
                        value={age}
                        onChange={(e: any) => setAge(e.target.value)}
                        required
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certGender" className="text-gray-600">Gender *</Label>
                      <select
                        id="certGender"
                        className={`w-full h-10 px-3 rounded-lg ${inputStyle}`}
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        Pronoun will be: {pronounCap}/{object}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="examDate" className="text-gray-600">Examination Date</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={examDate}
                        onChange={(e: any) => setExamDate(e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate Specific Fields */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Certificate Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purpose" className="text-gray-600">Purpose of Certificate</Label>
                      <Input
                        id="purpose"
                        placeholder="e.g., Employment, Sports, Travel, etc."
                        value={purpose}
                        onChange={(e: any) => setPurpose(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrestDays" className="text-gray-600">Bedrest Days (approx)</Label>
                        <Input
                          id="bedrestDays"
                          placeholder="e.g., 5"
                          value={bedrestDays}
                          onChange={(e: any) => setBedrestDays(e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isolationDetails" className="text-gray-600">Isolation / Investigations / Hospitalization</Label>
                        <Input
                          id="isolationDetails"
                          placeholder="e.g., Xray, USG, Scan, Surgery"
                          value={isolationDetails}
                          onChange={(e: any) => setIsolationDetails(e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noHistoryNotes" className="text-gray-600">No Major History / Allergy Notes</Label>
                      <Input
                        id="noHistoryNotes"
                        placeholder="Optional notes"
                        value={noHistoryNotes}
                        onChange={(e: any) => setNoHistoryNotes(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    {certificateType === 'fitness' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="findings" className="text-gray-600">Examination Findings</Label>
                          <textarea
                            id="findings"
                            className={`w-full min-h-24 p-3 rounded-lg ${inputStyle}`}
                            placeholder="Enter examination findings (e.g., General physical examination within normal limits...)"
                            value={findings}
                            onChange={(e) => setFindings(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil" className="text-gray-600">Valid Until</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={validUntil}
                            onChange={(e: any) => setValidUntil(e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="findings" className="text-gray-600">Medical Condition/Findings</Label>
                          <textarea
                            id="findings"
                            className={`w-full min-h-24 p-3 rounded-lg ${inputStyle}`}
                            placeholder="Enter medical condition or findings that make the patient unfit..."
                            value={findings}
                            onChange={(e) => setFindings(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recommendation" className="text-gray-600">Recommendations</Label>
                          <textarea
                            id="recommendation"
                            className={`w-full min-h-24 p-3 rounded-lg ${inputStyle}`}
                            placeholder="Enter recommendations (e.g., Rest advised for X days, Follow-up required, etc.)"
                            value={recommendation}
                            onChange={(e) => setRecommendation(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil" className="text-gray-600">Unfit Until (Optional)</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={validUntil}
                            onChange={(e: any) => setValidUntil(e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold transition-all"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold transition-all"
                    onClick={() => {
                      setPatientName('');
                      setAge('');
                      setGender('male');
                      setPurpose('');
                      setFindings('');
                      setRecommendation('');
                      setBedrestDays('');
                      setIsolationDetails('');
                      setNoHistoryNotes('');
                      setValidUntil('');
                    }}
                  >
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
            <Button 
              onClick={handlePrint} 
              className="bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold px-8 h-12 transition-all"
            >
              Print / Download Certificate
            </Button>
            <Button 
              className="bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold px-8 h-12 transition-all"
              onClick={() => setShowPreview(false)}
            >
              Edit Certificate
            </Button>
            <Button 
              className="bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold px-8 h-12 transition-all"
              onClick={() => {
                setShowPreview(false);
                setPatientName('');
                setAge('');
                setGender('male');
                setPurpose('');
                setFindings('');
                setRecommendation('');
                setBedrestDays('');
                setIsolationDetails('');
                setNoHistoryNotes('');
                setValidUntil('');
              }}
            >
              Create New
            </Button>
          </div>

          {/* Certificate Preview - A5 Size */}
          <div className="certificate-container">
            <div className="certificate-page bg-white" id="certificate-preview">
              {/* Certificate Header */}
              <div className="border-b-2 border-black pb-3 mb-4">
                <div className="flex justify-between items-start">
                  <div className="w-1/4">
                    <img
                      src="/saisamarthlogo.png"
                      alt="Clinic Logo"
                      className="w-16 h-auto object-contain"
                    />
                  </div>
                  <div className="w-1/2 text-center text-[10px] leading-tight">
                    <p className="text-[12px] font-semibold uppercase">{doctorProfile.clinicName}</p>
                    <p>{doctorProfile.clinicAddress}, {doctorProfile.clinicCity}</p>
                    <p>{doctorProfile.clinicState} - {doctorProfile.clinicZip}</p>
                  </div>
                  <div className="w-1/4 text-right text-[10px] leading-tight">
                    <p className="text-[12px] font-bold">{doctorProfile.firstName} {doctorProfile.lastName}</p>
                    <p>{doctorProfile.designation}</p>
                    <p>Reg. No: {doctorProfile.registrationNumber}</p>
                  </div>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-4">
                <p className="text-[12px] font-bold underline underline-offset-4 tracking-wide">
                  FITNESS / UNFITNESS CERTIFICATE
                </p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-3 text-[11px] text-gray-900 leading-relaxed">
                <p>
                  Here with it is to certify that{' '}
                  <span className="inline-block min-w-[60px] border-b border-black text-center px-1">{age || ' '}</span>{' '}
                  yrs{' '}
                  <span className="inline-block min-w-[160px] border-b border-black text-center px-1">
                    {patientName || ' '}
                  </span>{' '}
                  {gender === 'male' ? 'M' : 'F'} is/was under my therapy since / Checked by me{' '}
                  <span className="inline-block min-w-[80px] border-b border-black text-center px-1">
                    {formattedExamDate || ' '}
                  </span>{' '}
                  for / due to{' '}
                  <span className="inline-block min-w-[160px] border-b border-black text-center px-1">
                    {findings || ' '}
                  </span>
                </p>

                <p>
                  {pronounCap} is / was advised a bedrest & medication for approx{' '}
                  <span className="inline-block min-w-[60px] border-b border-black text-center px-1">
                    {bedrestDays || ' '}
                  </span>{' '}
                  days or till {possessive} recovery along with an isolation/ Lab investigations / Xray / USG / Scan / Surgery / Hospitalization{' '}
                  <span className="inline-block min-w-[120px] border-b border-black text-center px-1">
                    {isolationDetails || ' '}
                  </span>
                </p>

                <p>
                  There is no P/H/O any major physical or psychological disease / disorder / allergy of any drug{' '}
                  <span className="inline-block min-w-[160px] border-b border-black text-center px-1">
                    {noHistoryNotes || ' '}
                  </span>
                </p>

                <p>
                  {pronounCap} is well oriented & Conscious. And all {possessive} motor activities / reflexes / Sensory organs are normal / abnormal
                </p>

                <p>
                  I found {object} to be{' '}
                  <span className="font-bold">{certificateType === 'fitness' ? 'FIT' : 'UNFIT'}</span>{' '}
                  on{' '}
                  <span className="inline-block min-w-[80px] border-b border-black text-center px-1">
                    {formattedValidUntil || ' '}
                  </span>{' '}
                  to resume {possessive} duties / works / studies / to travel / to participate in Physical / Mental activities / Extend the leave w.e.f. 
                  <span className="inline-block min-w-[80px] border-b border-black text-center px-1">
                    {formattedValidUntil || ' '}
                  </span>
                </p>

                <p>
                  with appropriate care / dressing / physiotherapy / medication / immobilisation
                </p>
              </div>

              {/* Place and Date */}
              <div className="mt-6 text-[11px]">
                <p>Place : {doctorProfile.clinicCity || ' '}</p>
                <p>Date : {formattedIssueDate}</p>
              </div>

              {/* Footer Disclaimer */}
              <div className="mt-6 text-center text-[9px] text-gray-600 leading-tight">
                <p>(This Certificate is issued on demand of patient & on documents/identity proofs</p>
                <p>submitted by patient. It is not for medico legal purpose.)</p>
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
