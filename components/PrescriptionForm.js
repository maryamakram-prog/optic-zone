'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const SPH_OPTIONS = [
  '0.00 (Plano)',
  ...Array.from({ length: 81 }, (_, i) => {
    const val = -10.00 + i * 0.25;
    return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  }).filter(v => parseFloat(v) !== 0)
];

const CYL_OPTIONS = [
  '0.00 (None)',
  ...Array.from({ length: 49 }, (_, i) => {
    const val = -6.00 + i * 0.25;
    return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  }).filter(v => parseFloat(v) !== 0)
];

const AXIS_OPTIONS = Array.from({ length: 180 }, (_, i) => (i + 1).toString());

const ADD_OPTIONS = [
  'None',
  ...Array.from({ length: 16 }, (_, i) => {
    const val = 0.25 + i * 0.25;
    return `+${val.toFixed(2)}`;
  })
];

const PD_OPTIONS = Array.from({ length: 31 }, (_, i) => (50 + i).toString());

export default function PrescriptionForm({ isOpen, onClose, onSave, initialPrescription }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'upload' | 'saved'
  const [savedPrescriptions, setSavedPrescriptions] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  
  // Manual state
  const [manualRx, setManualRx] = useState({
    name: 'My Prescription',
    od_sph: '0.00 (Plano)',
    od_cyl: '0.00 (None)',
    od_axis: '',
    od_add: 'None',
    os_sph: '0.00 (Plano)',
    os_cyl: '0.00 (None)',
    os_axis: '',
    os_add: 'None',
    pd: '63',
    notes: '',
  });

  // File upload state
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadRxName, setUploadRxName] = useState('My Uploaded Prescription');

  // General state
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [selectedSavedId, setSelectedSavedId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialPrescription) {
      if (initialPrescription.type === 'manual') {
        setManualRx({
          name: initialPrescription.name || 'My Prescription',
          od_sph: initialPrescription.od_sph || '0.00 (Plano)',
          od_cyl: initialPrescription.od_cyl || '0.00 (None)',
          od_axis: initialPrescription.od_axis || '',
          od_add: initialPrescription.od_add || 'None',
          os_sph: initialPrescription.os_sph || '0.00 (Plano)',
          os_cyl: initialPrescription.os_cyl || '0.00 (None)',
          os_axis: initialPrescription.os_axis || '',
          os_add: initialPrescription.os_add || 'None',
          pd: initialPrescription.pd || '63',
          notes: initialPrescription.notes || '',
        });
        setActiveTab('manual');
      } else if (initialPrescription.type === 'upload') {
        setUploadedUrl(initialPrescription.file_url || '');
        setUploadRxName(initialPrescription.name || 'My Uploaded Prescription');
        setActiveTab('upload');
      }
    }
  }, [initialPrescription, isOpen]);

  // Load user's saved prescriptions
  useEffect(() => {
    if (user && isOpen) {
      fetchSavedPrescriptions();
    }
  }, [user, isOpen]);

  const fetchSavedPrescriptions = async () => {
    setLoadingSaved(true);
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_saved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedPrescriptions(data || []);
    } catch (err) {
      console.error('Error fetching saved prescriptions:', err.message);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualRx(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMsg('Only JPG, PNG, and PDF files are allowed.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMsg('File size must be under 5MB.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setErrorMsg('');
    }
  };

  const uploadPrescriptionFile = async (selectedFile) => {
    setIsUploading(true);
    setErrorMsg('');
    setUploadProgress(10);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadProgress(40);
      
      const { error: uploadError, data } = await supabase.storage
        .from('prescriptions')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setUploadedUrl(publicUrl);
      return publicUrl;
    } catch (err) {
      setErrorMsg(`Upload failed: ${err.message}`);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveToProfile = async (rxData) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert([{
          ...rxData,
          user_id: user.id,
          is_saved: true,
          created_at: new Date().toISOString()
        }]);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving to profile:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'manual') {
      // Validation for Manual
      const odCylVal = parseFloat(manualRx.od_cyl);
      const osCylVal = parseFloat(manualRx.os_cyl);

      if (odCylVal !== 0 && !manualRx.od_axis) {
        setErrorMsg('Axis (1-180) is required for Right Eye (OD) when Cylinder is not 0.00.');
        return;
      }
      if (osCylVal !== 0 && !manualRx.os_axis) {
        setErrorMsg('Axis (1-180) is required for Left Eye (OS) when Cylinder is not 0.00.');
        return;
      }

      const prescriptionData = {
        type: 'manual',
        name: manualRx.name || 'My Prescription',
        od_sph: manualRx.od_sph,
        od_cyl: manualRx.od_cyl,
        od_axis: manualRx.od_axis || null,
        od_add: manualRx.od_add,
        os_sph: manualRx.os_sph,
        os_cyl: manualRx.os_cyl,
        os_axis: manualRx.os_axis || null,
        os_add: manualRx.os_add,
        pd: manualRx.pd,
        notes: manualRx.notes,
        file_url: null
      };

      if (saveToProfile && user) {
        await handleSaveToProfile(prescriptionData);
      }

      onSave(prescriptionData);
      triggerSuccess();

    } else if (activeTab === 'upload') {
      let finalUrl = uploadedUrl;
      
      if (file) {
        try {
          finalUrl = await uploadPrescriptionFile(file);
        } catch (e) {
          return; // Upload error handles state
        }
      }

      if (!finalUrl) {
        setErrorMsg('Please upload a prescription image or PDF.');
        return;
      }

      const prescriptionData = {
        type: 'upload',
        name: uploadRxName || 'My Uploaded Prescription',
        file_url: finalUrl,
        notes: manualRx.notes
      };

      if (saveToProfile && user) {
        await handleSaveToProfile(prescriptionData);
      }

      onSave(prescriptionData);
      triggerSuccess();

    } else if (activeTab === 'saved') {
      if (!selectedSavedId) {
        setErrorMsg('Please select a saved prescription.');
        return;
      }

      const selected = savedPrescriptions.find(p => p.id === selectedSavedId);
      if (!selected) {
        setErrorMsg('Selected prescription not found.');
        return;
      }

      // We clone the saved prescription data to detach it from the profile so future changes don't affect orders.
      const prescriptionData = {
        type: selected.type,
        name: selected.name,
        od_sph: selected.od_sph,
        od_cyl: selected.od_cyl,
        od_axis: selected.od_axis,
        od_add: selected.od_add,
        os_sph: selected.os_sph,
        os_cyl: selected.os_cyl,
        os_axis: selected.os_axis,
        os_add: selected.os_add,
        pd: selected.pd,
        notes: selected.notes,
        file_url: selected.file_url
      };

      onSave(prescriptionData);
      triggerSuccess();
    }
  };

  const handleSkipAndUploadLater = () => {
    const rxData = {
      type: 'upload_later',
      name: 'Upload Later',
      file_url: null,
      notes: 'Prescription will be uploaded after checkout.'
    };
    onSave(rxData);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-mid-gray/30 shadow-2xl relative overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col">
        {/* Banner line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-accent via-pastel-blue to-accent-dark shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-light-gray/60 hover:bg-light-gray flex items-center justify-center font-bold text-sm text-charcoal transition-colors z-10 cursor-pointer"
        >
          ✕
        </button>

        {success ? (
          <div className="p-12 text-center flex flex-col items-center justify-center flex-1 my-auto animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-md shadow-green-100/50">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-charcoal mb-2">Prescription Added!</h2>
            <p className="text-dark-gray text-base">Your prescription has been added successfully to this item.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-mid-gray/20 shrink-0">
              <h2 className="text-2xl font-black font-heading text-charcoal tracking-tight">👓 Configure Your Prescription</h2>
              <p className="text-xs text-dark-gray mt-1">Provide prescription details to ensure perfect lens accuracy.</p>
              
              {/* Tabs */}
              <div className="flex bg-light-gray/50 p-1 rounded-xl mt-4 border border-mid-gray/10">
                <button
                  type="button"
                  onClick={() => { setActiveTab('manual'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'manual' ? 'bg-white text-accent shadow-sm' : 'text-dark-gray hover:text-charcoal'}`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('upload'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'upload' ? 'bg-white text-accent shadow-sm' : 'text-dark-gray hover:text-charcoal'}`}
                >
                  Upload File
                </button>
                {user && (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('saved'); setErrorMsg(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'saved' ? 'bg-white text-accent shadow-sm' : 'text-dark-gray hover:text-charcoal'}`}
                  >
                    Saved Rx ({savedPrescriptions.length})
                  </button>
                )}
              </div>
            </div>

            {/* Form Area */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold border border-red-100">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* TAB 1: MANUAL ENTRY */}
                {activeTab === 'manual' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-gray mb-1.5">Prescription Name</label>
                      <input
                        type="text"
                        name="name"
                        value={manualRx.name}
                        onChange={handleManualChange}
                        placeholder="e.g. Daily Use, Reading"
                        required
                        className="w-full px-4 py-2.5 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>

                    {/* Prescription Grid */}
                    <div className="border border-mid-gray/30 rounded-2xl overflow-hidden bg-light-gray/10">
                      {/* Grid Header */}
                      <div className="grid grid-cols-5 gap-2 bg-light-gray/60 px-4 py-2 text-[10px] font-bold text-dark-gray uppercase tracking-wider border-b border-mid-gray/25">
                        <div className="col-span-1">Eye</div>
                        <div>SPH</div>
                        <div>CYL</div>
                        <div>AXIS</div>
                        <div>ADD</div>
                      </div>

                      {/* Right Eye (OD) Row */}
                      <div className="grid grid-cols-5 gap-2 px-4 py-3 items-center border-b border-mid-gray/25">
                        <div className="text-xs font-bold text-charcoal">OD (Right)</div>
                        <select
                          name="od_sph"
                          value={manualRx.od_sph}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {SPH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <select
                          name="od_cyl"
                          value={manualRx.od_cyl}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {CYL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <input
                          type="number"
                          name="od_axis"
                          value={manualRx.od_axis}
                          onChange={handleManualChange}
                          placeholder="1-180"
                          min="1"
                          max="180"
                          className="px-2 py-1 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 text-center font-semibold"
                        />
                        <select
                          name="od_add"
                          value={manualRx.od_add}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {ADD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>

                      {/* Left Eye (OS) Row */}
                      <div className="grid grid-cols-5 gap-2 px-4 py-3 items-center">
                        <div className="text-xs font-bold text-charcoal">OS (Left)</div>
                        <select
                          name="os_sph"
                          value={manualRx.os_sph}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {SPH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <select
                          name="os_cyl"
                          value={manualRx.os_cyl}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {CYL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <input
                          type="number"
                          name="os_axis"
                          value={manualRx.os_axis}
                          onChange={handleManualChange}
                          placeholder="1-180"
                          min="1"
                          max="180"
                          className="px-2 py-1 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 text-center font-semibold"
                        />
                        <select
                          name="os_add"
                          value={manualRx.os_add}
                          onChange={handleManualChange}
                          className="px-2 py-1.5 bg-white border border-mid-gray/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent/30 font-semibold"
                        >
                          {ADD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* PD */}
                    <div className="w-1/2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-gray mb-1.5">PD (Pupillary Distance)</label>
                      <select
                        name="pd"
                        value={manualRx.pd}
                        onChange={handleManualChange}
                        className="px-4 py-2.5 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold w-full"
                      >
                        {PD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} mm</option>)}
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-gray mb-1.5">Additional Notes</label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={manualRx.notes}
                        onChange={handleManualChange}
                        placeholder="Any additional details or instructions from your optometrist..."
                        className="w-full px-4 py-2.5 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: UPLOAD FILE */}
                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-gray mb-1.5">Prescription Label</label>
                      <input
                        type="text"
                        value={uploadRxName}
                        onChange={e => setUploadRxName(e.target.value)}
                        placeholder="e.g. My Uploaded Prescription"
                        className="w-full px-4 py-2.5 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>

                    {/* Drag and Drop File Input */}
                    <div className="border-2 border-dashed border-mid-gray/80 rounded-2xl p-6 text-center hover:border-accent hover:bg-accent/5 transition-all relative flex flex-col items-center justify-center bg-light-gray/10">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="text-4xl mb-3">📄</span>
                      <p className="text-sm font-bold text-charcoal">Drag and drop file here, or click to upload</p>
                      <p className="text-xs text-dark-gray mt-1">Accepts JPG, PNG, or PDF up to 5MB.</p>
                      {file && (
                        <div className="mt-4 bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl text-xs text-accent font-semibold flex items-center gap-2">
                          ✓ File selected: <span className="font-bold">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                      {uploadedUrl && !file && (
                        <div className="mt-4 bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-xs text-green-700 font-semibold flex items-center gap-2">
                          ✓ Saved Prescription File Loaded.
                        </div>
                      )}
                    </div>

                    {isUploading && (
                      <div className="w-full bg-light-gray h-2.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-gray mb-1.5">Additional Notes</label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={manualRx.notes}
                        onChange={handleManualChange}
                        placeholder="Any comments regarding the upload..."
                        className="w-full px-4 py-2.5 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: SAVED PRESCRIPTIONS */}
                {activeTab === 'saved' && (
                  <div className="space-y-6">
                    {loadingSaved ? (
                      <p className="text-center text-sm text-dark-gray">Loading saved prescriptions...</p>
                    ) : savedPrescriptions.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-dark-gray">No saved prescriptions found in your account.</p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('manual')}
                          className="mt-3 text-xs font-bold text-accent hover:underline cursor-pointer"
                        >
                          + Create a new one manually
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-dark-gray">Choose a Saved Prescription</span>
                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                          {savedPrescriptions.map(rx => (
                            <button
                              key={rx.id}
                              type="button"
                              onClick={() => setSelectedSavedId(rx.id)}
                              className={`text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedSavedId === rx.id ? 'border-accent bg-accent/5' : 'border-mid-gray/30 hover:border-accent/40 bg-white'}`}
                            >
                              <div>
                                <span className={`font-bold block text-sm ${selectedSavedId === rx.id ? 'text-accent' : 'text-charcoal'}`}>{rx.name}</span>
                                <span className="text-[10px] text-dark-gray/70 mt-0.5 block">
                                  {rx.type === 'manual' 
                                    ? `OD: SPH ${rx.od_sph} | OS: SPH ${rx.os_sph} | PD ${rx.pd}mm` 
                                    : `Uploaded Document (${rx.file_url ? 'Active' : 'Missing File'})`}
                                </span>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 border-mid-gray">
                                {selectedSavedId === rx.id && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Save checkbox (manual or upload, logged in) */}
                {user && activeTab !== 'saved' && (
                  <label className="flex items-center gap-2.5 p-1 text-xs text-charcoal font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveToProfile}
                      onChange={e => setSaveToProfile(e.target.checked)}
                      className="rounded border-mid-gray text-accent focus:ring-accent"
                    />
                    <span>Save this prescription to my profile for future purchases</span>
                  </label>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-mid-gray/20 bg-light-gray/20 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={handleSkipAndUploadLater}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-dark-gray border border-mid-gray/50 hover:bg-light-gray rounded-xl transition-all cursor-pointer text-center"
                >
                  Skip & Upload Later
                </button>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-bold text-charcoal bg-white border border-mid-gray/30 hover:bg-light-gray rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 sm:flex-initial px-8 py-2.5 text-xs font-bold bg-gradient-to-r from-accent to-pastel-blue text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-75 cursor-pointer"
                  >
                    {isUploading ? 'Uploading...' : 'Confirm Prescription'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
