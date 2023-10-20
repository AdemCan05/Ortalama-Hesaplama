# Ortalama Hesaplama

I first used html to create my page, then I used javascript to make my site function, and finally I used css to adjust its appearance.

## The purpose of the web page I created
The purpose of my site is to indicate that the school where I study is successful or unsuccessful according to the scores we receive as a result of the exams as a letter grade and as a result of the exam.

## How do I calculate the average
I added a js code that shows whether the grades I use to calculate the average are valid or not, should be a number between 0 and 100, and how much the midterm and final grades affect the average.

```
javascript
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
```
### Calculation of letter grade and success status according to the average

Here we are using an if else if loop via javascript to get output according to the state of the average.

```
javascript
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
```

## Networks
[LinkedIn Adem Can Demirci](https://www.linkedin.com/in/adem-can-demirci-100acd100/)
