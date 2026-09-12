import { useState } from "react";
import { createInspection } from "../services/api";

function NewInspection({
  user,
  onCreated,
  onBack,
}) {
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.productName.trim() ||
      !form.category.trim()
    ) {
      setError(
        "Product name and category are required."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await createInspection({
          inspectorId: user.id,
          ...form,
        });

      onCreated(data.inspection);
    } catch (err) {
      setError(
        err.message ||
          "Could not create inspection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inspection-page">

      <header className="inspection-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <span className="dashboard-kicker">
            INSPECTION CONSOLE / NEW
          </span>

          <h1>
            Start a new inspection.
          </h1>

          <p>
            Create the inspection record before
            capturing package evidence.
          </p>
        </div>

        <div className="inspection-user">
          <strong>
            {user?.name}
          </strong>

          <span>
            {user?.inspectorId}
          </span>
        </div>

      </header>


      <main className="inspection-layout">

        <section className="inspection-form-card">

          <div className="form-card-heading">
            <span>
              01 / PRODUCT INFORMATION
            </span>

            <h2>
              Tell us what you're inspecting.
            </h2>

            <p>
              Enter only the information available
              at the start of the inspection. AI
              extraction will happen later during
              package analysis.
            </p>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="field-group">

              <label>
                Product / Commodity Name
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Packaged Food Product"
                value={form.productName}
                onChange={(e) =>
                  updateField(
                    "productName",
                    e.target.value
                  )
                }
              />

            </div>


            <div className="two-column">

              <div className="field-group">

                <label>
                  Brand
                </label>

                <input
                  type="text"
                  placeholder="Brand name"
                  value={form.brand}
                  onChange={(e) =>
                    updateField(
                      "brand",
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="field-group">

                <label>
                  Category
                  <span>*</span>
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField(
                      "category",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Food">
                    Food / Grocery
                  </option>

                  <option value="Personal Care">
                    Personal Care
                  </option>

                  <option value="Household">
                    Household
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Textiles">
                    Textiles
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

            </div>


            <div className="field-group">

              <label>
                Manufacturer / Packer
              </label>

              <input
                type="text"
                placeholder="Company / manufacturer name"
                value={form.manufacturer}
                onChange={(e) =>
                  updateField(
                    "manufacturer",
                    e.target.value
                  )
                }
              />

            </div>


            <div className="field-group">

              <label>
                Batch / Lot Number
              </label>

              <input
                type="text"
                placeholder="Optional"
                value={form.batchNumber}
                onChange={(e) =>
                  updateField(
                    "batchNumber",
                    e.target.value
                  )
                }
              />

            </div>


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <button
              className="primary-button inspection-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating inspection..."
                : "Create Inspection →"}
            </button>

          </form>

        </section>


        <aside className="inspection-side">

          <div className="inspection-id-preview">

            <span>
              INSPECTION RECORD
            </span>

            <div className="id-placeholder">
              ML-YYYYMMDD-XXXX
            </div>

            <p>
              A unique inspection ID will be
              generated when you create this record.
            </p>

          </div>


          <div className="capture-preview">

            <span>
              NEXT STEP
            </span>

            <h3>
              Package evidence capture
            </h3>

            <p>
              After creating the inspection,
              you'll capture the package from
              multiple sides.
            </p>

            <div className="side-grid">

              <div>
                <strong>01</strong>
                <span>FRONT</span>
              </div>

              <div>
                <strong>02</strong>
                <span>BACK</span>
              </div>

              <div>
                <strong>03</strong>
                <span>LEFT</span>
              </div>

              <div>
                <strong>04</strong>
                <span>RIGHT</span>
              </div>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default NewInspection;