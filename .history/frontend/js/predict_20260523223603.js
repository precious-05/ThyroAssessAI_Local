// ============================================
// PREDICT.JS - COMPLETE FIXED VERSION
// For ThyroAssess AI with MongoDB Backend
// ============================================

// Global variables
let predictionChart = null;
let currentFormData = null;
let isSubmitting = false;

// API Configuration
const API_CONFIG = {
    BASE_URL: window.API_BASE_URL || 'http://127.0.0.1:8000',  // Use 127.0.0.1
    ENDPOINTS: {
        PREDICT: '/predict',
        HEALTH: '/health',
        FEATURES: '/features'
    }
};

// Initialize Predict Page
function initializePredictPage() {
    console.log('🔮 Predict page initialized');
    
    // Initialize form elements
    initializeForm();
    
    // Initialize real-time validation
    initializeRealTimeValidation();
    
    // Initialize range indicators
    initializeRangeIndicators();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize results modal
    initializeResultsModal();
    
    // Setup event listeners
    setupPredictEventListeners();
    
    // Set default values
    setDefaultValues();
    
    // Initialize form steps
    initializeFormSteps();
    
    // Test backend connection
    testBackendConnection();
    
    console.log('✅ Predict page ready');
}

// Test Backend Connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connected:', data);
            showSuccessMessage('Backend connected successfully!', 'Ready');
        } else {
            console.warn('⚠️ Backend response:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ Backend not available:', error.message);
        showInfoMessage('Backend server not detected. Using demo mode.', 'Demo Mode');
    }
}

// Initialize Form
function initializeForm() {
    const form = document.getElementById('thyroidForm');
    if (!form) return;
    
    // Initialize floating labels
    const floatingInputs = form.querySelectorAll('.floating-input input, .floating-select select');
    floatingInputs.forEach(input => {
        // Check if input has value on load
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('has-value');
        }
        
        // Add input event
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
        
        // Add focus/blur events for better UX
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Initialize checkbox cards
    const checkboxes = form.querySelectorAll('.risk-factor-card input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const card = this.closest('.risk-factor-card');
            if (this.checked) {
                card.classList.add('checked');
            } else {
                card.classList.remove('checked');
            }
        });
    });
}

// Initialize Real-Time Validation
function initializeRealTimeValidation() {
    const validateInputs = document.querySelectorAll('.floating-input input[type="number"]');
    
    validateInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateNumberInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateNumberInput(this, true);
        });
    });
}

// Validate Number Input
function validateNumberInput(input, showError = false) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || Infinity;
    const parent = input.closest('.input-group');
    
    // Remove previous validation classes
    parent.classList.remove('valid', 'invalid');
    
    if (input.value.trim() === '') {
        return true;
    }
    
    if (isNaN(value)) {
        if (showError) {
            parent.classList.add('invalid');
            showInputError(input, 'Please enter a valid number');
        }
        return false;
    }
    
    if (value < min || value > max) {
        if (showError) {
            parent.classList.add('invalid');
            showInputError(input, `Value must be between ${min} and ${max}`);
        }
        return false;
    }
    
    parent.classList.add('valid');
    return true;
}

// Show Input Error
function showInputError(input, message) {
    const parent = input.closest('.input-group');
    let errorElement = parent.querySelector('.input-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        parent.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

// Initialize Range Indicators
function initializeRangeIndicators() {
    const rangeInputs = document.querySelectorAll('input[type="number"][min][max]');
    
    rangeInputs.forEach(input => {
        const parent = input.closest('.input-group');
        const rangeBar = parent?.querySelector('.range-fill');
        
        if (rangeBar) {
            updateRangeIndicator(input, rangeBar);
            
            input.addEventListener('input', function() {
                updateRangeIndicator(this, rangeBar);
            });
        }
    });
}

// Update Range Indicator
function updateRangeIndicator(input, rangeBar) {
    const value = parseFloat(input.value) || 0;
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    
    const percentage = ((value - min) / (max - min)) * 100;
    rangeBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    
    // Update color based on value
    if (percentage < 30) {
        rangeBar.style.background = 'var(--gradient-secondary, #06d6a0)';
    } else if (percentage < 70) {
        rangeBar.style.background = 'var(--gradient-primary, #4361ee)';
    } else {
        rangeBar.style.background = 'var(--gradient-accent, #ef476f)';
    }
}

// Initialize Interactive Elements
function initializeInteractiveElements() {
    // Input action buttons
    const actionButtons = document.querySelectorAll('.btn-input-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                showInfoMessage(tooltip, 'Information');
            }
        });
    });
    
    // Help button
    const helpButton = document.getElementById('formHelpBtn');
    if (helpButton) {
        helpButton.addEventListener('click', function(e) {
            e.preventDefault();
            showFormHelp();
        });
    }
    
    // Show results preview when form is being filled
    const form = document.getElementById('thyroidForm');
    if (form) {
        form.addEventListener('input', debounce(() => {
            updateResultsPreview();
        }, 500));
    }
}

