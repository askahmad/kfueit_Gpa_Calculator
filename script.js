
        (function() {
            /* ====== KFUEIT Official Grading Scale & Constants ====== */
            const GRADE_MAP = { 'A+':4.0, 'A':4.0, 'A-':3.7, 'B+':3.3, 'B':3.0, 'B-':2.7, 'C+':2.3, 'C':2.0, 'C-':1.7, 'D+':1.3, 'D':1.0, 'F':0.0 };
            const GRADE_RANGES = { 'A+':"95-100", 'A':"86-94", 'A-':"80-85", 'B+':"76-79", 'B':"72-75", 'B-':"68-71", 'C+':"64-67", 'C':"60-63", 'D+':"54-56", 'D':"50-53", 'F':"<50" };

            function getStatsFromMarks(marks) {
                if (marks >= 95) return { grade: 'A+', gp: 4.0 };
                if (marks >= 86) return { grade: 'A', gp: 4.0 };
                if (marks >= 80) return { grade: 'A-', gp: 3.7 };
                if (marks >= 76) return { grade: 'B+', gp: 3.3 };
                if (marks >= 72) return { grade: 'B', gp: 3.0 };
                if (marks >= 68) return { grade: 'B-', gp: 2.7 };
                if (marks >= 64) return { grade: 'C+', gp: 2.3 };
                if (marks >= 60) return { grade: 'C', gp: 2.0 };
                if (marks >= 57) return { grade: 'C-', gp: 1.7 };
                if (marks >= 54) return { grade: 'D+', gp: 1.3 };
                if (marks >= 50) return { grade: 'D', gp: 1.0 };
            }

            /* ====== Native Mobile Haptic Feedback Engine ====== */
            window.haptic = function(type = 'light') {
                if ('vibrate' in navigator) {
                    try {
                        if (type === 'light') navigator.vibrate(12);
                        else if (type === 'medium') navigator.vibrate(24);
                        else if (type === 'success') navigator.vibrate([15, 35, 20]);
                        else if (type === 'warning') navigator.vibrate([25, 30, 25]);
                    } catch(e) {}
                }
            };

            /* ====== Toast Notification System ====== */
            window.showToast = function(msg, type = 'info', duration = 3500) {
                const container = document.getElementById('toastContainer');
                if (!container) return;
                const toast = document.createElement('div');
                toast.className = `toast-item toast-${type}`;
                const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
                toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(-15px) scale(0.95)';
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            };

            /* ====== Table Management ====== */
            window.initTable = function() {
                const tbody = document.querySelector("#gradesTable tbody");
                tbody.innerHTML = '';
                for(let i=0; i<4; i++) window.addRow();
            };

            window.addRow = function(data = {}) {
                window.haptic('light');
                const tbody = document.querySelector("#gradesTable tbody");
                const tr = document.createElement("tr");
                const isRepeat = !!data.isRepeat;
                const prevGrade = data.prevGrade || 'F';
                tr.innerHTML = `
                    <td><input type="text" class="subject-input" placeholder="Subject Name" value="${data.title || ''}" spellcheck="false"></td>
                    <td><span class="card-label">Marks</span><input type="number" inputmode="decimal" class="marks-input" placeholder="0-100" min="0" max="100" value="${data.marks || ''}" oninput="window.handleInput(this, 'marks')"></td>
                    <td><span class="card-label">Grade</span><input type="text" autocapitalize="characters" class="grade-input" placeholder="Grd" value="${data.grade || ''}" oninput="window.handleInput(this, 'grade')"></td>
                    <td><span class="card-label">Credit</span><input type="number" inputmode="numeric" class="credits-input" placeholder="Cr" min="1" max="6" value="${data.credits || 3}"></td>
                    <td><span class="gp-display">-</span></td>
                    <td style="text-align:center;">
                        <button type="button" class="repeat-toggle-btn ${isRepeat ? 'active' : ''}" onclick="window.toggleRepeat(this)" title="Toggle Course Repeat / Grade Improvement">
                            ${isRepeat ? '🔁 Repeat' : '🔁 Normal'}
                        </button>
                        <div class="repeat-select-wrapper" style="${isRepeat ? 'display:block;' : 'display:none;'}">
                            <select class="prev-grade-select" title="Select previously earned grade" onchange="window.calculateResult(); window.haptic('light');">
                                <option value="F" ${prevGrade === 'F' ? 'selected' : ''}>Prev: F (0.0)</option>
                                <option value="D" ${prevGrade === 'D' ? 'selected' : ''}>Prev: D (1.0)</option>
                                <option value="D+" ${prevGrade === 'D+' ? 'selected' : ''}>Prev: D+ (1.3)</option>
                                <option value="C-" ${prevGrade === 'C-' ? 'selected' : ''}>Prev: C- (1.7)</option>
                                <option value="C" ${prevGrade === 'C' ? 'selected' : ''}>Prev: C (2.0)</option>
                                <option value="C+" ${prevGrade === 'C+' ? 'selected' : ''}>Prev: C+ (2.3)</option>
                                <option value="B-" ${prevGrade === 'B-' ? 'selected' : ''}>Prev: B- (2.7)</option>
                                <option value="B" ${prevGrade === 'B' ? 'selected' : ''}>Prev: B (3.0)</option>
                            </select>
                        </div>
                    </td>
                    <td class="del-col" style="text-align:center;"><button type="button" class="del-row-btn" onclick="window.removeRow(this); window.haptic('light');" title="Remove course">✕</button></td>
                `;
                tbody.appendChild(tr);

                const rowMarks = tr.querySelector('.marks-input');
                const rowGrade = tr.querySelector('.grade-input');
                if (data.marks) window.handleInput(rowMarks, 'marks');
                else if (data.grade) window.handleInput(rowGrade, 'grade');
            };

            window.toggleRepeat = function(btn) {
                window.haptic('medium');
                const wrapper = btn.nextElementSibling;
                btn.classList.toggle('active');
                if (btn.classList.contains('active')) {
                    btn.textContent = '🔁 Repeat';
                    wrapper.style.display = 'block';
                    window.showToast('🔁 Course marked as Repeat. Select previously earned grade.', 'info', 2500);
                } else {
                    btn.textContent = '🔁 Normal';
                    wrapper.style.display = 'none';
                }
                window.calculateResult();
            };

            window.removeRow = function(btn) {
                window.haptic('light');
                const row = btn.closest('tr');
                if (!row) return;
                if(document.querySelectorAll("#gradesTable tbody tr").length > 1) {
                    row.style.opacity = '0';
                    row.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        row.remove();
                        window.calculateResult();
                    }, 180);
                }
                else { 
                    row.querySelectorAll('input').forEach(i => i.value = ''); 
                    row.querySelector('.gp-display').textContent = '-'; 
                    window.calculateResult();
                }
            };

            window.handleInput = function(input, type) {
                const row = input.closest('tr');
                const marksInput = row.querySelector('.marks-input');
                const gradeInput = row.querySelector('.grade-input');
                const gpDisplay = row.querySelector('.gp-display');

                if (type === 'marks') {
                    const m = parseFloat(marksInput.value);
                    if (!isNaN(m) && m >= 0 && m <= 100) {
                        const stats = getStatsFromMarks(m);
                        gradeInput.value = stats.grade;
                        gpDisplay.textContent = stats.gp.toFixed(2);
                        gpDisplay.style.color = stats.gp >= 3 ? 'var(--success-color)' : (stats.gp < 2 ? 'var(--danger-color)' : 'rgba(255,255,255,0.8)');
                    } else {
                        gradeInput.value = ''; gpDisplay.textContent = '-';
                    }
                } else if (type === 'grade') {
                    const g = gradeInput.value.toUpperCase().trim();
                    if (GRADE_MAP.hasOwnProperty(g)) {
                        const gp = GRADE_MAP[g];
                        marksInput.value = ''; 
                        gpDisplay.textContent = gp.toFixed(2);
                        gpDisplay.style.color = gp >= 3 ? 'var(--success-color)' : (gp < 2 ? 'var(--danger-color)' : 'rgba(255,255,255,0.8)');
                    } else {
                        gpDisplay.textContent = '-';
                    }
                }
            };

            /* ====== Calculation Engine (100% Accurate KFUEIT Math & Repeat Policy) ====== */
            window.calculateResult = function() {
                window.haptic('success');
                const rows = document.querySelectorAll("#gradesTable tbody tr");
                let semPoints = 0, semCredits = 0;
                let repeatCoursesCount = 0;
                let repeatCredits = 0;
                let repeatOldPoints = 0;
                let repeatPointDelta = 0;

                rows.forEach(row => {
                    const credits = parseFloat(row.querySelector(".credits-input").value);
                    const gp = parseFloat(row.querySelector(".gp-display").textContent);
                    const isRepeat = row.querySelector(".repeat-toggle-btn")?.classList.contains('active');
                    const prevGrade = row.querySelector(".prev-grade-select")?.value || 'F';
                    const oldGP = GRADE_MAP[prevGrade] !== undefined ? GRADE_MAP[prevGrade] : 0.0;

                    if (!isNaN(credits) && !isNaN(gp) && credits > 0) {
                        semPoints += (gp * credits);
                        semCredits += credits;

                        if (isRepeat) {
                            repeatCoursesCount++;
                            repeatCredits += credits;
                            repeatOldPoints += (oldGP * credits);
                            repeatPointDelta += ((gp - oldGP) * credits);
                        }
                    }
                });

                const sgpa = semCredits > 0 ? (semPoints / semCredits) : 0;
                const prevCGPA = parseFloat(document.getElementById("prevCGPA").value) || 0;
                const prevCredits = parseFloat(document.getElementById("prevCredits").value) || 0;
                
                const prevPoints = prevCGPA * prevCredits;
                // Repeat credits do not inflate completed credits
                const newCreditsCompleted = Math.max(0, semCredits - repeatCredits);
                const totalCredits = prevCredits + newCreditsCompleted;

                // When repeating courses, the old grade points are replaced by new grade points:
                let effectiveTotalPoints = 0;
                if (prevCredits > 0) {
                    effectiveTotalPoints = (prevPoints - repeatOldPoints) + semPoints;
                } else {
                    effectiveTotalPoints = semPoints;
                }

                let finalGPA = 0, label = "SGPA";
                if (totalCredits > 0) {
                    finalGPA = effectiveTotalPoints / totalCredits;
                    label = prevCredits > 0 ? "CGPA" : "SGPA";
                }

                updateUI(finalGPA.toFixed(2), label, sgpa.toFixed(2), {
                    semCredits,
                    semPoints,
                    prevCredits,
                    prevCGPA,
                    prevPoints,
                    totalCredits,
                    totalPoints: effectiveTotalPoints,
                    repeatCoursesCount,
                    repeatCredits,
                    repeatPointDelta
                });
            };

            function animateValue(obj, start, end, duration) {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    obj.innerHTML = (progress * (end - start) + start).toFixed(2);
                    if (progress < 1) window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
            }

            function updateUI(gpa, label, sgpa, stats) {
                const displayVal = document.getElementById("displayGPA");
                const ring = document.getElementById("progressRing");
                const endVal = parseFloat(gpa);
                
                animateValue(displayVal, parseFloat(displayVal.textContent) || 0, endVal, 700);
                document.getElementById("displayLabel").textContent = label;

                const degree = (Math.min(endVal, 4.0) / 4) * 360;
                let color = 'var(--danger-color)';
                if (endVal >= 2.0) color = 'var(--warning-color)';
                if (endVal >= 3.0) color = 'var(--success-color)';
                if (endVal >= 3.5) color = 'var(--primary-color)';

                ring.style.background = `conic-gradient(${color} ${degree}deg, rgba(255,255,255,0.05) ${degree}deg)`;
                ring.style.boxShadow = `0 0 40px ${color}60, inset 0 0 20px rgba(0,0,0,0.5)`;
                ring.style.transform = 'scale(1.05)';
                setTimeout(() => ring.style.transform = 'scale(1)', 200);

                if (endVal >= 3.5) window.fireConfetti();

                const remark = document.getElementById("remarkText");
                let msg = endVal >= 3.6 ? "Outstanding Performance! 🚀" : (endVal >= 3.0 ? "Great Academic Standing! 🌟" : (endVal >= 2.0 ? "Satisfactory Progress! 💪" : "Academic Probation Risk! 📚"));
                remark.textContent = msg;
                remark.style.color = color;
                remark.classList.add("show");
                
                // Detailed Breakdown Grid
                const statsGrid = document.getElementById("statsGrid");
                const breakdownText = document.getElementById("breakdownText");
                
                if (stats && (stats.semCredits > 0 || stats.prevCredits > 0)) {
                    statsGrid.style.display = 'grid';
                    breakdownText.textContent = '';
                    
                    let formulaHtml = '';
                    if (stats.prevCredits > 0 && stats.semCredits > 0) {
                        formulaHtml = `
                            <div class="stat-formula-card">
                                <strong>Formula:</strong> Total Quality Points [${stats.totalPoints.toFixed(2)}] ÷ Completed Credits [${stats.totalCredits}] = <strong>${gpa} CGPA</strong>
                            </div>
                        `;
                    } else if (stats.semCredits > 0) {
                        formulaHtml = `
                            <div class="stat-formula-card">
                                <strong>Semester Formula:</strong> Quality Points [${stats.semPoints.toFixed(2)}] ÷ Credits [${stats.semCredits}] = <strong>${sgpa} SGPA</strong>
                            </div>
                        `;
                    }

                    let repeatNoteHtml = '';
                    if (stats.repeatCoursesCount > 0) {
                        repeatNoteHtml = `
                            <div class="stat-formula-card" style="border-color:#ffb703; background:rgba(255,183,3,0.09); color:#ffb703;">
                                🔁 <strong>${stats.repeatCoursesCount} Course Repeat:</strong> Old grade points replaced. Net Quality Point Gain: <strong>+${stats.repeatPointDelta.toFixed(2)}</strong> (Credits not duplicated).
                            </div>
                        `;
                    }

                    statsGrid.innerHTML = `
                        <div class="stat-card">
                            <div class="stat-card-title">Total CGPA</div>
                            <div class="stat-card-val" style="color:${color}">${gpa}</div>
                            <div class="stat-card-sub">${stats.totalCredits} Cumulative Credits</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Semester SGPA</div>
                            <div class="stat-card-val" style="color:var(--accent-cyan)">${sgpa}</div>
                            <div class="stat-card-sub">${stats.semCredits} Sem Credits</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Total Quality Pts</div>
                            <div class="stat-card-val">${stats.totalPoints.toFixed(2)}</div>
                            <div class="stat-card-sub">Prev ${stats.prevPoints.toFixed(2)} + Sem ${stats.semPoints.toFixed(2)}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Completed Credits</div>
                            <div class="stat-card-val">${stats.totalCredits}</div>
                            <div class="stat-card-sub">${stats.prevCredits} Prev + ${stats.semCredits - stats.repeatCredits} New</div>
                        </div>
                        ${repeatNoteHtml}
                        ${formulaHtml}
                    `;
                } else {
                    statsGrid.style.display = 'none';
                    breakdownText.textContent = '';
                }

                // Update Mobile Bottom Dock Mini Widget
                const dockMiniResult = document.getElementById("dockMiniResult");
                const dockSgpaVal = document.getElementById("dockSgpaVal");
                const dockCgpaVal = document.getElementById("dockCgpaVal");
                if (dockMiniResult && dockSgpaVal && dockCgpaVal) {
                    dockSgpaVal.textContent = sgpa;
                    dockCgpaVal.textContent = (label === 'CGPA') ? `CGPA: ${gpa}` : `Sem Credits: ${stats ? stats.semCredits : '-'}`;
                    dockMiniResult.style.display = 'flex';
                }
            }

            window.resetForm = function() {
                window.haptic('warning');
                document.querySelectorAll('input').forEach(i => i.value = '');
                document.querySelectorAll('.gp-display').forEach(s => { s.textContent = '-'; s.style.color = 'rgba(255,255,255,0.7)'; });
                document.getElementById("progressRing").style.background = `conic-gradient(rgba(255,255,255,0.05) 0deg, rgba(255,255,255,0.05) 0deg)`;
                document.getElementById("displayGPA").textContent = "0.00";
                document.getElementById("remarkText").classList.remove("show");
                document.getElementById("breakdownText").textContent = "";
                document.getElementById("statsGrid").style.display = 'none';
                
                const dockMiniResult = document.getElementById("dockMiniResult");
                if (dockMiniResult) dockMiniResult.style.display = 'none';

                window.initTable();
                window.showToast('Calculator reset to initial state.', 'info');
            };

            /* ====== Mobile Floating Action Dock Navigation Helpers ====== */
            window.scrollToDashboard = function() {
                window.haptic('light');
                const ring = document.getElementById("progressRing") || document.querySelector(".results-dashboard");
                if (ring) {
                    ring.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ring.style.transform = 'scale(1.06)';
                    setTimeout(() => ring.style.transform = 'scale(1)', 350);
                }
            };

            window.triggerScanSheet = function() {
                window.haptic('light');
                const ocrCard = document.getElementById('ocrCard');
                if (ocrCard) {
                    ocrCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ocrCard.style.boxShadow = '0 0 35px rgba(76, 201, 240, 0.65)';
                    setTimeout(() => ocrCard.style.boxShadow = '', 2000);
                }
            };

            /* ====== Modal Controls ====== */
            window.toggleModal = function(id) {
                const m = document.getElementById(id);
                if (!m) return;
                if(m.classList.contains('active')) { 
                    m.classList.remove('active'); 
                    setTimeout(()=>m.style.display='none', 200); 
                } else { 
                    m.style.display='flex'; 
                    setTimeout(()=>m.classList.add('active'), 10); 
                }
            };
            window.onclick = e => { if(e.target.classList.contains('modal')) window.toggleModal(e.target.id); };

            /* ====== OCR & PDF Transcript Scanner Engine ====== */

            // Initialize PDF.js Worker
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            // High-contrast canvas preprocessor for mobile photos & low-light screenshots
            function preprocessImage(img) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.naturalWidth || img.width;
                let height = img.naturalHeight || img.height;
                
                // Scale image down if huge to keep OCR fast, but maintain sharpness
                const maxDim = 1800;
                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Grayscale + Contrast boost
                try {
                    const imgData = ctx.getImageData(0, 0, width, height);
                    const d = imgData.data;
                    const contrast = 1.35; // Contrast boost
                    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                    for (let i = 0; i < d.length; i += 4) {
                        const gray = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
                        let val = factor * (gray - 128) + 128;
                        val = Math.max(0, Math.min(255, val));
                        d[i] = val;
                        d[i+1] = val;
                        d[i+2] = val;
                    }
                    ctx.putImageData(imgData, 0, 0);
                } catch(e) {
                    console.warn('Canvas pixel manipulation skipped:', e);
                }
                return canvas;
            }

            window.handleFileUpload = function(event) {
                const file = event.target.files && event.target.files[0];
                if (file) processTranscriptFile(file);
                event.target.value = '';
            };
            window.handleImageUpload = window.handleFileUpload;

            function processTranscriptFile(file) {
                const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                const isImage = file.type.startsWith('image/');

                if (!isPdf && !isImage) {
                    window.showToast('Please upload a valid PDF or Image file (PDF, PNG, JPG, WEBP).', 'error');
                    return;
                }

                if (isPdf) {
                    processPdfFile(file);
                } else {
                    processImageFile(file);
                }
            }

            // PDF text line extraction with vertical bucketing and horizontal sorting
            async function extractLinesFromPdfPage(page) {
                const textContent = await page.getTextContent();
                if (!textContent || !textContent.items || textContent.items.length === 0) return '';

                const lineMap = new Map();
                for (const item of textContent.items) {
                    const text = item.str;
                    if (!text || text.trim() === '') continue;
                    const y = Math.round(item.transform[5]);
                    const x = item.transform[4];

                    let matchedKey = null;
                    for (const key of lineMap.keys()) {
                        if (Math.abs(key - y) <= 4) {
                            matchedKey = key;
                            break;
                        }
                    }
                    if (matchedKey === null) {
                        matchedKey = y;
                        lineMap.set(matchedKey, []);
                    }
                    lineMap.get(matchedKey).push({ x, text });
                }

                // PDF Y=0 is at bottom, so higher Y appears earlier on the visual page
                const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
                const lines = [];
                for (const y of sortedY) {
                    const items = lineMap.get(y);
                    items.sort((a, b) => a.x - b.x);
                    lines.push(items.map(it => it.text).join(' ').trim());
                }
                return lines.join('\n');
            }

            // Process PDF file (Digital Text layer + Scanned PDF OCR fallback)
            async function processPdfFile(file) {
                const progressBox = document.getElementById('ocrProgressBox');
                const progressBar = document.getElementById('ocrProgressBar');
                const progressPercent = document.getElementById('ocrProgressPercent');
                const statusMsg = document.getElementById('ocrStatusMsg');

                progressBox.style.display = 'block';
                progressBar.style.width = '15%';
                progressPercent.textContent = '15%';
                statusMsg.textContent = 'Loading PDF parser...';

                if (typeof pdfjsLib === 'undefined') {
                    progressBox.style.display = 'none';
                    window.showToast('PDF library is loading. Please wait 2 seconds and try again.', 'error');
                    return;
                }

                try {
                    const arrayBuffer = await file.arrayBuffer();
                    statusMsg.textContent = 'Opening PDF document...';
                    progressBar.style.width = '30%';
                    progressPercent.textContent = '30%';

                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;
                    const numPages = pdf.numPages;

                    // Render Page 1 to canvas for preview and OCR fallback
                    const firstPage = await pdf.getPage(1);
                    const viewport = firstPage.getViewport({ scale: 1.5 });
                    const previewCanvas = document.createElement('canvas');
                    previewCanvas.width = viewport.width;
                    previewCanvas.height = viewport.height;
                    const renderCtx = {
                        canvasContext: previewCanvas.getContext('2d'),
                        viewport: viewport
                    };
                    await firstPage.render(renderCtx).promise;

                    // Show visual preview in modal
                    const previewImg = document.getElementById('scanPreviewImg');
                    const previewWrapper = document.getElementById('scanPreviewWrapper');
                    const docBadge = document.getElementById('scanDocBadge');
                    if (previewImg && previewWrapper) {
                        previewImg.src = previewCanvas.toDataURL('image/png');
                        previewWrapper.style.display = 'flex';
                    }
                    if (docBadge) {
                        docBadge.textContent = `📄 PDF Transcript (${numPages} ${numPages > 1 ? 'Pages' : 'Page'})`;
                    }

                    // Extract digital text from all pages
                    let fullText = '';
                    for (let i = 1; i <= numPages; i++) {
                        statusMsg.textContent = `Reading PDF page ${i} of ${numPages}...`;
                        const progressVal = Math.round(30 + (i / numPages) * 50);
                        progressBar.style.width = `${progressVal}%`;
                        progressPercent.textContent = `${progressVal}%`;

                        const page = (i === 1) ? firstPage : await pdf.getPage(i);
                        const pageLines = await extractLinesFromPdfPage(page);
                        fullText += pageLines + '\n';
                    }

                    console.log('Extracted PDF Text:', fullText);

                    // Check if document has a digital text layer
                    const hasDigitalText = fullText.trim().length > 30 && /[A-Za-z0-9]/.test(fullText);

                    if (hasDigitalText) {
                        progressBar.style.width = '100%';
                        progressPercent.textContent = '100%';
                        statusMsg.textContent = 'PDF parsed successfully!';
                        setTimeout(() => {
                            progressBox.style.display = 'none';
                            parseTranscript(fullText, 'PDF');
                        }, 300);
                    } else {
                        // Scanned PDF fallback (photocopy without text layer)
                        statusMsg.textContent = 'Scanned PDF detected. Running AI OCR on document image...';
                        progressBar.style.width = '40%';
                        progressPercent.textContent = '40%';

                        if (typeof Tesseract === 'undefined') {
                            progressBox.style.display = 'none';
                            window.showToast('OCR engine is still loading. Please retry in a moment.', 'error');
                            return;
                        }

                        const processedCanvas = preprocessImage(previewCanvas);
                        Tesseract.recognize(
                            processedCanvas,
                            'eng',
                            {
                                logger: m => {
                                    if (m.status === 'recognizing text' && m.progress != null) {
                                        const p = Math.round(40 + m.progress * 55);
                                        progressBar.style.width = p + '%';
                                        progressPercent.textContent = p + '%';
                                        statusMsg.textContent = `Scanning PDF document (${Math.round(m.progress * 100)}%)...`;
                                    }
                                }
                            }
                        ).then(({ data: { text } }) => {
                            progressBar.style.width = '100%';
                            progressPercent.textContent = '100%';
                            statusMsg.textContent = 'Scanned PDF parsed successfully!';
                            setTimeout(() => {
                                progressBox.style.display = 'none';
                                parseTranscript(text, 'Scanned PDF');
                            }, 300);
                        }).catch(err => {
                            console.error('OCR Error on PDF:', err);
                            progressBox.style.display = 'none';
                            window.showToast('Could not extract text from scanned PDF. Please ensure clarity.', 'error');
                        });
                    }
                } catch (err) {
                    console.error('PDF parsing error:', err);
                    progressBox.style.display = 'none';
                    window.showToast('Failed to read PDF file. Please ensure it is a valid PDF document.', 'error');
                }
            }

            // Process image file via FileReader and Tesseract OCR
            function processImageFile(file) {
                const progressBox = document.getElementById('ocrProgressBox');
                const progressBar = document.getElementById('ocrProgressBar');
                const progressPercent = document.getElementById('ocrProgressPercent');
                const statusMsg = document.getElementById('ocrStatusMsg');

                progressBox.style.display = 'block';
                progressBar.style.width = '10%';
                progressPercent.textContent = '10%';
                statusMsg.textContent = 'Reading image file...';

                const docBadge = document.getElementById('scanDocBadge');
                if (docBadge) docBadge.textContent = '🖼️ Photo Transcript';

                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgSrc = e.target.result;
                    
                    const previewImg = document.getElementById('scanPreviewImg');
                    const previewWrapper = document.getElementById('scanPreviewWrapper');
                    if (previewImg && previewWrapper) {
                        previewImg.src = imgSrc;
                        previewWrapper.style.display = 'flex';
                    }

                    const tempImg = new Image();
                    tempImg.onload = function() {
                        statusMsg.textContent = 'Enhancing image contrast...';
                        progressBar.style.width = '25%';
                        progressPercent.textContent = '25%';

                        const processedCanvas = preprocessImage(tempImg);

                        if (typeof Tesseract === 'undefined') {
                            progressBox.style.display = 'none';
                            window.showToast('OCR library is still loading from CDN. Please wait a few seconds and try again.', 'error');
                            return;
                        }

                        statusMsg.textContent = 'Running AI Text Recognition...';
                        Tesseract.recognize(
                            processedCanvas,
                            'eng',
                            {
                                logger: m => {
                                    if (m.status === 'recognizing text' && m.progress != null) {
                                        const p = Math.round(25 + m.progress * 70);
                                        progressBar.style.width = p + '%';
                                        progressPercent.textContent = p + '%';
                                        statusMsg.textContent = `Extracting transcript (${Math.round(m.progress * 100)}%)...`;
                                    }
                                }
                            }
                        ).then(({ data: { text } }) => {
                            progressBar.style.width = '100%';
                            progressPercent.textContent = '100%';
                            statusMsg.textContent = 'Transcript parsed successfully!';
                            setTimeout(() => {
                                progressBox.style.display = 'none';
                                parseTranscript(text, 'Photo');
                            }, 350);
                        }).catch(err => {
                            console.error('OCR Error:', err);
                            progressBox.style.display = 'none';
                            window.showToast('Could not extract text. Please ensure image is well-lit & clear.', 'error');
                        });
                    };
                    tempImg.src = imgSrc;
                };
                reader.readAsDataURL(file);
            }

            /* ====== Intelligent Transcript Parser ====== */
            function removeAtIndex(str, index, length) {
                return str.slice(0, index) + ' ' + str.slice(index + length);
            }

            function parseTranscript(text, sourceType = 'Transcript') {
                console.log(`Raw ${sourceType} Text:`, text);
                
                // 1. Previous / Total CGPA extraction
                let foundCGPA = null;
                const cgpaMatch = text.match(/(?:C\.?G\.?P\.?A|Cumulative\s*(?:Grade\s*Point\s*Average|GPA|Grade|Point)?|Total\s*CGPA|Overall\s*CGPA)[\s:=_-]*([0-4](?:\.\d{1,2})?)/i);
                if (cgpaMatch) {
                    const val = parseFloat(cgpaMatch[1]);
                    if (!isNaN(val) && val <= 4.0) foundCGPA = val;
                }

                // 2. Total / Completed Credit Hours extraction
                let foundCredits = null;
                const creditsMatch = text.match(/(?:Total\s*(?:Credit\s*)?Hours?|Credits?\s*Earned|Earned\s*Credits?|Completed\s*Credits?|Total\s*Credits?|Cr\.?\s*Earned|Cr\.?\s*Completed|Total\s*Cr(?:\.?\s*Hrs?)?|Cr\s*Hrs|Total\s*CH)[\s:=_-]*(\d{1,3})/i);
                if (creditsMatch) {
                    const val = parseInt(creditsMatch[1], 10);
                    if (!isNaN(val) && val > 0 && val <= 200) foundCredits = val;
                }

                // 3. Semester SGPA extraction
                let foundSGPA = null;
                const sgpaMatch = text.match(/(?:S\.?G\.?P\.?A|Semester\s*(?:Grade\s*Point\s*Average|GPA|Grade|Point)?)[\s:=_-]*([0-4](?:\.\d{1,2})?)/i);
                if (sgpaMatch) {
                    const val = parseFloat(sgpaMatch[1]);
                    if (!isNaN(val) && val <= 4.0) foundSGPA = val;
                }

                // 4. Student Name extraction (stops at newline or next field)
                let foundName = '';
                const nameMatch = text.match(/(?:Student\s*Name|Name\s*of\s*Student|Student's\s*Name|Candidate\s*Name|Name)[\s:=_-]+([^\r\n:,;]+)/i);
                if (nameMatch) {
                    foundName = nameMatch[1].replace(/Roll.*$/i, '').trim();
                    if (foundName.length > 35) foundName = foundName.substring(0, 35).trim();
                }

                // 5. Course Rows extraction
                const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 2);
                const courses = [];
                const gradeRegex = /(?:^|\s)(A\+|A-|A|B\+|B-|B|C\+|C-|C|D\+|D|F)(?:\s|$)/i;

                for (let line of lines) {
                    // Skip system headers and summary lines
                    if (/^(khwaja|kfueit|official|gazette|transcript|provisional|examination branch|page\s*\d+|roll\s*no|registration\s*no|cumulative|total\s*credits?|semester\s*sgpa)/i.test(line)) {
                        continue;
                    }
                    if (/course.*(?:code|title).*cr/i.test(line)) {
                        continue;
                    }

                    const gMatch = line.match(gradeRegex);
                    if (gMatch) {
                        const grade = gMatch[1].toUpperCase();
                        const matchIdx = gMatch.index + (gMatch[0].startsWith(' ') ? 1 : 0);
                        let lineClean = removeAtIndex(line, matchIdx, gMatch[1].length);

                        // Strip GP decimals (e.g. 4.00, 3.70, 12.00)
                        lineClean = lineClean.replace(/\b\d+\.\d{1,2}\b/g, ' ');

                        // Marks (two digits 10-99, or 100)
                        let marks = '';
                        const mMatch = lineClean.match(/\b(100|[4-9][0-9]|[1-3][0-9])\b/);
                        if (mMatch) {
                            marks = mMatch[0];
                            lineClean = removeAtIndex(lineClean, mMatch.index, mMatch[0].length);
                        }

                        // Credit hours (single digit 1-6)
                        let cr = 3;
                        const crMatch = lineClean.match(/\b([1-6])\b/);
                        if (crMatch) {
                            cr = parseInt(crMatch[1], 10);
                            lineClean = removeAtIndex(lineClean, crMatch.index, crMatch[0].length);
                        }

                        // Clean Subject Title
                        let title = lineClean
                            .replace(/[:|,\-_/\\]+/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();

                        if (title.length >= 2) {
                            if (title.length > 35) title = title.substring(0, 35).trim();
                            courses.push({
                                title: title,
                                marks: marks,
                                grade: grade,
                                credits: cr,
                                gp: GRADE_MAP[grade] !== undefined ? GRADE_MAP[grade] : 0.0
                            });
                        }
                    }
                }

                // Populate Scan Review Modal
                document.getElementById('scanStudentName').value = foundName || '';
                document.getElementById('scanCGPA').value = foundCGPA !== null ? foundCGPA.toFixed(2) : '';
                document.getElementById('scanCredits').value = foundCredits !== null ? foundCredits : '';
                document.getElementById('scanSGPA').value = foundSGPA !== null ? foundSGPA.toFixed(2) : '';

                renderScanCoursesTable(courses);
                window.toggleModal('scanModal');

                const itemsFound = [];
                if (foundCGPA !== null) itemsFound.push(`CGPA ${foundCGPA.toFixed(2)}`);
                if (foundCredits !== null) itemsFound.push(`${foundCredits} Credits`);
                if (courses.length > 0) itemsFound.push(`${courses.length} Courses`);
                
                const typeIcon = sourceType.includes('PDF') ? '📄' : '🖼️';
                if (itemsFound.length > 0) {
                    window.showToast(`${typeIcon} ${sourceType} Scanned: ${itemsFound.join(', ')}! Please review and apply.`, 'success', 4500);
                } else {
                    window.showToast(`${typeIcon} Scanned ${sourceType}. You can adjust values in the review box.`, 'info', 4000);
                }
            }

            function renderScanCoursesTable(courses) {
                const tbody = document.querySelector('#scanCoursesTable tbody');
                tbody.innerHTML = '';
                document.getElementById('scanCoursesCount').textContent = courses.length;

                if (courses.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.4); padding:12px;">No course rows detected in this image. (You can still set Previous CGPA & add subjects in main table).</td></tr>`;
                    return;
                }

                courses.forEach(c => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><input type="text" class="scan-course-title" value="${c.title}" placeholder="Course Title"></td>
                        <td><input type="number" class="scan-course-marks" value="${c.marks}" placeholder="Marks" min="0" max="100"></td>
                        <td><input type="text" class="scan-course-grade" value="${c.grade}" placeholder="Grd" style="text-align:center;"></td>
                        <td><input type="number" class="scan-course-cr" value="${c.credits}" min="1" max="6" style="text-align:center;"></td>
                        <td class="del-btn" onclick="this.closest('tr').remove(); document.getElementById('scanCoursesCount').textContent = document.querySelectorAll('#scanCoursesTable tbody tr').length;">×</td>
                    `;
                    tbody.appendChild(tr);
                });
            }

            window.addScanCourseRow = function() {
                const tbody = document.querySelector('#scanCoursesTable tbody');
                // Remove placeholder if present
                if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="text" class="scan-course-title" value="New Subject" placeholder="Course Title"></td>
                    <td><input type="number" class="scan-course-marks" value="85" placeholder="Marks" min="0" max="100"></td>
                    <td><input type="text" class="scan-course-grade" value="A-" placeholder="Grd" style="text-align:center;"></td>
                    <td><input type="number" class="scan-course-cr" value="3" min="1" max="6" style="text-align:center;"></td>
                    <td class="del-btn" onclick="this.closest('tr').remove(); document.getElementById('scanCoursesCount').textContent = document.querySelectorAll('#scanCoursesTable tbody tr').length;">×</td>
                `;
                tbody.appendChild(tr);
                document.getElementById('scanCoursesCount').textContent = document.querySelectorAll('#scanCoursesTable tbody tr').length;
            };

            /* ====== Apply Scanned Data to Calculator ====== */

            // Option A: Primary requested flow (Load Previous CGPA + Credits, then let user enter new semester subjects)
            window.applyAsPreviousOnly = function() {
                const cgpa = parseFloat(document.getElementById('scanCGPA').value);
                const credits = parseFloat(document.getElementById('scanCredits').value);
                const name = document.getElementById('scanStudentName').value.trim();

                if (name) document.getElementById('studentName').value = name;
                if (!isNaN(cgpa)) document.getElementById('prevCGPA').value = cgpa.toFixed(2);
                if (!isNaN(credits)) document.getElementById('prevCredits').value = Math.round(credits);

                window.toggleModal('scanModal');

                // Ensure at least 3 clean rows exist in main table ready for the new semester
                const rows = document.querySelectorAll("#gradesTable tbody tr");
                if (rows.length < 3) {
                    for (let i = rows.length; i < 4; i++) window.addRow();
                }

                const cgpaStr = !isNaN(cgpa) ? cgpa.toFixed(2) : "0.00";
                const crStr = !isNaN(credits) ? Math.round(credits) : "0";
                window.showToast(`🎯 Previous Record Imported: ${cgpaStr} CGPA & ${crStr} Credits! Now add your new semester subjects below.`, 'success', 5000);

                // Smooth scroll to subjects table
                const tableContainer = document.querySelector('.table-container');
                if (tableContainer) {
                    tableContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        const firstInput = tableContainer.querySelector('input.subject-input');
                        if (firstInput) firstInput.focus();
                    }, 400);
                }
            };

            // Option B: Auto-populate all detected courses directly into the table and calculate
            window.applyAllScannedData = function() {
                const cgpa = parseFloat(document.getElementById('scanCGPA').value);
                const credits = parseFloat(document.getElementById('scanCredits').value);
                const name = document.getElementById('scanStudentName').value.trim();

                if (name) document.getElementById('studentName').value = name;
                if (!isNaN(cgpa)) document.getElementById('prevCGPA').value = cgpa.toFixed(2);
                if (!isNaN(credits)) document.getElementById('prevCredits').value = Math.round(credits);

                const scanRows = document.querySelectorAll('#scanCoursesTable tbody tr');
                const tbody = document.querySelector("#gradesTable tbody");
                
                // Only overwrite if scan rows have actual course inputs (not empty placeholder)
                if (scanRows.length > 0 && !scanRows[0].querySelector('td[colspan]')) {
                    tbody.innerHTML = '';
                    scanRows.forEach(sr => {
                        const titleInput = sr.querySelector('.scan-course-title');
                        const marksInput = sr.querySelector('.scan-course-marks');
                        const gradeInput = sr.querySelector('.scan-course-grade');
                        const crInput = sr.querySelector('.scan-course-cr');
                        if (!titleInput) return;

                        const title = titleInput.value.trim();
                        const marks = marksInput.value.trim();
                        const grade = gradeInput.value.trim().toUpperCase();
                        const cr = crInput.value.trim() || 3;

                        window.addRow({ title, marks, grade, credits: cr });
                    });
                }

                window.toggleModal('scanModal');
                window.calculateResult();
                window.showToast('✅ All scanned subjects populated and calculated successfully!', 'success');
            };

            /* ====== Realistic Sample Transcript Generator (1-Click Test Demo) ====== */
            window.loadDemoTranscript = function() {
                window.showToast('Generating official KFUEIT sample transcript...', 'info', 2000);
                
                const canvas = document.createElement('canvas');
                canvas.width = 1000;
                canvas.height = 750;
                const ctx = canvas.getContext('2d');

                // White paper background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Header & Borders
                ctx.strokeStyle = '#003366';
                ctx.lineWidth = 4;
                ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

                ctx.fillStyle = '#003366';
                ctx.font = 'bold 26px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('KHWAJA FAREED UNIVERSITY OF ENGINEERING & IT', canvas.width / 2, 70);

                ctx.fillStyle = '#555555';
                ctx.font = 'bold 18px Arial, sans-serif';
                ctx.fillText('OFFICIAL SEMESTER RESULT TRANSCRIPT', canvas.width / 2, 105);

                // Student Info Box
                ctx.textAlign = 'left';
                ctx.fillStyle = '#111111';
                ctx.font = '16px Arial, sans-serif';
                ctx.fillText('Student Name: Muhammad Ahmad Khan', 50, 160);
                ctx.fillText('Roll No: BSCS-F22-045', 50, 190);
                ctx.fillText('Program: BS Computer Science', 50, 220);

                ctx.fillText('Previous CGPA: 3.42', 650, 160);
                ctx.fillText('Total Credits Earned: 64', 650, 190);
                ctx.fillText('Semester SGPA: 3.81', 650, 220);

                // Courses Table
                const startY = 270;
                ctx.fillStyle = '#e6f0fa';
                ctx.fillRect(50, startY, 900, 36);

                ctx.fillStyle = '#003366';
                ctx.font = 'bold 15px Arial, sans-serif';
                ctx.fillText('Course Code & Title', 65, startY + 24);
                ctx.fillText('Cr. Hrs', 550, startY + 24);
                ctx.fillText('Marks', 670, startY + 24);
                ctx.fillText('Grade', 780, startY + 24);
                ctx.fillText('GP', 880, startY + 24);

                const sampleCourses = [
                    { title: 'CS-201 Data Structures & Algorithms', cr: '3', marks: '87', grade: 'A', gp: '4.00' },
                    { title: 'CS-203 Computer Org & Assembly', cr: '4', marks: '78', grade: 'B+', gp: '3.30' },
                    { title: 'MATH-202 Linear Algebra', cr: '3', marks: '82', grade: 'A-', gp: '3.70' },
                    { title: 'SE-201 Software Engineering Spec', cr: '3', marks: '92', grade: 'A', gp: '4.00' },
                    { title: 'ISL-101 Islamic Studies', cr: '2', marks: '96', grade: 'A+', gp: '4.00' }
                ];

                ctx.font = '15px Arial, sans-serif';
                sampleCourses.forEach((c, idx) => {
                    const rowY = startY + 45 + (idx * 40);
                    ctx.fillStyle = idx % 2 === 0 ? '#fcfcfc' : '#f5f8fc';
                    ctx.fillRect(50, rowY - 20, 900, 38);

                    ctx.fillStyle = '#222222';
                    ctx.fillText(c.title, 65, rowY + 5);
                    ctx.fillText(c.cr, 565, rowY + 5);
                    ctx.fillText(c.marks, 680, rowY + 5);
                    ctx.fillText(c.grade, 790, rowY + 5);
                    ctx.fillText(c.gp, 880, rowY + 5);
                });

                // Footer note
                ctx.fillStyle = '#777777';
                ctx.font = 'italic 13px Arial, sans-serif';
                ctx.fillText('Official Examination Branch Gazette • Cumulative CGPA calculated per KFUEIT Grading Policy', 50, 580);

                canvas.toBlob(blob => {
                    const file = new File([blob], 'sample_kfueit_transcript.png', { type: 'image/png' });
                    processTranscriptFile(file);
                }, 'image/png');
            };

            /* ====== Realistic Sample PDF Transcript Generator ====== */
            window.loadDemoPdfTranscript = function() {
                window.showToast('Generating official KFUEIT sample PDF transcript...', 'info', 2000);
                
                const textLines = [
                    "KHWAJA FAREED UNIVERSITY OF ENGINEERING & IT",
                    "OFFICIAL SEMESTER RESULT TRANSCRIPT",
                    "Student Name: Muhammad Ahmad Khan",
                    "Roll No: BSCS-F22-045",
                    "Previous CGPA: 3.42       Total Credits Earned: 64       Semester SGPA: 3.81",
                    "",
                    "Course Code & Title                       Cr.Hrs   Marks   Grade   GP",
                    "CS-201 Data Structures & Algorithms           3       87       A      4.00",
                    "CS-203 Computer Org & Assembly                4       78       B+     3.30",
                    "MATH-202 Linear Algebra                       3       82       A-     3.70",
                    "SE-201 Software Engineering Spec              3       92       A      4.00",
                    "ISL-101 Islamic Studies                       2       96       A+     4.00"
                ];

                let streamBody = "BT\n/F1 14 Tf\n50 720 Td\n";
                textLines.forEach((line, index) => {
                    if (index === 0) streamBody += `/F1 16 Tf (${line}) Tj\n`;
                    else if (index === 1) streamBody += `/F1 12 Tf 0 -22 Td (${line}) Tj\n`;
                    else if (index === 2) streamBody += `/F1 11 Tf 0 -30 Td (${line}) Tj\n`;
                    else if (index === 3 || index === 4) streamBody += `0 -18 Td (${line}) Tj\n`;
                    else if (index === 6) streamBody += `/F1 11 Tf 0 -30 Td (${line}) Tj\n`;
                    else if (index >= 7) streamBody += `0 -20 Td (${line}) Tj\n`;
                });
                streamBody += "ET\n";

                const encoder = new TextEncoder();
                const streamLength = encoder.encode(streamBody).length;

                const objects = [
                    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
                    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
                    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
                    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
                    `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamBody}endstream\nendobj\n`
                ];

                let output = "%PDF-1.4\n";
                const offsets = [0];
                for (const obj of objects) {
                    offsets.push(encoder.encode(output).length);
                    output += obj;
                }
                const xrefStart = encoder.encode(output).length;
                output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
                for (let i = 1; i <= objects.length; i++) {
                    output += String(offsets[i]).padStart(10, '0') + " 00000 n \n";
                }
                output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

                const blob = new Blob([output], { type: 'application/pdf' });
                const file = new File([blob], 'sample_kfueit_transcript.pdf', { type: 'application/pdf' });
                processTranscriptFile(file);
            };

            /* ====== Drag & Drop and Clipboard Paste Listeners ====== */
            const dropzone = document.getElementById('ocrDropzone');
            if (dropzone) {
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropzone.addEventListener(eventName, e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropzone.classList.add('dragover');
                    }, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropzone.addEventListener(eventName, e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropzone.classList.remove('dragover');
                    }, false);
                });

                dropzone.addEventListener('drop', e => {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    if (files && files.length > 0) processTranscriptFile(files[0]);
                }, false);
            }

            // Global paste listener (Ctrl + V anywhere)
            window.addEventListener('paste', e => {
                const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
                if (!items) return;
                for (const item of items) {
                    if (item.type.indexOf('image') !== -1) {
                        const file = item.getAsFile();
                        if (file) {
                            window.showToast('📋 Pasted image screenshot detected! Scanning...', 'info', 2500);
                            processTranscriptFile(file);
                            break;
                        }
                    }
                }
            });

            /* ====== Modal Quick Converter ====== */
            document.getElementById('convGrade').addEventListener('input', function() {
                const g = this.value.toUpperCase().trim();
                document.getElementById('convMarks').value = '';
                document.getElementById('convResult').textContent = GRADE_RANGES[g] ? `Range: ${GRADE_RANGES[g]}` : '';
            });
            document.getElementById('convMarks').addEventListener('input', function() {
                const m = parseFloat(this.value);
                document.getElementById('convGrade').value = '';
                if (!isNaN(m) && m >= 0 && m <= 100) {
                    const s = getStatsFromMarks(m);
                    document.getElementById('convResult').textContent = `Grade: ${s.grade} | GP: ${s.gp.toFixed(2)}`;
                } else document.getElementById('convResult').textContent = '';
            });

            /* ====== Target CGPA Planner ("What-If" Simulator) ====== */
            window.openTargetModal = function() {
                const prevCGPA = parseFloat(document.getElementById("prevCGPA").value);
                const prevCredits = parseFloat(document.getElementById("prevCredits").value);
                
                // Calculate current semester credits from table
                let semCredits = 0;
                document.querySelectorAll("#gradesTable tbody tr").forEach(row => {
                    const c = parseFloat(row.querySelector(".credits-input")?.value);
                    if (!isNaN(c) && c > 0) semCredits += c;
                });

                if (!isNaN(prevCGPA)) document.getElementById("planCurrentCGPA").value = prevCGPA.toFixed(2);
                if (!isNaN(prevCredits)) document.getElementById("planCompletedCredits").value = Math.round(prevCredits);
                if (semCredits > 0) document.getElementById("planUpcomingCredits").value = semCredits;

                window.toggleModal('targetModal');
            };

            window.calculateTargetPlan = function() {
                const currentCGPA = parseFloat(document.getElementById("planCurrentCGPA").value) || 0;
                const completedCredits = parseFloat(document.getElementById("planCompletedCredits").value) || 0;
                const targetCGPA = parseFloat(document.getElementById("planTargetCGPA").value);
                const upcomingCredits = parseFloat(document.getElementById("planUpcomingCredits").value) || 15;

                const resultBox = document.getElementById("targetResultBox");
                if (isNaN(targetCGPA) || targetCGPA <= 0 || targetCGPA > 4.0) {
                    window.showToast('Please enter a valid Target CGPA between 0.01 and 4.00.', 'error');
                    return;
                }

                if (completedCredits <= 0) {
                    resultBox.style.display = 'block';
                    resultBox.innerHTML = `
                        <div class="target-result-header">
                            <div>
                                <div style="font-size:0.65rem; color:rgba(255,255,255,0.5); text-transform:uppercase;">Required Semester SGPA</div>
                                <div class="target-req-badge">${targetCGPA.toFixed(2)}</div>
                            </div>
                            <div class="target-status-pill status-achievable">First Semester</div>
                        </div>
                        <div class="target-roadmap-card">
                            As this is your first semester, simply score <strong>${targetCGPA.toFixed(2)} SGPA</strong> to attain your target CGPA of <strong>${targetCGPA.toFixed(2)}</strong>!
                        </div>
                    `;
                    return;
                }

                const totalCredits = completedCredits + upcomingCredits;
                const targetTotalPoints = targetCGPA * totalCredits;
                const currentPoints = currentCGPA * completedCredits;
                const reqSemPoints = targetTotalPoints - currentPoints;
                const reqSGPA = reqSemPoints / upcomingCredits;
                const maxPossibleCGPA = (currentPoints + 4.0 * upcomingCredits) / totalCredits;

                let statusClass = 'status-achievable';
                let statusText = 'Achievable 🚀';
                let roadmapHtml = '';

                if (reqSGPA > 4.0) {
                    statusClass = 'status-impossible';
                    statusText = 'Needs More Semesters ⚠️';
                    
                    let semestersAt4 = 'N/A';
                    if (targetCGPA < 4.0) {
                        const creditsNeeded = (completedCredits * (targetCGPA - currentCGPA)) / (4.0 - targetCGPA);
                        semestersAt4 = Math.ceil(creditsNeeded / upcomingCredits);
                    }

                    roadmapHtml = `
                        Target CGPA of <strong>${targetCGPA.toFixed(2)}</strong> cannot be achieved in a single semester of ${upcomingCredits} credits (would require an impossible SGPA of <strong>${reqSGPA.toFixed(2)}</strong>).
                        <br><br>
                        • <strong>Max CGPA Possible this semester (at 4.00 SGPA):</strong> <strong>${maxPossibleCGPA.toFixed(2)}</strong>
                        <br>
                        • <strong>Roadmap:</strong> You need approximately <strong>${semestersAt4} semester(s)</strong> with straight <strong>4.00 SGPA</strong> to reach <strong>${targetCGPA.toFixed(2)} CGPA</strong>.
                    `;
                } else if (reqSGPA <= 0.0) {
                    statusClass = 'status-easy';
                    statusText = 'Already Maintained ✅';
                    roadmapHtml = `
                        Your target of <strong>${targetCGPA.toFixed(2)}</strong> is already below your current CGPA of <strong>${currentCGPA.toFixed(2)}</strong>. Even with minimal passing performance, your CGPA will stay above target.
                    `;
                } else {
                    statusClass = reqSGPA >= 3.7 ? 'status-impossible' : 'status-achievable';
                    statusText = reqSGPA >= 3.7 ? 'High Target 🔥' : 'Achievable 🚀';

                    let suggestedGrades = 'Mix of A and B+';
                    if (reqSGPA >= 3.85) suggestedGrades = 'Straight A+ / A in all subjects';
                    else if (reqSGPA >= 3.5) suggestedGrades = 'Mostly A (86%+) and A- (80%+)';
                    else if (reqSGPA >= 3.0) suggestedGrades = 'Mostly B (72%+) and B+ (76%+)';
                    else suggestedGrades = 'Mix of C+ and B grades';

                    roadmapHtml = `
                        To achieve your target CGPA of <strong>${targetCGPA.toFixed(2)}</strong>, you must score an SGPA of at least <strong>${reqSGPA.toFixed(2)}</strong> across your upcoming <strong>${upcomingCredits} credit hours</strong>.
                        <br><br>
                        • <strong>Suggested Target:</strong> ${suggestedGrades}
                        <br>
                        • <strong>Max CGPA achievable this semester:</strong> <strong>${maxPossibleCGPA.toFixed(2)}</strong> (if you achieve 4.00)
                    `;
                }

                resultBox.style.display = 'block';
                resultBox.innerHTML = `
                    <div class="target-result-header">
                        <div>
                            <div style="font-size:0.65rem; color:rgba(255,255,255,0.5); text-transform:uppercase;">Required Semester SGPA</div>
                            <div class="target-req-badge" style="color:${reqSGPA > 4.0 ? 'var(--danger-color)' : (reqSGPA >= 3.5 ? 'var(--primary-color)' : 'var(--accent-cyan)')}">
                                ${reqSGPA > 4.0 ? '> 4.00' : Math.max(0, reqSGPA).toFixed(2)}
                            </div>
                        </div>
                        <div class="target-status-pill ${statusClass}">${statusText}</div>
                    </div>
                    <div class="target-roadmap-card">
                        ${roadmapHtml}
                    </div>
                    <div class="target-stats-row">
                        <div class="target-mini-stat">
                            <span>Max CGPA in 1 Sem</span>
                            <strong>${maxPossibleCGPA.toFixed(2)}</strong>
                        </div>
                        <div class="target-mini-stat">
                            <span>Total Credits After Sem</span>
                            <strong>${totalCredits} Cr</strong>
                        </div>
                    </div>
                `;
            };

            /* ====== Official KFUEIT Result Card Generator & Export ====== */
            window.exportResultCard = function() {
                const rows = document.querySelectorAll("#gradesTable tbody tr");
                const courses = [];
                rows.forEach(r => {
                    const title = r.querySelector(".subject-input")?.value.trim() || 'Untitled Subject';
                    const marks = r.querySelector(".marks-input")?.value.trim();
                    const grade = r.querySelector(".grade-input")?.value.trim().toUpperCase();
                    const cr = parseFloat(r.querySelector(".credits-input")?.value) || 3;
                    const gp = r.querySelector(".gp-display")?.textContent.trim();
                    const isRepeat = r.querySelector(".repeat-toggle-btn")?.classList.contains('active');
                    if (grade && gp && gp !== '-') {
                        courses.push({ title, marks: marks || '-', grade, cr, gp, isRepeat });
                    }
                });

                if (courses.length === 0) {
                    window.showToast('Please enter at least 1 course and calculate GPA before exporting.', 'error');
                    return;
                }

                window.showToast('Generating official KFUEIT HD result card...', 'info', 2000);

                const studentName = document.getElementById("studentName")?.value.trim() || "KFUEIT Student";
                const displayGPA = document.getElementById("displayGPA")?.textContent || "0.00";
                const displayLabel = document.getElementById("displayLabel")?.textContent || "GPA";

                let semPoints = 0, semCredits = 0;
                courses.forEach(c => {
                    semPoints += (parseFloat(c.gp) * c.cr);
                    semCredits += c.cr;
                });
                const sgpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : "0.00";

                // Setup Canvas (1100px width for crystal-clear HD export)
                const canvas = document.createElement("canvas");
                const courseRowHeight = 44;
                const canvasWidth = 1100;
                const canvasHeight = 650 + (courses.length * courseRowHeight);
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                const ctx = canvas.getContext("2d");

                // Deep Midnight Gradient Background
                const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                bgGrad.addColorStop(0, '#0a0a1a');
                bgGrad.addColorStop(0.5, '#0e112a');
                bgGrad.addColorStop(1, '#070814');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // Neon Cyber Border Glow
                ctx.strokeStyle = '#4cc9f0';
                ctx.lineWidth = 4;
                ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);
                ctx.strokeStyle = 'rgba(247, 37, 133, 0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(26, 26, canvasWidth - 52, canvasHeight - 52);

                // Header Banner
                ctx.fillStyle = '#ffffff';
                ctx.font = '800 24px Outfit, Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('KHWAJA FAREED UNIVERSITY OF ENGINEERING & IT', canvasWidth / 2, 75);

                ctx.fillStyle = '#4cc9f0';
                ctx.font = '700 15px Outfit, Arial, sans-serif';
                ctx.fillText('OFFICIAL SEMESTER RESULT TRANSCRIPT CARD', canvasWidth / 2, 105);

                // Student Details Box
                ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.fillRect(50, 130, canvasWidth - 100, 70);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.strokeRect(50, 130, canvasWidth - 100, 70);

                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffffff';
                ctx.font = '600 18px Outfit, Arial, sans-serif';
                ctx.fillText(`Student: ${studentName}`, 70, 162);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '14px Outfit, Arial, sans-serif';
                const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                ctx.fillText(`Date Generated: ${dateStr} • KFUEIT Grading Policy`, 70, 185);

                // Dual GPA Rings / Badges
                const cardWidth = 180, cardHeight = 70;
                const sgpaCardX = canvasWidth - 430;
                ctx.fillStyle = 'rgba(76, 201, 240, 0.12)';
                ctx.fillRect(sgpaCardX, 130, cardWidth, cardHeight);
                ctx.strokeStyle = '#4cc9f0';
                ctx.strokeRect(sgpaCardX, 130, cardWidth, cardHeight);

                ctx.textAlign = 'center';
                ctx.fillStyle = '#4cc9f0';
                ctx.font = '700 12px Outfit, Arial, sans-serif';
                ctx.fillText('SEMESTER SGPA', sgpaCardX + (cardWidth / 2), 152);
                ctx.fillStyle = '#ffffff';
                ctx.font = '800 24px Outfit, Arial, sans-serif';
                ctx.fillText(sgpa, sgpaCardX + (cardWidth / 2), 183);

                // CGPA Card
                const cgpaCardX = canvasWidth - 230;
                ctx.fillStyle = 'rgba(247, 37, 133, 0.12)';
                ctx.fillRect(cgpaCardX, 130, cardWidth, cardHeight);
                ctx.strokeStyle = '#f72585';
                ctx.strokeRect(cgpaCardX, 130, cardWidth, cardHeight);

                ctx.fillStyle = '#f72585';
                ctx.font = '700 12px Outfit, Arial, sans-serif';
                ctx.fillText(displayLabel === 'CGPA' ? 'CUMULATIVE CGPA' : 'FINAL GPA', cgpaCardX + (cardWidth / 2), 152);
                ctx.fillStyle = '#ffffff';
                ctx.font = '800 24px Outfit, Arial, sans-serif';
                ctx.fillText(displayGPA, cgpaCardX + (cardWidth / 2), 183);

                // Table Header
                const startY = 230;
                ctx.fillStyle = 'rgba(76, 201, 240, 0.18)';
                ctx.fillRect(50, startY, canvasWidth - 100, 38);
                ctx.strokeStyle = 'rgba(76, 201, 240, 0.4)';
                ctx.strokeRect(50, startY, canvasWidth - 100, 38);

                ctx.textAlign = 'left';
                ctx.fillStyle = '#4cc9f0';
                ctx.font = '700 14px Outfit, Arial, sans-serif';
                ctx.fillText('Course Title', 70, startY + 24);
                ctx.textAlign = 'center';
                ctx.fillText('Cr. Hrs', 630, startY + 24);
                ctx.fillText('Marks', 740, startY + 24);
                ctx.fillText('Grade', 840, startY + 24);
                ctx.fillText('GP', 930, startY + 24);
                ctx.fillText('Status', 1010, startY + 24);

                // Course Rows
                courses.forEach((c, idx) => {
                    const rowY = startY + 38 + (idx * courseRowHeight);
                    ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)';
                    ctx.fillRect(50, rowY, canvasWidth - 100, courseRowHeight);

                    ctx.textAlign = 'left';
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '500 15px Outfit, Arial, sans-serif';
                    ctx.fillText(c.title.length > 45 ? c.title.substring(0, 45) + '...' : c.title, 70, rowY + 27);

                    ctx.textAlign = 'center';
                    ctx.fillText(c.cr, 630, rowY + 27);
                    ctx.fillText(c.marks, 740, rowY + 27);
                    
                    ctx.font = '700 15px Outfit, Arial, sans-serif';
                    ctx.fillStyle = (parseFloat(c.gp) >= 3.0) ? '#00ff99' : (parseFloat(c.gp) < 2.0 ? '#ff0055' : '#ffb703');
                    ctx.fillText(c.grade, 840, rowY + 27);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '500 15px Outfit, Arial, sans-serif';
                    ctx.fillText(c.gp, 930, rowY + 27);

                    if (c.isRepeat) {
                        ctx.fillStyle = '#ffb703';
                        ctx.font = '700 12px Outfit, Arial, sans-serif';
                        ctx.fillText('🔁 Repeat', 1010, rowY + 27);
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.font = '13px Outfit, Arial, sans-serif';
                        ctx.fillText('Regular', 1010, rowY + 27);
                    }
                });

                // Summary Footer Bar
                const footerY = startY + 38 + (courses.length * courseRowHeight) + 15;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fillRect(50, footerY, canvasWidth - 100, 50);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(50, footerY, canvasWidth - 100, 50);

                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '600 14px Outfit, Arial, sans-serif';
                ctx.fillText(`Semester Credits: ${semCredits}  •  Quality Points: ${semPoints.toFixed(2)}  •  Courses: ${courses.length}`, 70, footerY + 30);

                ctx.textAlign = 'right';
                ctx.fillStyle = '#4cc9f0';
                ctx.fillText(`Academic Standing: ${parseFloat(displayGPA) >= 3.0 ? 'Good Standing 🌟' : 'Warning 📚'}`, canvasWidth - 70, footerY + 30);

                // Watermark Signature
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.font = 'italic 12px Outfit, Arial, sans-serif';
                ctx.fillText('Calculated via KFUEIT CGPA Calculator • Designed & Developed by Ahmad Khan', canvasWidth / 2, canvasHeight - 35);

                // Convert to blob and download
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const filename = studentName ? `KFUEIT_Result_${studentName.replace(/\s+/g, '_')}.png` : 'KFUEIT_Result_Card.png';
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        window.showToast('📥 Official Result Card downloaded in High Definition!', 'success', 4000);
                    }, 200);
                }, 'image/png');
            };


            /* Visuals */
            const bgCanvas = document.getElementById("bgCanvas");
            const cfCanvas = document.getElementById("confettiCanvas");
            const bgCtx = bgCanvas.getContext("2d");
            const cfCtx = cfCanvas.getContext("2d");
            let w, h, particles = [], confetti = [];

            // Mouse Interaction Logic
            let mouse = { x: null, y: null };
            window.addEventListener('mousemove', (e) => { 
                mouse.x = e.clientX; 
                mouse.y = e.clientY; 
            });
            window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

            function resize() { w = window.innerWidth; h = window.innerHeight; bgCanvas.width = cfCanvas.width = w; bgCanvas.height = cfCanvas.height = h; }
            class P {
                constructor() { this.x=Math.random()*w; this.y=Math.random()*h; this.vx=(Math.random()-0.5)*2; this.vy=(Math.random()-0.5)*2; this.s=Math.random()*2+1; }
                up() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>w)this.vx*=-1; if(this.y<0||this.y>h)this.vy*=-1; }
                draw() { bgCtx.beginPath(); bgCtx.arc(this.x,this.y,this.s,0,Math.PI*2); bgCtx.fillStyle="rgba(76,201,240,0.5)"; bgCtx.fill(); }
            }
            function initP() { particles=[]; for(let i=0;i<80;i++) particles.push(new P()); }
            
            window.fireConfetti = function() {
                confetti=[]; for(let i=0;i<100;i++) confetti.push({x:w/2,y:h/2+100,vx:(Math.random()-0.5)*20,vy:Math.random()*-20,c:`hsl(${Math.random()*360},100%,60%)`});
            }
            function drawConf() {
                cfCtx.clearRect(0,0,w,h);
                for(let i=confetti.length-1;i>=0;i--){
                    let p=confetti[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.5;
                    cfCtx.fillStyle=p.c; cfCtx.fillRect(p.x,p.y,6,6);
                    if(p.y>h) confetti.splice(i,1);
                }
            }

            function anim() {
                bgCtx.clearRect(0,0,w,h);
                particles.forEach((p,i) => {
                    p.up(); p.draw();
                    
                    // Particle connections
                    for(let j=i;j<particles.length;j++){
                        let dx=p.x-particles[j].x, dy=p.y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
                        if(d<100){ bgCtx.beginPath(); bgCtx.strokeStyle=`rgba(76,201,240,${1-d/100})`; bgCtx.moveTo(p.x,p.y); bgCtx.lineTo(particles[j].x,particles[j].y); bgCtx.stroke(); }
                    }

                    // Mouse Interaction
                    if (mouse.x != null) {
                        let dx = p.x - mouse.x;
                        let dy = p.y - mouse.y;
                        let d = Math.sqrt(dx*dx + dy*dy);
                        if (d < 150) {
                            bgCtx.beginPath();
                            bgCtx.strokeStyle = `rgba(247, 37, 133, ${1 - d/150})`;
                            bgCtx.lineWidth = 0.8;
                            bgCtx.moveTo(p.x, p.y);
                            bgCtx.lineTo(mouse.x, mouse.y);
                            bgCtx.stroke();
                        }
                    }
                });
                if(confetti.length) drawConf();
                requestAnimationFrame(anim);
            }
            /* ====== Progressive Web App (PWA) & Offline Module ====== */
            let deferredInstallPrompt = null;

            // 1. Service Worker Registration
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./sw.js')
                        .then(reg => {
                            console.log('[PWA] Service Worker registered with scope:', reg.scope);
                            reg.onupdatefound = () => {
                                const installingWorker = reg.installing;
                                if (installingWorker) {
                                    installingWorker.onstatechange = () => {
                                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                            window.showToast('🚀 New version available! Reloading...', 'info');
                                            setTimeout(() => window.location.reload(), 1500);
                                        }
                                    };
                                }
                            };
                        })
                        .catch(err => {
                            console.warn('[PWA] Service Worker registration failed:', err);
                        });
                });
            }

            // 2. Install Prompt Handling
            const pwaInstallBtn = document.getElementById('pwaInstallBtn');
            const pwaIosBtn = document.getElementById('pwaIosBtn');

            // Check if already running as standalone PWA
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

            // Detect iOS Safari
            const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (!isStandalone) {
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    deferredInstallPrompt = e;
                    if (pwaInstallBtn) {
                        pwaInstallBtn.style.display = 'inline-flex';
                    }
                });

                if (isIos && pwaIosBtn) {
                    pwaIosBtn.style.display = 'inline-flex';
                }
            }

            window.installPWA = async function() {
                if (!deferredInstallPrompt) {
                    window.showToast('📲 Open browser menu & select "Install App" or "Add to Home screen"', 'info');
                    return;
                }
                try {
                    deferredInstallPrompt.prompt();
                    const choice = await deferredInstallPrompt.userChoice;
                    if (choice && choice.outcome === 'accepted') {
                        window.showToast('🎉 KFUEIT GPA app installed successfully!', 'success');
                        if (window.fireConfetti) window.fireConfetti();
                        if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
                    }
                } catch (err) {
                    console.error('[PWA] Install prompt error:', err);
                }
                deferredInstallPrompt = null;
            };

            window.addEventListener('appinstalled', () => {
                window.showToast('🎉 KFUEIT GPA app installed on your device!', 'success');
                if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
                deferredInstallPrompt = null;
            });

            // 3. Online / Offline Connectivity Detection
            const offlineIndicator = document.getElementById('offlineIndicator');

            function updateNetworkStatus() {
                if (!navigator.onLine) {
                    if (offlineIndicator) offlineIndicator.style.display = 'flex';
                    window.showToast('⚡ Offline Mode Active: App works completely offline!', 'info', 4500);
                } else {
                    if (offlineIndicator) offlineIndicator.style.display = 'none';
                }
            }

            window.addEventListener('offline', updateNetworkStatus);
            window.addEventListener('online', () => {
                if (offlineIndicator) offlineIndicator.style.display = 'none';
                window.showToast('🌐 Back online!', 'success');
            });

            if (!navigator.onLine) {
                updateNetworkStatus();
            }

            window.onresize=()=>{resize();initP();}; resize(); initP(); anim(); window.initTable();
        })();

