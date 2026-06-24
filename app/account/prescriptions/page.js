'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import PrescriptionForm from '@/components/PrescriptionForm';

export default function AccountPrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRx, setEditingRx] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_saved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (err) {
      setErrorMsg('Failed to load prescriptions. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this saved prescription?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Hard delete if not linked to any order, or soft delete by setting is_saved = false
      // To keep historical order integrity, we soft delete by setting is_saved = false!
      // This is a crucial safety pattern!
      const { error } = await supabase
        .from('prescriptions')
        .update({ is_saved: false })
        .eq('id', id);

      if (error) throw error;
      setSuccessMsg('Prescription deleted successfully.');
      fetchPrescriptions();
    } catch (err) {
      setErrorMsg('Failed to delete prescription. ' + err.message);
    }
  };

  const handleEdit = (rx) => {
    setEditingRx(rx);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRx(null);
    setIsModalOpen(true);
  };

  const handleSavePrescription = async (rxData) => {
    // NOTE: PrescriptionForm is called with disableSaveToProfile=true here
    // because this page handles the DB write itself — prevents double-insert.
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (editingRx) {
        // Update existing saved prescription
        const { error } = await supabase
          .from('prescriptions')
          .update({
            name: rxData.name,
            type: rxData.type,
            od_sph: rxData.od_sph || null,
            od_cyl: rxData.od_cyl || null,
            od_axis: rxData.od_axis || null,
            od_add: rxData.od_add || null,
            os_sph: rxData.os_sph || null,
            os_cyl: rxData.os_cyl || null,
            os_axis: rxData.os_axis || null,
            os_add: rxData.os_add || null,
            pd: rxData.pd || null,
            notes: rxData.notes || null,
            file_url: rxData.file_url || null
          })
          .eq('id', editingRx.id);

        if (error) throw error;
        setSuccessMsg('Prescription updated successfully.');
      } else {
        // Add new prescription directly (PrescriptionForm disableSaveToProfile=true)
        const { error } = await supabase
          .from('prescriptions')
          .insert([{
            ...rxData,
            user_id: user.id,
            is_saved: true,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        setSuccessMsg('New prescription added to your profile.');
      }
      fetchPrescriptions();
    } catch (err) {
      // Friendly error for missing prescriptions table
      if (err.message && (err.message.includes('does not exist') || err.message.includes('schema cache') || err.message.includes('relation'))) {
        setErrorMsg('The prescriptions table is missing from your database. Please run the SQL migration script from supabase_update_to_uuid.sql in your Supabase SQL Editor.');
      } else {
        setErrorMsg('Failed to save prescription. ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">My Saved Prescriptions</h1>
          <p className="text-sm text-dark-gray mt-1">Manage your eye prescriptions for faster checkouts</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-5 py-3 bg-gradient-to-r from-accent to-pastel-blue hover:to-accent-dark text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-accent/20 cursor-pointer"
        >
          + Add Prescription
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 px-5 py-4 rounded-2xl text-xs font-semibold border border-red-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-800">
            <span>⚠️</span>
            <span>{errorMsg.includes('does not exist') || errorMsg.includes('schema cache') ? 'Database Error' : 'Error'}</span>
          </div>
          <p className="leading-relaxed font-medium">{errorMsg}</p>
          {(errorMsg.includes('does not exist') || errorMsg.includes('schema cache')) && (
            <div className="pt-1 flex flex-col gap-2">
              <p className="text-[10px] text-red-600 font-bold">
                The "prescriptions" table is missing from your Supabase database. Please execute the SQL migration script:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="/supabase_update_to_uuid.sql" 
                  download
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                >
                  Download SQL Migration Script
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-xs font-semibold border border-green-100">
          ✓ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-mid-gray/30">
          <p className="text-dark-gray font-medium">Loading your prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-mid-gray/30 p-8 shadow-sm">
          <span className="text-5xl block mb-4">👓</span>
          <h3 className="text-xl font-bold text-charcoal mb-2">No Saved Prescriptions</h3>
          <p className="text-dark-gray max-w-sm mx-auto mb-6 text-sm">Save your prescriptions here to quickly select them during checkout.</p>
          <button
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-charcoal text-white hover:bg-black font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Create Your First Prescription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map(rx => (
            <div key={rx.id} className="bg-white rounded-3xl p-6 border border-mid-gray/35 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-extrabold text-charcoal text-lg">{rx.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-block mt-1 ${
                      rx.type === 'manual' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-150' 
                        : 'bg-green-50 text-green-700 border border-green-150'
                    }`}>
                      {rx.type === 'manual' ? 'Manual Entry' : 'Uploaded Rx'}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(rx)}
                      className="p-2 text-dark-gray hover:text-accent bg-light-gray/40 hover:bg-accent/5 rounded-lg transition-colors cursor-pointer text-xs"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(rx.id)}
                      className="p-2 text-red-500 hover:text-red-700 bg-red-50/55 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {rx.type === 'manual' ? (
                  <div className="space-y-4">
                    {/* Prescription Table */}
                    <div className="border border-mid-gray/20 rounded-xl overflow-hidden text-xs bg-light-gray/20">
                      <div className="grid grid-cols-5 gap-1.5 bg-light-gray/40 px-3 py-1.5 font-semibold text-dark-gray uppercase text-[9px] border-b border-mid-gray/20">
                        <div>Eye</div>
                        <div>SPH</div>
                        <div>CYL</div>
                        <div>AXIS</div>
                        <div>ADD</div>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 px-3 py-2 border-b border-mid-gray/20 text-charcoal font-medium">
                        <div className="font-bold text-dark-gray">Right (OD)</div>
                        <div>{rx.od_sph}</div>
                        <div>{rx.od_cyl}</div>
                        <div>{rx.od_axis || '—'}</div>
                        <div>{rx.od_add || 'None'}</div>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 px-3 py-2 text-charcoal font-medium">
                        <div className="font-bold text-dark-gray">Left (OS)</div>
                        <div>{rx.os_sph}</div>
                        <div>{rx.os_cyl}</div>
                        <div>{rx.os_axis || '—'}</div>
                        <div>{rx.os_add || 'None'}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-charcoal">
                      <span className="font-bold text-dark-gray">Pupillary Distance (PD):</span>
                      <strong className="font-extrabold">{rx.pd} mm</strong>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-light-gray/25 p-4 rounded-2xl border border-mid-gray/25 text-xs text-charcoal">
                    <p className="flex justify-between items-center"><span className="font-bold text-dark-gray">File Link:</span> 
                      <a href={rx.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">
                        View Uploaded File ↗
                      </a>
                    </p>
                  </div>
                )}

                {rx.notes && (
                  <div className="mt-4 pt-3 border-t border-mid-gray/20 text-xs text-dark-gray">
                    <span className="font-bold text-charcoal block mb-0.5">Notes:</span>
                    <p className="italic leading-relaxed">{rx.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-[10px] text-dark-gray/60 text-right">
                Saved on {new Date(rx.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <PrescriptionForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRx(null);
        }}
        onSave={handleSavePrescription}
        initialPrescription={editingRx}
        disableSaveToProfile={true}
      />
    </div>
  );
}
