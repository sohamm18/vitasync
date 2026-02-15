import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Building2, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';

// 👇 CHANGED: Using ./ (relative path) instead of @/ (alias)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';

// 👇 CHANGED: Using ./ (relative path)
import { useAppContext, Company, Medicine } from './context/AppContext';
// At the top of Dashboard.tsx, BillsContent.tsx, etc.
import { patientService } from '../services/api';

export default function PharmacyContent() {
  const { companies, setCompanies } = useAppContext();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [medicineSearch, setMedicineSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const newCompanies: Company[] = [];
        
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          
          const medicines: Medicine[] = jsonData.map((row, index) => ({
            id: `${sheetName}-${index}-${Date.now()}`,
            name: row['Medicine Name'] || row['Name'] || row['medicine'] || row['name'] || '',
            company: sheetName,
            dosage: row['Dosage'] || row['dosage'] || '',
            type: row['Type'] || row['type'] || '',
          })).filter(med => med.name);

          if (medicines.length > 0) {
            newCompanies.push({
              name: sheetName,
              medicines,
            });
          }
        });

        setCompanies(newCompanies);
        toast.success(`Successfully imported ${newCompanies.length} companies`);
      } catch (error) {
        toast.error('Error reading Excel file');
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const getFilteredMedicines = (company: Company) => {
    return company.medicines.filter(med =>
      med.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">Pharmacy Management</h2>
        <p className="text-gray-600 mt-1">Import and manage medicine inventory</p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import Medicines</CardTitle>
          <CardDescription>
            Upload an Excel file. Each sheet should represent a company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-4">
                Click to upload or drag and drop Excel file
              </p>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Select Excel File
              </Button>
            </div>
            {companies.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                ✓ {companies.length} companies loaded with {companies.reduce((sum, c) => sum + c.medicines.length, 0)} medicines
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company List */}
      {companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Browse medicines by company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e: any) => setCompanySearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <Sheet key={company.name}>
                  <SheetTrigger asChild>
                    <div 
                      className="cursor-pointer p-4 border rounded-lg hover:shadow-md transition-all bg-white flex items-start gap-3"
                      onClick={() => {
                        setSelectedCompany(company);
                        setMedicineSearch('');
                      }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.medicines.length} medicines</p>
                      </div>
                    </div>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>{company.name}</SheetTitle>
                      <SheetDescription>
                        {company.medicines.length} medicines available
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4 h-full flex flex-col">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          placeholder="Search medicines..."
                          value={medicineSearch}
                          onChange={(e: any) => setMedicineSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-2 pb-20">
                        {getFilteredMedicines(company).map((medicine) => (
                          <div key={medicine.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full border">
                                {medicine.type || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Dosage:</span> {medicine.dosage || 'N/A'}
                            </p>
                          </div>
                        ))}
                        {getFilteredMedicines(company).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No medicines found matching "{medicineSearch}"
                          </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}