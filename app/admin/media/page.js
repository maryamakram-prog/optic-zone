'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Static fallbacks for mock media gallery
const STATIC_MEDIA = [
  { name: 'rayban_aviator.jpg', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80' },
  { name: 'oakley_titanium.jpg', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80' },
  { name: 'vogue_cat_eye.jpg', url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80' },
  { name: 'fossil_digital_blue.jpg', url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80' },
  { name: 'gucci_luxury_wayfarer.jpg', url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80' },
  { name: 'prada_wire_frame.jpg', url: 'https://images.unsplash.com/photo-1513673054901-2b5f51551112?w=600&q=80' }
];

export default function AdminMediaPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  const fetchImages = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setImages(STATIC_MEDIA);
      setLoading(false);
      return;
    }

    try {
      // List items in 'products' folder inside bucket 'product_images'
      const { data, error } = await supabase.storage
        .from('product_images')
        .list('products', {
          limit: 50,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      if (data) {
        const mapped = data.map(item => {
          const { data: { publicUrl } } = supabase.storage
            .from('product_images')
            .getPublicUrl(`products/${item.name}`);
          return {
            name: item.name,
            url: publicUrl,
            metadata: item.metadata
          };
        });
        setImages(mapped);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      // Fallback
      setImages(STATIC_MEDIA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      if (!isSupabaseConfigured) {
        alert('Supabase is not configured. Adding file mock locally.');
        const mockUrl = URL.createObjectURL(file);
        setImages(prev => [{ name: file.name, url: mockUrl }, ...prev]);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (error) throw error;

      alert('Image uploaded to storage successfully!');
      fetchImages();
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm('Are you sure you want to delete this image from storage?')) return;

    try {
      if (!isSupabaseConfigured) {
        setImages(prev => prev.filter(img => img.name !== fileName));
        alert('Image deleted from mock list.');
        return;
      }

      const { error } = await supabase.storage
        .from('product_images')
        .remove([`products/${fileName}`]);

      if (error) throw error;

      alert('Image deleted from storage bucket.');
      fetchImages();
    } catch (err) {
      console.error(err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleCopyUrl = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Media Library</h1>
          <p className="text-sm text-dark-gray mt-1">Upload and manage product catalog assets directly in Supabase Storage</p>
        </div>
        <div>
          <label className={`px-5 py-2.5 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-black/10 hover:-translate-y-0.5 inline-block cursor-pointer ${
            uploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}>
            {uploading ? 'Uploading Image...' : '📤 Upload New Asset'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* RLS/Config Warning Indicator */}
      {!isSupabaseConfigured && (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-xs font-semibold">
          ⚠️ **Supabase Storage Offline**: Using mock gallery data. Images uploaded now will be held in page state temporarily.
        </div>
      )}

      {/* Grid of Images */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-dark-gray">Indexing assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-mid-gray/40 overflow-hidden shadow-sm flex flex-col justify-between hover-lift">
              {/* Image Preview Container */}
              <div className="aspect-video w-full bg-light-gray relative group">
                <img 
                  src={img.url} 
                  alt={img.name} 
                  className="w-full h-full object-cover" 
                  onError={e => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHRleHQgeD0iMTAiIHk9IjUwIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij5JbWFnZTwvdGV4dD48L3N2Zz4='; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleCopyUrl(img.url, idx)}
                    className="p-2 bg-white text-charcoal hover:bg-light-gray rounded-xl shadow-md text-xs font-bold transition-all"
                  >
                    {copiedIndex === idx ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button 
                    onClick={() => handleDelete(img.name)}
                    className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-md text-xs font-bold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Detail Footer */}
              <div className="p-4 space-y-3">
                <span className="text-xs font-mono font-bold text-charcoal truncate block" title={img.name}>
                  {img.name}
                </span>
                <button 
                  onClick={() => handleCopyUrl(img.url, idx)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    copiedIndex === idx 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-light-gray/50 hover:bg-mid-gray/40 text-charcoal border-mid-gray/30'
                  }`}
                >
                  {copiedIndex === idx ? '✅ Copied to Clipboard!' : '🔗 Copy Image URL'}
                </button>
              </div>
            </div>
          ))}
          
          {images.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-mid-gray/40">
              <span className="text-4xl mb-4 block">🖼️</span>
              <h3 className="text-lg font-bold text-charcoal mb-2">No assets found in store bucket</h3>
              <p className="text-sm text-dark-gray max-w-sm mx-auto mb-6">Upload frames or lenses images directly to construct your listing URLs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
