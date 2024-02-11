document.getElementById("grade-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Form gönderimini önle

    var examCount = parseInt(document.getElementById("exam-count").value);
    var totalGrade = 0;

    // Notları topla
    for (var i = 0; i < examCount; i++) {
        var not = parseFloat(document.getElementById("not" + (i + 1)).value);
        var yuzde = parseFloat(document.getElementById("yuzde" + (i + 1)).value);

        // Notun geçerli olup olmadığını kontrol et
        if (isNaN(not) || not < 0 || not > 100) {
            var sonuc = document.getElementById("sonuc");
            sonuc.innerHTML = "Geçerli notlar girin (0-100 arasında).";
            return;
        }

        // Yüzdenin geçerli olup olmadığını kontrol et
        if (isNaN(yuzde) || yuzde <= 0 || yuzde > 100) {
            var sonuc = document.getElementById("sonuc");
            sonuc.innerHTML = "Geçerli yüzde değerleri girin (0-100 arasında).";
            return;
        }

        totalGrade += (not * yuzde / 100); // Yüzdeli notları topla
    }

    // Ortalama notu görüntüle
    var sonuc = document.getElementById("sonuc");
    sonuc.innerHTML = "Ortalama: " + totalGrade.toFixed(2); // Ortalamanın 2 ondalık basamakla gösterilmesi
});

// Not sayısına göre not alanlarını oluştur
document.getElementById("exam-count").addEventListener("input", function() {
    var examCount = parseInt(this.value);
    var notlarDiv = document.getElementById("exam-fields");
    notlarDiv.innerHTML = ""; // Önceki not alanlarını temizle

    for (var i = 0; i < examCount; i++) {
        var notInput = document.createElement("input");
        notInput.type = "number";
        notInput.id = "not" + (i + 1);
        notInput.name = "not" + (i + 1);
        notInput.placeholder = "Not " + (i + 1);
        notInput.step = "any";
        notInput.required = true;

        var yuzdeInput = document.createElement("input");
        yuzdeInput.type = "number";
        yuzdeInput.id = "yuzde" + (i + 1);
        yuzdeInput.name = "yuzde" + (i + 1);
        yuzdeInput.placeholder = "Yüzde " + (i + 1);
        yuzdeInput.step = "any";
        yuzdeInput.min = "0";
        yuzdeInput.max = "100";
        yuzdeInput.required = true;

        var br = document.createElement("br");

        notlarDiv.appendChild(notInput);
        notlarDiv.appendChild(yuzdeInput);
        notlarDiv.appendChild(br);
    }
});
