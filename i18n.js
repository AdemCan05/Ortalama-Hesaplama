window.i18n = {
    tr: {
        // Navigation
        "nav-calc": "Hesaplayıcı",
        "nav-table": "Not Tablosu",
        "nav-about": "Geliştirici",
        "nav-faq": "S.S.S.",

        // Hero
        "hero-title": "İSTE Çan Sistemi Hesaplayıcı",
        "hero-subtitle": "İskenderun Teknik Üniversitesi not sistemine göre ağırlıklı ortalamanızı hesaplayın, harf notunuzu tahmin edin ve sınıftaki konumunuzu analiz edin.",
        
        // Tabs
        "tab-avg": "Ortalama Hesapla",
        "tab-sim": "Çan Sistemi Simülasyonu",

        // Average Calculator
        "calc-title": "Ağırlıklı Ortalama Hesaplayıcı",
        "calc-desc": "Sınav notlarınızı girin (0-100)",
        "lbl-midterm": "Vize Notu (%40)",
        "lbl-final": "Final Notu (%60)",
        "lbl-optional": "Ödev/Kısa Sınav (İsteğe Bağlı)",
        "btn-calculate": "Hesapla",
        "err-valid": "Lütfen 0 ile 100 arasında geçerli notlar giriniz.",
        
        "res-title": "Sonuçlarınız",
        "res-avg": "Ortalama",
        "status-success": "Başarılı",
        "status-fail": "Başarısız",
        "status-ff-rule": "Otomatik FF (Kural Nedeniyle)",

        // Bell Curve Simulator
        "curve-title": "Çan Sistemi Simülasyonu",
        "curve-desc": "Sınıf verilerini girerek T-Skoru ve tahmini harf notunuzu görün",
        "lbl-student-avg": "Öğrenci Ortalaması",
        "lbl-class-avg": "Sınıf Ortalaması",
        "lbl-std-dev": "Standart Sapma",
        "btn-sim-calc": "Simülasyonu Çalıştır",
        "err-sim-valid": "Lütfen geçerli değerler giriniz. Standart sapma sıfırdan büyük olmalıdır.",

        "curve-res-title": "Çan Analizi",
        "res-z-score": "Z-Skoru",
        "res-t-score": "T-Skoru",
        "res-est-grade": "Tahmini Harf Notu",

        "vis-title": "Çan Eğrisi Görselleştirmesi",
        "vis-desc": "Sınıftaki konumunuz",
        "btn-export-pdf": "PDF İndir",
        "chart-title": "Not Dağılımı (Çan Eğrisi)",
        "chart-your-score": "Sizin Notunuz",

        // Official Info
        "info-title": "Resmi İSTE Notlandırma Bilgisi",
        "important-notice": "ÖNEMLİ BİLGİ",
        "ff-rule-text": "İSTE yönetmeliğine göre: Ağırlıklı ortalaması 30'un altında olan VEYA Final sınavı 30'un altında olan öğrenciler otomatik olarak FF alır.",
        "tbl-range": "Puan Aralığı",
        "tbl-grade": "Harf Notu",
        "tbl-coeff": "Katsayı",

        // Developer Section
        "dev-title": "Geliştirici Hakkında",
        "dev-name": "Adem Can Demirci",
        "dev-role": "Bilgisayar Mühendisliği Öğrencisi",
        "dev-interests": "İlgi Alanları:",
        "dev-ai": "Yapay Zeka",
        "dev-ds": "Veri Bilimi",
        "dev-se": "Yazılım Geliştirme",
        "dev-cyber": "Siber Güvenlik",

        // FAQ
        "faq-title": "Sıkça Sorulan Sorular",
        "q1": "Ağırlıklı ortalama nasıl hesaplanır?",
        "a1": "Varsayılan olarak Vize sınavının %40'ı ve Final sınavının %60'ı alınarak toplanır.",
        "q2": "Çan eğrisi sistemi nedir?",
        "a2": "Öğrencilerin notlarının sınıfın genel başarısına (sınıf ortalaması ve standart sapma) göre değerlendirildiği bağıl not sistemidir.",
        "q3": "T-Skoru nasıl hesaplanır?",
        "a3": "Önce Z-Skoru bulunur: Z = (Notunuz - Sınıf Ortalaması) / Standart Sapma. Ardından T-Skoru hesaplanır: T = 60 + (10 × Z).",
        "q4": "Final sınavından 30'un altında alırsam ne olur?",
        "a4": "İSTE yönetmeliğine göre final sınavından 30'un altında alan veya genel ortalaması 30'un altında olan öğrenciler doğrudan FF harf notu ile başarısız sayılırlar.",
        "q5": "İSTE'de bağıl değerlendirme (çan) nasıl çalışır?",
        "a5": "Sınıf mevcudu ve ortalamasına bağlı olarak sistem mutlak veya bağıl değerlendirme (çan eğrisi) uygulayabilir."
    },
    en: {
        // Navigation
        "nav-calc": "Calculator",
        "nav-table": "Grade Table",
        "nav-about": "Developer",
        "nav-faq": "FAQ",

        // Hero
        "hero-title": "İSTE Bell Curve Calculator",
        "hero-subtitle": "Calculate your weighted average, estimate your letter grade and analyze your position in the class according to the İSTE grading system.",
        
        // Tabs
        "tab-avg": "Calculate Average",
        "tab-sim": "Bell Curve Simulation",

        // Average Calculator
        "calc-title": "Weighted Average Calculator",
        "calc-desc": "Enter your exam scores (0-100)",
        "lbl-midterm": "Midterm Score (40%)",
        "lbl-final": "Final Score (60%)",
        "lbl-optional": "Assignments/Quiz (Optional)",
        "btn-calculate": "Calculate",
        "err-valid": "Please enter valid scores between 0 and 100.",
        
        "res-title": "Your Results",
        "res-avg": "Average",
        "status-success": "Successful",
        "status-fail": "Failed",
        "status-ff-rule": "Automatic FF (Rule Enforced)",

        // Bell Curve Simulator
        "curve-title": "Bell Curve Simulation",
        "curve-desc": "Enter class data to see your T-Score and estimated letter grade",
        "lbl-student-avg": "Student Average",
        "lbl-class-avg": "Class Average",
        "lbl-std-dev": "Standard Deviation",
        "btn-sim-calc": "Run Simulation",
        "err-sim-valid": "Please enter valid values. Standard deviation must be greater than zero.",

        "curve-res-title": "Curve Analysis",
        "res-z-score": "Z-Score",
        "res-t-score": "T-Score",
        "res-est-grade": "Estimated Grade",

        "vis-title": "Bell Curve Visualization",
        "vis-desc": "Your position in the class",
        "btn-export-pdf": "Export PDF",
        "chart-title": "Score Distribution (Bell Curve)",
        "chart-your-score": "Your Score",

        // Official Info
        "info-title": "Official İSTE Grading Information",
        "important-notice": "IMPORTANT NOTICE",
        "ff-rule-text": "According to İSTE regulations: Students with a weighted average below 30 OR a final exam score below 30 automatically receive an FF.",
        "tbl-range": "Score Range",
        "tbl-grade": "Letter Grade",
        "tbl-coeff": "Coefficient",

        // Developer Section
        "dev-title": "About the Developer",
        "dev-name": "Adem Can Demirci",
        "dev-role": "Computer Engineering Student",
        "dev-interests": "Interests:",
        "dev-ai": "Artificial Intelligence",
        "dev-ds": "Data Science",
        "dev-se": "Software Engineering",
        "dev-cyber": "Cyber Security",

        // FAQ
        "faq-title": "Frequently Asked Questions",
        "q1": "How is the weighted average calculated?",
        "a1": "By default, 40% of the Midterm score and 60% of the Final score are summed.",
        "q2": "What is the bell curve system?",
        "a2": "A relative grading system where student grades are evaluated based on the overall performance of the class (class average and standard deviation).",
        "q3": "How is the T-Score calculated?",
        "a3": "First, the Z-Score is found: Z = (Your Score - Class Average) / Standard Deviation. Then the T-Score is calculated: T = 60 + (10 × Z).",
        "q4": "What happens if I score below 30 on the final exam?",
        "a4": "According to İSTE regulations, students who score below 30 on the final exam or whose overall average is below 30 directly fail with an FF letter grade.",
        "q5": "How does relative grading work at İSTE?",
        "a5": "Depending on the class size and average, the system may apply absolute or relative grading (bell curve)."
    }
};
