// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const btn = document.querySelector('.mobile-menu-btn');
    
    nav.classList.toggle('active');
    btn.classList.toggle('active');
}

// Form Submission Handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validation
    const requiredFields = ['nome', 'email', 'telefone', 'empresa', 'servico'];
    const aceiteTermos = document.getElementById('aceito-termos').checked;
    
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            isValid = false;
            errorMessage += `O campo ${getFieldLabel(field)} é obrigatório.\n`;
        }
    });
    
    // Check email format
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        isValid = false;
        errorMessage += 'Por favor, insira um e-mail válido.\n';
    }
    
    // Check phone format (Brazilian)
    const telefone = formData.get('telefone');
    const phoneRegex = /^(\+55\s?)?\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/;
    if (telefone && !phoneRegex.test(telefone.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage += 'Por favor, insira um telefone válido.\n';
    }
    
    // Check terms acceptance
    if (!aceiteTermos) {
        isValid = false;
        errorMessage += 'Você deve aceitar os Termos de Uso e Política de Privacidade.\n';
    }
    
    if (!isValid) {
        alert('Erro no formulário:\n\n' + errorMessage);
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        alert('Obrigado! Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato em até 24 horas para agendar sua consultoria executiva.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Track conversion for Meta/Facebook Pixel (if implemented)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Consultoria Executiva',
                content_category: 'Marketing Digital',
                value: 1000,
                currency: 'BRL'
            });
        }
        
        // Track conversion for Google Analytics (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'value': 1000,
                'currency': 'BRL'
            });
        }
    }, 2000);
}

function getFieldLabel(fieldName) {
    const labels = {
        'nome': 'Nome Completo',
        'email': 'E-mail Corporativo',
        'telefone': 'Telefone',
        'empresa': 'Empresa',
        'servico': 'Serviço de Interesse'
    };
    return labels[fieldName] || fieldName;
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .blog-card, .portfolio-card, .value-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const isMillion = target.includes('M');
    
    let numericValue = parseInt(target.replace(/[^\d]/g, ''));
    let current = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isMillion) displayValue += 'M';
        if (isPlus) displayValue += '+';
        if (isPercentage) displayValue += '%';
        
        element.textContent = displayValue;
    }, 30);
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = '0 4px 32px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = 'none';
    }
});

// Form field validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    clearFieldError(field);
    
    if (isRequired && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, insira um e-mail válido');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+55\s?)?\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Por favor, insira um telefone válido');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ff4444';
    
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ff4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '8px';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = '#333333';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        const speed = scrolled * 0.5;
        heroImage.style.transform = `translateY(${speed}px) scale(1.02)`;
    }
});

// Add premium loading animation
function addPremiumLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        .premium-loading {
            position: relative;
            overflow: hidden;
        }
        
        .premium-loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
            animation: premiumLoading 2s infinite;
        }
        
        @keyframes premiumLoading {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize premium animations
document.addEventListener('DOMContentLoaded', addPremiumLoadingAnimation);