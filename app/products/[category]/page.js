'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function CategoryProductsPage() {
  const params = useParams();
  const category = params.category;
  const { products, loading } = useStore();

  // ─── Local Filter State ──────────────────────────────────────────
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ─── Category Normalization ──────────────────────────────────────
  let displayCat = category;
  let matchCat = category;

  if (category === 'reading-glasses') {
    matchCat = 'reading';
    displayCat = 'Reading Glasses';
  } else if (category === 'sports-glasses') {
    matchCat = 'sport';
    displayCat = 'Sports Glasses';
  } else if (category === 'eyeglasses') {
    matchCat = 'eyeglasses';
    displayCat = 'Eyeglasses';
  } else if (category === 'sunglasses') {
    matchCat = 'sunglasses';
    displayCat = 'Sunglasses';
  }

  // ─── Filtering Logic ─────────────────────────────────────────────
  const categoryProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.category === matchCat);
  }, [products, matchCat]);

  // Extract unique colors, shapes, materials in this category for filtering options
  const filterOptions = useMemo(() => {
    const colors = new Set();
    const shapes = new Set();
    const materials = new Set();

    categoryProducts.forEach(p => {
      if (p.frameColor) colors.add(p.frameColor);
      if (p.frameShape) shapes.add(p.frameShape);
      if (p.frameMaterial) materials.add(p.frameMaterial);
    });

    return {
      colors: Array.from(colors),
      shapes: Array.from(shapes),
      materials: Array.from(materials)
    };
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter(p => {
        // Gender Filter
        if (selectedGenders.length > 0 && !selectedGenders.includes(p.gender)) return false;

        // Shape Filter
        if (selectedShapes.length > 0 && !selectedShapes.includes(p.frameShape)) return false;

        // Material Filter
        if (selectedMaterials.length > 0 && !selectedMaterials.includes(p.frameMaterial)) return false;

        // Color Filter
        if (selectedColors.length > 0 && !selectedColors.includes(p.frameColor)) return false;

        // Price Filter
        if (priceRange.min && p.price < parseFloat(priceRange.min)) return false;
        if (priceRange.max && p.price > parseFloat(priceRange.max)) return false;

        // Rating Filter
        if (minRating > 0 && (p.rating || 5) < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'bestseller') return (b.sales || 0) - (a.sales || 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0; // Featured / No change
      });
  }, [categoryProducts, selectedGenders, selectedShapes, selectedMaterials, selectedColors, priceRange, minRating, sortBy]);

  // ─── Helpers ─────────────────────────────────────────────────────
  const toggleFilter = (list, setList, val) => {
    if (list.includes(val)) {
      setList(list.filter(item => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  const clearAllFilters = () => {
    setSelectedGenders([]);
    setSelectedShapes([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
    setSortBy('featured');
  };

  const activeFilterCount =
    selectedGenders.length +
    selectedShapes.length +
    selectedMaterials.length +
    selectedColors.length +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  if (loading) {
    return <div className="pt-24 pb-20 bg-soft-white min-h-screen flex items-center justify-center"><p>Loading products...</p></div>;
  }

  return (
    <div className="pt-24 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-mid-gray/40 pb-6">
          <div>
            <h1 className="text-4xl font-bold font-heading text-charcoal mb-2 capitalize">{displayCat}</h1>
            <p className="text-dark-gray/70">Discover premium {displayCat.toLowerCase()} crafted for clarity and style.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-medium border border-mid-gray/50"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-dark-gray hidden sm:block">Sort By:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-mid-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="featured">Featured</option>
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 ${mobileFiltersOpen ? "block" : 'hidden md:block'}`}>
            <div className="flex items-center justify-between md:hidden mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button className="p-2" onClick={() => setMobileFiltersOpen(false)}>✕</button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-mid-gray/30 shadow-sm space-y-6">
              
              {/* Gender Filter */}
              <div>
                <h4 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-wider">Gender</h4>
                <div className="space-y-2">
                  {['men', 'women', 'unisex', 'kids'].map(gender => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-accent focus:ring-accent"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => toggleFilter(selectedGenders, setSelectedGenders, gender)}
                      />
                      <span className="text-sm text-dark-gray capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Shape */}
              {filterOptions.shapes.length > 0 && (
                <div>
                  <h4 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-wider mt-6">Frame Shape</h4>
                  <div className="space-y-2">
                    {filterOptions.shapes.map(shape => (
                      <label key={shape} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-accent focus:ring-accent"
                          checked={selectedShapes.includes(shape)}
                          onChange={() => toggleFilter(selectedShapes, setSelectedShapes, shape)}
                        />
                        <span className="text-sm text-dark-gray capitalize">{shape}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Frame Material */}
              {filterOptions.materials.length > 0 && (
                <div>
                  <h4 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-wider mt-6">Material</h4>
                  <div className="space-y-2">
                    {filterOptions.materials.map(material => (
                      <label key={material} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-accent focus:ring-accent"
                          checked={selectedMaterials.includes(material)}
                          onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, material)}
                        />
                        <span className="text-sm text-dark-gray capitalize">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {filterOptions.colors.length > 0 && (
                <div>
                  <h4 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-wider mt-6">Color</h4>
                  <div className="space-y-2">
                    {filterOptions.colors.map(color => (
                      <label key={color} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-accent focus:ring-accent"
                          checked={selectedColors.includes(color)}
                          onChange={() => toggleFilter(selectedColors, setSelectedColors, color)}
                        />
                        <span className="text-sm text-dark-gray capitalize">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h4 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-wider mt-6">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-mid-gray rounded-lg text-sm"
                  />
                  <span className="text-dark-gray">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-mid-gray rounded-lg text-sm"
                  />
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button className="w-full mt-6 py-2 text-sm text-red-500 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid Panel */}
          <main className="flex-1">
            
            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedGenders.map(g => (
                  <span key={g} className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}>
                    Gender: {g} <span className="text-dark-gray">✕</span>
                  </span>
                ))}
                {selectedShapes.map(s => (
                  <span key={s} className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => toggleFilter(selectedShapes, setSelectedShapes, s)}>
                    Shape: {s} <span className="text-dark-gray">✕</span>
                  </span>
                ))}
                {selectedMaterials.map(m => (
                  <span key={m} className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)}>
                    Material: {m} <span className="text-dark-gray">✕</span>
                  </span>
                ))}
                {selectedColors.map(c => (
                  <span key={c} className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => toggleFilter(selectedColors, setSelectedColors, c)}>
                    Color: {c} <span className="text-dark-gray">✕</span>
                  </span>
                ))}
                {(priceRange.min || priceRange.max) && (
                  <span className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => setPriceRange({ min: '', max: '' })}>
                    Price: {priceRange.min ? `$${priceRange.min}` : '$0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'} <span className="text-dark-gray">✕</span>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="px-3 py-1 bg-white border border-mid-gray rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-50" onClick={() => setMinRating(0)}>
                    Rating: {minRating}+ ★ <span className="text-dark-gray">✕</span>
                  </span>
                )}
                <button className="text-xs text-accent font-medium ml-2 underline" onClick={clearAllFilters}>
                  Clear all
                </button>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-dark-gray">
                Showing <strong className="text-charcoal">{filteredProducts.length}</strong> of {categoryProducts.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-mid-gray/30">
                  <span className="text-4xl block mb-4">🔍</span>
                  <h3 className="text-xl font-bold text-charcoal mb-2">No frames match your filters</h3>
                  <p className="text-dark-gray mb-6">Try clearing some filters or widening your search criteria.</p>
                  <button className="px-6 py-2 bg-accent text-white rounded-xl font-medium" onClick={clearAllFilters}>
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