// Show Form Help
function showFormHelp() {
    const helpContent = `
        <h4>Form Help Guide</h4>
        <p><strong>Age:</strong> Enter patient's age in years (1-120)</p>
        <p><strong>TSH Level:</strong> Normal range: 0.4-4.0 mIU/L | Max: 50</p>
        <p><strong>T3 Level:</strong> Normal range: 2.3-4.2 pg/mL | Max: 10</p>
        <p><strong>T4 Level:</strong> Normal range: 0.8-1.8 μg/dL | Max: 20</p>
        <p><strong>Nodule Size:</strong> Thyroid nodule diameter in cm (0-10)</p>
        <p><strong>Cancer Risk Score:</strong> 0=Low, 1=Moderate, 2=High Risk</p>
        <p><strong>Risk Factors:</strong> Check all that apply to the patient</p>
    `;
    
    showInfoMessage(helpContent, 'Form Instructions');
}

// Initialize Results Modal
function initializeResultsModal() {
    const modal = document.getElementById('resultsModal');
    if (!modal) return;
    
    // Close modal when clicking overlay
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeResultsModal);
    }
    
    // Close modal when clicking close button
    const closeButton = document.getElementById('closeResults');
    if (closeButton) {
        closeButton.addEventListener('click', closeResultsModal);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeResultsModal();
        }
    });
}

// Initialize Form Steps
function initializeFormSteps() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!steps.length || !progressFill) return;
    
    // Update step based on form completion
    const form = document.getElementById('thyroidForm');
    form.addEventListener('input', debounce(() => {
        updateFormProgress();
    }, 500));
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update Form Progress
function updateFormProgress() {
    const form = document.getElementById('thyroidForm');
    if (!form) return;
    
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    const filledInputs = Array.from(requiredInputs).filter(input => {
        if (input.type === 'checkbox') {
            return input.checked;
        }
        return input.value.trim() !== '';
    });
    
    const progress = (filledInputs.length / requiredInputs.length) * 100;
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    // Update steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (progress >= (index + 1) * 33) {
            step.classList.add('active');
        }
    });
}

// Update Results Preview
function updateResultsPreview() {
    const preview = document.getElementById('resultsPreview');
    if (!preview) return;
    
    // Show preview when form has some data
    const form = document.getElementById('thyroidForm');
    const hasData = Array.from(form.elements).some(element => {
        if (element.type === 'checkbox') {
            return element.checked;
        }
        return element.value.trim() !== '';
    });
    
    if (hasData && preview.classList.contains('hidden')) {
        preview.classList.remove('hidden');
    } else if (!hasData && !preview.classList.contains('hidden')) {
        preview.classList.add('hidden');
        return;
    }
    
    const formData = getFormData();
    if (!formData) return;
    
    // Calculate simple risk score for preview
    let riskScore = 0;
    
    // Age factor
    if (formData.Age > 50) riskScore += 20;
    else if (formData.Age > 30) riskScore += 10;
    
    // TSH factor
    if (formData.TSH_Level > 4 || formData.TSH_Level < 0.4) riskScore += 15;
    
    // Nodule size factor
    if (formData.Nodule_Size > 3) riskScore += 25;
    else if (formData.Nodule_Size > 1) riskScore += 10;
    
    // Risk factors count
    const riskFactors = [
        formData.Family_History,
        formData.Radiation_Exposure,
        formData.Iodine_Deficiency,
        formData.Smoking,
        formData.Obesity,
        formData.Diabetes
    ].filter(Boolean).length;
    
    riskScore += riskFactors * 5;
    
    // Cap at 100
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    // Update preview display
    const percentageElement = preview.querySelector('.risk-percentage');
    const circleElement = preview.querySelector('.circle-progress circle:last-child');
    
    if (percentageElement) {
        percentageElement.textContent = `${Math.round(riskScore)}%`;
    }
    
    if (circleElement) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (riskScore / 100) * circumference;
        circleElement.style.strokeDashoffset = offset;
        
        // Update color based on risk
        if (riskScore < 30) {
            circleElement.style.stroke = 'url(#gradient-secondary)';
        } else if (riskScore < 70) {
            circleElement.style.stroke = 'url(#gradient-primary)';
        } else {
            circleElement.style.stroke = 'url(#gradient-accent)';
        }
    }
}

