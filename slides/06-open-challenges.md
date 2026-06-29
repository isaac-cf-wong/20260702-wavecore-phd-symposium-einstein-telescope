## Open challenge 1: environmental fields

<div class="two-col">
  <div>
    <h3>The ET need</h3>
    <ul>
      <li>Characterize seismic, acoustic, magnetic, and atmospheric coupling.</li>
      <li>Predict site-specific environmental noise.</li>
      <li>Subtract or veto without sacrificing real signals.</li>
    </ul>
  </div>
  <div>
    <h3>Community connection</h3>
    <ul>
      <li>Array processing.</li>
      <li>Spatial statistics.</li>
      <li>Adaptive filtering.</li>
      <li>Sensor-network design.</li>
    </ul>
  </div>
</div>

Notes: This is probably the strongest direct WaveCoRE bridge.

---

## Open challenge 2: correlated noise

<div class="two-col">
  <div>
    <h3>Why correlation matters</h3>
    <ul>
      <li>Network searches rely on coherence across detectors.</li>
      <li>Shared environmental or infrastructure noise can mimic weak correlations.</li>
      <li>Stochastic-background searches are especially sensitive to correlated artifacts.</li>
    </ul>
  </div>
  <div>
    <h3>Research questions</h3>
    <ul>
      <li>How do we identify weak correlations over long baselines?</li>
      <li>How do we separate astrophysical and terrestrial correlation structures?</li>
      <li>How should uncertainty propagate into detection claims?</li>
    </ul>
  </div>
</div>

Notes: This connects waves, EM environment, magnetometer networks, and
statistical signal processing.

---

## Open challenge 3: overlap and confusion

<div class="viz-frame hero-viz" data-viz="overlap"></div>

<div class="notice-row">
  <span>Many sources</span>
  <span>Overlapping tracks</span>
  <span>Structured foreground</span>
  <span>Joint inference</span>
</div>

Notes: Use analogy to crowded radio sky carefully; it is helpful but not exact.

---

## Open challenge 4: trustworthy acceleration

<div class="two-col">
  <div>
    <h3>Why acceleration is needed</h3>
    <ul>
      <li>Longer signals and larger template spaces.</li>
      <li>More detections and more parameter-estimation jobs.</li>
      <li>Need for rapid alerts and repeated re-analyses.</li>
    </ul>
  </div>
  <div>
    <h3>What must be preserved</h3>
    <ul>
      <li>Detection efficiency.</li>
      <li>False-alarm calibration.</li>
      <li>Posterior calibration.</li>
      <li>Traceability to physical models.</li>
    </ul>
  </div>
</div>

Notes: This is where accelerators, differentiable programming, compression, and
neural surrogates fit.

---

## Open challenge 5: control and inference together

<div class="two-col">
  <div>
    <h3>The instrument is active</h3>
    <ul>
      <li>Feedback systems keep the interferometer operating near its sensitive state.</li>
      <li>Control choices shape the noise spectrum and transient artifacts.</li>
      <li>Diagnostics and astrophysical inference are coupled through the same data.</li>
    </ul>
  </div>
  <div>
    <h3>Opportunity</h3>
    <ul>
      <li>Closed-loop monitoring with uncertainty.</li>
      <li>State-aware data conditioning.</li>
      <li>Joint models of detector state and astrophysical signal.</li>
    </ul>
  </div>
</div>

Notes: This is a forward-looking slide. No need to overstate current readiness.

---

## Open challenge 6: communication of uncertainty

<div class="two-col">
  <div>
    <h3>Inside the collaboration</h3>
    <ul>
      <li>Data-quality decisions.</li>
      <li>Calibration envelopes.</li>
      <li>Pipeline validation and review.</li>
      <li>Reproducible alerts and publications.</li>
    </ul>
  </div>
  <div>
    <h3>Outside the collaboration</h3>
    <ul>
      <li>Public alerts to astronomers.</li>
      <li>Claims about fundamental physics.</li>
      <li>Population-level statements about the Universe.</li>
      <li>Robustness under scrutiny.</li>
    </ul>
  </div>
</div>

<p class="takeaway">ET's credibility will depend as much on calibrated uncertainty as on raw sensitivity.</p>

Notes: This lands the epistemic theme.
