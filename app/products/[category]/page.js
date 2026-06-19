'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function CategoryProductsPage() {
  const params = useParams();
  const category = params.category;
  const { products } = useStore();

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
        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.isNew - a.isNew || b.id - a.id;
        if (sortBy === 'bestseller') return b.isBestSeller - a.isBestSeller;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
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

  return (
    <div className="">
      <header className="">
        <div className="">
          <h1 className="">{displayCat}</h1>
          <p className="">Discover premium {displayCat.toLowerCase()} crafted for clarity and style.</p>
        </div>

        <div className="">
          <button
            className=""
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          
          <div className="">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className=""
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

      <div className="">
        {/* Sidebar Filters */}
        <aside className={`${""} ${mobileFiltersOpen ? "" : ''}`}>
          <div className="">
            <h3>Filters</h3>
            <button className="" onClick={() => setMobileFiltersOpen(false)}>✕</button>
          </div>

          {/* Gender Filter */}
          <div className="">
            <h4 className="">Gender</h4>
            <div className="">
              {['men', 'women', 'unisex', 'kids'].map(gender => (
                <label key={gender} className="">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(gender)}
                    onChange={() => toggleFilter(selectedGenders, setSelectedGenders, gender)}
                  />
                  <span className="">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Frame Shape */}
          {filterOptions.shapes.length > 0 && (
            <div className="">
              <h4 className="">Frame Shape</h4>
              <div className="">
                {filterOptions.shapes.map(shape => (
                  <label key={shape} className="">
                    <input
                      type="checkbox"
                      checked={selectedShapes.includes(shape)}
                      onChange={() => toggleFilter(selectedShapes, setSelectedShapes, shape)}
                    />
                    <span className="">{shape}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Frame Material */}
          {filterOptions.materials.length > 0 && (
            <div className="">
              <h4 className="">Material</h4>
              <div className="">
                {filterOptions.materials.map(material => (
                  <label key={material} className="">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, material)}
                    />
                    <span className="">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {filterOptions.colors.length > 0 && (
            <div className="">
              <h4 className="">Frame Color</h4>
              <div className="">
                {filterOptions.colors.map(color => (
                  <label key={color} className="">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleFilter(selectedColors, setSelectedColors, color)}
                    />
                    <span className="">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="">
            <h4 className="">Price Range</h4>
            <div className="">
              <input
                type="number"
                placeholder="Min ($)"
                value={priceRange.min}
                onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                className=""
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={priceRange.max}
                onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                className=""
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="">
            <h4 className="">Customer Rating</h4>
            <div className="">
              {[4, 3, 2].map(stars => (
                <label key={stars} className="">
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={minRating === stars}
                    onChange={() => setMinRating(stars)}
                  />
                  <span className="">
                    {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} & Up
                  </span>
                </label>
              ))}
              {minRating > 0 && (
                <button className="" onClick={() => setMinRating(0)}>
                  Clear Rating Filter
                </button>
              )}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button className="" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Product Grid Panel */}
        <main className="">
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="">
              {selectedGenders.map(g => (
                <span key={g} className="" onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}>
                  Gender: {g} ✕
                </span>
              ))}
              {selectedShapes.map(s => (
                <span key={s} className="" onClick={() => toggleFilter(selectedShapes, setSelectedShapes, s)}>
                  Shape: {s} ✕
                </span>
              ))}
              {selectedMaterials.map(m => (
                <span key={m} className="" onClick={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)}>
                  Material: {m} ✕
                </span>
              ))}
              {selectedColors.map(c => (
                <span key={c} className="" onClick={() => toggleFilter(selectedColors, setSelectedColors, c)}>
                  Color: {c} ✕
                </span>
              ))}
              {(priceRange.min || priceRange.max) && (
                <span className="" onClick={() => setPriceRange({ min: '', max: '' })}>
                  Price: {priceRange.min ? `$${priceRange.min}` : '$0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'} ✕
                </span>
              )}
              {minRating > 0 && (
                <span className="" onClick={() => setMinRating(0)}>
                  Rating: {minRating}+ ★ ✕
                </span>
              )}
              <button className="" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}

          <div className="">
            <p className="">
              Showing <strong>{filteredProducts.length}</strong> of {categoryProducts.length} products
            </p>
          </div>

          <div className="">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="">
                <span className="">🔍</span>
                <h3>No frames match your filters</h3>
                <p>Try clearing some filters or widening your search criteria.</p>
                <button className="" onClick={clearAllFilters}>
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
