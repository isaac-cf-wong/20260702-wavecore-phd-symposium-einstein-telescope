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

Notes: Start: Let's turn to open challenges, starting with the strongest direct
bridge to WaveCoRE.

- ET must characterize seismic, acoustic, magnetic, and atmospheric coupling.
- It must predict site-specific environmental noise.
- It must subtract or veto without throwing away real astrophysical signals.
- Map this to array processing, spatial statistics, adaptive filtering, and
  sensor-network design.

End: This is environmental sensing at a precision most sensor networks never
have to reach.

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

Notes: Start: Network searches rely heavily on coherence across detectors.

- Real signals should appear consistently across sites.
- Shared environmental or infrastructure noise can mimic weak correlations.
- Stochastic-background searches are especially vulnerable.
- Research questions: identify weak long-baseline correlations, separate
  astrophysical from terrestrial structure, propagate uncertainty honestly.

End: This connects waves, electromagnetic environment, magnetometer networks,
and statistical signal processing.

---

## Open challenge 3: overlap and confusion

<div class="viz-frame hero-viz" data-viz="overlap"></div>

<div class="notice-row">
  <span>Many sources</span>
  <span>Overlapping tracks</span>
  <span>Structured foreground</span>
  <span>Joint inference</span>
</div>

Notes: Start: At third-generation rates, sources begin to overlap in time and
frequency.

- Many simultaneous sources can occupy the same data.
- Time-frequency tracks overlap and create a structured foreground.
- One-at-a-time analysis becomes less adequate.
- Joint inference across events becomes important.
- Use the crowded-radio-sky analogy carefully; it is helpful but not exact.

End: The background is no longer cleanly empty between events.

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

Notes: Start: Longer signals, larger template spaces, and more detections all
push toward acceleration.

- Need faster pipelines, cheaper inference, rapid alerts, and repeated
  re-analyses.
- Acceleration must preserve detection efficiency.
- It must preserve false-alarm and posterior calibration.
- It must remain traceable to physical models.
- Mention accelerators, differentiable programming, compression, and neural
  surrogates.

End: Speed is useful only if the scientific guarantees survive.

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

Notes: Start: The instrument is active, not passive.

- Feedback control keeps the interferometer near its sensitive state.
- Control choices shape noise spectra and transient artifacts.
- Diagnostics and astrophysical inference share the same data stream.
- Opportunity: closed-loop monitoring, state-aware conditioning, joint detector
  and signal models.
- Keep this forward-looking; do not overstate current readiness.

End: Control and inference should not be treated as unrelated pipelines forever.

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

Notes: Start: I want to close the challenge section on the deepest issue:
uncertainty.

- Inside the collaboration: data quality, calibration envelopes, pipeline
  review, reproducible alerts and publications.
- Outside the collaboration: public alerts, fundamental-physics claims,
  population statements, outside scrutiny.
- Raw sensitivity alone is not enough.
- Overconfident claims would damage the science.

End: ET's credibility will depend as much on calibrated uncertainty as on raw
sensitivity.
