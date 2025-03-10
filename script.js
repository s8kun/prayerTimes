const tableArray = document.querySelectorAll(".table-array");  
const prayerArray = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

fetch('http://ip-api.com/json/')
  .then(response => response.json())
  .then(data => {
    let city = data.city;
    let country = data.countryCode;
    let lat = data.lat; 
    let lon = data.lon;
    
    document.getElementById("city").innerHTML = `${city}, ${country}`;

    // جلب أوقات الصلاة
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
      .then(response => response.json())
      .then(dataTime => {
        if (dataTime.data && dataTime.data.timings) {
          let timings = dataTime.data.timings;

          // تحديث الجدول بأوقات الصلاة
          prayerArray.forEach((prayer, index) => {
            if (tableArray[index]) {
              let prayerTime = timings[prayer]; // الوقت بصيغة HH:MM
              let [hour, minute] = prayerTime.split(":").map(num => parseInt(num)); // تحويل الوقت إلى أرقام

              let period = "AM";
              if (hour >= 12) {
                period = "PM";
                if (hour > 12) hour -= 12; // تحويل 24 ساعة إلى 12 ساعة
              } else if (hour === 0) {
                hour = 12; // تحويل منتصف الليل إلى 12 AM
              }

              tableArray[index].innerText = `${hour}:${minute.toString().padStart(2, "0")} ${period}`;  
            }
          });
        } else {
          console.error("Invalid response from Aladhan API", dataTime);
        }
      })
      .catch(error => console.error("Error fetching prayer times:", error));
  })
  .catch(error => console.error("Error fetching location data:", error));
