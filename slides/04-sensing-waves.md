## A detector as a transducer

<div class="viz-frame hero-viz" data-viz="transducer"></div>

<div class="notice-row">
  <span>Physical wave</span>
  <span>Optical readout</span>
  <span>Calibration</span>
  <span>Auxiliary context</span>
</div>

Notes: Start: Let's zoom into the instrument and strip away the astrophysics for
a moment.

- Treat the detector as a transducer.
- Main chain: space-time strain, test-mass motion, optical phase, calibrated
  strain data.
- Auxiliary channels: seismometers, microphones, magnetometers, laser and optics
  monitors.
- Auxiliary sensors do not measure the gravitational wave; they describe the
  detector and environment.

End: The main strain channel plus context is what lets us tell signals from
glitches.

---

## Noise is the central character

<div class="viz-frame hero-viz" data-viz="noise-budget"></div>

<div class="notice-row">
  <span>Seismic and Newtonian</span>
  <span>Thermal</span>
  <span>Quantum optical</span>
  <span>Glitches and lines</span>
</div>

Notes: Start: If there is one slide for a signal-processing audience to sit
with, it is this one.

- Noise is colored: not flat across frequency.
- Noise is non-stationary: statistics drift over time.
- Noise is non-Gaussian: heavy tails, glitches, transient artifacts.
- Side information is partial and state-dependent.
- Different noise sources need different mitigation strategies.

End: These are not textbook noise models, and that is why the problem is so
interesting.

---

## Newtonian noise: waves outside the vacuum system

<div class="viz-frame hero-viz compact-hero" data-viz="newtonian-noise"></div>

<div class="notice-row">
  <span>Environmental wave field</span>
  <span>Sensor array</span>
  <span>Model the coupling</span>
  <span>Subtract with uncertainty</span>
</div>

Notes: Start: This is one of the strongest bridges to waves, wireless, and
sensor arrays.

- Newtonian noise comes from environmental wave fields: ground motion and
  acoustic density fluctuations.
- It couples gravitationally to the mirrors, straight through the vacuum
  chamber.
- You cannot shield against gravity, so the handle is measurement and modelling.
- Use sensor arrays to reconstruct the field, model coupling, and subtract with
  uncertainty.

End: This is array processing and spatial statistics, applied to gravity.

---

## Calibration: knowing the ruler while it moves

<div class="viz-frame cal" data-viz="calibration-band"></div>

<div class="two-col">
  <div>
    <h3>Why calibration matters</h3>
    <ul>
      <li>Inference assumes the strain amplitude and phase are known.</li>
      <li>Errors bias distance, sky position, polarization, and tests of gravity.</li>
      <li>ET's long observations make slow drifts harder to ignore.</li>
    </ul>
  </div>
  <div>
    <h3>Open questions</h3>
    <ul>
      <li>Propagating calibration uncertainty in real time?</li>
      <li>Which redundant measurements catch failures early?</li>
      <li>Can control and inference share uncertainty models?</li>
    </ul>
  </div>
</div>

<p class="source-line">Data: <a href="https://zenodo.org/records/8177023" target="_blank" rel="noopener noreferrer">LVK GWTC-3 release (GW200322, O3b)</a>. Method: <a href="https://arxiv.org/abs/1608.05055" target="_blank" rel="noopener noreferrer">Karki <em>et al.</em>, RSI <strong>87</strong>, 114503 (2016)</a>. Uncertainty: <a href="https://arxiv.org/abs/1708.03023" target="_blank" rel="noopener noreferrer">Cahillane <em>et al.</em>, PRD <strong>96</strong>, 102001 (2017)</a>; <a href="https://doi.org/10.1088/1361-6382/abb14e" target="_blank" rel="noopener noreferrer">Sun <em>et al.</em>, CQG <strong>37</strong>, 225008 (2020)</a>. Inference: <a href="https://arxiv.org/abs/2009.10193" target="_blank" rel="noopener noreferrer">Payne <em>et al.</em>, PRD <strong>102</strong>, 122004 (2020)</a>.</p>

Notes: Start: Calibration sounds like a footnote until you realize how much
rests on it.

- The recovered strain has frequency-dependent amplitude and phase uncertainty.
- Astrophysical inference assumes those amplitude and phase calibrations are
  known.
- Small calibration errors bias physics, especially distance.
- ET's longer observations make slow drifts and correlated errors harder to
  ignore.
- Open questions: real-time propagation, redundant checks, shared uncertainty
  models between control and inference.

End: Knowing the ruler while it moves is a system-identification problem, not a
detail.

---

## Distributed sensing around the detector

<div class="viz-frame sensors" data-viz="sensor-network"></div>

<div class="two-col">
  <div>
    <h3>Auxiliary information</h3>
    <ul>
      <li>Seismometers, microphones, magnetometers, weather, control channels.</li>
      <li>Some are witnesses to noise, some vetoes, some diagnostics.</li>
      <li>Many are informative only in particular detector states.</li>
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

<p class="source-line">Environmental monitoring: <a href="https://arxiv.org/abs/1409.5160" target="_blank" rel="noopener noreferrer">Effler <em>et al.</em>, CQG <strong>32</strong>, 035017 (2015)</a>. Data quality &amp; vetoes: <a href="https://arxiv.org/abs/1602.03844" target="_blank" rel="noopener noreferrer">Abbott <em>et al.</em>, CQG <strong>33</strong>, 134001 (2016)</a>; <a href="https://arxiv.org/abs/2101.11673" target="_blank" rel="noopener noreferrer">Davis <em>et al.</em>, CQG <strong>38</strong>, 135014 (2021)</a>. Glitch classification: <a href="https://arxiv.org/abs/1611.04596" target="_blank" rel="noopener noreferrer">Zevin <em>et al.</em>, CQG <strong>34</strong>, 064003 (2017)</a>.</p>

Notes: Start: Around every detector site sits a network of auxiliary sensing.

- Sensors include seismometers, microphones, magnetometers, weather stations,
  and control-system channels.
- Some witness noise, some veto bad data, some provide diagnostics.
- Many channels are informative only in particular detector states.
- Avoid overclaiming wireless inside the detector.
- Shared problems: placement, synchronization, adaptive filtering, interpretable
  anomaly detection.

End: The vocabulary is different, but the research problems should look
familiar.

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

Notes: Start: So why can't we just scale up the current detector design?

- Duration: signals last long enough that detector state changes during one
  signal.
- Density: more sources means more overlap and confusion.
- Precision: formerly small systematics become visible in population science.

End: Third-generation sensitivity converts yesterday's approximations into
tomorrow's error budget.
