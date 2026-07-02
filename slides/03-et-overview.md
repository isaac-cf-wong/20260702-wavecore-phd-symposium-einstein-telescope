## The source zoo

<div class="viz-frame hero-viz" data-viz="source-zoo"></div>

<div class="notice-row">
  <span>Chirps</span>
  <span>Persistent tones</span>
  <span>Backgrounds</span>
  <span>Unmodelled bursts</span>
</div>

Notes: Start: Once you take a third-generation detector seriously, the source
population gets much richer.

- Chirps: compact binary inspirals and mergers.
- Persistent tones: continuous waves from rotating neutron stars.
- Backgrounds: incoherent superpositions or relic radiation.
- Unmodelled bursts: transients without clean templates.
- Different morphologies require different detection strategies.

End: That diversity is one reason the ET data-analysis problem is so rich.

---

## The Einstein Telescope concept

<div class="hero-figure">
  <img src="images/et/et-concept-render.jpg" alt="Artist impression of the Einstein Telescope: the triangular underground detector, with its corner stations and long arm tunnels, cut away beneath the surface landscape" />
  <span class="img-credit">Artist impression &copy; Marco Kraan / Nikhef</span>
</div>

<div class="notice-row">
  <span>Underground</span>
  <span>Low-frequency reach</span>
  <span>Long-baseline precision</span>
  <span>More Universe in view</span>
</div>

Notes: Start: So what is ET physically?

- Current design direction favors going underground to reduce seismic and
  Newtonian noise.
- Low-frequency reach is the main scientific and technical goal.
- Long-baseline interferometry puts more of the Universe in view.
- Be careful: exact layout is still under discussion.

End: The consistent thread is underground, low-frequency, long-baseline
precision.

---

## Current project landscape

<div class="figure-claim">
  <div class="viz-frame map-panel" data-viz="site-map"></div>
  <div>
    <p class="takeaway">Not only <em>where</em> to build &mdash; also the measurement system every future analysis inherits.</p>
    <ul>
      <li><strong>Site geology</strong> sets the seismic and Newtonian-noise floor.</li>
      <li><strong>Geometry</strong> &mdash; one triangle or two L-shapes &mdash; shapes localization and null streams.</li>
      <li>Site and detector design are <strong>coupled decisions</strong>.</li>
    </ul>
  </div>
</div>

<p class="source-line">Candidate sites and status framing from official ET public material, checked June 2026. Markers placed by coordinates (d3-geo); base map from Natural Earth (public domain).</p>

Notes: Start: Here is the honest current state of play, checked as of June 2026.

- The project is choosing both a site and a future measurement system.
- Candidate locations include Sardinia and Euregio Meuse-Rhine; Lusatia has also
  been discussed.
- Site geology affects seismic and Newtonian noise.
- Geometry affects localization, polarization response, and null streams.

End: Site and detector design are coupled decisions, not separate footnotes.

---

## Why low frequency matters

<div class="viz-frame hero-viz compact-hero" data-viz="sensitivity-curve"></div>

<p class="takeaway">The next generation opens the low-frequency band &mdash; but that decade is exactly where seismic, Newtonian, and suspension-thermal noise fight hardest, and where signals become long, expensive data-analysis objects.</p>

Notes: Start: Why push so hard on low frequency?

- Point to the left side of the sensitivity curves.
- Current detectors effectively wall off near the low-frequency end.
- ET pushes toward a few hertz, which buys long inspirals and earlier warning.
- The same band is where seismic, Newtonian, and suspension-thermal noise fight
  hardest.
- Longer signals are also more expensive data-analysis objects.

End: The benefit and the cost live in the same decade of frequency.

---

## The geometry question

<div class="viz-frame geo" data-viz="geometry"></div>

<div class="two-col geometry-cols">
  <div>
    <ul>
      <li>Three nested <strong>10 km</strong> detectors, one site &rarr; full polarization.</li>
      <li><strong>Null stream</strong>: outputs cancel for any GW &rarr; built-in noise/glitch monitor.</li>
      <li>Redundant &mdash; still runs with one interferometer down.</li>
    </ul>
    <p class="ref">Design: Freise <em>et al.</em> (CQG <strong>26</strong>, 2009); Hild <em>et al.</em> (CQG <strong>28</strong>, 2011). Null stream &amp; redundancy: Narola <em>et al.</em>, Wong <em>et al.</em>, Negri <em>et al.</em> (arXiv:2411.15506, 2510.06327, 2606.19201).</p>
  </div>
  <div>
    <ul>
      <li>Longer <strong>15 km</strong> arms (vs 10 km) &rarr; greater strain sensitivity.</li>
      <li>Two separated sites &rarr; long baseline &rarr; sharper localization.</li>
      <li><strong>~2&ndash;3&times; more detections</strong> across most science cases.</li>
    </ul>
    <p class="ref">Comparison study: Branchesi <em>et al.</em>, JCAP <strong>07</strong> (2023) 068 <span class="muted">(arXiv:2303.15923)</span></p>
  </div>
</div>

Notes: Start: I'll spend a moment here because geometry sits close to my own
work.

- Triangle: three nested 10 km interferometers on one site.
- Two-L option: two separated 15 km L-shaped detectors, oriented apart.
- Two-L tends to improve event counts and localization.
- Triangle gives a built-in null stream for noise and glitch monitoring.
- Connect briefly to recent null-stream, duty-cycle, and calibration work.

End: This is a genuine open trade-off where instrument design and signal
processing are inseparable.
