// ============================================
// HISTORY.JS - SIMPLIFIED WORKING VERSION
// ============================================

(function() {
    'use strict';

    // Simple variables
    let historyData = [];
    let filteredHistory = [];

    // API Configuration
    const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000';

    // Initialize History Page
    function initializeHistoryPage() {
        console.log('📊 Initializing History Page...');
        
        // Setup event listeners
        setupEventListeners();
        
        // Load history
        loadHistory();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshHistory');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshHistory);
        }
        
        // Export button
        const exportBtn = document.getElementById('exportHistory');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportHistory);
        }
        
        // Search input
        const searchInput = document.getElementById('historySearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                setTimeout(() => {
                    filterHistory();
                }, 300);
            });
        }
        
        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', filterHistory);
        });
    }

    // Load History
    async function loadHistory() {
        try {
            showLoading();
            
            const response = await fetch(`${API_BASE_URL}/history?limit=50`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.history && Array.isArray(data.history)) {
                historyData = data.history;
                filteredHistory = [...historyData];
                
                if (historyData.length === 0) {
                    showEmptyState();
                } else {
                    updateHistoryDisplay();
                    updateSummaryStats();
                    updateCharts();
                }
            } else {
                showEmptyState();
            }
            
        } catch (error) {
            console.error('❌ Error loading history:', error);
            showEmptyState();
        } finally {
            hideLoading();
        }
    }

    // Filter History
    function filterHistory() {
        const riskFilter = document.getElementById('filterRisk')?.value;
        const predictionFilter = document.getElementById('filterPrediction')?.value;
        const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
        
        filteredHistory = historyData.filter(item => {
            // Risk filter
            if (riskFilter && riskFilter !== '') {
                const riskPercentage = item.risk_percentage || 0;
                if (riskFilter === 'low' && riskPercentage >= 30) return false;
                if (riskFilter === 'medium' && (riskPercentage < 30 || riskPercentage >= 70)) return false;
                if (riskFilter === 'high' && riskPercentage < 70) return false;
            }
            
            // Prediction filter
            if (predictionFilter && predictionFilter !== '') {
                if (predictionFilter === 'benign' && item.prediction !== 'Benign') return false;
                if (predictionFilter === 'malignant' && item.prediction !== 'Malignant') return false;
            }
            
            // Search filter
            if (searchTerm) {
                const searchable = [
                    item.prediction || '',
                    getRiskLevel(item.risk_percentage || 0),
                    item.user_data?.Age?.toString() || '',
                    item.user_data?.Gender_Male === 1 ? 'male' : 'female'
                ].join(' ').toLowerCase();
                
                return searchable.includes(searchTerm);
            }
            
            return true;
        });
        
        updateHistoryDisplay();
        updateSummaryStats();
        updateCharts();
    }

    // Update History Display
    function updateHistoryDisplay() {
        const tableBody = document.getElementById('historyTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (filteredHistory.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="no-data-message">
                            <i class="fas fa-search"></i>
                            <h4>No matching records found</h4>
                            <p>Try adjusting your filters</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        filteredHistory.forEach((item, index) => {
            const row = createHistoryRow(item, index);
            tableBody.appendChild(row);
        });
    }

    // Create History Row (SIMPLIFIED - NO DELETE BUTTON)
    function createHistoryRow(item, index) {
        const row = document.createElement('tr');
        row.className = 'history-item';
        
        try {
            const date = new Date(item.timestamp || Date.now());
            const age = item.user_data?.Age || 'N/A';
            const gender = item.user_data?.Gender_Male === 1 ? 'Male' : 'Female';
            const riskPercentage = item.risk_percentage || 0;
            const prediction = item.prediction || 'N/A';
            
            row.innerHTML = `
                <td class="history-date">
                    <div class="date-display">
                        <div class="date">${date.toLocaleDateString()}</div>
                        <div class="time">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </td>
                
                <td class="history-patient">
                    <div class="patient-info">
                        <div class="patient-avatar">
                            <i class="fas fa-user${gender === 'Male' ? '' : '-female'}"></i>
                        </div>
                        <div class="patient-details">
                            <h4>Patient ${index + 1}</h4>
                            <p><i class="fas fa-birthday-cake"></i> ${age} yrs • <i class="fas fa-${gender === 'Male' ? 'mars' : 'venus'}"></i> ${gender}</p>
                        </div>
                    </div>
                </td>
                
                <td class="history-risk">
                    <div class="risk-display">
                        <div class="risk-gauge">
                            <div class="gauge-value">${riskPercentage.toFixed(1)}%</div>
                        </div>
                        <div class="risk-level ${getRiskLevelClass(riskPercentage)}">
                            ${getRiskLevel(riskPercentage)}
                        </div>
                    </div>
                </td>
                
                <td class="history-prediction">
                    <span class="prediction-badge ${prediction.toLowerCase()}">
                        ${prediction}
                    </span>
                </td>
                
                <td class="history-factors">
                    <div class="factors-tags">
                        ${getTopFactors(item.user_data).slice(0, 2).map(factor => `
                            <span class="factor-tag">${factor}</span>
                        `).join('')}
                    </div>
                </td>
                
                <td class="history-actions">
                    <button class="btn-view" onclick="showDetails('${index}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
        } catch (error) {
            console.error('Error creating row:', error);
            row.innerHTML = '<td colspan="6" class="text-center">Error displaying</td>';
        }
        
        return row;
    }

    // Show Details
    function showDetails(index) {
        const idx = parseInt(index);
        const item = filteredHistory[idx];
        if (!item) return;

        const modal = document.getElementById('detailsModal');
        if (!modal) return;

        // Populate modal data
        const riskPercentage = item.risk_percentage || 0;
        const prediction = item.prediction || 'N/A';
        const date = new Date(item.timestamp || Date.now());
        const age = item.user_data?.Age || 'N/A';
        const gender = item.user_data?.Gender_Male === 1 ? 'Male' : 'Female';

        document.getElementById('modalRiskValue').textContent = `${riskPercentage.toFixed(1)}%`;
        document.getElementById('modalPredictionTitle').textContent = `Prediction Result: ${prediction}`;
        document.getElementById('modalDateInfo').textContent = `Date: ${date.toLocaleString()}`;
        
        // Risk level & badges
        const riskLevel = getRiskLevel(riskPercentage);
        const riskLevelBadge = document.getElementById('modalRiskLevel');
        if (riskLevelBadge) {
            riskLevelBadge.textContent = riskLevel;
            riskLevelBadge.className = `detail-badge risk-level-badge ${getRiskLevelClass(riskPercentage)}`;
        }

        const predictionBadge = document.getElementById('modalPredictionType');
        if (predictionBadge) {
            predictionBadge.textContent = prediction;
            predictionBadge.className = `detail-badge prediction-badge ${prediction.toLowerCase()}`;
        }

        // Patient info
        document.getElementById('modalPatientAge').textContent = `${age} years`;
        document.getElementById('modalPatientGender').textContent = gender;
        document.getElementById('modalTimestamp').textContent = date.toLocaleString();

        // Risk factors
        const factorsList = document.getElementById('modalRiskFactors');
        if (factorsList) {
            factorsList.innerHTML = '';
            const factors = getTopFactors(item.user_data);
            if (factors.length === 0) {
                factorsList.innerHTML = '<div class="risk-factor no-factors"><i class="fas fa-check-circle text-success"></i> No major risk factors detected</div>';
            } else {
                factors.forEach(factor => {
                    const factorDiv = document.createElement('div');
                    factorDiv.className = 'risk-factor active';
                    factorDiv.innerHTML = `<i class="fas fa-exclamation-triangle text-warning"></i> ${factor}`;
                    factorsList.appendChild(factorDiv);
                });
            }
        }

        // Risk meter bar
        const riskMeter = document.getElementById('modalRiskMeter');
        if (riskMeter) {
            riskMeter.style.width = `${riskPercentage}%`;
            // Set risk meter color
            if (riskPercentage < 30) {
                riskMeter.style.backgroundColor = '#06d6a0'; // green
            } else if (riskPercentage < 70) {
                riskMeter.style.backgroundColor = '#4361ee'; // blue
            } else {
                riskMeter.style.backgroundColor = '#ef476f'; // red
            }
        }

        // SVG circle animation
        const circle = document.getElementById('modalRiskCircle');
        if (circle) {
            const radius = 80;
            const circumference = 2 * Math.PI * radius; // ~502
            const offset = circumference - (riskPercentage / 100) * circumference;
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${offset}`;
        }

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Close Details Modal
    function closeDetailsModal() {
        const modal = document.getElementById('detailsModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Expose to window object so inline onclick handles work
    window.showDetails = showDetails;
    window.closeDetailsModal = closeDetailsModal;

    // Update Summary Stats
    function updateSummaryStats() {
        // Total predictions
        const totalCount = document.getElementById('totalCount');
        if (totalCount) {
            totalCount.textContent = filteredHistory.length;
        }
        
        const totalPredictions = document.getElementById('totalPredictions');
        if (totalPredictions) {
            totalPredictions.textContent = `${filteredHistory.length} Predictions`;
        }
        
        // Benign cases
        const benignCount = document.getElementById('benignCount');
        if (benignCount) {
            const benignCases = filteredHistory.filter(item => item.prediction === 'Benign').length;
            benignCount.textContent = benignCases;
        }
        
        // Malignant cases
        const malignantCount = document.getElementById('malignantCount');
        if (malignantCount) {
            const malignantCases = filteredHistory.filter(item => item.prediction === 'Malignant').length;
            malignantCount.textContent = malignantCases;
        }

        // Average risk
        let avg = 0;
        if (filteredHistory.length > 0) {
            const sum = filteredHistory.reduce((acc, item) => acc + (item.risk_percentage || 0), 0);
            avg = sum / filteredHistory.length;
        }
        
        const avgRisk = document.getElementById('avgRisk');
        if (avgRisk) {
            avgRisk.textContent = `${avg.toFixed(1)}%`;
        }
        
        const avgRiskScore = document.getElementById('avgRiskScore');
        if (avgRiskScore) {
            avgRiskScore.textContent = `Avg Risk: ${avg.toFixed(1)}%`;
        }

        // Last updated
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            let lastDateText = '--';
            if (filteredHistory.length > 0) {
                const dates = filteredHistory.map(item => new Date(item.timestamp || 0).getTime());
                const maxDate = new Date(Math.max(...dates));
                lastDateText = maxDate.toLocaleDateString();
            }
            lastUpdated.textContent = `Updated: ${lastDateText}`;
        }
    }

    // Refresh History
    async function refreshHistory() {
        await loadHistory();
    }

    // Export History
    function exportHistory() {
        if (filteredHistory.length === 0) {
            alert('No data to export');
            return;
        }
        
        const csvData = filteredHistory.map(item => {
            const date = new Date(item.timestamp || Date.now());
            return [
                date.toLocaleString(),
                `${item.risk_percentage || 0}%`,
                item.prediction || 'N/A',
                item.user_data?.Age || 'N/A',
                item.user_data?.Gender_Male === 1 ? 'Male' : 'Female'
            ];
        });
        
        const csvContent = [
            ['Date', 'Risk Score', 'Prediction', 'Age', 'Gender'],
            ...csvData
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `history_export.csv`;
        a.click();
        
        alert(`Exported ${filteredHistory.length} records`);
    }



    
    // Helper Functions
    function getTopFactors(user_data) {
        if (!user_data) return [];
        const factors = [];
        if (user_data.Family_History === 1) factors.push('Family History');
        if (user_data.Radiation_Exposure === 1) factors.push('Radiation');
        if (user_data.Iodine_Deficiency === 1) factors.push('Iodine Def');
        return factors;
    }

    function getRiskLevel(percentage) {
        if (percentage < 30) return 'Low';
        if (percentage < 70) return 'Medium';
        return 'High';
    }

    function getRiskLevelClass(percentage) {
        if (percentage < 30) return 'low';
        if (percentage < 70) return 'medium';
        return 'high';
    }

    let distributionChartInstance = null;
    let trendChartInstance = null;

    function updateCharts() {
        if (!window.Chart) {
            console.warn('Chart.js not loaded');
            return;
        }

        // --- 1. Distribution Chart ---
        const distCanvasId = 'distributionChartCanvas';
        let distContainer = document.getElementById('distributionChart');
        if (distContainer) {
            distContainer.innerHTML = `<canvas id="${distCanvasId}"></canvas>`;
            const ctx = document.getElementById(distCanvasId).getContext('2d');
            
            const benignCount = filteredHistory.filter(item => item.prediction === 'Benign').length;
            const malignantCount = filteredHistory.filter(item => item.prediction === 'Malignant').length;

            if (distributionChartInstance) {
                distributionChartInstance.destroy();
            }

            distributionChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Benign', 'Malignant'],
                    datasets: [{
                        data: [benignCount, malignantCount],
                        backgroundColor: ['#06d6a0', '#ef476f'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15,
                                font: {
                                    family: "'Poppins', sans-serif"
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }

        // --- 2. Trend Chart ---
        const trendCanvasId = 'trendChartCanvas';
        let trendContainer = document.getElementById('trendChart');
        if (trendContainer) {
            trendContainer.innerHTML = `<canvas id="${trendCanvasId}"></canvas>`;
            const ctx = document.getElementById(trendCanvasId).getContext('2d');

            // Sort data chronologically for trend chart
            const sortedHistory = [...filteredHistory].sort((a, b) => {
                return new Date(a.timestamp || 0) - new Date(b.timestamp || 0);
            });

            const labels = sortedHistory.map(item => {
                const date = new Date(item.timestamp || Date.now());
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            });
            const dataPoints = sortedHistory.map(item => item.risk_percentage || 0);

            if (trendChartInstance) {
                trendChartInstance.destroy();
            }

            trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Risk Percentage',
                        data: dataPoints,
                        fill: true,
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#4361ee',
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            ticks: {
                                callback: value => value + '%'
                            }
                        }
                    }
                }
            });
        }
    }

    function showLoading() {
        const loading = document.getElementById('historyLoading');
        if (loading) loading.classList.remove('hidden');
    }

    function hideLoading() {
        const loading = document.getElementById('historyLoading');
        if (loading) loading.classList.add('hidden');
    }

    function showEmptyState() {
        const empty = document.getElementById('historyEmpty');
        if (empty) empty.classList.remove('hidden');
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('historyTableBody')) {
            initializeHistoryPage();
        }
    });

})();