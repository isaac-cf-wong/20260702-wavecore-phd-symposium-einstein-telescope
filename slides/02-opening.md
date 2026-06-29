## Gravitational waves change distance

<div class="viz-frame hero-viz" data-viz="gw-stretch"></div>

Notes: Start conceptually. Avoid field equations. The key mental model is
"distance changes" rather than "something shakes the detector."

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

Notes: Play enough of the simulation to establish the basic source picture: two
compact objects orbit, radiate gravitational waves, merge, and settle. Narrate
conceptually; do not introduce waveform modelling yet.

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

Notes: Use the video to establish the basic interferometer idea: split light
between two arms, let mirror motion change the optical phase, then read out the
interference. Keep this conceptual.

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
  </div>
</div>

<p class="source-line">Public data products: GWOSC / LIGO Open Science Center.</p>

Notes: Use the first detection as the concrete bridge from instrument to data:
two detectors saw the same short chirp, and the time-frequency view makes the
rising frequency visible. This is the real-data anchor before abstract signal
processing language.

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

Notes: This is a contract with the audience: broad overview first, then
technical opportunities.

---

## Roadmap

1. Gravitational waves, conceptually
2. The Einstein Telescope project
3. The instrument as an extreme sensing system
4. Data analysis: from strain to discoveries
5. Open challenges and research opportunities
6. Discussion

Notes: Target timing: GW concept intro 8 min, ET overview 8 min, sensing/waves
10 min, data analysis 12 min, open challenges 9 min, close 3 min.

---

## What changes from current detectors to ET?

<div class="two-col">
  <div>
    <h3>Current generation</h3>
    <ul>
      <li>First direct detections established the field.</li>
      <li>Signals are rare enough that many analyses are event-centred.</li>
      <li>Detection, characterization, and follow-up are already sophisticated.</li>
    </ul>
  </div>
  <div>
    <h3>Third generation</h3>
    <ul>
      <li>Signals become more frequent, longer, and often overlapping.</li>
      <li>Low-frequency sensitivity moves minutes, hours, or days of early warning into reach.</li>
      <li>Backgrounds, calibration, computing, and real-time inference become central design problems.</li>
    </ul>
  </div>
</div>

Notes: This slide motivates why ET is a qualitative data-analysis transition,
not only a bigger detector.
