import { useEffect, useMemo, useState } from "react";
import "./App.css";

/*
  Mock marketplace data.
  Each product has variant-specific prices.
  EMI is calculated dynamically from the selected variant price.
*/
const mockProducts = [
  {
    id: 1,
    name: "iPhone 17",
    brand: "Apple",
    category: "Smartphones",
    price: 79999,
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80",
    description:
      "Experience the latest iPhone with a powerful processor, premium design and an advanced camera system.",
    variants: ["128 GB", "256 GB", "512 GB"],
    variantPrices: {
      "128 GB": 79999,
      "256 GB": 89999,
      "512 GB": 109999,
    },
  },

  {
    id: 2,
    name: "Google Pixel 10",
    brand: "Google",
    category: "Smartphones",
    price: 64999,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
    description:
      "A premium Android smartphone with an intelligent camera, smooth display and clean Google experience.",
    variants: ["128 GB", "256 GB"],
    variantPrices: {
      "128 GB": 64999,
      "256 GB": 74999,
    },
  },
{
  id: 3,
  name: "MacBook Air",
  brand: "Apple",
  category: "Laptops",
  price: 99990,
  image:
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80",
  description:
    "Thin, powerful and designed for everyday productivity with excellent battery life and performance.",
  variants: ["256 GB", "512 GB", "1 TB"],
  variantPrices: {
    "256 GB": 99990,
    "512 GB": 114990,
    "1 TB": 134990,
  },
},

  {
    id: 4,
    name: "Samsung Galaxy S26",
    brand: "Samsung",
    category: "Smartphones",
    price: 74999,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",
    description:
      "Premium smartphone experience with a vibrant display, powerful performance and versatile cameras.",
    variants: ["128 GB", "256 GB", "512 GB"],
    variantPrices: {
      "128 GB": 74999,
      "256 GB": 84999,
      "512 GB": 99999,
    },
  },

  {
    id: 5,
    name: 'Sony Bravia 55"',
    brand: "Sony",
    category: "Televisions",
    price: 72990,
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=700&q=80",
    description:
      "Immersive 4K entertainment with cinematic picture quality and an elegant slim design.",
    variants: ["55 inch", "65 inch"],
    variantPrices: {
      "55 inch": 72990,
      "65 inch": 89990,
    },
  },

  {
    id: 6,
    name: "Apple Watch Series",
    brand: "Apple",
    category: "Wearables",
    price: 44999,
    image:
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=700&q=80",
    description:
      "A smart companion for fitness, communication, health insights and everyday productivity.",
    variants: ["41 mm", "45 mm"],
    variantPrices: {
      "41 mm": 44999,
      "45 mm": 49999,
    },
  },
];

/*
  Mock API.
  Simulates a backend request with a small delay.
*/
function mockFetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 700);
  });
}

