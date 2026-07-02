## From strain to events

<div class="viz-frame hero-viz" data-viz="strain-events"></div>

<div class="notice-row">
  <span>Strain</span>
  <span>Conditioning</span>
  <span>Search</span>
  <span>Significance</span>
  <span>Inference</span>
</div>

Notes: Start: How do we go from a raw strain time series to a scientific
discovery?

- Conditioning cleans and prepares the strain data.
- Search compares data against expected waveform structure.
- Significance asks whether a candidate rises above noise background.
- Inference estimates physical parameters for surviving candidates.

End: Strain, conditioning, search, significance, inference is the skeleton for
the next part.

---

## Matched filtering: correlation at scale

<p class="large-claim">Slide a predicted waveform through the data &mdash; where does the correlation peak?</p>

<div class="viz-frame mf" data-viz="matched-filter"></div>

<div class="notice-row">
  <span>Template bank</span>
  <span>Noise-weighted correlation</span>
  <span>Triggers</span>
  <span>Coincidence across detectors</span>
</div>

Notes: Start: The workhorse of the search stage is matched filtering.

- Slide a predicted waveform through the data.
- Compute a noise-weighted correlation and look for peaks.
- Template banks cover plausible source parameters.
- Triggers need thresholds and coincidence across detectors.
- Emphasize scale: template count, data volume, and efficiency.

End: It is correlation detection, but at a scale that pushes hard against what
is tractable.

---

## False alarms are empirical

<p class="large-claim">A candidate matters only relative to how often noise alone would fake it &mdash; so the background is measured, by time-sliding the detectors.</p>

<div class="viz-frame ts" data-viz="time-slide"></div>

<div class="notice-row">
  <span>Real coincidences</span>
  <span>Time shifts</span>
  <span>Accidental background</span>
  <span>False-alarm rate</span>
</div>

Notes: Start: A candidate matters only relative to how often noise alone would
fake it.

- Detection statistic alone is not enough.
- Use empirical backgrounds, often from time shifts between detectors.
- Compare real coincidences against accidental coincidences.
- Report false-alarm rate.
- At ET rates, signal-free background estimation becomes difficult.

End: Even the background estimate becomes its own measurement problem.

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

Notes: Start: Once you trust a candidate is real, the next question is what
produced it.

- Bayesian inverse problem: masses, spins, distance, sky location, inclination,
  tidal effects.
- Also model comparison and population hyperparameters.
- Hard because posteriors are high-dimensional and often multimodal.
- Waveform models are expensive; selection, calibration, and noise uncertainty
  matter.
- Mention MCMC, nested sampling, reduced-order models, surrogates, and
  simulation-based inference.

End: Discovery is only the start; inference turns the event into physics.

---

## Real-time inference and multi-messenger astronomy

<div class="viz-frame hero-viz" data-viz="real-time"></div>

<div class="notice-row">
  <span>Streaming detection</span>
  <span>Early warning</span>
  <span>Sky localization</span>
  <span>Telescope follow-up</span>
</div>

Notes: Start: None of this is only an offline problem anymore.

- Long inspirals may be detected before merger.
- Sky maps can shrink as more signal accumulates.
- Multi-messenger astronomy needs streaming detection, localization, and alerts.
- Telescope follow-up runs under a real-time latency budget.
- ET's low-frequency reach can stretch warning times substantially.

End: Low-frequency sensitivity turns inference into a live operational problem.

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

Notes: Start: I want to be balanced because this question comes up in every talk
like this.

- Learning can help with glitch classification, data-quality triage, fast
  posteriors, surrogates, control, and anomaly detection.
- But public science needs calibrated uncertainty, not only point accuracy.
- Models must handle out-of-distribution detector states and population shift.
- Alerts must remain auditable.

End: The useful question is not AI or physics, but where learned models can be
constrained, validated, and monitored.

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

Notes: Start: There is an observatory behind the observatory: computing.

- Streaming pipelines must keep up continuously with detector output and data
  quality changes.
- Offline searches, parameter estimation, and population studies need large CPU
  and GPU resources.
- Mention accelerator, differentiable, or JAX/GPU work only if useful.
- Reproducibility needs provenance, versioned models, validated workflows, and
  archiving.

End: This infrastructure is not auxiliary; the science cannot exist without it.