// Setup Predict Event Listeners
function setupPredictEventListeners() {
    // Form submission
    const form = document.getElementById('thyroidForm');
    if (form) {
        form.addEventListener('submit', handlePredictionSubmit);
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Save report button
    const saveReportBtn = document.getElementById('saveReportBtn');
    if (saveReportBtn) {
        saveReportBtn.addEventListener('click', saveReport);
    }
    
    // New prediction button
    const newPredictionBtn = document.getElementById('newPredictionBtn');
    if (newPredictionBtn) {
        newPredictionBtn.addEventListener('click', startNewPrediction);
    }
}

// Set Default Values
function setDefaultValues() {
    // Set default values for form
    const defaults = {
        'Age': 45,
        'TSH_Level': 2.5,
        'T3_Level': 3.2,      // Fixed: Normal T3 range
        'T4_Level': 1.3,       // Fixed: Normal T4 range
        'Nodule_Size': 1.5,
        'Thyroid_Cancer_Risk': '1',  // String value for select (Moderate)
        'Gender_Male': '1.0'   // String value for select (Male)
    };
    
    Object.entries(defaults).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
            
            // Trigger input event for floating labels
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
        }
    });
    
    // Update progress after setting defaults
    setTimeout(() => {
        updateFormProgress();
        updateResultsPreview();
    }, 100);
}

// Get Form Data - FIXED for backend compatibility
function getFormData() {
    try {
        // Get all form values with correct data types
        const data = {
            Age: parseInt(document.getElementById('Age').value) || 0,
            TSH_Level: parseFloat(document.getElementById('TSH_Level').value) || 0,
            T3_Level: parseFloat(document.getElementById('T3_Level').value) || 0,
            T4_Level: parseFloat(document.getElementById('T4_Level').value) || 0,
            Nodule_Size: parseFloat(document.getElementById('Nodule_Size').value) || 0,
            Thyroid_Cancer_Risk: parseInt(document.getElementById('Thyroid_Cancer_Risk').value) || 0,
            Gender_Male: parseFloat(document.getElementById('Gender_Male').value) || 0.0,
            Family_History: document.getElementById('Family_History').checked ? 1 : 0,
            Radiation_Exposure: document.getElementById('Radiation_Exposure').checked ? 1 : 0,
            Iodine_Deficiency: document.getElementById('Iodine_Deficiency').checked ? 1 : 0,
            Smoking: document.getElementById('Smoking').checked ? 1 : 0,
            Obesity: document.getElementById('Obesity').checked ? 1 : 0,
            Diabetes: document.getElementById('Diabetes').checked ? 1 : 0
        };
        
        // Log data for debugging
        console.log('📊 Form Data prepared:', data);
        
        return data;
        
    } catch (error) {
        console.error('❌ Error in getFormData:', error);
        return null;
    }
}