/*
  Format INR price.
*/
function formatPrice(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

/*
  Get price for currently selected variant.
*/
function getVariantPrice(product, variant) {
  return product.variantPrices?.[variant] ?? product.price;
}

/*
  Generate EMI plans dynamically from the selected variant price.
*/
function getEmiPlans(product, variant) {
  const price = getVariantPrice(product, variant);

  return [6, 12, 24].map((months) => ({
    months,
    amount: Math.round(price / months),
  }));
}

function App() {
  const [activeTab, setActiveTab] = useState("marketplace");

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState("");

  const [selectedEmi, setSelectedEmi] = useState(null);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  /*
    Load products when the application starts.
  */
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(false);

      const data = await mockFetchProducts();

      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  /*
    Open product details.
  */
  function openProduct(product) {
    const initialVariant = product.variants[0];

    const initialEmiPlans = getEmiPlans(product, initialVariant);

    setSelectedProduct(product);

    setSelectedVariant(initialVariant);

    /*
      Start with the 12-month EMI plan.
    */
    setSelectedEmi(initialEmiPlans[1]);

    setShowSuccess(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
    Return to marketplace.
  */
  function closeProduct() {
    setSelectedProduct(null);

    setShowSuccess(false);
  }

  /*
    Marketplace categories.
  */
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  /*
    Search and category filtering.
  */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.brand.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  /*
    Proceed CTA.
  */
  function proceedWithEmi() {
    if (!selectedProduct || !selectedEmi) {
      return;
    }

    setShowSuccess(true);
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">1</div>

          <span>1Fi</span>
        </div>

        <div className="header-title">Shop</div>

        <button
          className="profile-button"
          aria-label="Profile"
          type="button"
        >
          👤
        </button>
      </header>

      <main>
        {!selectedProduct ? (
          <>
            {/* SHOP TABS */}
            <section className="shop-tabs">
              <button
                type="button"
                className={
                  activeTab === "brands" ? "tab active" : "tab"
                }
                onClick={() => setActiveTab("brands")}
              >
                <span>⭐</span>
                Top Brands
              </button>

              <button
                type="button"
                className={
                  activeTab === "stores" ? "tab active" : "tab"
                }
                onClick={() => setActiveTab("stores")}
              >
                <span>📍</span>
                Nearby Stores
              </button>

              <button
                type="button"
                className={
                  activeTab === "marketplace"
                    ? "tab active"
                    : "tab"
                }
                onClick={() => setActiveTab("marketplace")}
              >
                <span>🛍️</span>
                1Fi Marketplace
              </button>
            </section>

            {/* TOP BRANDS / NEARBY STORES */}
            {activeTab !== "marketplace" ? (
              <section className="empty-page">
                <div className="empty-icon">
                  {activeTab === "brands" ? "⭐" : "📍"}
                </div>

                <h2>
                  {activeTab === "brands"
                    ? "Top Brands"
                    : "Nearby Stores"}
                </h2>

                <p>This section is coming soon.</p>
              </section>
            ) : (
              <>
                {/* HERO */}
                <section className="hero">
                  <div className="hero-content">
                    <span className="eyebrow">
                      1Fi MARKETPLACE
                    </span>

                    <h1>
                      Shop today.
                      <br />
                      Pay with <span>0% EMI.</span>
                    </h1>

                    <p>
                      Discover products from leading brands and
                      choose an EMI plan that works for you.
                    </p>
                  </div>

                  <div className="hero-card">
                    <div className="hero-card-icon">₹</div>

                    <strong>Flexible EMI</strong>

                    <small>
                      Choose a plan that fits your budget
                    </small>
                  </div>
                </section>

                {/* MARKETPLACE */}
                <section className="marketplace-section">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">DISCOVER</span>

                      <h2>Shop products</h2>
                    </div>

                    <span className="product-count">
                      {filteredProducts.length} products
                    </span>
                  </div>

                  {/* SEARCH */}
                  <div className="search-box">
                    <span>⌕</span>

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search products or brands"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* CATEGORIES */}
                  <div className="category-list">
                    {categories.map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={
                          category === item
                            ? "category active"
                            : "category"
                        }
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* LOADING */}
                  {loading ? (
                    <div className="loading-grid">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          className="skeleton-card"
                          key={item}
                        >
                          <div className="skeleton image-skeleton" />

                          <div className="skeleton line-skeleton" />

                          <div className="skeleton short-skeleton" />

                          <div className="skeleton button-skeleton" />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    /* ERROR */
                    <div className="state-box">
                      <div className="state-icon">!</div>

                      <h3>Unable to load products</h3>

                      <p>Please try again.</p>

                      <button
                        type="button"
                        className="primary-button"
                        onClick={loadProducts}
                      >
                        Retry
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    /* EMPTY SEARCH */
                    <div className="state-box">
                      <div className="state-icon">⌕</div>

                      <h3>No products found</h3>

                      <p>
                        Try another search or category.
                      </p>
                    </div>
                  ) : (
                    /* PRODUCT GRID */
                    <div className="product-grid">
                      {filteredProducts.map((product) => {
                        /*
                          Product cards show the lowest available
                          monthly EMI.
                        */
                        const lowestEmi = getEmiPlans(
                          product,
                          product.variants[
                            product.variants.length - 1
                          ]
                        ).find((plan) => plan.months === 24);

                        return (
                          <article
                            className="product-card"
                            key={product.id}
                          >
                            <div className="product-image-wrapper">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                              />

                              <span className="emi-badge">
                                0% EMI
                              </span>
                            </div>

                            <div className="product-info">
                              <span className="product-brand">
                                {product.brand}
                              </span>

                              <h3>{product.name}</h3>

                              <div className="price">
                                {formatPrice(product.price)}
                              </div>

                              <div className="monthly">
                                From{" "}
                                <strong>
                                  {formatPrice(lowestEmi.amount)}
                                </strong>
                                /month
                              </div>

                              <button
                                type="button"
                                className="product-button"
                                onClick={() =>
                                  openProduct(product)
                                }
                              >
                                View details

                                <span>→</span>
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        ) : (
          /* PRODUCT DETAILS */
          <ProductDetails
            product={selectedProduct}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            selectedEmi={selectedEmi}
            setSelectedEmi={setSelectedEmi}
            closeProduct={closeProduct}
            proceedWithEmi={proceedWithEmi}
            showSuccess={showSuccess}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bottom-nav">
        <button type="button">
          <span>⌂</span>
          Home
        </button>

        <button type="button" className="selected">
          <span>🛍</span>
          Shop
        </button>

        <button type="button">
          <span>₹</span>
          EMI Dues
        </button>

        <button type="button">
          <span>▣</span>
          Limit
        </button>

        <button type="button">
          <span>○</span>
          Profile
        </button>
      </nav>
    </div>
  );
}

/*
  Product Details Component
*/
function ProductDetails({
  product,
  selectedVariant,
  setSelectedVariant,
  selectedEmi,
  setSelectedEmi,
  closeProduct,
  proceedWithEmi,
  showSuccess,
}) {
  /*
    Calculate the current variant price.
  */
  const currentPrice = getVariantPrice(
    product,
    selectedVariant
  );

  /*
    Calculate EMI plans for current variant.
  */
  const currentEmiPlans = getEmiPlans(
    product,
    selectedVariant
  );

  /*
    Change storage/variant.
    EMI automatically updates for the new price.
  */
  function handleVariantChange(variant) {
    setSelectedVariant(variant);

    const updatedPlans = getEmiPlans(product, variant);

    /*
      Keep the same duration if possible.
      Otherwise fall back to 12 months.
    */
    const currentMonths = selectedEmi?.months || 12;

    const updatedEmi =
      updatedPlans.find(
        (plan) => plan.months === currentMonths
      ) || updatedPlans[1];

    setSelectedEmi(updatedEmi);
  }

  return (
    <section className="details-page">
      {/* BACK */}
      <button
        type="button"
        className="back-button"
        onClick={closeProduct}
      >
        ← Back to Marketplace
      </button>

      <div className="details-layout">
        {/* PRODUCT IMAGE */}
        <div className="details-image-card">
          <img
            src={product.image}
            alt={product.name}
          />

          <div className="image-pill">
            0% EMI available
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="details-content">
          <span className="eyebrow">
            {product.brand}
          </span>

          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description}
          </p>

          {/* DYNAMIC PRICE */}
          <div className="details-price">
            <span>Product price</span>

            <strong>
              {formatPrice(currentPrice)}
            </strong>
          </div>

          <div className="divider" />

          {/* VARIANTS */}
          <div className="option-section">
            <div className="option-heading">
              <strong>Choose variant</strong>

              <span>{selectedVariant}</span>
            </div>

            <div className="variant-grid">
              {product.variants.map((variant) => {
                const variantPrice = getVariantPrice(
                  product,
                  variant
                );

                return (
                  <button
                    type="button"
                    key={variant}
                    className={
                      selectedVariant === variant
                        ? "variant selected"
                        : "variant"
                    }
                    onClick={() =>
                      handleVariantChange(variant)
                    }
                  >
                    {variant}

                    {selectedVariant === variant && (
                      <span>✓</span>
                    )}

                    <small>
                      {formatPrice(variantPrice)}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EMI */}
          <div className="option-section">
            <div className="option-heading">
              <strong>Choose EMI plan</strong>

              <span>0% interest</span>
            </div>

            <div className="emi-grid">
              {currentEmiPlans.map((plan) => (
                <button
                  type="button"
                  key={plan.months}
                  className={
                    selectedEmi?.months === plan.months
                      ? "emi-option selected"
                      : "emi-option"
                  }
                  onClick={() => setSelectedEmi(plan)}
                >
                  <div>
                    <strong>
                      {plan.months} months
                    </strong>

                    <span>0% interest</span>
                  </div>

                  <div className="emi-amount">
                    {formatPrice(plan.amount)}

                    <small>/month</small>
                  </div>

                  {selectedEmi?.months === plan.months && (
                    <span className="check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="summary">
            <div>
              <span>Selected plan</span>

              <strong>
                {selectedEmi?.months} months ×{" "}
                {formatPrice(
                  selectedEmi?.amount || 0
                )}
              </strong>
            </div>

            <div>
              <span>Product price</span>

              <strong>
                {formatPrice(currentPrice)}
              </strong>
            </div>

            <div>
              <span>Interest</span>

              <strong>₹0</strong>
            </div>
          </div>

          {/* SUCCESS */}
          {showSuccess && (
            <div className="success-message">
              <span>✓</span>

              <span>
                EMI plan selected successfully. You can
                proceed with this plan.
              </span>
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            className="proceed-button"
            disabled={!selectedEmi}
            onClick={proceedWithEmi}
          >
            Proceed with EMI

            <span>→</span>
          </button>

          <p className="secure-note">
            🔒 Secure checkout • Flexible EMI • No-cost EMI
          </p>
        </div>
      </div>
    </section>
  );
}

export default App; 