import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./HourlyCalculator.css";

function HourlyCalculator() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [platformFee, setPlatformFee] = useState("10");
  const [taxRate, setTaxRate] = useState("0");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();

    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerDay);
    const days = parseFloat(daysPerWeek);
    const fee = parseFloat(platformFee) / 100;
    const tax = parseFloat(taxRate) / 100;

    const dailyGross = rate * hours;
    const weeklyGross = dailyGross * days;
    const monthlyGross = weeklyGross * 4.33;
    const yearlyGross = monthlyGross * 12;

    const feeAmount = monthlyGross * fee;
    const taxAmount = (monthlyGross - feeAmount) * tax;
    const monthlyNet = monthlyGross - feeAmount - taxAmount;
    const yearlyNet = monthlyNet * 12;

    setResult({
      dailyGross,
      weeklyGross,
      monthlyGross,
      yearlyGross,
      feeAmount,
      taxAmount,
      monthlyNet,
      yearlyNet,
    });
  };

  const reset = () => {
    setHourlyRate("");
    setHoursPerDay("");
    setDaysPerWeek("");
    setPlatformFee("10");
    setTaxRate("0");
    setResult(null);
  };

  const fmt = (num) =>
    "₹" + Math.round(num).toLocaleString("en-IN");

  return (
    <>
      <Navbar />

      <section className="calculator-page">

        <div className="calculator-header">
          <h1>Hourly Rate Calculator</h1>
          <p>Find out exactly how much you earn — after fees and taxes.</p>
        </div>

        <div className="calculator-layout">

          {/* Form */}
          <div className="calculator-form-card">
            <h2>Your Details</h2>
            <form onSubmit={calculate}>

              <label>Hourly Rate (₹)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                min="1"
                required
              />

              <label>Hours Per Day</label>
              <input
                type="number"
                placeholder="e.g. 6"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                min="1"
                max="24"
                required
              />

              <label>Days Per Week</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                min="1"
                max="7"
                required
              />

              <label>Platform Fee (%)</label>
              <div className="preset-buttons">
                {["5", "10", "15", "20"].map((v) => (
                  <button
                    type="button"
                    key={v}
                    className={platformFee === v ? "preset-active" : ""}
                    onClick={() => setPlatformFee(v)}
                  >
                    {v}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom %"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                min="0"
                max="100"
              />

              <label>Tax Rate (%)</label>
              <div className="preset-buttons">
                {["0", "5", "10", "18"].map((v) => (
                  <button
                    type="button"
                    key={v}
                    className={taxRate === v ? "preset-active" : ""}
                    onClick={() => setTaxRate(v)}
                  >
                    {v}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom %"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="100"
              />

              <button type="submit" className="calc-submit">
                Calculate Earnings
              </button>

              {result && (
                <button type="button" className="calc-reset" onClick={reset}>
                  Reset
                </button>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="calculator-results">
            {!result && (
              <div className="results-placeholder">
                <span>💡</span>
                <p>Fill in your details and click Calculate to see your projected earnings breakdown.</p>
              </div>
            )}

            {result && (
              <>
                <h2>Your Earnings Breakdown</h2>

                <div className="result-highlight">
                  <p>Monthly Take-Home</p>
                  <h2>{fmt(result.monthlyNet)}</h2>
                </div>

                <div className="result-grid">
                  <div className="result-card">
                    <p>Daily Gross</p>
                    <strong>{fmt(result.dailyGross)}</strong>
                  </div>
                  <div className="result-card">
                    <p>Weekly Gross</p>
                    <strong>{fmt(result.weeklyGross)}</strong>
                  </div>
                  <div className="result-card">
                    <p>Monthly Gross</p>
                    <strong>{fmt(result.monthlyGross)}</strong>
                  </div>
                  <div className="result-card">
                    <p>Yearly Gross</p>
                    <strong>{fmt(result.yearlyGross)}</strong>
                  </div>
                </div>

                <div className="deductions">
                  <h3>Deductions</h3>
                  <div className="deduction-row">
                    <span>Platform Fee ({platformFee}%)</span>
                    <span className="deduction-amount">− {fmt(result.feeAmount)}</span>
                  </div>
                  <div className="deduction-row">
                    <span>Tax ({taxRate}%)</span>
                    <span className="deduction-amount">− {fmt(result.taxAmount)}</span>
                  </div>
                  <div className="deduction-row total">
                    <span>Monthly Net</span>
                    <span>{fmt(result.monthlyNet)}</span>
                  </div>
                  <div className="deduction-row total">
                    <span>Yearly Net</span>
                    <span>{fmt(result.yearlyNet)}</span>
                  </div>
                </div>

                <p className="calc-note">
                  * Monthly estimate uses 4.33 weeks/month. Values are approximate.
                </p>
              </>
            )}
          </div>

        </div>

        {/* Tips */}
        <div className="calc-tips">
          <h2>Tips for setting your rate</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span>📊</span>
              <h3>Research the market</h3>
              <p>Check what other freelancers in your field and experience level charge on WorkHub.</p>
            </div>
            <div className="tip-card">
              <span>🎯</span>
              <h3>Factor in downtime</h3>
              <p>You won&apos;t always be fully booked. Assume 60–70% utilisation when setting rates.</p>
            </div>
            <div className="tip-card">
              <span>💼</span>
              <h3>Include all costs</h3>
              <p>Don&apos;t forget software subscriptions, equipment, and your own time for admin work.</p>
            </div>
            <div className="tip-card">
              <span>📈</span>
              <h3>Review regularly</h3>
              <p>Raise your rates as you gain experience, skills, and positive reviews.</p>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}

export default HourlyCalculator;
