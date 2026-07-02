#!/usr/bin/env python3
"""Generate simulated time-frequency spectrograms for slide 9 ("The source zoo").

Each of the four gravitational-wave source classes is simulated with pycbc and
turned into a real Q-transform spectrogram:

* compact binary  -> pycbc ``get_td_waveform`` inspiral-merger-ringdown chirp
* continuous wave -> a long fixed-frequency sinusoid
* burst           -> a sine-Gaussian transient
* stochastic      -> a broadband Gaussian-noise realization

All signals are made deliberately "loud" (high amplitude relative to the noise
floor) so every morphology is clearly visible -- the amplitudes are not
realistic, but the time-frequency shapes are genuine. Each spectrogram is
resampled to a small grid, per-panel normalized to 0..1, quantized to bytes, and
written to ``js/source-zoo-data.js`` as ``window.SOURCE_ZOO_DATA`` (same delivery
pattern as ``js/gw-chirp-data.js``).
"""

from __future__ import annotations

import json
import warnings
from pathlib import Path

import numpy as np

warnings.filterwarnings("ignore", category=SyntaxWarning)

import pycbc  # noqa: E402
from pycbc.types import TimeSeries  # noqa: E402
from pycbc.waveform import get_td_waveform  # noqa: E402

SR = 2048
DT = 1.0 / SR
SEG = 2.0  # seconds
N = int(SEG * SR)
FRANGE = (20.0, 500.0)
NT, NF = 120, 56  # output grid (time bins, frequency bins)

rng = np.random.default_rng(20260702)


def spectrogram(ts: TimeSeries, mode: str, nperseg: int = 256, step: int = 32) -> np.ndarray:
    """Plain STFT power spectrogram -> normalized (NF, NT) byte grid, low freq first.

    A Q-transform whitens each frequency row, which turns a loud continuous wave
    into a featureless row; a straight (un-whitened) short-time Fourier transform
    gives the classic ``specgram`` view where each morphology is obvious.
    """
    # Normalize amplitude so the (tiny) physical strain scale of the chirp and
    # the order-unity toy signals are treated on the same footing.
    x = np.asarray(ts)
    x = x / (np.max(np.abs(x)) + 1e-30)
    win = np.hanning(nperseg)
    starts = range(0, len(x) - nperseg + 1, step)
    stft = np.array([np.fft.rfft(x[s : s + nperseg] * win) for s in starts])
    power = (np.abs(stft) ** 2).T  # (freq, time)
    freqs = np.fft.rfftfreq(nperseg, DT)
    mask = (freqs >= FRANGE[0]) & (freqs <= FRANGE[1])
    fsel, psel = freqs[mask], power[mask]

    # Log-spaced frequency rows (GW spectrograms use a log frequency axis).
    ftarget = np.geomspace(FRANGE[0], FRANGE[1], NF)
    fi = np.array([np.argmin(np.abs(fsel - ft)) for ft in ftarget])
    ti = np.linspace(0, psel.shape[1] - 1, NT).round().astype(int)
    grid = psel[np.ix_(fi, ti)]

    if mode == "signal":
        # Log scale over a fixed dynamic range, referenced to a high percentile
        # so a single loud merger tile does not crush the rest of the track.
        ref = np.percentile(grid, 99.7)
        gdb = 10 * np.log10(grid / (ref + 1e-30) + 1e-30)
        grid = np.clip((gdb + 32.0) / 32.0, 0.0, 1.0)
    else:
        # Uniform elevated field for the stochastic panel (kept fairly dim).
        grid = np.clip(grid / (4.5 * np.median(grid) + 1e-30), 0.0, 1.0)
    return (grid * 255).round().astype(np.uint8)


def embed(sig: np.ndarray, end_frac: float, noise_frac: float) -> TimeSeries:
    """Place ``sig`` inside a fixed-length segment and add a faint noise floor."""
    x = np.zeros(N)
    end = int(N * end_frac)
    start = max(0, end - len(sig))
    seg = sig[-(end - start):]
    x[start : start + len(seg)] += seg
    peak = np.max(np.abs(sig)) or 1.0
    x += rng.normal(0.0, noise_frac * peak, N)
    return TimeSeries(x, delta_t=DT)


def chirp() -> TimeSeries:
    # Inspiral-only (TaylorT4) so there is no loud merger/ringdown spike to
    # crush the dynamic range -- the sweeping track then shows uniformly bright.
    hp, _ = get_td_waveform(
        approximant="TaylorT4",
        mass1=12.0,
        mass2=12.0,
        delta_t=DT,
        f_lower=30.0,
        distance=200.0,
    )
    return embed(np.asarray(hp), end_frac=0.92, noise_frac=0.006)


def continuous() -> TimeSeries:
    t = np.arange(N) * DT
    sig = np.sin(2 * np.pi * 120.0 * t)
    return embed(sig, end_frac=1.0, noise_frac=0.008)


def burst() -> TimeSeries:
    t = np.arange(N) * DT
    t0, tau, f0 = SEG * 0.5, 0.018, 160.0
    sig = np.exp(-((t - t0) ** 2) / (2 * tau**2)) * np.sin(2 * np.pi * f0 * (t - t0))
    return embed(sig, end_frac=1.0, noise_frac=0.006)


def stochastic() -> TimeSeries:
    return TimeSeries(rng.normal(0.0, 1.0, N), delta_t=DT)


def main() -> None:
    panels = {
        "chirp": (chirp(), "signal"),
        "continuous": (continuous(), "signal"),
        "burst": (burst(), "signal"),
        "stochastic": (stochastic(), "noise"),
    }
    data = {
        "source": (
            f"Simulated (loud) with pycbc {pycbc.__version__}; "
            f"STFT power spectrograms, {NF}x{NT} grid"
        ),
        "nt": NT,
        "nf": NF,
        "panels": {
            name: spectrogram(ts, mode).flatten().tolist()
            for name, (ts, mode) in panels.items()
        },
    }

    out = Path(__file__).resolve().parent.parent / "js" / "source-zoo-data.js"
    banner = (
        "// AUTO-GENERATED by scripts/gen_source_zoo_data.py -- do not edit by hand.\n"
        "// Simulated GW source-class spectrograms (Q-transform) produced with pycbc.\n"
    )
    out.write_text(
        f"{banner}window.SOURCE_ZOO_DATA = {json.dumps(data)}\n", encoding="utf-8"
    )
    print(f"Wrote {out.relative_to(Path.cwd())}  ({out.stat().st_size // 1024} KiB)")
    print(f"  {data['source']}")


if __name__ == "__main__":
    main()