// Validate Form
function validateForm() {
    const form = document.getElementById('thyroidForm');
    if (!form) {
        showErrorMessage('Form not found', 'Validation Error');
        return false;
    }
    
    let isValid = true;
    const errors = [];
    
    // Validate required fields
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        if (input.type === 'checkbox') {
            return;
        }
        
        if (!input.value || input.value.trim() === '') {
            isValid = false;
            input.closest('.input-group')?.classList.add('invalid');
            const label = input.previousElementSibling?.textContent || input.placeholder || 'Field';
            errors.push(`${label} is required`);
        }
    });
    
    // Validate Cancer Risk Score (must be 0,1,2)
    const cancerRisk = parseInt(document.getElementById('Thyroid_Cancer_Risk').value);
    if (isNaN(cancerRisk) || cancerRisk < 0 || cancerRisk > 2) {
        isValid = false;
        errors.push('Cancer Risk Score must be 0, 1, or 2');
    }
    
    // Validate number ranges
    const numberInputs = form.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        if (!validateNumberInput(input, false)) {
            isValid = false;
            input.closest('.input-group')?.classList.add('invalid');
        }
    });
    
    if (!isValid && errors.length > 0) {
        showErrorMessage(errors.join('<br>'), 'Validation Error');
    }
    
    return isValid;
}

// Handle Prediction Submit - FIXED
async function handlePredictionSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) {
        console.log('⚠️ Already submitting...');
        return;
    }
    
    console.log('🔄 Form submission started...');
    
    // Validate form
    if (!validateForm()) {
        console.log('❌ Form validation failed');
        return;
    }
    
    // Get form data
    currentFormData = getFormData();
    
    if (!currentFormData) {
        showErrorMessage('Unable to get form data. Please check all fields.', 'Data Error');
        return;
    }
    
    console.log('✅ Form data ready:', currentFormData);
    
    isSubmitting = true;
    
    // Show loading state
    const predictBtn = document.getElementById('predictBtn');
    const originalHTML = predictBtn.innerHTML;
    predictBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Analyzing with AI...
    `;
    predictBtn.disabled = true;
    
    try {
        // Make API request to backend
        const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`;
        console.log('📡 Sending request to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(currentFormData)
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Server error:', errorData);
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Prediction result:', result);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Display the results
        displayResults(result);
        
        // Save to localStorage for history
        saveToLocalStorage(result);
        
        // Show success message
        setTimeout(() => {
            showSuccessMessage(
                `Prediction Complete!<br><strong>${result.prediction}</strong><br>Risk: ${result.risk_percentage}% | Confidence: ${result.confidence}`, 
                'Analysis Complete'
            );
        }, 500);
        
    } catch (error) {
        console.error('❌ Prediction error:', error);
        
        // Use mock prediction as fallback
        showInfoMessage(
            `Backend error: ${error.message}<br>Using demo prediction mode.`,
            'Demo Mode'
        );
        
        const mockResult = generateMockPrediction(currentFormData);
        displayResults(mockResult);
        saveToLocalStorage(mockResult);
        
    } finally {
        // Reset loading state
        setTimeout(() => {
            predictBtn.innerHTML = originalHTML;
            predictBtn.disabled = false;
            isSubmitting = false;
        }, 1000);
    }
}

// Generate Mock Prediction (Fallback)
function generateMockPrediction(formData) {
    // Calculate risk score
    let riskScore = 0;
    
    if (formData.Age > 60) riskScore += 30;
    else if (formData.Age > 40) riskScore += 15;
    else if (formData.Age > 20) riskScore += 5;
    
    if (formData.TSH_Level > 4.0) riskScore += 25;
    else if (formData.TSH_Level < 0.4) riskScore += 20;
    else riskScore += 5;
    
    if (formData.Nodule_Size > 3) riskScore += 35;
    else if (formData.Nodule_Size > 1) riskScore += 20;
    else if (formData.Nodule_Size > 0) riskScore += 10;
    
    riskScore += formData.Thyroid_Cancer_Risk * 15;
    
    const riskFactors = [
        formData.Family_History,
        formData.Radiation_Exposure,
        formData.Iodine_Deficiency,
        formData.Smoking,
        formData.Obesity,
        formData.Diabetes
    ];
    riskScore += riskFactors.filter(Boolean).length * 8;
    
    if (formData.Gender_Male === 0) riskScore += 5;
    
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    let prediction = '';
    let confidence = '';
    
    if (riskScore >= 70) {
        prediction = 'Malignant';
        confidence = 'High';
    } else if (riskScore >= 40) {
        prediction = 'Benign';
        confidence = 'Moderate';
    } else {
        prediction = 'Benign';
        confidence = 'Low';
    }
    
    return {
        prediction: prediction,
        risk_percentage: riskScore,
        confidence: confidence,
        features_importance: {
            'Nodule Size': formData.Nodule_Size / 5,
            'TSH Level': Math.abs(formData.TSH_Level - 2.5) / 5,
            'Thyroid_Cancer_Risk': formData.Thyroid_Cancer_Risk / 3,
            'Age': formData.Age / 50,
            'Family History': formData.Family_History,
            'Radiation Exposure': formData.Radiation_Exposure
        },
        chart_data: null
    };
}

