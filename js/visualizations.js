;(function () {
    const NS = 'http://www.w3.org/2000/svg'
    const loops = new WeakMap()

    function svgEl(name, attrs = {}, text = '') {
        const el = document.createElementNS(NS, name)
        Object.entries(attrs).forEach(([key, value]) =>
            el.setAttribute(key, value)
        )
        if (text) el.textContent = text
        return el
    }

    function clearFrame(frame) {
        const old = loops.get(frame)
        if (old) {
            cancelAnimationFrame(old.raf)
            loops.delete(frame)
        }
        frame.textContent = ''
    }

    function makeSvg(frame, viewBox = '0 0 1000 520') {
        clearFrame(frame)
        const svg = svgEl('svg', {
            viewBox,
            role: 'img',
            'aria-hidden': 'true',
        })
        frame.appendChild(svg)
        return svg
    }

    function addText(svg, x, y, text, cls = 'viz-label', anchor = 'middle') {
        svg.appendChild(
            svgEl('text', { x, y, class: cls, 'text-anchor': anchor }, text)
        )
    }

    function addArrow(svg, id = 'arrow') {
        const defs = svgEl('defs')
        const marker = svgEl('marker', {
            id,
            markerWidth: 10,
            markerHeight: 10,
            refX: 8,
            refY: 3,
            orient: 'auto',
            markerUnits: 'strokeWidth',
        })
        marker.appendChild(
            svgEl('path', { d: 'M0,0 L0,6 L9,3 z', fill: '#00407a' })
        )
        defs.appendChild(marker)
        svg.appendChild(defs)
        return `url(#${id})`
    }

    function startCanvas(frame, draw) {
        clearFrame(frame)
        const canvas = document.createElement('canvas')
        frame.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            // Use the unscaled layout box (clientWidth/Height), not
            // getBoundingClientRect(), which returns the reveal-scaled size and
            // would make the canvas overflow its frame and clip on the right
            // and bottom.
            const w = frame.clientWidth
            const h = frame.clientHeight
            canvas.width = Math.max(1, Math.floor(w * dpr))
            canvas.height = Math.max(1, Math.floor(h * dpr))
            canvas.style.width = `${w}px`
            canvas.style.height = `${h}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        let raf = 0
        const loop = (t) => {
            resize()
            draw(ctx, frame.clientWidth, frame.clientHeight, t / 1000)
            raf = requestAnimationFrame(loop)
            loops.set(frame, { raf })
        }
        raf = requestAnimationFrame(loop)
        loops.set(frame, { raf })
    }

    function roundedRect(svg, x, y, w, h, label, sublabel, color = '#00a5c8') {
        svg.appendChild(
            svgEl('rect', {
                x,
                y,
                width: w,
                height: h,
                rx: 8,
                fill: '#ffffff',
                stroke: color,
                'stroke-width': 3,
            })
        )
        addText(svg, x + w / 2, y + h / 2 - 4, label)
        if (sublabel)
            addText(svg, x + w / 2, y + h / 2 + 24, sublabel, 'viz-small')
    }

    const renderers = {
        'gw-stretch': function (frame) {
            const svg = makeSvg(frame)
            const cx = 330
            const cy = 260
            const baseR = 145
            const sx0 = 590
            const sx1 = 930
            const sy = 260
            const strainAmp = 92

            const defs = svgEl('defs')
            const waveGradient = svgEl('linearGradient', {
                id: 'gw-wave-gradient',
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '0%',
            })
            waveGradient.appendChild(
                svgEl('stop', {
                    offset: '0%',
                    'stop-color': '#00a5c8',
                    'stop-opacity': '0',
                })
            )
            waveGradient.appendChild(
                svgEl('stop', {
                    offset: '50%',
                    'stop-color': '#00a5c8',
                    'stop-opacity': '0.16',
                })
            )
            waveGradient.appendChild(
                svgEl('stop', {
                    offset: '100%',
                    'stop-color': '#00a5c8',
                    'stop-opacity': '0',
                })
            )
            defs.appendChild(waveGradient)
            svg.appendChild(defs)

            const waveBand = svgEl('rect', {
                x: -160,
                y: 0,
                width: 170,
                height: 520,
                fill: 'url(#gw-wave-gradient)',
            })
            svg.appendChild(waveBand)
            addText(svg, 115, 58, 'passing wave', 'viz-label')

            const grid = svgEl('g', {
                stroke: '#d9e0e7',
                'stroke-width': 1,
                opacity: 0.9,
            })
            for (let i = -6; i <= 6; i++) {
                grid.appendChild(svgEl('line'))
                grid.appendChild(svgEl('line'))
            }
            svg.appendChild(grid)

            const ring = svgEl('ellipse', {
                cx,
                cy,
                rx: baseR,
                ry: baseR,
                fill: 'none',
                stroke: '#00407a',
                'stroke-width': 6,
            })
            svg.appendChild(ring)

            const masses = []
            for (let i = 0; i < 12; i++) {
                const mass = svgEl('circle', { r: 8.5, fill: '#00a5c8' })
                masses.push(mass)
                svg.appendChild(mass)
            }

            function makeArrow(color) {
                const group = svgEl('g', {
                    stroke: color,
                    fill: color,
                    'stroke-width': 4,
                    'stroke-linecap': 'round',
                })
                group.appendChild(svgEl('line'))
                group.appendChild(svgEl('polygon'))
                svg.appendChild(group)
                return group
            }

            const arrows = [
                makeArrow('#f2a900'),
                makeArrow('#f2a900'),
                makeArrow('#00a5c8'),
                makeArrow('#00a5c8'),
            ]
            const modeLabel = svgEl('text', {
                x: cx,
                y: 86,
                class: 'viz-label',
                'text-anchor': 'middle',
                style: 'font-size: 25px',
            })
            svg.appendChild(modeLabel)
            addText(svg, cx, 465, 'free test masses', 'viz-label')

            const axes = svgEl('g', { stroke: '#8593a0', 'stroke-width': 2 })
            axes.appendChild(
                svgEl('line', { x1: sx0, y1: sy, x2: sx1, y2: sy })
            )
            axes.appendChild(
                svgEl('line', {
                    x1: sx0,
                    y1: sy - strainAmp * 1.45,
                    x2: sx0,
                    y2: sy + strainAmp * 1.45,
                })
            )
            svg.appendChild(axes)
            addText(svg, (sx0 + sx1) / 2, 78, 'strain h(t)', 'viz-label')

            const strainPath = svgEl('path', {
                fill: 'none',
                stroke: '#00407a',
                'stroke-width': 5,
                'stroke-linecap': 'round',
            })
            svg.appendChild(strainPath)
            const strainDot = svgEl('circle', { r: 8, fill: '#f2a900' })
            svg.appendChild(strainDot)

            function setArrow(group, x1, y1, x2, y2) {
                const line = group.children[0]
                const head = group.children[1]
                const angle = Math.atan2(y2 - y1, x2 - x1)
                const left = [
                    x2 - 12 * Math.cos(angle - 0.48),
                    y2 - 12 * Math.sin(angle - 0.48),
                ]
                const right = [
                    x2 - 12 * Math.cos(angle + 0.48),
                    y2 - 12 * Math.sin(angle + 0.48),
                ]
                line.setAttribute('x1', x1)
                line.setAttribute('y1', y1)
                line.setAttribute('x2', x2)
                line.setAttribute('y2', y2)
                head.setAttribute(
                    'points',
                    `${x2},${y2} ${left[0]},${left[1]} ${right[0]},${right[1]}`
                )
            }

            const animate = (timestamp) => {
                const phase = (timestamp / 1000) * 2.4
                const amp = Math.sin(phase) * 0.18
                const rx = baseR * (1 + amp)
                const ry = baseR * (1 - amp)
                waveBand.setAttribute(
                    'x',
                    String((((timestamp / 1000) * 95) % 1160) - 160)
                )
                ring.setAttribute('rx', rx)
                ring.setAttribute('ry', ry)

                masses.forEach((mass, i) => {
                    const a = (i / masses.length) * Math.PI * 2
                    mass.setAttribute('cx', cx + Math.cos(a) * rx)
                    mass.setAttribute('cy', cy + Math.sin(a) * ry)
                })

                const gridLines = Array.from(grid.children)
                for (let i = -6; i <= 6; i++) {
                    const idx = (i + 6) * 2
                    const dx = i * baseR * 0.25 * (1 + amp)
                    const dy = i * baseR * 0.19 * (1 - amp)
                    gridLines[idx].setAttribute('x1', cx + dx)
                    gridLines[idx].setAttribute('y1', cy - baseR * 1.42)
                    gridLines[idx].setAttribute('x2', cx + dx)
                    gridLines[idx].setAttribute('y2', cy + baseR * 1.42)
                    gridLines[idx + 1].setAttribute('x1', cx - baseR * 1.75)
                    gridLines[idx + 1].setAttribute('y1', cy + dy)
                    gridLines[idx + 1].setAttribute('x2', cx + baseR * 1.75)
                    gridLines[idx + 1].setAttribute('y2', cy + dy)
                }

                const horizontalStretch = amp >= 0
                modeLabel.textContent = horizontalStretch
                    ? 'stretch'
                    : 'squeeze'
                if (horizontalStretch) {
                    setArrow(
                        arrows[0],
                        cx - baseR * 0.68,
                        cy,
                        cx - baseR * 1.28,
                        cy
                    )
                    setArrow(
                        arrows[1],
                        cx + baseR * 0.68,
                        cy,
                        cx + baseR * 1.28,
                        cy
                    )
                    setArrow(
                        arrows[2],
                        cx,
                        cy - baseR * 1.23,
                        cx,
                        cy - baseR * 0.83
                    )
                    setArrow(
                        arrows[3],
                        cx,
                        cy + baseR * 1.23,
                        cx,
                        cy + baseR * 0.83
                    )
                } else {
                    setArrow(
                        arrows[0],
                        cx - baseR * 1.28,
                        cy,
                        cx - baseR * 0.78,
                        cy
                    )
                    setArrow(
                        arrows[1],
                        cx + baseR * 1.28,
                        cy,
                        cx + baseR * 0.78,
                        cy
                    )
                    setArrow(
                        arrows[2],
                        cx,
                        cy - baseR * 0.68,
                        cx,
                        cy - baseR * 1.28
                    )
                    setArrow(
                        arrows[3],
                        cx,
                        cy + baseR * 0.68,
                        cx,
                        cy + baseR * 1.28
                    )
                }

                let d = ''
                for (let i = 0; i <= 240; i++) {
                    const u = i / 240
                    const x = sx0 + u * (sx1 - sx0)
                    const y =
                        sy -
                        Math.sin(u * Math.PI * 5.5 - phase) *
                            strainAmp *
                            (0.25 + 0.75 * u)
                    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
                }
                strainPath.setAttribute('d', d)
                const dotU = 0.72
                strainDot.setAttribute('cx', sx0 + dotU * (sx1 - sx0))
                strainDot.setAttribute(
                    'cy',
                    sy -
                        Math.sin(dotU * Math.PI * 5.5 - phase) *
                            strainAmp *
                            (0.25 + 0.75 * dotU)
                )

                const raf = requestAnimationFrame(animate)
                loops.set(frame, { raf })
            }
            const raf = requestAnimationFrame(animate)
            loops.set(frame, { raf })
        },

        chirp: function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const left = w * 0.28
                const midY = h * 0.43
                const phase = t * 1.2
                const sep = Math.max(38, 130 - ((t * 18) % 96))
                ctx.strokeStyle = '#d9e0e7'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(left, midY, sep, 0, Math.PI * 2)
                ctx.stroke()
                ;[0, Math.PI].forEach((off, i) => {
                    const x = left + Math.cos(phase * 4 + off) * sep
                    const y = midY + Math.sin(phase * 4 + off) * sep
                    ctx.fillStyle = i === 0 ? '#00407a' : '#f2a900'
                    ctx.beginPath()
                    ctx.arc(x, y, i === 0 ? 18 : 13, 0, Math.PI * 2)
                    ctx.fill()
                })
                ctx.fillStyle = '#17212b'
                ctx.font = '700 20px Arial'
                ctx.textAlign = 'center'
                ctx.fillText('binary inspiral', left, h * 0.82)

                const x0 = w * 0.48
                const x1 = w * 0.92
                const y0 = h * 0.5
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(x0, y0)
                ctx.lineTo(x1, y0)
                ctx.stroke()
                ctx.strokeStyle = '#00a5c8'
                ctx.lineWidth = 3
                ctx.beginPath()
                for (let i = 0; i <= 360; i++) {
                    const u = i / 360
                    const x = x0 + u * (x1 - x0)
                    const freq = 3 + 20 * u * u
                    const amp = 10 + 70 * u * u
                    const y =
                        y0 - Math.sin(freq * u * Math.PI * 2 - t * 2) * amp
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 20px Arial'
                ctx.fillText('chirp waveform', (x0 + x1) / 2, h * 0.82)
            })
        },

        interferometer: function (frame) {
            const svg = makeSvg(frame)
            const arrow = addArrow(svg, 'ifo-arrow')
            svg.appendChild(
                svgEl('circle', { cx: 500, cy: 260, r: 16, fill: '#f2a900' })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 500,
                    y1: 260,
                    x2: 810,
                    y2: 260,
                    stroke: '#00407a',
                    'stroke-width': 10,
                    class: 'flow-line',
                    'marker-end': arrow,
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 500,
                    y1: 260,
                    x2: 500,
                    y2: 70,
                    stroke: '#00407a',
                    'stroke-width': 10,
                    class: 'flow-line',
                    'marker-end': arrow,
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 180,
                    y1: 260,
                    x2: 500,
                    y2: 260,
                    stroke: '#f2a900',
                    'stroke-width': 8,
                    class: 'flow-line',
                })
            )
            svg.appendChild(
                svgEl('rect', {
                    x: 815,
                    y: 226,
                    width: 28,
                    height: 68,
                    rx: 4,
                    fill: '#00a5c8',
                })
            )
            svg.appendChild(
                svgEl('rect', {
                    x: 466,
                    y: 38,
                    width: 68,
                    height: 28,
                    rx: 4,
                    fill: '#00a5c8',
                })
            )
            svg.appendChild(
                svgEl('rect', {
                    x: 150,
                    y: 236,
                    width: 42,
                    height: 48,
                    rx: 4,
                    fill: '#f2a900',
                })
            )
            svg.appendChild(
                svgEl('circle', {
                    cx: 500,
                    cy: 260,
                    r: 44,
                    fill: 'none',
                    stroke: '#8593a0',
                    'stroke-width': 2,
                    'stroke-dasharray': '6 6',
                })
            )
            addText(svg, 170, 322, 'laser')
            addText(svg, 832, 322, 'mirror')
            addText(svg, 500, 35, 'mirror')
            addText(
                svg,
                500,
                430,
                'differential arm length -> optical phase -> strain time series'
            )
            const path = 'M650,384 C690,330 730,438 770,384 S850,438 895,384'
            svg.appendChild(
                svgEl('path', {
                    d: path,
                    fill: 'none',
                    stroke: '#00a5c8',
                    'stroke-width': 4,
                    class: 'draw-line',
                })
            )
        },

        'signal-processing-map': function (frame) {
            const svg = makeSvg(frame, '0 0 1000 520')
            const arrow = addArrow(svg, 'sp-arrow')
            svg.appendChild(
                svgEl('path', {
                    d: 'M0,420 C170,395 315,435 500,405 C675,376 820,408 1000,380 L1000,520 L0,520 Z',
                    fill: '#e7f1f5',
                })
            )

            // Source: compact binary.
            svg.appendChild(
                svgEl('circle', { cx: 135, cy: 205, r: 28, fill: '#00407a' })
            )
            svg.appendChild(
                svgEl('circle', { cx: 225, cy: 205, r: 18, fill: '#f2a900' })
            )
            svg.appendChild(
                svgEl('ellipse', {
                    cx: 180,
                    cy: 205,
                    rx: 86,
                    ry: 45,
                    fill: 'none',
                    stroke: '#8593a0',
                    'stroke-width': 3,
                    'stroke-dasharray': '8 8',
                })
            )
            addText(svg, 180, 92, 'source')
            addText(svg, 180, 286, 'compact binary', 'viz-small')

            // Wave propagating to the detector.
            for (let i = 0; i < 4; i++) {
                svg.appendChild(
                    svgEl('path', {
                        d: `M${285 + i * 28},135 C${330 + i * 28},170 ${330 + i * 28},240 ${285 + i * 28},275`,
                        fill: 'none',
                        stroke: i % 2 ? '#f2a900' : '#00a5c8',
                        'stroke-width': 5,
                        opacity: 0.76,
                        class: 'flow-line',
                    })
                )
            }
            addText(svg, 335, 92, 'wave', 'viz-label')

            // Detector as an L-shaped interferometer.
            svg.appendChild(
                svgEl('path', {
                    d: 'M462,312 L462,178 L598,178',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 12,
                    'stroke-linecap': 'round',
                })
            )
            svg.appendChild(
                svgEl('circle', { cx: 462, cy: 312, r: 15, fill: '#f2a900' })
            )
            svg.appendChild(
                svgEl('rect', {
                    x: 586,
                    y: 160,
                    width: 28,
                    height: 36,
                    rx: 4,
                    fill: '#00a5c8',
                })
            )
            svg.appendChild(
                svgEl('rect', {
                    x: 444,
                    y: 155,
                    width: 36,
                    height: 28,
                    rx: 4,
                    fill: '#00a5c8',
                })
            )
            addText(svg, 525, 92, 'detector')
            addText(svg, 525, 350, 'precision sensing', 'viz-small')

            // Noisy data stream.
            svg.appendChild(
                svgEl('line', {
                    x1: 665,
                    y1: 245,
                    x2: 835,
                    y2: 245,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M665,245 C684,218 704,270 724,242 C748,208 765,284 790,238 C811,202 820,262 835,230',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 5,
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M665,245 C686,247 704,237 724,249 C748,250 765,234 790,250 C811,249 820,240 835,247',
                    fill: 'none',
                    stroke: '#00a5c8',
                    'stroke-width': 3,
                    opacity: 0.65,
                })
            )
            addText(svg, 750, 92, 'data')
            addText(svg, 750, 350, 'weak signal + noise', 'viz-small')

            // Inference output.
            svg.appendChild(
                svgEl('circle', {
                    cx: 905,
                    cy: 205,
                    r: 56,
                    fill: '#eef7fa',
                    stroke: '#00a5c8',
                    'stroke-width': 4,
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M875,210 C895,172 925,172 940,210 C928,245 890,246 875,210',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 4,
                })
            )
            svg.appendChild(
                svgEl('circle', { cx: 906, cy: 207, r: 8, fill: '#f2a900' })
            )
            addText(svg, 905, 92, 'inference')
            addText(svg, 905, 286, 'source physics', 'viz-small')
            ;[
                [250, 205, 407, 205],
                [615, 245, 650, 245],
                [850, 225, 874, 215],
            ].forEach(([x1, y1, x2, y2]) => {
                svg.appendChild(
                    svgEl('line', {
                        x1,
                        y1,
                        x2,
                        y2,
                        stroke: '#00407a',
                        'stroke-width': 5,
                        class: 'flow-line',
                        'marker-end': arrow,
                    })
                )
            })

            addText(
                svg,
                500,
                455,
                'recover a faint coherent wave from a noisy measurement system'
            )
        },

        'source-zoo': function (frame) {
            // Four source classes, each as its own time-frequency spectrogram
            // (intensity encoded with the viridis colormap). This mirrors how
            // the classes appear in real GW data products; overlaying them on
            // one plane is what makes the morphologies hard to read.
            const cache = {}

            // Deterministic 2-D pseudo-random for the noise floor / speckle.
            const rnd2 = (x, y) => {
                const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
                return v - Math.floor(v)
            }

            // Viridis colormap (perceptually uniform), 10 anchor stops.
            const STOPS = [
                [68, 1, 84],
                [72, 40, 120],
                [62, 74, 137],
                [49, 104, 142],
                [38, 130, 142],
                [31, 158, 137],
                [53, 183, 121],
                [110, 206, 88],
                [181, 222, 43],
                [253, 231, 37],
            ]
            const viridis = (t) => {
                t = Math.max(0, Math.min(1, t))
                const s = t * (STOPS.length - 1)
                const i = Math.min(STOPS.length - 2, Math.floor(s))
                const f = s - i
                const a = STOPS[i]
                const b = STOPS[i + 1]
                return [
                    a[0] + (b[0] - a[0]) * f,
                    a[1] + (b[1] - a[1]) * f,
                    a[2] + (b[2] - a[2]) * f,
                ]
            }

            // Intensity field (0..1) for each morphology at (u=time, q=freq).
            const intensity = (type, u, q, px, py) => {
                const floor = 0.05 + 0.06 * rnd2(px, py)
                if (type === 'chirp') {
                    const fq = 0.05 + 0.9 * Math.pow(u, 2.3)
                    const sig = 0.04 + 0.03 * u
                    const peak = 0.5 + 0.5 * u
                    return (
                        floor +
                        peak * Math.exp(-((q - fq) ** 2) / (2 * sig * sig))
                    )
                }
                if (type === 'continuous') {
                    const q0 = 0.5
                    const sig = 0.025
                    return (
                        floor +
                        0.9 * Math.exp(-((q - q0) ** 2) / (2 * sig * sig))
                    )
                }
                if (type === 'burst') {
                    const u0 = 0.5
                    const su = 0.05
                    const q0 = 0.5
                    const sq = 0.3
                    return (
                        floor +
                        Math.exp(
                            -((u - u0) ** 2) / (2 * su * su) -
                                (q - q0) ** 2 / (2 * sq * sq)
                        )
                    )
                }
                if (type === 'stochastic') {
                    return 0.28 + 0.42 * rnd2(px * 1.3 + 5, py * 1.7 + 9)
                }
                return floor
            }

            const toOffscreen = (W, H, valueAt) => {
                const off = document.createElement('canvas')
                off.width = W
                off.height = H
                const octx = off.getContext('2d')
                const img = octx.createImageData(W, H)
                for (let py = 0; py < H; py++) {
                    for (let px = 0; px < W; px++) {
                        const [r, g, b] = viridis(valueAt(px, py, W, H))
                        const idx = (py * W + px) * 4
                        img.data[idx] = r
                        img.data[idx + 1] = g
                        img.data[idx + 2] = b
                        img.data[idx + 3] = 255
                    }
                }
                octx.putImageData(img, 0, 0)
                return off
            }

            // Simulated Q-transform spectrogram (js/source-zoo-data.js) if
            // available; otherwise an analytic stand-in of the same morphology.
            const buildSpectro = (type) => {
                const sim = window.SOURCE_ZOO_DATA
                if (sim && sim.panels && sim.panels[type]) {
                    const { nt, nf } = sim
                    const grid = sim.panels[type]
                    // Byte grid is stored low-frequency-first; image top = high.
                    return toOffscreen(
                        nt,
                        nf,
                        (px, py) => grid[(nf - 1 - py) * nt + px] / 255
                    )
                }
                return toOffscreen(300, 160, (px, py, W, H) =>
                    intensity(type, px / (W - 1), 1 - py / (H - 1), px, py)
                )
            }

            startCanvas(frame, (ctx, w, h) => {
                ctx.clearRect(0, 0, w, h)
                const leftM = 38
                const topM = 22
                const botM = 22
                const gap = 28
                const cbZone = 104
                const gridW = w - leftM - cbZone
                const pw = (gridW - gap) / 2
                const ph = (h - topM - botM - gap) / 2

                function panel(col, row, type, title, sub) {
                    const px = leftM + col * (pw + gap)
                    const py = topM + row * (ph + gap)
                    ctx.fillStyle = '#ffffff'
                    ctx.strokeStyle = '#d9e0e7'
                    ctx.lineWidth = 1.5
                    ctx.beginPath()
                    ctx.roundRect(px, py, pw, ph, 10)
                    ctx.fill()
                    ctx.stroke()
                    ctx.fillStyle = '#17212b'
                    ctx.font = '700 19px Arial'
                    ctx.textAlign = 'left'
                    ctx.fillText(title, px + 18, py + 28)
                    ctx.fillStyle = '#5a6875'
                    ctx.font = '14px Arial'
                    ctx.fillText(sub, px + 18, py + 49)

                    const x0 = px + 46
                    const x1 = px + pw - 18
                    const y1 = py + 60
                    const y0 = py + ph - 28
                    if (!cache[type]) cache[type] = buildSpectro(type)
                    ctx.imageSmoothingEnabled = true
                    ctx.imageSmoothingQuality = 'high'
                    ctx.drawImage(cache[type], x0, y1, x1 - x0, y0 - y1)
                    ctx.strokeStyle = '#8593a0'
                    ctx.lineWidth = 1.2
                    ctx.strokeRect(x0, y1, x1 - x0, y0 - y1)

                    ctx.fillStyle = '#5a6875'
                    ctx.font = '12px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText('time', (x0 + x1) / 2, y0 + 18)
                    ctx.save()
                    ctx.translate(px + 20, (y0 + y1) / 2)
                    ctx.rotate(-Math.PI / 2)
                    ctx.fillText('frequency', 0, 0)
                    ctx.restore()
                }

                panel(
                    0,
                    0,
                    'chirp',
                    'Compact binary',
                    'chirp — frequency sweeps up'
                )
                panel(
                    1,
                    0,
                    'continuous',
                    'Continuous wave',
                    'steady single frequency'
                )
                panel(0, 1, 'burst', 'Burst', 'brief, unmodelled transient')
                panel(
                    1,
                    1,
                    'stochastic',
                    'Stochastic background',
                    'random, from everywhere'
                )

                // Shared colorbar.
                const barX = w - cbZone + 34
                const barW = 20
                const barTop = topM + 24
                const barBot = h - botM - 24
                if (!cache.__cbar) {
                    const cb = document.createElement('canvas')
                    cb.width = 1
                    cb.height = 128
                    const cctx = cb.getContext('2d')
                    const cimg = cctx.createImageData(1, 128)
                    for (let i = 0; i < 128; i++) {
                        const [r, g, b] = viridis(1 - i / 127)
                        cimg.data[i * 4] = r
                        cimg.data[i * 4 + 1] = g
                        cimg.data[i * 4 + 2] = b
                        cimg.data[i * 4 + 3] = 255
                    }
                    cctx.putImageData(cimg, 0, 0)
                    cache.__cbar = cb
                }
                ctx.drawImage(cache.__cbar, barX, barTop, barW, barBot - barTop)
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.2
                ctx.strokeRect(barX, barTop, barW, barBot - barTop)
                ctx.fillStyle = '#5a6875'
                ctx.font = '12px Arial'
                ctx.textAlign = 'left'
                ctx.fillText('high', barX + barW + 6, barTop + 6)
                ctx.fillText('low', barX + barW + 6, barBot)
                ctx.save()
                ctx.translate(barX + barW + 40, (barTop + barBot) / 2)
                ctx.rotate(-Math.PI / 2)
                ctx.textAlign = 'center'
                ctx.fillStyle = '#17212b'
                ctx.font = '700 13px Arial'
                ctx.fillText('normalized power', 0, 0)
                ctx.restore()
            })
        },

        'site-map': function (frame) {
            // Vector map of the ET candidate sites, placed by true latitude and
            // longitude with d3-geo (js/vendor/d3-geo.min.js) over a bundled
            // Europe GeoJSON (js/europe-geo.js). Fully offline; no tile server.
            // Use the frame's unscaled layout box for the viewBox so the map
            // fills it exactly (no letterboxing or distortion).
            const W = frame.clientWidth || 1000
            const H = frame.clientHeight || 560
            const svg = makeSvg(frame, `0 0 ${W} ${H}`)

            if (!window.d3 || !window.EUROPE_GEO) {
                addText(svg, W / 2, H / 2, 'map data unavailable', 'viz-label')
                return
            }
            const d3 = window.d3

            // ET candidate sites (decimal degrees). `place` puts the label to
            // one side of the marker so the labels never overlap.
            const sites = [
                {
                    name: 'Euregio Meuse-Rhine',
                    lon: 5.9,
                    lat: 50.75,
                    place: 'left',
                },
                { name: 'Lusatia', lon: 14.3, lat: 51.5, place: 'right' },
                { name: 'Sardinia', lon: 9.43, lat: 40.44, place: 'below' },
            ]

            // Lambert azimuthal equal-area centred on Europe (the EU-standard
            // ETRS89-LAEA / EPSG:3035 projection), framed to the region that
            // contains the candidate sites. A MultiPoint of the frame corners
            // is used for fitSize (a Polygon would be winding-sensitive).
            const frameCorners = {
                type: 'MultiPoint',
                coordinates: [
                    [-1, 37],
                    [21, 37],
                    [21, 53.5],
                    [-1, 53.5],
                ],
            }
            const projection = d3
                .geoAzimuthalEqualArea()
                .rotate([-10, -52])
                .fitSize([W, H], frameCorners)
            const pathGen = d3.geoPath(projection)

            // Sea background + country outlines.
            svg.appendChild(
                svgEl('rect', {
                    x: 0,
                    y: 0,
                    width: W,
                    height: H,
                    fill: '#cfe0ec',
                })
            )
            const land = svgEl('g', {
                fill: '#c9cfd6',
                stroke: '#ffffff',
                'stroke-width': 1,
                'stroke-linejoin': 'round',
            })
            for (const feature of window.EUROPE_GEO.features) {
                const d = pathGen(feature)
                if (d) land.appendChild(svgEl('path', { d }))
            }
            svg.appendChild(land)

            // Markers at precise coordinates, with labels placed to the side.
            sites.forEach((s) => {
                const [x, y] = projection([s.lon, s.lat])
                const tw = s.name.length * 9.2 + 16
                const gap = 14
                let anchor = 'middle'
                let tx = x
                let ty = y
                let bx = x - tw / 2
                if (s.place === 'left') {
                    anchor = 'end'
                    tx = x - gap
                    ty = y + 5
                    bx = tx - tw + 9
                } else if (s.place === 'right') {
                    anchor = 'start'
                    tx = x + gap
                    ty = y + 5
                    bx = tx - 9
                } else {
                    // below
                    ty = y + 30
                    bx = x - tw / 2
                }
                svg.appendChild(
                    svgEl('rect', {
                        x: bx,
                        y: ty - 16,
                        width: tw,
                        height: 22,
                        rx: 5,
                        fill: 'rgba(255,255,255,0.92)',
                        stroke: '#d9e0e7',
                        'stroke-width': 1,
                    })
                )
                addText(svg, tx, ty, s.name, 'viz-label', anchor)
                // Connector for the "below" label.
                if (s.place === 'below') {
                    svg.appendChild(
                        svgEl('line', {
                            x1: x,
                            y1: y,
                            x2: x,
                            y2: ty - 16,
                            stroke: '#8593a0',
                            'stroke-width': 1.5,
                        })
                    )
                }
                svg.appendChild(
                    svgEl('circle', {
                        cx: x,
                        cy: y,
                        r: 8,
                        fill: '#f2a900',
                        stroke: '#ffffff',
                        'stroke-width': 2.5,
                    })
                )
            })

            addText(
                svg,
                W - 8,
                H - 10,
                'Base map: Natural Earth (public domain)',
                'viz-small',
                'end'
            )
        },

        'sensitivity-curve': function (frame) {
            // Log-log amplitude spectral density curves comparing current and
            // next-generation ground-based detectors. Data: LIGO-T1500293
            // reference curves (js/sensitivity-data.js). Message: the next
            // generation, especially the underground ET, opens the low-frequency
            // band the current generation cannot reach.
            const svg = makeSvg(frame, '0 0 1000 520')
            const data = window.SENSITIVITY_DATA
            if (!data) {
                addText(
                    svg,
                    500,
                    260,
                    'sensitivity data unavailable',
                    'viz-label'
                )
                return
            }

            const x0 = 96
            const x1 = 928
            const yb = 424
            const yt = 54
            const fMin = 1.5
            const fMax = 5000
            const aMin = 1.5e-25 // most sensitive (plot bottom)
            const aMax = 1e-21 // least sensitive (plot top)
            const lg = Math.log10
            const X = (f) =>
                x0 + ((lg(f) - lg(fMin)) / (lg(fMax) - lg(fMin))) * (x1 - x0)
            const Y = (a) =>
                yb - ((lg(a) - lg(aMin)) / (lg(aMax) - lg(aMin))) * (yb - yt)

            // Shaded low-frequency band (below the current-generation usable
            // limit ~20 Hz) that the next generation opens up.
            const fWall = 20
            svg.appendChild(
                svgEl('rect', {
                    x: X(fMin),
                    y: yt,
                    width: X(fWall) - X(fMin),
                    height: yb - yt,
                    fill: '#f2a900',
                    opacity: 0.1,
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: X(fWall),
                    y1: yt,
                    x2: X(fWall),
                    y2: yb,
                    stroke: '#c99000',
                    'stroke-width': 1.5,
                    'stroke-dasharray': '5 5',
                })
            )
            addText(
                svg,
                X(fMin) + (X(fWall) - X(fMin)) / 2,
                yb - 8,
                'low-frequency band',
                'viz-small'
            )
            addText(svg, X(fWall) + 5, yt + 14, '~20 Hz', 'viz-small', 'start')

            // Grid + axis ticks.
            const grid = svgEl('g', { stroke: '#e6ebf0', 'stroke-width': 1 })
            const xticks = [2, 5, 10, 20, 100, 1000, 5000]
            xticks.forEach((f) => {
                grid.appendChild(
                    svgEl('line', { x1: X(f), y1: yt, x2: X(f), y2: yb })
                )
            })
            const yticks = [1e-24, 1e-23, 1e-22, 1e-21]
            yticks.forEach((a) => {
                grid.appendChild(
                    svgEl('line', { x1: x0, y1: Y(a), x2: x1, y2: Y(a) })
                )
            })
            svg.appendChild(grid)

            // Axes.
            svg.appendChild(
                svgEl('line', {
                    x1: x0,
                    y1: yb,
                    x2: x1,
                    y2: yb,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: x0,
                    y1: yt,
                    x2: x0,
                    y2: yb,
                    class: 'viz-axis',
                })
            )
            xticks.forEach((f) => {
                addText(
                    svg,
                    X(f),
                    yb + 22,
                    f >= 1000 ? `${f / 1000}k` : `${f}`,
                    'viz-small'
                )
            })
            yticks.forEach((a) => {
                addText(
                    svg,
                    x0 - 8,
                    Y(a) + 4,
                    `10${String(lg(a))
                        .replace('-', '⁻')
                        .replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`,
                    'viz-small',
                    'end'
                )
            })
            addText(svg, (x0 + x1) / 2, yb + 46, 'frequency (Hz)', 'viz-label')
            const yl = svgEl('text', {
                x: 24,
                y: (yt + yb) / 2,
                class: 'viz-label',
                'text-anchor': 'middle',
                transform: `rotate(-90 24 ${(yt + yb) / 2})`,
            })
            yl.textContent = 'strain noise ASD (1/√Hz) — lower is better'
            svg.appendChild(yl)

            // Curves (clip to plot box).
            const clip = svgEl('clipPath', { id: 'sens-clip' })
            clip.appendChild(
                svgEl('rect', {
                    x: x0,
                    y: yt,
                    width: x1 - x0,
                    height: yb - yt,
                })
            )
            const defs = svgEl('defs')
            defs.appendChild(clip)
            svg.appendChild(defs)
            const plot = svgEl('g', { 'clip-path': 'url(#sens-clip)' })
            data.curves.forEach((c) => {
                let d = ''
                c.points.forEach((p, i) => {
                    d += `${i === 0 ? 'M' : 'L'}${X(p.f).toFixed(1)},${Y(p.asd).toFixed(1)} `
                })
                plot.appendChild(
                    svgEl('path', {
                        d,
                        fill: 'none',
                        stroke: c.color,
                        'stroke-width': c.gen === 'future' ? 4.5 : 2.5,
                        'stroke-linejoin': 'round',
                    })
                )
            })
            svg.appendChild(plot)

            // ET low-frequency reach marker.
            const et = data.curves.find((c) => c.label === 'Einstein Telescope')
            if (et) {
                const w = et.points[0]
                svg.appendChild(
                    svgEl('circle', {
                        cx: X(w.f),
                        cy: Y(w.asd),
                        r: 6,
                        fill: et.color,
                    })
                )
                addText(
                    svg,
                    X(w.f) + 10,
                    Y(w.asd) + 5,
                    `ET reaches ~${w.f < 2 ? 2 : Math.round(w.f)} Hz`,
                    'viz-label',
                    'start'
                )
            }

            // Legend, grouped by generation.
            let ly = yt + 10
            const lx = x1 - 232
            const legendRow = (color, label, header) => {
                if (header) {
                    addText(svg, lx, ly, header, 'viz-small', 'start')
                    ly += 20
                }
                svg.appendChild(
                    svgEl('line', {
                        x1: lx,
                        y1: ly - 4,
                        x2: lx + 26,
                        y2: ly - 4,
                        stroke: color,
                        'stroke-width': label && !header ? 4 : 4,
                    })
                )
                addText(svg, lx + 34, ly, label, 'viz-small', 'start')
                ly += 22
            }
            let prevGen = null
            data.curves.forEach((c) => {
                const header =
                    c.gen !== prevGen
                        ? c.gen === 'current'
                            ? 'Current generation'
                            : 'Next generation'
                        : null
                prevGen = c.gen
                legendRow(c.color, c.label, header)
            })
        },

        geometry: function (frame) {
            // Responsive: size the viewBox to the frame's layout box so the
            // sketches fill the width instead of being letterboxed.
            const W = frame.clientWidth || 1080
            const H = frame.clientHeight || 205
            const svg = makeSvg(frame, `0 0 ${W} ${H}`)
            const topY = 24
            const baseY = H - 34
            const apexY = topY + 20
            const span = baseY - apexY
            const sw = 7

            const dot = (x, y) =>
                svg.appendChild(
                    svgEl('circle', { cx: x, cy: y, r: 9, fill: '#00a5c8' })
                )

            // Triangle (left half): single site, three nested detectors.
            const tcx = W * 0.26
            const half = span * 0.6
            addText(svg, tcx, topY, 'Triangle')
            svg.appendChild(
                svgEl('path', {
                    d: `M${tcx},${apexY} L${tcx + half},${baseY} L${tcx - half},${baseY} Z`,
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': sw,
                    'stroke-linejoin': 'round',
                })
            )
            dot(tcx, apexY)
            dot(tcx + half, baseY)
            dot(tcx - half, baseY)
            addText(svg, tcx, H - 8, 'one site · 10 km arms', 'viz-small')

            // Two L-shaped detectors (right half); second misaligned by 45°.
            addText(svg, W * 0.74, topY, 'Two L-shaped detectors')
            const arm = span * 0.62
            const lShape = (vx, vy, rot) => {
                const attrs = {
                    d: `M${vx},${vy} L${vx},${vy - arm} L${vx + arm},${vy - arm}`,
                    fill: 'none',
                    stroke: rot ? '#00a5c8' : '#00407a',
                    'stroke-width': sw,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                }
                if (rot) attrs.transform = `rotate(${rot} ${vx} ${vy})`
                svg.appendChild(svgEl('path', attrs))
                dot(vx, vy)
            }
            lShape(W * 0.6, baseY, 0)
            lShape(W * 0.8, baseY, 45)
            addText(
                svg,
                W * 0.74,
                H - 8,
                'two sites · 15 km arms · 45° apart',
                'viz-small'
            )

            svg.appendChild(
                svgEl('line', {
                    x1: W / 2,
                    y1: topY - 6,
                    x2: W / 2,
                    y2: H - 2,
                    stroke: '#d9e0e7',
                    'stroke-width': 2,
                })
            )
        },

        transducer: function (frame) {
            const svg = makeSvg(frame)
            const arrow = addArrow(svg, 'trans-arrow')

            // --- Measurement path: the transduction chain. ---
            addText(
                svg,
                500,
                30,
                'the measurement path: a passing wave becomes calibrated strain',
                'viz-small'
            )
            const boxes = [
                [45, 52, 168, 78, 'space-time', 'strain h(t)'],
                [261, 52, 168, 78, 'test masses', 'differential motion'],
                [477, 52, 168, 78, 'light', 'optical phase'],
                [693, 52, 206, 78, 'calibrated data', 'strain + context'],
            ]
            boxes.forEach((box, i) => {
                roundedRect(svg, ...box)
                if (i < boxes.length - 1)
                    svg.appendChild(
                        svgEl('line', {
                            x1: box[0] + box[2] + 12,
                            y1: 91,
                            x2: boxes[i + 1][0] - 12,
                            y2: 91,
                            stroke: '#00407a',
                            'stroke-width': 4,
                            class: 'flow-line',
                            'marker-end': arrow,
                        })
                    )
            })

            // --- Auxiliary channels: witnesses to the detector's state. ---
            const cards = [
                ['seismometer', 'ground motion'],
                ['microphone', 'acoustic'],
                ['magnetometer', 'EM environment'],
                ['power / optics', 'instrument'],
            ]
            const cardW = 200
            const cardH = 118
            const gap = 24
            const cardY = 222
            const totalW = cards.length * cardW + (cards.length - 1) * gap
            const startX = (1000 - totalW) / 2
            const centers = []

            // Trace shapes characteristic of each auxiliary sensor.
            const trace = (i, u) => {
                if (i === 0) return Math.sin(u * 4.6 + 0.4) * 0.75 // slow ground wander
                if (i === 1)
                    return (
                        Math.sin(u * 42) *
                        Math.exp(-Math.pow((u - 0.55) / 0.1, 2))
                    ) // acoustic burst
                if (i === 2)
                    return -(
                        Math.exp(-Math.pow((u - 0.32) / 0.02, 2)) +
                        Math.exp(-Math.pow((u - 0.72) / 0.02, 2))
                    ) // magnetic glitches
                return (u - 0.5) * 1.7 + Math.sin(u * 11) * 0.16 // slow power drift
            }

            cards.forEach(([title, sub], i) => {
                const x = startX + i * (cardW + gap)
                const cx = x + cardW / 2
                centers.push(cx)
                svg.appendChild(
                    svgEl('rect', {
                        x,
                        y: cardY,
                        width: cardW,
                        height: cardH,
                        rx: 8,
                        fill: '#eef7fa',
                        stroke: '#00a5c8',
                        'stroke-width': 2,
                    })
                )
                addText(svg, cx, cardY + 26, title, 'viz-label')
                const px0 = x + 16
                const px1 = x + cardW - 16
                const pmy = cardY + 74
                const amp = 20
                let d = ''
                for (let k = 0; k <= 80; k++) {
                    const u = k / 80
                    const xx = px0 + u * (px1 - px0)
                    const yy = pmy - trace(i, u) * amp
                    d += `${k === 0 ? 'M' : 'L'}${xx.toFixed(1)},${yy.toFixed(1)} `
                }
                svg.appendChild(
                    svgEl('path', {
                        d,
                        fill: 'none',
                        stroke: '#00407a',
                        'stroke-width': 2.5,
                    })
                )
                addText(svg, cx, cardY + cardH - 10, sub, 'viz-small')
            })

            // Bus collecting the auxiliary channels, feeding the calibrated
            // data stage as the "+ context".
            const busY = 200
            const tapX = 796 // under the "calibrated data" box
            svg.appendChild(
                svgEl('line', {
                    x1: centers[0],
                    y1: busY,
                    x2: centers[centers.length - 1],
                    y2: busY,
                    stroke: '#8593a0',
                    'stroke-width': 2,
                })
            )
            centers.forEach((cx) => {
                svg.appendChild(
                    svgEl('line', {
                        x1: cx,
                        y1: busY,
                        x2: cx,
                        y2: cardY,
                        stroke: '#8593a0',
                        'stroke-width': 2,
                    })
                )
            })
            svg.appendChild(
                svgEl('line', {
                    x1: tapX,
                    y1: busY,
                    x2: tapX,
                    y2: 132,
                    stroke: '#8593a0',
                    'stroke-width': 2.5,
                    'marker-end': arrow,
                })
            )
            addText(svg, tapX + 12, 168, 'detector state', 'viz-small', 'start')

            addText(
                svg,
                500,
                380,
                'auxiliary channels witness the environment and instrument — the "+ context" on every strain sample',
                'viz-small'
            )
        },

        'noise-budget': function (frame) {
            // Einstein Telescope low-frequency (ET-LF) noise budget, recreated
            // after the ET Design Report / ET-D figure (as reproduced in
            // Koroveski et al. 2023, CC BY 4.0). The individual contributions
            // are analytic approximations of the published curves; the point is
            // the decomposition and where each source dominates.
            const svg = makeSvg(frame, '0 0 1000 520')
            const x0 = 92
            const x1 = 900
            const yb = 430
            const yt = 52
            const fMin = 1
            const fMax = 100
            const aMin = 3e-26
            const aMax = 3e-21
            const lg = Math.log10
            const X = (f) =>
                x0 + ((lg(f) - lg(fMin)) / (lg(fMax) - lg(fMin))) * (x1 - x0)
            const Y = (a) =>
                yb - ((lg(a) - lg(aMin)) / (lg(aMax) - lg(aMin))) * (yb - yt)

            const gauss = (f, fc, w) =>
                Math.exp(-Math.pow((Math.log(f) - Math.log(fc)) / w, 2))
            const comps = [
                {
                    label: 'Quantum',
                    color: '#a35fb0',
                    fn: (f) =>
                        Math.hypot(
                            2.2e-22 / (f * f),
                            3e-25 * Math.sqrt(f / 10)
                        ),
                },
                {
                    label: 'Seismic',
                    color: '#8a6d1f',
                    fn: (f) => 1e-24 * Math.pow(2.5 / f, 22),
                },
                {
                    label: 'Newtonian',
                    color: '#2e9e4f',
                    fn: (f) => 1.3e-21 * Math.pow(f, -4.0),
                },
                {
                    label: 'Suspension thermal',
                    color: '#3b5bd0',
                    fn: (f) =>
                        Math.hypot(
                            6e-22 * Math.pow(f, -2.3),
                            6e-25 * gauss(f, 13, 0.05) +
                                4e-25 * gauss(f, 26, 0.05) +
                                3e-25 * gauss(f, 41, 0.05)
                        ),
                },
                {
                    label: 'Mirror thermal',
                    color: '#c0392b',
                    fn: (f) => 1.0e-24 * Math.pow(f, -0.5),
                },
                { label: 'Excess gas', color: '#d1a400', fn: () => 8e-26 },
            ]
            const total = (f) =>
                Math.sqrt(comps.reduce((s, c) => s + Math.pow(c.fn(f), 2), 0))

            // Grid.
            const grid = svgEl('g', { stroke: '#e6ebf0', 'stroke-width': 1 })
            const xticks = [1, 2, 5, 10, 20, 50, 100]
            xticks.forEach((f) =>
                grid.appendChild(
                    svgEl('line', { x1: X(f), y1: yt, x2: X(f), y2: yb })
                )
            )
            const yticks = [1e-25, 1e-24, 1e-23, 1e-22, 1e-21]
            yticks.forEach((a) =>
                grid.appendChild(
                    svgEl('line', { x1: x0, y1: Y(a), x2: x1, y2: Y(a) })
                )
            )
            svg.appendChild(grid)

            // Axes + labels.
            svg.appendChild(
                svgEl('line', {
                    x1: x0,
                    y1: yb,
                    x2: x1,
                    y2: yb,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: x0,
                    y1: yt,
                    x2: x0,
                    y2: yb,
                    class: 'viz-axis',
                })
            )
            xticks.forEach((f) =>
                addText(svg, X(f), yb + 22, `${f}`, 'viz-small')
            )
            const sup = (e) =>
                `10${String(e)
                    .replace('-', '⁻')
                    .replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`
            yticks.forEach((a) =>
                addText(svg, x0 - 8, Y(a) + 4, sup(lg(a)), 'viz-small', 'end')
            )
            addText(svg, (x0 + x1) / 2, yb + 46, 'frequency (Hz)', 'viz-label')
            const yl = svgEl('text', {
                x: 22,
                y: (yt + yb) / 2,
                class: 'viz-label',
                'text-anchor': 'middle',
                transform: `rotate(-90 22 ${(yt + yb) / 2})`,
            })
            yl.textContent = 'strain noise ASD (1/√Hz)'
            svg.appendChild(yl)

            // Curves (clipped to the plot box).
            const clip = svgEl('clipPath', { id: 'nb-clip' })
            clip.appendChild(
                svgEl('rect', { x: x0, y: yt, width: x1 - x0, height: yb - yt })
            )
            const defs = svgEl('defs')
            defs.appendChild(clip)
            svg.appendChild(defs)
            const plot = svgEl('g', { 'clip-path': 'url(#nb-clip)' })
            const N = 300
            const pathFor = (fn) => {
                let d = ''
                for (let i = 0; i <= N; i++) {
                    const f = Math.pow(
                        10,
                        lg(fMin) + (i / N) * (lg(fMax) - lg(fMin))
                    )
                    d += `${i === 0 ? 'M' : 'L'}${X(f).toFixed(1)},${Y(fn(f)).toFixed(1)} `
                }
                return d
            }
            comps.forEach((c) =>
                plot.appendChild(
                    svgEl('path', {
                        d: pathFor(c.fn),
                        fill: 'none',
                        stroke: c.color,
                        'stroke-width': 2.3,
                        'stroke-dasharray': '7 5',
                        opacity: 0.9,
                    })
                )
            )
            plot.appendChild(
                svgEl('path', {
                    d: pathFor(total),
                    fill: 'none',
                    stroke: '#0b2138',
                    'stroke-width': 5,
                    'stroke-linejoin': 'round',
                })
            )
            svg.appendChild(plot)

            // Legend (top-right, where the plot is empty).
            const lx = x1 - 214
            let ly = yt + 20
            const legend = [
                ...comps,
                { label: 'ET-LF total', color: '#0b2138', total: true },
            ]
            svg.appendChild(
                svgEl('rect', {
                    x: lx - 14,
                    y: yt + 4,
                    width: 224,
                    height: legend.length * 21 + 12,
                    rx: 6,
                    fill: 'rgba(255,255,255,0.9)',
                    stroke: '#d9e0e7',
                    'stroke-width': 1,
                })
            )
            legend.forEach((c) => {
                svg.appendChild(
                    svgEl('line', {
                        x1: lx,
                        y1: ly - 4,
                        x2: lx + 30,
                        y2: ly - 4,
                        stroke: c.color,
                        'stroke-width': c.total ? 5 : 2.3,
                        'stroke-dasharray': c.total ? '0' : '7 5',
                    })
                )
                addText(svg, lx + 40, ly, c.label, 'viz-small', 'start')
                ly += 21
            })

            addText(
                svg,
                x0,
                yt - 20,
                'ET low-frequency noise budget — each source dominates a different band',
                'viz-small',
                'start'
            )
            addText(
                svg,
                x1,
                512,
                'recreated after ET Design Report (ET-D); curves per arXiv:2305.01419 (CC BY 4.0)',
                'viz-small',
                'end'
            )
        },

        'newtonian-noise': function (frame) {
            // Cross-section: a seismic/acoustic wave field propagates through
            // the ground; a seismometer array samples it; the SAME field pulls
            // the suspended test mass gravitationally — through the vacuum wall,
            // so it cannot be shielded, only modelled and subtracted.
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const groundY = h * 0.56
                const speed = 1.7
                const k = 6.5 / w // ~6-7 wavelengths across
                const amp = 7
                const phase = (x) => x * k * (2 * Math.PI) - t * speed
                const mx = w * 0.5 // test mass x

                // Ground fill.
                ctx.fillStyle = '#ece3d0'
                ctx.fillRect(0, groundY, w, h - groundY)
                // Propagating density field (columns modulated by the wave).
                for (let x = 0; x < w; x += 5) {
                    const dens = 0.5 + 0.5 * Math.sin(phase(x))
                    ctx.fillStyle = `rgba(0,88,140,${0.05 + 0.18 * dens})`
                    ctx.fillRect(x, groundY, 5, h - groundY)
                }
                // Wavefront lines at compression maxima, so the field reads as
                // propagating waves even in a still frame.
                const spacing = 1 / k
                const base = (Math.PI / 2 + t * speed) / (k * 2 * Math.PI)
                let n0 = Math.ceil((0 - base) / spacing)
                for (let xc = base + n0 * spacing; xc <= w; xc += spacing) {
                    ctx.strokeStyle = 'rgba(0,64,122,0.28)'
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.moveTo(xc, groundY)
                    ctx.lineTo(xc, h)
                    ctx.stroke()
                }

                // Ground surface (Rayleigh undulation).
                ctx.strokeStyle = '#a6875180'
                ctx.lineWidth = 3
                ctx.beginPath()
                for (let x = 0; x <= w; x += 4) {
                    const y = groundY + Math.sin(phase(x)) * amp
                    if (x === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()

                // Seismometer array on the surface.
                const nS = 9
                const ax0 = w * 0.06
                const ax1 = w * 0.94
                for (let i = 0; i < nS; i++) {
                    const sx = ax0 + ((ax1 - ax0) * i) / (nS - 1)
                    const surf = groundY + Math.sin(phase(sx)) * amp
                    ctx.fillStyle = '#00407a'
                    ctx.beginPath()
                    ctx.moveTo(sx, surf - 15)
                    ctx.lineTo(sx - 8, surf)
                    ctx.lineTo(sx + 8, surf)
                    ctx.closePath()
                    ctx.fill()
                    ctx.strokeStyle = '#f2a900'
                    ctx.lineWidth = 2
                    const wig = Math.sin(phase(sx)) * 4
                    ctx.beginPath()
                    ctx.moveTo(sx, surf - 15)
                    ctx.lineTo(sx + wig, surf - 27)
                    ctx.stroke()
                }
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 16px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(
                    'seismometer array — samples the wave field',
                    w * 0.5,
                    h - 16
                )
                ctx.fillStyle = '#7a6a4a'
                ctx.font = '15px Arial'
                ctx.textAlign = 'left'
                ctx.fillText('seismic / acoustic wave field', 14, groundY + 26)

                // Suspended test mass inside a vacuum chamber (top).
                const my = h * 0.2
                const dxm = Math.sin(phase(mx)) * 7 // Newtonian sway
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 2
                ctx.setLineDash([6, 5])
                ctx.strokeRect(mx - 66, my - 46, 132, 150)
                ctx.setLineDash([])
                ctx.fillStyle = '#5a6875'
                ctx.font = '13px Arial'
                ctx.textAlign = 'right'
                ctx.fillText('vacuum', mx + 60, my - 32)
                // suspension wires + mass
                ctx.strokeStyle = '#5a6875'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(mx - 24, my - 46)
                ctx.lineTo(mx - 14 + dxm, my + 30)
                ctx.moveTo(mx + 24, my - 46)
                ctx.lineTo(mx + 14 + dxm, my + 30)
                ctx.stroke()
                ctx.fillStyle = '#00407a'
                ctx.beginPath()
                ctx.arc(mx + dxm, my + 50, 24, 0, Math.PI * 2)
                ctx.fill()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 15px Arial'
                ctx.textAlign = 'center'
                ctx.fillText('test mass (in vacuum)', mx, my - 58)

                // Gravitational coupling: dashed arrow from a ground density
                // crest up to the mass, through the chamber wall.
                let crest = mx
                for (let d = 0; d < 120; d++) {
                    if (Math.sin(phase(mx - d)) > 0.98) {
                        crest = mx - d
                        break
                    }
                }
                ctx.strokeStyle = '#f2a900'
                ctx.lineWidth = 2.5
                ctx.setLineDash([8, 6])
                ctx.beginPath()
                ctx.moveTo(crest, groundY - 4)
                ctx.quadraticCurveTo(
                    (crest + mx) / 2 - 40,
                    (groundY + my) / 2,
                    mx + dxm - 22,
                    my + 50
                )
                ctx.stroke()
                ctx.setLineDash([])
                // force arrow on the mass
                ctx.strokeStyle = '#f2a900'
                ctx.fillStyle = '#f2a900'
                ctx.lineWidth = 3
                const fa = mx + dxm
                ctx.beginPath()
                ctx.moveTo(fa - 44, my + 50)
                ctx.lineTo(fa - 26, my + 50)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(fa - 26, my + 44)
                ctx.lineTo(fa - 16, my + 50)
                ctx.lineTo(fa - 26, my + 56)
                ctx.fill()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 16px Arial'
                ctx.textAlign = 'left'
                ctx.fillText(
                    'gravity reaches through the wall — cannot be shielded',
                    mx + 84,
                    my + 20
                )
            })
        },

        'calibration-band': function (frame) {
            // Real O3b calibration-uncertainty envelope (median +/- 1 sigma) in
            // amplitude and phase vs frequency. Data: js/calibration-data.js
            // (LVK GWTC-3 release, GW200322, Advanced LIGO Hanford).
            const svg = makeSvg(frame, '0 0 1000 230')
            const data = window.CALIBRATION_DATA
            if (!data) {
                addText(
                    svg,
                    500,
                    120,
                    'calibration data unavailable',
                    'viz-label'
                )
                return
            }
            const fL = data.fMin
            const fR = data.fMax
            const lg = Math.log10
            const niceMax = (pts) => {
                const m = Math.max(
                    ...pts.map((p) => Math.max(Math.abs(p.lo), Math.abs(p.hi)))
                )
                return Math.max(2, Math.ceil(m / 2) * 2)
            }

            const panel = (xL, xR, title, unit, pts, color) => {
                const yt = 48
                const yb = 176
                const ymid = (yt + yb) / 2
                const yMax = niceMax(pts)
                const sc = (yb - yt) / 2 / yMax
                const X = (f) =>
                    xL + ((lg(f) - lg(fL)) / (lg(fR) - lg(fL))) * (xR - xL)
                const Y = (v) => ymid - Math.max(-yMax, Math.min(yMax, v)) * sc

                // +/-1 sigma band.
                let d = ''
                pts.forEach((p, i) => {
                    d += `${i === 0 ? 'M' : 'L'}${X(p.f).toFixed(1)},${Y(p.hi).toFixed(1)} `
                })
                for (let i = pts.length - 1; i >= 0; i--) {
                    d += `L${X(pts[i].f).toFixed(1)},${Y(pts[i].lo).toFixed(1)} `
                }
                svg.appendChild(
                    svgEl('path', { d: d + 'Z', fill: color, opacity: 0.18 })
                )
                // zero line
                svg.appendChild(
                    svgEl('line', {
                        x1: xL,
                        y1: ymid,
                        x2: xR,
                        y2: ymid,
                        stroke: '#8593a0',
                        'stroke-width': 1.5,
                        'stroke-dasharray': '6 5',
                    })
                )
                // median systematic-error curve
                let s = ''
                pts.forEach((p, i) => {
                    s += `${i === 0 ? 'M' : 'L'}${X(p.f).toFixed(1)},${Y(p.med).toFixed(1)} `
                })
                svg.appendChild(
                    svgEl('path', {
                        d: s,
                        fill: 'none',
                        stroke: color,
                        'stroke-width': 3,
                    })
                )
                // axes + labels
                svg.appendChild(
                    svgEl('line', {
                        x1: xL,
                        y1: yt,
                        x2: xL,
                        y2: yb,
                        class: 'viz-axis',
                    })
                )
                svg.appendChild(
                    svgEl('line', {
                        x1: xL,
                        y1: yb,
                        x2: xR,
                        y2: yb,
                        class: 'viz-axis',
                    })
                )
                ;[20, 100, 1000, 3000].forEach((f) => {
                    if (f < fL || f > fR) return
                    addText(
                        svg,
                        X(f),
                        yb + 20,
                        f >= 1000 ? `${f / 1000}k` : `${f}`,
                        'viz-small'
                    )
                })
                addText(
                    svg,
                    xL - 8,
                    Y(yMax) + 5,
                    `+${yMax}`,
                    'viz-small',
                    'end'
                )
                addText(svg, xL - 8, ymid + 5, '0', 'viz-small', 'end')
                addText(
                    svg,
                    xL - 8,
                    Y(-yMax) + 5,
                    `−${yMax}`,
                    'viz-small',
                    'end'
                )
                addText(svg, (xL + xR) / 2, 26, title)
                addText(svg, xL + 6, yt - 6, unit, 'viz-small', 'start')
            }

            panel(86, 470, 'Amplitude error', '%', data.amp, '#00407a')
            panel(590, 962, 'Phase error', 'deg', data.phase, '#00a5c8')
            addText(
                svg,
                500,
                220,
                `frequency (Hz) — measured strain calibration uncertainty (median ±1σ), ${data.detector}`,
                'viz-small'
            )
        },

        'sensor-network': function (frame) {
            // A distributed network of environmental and control sensors around
            // the detector site feeds the detector-state / data-quality picture.
            const svg = makeSvg(frame, '0 0 1000 230')
            const C = {
                seismic: '#00a5c8',
                acoustic: '#00407a',
                magnetic: '#7b68ee',
                weather: '#f2a900',
            }
            const tri = (x, y, c) =>
                svg.appendChild(
                    svgEl('path', {
                        d: `M${x},${y - 9} L${x - 8},${y + 6} L${x + 8},${y + 6} Z`,
                        fill: c,
                    })
                )
            const circ = (x, y, c) =>
                svg.appendChild(
                    svgEl('circle', { cx: x, cy: y, r: 7, fill: c })
                )
            const sq = (x, y, c) =>
                svg.appendChild(
                    svgEl('rect', {
                        x: x - 7,
                        y: y - 7,
                        width: 14,
                        height: 14,
                        rx: 2,
                        fill: c,
                    })
                )
            const mast = (x, y, c) => {
                svg.appendChild(
                    svgEl('line', {
                        x1: x,
                        y1: y - 10,
                        x2: x,
                        y2: y + 8,
                        stroke: c,
                        'stroke-width': 2.5,
                    })
                )
                svg.appendChild(
                    svgEl('path', {
                        d: `M${x},${y - 10} L${x + 12},${y - 6} L${x},${y - 2} Z`,
                        fill: c,
                    })
                )
            }

            // Legend (top).
            const leg = [
                ['seismometer', C.seismic, tri],
                ['microphone', C.acoustic, circ],
                ['magnetometer', C.magnetic, sq],
                ['weather', C.weather, mast],
            ]
            let lx = 70
            leg.forEach(([label, c, fn]) => {
                fn(lx, 22, c)
                addText(svg, lx + 16, 27, label, 'viz-small', 'start')
                lx += label.length * 8.4 + 66
            })

            // Detector site enclosure.
            svg.appendChild(
                svgEl('rect', {
                    x: 40,
                    y: 46,
                    width: 628,
                    height: 168,
                    rx: 12,
                    fill: 'none',
                    stroke: '#c7d0da',
                    'stroke-width': 1.5,
                    'stroke-dasharray': '7 6',
                })
            )
            addText(svg, 54, 66, 'detector site', 'viz-small', 'start')

            // L-shaped interferometer (top view).
            const cx = 300
            const by = 184
            const rx = 590
            const ty = 84
            svg.appendChild(
                svgEl('path', {
                    d: `M${cx},${by} L${rx},${by} M${cx},${by} L${cx},${ty}`,
                    stroke: '#00407a',
                    'stroke-width': 9,
                    'stroke-linecap': 'round',
                })
            )
            ;[
                [cx, by],
                [rx, by],
                [cx, ty],
            ].forEach(([x, y]) =>
                svg.appendChild(
                    svgEl('rect', {
                        x: x - 9,
                        y: y - 9,
                        width: 18,
                        height: 18,
                        rx: 3,
                        fill: '#00407a',
                    })
                )
            )

            // Distributed sensors.
            tri(250, 202, C.seismic)
            tri(430, 202, C.seismic)
            tri(590, 205, C.seismic)
            tri(250, 130, C.seismic)
            circ(360, 90, C.acoustic)
            circ(590, 150, C.acoustic)
            sq(250, 168, C.magnetic)
            sq(470, 150, C.magnetic)
            mast(120, 150, C.weather)

            // Feed into detector state / data quality node.
            const arrow = addArrow(svg, 'netw-arrow')
            svg.appendChild(
                svgEl('line', {
                    x1: 662,
                    y1: 138,
                    x2: 704,
                    y2: 138,
                    stroke: '#00407a',
                    'stroke-width': 4,
                    'marker-end': arrow,
                })
            )
            const nodeCx = 838
            svg.appendChild(
                svgEl('rect', {
                    x: 708,
                    y: 100,
                    width: 260,
                    height: 78,
                    rx: 10,
                    fill: '#eef7fa',
                    stroke: '#00a5c8',
                    'stroke-width': 2,
                })
            )
            addText(svg, nodeCx, 126, 'detector state')
            addText(svg, nodeCx, 148, 'and data quality')
            addText(
                svg,
                nodeCx,
                169,
                'witness · veto · diagnostic',
                'viz-small'
            )
        },

        'strain-events': function (frame) {
            const svg = makeSvg(frame, '0 0 1000 420')
            const arrow = addArrow(svg, 'chain-arrow')
            const boxes = [
                [35, 150, 150, 80, 'strain', 'h(t)'],
                [230, 150, 150, 80, 'condition', 'clean + whiten'],
                [425, 150, 150, 80, 'search', 'coherence'],
                [620, 150, 150, 80, 'significance', 'FAR'],
                [815, 150, 150, 80, 'inference', 'parameters'],
            ]
            boxes.forEach((box, i) => {
                roundedRect(svg, ...box, i % 2 ? '#f2a900' : '#00a5c8')
                if (i < boxes.length - 1)
                    svg.appendChild(
                        svgEl('line', {
                            x1: box[0] + box[2] + 12,
                            y1: 190,
                            x2: boxes[i + 1][0] - 12,
                            y2: 190,
                            stroke: '#00407a',
                            'stroke-width': 4,
                            class: 'flow-line',
                            'marker-end': arrow,
                        })
                    )
            })
            // Illustrative compact-binary chirp time series (rising frequency
            // and amplitude to merger, then ringdown) — the strain being fed in.
            const cx0 = 60
            const cx1 = 940
            const cy = 322
            const camp = 48
            const uM = 0.82
            let ph = 0
            let d = ''
            const N = 520
            for (let i = 0; i <= N; i++) {
                const u = i / N
                let dstep, env
                if (u < uM) {
                    const s = u / uM
                    dstep = 0.03 + 0.45 * s * s
                    env = 0.16 + 0.84 * Math.pow(s, 0.85)
                } else {
                    const s = (u - uM) / (1 - uM)
                    dstep = 0.52
                    env = Math.exp(-5 * s)
                }
                ph += dstep
                const x = cx0 + u * (cx1 - cx0)
                const y = cy - Math.sin(ph) * camp * env
                d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
            }
            svg.appendChild(
                svgEl('path', {
                    d,
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 2.5,
                    'stroke-linejoin': 'round',
                    opacity: 0.8,
                })
            )
            addText(
                svg,
                cx0,
                cy + 62,
                'strain time series — compact-binary chirp',
                'viz-small',
                'start'
            )
        },

        'matched-filter': function (frame) {
            // A template slides through the two-detector strain; the genuine
            // matched-filter SNR rho(t) builds underneath, crosses threshold at
            // the injected signals, and drops coincident triggers. Real baked
            // search data (js/matched-filter-data.js). Loops.
            const data = window.MATCHED_FILTER_DATA
            startCanvas(frame, (ctx, w, h, time) => {
                ctx.clearRect(0, 0, w, h)
                if (!data) {
                    ctx.fillStyle = '#17212b'
                    ctx.font = '16px Arial'
                    ctx.textAlign = 'left'
                    ctx.fillText('matched-filter data unavailable', 40, 40)
                    return
                }
                const tMin = data.tMin
                const tMax = data.tMax
                const L = 70
                const R = 24
                const X = (tt) =>
                    L + ((tt - tMin) / (tMax - tMin)) * (w - R - L)

                // Scan cursor: sweep then briefly hold, then loop.
                const period = 8.0
                const scan = 6.2
                const u = Math.min(1, (time % period) / scan)
                const cursorT = tMin + u * (tMax - tMin)
                const cx = X(cursorT)

                const sx = data.strain.x
                const absMax = (a) =>
                    a.reduce((m, v) => Math.max(m, Math.abs(v)), 0)
                const m1 = absMax(data.strain.d1)
                const m2 = absMax(data.strain.d2)
                const yA = h * 0.15
                const yB = h * 0.34
                const sAmp = h * 0.055

                // A visible CBC chirp injected at each signal time so the
                // template can be seen locking onto a signal in the strain
                // (the real noise is dimmed to keep the chirp legible).
                const inj = (x, trigs) => {
                    let v = 0
                    trigs.forEach((tr, k) => {
                        const amp = k === 0 ? 0.85 : 0.55
                        const dur = 0.85
                        const s = (x - (tr.t - dur)) / dur
                        if (s > 0 && s <= 1) {
                            v +=
                                amp *
                                Math.pow(s, 1.15) *
                                Math.sin(2 * Math.PI * 8 * Math.pow(s, 2.5))
                        } else if (x > tr.t && x < tr.t + 0.12) {
                            const sd = (x - tr.t) / 0.03
                            v += amp * Math.exp(-sd) * Math.sin(60 * (x - tr.t))
                        }
                    })
                    return v
                }
                const drawStrain = (vals, m, base, color, trigs) => {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 1.6
                    ctx.beginPath()
                    for (let i = 0; i < sx.length; i++) {
                        const x = X(sx[i])
                        const drawn =
                            ((vals[i] / m) * 0.5 + inj(sx[i], trigs)) * sAmp
                        const y = base - drawn
                        if (i === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                }
                drawStrain(data.strain.d1, m1, yA, '#00407a', data.triggers.d1)
                drawStrain(data.strain.d2, m2, yB, '#00a5c8', data.triggers.d2)
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 14px Arial'
                ctx.textAlign = 'left'
                ctx.fillText('Detector A — strain', L, yA - sAmp - 12)
                ctx.fillText('Detector B — strain', L, yB - sAmp - 12)
                ctx.textAlign = 'right'
                ctx.fillStyle = '#8593a0'
                ctx.font = '12px Arial'
                ctx.fillText(
                    'real ET-noise search · genuine MF SNR(t)',
                    w - R,
                    15
                )

                // Sliding template: a clean compact-binary chirp glyph (rising
                // frequency and amplitude to merger, then ringdown).
                const tw = 80
                const gN = 130
                let gph = 0
                ctx.strokeStyle = '#f2a900'
                ctx.lineWidth = 2.2
                ctx.beginPath()
                for (let i = 0; i <= gN; i++) {
                    const s = i / gN
                    gph += 0.05 + 0.85 * Math.pow(s, 2.3)
                    const env =
                        s < 0.88
                            ? 0.15 + 0.85 * Math.pow(s / 0.88, 1.2)
                            : Math.exp(-(s - 0.88) / 0.05)
                    const x = cx - tw / 2 + s * tw
                    const y = yA - Math.sin(gph) * sAmp * 1.15 * env
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()

                // SNR panel.
                const RHO = 10
                const r0 = h * 0.9
                const rTop = h * 0.52
                const Y = (rho) => r0 - (Math.min(rho, RHO) / RHO) * (r0 - rTop)
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.3
                ctx.beginPath()
                ctx.moveTo(L, r0)
                ctx.lineTo(w - R, r0)
                ctx.stroke()
                const thrY = Y(data.thr)
                ctx.strokeStyle = '#8a96a3'
                ctx.setLineDash([7, 5])
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(L, thrY)
                ctx.lineTo(w - R, thrY)
                ctx.stroke()
                ctx.setLineDash([])
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 12px Arial'
                ctx.textAlign = 'left'
                ctx.fillText(`threshold ρ = ${data.thr}`, L + 4, thrY - 6)
                ctx.fillText('matched-filter SNR  ρ(t)', L, rTop - 6)

                const rt = data.rho.t
                const drawRho = (vals, color) => {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 2.4
                    ctx.beginPath()
                    let started = false
                    for (let i = 0; i < rt.length; i++) {
                        if (rt[i] > cursorT) break
                        const x = X(rt[i])
                        const y = Y(vals[i])
                        if (!started) {
                            ctx.moveTo(x, y)
                            started = true
                        } else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                }
                drawRho(data.rho.d1, '#00407a')
                drawRho(data.rho.d2, '#00a5c8')

                const rhoAt = (vals, tt) => {
                    if (tt <= rt[0]) return vals[0]
                    if (tt >= rt[rt.length - 1]) return vals[vals.length - 1]
                    let i = 1
                    while (i < rt.length && rt[i] < tt) i++
                    const f = (tt - rt[i - 1]) / (rt[i] - rt[i - 1])
                    return vals[i - 1] + f * (vals[i] - vals[i - 1])
                }
                const drawTrig = (list, vals, color) => {
                    list.forEach((tr) => {
                        if (tr.t > cursorT) return
                        const x = X(tr.t)
                        const y = Y(rhoAt(vals, tr.t))
                        ctx.fillStyle = color
                        ctx.beginPath()
                        ctx.arc(x, y, 5, 0, Math.PI * 2)
                        ctx.fill()
                        ctx.fillStyle = '#17212b'
                        ctx.font = '700 12px Arial'
                        ctx.textAlign = 'center'
                        ctx.fillText(`ℳc ${tr.mc}`, x, y - 10)
                    })
                }
                drawTrig(data.triggers.d1, data.rho.d1, '#00407a')
                drawTrig(data.triggers.d2, data.rho.d2, '#00a5c8')

                // Coincidence highlight for the loud trigger present in both.
                const tc = data.triggers.d1[0].t
                if (cursorT >= tc) {
                    const x = X(tc)
                    ctx.strokeStyle = '#f2a900'
                    ctx.lineWidth = 2
                    ctx.setLineDash([4, 4])
                    ctx.beginPath()
                    ctx.moveTo(x, rTop)
                    ctx.lineTo(x, r0)
                    ctx.stroke()
                    ctx.setLineDash([])
                    ctx.fillStyle = '#c99000'
                    ctx.font = '700 13px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText('coincident', x, rTop - 22)
                }

                // Scan cursor across all panels.
                ctx.strokeStyle = 'rgba(90,104,117,0.45)'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(cx, yA - sAmp - 22)
                ctx.lineTo(cx, r0)
                ctx.stroke()

                ctx.fillStyle = '#5a6875'
                ctx.font = '13px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(
                    'gold: template sliding through the strain — SNR peaks, crosses threshold, coincident triggers',
                    w / 2,
                    h - 6
                )
            })
        },

        'time-slide': function (frame) {
            // Time-slide background estimation (after the ET null-stream deck):
            // at zero lag the real signal coincides (foreground); shifting one
            // detector by unphysical offsets destroys it, so any coincidence is
            // a signal-free background event. Repeating over many slides builds
            // a huge synthetic background → the accidental ρ distribution / FAR.
            const rng = (s) => () => {
                s = (s + 0x6d2b79f5) | 0
                let t = Math.imul(s ^ (s >>> 15), 1 | s)
                t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296
            }
            const tMin = 0.2
            const tMax = 6.0
            const span = tMax - tMin
            const win = 0.12
            const sigT = 3.0
            const R = rng(20260617)
            const train = (n, sigRho) => {
                const tr = []
                for (let i = 0; i < n; i++)
                    tr.push({
                        t: tMin + 0.15 + R() * (span - 0.3),
                        rho: 3 + R() * 3,
                    })
                tr.push({ t: sigT, rho: sigRho, sig: true })
                return tr
            }
            const d1 = train(9, 10.2)
            const d2 = train(9, 9.4)
            const shift = (t, dt) =>
                tMin + ((((t - tMin + dt) % span) + span) % span)

            const Nslides = 30
            const offs = [0]
            for (let k = 1; k < Nslides; k++)
                offs.push(0.5 + ((k * 0.53) % (span - 1.0)))
            // accidental network SNR per slide (k>=1)
            const acc = []
            for (let k = 1; k < Nslides; k++) {
                const list = []
                d1.forEach((a) =>
                    d2.forEach((b) => {
                        if (Math.abs(a.t - shift(b.t, offs[k])) < win)
                            list.push(Math.hypot(a.rho, b.rho))
                    })
                )
                acc.push(list)
            }
            const NB = 11
            const rLo = 4
            const rHi = 15
            const bin = (r) =>
                Math.max(
                    0,
                    Math.min(NB - 1, Math.floor(((r - rLo) / (rHi - rLo)) * NB))
                )
            // per-slide durations (long hold on the zero-lag foreground)
            const dur = offs.map((_, k) => (k === 0 ? 1.5 : 0.3))
            const cum = [0]
            dur.forEach((d) => cum.push(cum[cum.length - 1] + d))
            const P = cum[cum.length - 1] + 0.8 // + reset pause

            startCanvas(frame, (ctx, w, h, time) => {
                ctx.clearRect(0, 0, w, h)
                const et = time % P
                let k = 0
                while (k < Nslides - 1 && et >= cum[k + 1]) k++
                const dt = offs[k]

                const xL = 70
                const xM = w * 0.58
                const y1 = h * 0.3
                const y2 = h * 0.56
                const maxTick = h * 0.17
                const X = (t) => xL + ((t - tMin) / (tMax - tMin)) * (xM - xL)
                const tickH = (r) =>
                    Math.max(6, (Math.min(r, 12) / 12) * maxTick)

                // baselines + labels
                ctx.strokeStyle = '#cfd8e3'
                ctx.lineWidth = 1.5
                ;[y1, y2].forEach((y) => {
                    ctx.beginPath()
                    ctx.moveTo(xL, y)
                    ctx.lineTo(xM, y)
                    ctx.stroke()
                })
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 14px Arial'
                ctx.textAlign = 'left'
                ctx.fillText('Detector 1', xL, y1 - maxTick - 6)
                ctx.fillText(
                    k === 0 ? 'Detector 2' : `Detector 2  (shifted Δt)`,
                    xL,
                    y2 + 22
                )

                const tick = (t, rho, base, color) => {
                    const hgt = tickH(rho)
                    ctx.fillStyle = color
                    ctx.fillRect(X(t) - 2, base - hgt, 4, hgt)
                }
                d1.forEach((tr) =>
                    tick(tr.t, tr.rho, y1, tr.sig ? '#f2a900' : '#00407a')
                )
                d2.forEach((tr) =>
                    tick(
                        shift(tr.t, dt),
                        tr.rho,
                        y2,
                        tr.sig ? '#f2a900' : '#00a5c8'
                    )
                )

                // coincidences
                if (k === 0) {
                    const x = X(sigT)
                    ctx.strokeStyle = '#2e9e4f'
                    ctx.lineWidth = 2.6
                    ctx.beginPath()
                    ctx.moveTo(x, y1)
                    ctx.lineTo(x, y2)
                    ctx.stroke()
                    ctx.fillStyle = '#2e9e4f'
                    ctx.beginPath()
                    ctx.arc(x, (y1 + y2) / 2, 11, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = '#fff'
                    ctx.font = '700 14px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText('✓', x, (y1 + y2) / 2 + 5)
                    ctx.fillStyle = '#2e9e4f'
                    ctx.font = '700 14px Arial'
                    ctx.fillText(
                        'zero lag — the real signal coincides (foreground candidate)',
                        (xL + xM) / 2,
                        y2 + 48
                    )
                } else {
                    d1.forEach((a) =>
                        d2.forEach((b) => {
                            if (Math.abs(a.t - shift(b.t, dt)) < win) {
                                const x = X(a.t)
                                ctx.strokeStyle = '#f2a900'
                                ctx.setLineDash([3, 3])
                                ctx.lineWidth = 2
                                ctx.beginPath()
                                ctx.moveTo(x, y1)
                                ctx.lineTo(x, y2)
                                ctx.stroke()
                                ctx.setLineDash([])
                                ctx.fillStyle = '#f2a900'
                                ctx.beginPath()
                                ctx.arc(x, (y1 + y2) / 2, 6, 0, Math.PI * 2)
                                ctx.fill()
                            }
                        })
                    )
                    ctx.fillStyle = '#5a6875'
                    ctx.font = '700 14px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText(
                        'unphysical shift → real coincidence gone; chance alignments are signal-free background',
                        (xL + xM) / 2,
                        y2 + 48
                    )
                }

                // counter
                ctx.textAlign = 'left'
                ctx.font = '700 16px Arial'
                ctx.fillStyle = '#17212b'
                if (k === 0) {
                    ctx.fillText('foreground (zero lag)', w * 0.64, h * 0.16)
                } else {
                    ctx.fillText(
                        `background: ${k} slide${k > 1 ? 's' : ''} ≈ ${k} yr`,
                        w * 0.64,
                        h * 0.16
                    )
                    ctx.fillStyle = '#8593a0'
                    ctx.font = '13px Arial'
                    ctx.fillText(
                        '… × 800 slides ≈ 800 yr',
                        w * 0.64,
                        h * 0.16 + 20
                    )
                }

                // accumulated accidental-SNR histogram (FAR)
                const bins = new Array(NB).fill(0)
                for (let j = 1; j <= k; j++)
                    acc[j - 1].forEach((r) => bins[bin(r)]++)
                const hx0 = w * 0.64
                const hx1 = w - 34
                const hyB = h * 0.82
                const hyT = h * 0.36
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.3
                ctx.beginPath()
                ctx.moveTo(hx0, hyB)
                ctx.lineTo(hx1, hyB)
                ctx.moveTo(hx0, hyB)
                ctx.lineTo(hx0, hyT)
                ctx.stroke()
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 13px Arial'
                ctx.textAlign = 'left'
                ctx.fillText(
                    'accidental ρ_net → false-alarm rate',
                    hx0,
                    hyT - 8
                )
                ctx.textAlign = 'center'
                ctx.fillText('ρ_net', (hx0 + hx1) / 2, hyB + 22)
                const maxB = Math.max(6, ...bins)
                const bw = (hx1 - hx0) / NB
                for (let i = 0; i < NB; i++) {
                    if (!bins[i]) continue
                    const bh = (bins[i] / maxB) * (hyB - hyT)
                    ctx.fillStyle = i >= 7 ? '#f2a900' : '#00a5c8'
                    ctx.fillRect(hx0 + i * bw + 3, hyB - bh, bw - 6, bh)
                }

                // scan/loop hint caption
                ctx.fillStyle = '#8593a0'
                ctx.font = '13px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(
                    'each slide is signal-free by construction — the accidental rate is measured, not assumed',
                    w * 0.29,
                    h - 8
                )
            })
        },

        'real-time': function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const pad = Math.max(36, w * 0.045)
                const leftW = w * 0.54
                const x0 = pad
                const x1 = leftW
                const yTop = h * 0.17
                const yMid = h * 0.42
                const yBot = h * 0.7
                const progress = (Math.sin(t * 0.55) + 1) / 2
                const readout = 0.16 + 0.76 * progress
                const nowX = x0 + readout * (x1 - x0)

                ctx.fillStyle = '#17212b'
                ctx.font = '700 20px Arial'
                ctx.textAlign = 'left'
                ctx.fillText('streaming detector data', x0, yTop - 42)

                ctx.strokeStyle = '#cfd8e3'
                ctx.lineWidth = 1.4
                ;[yTop, yMid, yBot].forEach((y) => {
                    ctx.beginPath()
                    ctx.moveTo(x0, y)
                    ctx.lineTo(x1, y)
                    ctx.stroke()
                })

                const drawWave = (y, color, ampScale, phase) => {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    for (let i = 0; i <= 260; i++) {
                        const u = i / 260
                        const x = x0 + u * (x1 - x0)
                        const envelope = Math.pow(u, 2.2)
                        const noisy =
                            Math.sin(i * 0.48 + phase) * 5 +
                            Math.sin(i * 0.17 + phase * 0.7) * 3
                        const chirp =
                            Math.sin(18 * u + 90 * u * u + phase) *
                            ampScale *
                            envelope
                        const yy = y + noisy + chirp
                        if (i === 0) ctx.moveTo(x, yy)
                        else ctx.lineTo(x, yy)
                    }
                    ctx.stroke()
                }
                drawWave(yTop, '#00a5c8', 28, t * 2.0)
                drawWave(yMid, '#00407a', 34, t * 2.15)

                ctx.strokeStyle = '#f2a900'
                ctx.lineWidth = 4
                ctx.beginPath()
                for (let i = 0; i <= 220; i++) {
                    const u = i / 220
                    const x = x0 + u * (x1 - x0)
                    const snr = 0.06 + 0.82 / (1 + Math.exp(-10 * (u - 0.58)))
                    const yy = yBot - snr * h * 0.18
                    if (i === 0) ctx.moveTo(x, yy)
                    else ctx.lineTo(x, yy)
                }
                ctx.stroke()

                const thresholdY = yBot - h * 0.105
                ctx.strokeStyle = '#8a96a3'
                ctx.setLineDash([8, 8])
                ctx.beginPath()
                ctx.moveTo(x0, thresholdY)
                ctx.lineTo(x1, thresholdY)
                ctx.stroke()
                ctx.setLineDash([])
                ctx.fillStyle = '#5a6875'
                ctx.font = '700 15px Arial'
                ctx.fillText('alert threshold', x0 + 10, thresholdY - 10)

                ctx.strokeStyle = '#17212b'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(nowX, yTop - 28)
                ctx.lineTo(nowX, yBot + 28)
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 16px Arial'
                ctx.textAlign = 'center'
                ctx.fillText('now', nowX, yBot + 56)

                ctx.fillStyle = '#5a6875'
                ctx.textAlign = 'left'
                ctx.font = '700 16px Arial'
                ctx.fillText('Hanford', x0, yTop + 36)
                ctx.fillText('Livingston', x0, yMid + 36)
                ctx.fillText('network SNR', x0, yBot + 36)

                const rightX = w * 0.66
                const skyCx = rightX + w * 0.13
                const skyCy = h * 0.29
                const wideRx = w * 0.145
                const wideRy = h * 0.13
                const smallRx = wideRx * (0.68 - 0.42 * progress)
                const smallRy = wideRy * (0.68 - 0.42 * progress)

                ctx.fillStyle = '#17212b'
                ctx.font = '700 20px Arial'
                ctx.textAlign = 'center'
                ctx.fillText('localization becomes useful', skyCx, yTop - 42)

                ctx.fillStyle = 'rgba(242, 169, 0, 0.16)'
                ctx.strokeStyle = '#f2a900'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.ellipse(skyCx, skyCy, wideRx, wideRy, -0.25, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()
                ctx.fillStyle = 'rgba(0, 165, 200, 0.2)'
                ctx.strokeStyle = '#00a5c8'
                ctx.beginPath()
                ctx.ellipse(
                    skyCx,
                    skyCy,
                    smallRx,
                    smallRy,
                    -0.25,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
                ctx.stroke()
                ctx.fillStyle = '#00407a'
                ctx.beginPath()
                ctx.arc(
                    skyCx + smallRx * 0.25,
                    skyCy - smallRy * 0.2,
                    6,
                    0,
                    Math.PI * 2
                )
                ctx.fill()

                ctx.fillStyle = '#5a6875'
                ctx.font = '700 15px Arial'
                ctx.fillText('large area early', skyCx, skyCy + wideRy + 28)
                ctx.fillStyle = '#17212b'
                ctx.font = '700 18px Arial'
                const area = Math.round(900 - 760 * progress)
                ctx.fillText(
                    `sky map: ~${area} deg2`,
                    skyCx,
                    skyCy + wideRy + 58
                )

                const alertY = h * 0.68
                const boxes = [
                    ['evidence', 'rising SNR'],
                    ['alert', 'sky map'],
                    ['observe', 'point telescopes'],
                ]
                boxes.forEach(([label, sub], i) => {
                    const bx = rightX + i * w * 0.11
                    const active = readout > 0.32 + i * 0.19
                    ctx.fillStyle = active ? '#00407a' : '#ffffff'
                    ctx.strokeStyle = active ? '#00407a' : '#cfd8e3'
                    ctx.lineWidth = 2.5
                    ctx.beginPath()
                    ctx.roundRect(bx, alertY, w * 0.095, h * 0.1, 8)
                    ctx.fill()
                    ctx.stroke()
                    ctx.fillStyle = active ? '#ffffff' : '#17212b'
                    ctx.font = '700 15px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText(label, bx + w * 0.0475, alertY + h * 0.04)
                    ctx.font = '12px Arial'
                    ctx.fillText(sub, bx + w * 0.0475, alertY + h * 0.073)
                })

                ctx.fillStyle = '#17212b'
                ctx.font = '700 18px Arial'
                ctx.fillText(
                    'message: earlier detection buys observing time',
                    w * 0.5,
                    h - 40
                )
            })
        },

        overlap: function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const x0 = 85
                const x1 = w - 65
                const y0 = h - 65
                const y1 = 60
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(x0, y0)
                ctx.lineTo(x1, y0)
                ctx.moveTo(x0, y0)
                ctx.lineTo(x0, y1)
                ctx.stroke()
                const colors = [
                    '#00a5c8',
                    '#00407a',
                    '#f2a900',
                    '#7b68ee',
                    '#5a6875',
                ]
                for (let k = 0; k < 9; k++) {
                    const start = (k * 0.11 + t * 0.015) % 0.9
                    ctx.strokeStyle = colors[k % colors.length]
                    ctx.globalAlpha = 0.75
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    for (let i = 0; i < 90; i++) {
                        const u = i / 89
                        const x = x0 + (start + u * 0.22) * (x1 - x0)
                        const y =
                            y0 -
                            (0.1 + Math.pow(u, 2.4) * 0.75 + (k % 3) * 0.04) *
                                (y0 - y1)
                        if (i === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.globalAlpha = 1
                }
                ctx.fillStyle = '#17212b'
                ctx.font = '700 22px Arial'
                ctx.fillText('a crowded time-frequency plane', w * 0.37, 42)
            })
        },

        'detector-generations': function (frame) {
            // Chirp track produced with pycbc (js/gw-chirp-data.js). If that
            // module is unavailable, fall back to the Newtonian chirp time
            // t(f) = 2.18 s * (1.21/Mc)^(5/3) * (100/f)^(8/3) for the same BNS.
            const data =
                window.GW_CHIRP_DATA ||
                (function () {
                    const Mc = 1.22
                    const tof = (f) =>
                        2.18 *
                        Math.pow(1.21 / Mc, 5 / 3) *
                        Math.pow(100 / f, 8 / 3)
                    const track = []
                    const N = 90
                    for (let i = 0; i < N; i++) {
                        const f = 2 * Math.pow(500 / 2, i / (N - 1))
                        track.push({ f, t: tof(f) })
                    }
                    return {
                        source: 'BNS 1.4+1.4 Msun inspiral, Newtonian (fallback)',
                        track,
                        bands: {
                            current: { f_low: 20, t: tof(20) },
                            et: { f_low: 3, t: tof(3) },
                        },
                    }
                })()

            const track = data.track
            const cur = data.bands.current
            const et = data.bands.et
            const tMax = 100000
            const tMin = 0.03
            const fMin = 2
            const fMax = 600
            const lg = Math.log10
            const tSpan = lg(tMax) - lg(tMin)
            const fSpan = lg(fMax) - lg(fMin)

            function fmtDur(s) {
                if (s >= 3600) return (s / 3600).toFixed(1) + ' h'
                if (s >= 60) return (s / 60).toFixed(1) + ' min'
                return s.toFixed(1) + ' s'
            }

            startCanvas(frame, (ctx, w, h, time) => {
                ctx.clearRect(0, 0, w, h)
                const x0 = 66
                const x1 = w - 214
                const yTop = 54
                const yBot = h - 52
                const X = (t) =>
                    x0 +
                    ((lg(tMax) - lg(Math.max(tMin, Math.min(tMax, t)))) /
                        tSpan) *
                        (x1 - x0)
                const Y = (f) =>
                    yBot -
                    ((lg(Math.max(fMin, Math.min(fMax, f))) - lg(fMin)) /
                        fSpan) *
                        (yBot - yTop)

                // Grid + frequency ticks.
                ctx.textAlign = 'right'
                ctx.font = '13px Arial'
                ;[2, 5, 10, 20, 50, 100, 200, 500].forEach((f) => {
                    const y = Y(f)
                    ctx.strokeStyle = '#eaeef2'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(x0, y)
                    ctx.lineTo(x1, y)
                    ctx.stroke()
                    ctx.fillStyle = '#5a6875'
                    ctx.fillText(f, x0 - 8, y + 4)
                })
                // Time ticks.
                ctx.textAlign = 'center'
                ;[
                    [1, '1 s'],
                    [10, '10 s'],
                    [60, '1 min'],
                    [600, '10 min'],
                    [3600, '1 h'],
                    [36000, '10 h'],
                ].forEach(([t, l]) => {
                    const x = X(t)
                    ctx.strokeStyle = '#eaeef2'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(x, yTop)
                    ctx.lineTo(x, yBot)
                    ctx.stroke()
                    ctx.fillStyle = '#5a6875'
                    ctx.fillText(l, x, yBot + 20)
                })

                // Axes.
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(x0, yTop)
                ctx.lineTo(x0, yBot)
                ctx.lineTo(x1, yBot)
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 14px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(
                    'time before merger  (merger →)',
                    (x0 + x1) / 2,
                    yBot + 40
                )
                ctx.save()
                ctx.translate(20, (yTop + yBot) / 2)
                ctx.rotate(-Math.PI / 2)
                ctx.fillText('GW frequency (Hz)', 0, 0)
                ctx.restore()

                function drawTrack(fLo, fHi, color, width) {
                    ctx.strokeStyle = color
                    ctx.lineWidth = width
                    ctx.beginPath()
                    let started = false
                    for (const p of track) {
                        if (p.f < fLo || p.f > fHi) continue
                        const x = X(p.t)
                        const y = Y(p.f)
                        if (!started) {
                            ctx.moveTo(x, y)
                            started = true
                        } else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                }
                // Extra early inspiral ET gains (cyan) then the segment current
                // detectors already see (dark blue).
                drawTrack(et.f_low, cur.f_low, '#00a5c8', 5)
                drawTrack(cur.f_low, fMax, '#00407a', 5)

                // Frequency walls + entry markers.
                function wall(band, color) {
                    const y = Y(band.f_low)
                    ctx.strokeStyle = color
                    ctx.lineWidth = 2
                    ctx.setLineDash([7, 6])
                    ctx.beginPath()
                    ctx.moveTo(x0, y)
                    ctx.lineTo(x1, y)
                    ctx.stroke()
                    ctx.setLineDash([])
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(X(band.t), y, 6, 0, Math.PI * 2)
                    ctx.fill()
                }
                wall(cur, '#00407a')
                wall(et, '#00a5c8')

                // Traveling dot sweeping the inspiral toward merger.
                const prog = (time * 0.12) % 1
                const idx = Math.min(
                    track.length - 1,
                    Math.floor(prog * (track.length - 1))
                )
                const dp = track[idx]
                ctx.fillStyle =
                    dp.f >= cur.f_low
                        ? '#00407a'
                        : dp.f >= et.f_low
                          ? '#00a5c8'
                          : '#8593a0'
                ctx.beginPath()
                ctx.arc(X(dp.t), Y(dp.f), 7, 0, Math.PI * 2)
                ctx.fill()

                // Title.
                ctx.textAlign = 'left'
                ctx.fillStyle = '#17212b'
                ctx.font = '700 19px Arial'
                ctx.fillText(
                    'Lower frequency reach → the same inspiral is heard far earlier',
                    x0,
                    28
                )

                // Legend / message panel.
                const lx = x1 + 18
                ctx.textAlign = 'left'
                const swatch = (y, color) => {
                    ctx.fillStyle = color
                    ctx.fillRect(lx, y - 11, 14, 14)
                }
                swatch(yTop + 24, '#00407a')
                ctx.fillStyle = '#00407a'
                ctx.font = '700 15px Arial'
                ctx.fillText('Current detectors', lx + 20, yTop + 24)
                ctx.fillStyle = '#5a6875'
                ctx.font = '13px Arial'
                ctx.fillText('f ≥ ' + cur.f_low + ' Hz', lx + 20, yTop + 44)
                ctx.fillStyle = '#17212b'
                ctx.font = '700 15px Arial'
                ctx.fillText(
                    fmtDur(cur.t) + ' before merger',
                    lx + 20,
                    yTop + 64
                )

                swatch(yTop + 104, '#00a5c8')
                ctx.fillStyle = '#00a5c8'
                ctx.font = '700 15px Arial'
                ctx.fillText('Einstein Telescope', lx + 20, yTop + 104)
                ctx.fillStyle = '#5a6875'
                ctx.font = '13px Arial'
                ctx.fillText('f ≥ ' + et.f_low + ' Hz', lx + 20, yTop + 124)
                ctx.fillStyle = '#17212b'
                ctx.font = '700 15px Arial'
                ctx.fillText(
                    fmtDur(et.t) + ' before merger',
                    lx + 20,
                    yTop + 144
                )

                const ratio = Math.round(et.t / cur.t)
                ctx.fillStyle = '#f2a900'
                ctx.font = '700 24px Arial'
                ctx.fillText('~' + ratio + '× longer', lx, yTop + 188)
                ctx.fillStyle = '#5a6875'
                ctx.font = '13px Arial'
                ctx.fillText('longer + more frequent', lx, yTop + 212)
                ctx.fillText('→ overlapping signals', lx, yTop + 230)
            })
        },

        contributions: function (frame) {
            const svg = makeSvg(frame, '0 0 1000 420')
            svg.appendChild(
                svgEl('circle', {
                    cx: 500,
                    cy: 205,
                    r: 82,
                    fill: '#00407a',
                    opacity: 0.95,
                })
            )
            svg.appendChild(
                svgEl(
                    'text',
                    {
                        x: 500,
                        y: 198,
                        fill: '#ffffff',
                        'font-family': 'Arial, Helvetica, sans-serif',
                        'font-size': 23,
                        'font-weight': 700,
                        'text-anchor': 'middle',
                    },
                    'ET'
                )
            )
            svg.appendChild(
                svgEl(
                    'text',
                    {
                        x: 500,
                        y: 225,
                        fill: '#d8e6ec',
                        'font-family': 'Arial, Helvetica, sans-serif',
                        'font-size': 15,
                        'text-anchor': 'middle',
                    },
                    'challenge'
                )
            )
            const nodes = [
                [170, 95, 'waves + arrays', 'environmental fields'],
                [830, 95, 'signal processing', 'filtering + detection'],
                [170, 320, 'data analysis', 'scalable inference'],
                [830, 320, 'trustworthy AI', 'calibrated acceleration'],
            ]
            nodes.forEach(([x, y, label, sub], i) => {
                roundedRect(
                    svg,
                    x - 130,
                    y - 45,
                    260,
                    90,
                    label,
                    sub,
                    i % 2 ? '#f2a900' : '#00a5c8'
                )
                svg.appendChild(
                    svgEl('line', {
                        x1: x < 500 ? x + 135 : x - 135,
                        y1: y,
                        x2: x < 500 ? 425 : 575,
                        y2: 205,
                        stroke: '#00407a',
                        'stroke-width': 3,
                        class: 'flow-line',
                    })
                )
            })
        },
    }

    function renderAll() {
        document.querySelectorAll('[data-viz]').forEach((frame) => {
            const name = frame.getAttribute('data-viz')
            if (!frame.dataset.rendered && renderers[name]) {
                renderers[name](frame)
                frame.dataset.rendered = 'true'
            }
        })
    }

    Reveal.addEventListener('ready', renderAll)
    Reveal.addEventListener('slidechanged', renderAll)
})()
