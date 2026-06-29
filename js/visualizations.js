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
            const rect = frame.getBoundingClientRect()
            canvas.width = Math.max(1, Math.floor(rect.width * dpr))
            canvas.height = Math.max(1, Math.floor(rect.height * dpr))
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        let raf = 0
        const loop = (t) => {
            resize()
            const rect = frame.getBoundingClientRect()
            draw(ctx, rect.width, rect.height, t / 1000)
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
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const cx = w * 0.34
                const cy = h * 0.5
                const baseR = Math.min(w * 0.17, h * 0.35)
                const phase = t * 2.4
                const amp = Math.sin(phase) * 0.18

                const waveX = ((t * 95) % (w + 260)) - 130
                const gradient = ctx.createLinearGradient(
                    waveX - 110,
                    0,
                    waveX + 110,
                    0
                )
                gradient.addColorStop(0, 'rgba(0, 165, 200, 0)')
                gradient.addColorStop(0.5, 'rgba(0, 165, 200, 0.16)')
                gradient.addColorStop(1, 'rgba(0, 165, 200, 0)')
                ctx.fillStyle = gradient
                ctx.fillRect(waveX - 110, 0, 220, h)
                ctx.fillStyle = '#00a5c8'
                ctx.font = '700 20px Arial'
                ctx.textAlign = 'center'
                ctx.fillText('passing wave', 132, 42)

                ctx.strokeStyle = '#d9e0e7'
                ctx.lineWidth = 1
                for (let i = -6; i <= 6; i++) {
                    const dx = i * baseR * 0.25 * (1 + amp)
                    const dy = i * baseR * 0.19 * (1 - amp)
                    ctx.beginPath()
                    ctx.moveTo(cx + dx, cy - baseR * 1.42)
                    ctx.lineTo(cx + dx, cy + baseR * 1.42)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(cx - baseR * 1.75, cy + dy)
                    ctx.lineTo(cx + baseR * 1.75, cy + dy)
                    ctx.stroke()
                }

                const rx = baseR * (1 + amp)
                const ry = baseR * (1 - amp)
                ctx.strokeStyle = '#00407a'
                ctx.lineWidth = 6
                ctx.beginPath()
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
                ctx.stroke()

                for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                    const x = cx + Math.cos(a) * rx
                    const y = cy + Math.sin(a) * ry
                    ctx.fillStyle = '#00a5c8'
                    ctx.beginPath()
                    ctx.arc(x, y, 10, 0, Math.PI * 2)
                    ctx.fill()
                }

                function arrow(x1, y1, x2, y2, color) {
                    const angle = Math.atan2(y2 - y1, x2 - x1)
                    ctx.strokeStyle = color
                    ctx.fillStyle = color
                    ctx.lineWidth = 4
                    ctx.beginPath()
                    ctx.moveTo(x1, y1)
                    ctx.lineTo(x2, y2)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(x2, y2)
                    ctx.lineTo(
                        x2 - 12 * Math.cos(angle - 0.45),
                        y2 - 12 * Math.sin(angle - 0.45)
                    )
                    ctx.lineTo(
                        x2 - 12 * Math.cos(angle + 0.45),
                        y2 - 12 * Math.sin(angle + 0.45)
                    )
                    ctx.closePath()
                    ctx.fill()
                }

                const horizontalStretch = amp >= 0
                const arrowColor = horizontalStretch ? '#f2a900' : '#00a5c8'
                if (horizontalStretch) {
                    arrow(
                        cx - baseR * 0.68,
                        cy,
                        cx - baseR * 1.3,
                        cy,
                        arrowColor
                    )
                    arrow(
                        cx + baseR * 0.68,
                        cy,
                        cx + baseR * 1.3,
                        cy,
                        arrowColor
                    )
                    arrow(
                        cx,
                        cy - baseR * 1.25,
                        cx,
                        cy - baseR * 0.8,
                        '#00a5c8'
                    )
                    arrow(
                        cx,
                        cy + baseR * 1.25,
                        cx,
                        cy + baseR * 0.8,
                        '#00a5c8'
                    )
                } else {
                    arrow(
                        cx - baseR * 1.3,
                        cy,
                        cx - baseR * 0.78,
                        cy,
                        '#00a5c8'
                    )
                    arrow(
                        cx + baseR * 1.3,
                        cy,
                        cx + baseR * 0.78,
                        cy,
                        '#00a5c8'
                    )
                    arrow(
                        cx,
                        cy - baseR * 0.68,
                        cx,
                        cy - baseR * 1.32,
                        arrowColor
                    )
                    arrow(
                        cx,
                        cy + baseR * 0.68,
                        cx,
                        cy + baseR * 1.32,
                        arrowColor
                    )
                }

                ctx.textAlign = 'center'
                ctx.fillStyle = '#17212b'
                ctx.font = '700 26px Arial'
                ctx.fillText(
                    horizontalStretch ? 'stretch' : 'squeeze',
                    cx,
                    Math.max(58, cy - baseR - 28)
                )
                ctx.fillStyle = '#00407a'
                ctx.font = '700 22px Arial'
                ctx.fillText(
                    'free test masses',
                    cx,
                    Math.min(h - 38, cy + baseR + 46)
                )

                const sx0 = w * 0.58
                const sx1 = w * 0.94
                const sy = h * 0.5
                const strainAmp = h * 0.23
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(sx0, sy)
                ctx.lineTo(sx1, sy)
                ctx.moveTo(sx0, sy - strainAmp * 1.5)
                ctx.lineTo(sx0, sy + strainAmp * 1.5)
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 28px Arial'
                ctx.fillText(
                    'strain h(t)',
                    (sx0 + sx1) / 2,
                    Math.max(58, sy - strainAmp * 1.85)
                )
                ctx.strokeStyle = '#00407a'
                ctx.lineWidth = 5
                ctx.beginPath()
                for (let i = 0; i <= 240; i++) {
                    const u = i / 240
                    const x = sx0 + u * (sx1 - sx0)
                    const y =
                        sy -
                        Math.sin(u * Math.PI * 5.5 - phase) *
                            strainAmp *
                            (0.25 + 0.75 * u)
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.fillStyle = '#f2a900'
                ctx.beginPath()
                ctx.arc(
                    sx0 + 0.72 * (sx1 - sx0),
                    sy -
                        Math.sin(0.72 * Math.PI * 5.5 - phase) *
                            strainAmp *
                            (0.25 + 0.75 * 0.72),
                    9,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
            })
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
            const svg = makeSvg(frame)
            addText(svg, 95, 70, 'frequency', 'viz-small', 'start')
            addText(svg, 875, 465, 'time', 'viz-small', 'start')
            svg.appendChild(
                svgEl('line', {
                    x1: 100,
                    y1: 430,
                    x2: 900,
                    y2: 430,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 100,
                    y1: 430,
                    x2: 100,
                    y2: 70,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M150,390 C340,360 520,260 735,95',
                    fill: 'none',
                    stroke: '#00a5c8',
                    'stroke-width': 7,
                    class: 'draw-line',
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 180,
                    y1: 155,
                    x2: 860,
                    y2: 155,
                    stroke: '#f2a900',
                    'stroke-width': 5,
                    'stroke-dasharray': '18 10',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M140,300 C220,250 330,345 410,292 C520,220 620,350 720,285 C790,240 850,285 890,260',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 4,
                    opacity: 0.7,
                })
            )
            svg.appendChild(
                svgEl('ellipse', {
                    cx: 505,
                    cy: 255,
                    rx: 250,
                    ry: 120,
                    fill: '#f2a900',
                    opacity: 0.12,
                })
            )
            addText(svg, 725, 105, 'chirp', 'viz-label')
            addText(svg, 810, 145, 'continuous tone', 'viz-label')
            addText(svg, 735, 292, 'bursts', 'viz-label')
            addText(svg, 410, 245, 'stochastic background', 'viz-label')
        },

        'et-concept': function (frame) {
            const svg = makeSvg(frame)
            svg.appendChild(
                svgEl('path', {
                    d: 'M0,360 C180,325 310,390 500,348 C680,312 820,342 1000,315 L1000,520 L0,520 Z',
                    fill: '#d8e6ec',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M500,150 L735,395 L265,395 Z',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 10,
                    'stroke-linejoin': 'round',
                })
            )
            ;[
                [500, 150],
                [735, 395],
                [265, 395],
            ].forEach(([x, y]) => {
                svg.appendChild(
                    svgEl('circle', { cx: x, cy: y, r: 18, fill: '#00a5c8' })
                )
            })
            svg.appendChild(
                svgEl('path', {
                    d: 'M120,345 C235,310 320,330 430,305 C610,263 710,315 875,270',
                    fill: 'none',
                    stroke: '#f2a900',
                    'stroke-width': 4,
                    'stroke-dasharray': '10 9',
                })
            )
            addText(svg, 500, 82, 'Einstein Telescope concept')
            addText(
                svg,
                500,
                455,
                'underground observatory: quieter environment, longer reach, earlier signals'
            )
            addText(svg, 180, 330, 'ground motion', 'viz-small')
            addText(svg, 770, 382, '10 km arms', 'viz-small', 'start')
        },

        'project-landscape': function (frame) {
            const svg = makeSvg(frame, '0 0 1000 420')
            roundedRect(
                svg,
                80,
                90,
                230,
                100,
                'Sardinia',
                'candidate site',
                '#00a5c8'
            )
            roundedRect(
                svg,
                385,
                90,
                230,
                100,
                'Euregio Meuse-Rhine',
                'candidate site',
                '#00a5c8'
            )
            roundedRect(
                svg,
                690,
                90,
                230,
                100,
                'Lusatia',
                'candidate site',
                '#00a5c8'
            )
            roundedRect(
                svg,
                160,
                260,
                290,
                88,
                'infrastructure',
                'geology, cost, access',
                '#f2a900'
            )
            roundedRect(
                svg,
                550,
                260,
                290,
                88,
                'measurement design',
                'geometry, noise, operations',
                '#f2a900'
            )
            addText(
                svg,
                500,
                230,
                'site choice and detector design are coupled decisions'
            )
        },

        'low-frequency': function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const x0 = 90
                const x1 = w - 70
                const y0 = h - 70
                const y1 = 70
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.moveTo(x0, y0)
                ctx.lineTo(x1, y0)
                ctx.moveTo(x0, y0)
                ctx.lineTo(x0, y1)
                ctx.stroke()
                ctx.fillStyle = '#5a6875'
                ctx.font = '15px Arial'
                ctx.fillText('time before merger', x1 - 160, y0 + 35)
                ctx.save()
                ctx.translate(30, y1 + 90)
                ctx.rotate(-Math.PI / 2)
                ctx.fillText('frequency', 0, 0)
                ctx.restore()
                function track(start, color, label) {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 5
                    ctx.beginPath()
                    for (let i = 0; i <= 260; i++) {
                        const u = i / 260
                        const x = x0 + start + u * (x1 - x0 - start - 20)
                        const y = y0 - 35 - Math.pow(u, 2.8) * (y0 - y1 - 40)
                        if (i === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    const p = (t * 0.09) % 1
                    const x = x0 + start + p * (x1 - x0 - start - 20)
                    const y = y0 - 35 - Math.pow(p, 2.8) * (y0 - y1 - 40)
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(x, y, 8, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.font = '700 18px Arial'
                    ctx.fillText(label, x0 + start + 25, y0 - 16)
                }
                track(360, '#00407a', 'current band')
                track(70, '#00a5c8', 'ET low-frequency band')
                ctx.fillStyle = '#17212b'
                ctx.font = '700 22px Arial'
                ctx.fillText(
                    'ET hears the same inspiral earlier',
                    w / 2 - 170,
                    42
                )
            })
        },

        geometry: function (frame) {
            const svg = makeSvg(frame)
            addText(svg, 250, 65, 'triangle')
            svg.appendChild(
                svgEl('path', {
                    d: 'M250,110 L390,350 L110,350 Z',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 8,
                    'stroke-linejoin': 'round',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M150,390 C210,330 285,330 350,390',
                    fill: 'none',
                    stroke: '#00a5c8',
                    'stroke-width': 5,
                })
            )
            addText(
                svg,
                250,
                425,
                'redundancy enables null-stream checks',
                'viz-small'
            )
            addText(svg, 745, 65, 'two Ls')
            svg.appendChild(
                svgEl('path', {
                    d: 'M610,330 L610,135 L790,135',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 8,
                    'stroke-linecap': 'round',
                })
            )
            svg.appendChild(
                svgEl('path', {
                    d: 'M760,365 L760,170 L925,170',
                    fill: 'none',
                    stroke: '#00a5c8',
                    'stroke-width': 8,
                    'stroke-linecap': 'round',
                })
            )
            addText(
                svg,
                760,
                425,
                'more baseline, different inverse problem',
                'viz-small'
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 500,
                    y1: 100,
                    x2: 500,
                    y2: 430,
                    stroke: '#d9e0e7',
                    'stroke-width': 2,
                })
            )
        },

        transducer: function (frame) {
            const svg = makeSvg(frame)
            const arrow = addArrow(svg, 'trans-arrow')
            const boxes = [
                [60, 95, 160, 85, 'space-time', 'strain h(t)'],
                [275, 95, 170, 85, 'mirrors', 'differential motion'],
                [500, 95, 170, 85, 'light', 'phase readout'],
                [725, 95, 190, 85, 'calibrated data', 'strain + context'],
            ]
            boxes.forEach((box, i) => {
                roundedRect(svg, ...box)
                if (i < boxes.length - 1)
                    svg.appendChild(
                        svgEl('line', {
                            x1: box[0] + box[2] + 15,
                            y1: 138,
                            x2: boxes[i + 1][0] - 15,
                            y2: 138,
                            stroke: '#00407a',
                            'stroke-width': 4,
                            class: 'flow-line',
                            'marker-end': arrow,
                        })
                    )
            })
            for (let i = 0; i < 10; i++) {
                const x = 160 + i * 76
                const y = 330 + Math.sin(i) * 24
                svg.appendChild(
                    svgEl('circle', {
                        cx: x,
                        cy: y,
                        r: 12,
                        fill: i % 2 ? '#f2a900' : '#00a5c8',
                        opacity: 0.75,
                        class: 'pulse-dot',
                    })
                )
            }
            addText(svg, 500, 300, 'auxiliary channels explain detector state')
        },

        'noise-budget': function (frame) {
            const svg = makeSvg(frame)
            svg.appendChild(
                svgEl('line', {
                    x1: 90,
                    y1: 420,
                    x2: 900,
                    y2: 420,
                    class: 'viz-axis',
                })
            )
            svg.appendChild(
                svgEl('line', {
                    x1: 90,
                    y1: 420,
                    x2: 90,
                    y2: 70,
                    class: 'viz-axis',
                })
            )
            const curves = [
                [
                    'M100,130 C210,150 300,345 450,350 C570,356 710,310 890,210',
                    '#00407a',
                    'total',
                ],
                [
                    'M100,120 C190,190 245,360 360,405',
                    '#f2a900',
                    'low-frequency environment',
                ],
                ['M280,385 C430,280 560,280 705,360', '#00a5c8', 'thermal'],
                [
                    'M600,350 C700,270 790,170 890,95',
                    '#7b68ee',
                    'quantum optical',
                ],
            ]
            curves.forEach(([d, color, label], i) => {
                svg.appendChild(
                    svgEl('path', {
                        d,
                        fill: 'none',
                        stroke: color,
                        'stroke-width': i === 0 ? 6 : 4,
                        opacity: i === 0 ? 1 : 0.75,
                        class: 'draw-line',
                    })
                )
            })
            svg.appendChild(
                svgEl('rect', {
                    x: 675,
                    y: 82,
                    width: 250,
                    height: 140,
                    rx: 8,
                    fill: '#ffffff',
                    stroke: '#d9e0e7',
                    'stroke-width': 2,
                    opacity: 0.92,
                })
            )
            curves.forEach(([, color, label], i) => {
                const y = 112 + i * 30
                svg.appendChild(
                    svgEl('line', {
                        x1: 695,
                        y1: y - 5,
                        x2: 735,
                        y2: y - 5,
                        stroke: color,
                        'stroke-width': i === 0 ? 6 : 4,
                    })
                )
                addText(svg, 748, y, label, 'viz-small', 'start')
            })
            addText(svg, 500, 465, 'frequency')
            addText(svg, 35, 120, 'noise', 'viz-small', 'start')
        },

        'newtonian-noise': function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const cx = w * 0.47
                const cy = h * 0.52
                ctx.strokeStyle = '#d9e0e7'
                ctx.lineWidth = 2
                for (let r = ((t * 45) % 70) + 40; r < 560; r += 70) {
                    ctx.beginPath()
                    ctx.arc(cx - 180, cy + 110, r, 0, Math.PI * 2)
                    ctx.stroke()
                }
                for (let i = 0; i < 18; i++) {
                    const x = 140 + (i % 6) * 115
                    const y = 145 + Math.floor(i / 6) * 90
                    ctx.fillStyle = '#00a5c8'
                    ctx.beginPath()
                    ctx.arc(x, y, 8, 0, Math.PI * 2)
                    ctx.fill()
                }
                ctx.strokeStyle = '#00407a'
                ctx.lineWidth = 7
                ctx.beginPath()
                ctx.moveTo(w * 0.68, h * 0.58)
                ctx.lineTo(w * 0.86, h * 0.58)
                ctx.moveTo(w * 0.68, h * 0.58)
                ctx.lineTo(w * 0.68, h * 0.32)
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 22px Arial'
                ctx.fillText(
                    'sensor array reconstructs the environmental field',
                    120,
                    60
                )
                ctx.font = '16px Arial'
                ctx.fillStyle = '#5a6875'
                ctx.fillText(
                    'then predicts the gravitational pull on the test masses',
                    w * 0.53,
                    h * 0.82
                )
            })
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
            svg.appendChild(
                svgEl('path', {
                    d: 'M60,315 C110,275 145,345 190,310 C260,255 310,360 370,315 C470,230 540,380 620,308 C720,230 760,350 850,300',
                    fill: 'none',
                    stroke: '#00407a',
                    'stroke-width': 3,
                    opacity: 0.6,
                })
            )
        },

        'matched-filter': function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const x0 = 70
                const x1 = w - 70
                const yA = h * 0.34
                const yB = h * 0.66
                function wave(y, color, offset) {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 2.4
                    ctx.beginPath()
                    for (let i = 0; i <= 600; i++) {
                        const u = i / 600
                        const chirp = Math.sin(
                            (8 + 45 * u * u) * u * Math.PI * 2
                        )
                        const noise =
                            Math.sin(i * 0.31 + offset) * 9 +
                            Math.sin(i * 0.07) * 7
                        const env = Math.exp(-Math.pow((u - 0.66) / 0.12, 2))
                        const yv = y + noise + chirp * env * 65
                        const x = x0 + u * (x1 - x0)
                        if (i === 0) ctx.moveTo(x, yv)
                        else ctx.lineTo(x, yv)
                    }
                    ctx.stroke()
                }
                wave(yA, '#00407a', 0)
                wave(yB, '#00a5c8', 2)
                const scan = x0 + ((t * 90) % (x1 - x0))
                ctx.strokeStyle = '#f2a900'
                ctx.lineWidth = 5
                ctx.beginPath()
                ctx.moveTo(scan, 65)
                ctx.lineTo(scan, h - 55)
                ctx.stroke()
                ctx.fillStyle = '#17212b'
                ctx.font = '700 18px Arial'
                ctx.fillText('Detector A', x0 + 8, yA - 72)
                ctx.fillText('Detector B', x0 + 8, yB - 44)
                ctx.fillText(
                    'template scan -> correlation peak -> coincident trigger',
                    w * 0.45,
                    h - 24
                )
            })
        },

        'false-alarm': function (frame) {
            startCanvas(frame, (ctx, w, h, t) => {
                ctx.clearRect(0, 0, w, h)
                const x0 = 80
                const x1 = w * 0.58
                const y1 = 140
                const y2 = 245
                ctx.strokeStyle = '#8593a0'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(x0, y1)
                ctx.lineTo(x1, y1)
                ctx.moveTo(x0, y2)
                ctx.lineTo(x1, y2)
                ctx.stroke()
                const shift = ((t * 35) % 180) - 90
                ;[140, 260, 390, 500].forEach((x, i) => {
                    ctx.fillStyle = i === 2 ? '#f2a900' : '#00407a'
                    ctx.beginPath()
                    ctx.arc(x, y1, 9, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = i === 2 ? '#f2a900' : '#00a5c8'
                    ctx.beginPath()
                    ctx.arc(x + shift, y2, 9, 0, Math.PI * 2)
                    ctx.fill()
                })
                ctx.fillStyle = '#17212b'
                ctx.font = '700 18px Arial'
                ctx.fillText('zero lag', x0, 95)
                ctx.fillText('time-shifted background', x0, 310)
                const hx = w * 0.68
                const hy = h * 0.78
                ctx.strokeStyle = '#8593a0'
                ctx.beginPath()
                ctx.moveTo(hx, hy)
                ctx.lineTo(w - 70, hy)
                ctx.moveTo(hx, hy)
                ctx.lineTo(hx, 95)
                ctx.stroke()
                for (let i = 0; i < 14; i++) {
                    const barH = 150 * Math.exp(-i / 4.2)
                    ctx.fillStyle = i > 8 ? '#f2a900' : '#00a5c8'
                    ctx.fillRect(hx + 12 + i * 18, hy - barH, 12, barH)
                }
                ctx.fillStyle = '#17212b'
                ctx.fillText('FAR from accidental coincidences', hx, 68)
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
