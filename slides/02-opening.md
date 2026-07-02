## Gravitational waves change distance

<div class="viz-frame hero-viz" data-viz="gw-stretch"></div>

Notes: Start: Let's start with the simplest possible mental model: forget field
equations for now.

- A gravitational wave stretches one direction and compresses the perpendicular
  direction, then reverses.
- The effect is tiny, far smaller than a proton-scale length change.
- Key reframing: not "something shakes the detector," but "distance itself
  changes."
- That means the instrument is a ruler, not a seismometer.

End: Once distance is the quantity changing, the next question is where such
waves come from.

---

## Where do the signals come from?

<div class="video-frame">
  <iframe
    src="https://www.youtube.com/embed/1DmCkeK_YU4?rel=0&modestbranding=1"
    title="Compact binary coalescence gravitational-wave simulation"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

<div class="notice-row">
  <span>Compact binary</span>
  <span>Inspiral</span>
  <span>Merger</span>
  <span>Ringdown</span>
</div>

Notes: Start: So where do waves like this come from?

- Play enough video to show two compact objects orbiting.
- Name the stages: compact binary, inspiral, merger, ringdown.
- Explain that energy leaves as gravitational waves, so the orbit speeds up and
  frequency rises.
- Keep this as the source picture; do not introduce waveform modelling yet.

End: That four-stage picture is the source model behind almost everything else
in this talk.

---

## How can we measure such a small effect?

<div class="video-frame">
  <iframe
    src="https://www.youtube.com/embed/UA1qG7Fjc2A?rel=0&modestbranding=1"
    title="Gravitational-wave interferometer explanation"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>

<div class="notice-row">
  <span>Laser</span>
  <span>Two arms</span>
  <span>Mirrors</span>
  <span>Interference</span>
</div>

Notes: Start: Now, how do you actually measure a length change that small?

- Interferometer idea: split a laser, send it down two perpendicular arms,
  bounce from mirrors, recombine.
- A gravitational wave changes the two arm lengths differently.
- The changed arm lengths shift the optical phase and therefore the interference
  pattern.
- Keep the precision scale: about one part in 10^21.

End: The idea is simple; the whole difficulty is making it work at that
precision.

---

## GW150914: the first gravitational-wave signal

<div class="gw150914-frame">
  <div class="gw-panel">
    <h3>Hanford strain data</h3>
    <img src="images/gw150914/observed-h1.png" alt="GW150914 observed Hanford strain data" />
  </div>
  <div class="gw-panel">
    <h3>Livingston strain data</h3>
    <img src="images/gw150914/observed-l1.png" alt="GW150914 observed Livingston strain data" />
  </div>
  <div class="gw-panel gw-spectrogram">
    <h3>Time-frequency data product</h3>
    <img src="images/gw150914/freqtime-h1.png" alt="GW150914 time-frequency chirp data product" />
  </div>
  <div class="gw-fact">
    <strong>14 September 2015</strong>
    <span>two LIGO detectors</span>
    <span>binary black-hole merger</span>
    <span>2017 Nobel Prize in Physics</span>
  </div>
</div>

<p class="source-line">Data: <a href="https://gwosc.org/events/GW150914/" target="_blank" rel="noopener noreferrer">GWOSC / LIGO Open Science Center</a>, GW150914 data release. B. P. Abbott <em>et al.</em>, &ldquo;Observation of Gravitational Waves from a Binary Black Hole Merger,&rdquo; <a href="https://doi.org/10.1103/PhysRevLett.116.061102" target="_blank" rel="noopener noreferrer">Phys. Rev. Lett. 116, 061102 (2016)</a>.</p>

Notes: Start: This is not a simulation; this is real data.

- Date: 14 September 2015.
- Hanford and Livingston saw the same short chirp within milliseconds.
- Point to the time-frequency panel: the rising track is the chirp.
- This was the first direct detection, from a binary black-hole merger.
- Mention the 2017 Nobel Prize briefly.

End: This event is the real-data anchor before we talk about signal processing
in the abstract.

---

## The talk in one sentence

<div class="two-col">
  <div>
    <h3>Einstein Telescope</h3>
    <ul>
      <li>A proposed European third-generation gravitational-wave observatory.</li>
      <li>Designed to see deeper, lower in frequency, and for much longer before merger.</li>
      <li>A scientific facility and a signal-processing challenge at continental scale.</li>
    </ul>
  </div>
  <div>
    <h3>Today's lens</h3>
    <ul>
      <li>What gravitational waves are.</li>
      <li>What ET is trying to change.</li>
      <li>Why open problems look familiar to this community.</li>
    </ul>
  </div>
</div>

<p class="takeaway">The same concepts behind wireless systems, waves, sensing, synchronization, filtering, detection, and inference reappear in ET under extreme physical constraints.</p>

Notes: Start: Let me be explicit about the contract for the rest of the hour.

- ET is a proposed European third-generation gravitational-wave observatory.
- It aims to see deeper, lower in frequency, and much earlier before merger.
- Today has three lenses: what GWs are, what ET changes, and why the open
  problems look familiar to WaveCoRE.
- Connect to waves, sensing, synchronization, filtering, detection, and
  inference.

End: The same signal-processing concepts reappear here under much more extreme
physical constraints.

---

## Roadmap

1. Gravitational waves, conceptually
2. The Einstein Telescope project
3. The instrument as an extreme sensing system
4. Data analysis: from strain to discoveries
5. Open challenges and research opportunities
6. Discussion

Notes: Start: Here's the plan for the talk.

- GW concept intro: about 8 minutes.
- ET project overview: about 8 minutes.
- Sensing, noise, calibration, and environmental coupling: about 10 minutes.
- Data analysis: about 12 minutes.
- Open challenges and research opportunities: about 9 minutes.
- Close and discussion: about 3 minutes plus Q&A.

End: With that roadmap in mind, let me show why ET is a qualitative transition.

---

## What changes from current detectors to ET?

<div class="viz-frame hero-viz compact-hero" data-viz="detector-generations"></div>

<p class="takeaway">A qualitative transition, not just a bigger detector: signals become <strong>longer, more frequent, and overlapping</strong> &mdash; so backgrounds, calibration, computing, and real-time inference become central design problems.</p>

Notes: Start: Before going further, let's be precise about what actually changes
in the third generation.

- Same 1.4+1.4 solar-mass binary neutron-star inspiral in both bands.
- Current detectors enter around 20 Hz: roughly 2.5 minutes before merger.
- ET reaches a few Hz: roughly 7 hours before merger, about 150 times longer.
- Longer signals enable early warning, but also more overlap, background,
  calibration, computing, and real-time inference problems.

End: This is why ET is a qualitative transition, not simply a bigger detector.
