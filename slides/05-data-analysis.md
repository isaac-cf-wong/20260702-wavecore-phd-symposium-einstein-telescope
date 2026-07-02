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

<p class="math-block">$$ \underbrace{p(\vec\theta \mid d)}_{\text{posterior}} \;=\; \frac{\overbrace{p(d \mid \vec\theta)}^{\text{likelihood}}\;\; \overbrace{p(\vec\theta)}^{\text{prior}}}{\underbrace{p(d)}_{\text{evidence}}} $$</p>

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
produced it — and at heart it is just Bayes' theorem.

- Read the formula on the slide: posterior = likelihood x prior / evidence.
- One line to write down; everything hard is inside evaluating and exploring it.
- Bayesian inverse problem: masses, spins, distance, sky location, inclination,
  tidal effects.
- Also model comparison and population hyperparameters.
- Hard because posteriors are high-dimensional and often multimodal.
- Waveform models are expensive; selection, calibration, and noise uncertainty
  matter.
- Tools: MCMC, nested sampling, reduced-order/surrogate models, and
  simulation-based inference.

End: The equation is one line; exploring it is the hard part — let me show you
what sampling that posterior actually looks like.

---

<!-- .slide: data-background-iframe="https://mcmc-visualization.vercel.app" data-background-interactive data-background-color="#0a0a0a" -->

Notes: Start: Here is what that sampling actually looks like.

- This is a live MCMC sampler exploring a target distribution.
- Each step proposes a move; the chain accepts or rejects and slowly traces out
  the posterior.
- The histogram of visited states converges to the distribution we want.
- This is the engine behind masses, spins, distance, and sky location.
- The page is embedded and interactive: I can perturb it live.

End: That random walk is how we turn a likelihood and a prior into a posterior
we can actually report.

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

<div class="two-col ai-efforts">
  <div>
    <h3>What the field already does</h3>
    <ul>
      <li><strong>Glitch mitigation &amp; noise regression</strong> &mdash; classification and witness-channel subtraction.</li>
      <li><strong>Amortized inference (SBI)</strong> &mdash; learn the posterior <em>once</em>, then sample any event in seconds.</li>
      <li><strong>ML-assisted inference (non-amortized)</strong> &mdash; flow-boosted MCMC and surrogates, <em>per event</em>.</li>
      <li><strong>ML detection &amp; search</strong> &mdash; deep networks as fast triggers beside matched filtering.</li>
    </ul>
  </div>
  <div>
    <h3>Where rigor is non-negotiable</h3>
    <ul>
      <li>Calibrated uncertainty, not only point accuracy.</li>
      <li>Out-of-distribution detector states.</li>
      <li>Bias under population shift.</li>
      <li>Auditable decisions for public alerts.</li>
    </ul>
  </div>
</div>

<p class="ml-refs"><strong>Glitch mitigation:</strong> Zevin <em>et al.</em> (Gravity Spy), CQG <strong>34</strong>, 064003 (2017); Ormiston <em>et al.</em> (DeepClean), Phys. Rev. Research <strong>2</strong>, 033066 (2020). &nbsp; <strong>Amortized SBI:</strong> Dax <em>et al.</em> (DINGO), PRL <strong>127</strong>, 241103 (2021); Dax <em>et al.</em> (DINGO-BNS), Nature <strong>639</strong>, 49 (2025). &nbsp; <strong>ML-assisted:</strong> Wong, Isi &amp; Edwards (Jim), ApJ <strong>958</strong>, 129 (2023); Field <em>et al.</em> (surrogates), PRX <strong>4</strong>, 031006 (2014). &nbsp; <strong>ML search:</strong> George &amp; Huerta, PLB <strong>778</strong>, 64 (2018); Sch&auml;fer <em>et al.</em> (MLGWSC-1), PRD <strong>107</strong>, 023021 (2023).</p>

<p class="takeaway ai-take">Not "AI or physics?" &mdash; but "where can learned models be constrained, validated, and monitored?"</p>

Notes: Start: I want to be balanced, and concrete about what the field already
does rather than hand-wave about "AI" — four categories.

- Glitch mitigation & noise regression: ML glitch classification (Gravity Spy,
  Zevin et al.) and witness-channel noise subtraction (DeepClean, Ormiston et al.).
- Amortized inference (SBI): train a network once to approximate the posterior,
  then infer any event in seconds — DINGO (Dax et al.); DINGO-BNS does real-time
  binary-neutron-star inference with pre-merger localization.
- ML-assisted inference (non-amortized): ML only speeds up per-event classical
  Bayesian analysis — flow-boosted MCMC (Jim; Wong, Isi & Edwards) and
  surrogate/reduced-order waveforms (Field et al.); exact likelihood is kept.
- ML detection & search: deep networks as fast triggers alongside matched
  filtering (George & Huerta; Gabbard et al.), benchmarked in MLGWSC-1.
- Stress the trade-off: amortized buys speed but inherits its training
  distribution; non-amortized keeps the exact physics but runs per event.
- Where rigor is non-negotiable: calibrated uncertainty (not point accuracy),
  out-of-distribution detector states, bias under population shift, auditable
  public alerts.

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