// Save to LocalStorage
function saveToLocalStorage(result) {
    try {
        const predictionData = {
            user_data: currentFormData,
            prediction: result.prediction,
            risk_percentage: result.risk_percentage,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('thyroscan_new_prediction', JSON.stringify(predictionData));
        
        const existingHistory = JSON.parse(localStorage.getItem('thyroscan_local_history') || '[]');
        existingHistory.unshift(predictionData);
        
        if (existingHistory.length > 50) {
            existingHistory.length = 50;
        }
        
        localStorage.setItem('thyroscan_local_history', JSON.stringify(existingHistory));
        console.log('✅ Prediction saved to localStorage');
        
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Display Results - FIXED with Plotly support
function displayResults(result) {
    console.log('🎯 Displaying results:', result);
    
    // Update risk percentage
    const riskPercentage = result.risk_percentage || 0;
    document.getElementById('riskPercentage').textContent = `${riskPercentage.toFixed(1)}%`;
    document.getElementById('predictionText').textContent = result.prediction === 'Malignant' ? 'High Risk of Thyroid Malignancy' : 'Low Risk of Thyroid Malignancy';
    document.getElementById('confidenceText').textContent = `Confidence: ${result.confidence || 'Medium'}`;
    
    // Update risk circle
    updateRiskCircle(riskPercentage);
    
    // Update meter fill
    const meterFill = document.getElementById('meterFill');
    if (meterFill) {
        meterFill.style.width = `${riskPercentage}%`;
        
        if (riskPercentage < 30) {
            meterFill.style.background = 'var(--gradient-secondary, #06d6a0)';
        } else if (riskPercentage < 70) {
            meterFill.style.background = 'var(--gradient-primary, #4361ee)';
        } else {
            meterFill.style.background = 'var(--gradient-accent, #ef476f)';
        }
    }
    
    // Handle chart display
    if (result.chart_data && window.Plotly) {
        try {
            const chartData = typeof result.chart_data === 'string' 
                ? JSON.parse(result.chart_data) 
                : result.chart_data;
            
            const chartContainer = document.getElementById('chartContainer');
            if (chartContainer) {
                chartContainer.innerHTML = '';
                Plotly.newPlot('chartContainer', chartData.data, chartData.layout, {
                    responsive: true,
                    displayModeBar: false
                });
                console.log('✅ Plotly chart rendered');
            }
        } catch (error) {
            console.error('Plotly error:', error);
            createFallbackChart(result.features_importance);
        }
    } else {
        createFallbackChart(result.features_importance);
    }
    
    // Display key factors
    displayKeyFactors(result.features_importance || {});
    
    // Display recommendations
    displayRecommendations([], riskPercentage);
    
    // Show modal
    setTimeout(() => {
        showResultsModal();
    }, 300);
}

// Update Risk Circle
function updateRiskCircle(percentage) {
    const circle = document.querySelector('.score-circle circle:last-child');
    if (!circle) return;
    
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    
    if (percentage < 30) {
        circle.style.stroke = 'url(#gradient-secondary)';
    } else if (percentage < 70) {
        circle.style.stroke = 'url(#gradient-primary)';
    } else {
        circle.style.stroke = 'url(#gradient-accent)';
    }
}

// Create Fallback Chart
function createFallbackChart(featuresImportance) {
    const container = document.getElementById('chartContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!window.Chart) {
        container.innerHTML = `
            <div class="chart-placeholder">
                <i class="fas fa-chart-bar"></i>
                <p>Feature importance visualization</p>
                <small>Chart library not loaded</small>
            </div>
        `;
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'featureChart';
    container.appendChild(canvas);
    
    if (window.predictionChart) {
        window.predictionChart.destroy();
    }
    
    let labels = [];
    let values = [];
    
    if (featuresImportance && Object.keys(featuresImportance).length > 0) {
        const sorted = Object.entries(featuresImportance)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
        
        labels = sorted.map(([key]) => key.replace(/_/g, ' '));
        values = sorted.map(([, value]) => value * 100);
    } else {
        labels = ['Nodule Size', 'TSH Level', 'T3 Level', 'T4 Level', 'Family History', 'Age'];
        values = [65, 45, 30, 28, 20, 15];
    }
    
    const ctx = canvas.getContext('2d');
    window.predictionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feature Importance (%)',
                data: values,
                backgroundColor: ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#06d6a0'],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Importance: ${ctx.raw.toFixed(1)}%`
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: 'Importance (%)' } },
                x: { ticks: { rotation: 45, autoSkip: true } }
            }
        }
    });
}

