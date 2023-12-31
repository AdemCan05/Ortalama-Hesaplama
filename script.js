function hesapla() {
    var vize = parseFloat(document.getElementsByName("vize")[0].value);
    var final = parseFloat(document.getElementsByName("finalbüt")[0].value);

    // Geçerli not aralığını kontrol et
    if (isNaN(vize) || isNaN(final) || vize < 0 || vize > 100 || final < 0 || final > 100) {
        // Notlar geçerli değilse veya aralık dışındaysa hata mesajı göster
        var sonuc = document.getElementById("sonuc");
        sonuc.innerHTML = "Geçerli notlar girin (0-100 arasında).";
        return;
    }

    // Ara sınavın %40, yarıyıl sonu sınavının %60 ağırlığı ile hesaplanması
    var ortalama = (vize * 0.4) + (final * 0.6);

    var sonuc = document.getElementById("sonuc");

    // Ortalamaya göre notlar ve başarı durumu
    if (ortalama >= 90) {
        sonuc.innerHTML = "Ortalama: AA<br>Notunuz: Başarılı";
    } else if (ortalama >= 80) {
        sonuc.innerHTML = "Ortalama: BA<br>Notunuz: Başarılı";
    } else if (ortalama >= 70) {
        sonuc.innerHTML = "Ortalama: BB<br>Notunuz: Başarılı";
    } else if (ortalama >= 60) {
        sonuc.innerHTML = "Ortalama: CB<br>Notunuz: Başarılı";
    } else if (ortalama >= 50) {
        sonuc.innerHTML = "Ortalama: CC<br>Notunuz: Başarılı";
    } else if (ortalama >= 40) {
        sonuc.innerHTML = "Ortalama: DC<br>Notunuz: Başarısız";
    } else {
        sonuc.innerHTML = "Ortalama: FF<br>Notunuz: Başarısız";
    }
}

document.getElementById("grade-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Form gönderimini engelle
    hesapla(); // Hesapla fonksiyonunu çağır
});
