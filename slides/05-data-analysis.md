## From strain to events

<div class="viz-frame hero-viz" data-viz="strain-events"></div>

<div class="notice-row">
  <span>Strain</span>
  <span>Conditioning</span>
  <span>Search</span>
  <span>Significance</span>
  <span>Inference</span>
</div>

Notes: Animation candidate: raw strain -> spectrogram -> template match ->
candidate -> posterior.

---

## Matched filtering: correlation at scale

<p class="large-claim">Matched filtering slides a predicted waveform through the data and asks: where does the correlation peak?</p>

<div class="viz-frame" data-viz="matched-filter"></div>

<div class="notice-row">
  <span>Template bank</span>
  <span>Noise-weighted correlation</span>
  <span>Triggers</span>
  <span>Coincidence across detectors</span>
</div>

Notes: This can later reuse the JavaScript style from the earlier deck: template
sliding over strain, SNR time series, triggers, coincidence.

---

## False alarms are empirical

<p class="large-claim">A candidate matters only relative to how often noise alone would fake it. At ET rates, even the background estimate becomes a measurement problem.</p>

<div class="viz-frame" data-viz="false-alarm"></div>

<div class="notice-row">
  <span>Real coincidences</span>
  <span>Time shifts</span>
  <span>Accidental background</span>
  <span>False-alarm rate</span>
</div>

Notes: This is the natural place to connect to my own work, but still broad.

---

## Parameter estimation: the inverse problem

<div class="two-col">
  <div>
    <h3>What we infer</h3>
    <ul>
      <li>Masses, spins, distance, sky location, inclination, and tidal effects.</li>
      <li>Model comparisons for matter, black-hole physics, and gravity.</li>
      <li>Population hyperparameters across many events.</li>
    </ul>
  </div>
  <div>
    <h3>Why it is hard</h3>
    <ul>
      <li>High-dimensional, multimodal posteriors.</li>
      <li>Expensive waveform models.</li>
      <li>Selection effects and calibration/noise uncertainty.</li>
    </ul>
  </div>
</div>

Notes: Mention Bayesian inference, MCMC/nested sampling, reduced-order methods,
surrogates, and simulation-based inference verbally.

---

## Real-time inference and multi-messenger astronomy

<div class="viz-frame hero-viz" data-viz="real-time"></div>

<div class="notice-row">
  <span>Streaming detection</span>
  <span>Early warning</span>
  <span>Sky localization</span>
  <span>Telescope follow-up</span>
</div>

Notes: Animation candidate: inspiral early warning clock, probability sky map
shrinking as the signal accumulates.

---

## AI can help, but cannot replace physics

<div class="two-col">
  <div>
    <h3>Where learning is promising</h3>
    <ul>
      <li>Glitch classification and data-quality triage.</li>
      <li>Fast posterior approximations and amortized inference.</li>
      <li>Surrogate waveform models and simulation acceleration.</li>
      <li>Control, monitoring, and anomaly detection.</li>
    </ul>
  </div>
  <div>
    <h3>Where rigor is essential</h3>
    <ul>
      <li>Calibrated uncertainty, not only point accuracy.</li>
      <li>Out-of-distribution detector states.</li>
      <li>Bias under population shift.</li>
      <li>Auditable decisions for public alerts.</li>
    </ul>
  </div>
</div>

<p class="takeaway">The useful question is not "AI or physics?" but "where can learned models be constrained, validated, and monitored?"</p>

Notes: This should resonate with data-analysis and ML people while staying
scientifically conservative.

---

## Computing: the hidden observatory

<div class="three-col">
  <div>
    <h3>Streaming</h3>
    <p>Low-latency pipelines must keep up with continuous detector output and changing data quality.</p>
  </div>
  <div>
    <h3>Offline</h3>
    <p>Searches, parameter estimation, and population analyses consume large-scale CPU/GPU resources.</p>
  </div>
  <div>
    <h3>Reproducibility</h3>
    <p>Scientific claims need provenance, versioned models, validated workflows, and long-term archiving.</p>
  </div>
</div>

Notes: This is a good place to mention JAX/GPU work if desired, but keep it
high-level in the first-pass structure.