// Display Key Factors
function displayKeyFactors(factors) {
    const container = document.getElementById('factorsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    let factorsArray = [];
    
    if (factors && typeof factors === 'object' && Object.keys(factors).length > 0) {
        factorsArray = Object.entries(factors)
            .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value: parseFloat(value) || 0 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }
    
    if (factorsArray.length === 0) {
        container.innerHTML = '<div class="no-factors">No significant factors detected</div>';
        return;
    }
    
    const maxValue = Math.max(...factorsArray.map(f => f.value));
    
    factorsArray.forEach((factor, index) => {
        const percentage = maxValue > 0 ? (factor.value / maxValue) * 100 : 0;
        
        const factorElement = document.createElement('div');
        factorElement.className = 'factor-item';
        factorElement.style.animationDelay = `${index * 0.1}s`;
        factorElement.innerHTML = `
            <div class="factor-header">
                <h4>${factor.name}</h4>
                <span class="factor-value">${(factor.value * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-bar">
                <div class="factor-bar-fill" style="width: ${percentage}%; background: linear-gradient(90deg, #4361ee, #3a0ca3);"></div>
            </div>
            <div class="factor-impact">Impact: ${percentage.toFixed(1)}%</div>
        `;
        
        container.appendChild(factorElement);
    });
}

// Display Recommendations
function displayRecommendations(recommendations, riskPercentage) {
    const container = document.getElementById('recommendationsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!recommendations || recommendations.length === 0) {
        recommendations = generateRecommendations(riskPercentage);
    }
    
    recommendations.forEach((rec, index) => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        recElement.style.animationDelay = `${index * 0.1}s`;
        recElement.innerHTML = `
            <div class="recommendation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="recommendation-content">
                <p>${rec}</p>
            </div>
        `;
        
        container.appendChild(recElement);
    });
}

// Generate Recommendations
function generateRecommendations(riskPercentage) {
    if (riskPercentage >= 70) {
        return [
            'Consult an endocrinologist immediately',
            'Consider fine needle aspiration biopsy',
            'Regular monitoring every 3 months recommended',
            'Complete thyroid function tests required',
            'Ultrasound examination strongly advised'
        ];
    } else if (riskPercentage >= 40) {
        return [
            'Schedule appointment with endocrinologist',
            'Monitor thyroid levels every 6 months',
            'Maintain healthy iodine intake',
            'Regular ultrasound follow-up recommended',
            'Lifestyle modification advised'
        ];
    } else {
        return [
            'Regular annual checkup recommended',
            'Maintain healthy lifestyle',
            'Monitor for any symptom changes',
            'Balanced diet with proper iodine',
            'Regular exercise routine beneficial'
        ];
    }
}

// Show Results Modal
function showResultsModal() {
    const modal = document.getElementById('resultsModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    console.log('✅ Results modal shown');
}

// Close Results Modal
function closeResultsModal() {
    const modal = document.getElementById('resultsModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        console.log('✅ Results modal closed');
    }, 300);
}

