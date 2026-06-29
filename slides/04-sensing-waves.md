## A detector as a transducer

<div class="viz-frame hero-viz" data-viz="transducer"></div>

<div class="notice-row">
  <span>Physical wave</span>
  <span>Optical readout</span>
  <span>Calibration</span>
  <span>Auxiliary context</span>
</div>

Notes: Animation candidate: gravitational wave to mirrors to laser phase to
strain channel plus auxiliary channels.

---

## Noise is the central character

<div class="viz-frame hero-viz" data-viz="noise-budget"></div>

<div class="notice-row">
  <span>Seismic and Newtonian</span>
  <span>Thermal</span>
  <span>Quantum optical</span>
  <span>Glitches and lines</span>
</div>

Notes: This should feel familiar to signal-processing people: colored,
non-stationary, non-Gaussian noise with partial side information.

---

## Newtonian noise: waves outside the vacuum system

<div class="viz-frame hero-viz" data-viz="newtonian-noise"></div>

<div class="notice-row">
  <span>Environmental wave field</span>
  <span>Sensor array</span>
  <span>Model the coupling</span>
  <span>Subtract with uncertainty</span>
</div>

Notes: This is one of the strongest bridges to waves/wireless/sensor arrays.
Later animation: propagating Rayleigh waves sampled by an array; estimated field
predicts subtraction target.

---

## Calibration: knowing the ruler while it moves

<div class="two-col">
  <div>
    <h3>Why calibration matters</h3>
    <ul>
      <li>Astrophysical inference assumes the strain amplitude and phase are known.</li>
      <li>Small calibration errors bias distance, sky position, polarization, and tests of gravity.</li>
      <li>ET's long observations make slow drifts and correlated errors harder to ignore.</li>
    </ul>
  </div>
  <div>
    <h3>Open questions</h3>
    <ul>
      <li>How should calibration uncertainty be propagated in real time?</li>
      <li>Which redundant measurements can catch failures early?</li>
      <li>Can control and inference share uncertainty models?</li>
    </ul>
  </div>
</div>

Notes: Keep this concise. This is a bridge to system identification and
uncertainty propagation.

---

## Distributed sensing around the detector

<div class="two-col">
  <div>
    <h3>Auxiliary information</h3>
    <ul>
      <li>Seismometers, microphones, magnetometers, weather stations, control channels.</li>
      <li>Some channels are witnesses to noise, others are vetoes, and others are diagnostics.</li>
      <li>Many channels are weakly informative only in particular states of the detector.</li>
    </ul>
  </div>
  <div>
    <h3>Familiar research problems</h3>
    <ul>
      <li>Sensor placement and array design.</li>
      <li>Synchronization and timing integrity.</li>
      <li>Adaptive filtering under non-stationarity.</li>
      <li>Interpretable anomaly detection.</li>
    </ul>
  </div>
</div>

Notes: This slide speaks directly to WaveCoRE. Avoid claiming wireless inside
the detector; focus on shared concepts and possibly monitoring infrastructure.

---

## What makes ET harder than "just scale up"

<div class="three-col">
  <div>
    <h3>Duration</h3>
    <p>Signals last longer in band, so detector state changes during the signal.</p>
  </div>
  <div>
    <h3>Density</h3>
    <p>More sources means more overlap, more foregrounds, and more confusion.</p>
  </div>
  <div>
    <h3>Precision</h3>
    <p>Systematic errors that were subdominant become visible in population-scale science.</p>
  </div>
</div>

<p class="takeaway">Third-generation sensitivity converts yesterday's approximations into tomorrow's error budget.</p>

Notes: This is a transition to data analysis.