// Save Report
function saveReport() {
    const riskPercentage = document.getElementById('riskPercentage').textContent;
    const prediction = document.getElementById('predictionText').textContent;
    const confidence = document.getElementById('confidenceText').textContent;
    
    const report = `
THYROID CANCER RISK ASSESSMENT REPORT
======================================
Date: ${new Date().toLocaleString()}
Prediction: ${prediction}
Risk Percentage: ${riskPercentage}
${confidence}

CLINICAL PARAMETERS:
-------------------
Age: ${currentFormData?.Age || 'N/A'} years
Gender: ${currentFormData?.Gender_Male === 1 ? 'Male' : 'Female'}
TSH Level: ${currentFormData?.TSH_Level || 'N/A'} mIU/L
T3 Level: ${currentFormData?.T3_Level || 'N/A'} pg/mL
T4 Level: ${currentFormData?.T4_Level || 'N/A'} μg/dL
Nodule Size: ${currentFormData?.Nodule_Size || 'N/A'} cm
Cancer Risk Score: ${currentFormData?.Thyroid_Cancer_Risk || 'N/A'}

RISK FACTORS:
-------------
${getRiskFactorsText()}

RECOMMENDATIONS:
---------------
${Array.from(document.querySelectorAll('.recommendation-content p'))
    .map(p => `• ${p.textContent}`)
    .join('\n')}

DISCLAIMER:
----------
This report is generated by ThyroAssess AI for educational purposes only.
Not a substitute for professional medical diagnosis.

Generated by ThyroAssess AI
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThyroAssess_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Report downloaded successfully!', 'Report Saved');
}

// Get Risk Factors Text
function getRiskFactorsText() {
    const riskFactors = [
        { id: 'Family_History', label: 'Family History of Thyroid Disease' },
        { id: 'Radiation_Exposure', label: 'Radiation Exposure' },
        { id: 'Iodine_Deficiency', label: 'Iodine Deficiency' },
        { id: 'Smoking', label: 'Smoking History' },
        { id: 'Obesity', label: 'Obesity (BMI ≥ 30)' },
        { id: 'Diabetes', label: 'Diabetes Mellitus' }
    ];
    
    const activeFactors = riskFactors
        .filter(factor => currentFormData?.[factor.id] === 1)
        .map(factor => `✓ ${factor.label}`);
    
    return activeFactors.length > 0 ? activeFactors.join('\n') : 'No significant risk factors detected';
}

// Reset Form
function resetForm() {
    const form = document.getElementById('thyroidForm');
    if (!form) return;
    
    form.reset();
    
    const inputGroups = form.querySelectorAll('.input-group');
    inputGroups.forEach(group => {
        group.classList.remove('valid', 'invalid', 'has-value', 'focused');
    });
    
    const checkboxCards = form.querySelectorAll('.risk-factor-card');
    checkboxCards.forEach(card => {
        card.classList.remove('checked');
    });
    
    const rangeBars = form.querySelectorAll('.range-fill');
    rangeBars.forEach(bar => {
        bar.style.width = '0%';
    });
    
    updateFormProgress();
    
    const preview = document.getElementById('resultsPreview');
    if (preview) {
        preview.classList.add('hidden');
    }
    
    setDefaultValues();
    
    showSuccessMessage('Form has been reset to default values', 'Form Reset');
}

// Start New Prediction
function startNewPrediction() {
    closeResultsModal();
    resetForm();
    
    setTimeout(() => {
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400);
    
    showInfoMessage('Ready for new prediction. Fill the form above.', 'New Analysis');
}

// Notification Functions
function showSuccessMessage(message, title = 'Success') {
    createNotification(message, title, 'success');
}

function showErrorMessage(message, title = 'Error') {
    createNotification(message, title, 'error');
}

function showInfoMessage(message, title = 'Info') {
    createNotification(message, title, 'info');
}

function createNotification(message, title, type) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' :
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <div class="notification-icon"><i class="fas fa-${icon}"></i></div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 5000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - Initializing Predict Page');
    
    if (document.getElementById('thyroidForm') || document.getElementById('predictBtn')) {
        setTimeout(() => {
            initializePredictPage();
        }, 100);
    }
});

// Export for debugging
window.ThyroAssessPredict = {
    initializePredictPage,
    getFormData,
    validateForm,
    displayResults,
    handlePredictionSubmit
};